# Tax Advisory Consultants — Backend (FastAPI)

API qui reçoit les soumissions du formulaire de contact du site et envoie un **vrai e-mail**
(via le SMTP de Gmail) à l'adresse du cabinet.

## Installation

```bash
cd back
python3 -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Puis remplis `.env` avec les vraies valeurs (voir section "Configurer Gmail" ci-dessous).

## Lancer le serveur

```bash
uvicorn app.main:app --reload --port 8000
```

L'API est disponible sur `http://localhost:8000`. Test rapide :

```bash
curl http://localhost:8000/api/health
```

Documentation interactive auto-générée : `http://localhost:8000/docs`

---

## Configurer Gmail pour l'envoi SMTP réel — étapes obligatoires

Gmail **n'accepte plus** qu'une application externe se connecte avec le mot de passe normal
du compte. Il faut activer la validation en 2 étapes puis générer un **mot de passe
d'application** dédié. Voici la marche à suivre complète :

### 1. Choisir/créer l'adresse Gmail d'envoi
Utilise une adresse Gmail dédiée au site (ex: `contact@gmail.com` ou une adresse Google
Workspace sur ton propre domaine, ex: `contact@taxadvisoryconsultants.com` si le domaine est
géré via Google Workspace). C'est cette adresse qui figurera dans `SMTP_USER`.

### 2. Activer la validation en 2 étapes (obligatoire pour générer un mot de passe d'application)
1. Va sur **https://myaccount.google.com/security**
2. Section **"Comment vous vous connectez à Google"** → clique sur **"Validation en 2 étapes"**
3. Suis la procédure (numéro de téléphone + code SMS) jusqu'à activation complète

### 3. Générer un mot de passe d'application
1. Toujours sur **https://myaccount.google.com/security**
2. Cherche **"Mots de passe des applications"** (visible seulement après l'étape 2 ;
   accès direct : **https://myaccount.google.com/apppasswords**)
3. Dans "Sélectionner l'application", choisis **"Autre (nom personnalisé)"**, tape par exemple
   `Tax Advisory Consultants - Site web`
4. Clique sur **Générer** → Google affiche un mot de passe de **16 caractères** (ex: `abcd efgh ijkl mnop`)
5. Copie ce mot de passe (sans les espaces) et colle-le dans `.env` → `SMTP_PASSWORD`
   **⚠️ Ce mot de passe ne s'affiche qu'une seule fois — note-le tout de suite.**

### 4. Remplir le `.env`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@gmail.com          # l'adresse Gmail de l'étape 1
SMTP_PASSWORD=abcdefghijklmnop        # le mot de passe d'application (sans espaces)
CONTACT_RECIPIENT=contact@gmail.com   # qui reçoit les messages (peut être la même adresse)
CORS_ORIGINS=http://localhost:3000,https://taxadvisoryconsultants.com
```

### 5. Tester

```bash
uvicorn app.main:app --reload --port 8000
```

Puis depuis un autre terminal :

```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Jean","nom":"Test","telephone":"690000000","email":"jean@test.com","message":"Ceci est un test."}'
```

Si tout est correctement configuré, un e-mail arrive dans la boîte `CONTACT_RECIPIENT` en
quelques secondes, avec "Répondre à" pré-rempli avec l'adresse du visiteur.

### Points d'attention en production

- **Ne commite jamais** le fichier `.env` réel (déjà exclu via `.gitignore`).
- Si tu déploies sur une plateforme comme **Railway, Render, Fly.io** : renseigne les mêmes
  variables (`SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_RECIPIENT`, `CORS_ORIGINS`) dans les
  "Environment Variables" du service — jamais dans le code.
- Certaines plateformes cloud **bloquent le port SMTP sortant (587/465)** sur leurs plans
  gratuits (c'est le cas de Railway par exemple). Si l'envoi échoue en production alors qu'il
  fonctionne en local, c'est probablement ça : il faut soit passer sur un plan payant qui
  autorise le SMTP sortant, soit utiliser une API transactionnelle HTTP comme **Resend**,
  **SendGrid** ou **Mailgun** à la place du SMTP direct (structure du code très proche,
  seul `mailer.py` change).
- Mets à jour `CORS_ORIGINS` avec le vrai domaine de production une fois le site en ligne,
  sinon le navigateur bloquera les requêtes du front vers l'API.
