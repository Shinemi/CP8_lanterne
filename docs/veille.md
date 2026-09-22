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

# Tutoriel rapide : passer de Node.js 20 à Node.js 24

Le projet utilise **pnpm** (`pnpm-lock.yaml`) et non Yarn.

## 1. Vérifier la version actuelle

Dans un terminal :

```bash
node -v
pnpm -v
```

Si Node.js 20 est affiché, il faut effectuer la mise à jour.

## 2. Installer Node.js 24

Si **nvm** n'est pas installé ou ne fonctionne pas sous Windows, le plus simple est d'utiliser l'installateur officiel de Node.js.

Télécharger Node.js 24 depuis :

https://nodejs.org/

Installer la version **Node.js 24 LTS**, puis redémarrer le terminal.

Vérifier ensuite :

```bash
node -v
```

Le résultat doit commencer par :

```text
v24
```

## 3. Modifier `package.json`

Dans le fichier `package.json`, remplacer :

```json
"engines": {
  "node": ">=20"
}
```

par :

```json
"engines": {
  "node": ">=24"
}
```

Cela indique que le projet nécessite désormais **Node.js 24 ou une version supérieure**.

## 4. Réinstaller les dépendances

Comme le projet utilise **pnpm** :

```bash
pnpm install
```

Il ne faut **pas supprimer `pnpm-lock.yaml`**.

## 5. Modifier la version Node.js sur Vercel

Dans le projet Vercel :

**Project Settings → General → Node.js Version**

Sélectionner **Node.js 24.x**.

La version configurée sur Vercel doit correspondre à celle demandée dans `package.json`.

## 6. Tester le projet

Lancer l'API localement avec la commande habituelle du projet et vérifier notamment :

* `/api/health`
* `/api/curiosities`

Puis effectuer un nouveau déploiement sur Vercel.

## 7. Vérification finale

Vérifier que :

```bash
node -v
```

retourne **Node.js 24**, que :

```bash
pnpm install
```

fonctionne correctement et que le déploiement Vercel s'effectue sans erreur.
