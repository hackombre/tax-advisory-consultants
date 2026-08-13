@echo off
cd /d "%~dp0"

if not exist "node_modules" npm install
if not exist ".env.local" copy .env.local.example .env.local

echo Demarrage sur http://localhost:3000 ...
npm run dev