# Lanterne API

Lanterne est une API REST Express qui référence des curiosités locales : lieux discrets, détails architecturaux et petites histoires de quartier.

## Pré-requis

- Node.js 20 ou supérieur
- pnpm 11 ou npm compatible

## Installation et lancement local

```text
pnpm install
pnpm run check
pnpm test
pnpm start
```

L’API est disponible sur `http://localhost:3000`.

## Routes principales

- `GET /api/health`
- `GET /api/curiosities`
- `GET /api/curiosities?q=canal&limit=5`
- `GET /api/curiosities/:slug`

Le déploiement cible Vercel. Les variables d’environnement sont listées dans `.env.example`. Aucune donnée sensible ne doit être ajoutée au dépôt.
