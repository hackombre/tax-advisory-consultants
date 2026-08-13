@echo off
cd /d "%~dp0"

if not exist "venv" (
  echo Creation de l'environnement virtuel...
  python -m venv venv
)

call venv\Scripts\activate.bat
pip install -q -r requirements.txt

if not exist ".env" (
  copy .env.example .env
  echo ATTENTION : remplis back\.env avec tes identifiants Gmail.
)

echo Demarrage sur http://localhost:8000 ...
uvicorn app.main:app --reload --port 8000