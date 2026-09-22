# Veille technique — CP8_lanterne

## Sujet : fin de support de Node.js 20 sur Vercel

### Sources

1. **Vercel Changelog** (source officielle) — *"Node.js 20 is being deprecated on October 1, 2026"*
   https://vercel.com/changelog/node-js-20-is-being-deprecated
   Date de consultation : 22 septembre 2026

2. **Dépôt officiel `nodejs/release`** (source officielle, projet Node.js) — tableau des dates de fin de vie
   https://github.com/nodejs/release
   Date de consultation : 22 septembre 2026

### Informations retenues

- Node.js 20 a atteint sa fin de vie (End-of-Life) le **30 avril 2026**. Depuis cette date, il ne reçoit plus aucun correctif de sécurité (source : `nodejs/release`).
- Vercel a annoncé la désactivation de Node.js 20 dans les paramètres de projet à partir du **1er octobre 2026** (source : Vercel Changelog).
- Les déploiements déjà en ligne ne sont pas coupés : les fonctions déjà déployées continuent de fonctionner normalement.
- Seuls les **nouveaux déploiements** sont bloqués après le 1er octobre 2026, si le projet cible encore Node.js 20 (dans les Project Settings ou dans le champ `engines` de `package.json`).
- Vercel propose de vérifier les projets concernés avec `vercel project ls --update-required`.
- La version recommandée en remplacement est Node.js 22 ou 24 (LTS actives).

### Risque identifié

Le projet CP8_lanterne cible actuellement `"node": ">=20"` dans `package.json`. Sans mise à jour, un nouveau déploiement après le 1er octobre 2026 échouera. La date butoir est proche (moins de deux semaines à la date de rédaction), donc le risque est immédiat, pas théorique.

### Décision prise pour le projet

Mettre à jour le champ `engines` de `package.json` vers Node.js 22 ou 24 avant le 1er octobre 2026, et vérifier que la version sélectionnée dans les Project Settings Vercel correspond. Retester ensuite les routes de l'API (`/api/health`, `/api/curiosities`, etc.) pour confirmer qu'aucune régression n'est introduite par le changement de version.