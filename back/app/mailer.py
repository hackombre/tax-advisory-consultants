import logging
import smtplib
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger("mailer")


def normalize_smtp_password(password: str) -> str:
    return "".join(password.split())


def send_contact_email(prenom: str, nom: str, telephone: str, email: str, message: str) -> None:
    """
    Envoie un e-mail réel via le serveur SMTP de Gmail (STARTTLS, port 587).

    Nécessite dans .env :
      SMTP_USER=votre-adresse@gmail.com
      SMTP_PASSWORD=mot-de-passe-application-16-caracteres
      CONTACT_RECIPIENT=adresse-qui-recoit-les-messages@gmail.com
    """
    full_name = f"{prenom} {nom}".strip()

    msg = EmailMessage()
    msg["Subject"] = f"Nouveau message de {full_name} depuis le formulaire de contact du site Tax Advisory Consultants"
    msg["From"] = settings.smtp_user
    msg["To"] = settings.contact_recipient
    # Permet de répondre directement au visiteur depuis Gmail (bouton "Répondre")
    msg["Reply-To"] = email

    msg.set_content(
        f"""Nouveau message reçu depuis le formulaire de contact du site Tax Advisory Consultants.

Prénom      : {prenom}
Nom         : {nom or "-"}
Téléphone   : {telephone}
E-mail      : {email}

Message :
{message}
"""
    )

    password = normalize_smtp_password(settings.smtp_password)

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            server.starttls()  # sécurise la connexion avant l'authentification
            server.login(settings.smtp_user, password)
            server.send_message(msg)
    except smtplib.SMTPAuthenticationError as exc:
        # Mauvais mot de passe d'application, ou compte non compatible avec ce serveur SMTP
        # (ex: adresse @taxadvisoryconsultants.com qui n'est pas un vrai compte Google Workspace).
        logger.error("Échec d'authentification SMTP pour %s: %s", settings.smtp_user, exc)
        raise
    except (smtplib.SMTPException, TimeoutError, ConnectionRefusedError, OSError) as exc:
        # Port SMTP bloqué par l'hébergeur (ex: Railway, Render sur plan gratuit),
        # ou host/port incorrects dans le .env.
        logger.error(
            "Échec de connexion SMTP (%s:%s): %s", settings.smtp_host, settings.smtp_port, exc
        )
        raise


def send_security_alert(ip: str, attempts: int) -> None:
    """
    Envoie une alerte par e-mail lorsque l'accès à l'espace de gestion du site
    (page cachée Ctrl+H) est bloqué après plusieurs tentatives de connexion échouées.
    """
    recipient = settings.security_recipient or settings.contact_recipient

    msg = EmailMessage()
    msg["Subject"] = "Alerte sécurité — Tax Advisory Consultants"
    msg["From"] = settings.smtp_user
    msg["To"] = recipient

    msg.set_content(
        f"""{attempts} tentatives de connexion incorrectes ont été détectées sur l'espace
de gestion du site (accès caché Ctrl+H), depuis l'adresse IP : {ip}.

L'accès a été bloqué pendant 5 minutes par mesure de sécurité.

Si vous n'êtes pas à l'origine de ces tentatives, changez l'identifiant et le
mot de passe de connexion dès que possible.
"""
    )

    password = normalize_smtp_password(settings.smtp_password)

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
        server.starttls()
        server.login(settings.smtp_user, password)
        server.send_message(msg)
