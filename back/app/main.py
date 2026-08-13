import logging

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

from app.config import settings
from app.mailer import send_contact_email, send_security_alert

logger = logging.getLogger("contact")

app = FastAPI(title="Tax Advisory Consultants - API")

# En développement : autorise le front local (localhost:3000).
# En production : remplace par le(s) vrai(s) domaine(s) du site.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


class ContactPayload(BaseModel):
    prenom: str = Field(..., min_length=1, max_length=100)
    nom: str = Field("", max_length=100)
    telephone: str = Field(..., min_length=1, max_length=30)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=5000)


class SecurityAlertPayload(BaseModel):
    ip: str = Field(..., min_length=1, max_length=100)
    attempts: int = Field(..., ge=1, le=1000)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/contact")
def contact(payload: ContactPayload):
    try:
        send_contact_email(
            prenom=payload.prenom,
            nom=payload.nom,
            telephone=payload.telephone,
            email=payload.email,
            message=payload.message,
        )
    except Exception as exc:  # noqa: BLE001
        logger.error("Échec d'envoi du mail de contact: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=502,
            detail="L'envoi de l'e-mail a échoué. Réessayez plus tard.",
        ) from exc

    return {"success": True, "message": "Votre message a bien été envoyé."}


@app.post("/api/security-alert")
def security_alert(
    payload: SecurityAlertPayload,
    x_internal_secret: str = Header(default=""),
):
    if x_internal_secret != settings.internal_api_secret:
        raise HTTPException(status_code=403, detail="Non autorisé.")

    try:
        send_security_alert(ip=payload.ip, attempts=payload.attempts)
    except Exception as exc:  # noqa: BLE001
        logger.error("Échec d'envoi de l'alerte de sécurité: %s", exc, exc_info=True)
        raise HTTPException(status_code=502, detail="L'envoi de l'alerte a échoué.") from exc

    return {"success": True}
