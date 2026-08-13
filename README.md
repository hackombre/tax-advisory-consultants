# Tax Advisory Consultants

Site web du cabinet — projet séparé en deux parties :

```
Tax Advisory Consultant/
├── front/     → Next.js 15 (le site public)
└── back/      → FastAPI (l'API qui envoie les e-mails du formulaire de contact)
```

## Démarrage rapide

### 1. Backend (à lancer en premier)

```bash
cd back
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# → remplis .env avec tes identifiants Gmail (voir back/README.md, section complète)
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd front
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Ouvre `http://localhost:3000`. Le formulaire de contact envoie maintenant un vrai e-mail via
le backend FastAPI (voir `back/README.md` pour la configuration Gmail complète, étape par étape).
