# Identification du matériel inutilisé

Vitrine Next.js pour les managers : connexion SSO Google Workspace obligatoire, choix région → agence, puis dépôt automatique des pièces jointes dans le **dossier Google Drive de l’agence**.

Hébergement prévu : **Vercel**.

Stack : Next.js (App Router) · TanStack Form · TanStack Query · Zod. L’app reste sur Next.js (pas TanStack Start) pour Vercel, le SSO et les Server Components.

## Fonctionnement

1. Le manager ouvre la vitrine et se connecte avec son **compte professionnel** (`@votre-domaine.fr`). Les Gmail personnels sont refusés.
2. Il choisit la **région**, puis l’**agence** (liste filtrée).
3. Il déclare les ordinateurs inutilisés (ou confirme qu’il n’y en a pas) et joint des photos.
4. L’application crée un sous-dossier daté dans le dossier Drive de l’agence, y dépose une synthèse (`synthese.txt` + `synthese.json`) et les pièces jointes.

## Préparer Google

### 1. Écran de consentement OAuth

Dans [Google Cloud Console](https://console.cloud.google.com/) :

- Créez un projet.
- APIs et services → Écran de consentement OAuth.
- Type **Interne** (Google Workspace) : seuls les comptes de l’entreprise peuvent se connecter.
- Ajoutez les scopes e-mail / profil.

### 2. Identifiants OAuth (SSO)

- Type : **Application Web**.
- URI de redirection autorisés :
  - `http://localhost:3000/api/auth/callback/google`
  - `https://VOTRE-PROJET.vercel.app/api/auth/callback/google`
  - et votre domaine custom s’il y en a un.
- Copiez `AUTH_GOOGLE_ID` et `AUTH_GOOGLE_SECRET`.

### 3. API Drive + compte de service

- Activez **Google Drive API**.
- Créez un **compte de service**.
- Téléchargez la clé JSON.
- Partagez chaque dossier d’agence (ou le dossier racine) avec l’e-mail du compte de service, droit **Éditeur**.
- Sur un Drive partagé, ajoutez le compte de service comme membre du Drive.

L’ID d’un dossier se trouve dans l’URL :

`https://drive.google.com/drive/folders/`**`1AbCDefGhiJKLmnop`**

### 4. Régions, agences, dossiers

Éditez `data/agencies.json` :

```json
{
  "id": "lyon",
  "name": "Lyon",
  "driveFolderId": "1AbCDefGhiJKLmnop"
}
```

- Si `driveFolderId` est renseigné : les fichiers vont **dans ce dossier**.
- S’il vaut encore `REMPLACER_PAR_ID_DOSSIER_DRIVE` : l’app crée `Région / Agence` sous `GOOGLE_DRIVE_ROOT_FOLDER_ID`.

Chaque envoi crée un sous-dossier du type `2026-08-13_marie-dupont_a3k9`.

## Variables d’environnement (Vercel)

Copiez `.env.example` vers `.env.local` en développement.

Dans Vercel → Project → Settings → Environment Variables :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_COMPANY_NAME` | Nom affiché sur la vitrine |
| `ALLOWED_EMAIL_DOMAINS` | Domaines SSO autorisés, ex. `entreprise.fr` |
| `NEXT_PUBLIC_ALLOWED_DOMAIN` | Affichage du domaine sur la vitrine |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Client OAuth |
| `AUTH_GOOGLE_SECRET` | Secret OAuth |
| `AUTH_URL` | URL publique, ex. `https://votre-projet.vercel.app` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | JSON du compte de service, **une seule ligne** |
| `GOOGLE_DRIVE_ROOT_FOLDER_ID` | Optionnel, dossier racine de repli |

Pour coller le JSON du compte de service dans Vercel, compactez-le sur une ligne. Les `\n` de la clé privée doivent rester échappés.

## Lancer en local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Lancer avec Docker

Le fichier `.env` (jamais commité) doit être à la racine. Compose le charge au démarrage : sans `AUTH_SECRET`, le conteneur refuse de démarrer.

Dans Google Cloud, ajoutez aussi l’URI de redirection :

`http://localhost:3000/api/auth/callback/google`

```bash
docker compose up --build
```

L’app est alors disponible sur [http://localhost:3000](http://localhost:3000).

Arrêt :

```bash
docker compose down
```

## Déployer sur Vercel

```bash
npx vercel
```

Ou reliez le dépôt Git dans l’interface Vercel. Après le premier déploiement, ajoutez l’URI de callback de production dans Google Cloud.

## Limites Vercel

Chaque pièce jointe est envoyée séparément, **4 Mo maximum** (JPG, PNG, WEBP, HEIC, PDF). Demandez aux managers de photographer l’étiquette plutôt que d’envoyer des fichiers bruts très lourds.
