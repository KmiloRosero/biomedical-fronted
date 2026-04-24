# Sistema de Gestión de Residuos Biomédicos (Frontend)

Frontend desarrollado con React 18 + TypeScript (estricto) + Vite + TailwindCSS + Zustand + Framer Motion.

Reglas del proyecto:
- Código (identificadores) en inglés.
- UI (textos) en español.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run check`

## Variables de entorno

El cliente HTTP usa `VITE_API_BASE_URL`.

- Local: por defecto usa `http://localhost:8080` si no se define.
- Producción (Vercel): define `VITE_API_BASE_URL` con el dominio completo, por ejemplo `https://biomedical-waste-platform-production.up.railway.app`.

## Admin API Key

Los endpoints `/api/admin/*` requieren `X-Admin-Key`.
Puedes configurarla en la app en `Configuración` (`/app/settings`).
