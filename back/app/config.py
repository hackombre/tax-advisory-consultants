from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- SMTP (envoi d'e-mail) ---
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str  # ex: contact@taxadvisoryconsultants.com (adresse Gmail complète)
    smtp_password: str  # mot de passe d'application Gmail (PAS le mot de passe du compte)

    # Adresse qui reçoit les messages du formulaire (peut être identique à smtp_user)
    contact_recipient: str

    # Adresse qui reçoit les alertes de sécurité (tentatives de connexion bloquées).
    # Si non définie, on retombe sur contact_recipient.
    security_recipient: str | None = None

    # Secret partagé attendu dans l'en-tête X-Internal-Secret pour appeler
    # /api/security-alert depuis le site Next.js (évite les appels publics abusifs).
    internal_api_secret: str = "changeme"

    # --- CORS ---
    # Domaines autorisés à appeler l'API, séparés par une virgule dans .env
    # ex: http://localhost:3000,https://taxadvisoryconsultants.com
    cors_origins: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
