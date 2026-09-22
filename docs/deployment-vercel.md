# Déploiement Vercel — CP8_lanterne

Ce document explique comment installer, configurer et déployer l'API Lanterne sur Vercel.

### URL publique : https://cp-8-lanterne.vercel.app
### Repository : https://github.com/Shinemi/CP8_lanterne/tree/main

## Prérequis

- Node.js version 20 ou plus.
- pnpm ou npm.
- Un compte GitHub avec accès au dépôt `Shinemi/CP8_lanterne`.
- Un compte Vercel relié à ce compte GitHub.

## Installation locale

Cloner le dépôt.

```bash
git clone https://github.com/Shinemi/CP8_lanterne.git
cd CP8_lanterne
```

Installer les dépendances.

```bash
pnpm install
```

Remplir les valeurs dans `.env`.

Lancer le serveur en local.

```bash
pnpm dev
```

L'API répond alors sur `http://localhost:3000`.

## Liaison avec Vercel

Deux méthodes sont possibles.

**Méthode 1 : depuis le dashboard Vercel.**

Cliquer sur "Add New Project".

Sélectionner le dépôt `Shinemi/CP8_lanterne`.

Confirmer l'import.

**Méthode 2 : depuis la CLI Vercel.**

Installer la CLI.

```bash
pnpm add -g vercel
```

Lier le projet.

```bash
vercel link
```

## Environnements Preview et Production

Vercel crée deux environnements par défaut.

L'environnement **Production** correspond à la branche `main`.

Chaque push sur `main` déclenche un déploiement en production.

L'environnement **Preview** correspond aux autres branches et aux pull requests.

Chaque push sur une autre branche crée un déploiement de test, avec sa propre URL temporaire.

Cela permet de tester une modification avant de la mettre en production.

## Variables d'environnement

Trois variables sont nécessaires.

- `LANTERNE_ENV` : indique l'environnement (`development` ou `production`).
- `LANTERNE_API_VERSION` : indique la version de l'API.
- `ALLOWED_ORIGIN` : indique l'origine autorisée pour CORS.

Elles se configurent dans le dashboard Vercel, section **Settings > Environment Variables**.

Chaque variable peut avoir une valeur différente selon l'environnement (Production, Preview, Development).


## Déploiement

Un push sur `main` suffit pour déployer en production.

```bash
git push origin main
```

Vercel installe les dépendances avec `pnpm install`.

Vercel détecte `api/index.js` comme une fonction serverless.

Le fichier `vercel.json` redirige toutes les routes vers cette fonction.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/api" }
  ]
}
```

Sans ce fichier, seules les routes `/api` et `/api/index` répondent, les autres renvoient une erreur 404.

## Vérifications après déploiement

Tester la route de santé.

```bash
curl -i https://cp-8-lanterne.vercel.app/api/health
```


Tester la liste des curiosités.

```bash
curl -i https://cp-8-lanterne.vercel.app/api/curiosities
```

Tester la recherche.

```bash
curl -i "https://cp-8-lanterne.vercel.app/api/curiosities?q=canal&limit=5"
```

Tester la consultation par slug.

```bash
curl -i https://cp-8-lanterne.vercel.app/api/curiosities/passage-bleu
```


Le détail de chaque test se trouve dans `docs/validation.md`.

## Mise à jour et retour en arrière

### Déploiement de la nouvelle version

Modification apportée : ajout d'une nouvelle entrée de curiosité (« Château de Forcalqueiret ») dans `data/curiosities.json`.

Le but était de tester le rollback.

Commit : `7e1c125` — *"add new curiosity entry for Chateau de Forcalqueiret"*.

Poussé sur `main`. Vercel déploie automatiquement en production.

ID de déploiement : `cp-8-lanterne-9lyxebbql-simonlucas83136-3…`.

### Validation de la nouvelle version

Appeler `GET /api/health` après le déploiement. Vérifier que l'API répond bien.

Appeler `GET /api/curiosities` ou `GET /api/curiosities/<slug-du-château>`. Vérifier que la nouvelle entrée apparaît.

### Retour en arrière depuis l'historique Vercel

Vercel propose une fonction **Instant Rollback**.

1. Ouvrir le dashboard du projet, onglet **Deployments**.

2. Repérer le déploiement stable précédent.

3. Cliquer sur **Rollback**. Une boîte de dialogue s'ouvre.

![Instant rollback](../preuve/instant%20rollback%20selection.png)

4. Elle affiche deux déploiements, l'ancien et le nouveau, côte à côte.

5. Écrire une raison dans le champ prévu. Exemple : *« L'ajout d'une curiosité était un test visant à manipuler la fonction de rollback de Vercel »*.

![Instant rollback](../preuve/rollback%20vercel.png)

6. Cliquer sur **Continue**.

7. Vercel réattribue le domaine de production vers le déploiement précédent. Aucun nouveau build n'est nécessaire.

8. Vérifier le retour avec `GET /api/curiosities`. La curiosité ajoutée par le commit `7e1c125` ne doit plus apparaître.


