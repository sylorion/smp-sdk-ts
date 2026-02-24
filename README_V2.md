# SMP SDK TypeScript (V2)

Bienvenue dans la documentation complète du SDK TypeScript pour l'API SMP. Ce SDK a été restructuré pour offrir une approche axée sur les **Domaines**, remplaçant l'ancienne approche par microservices.

## Table des Matières
1. [Installation](#installation)
2. [Initialisation](#initialisation)
3. [Configuration & Authentification](#configuration--authentification)
4. [Architecture des Domaines](#architecture-des-domaines)
5. [Convention de Nommage](#convention-de-nommage)
6. [Liste des Domaines et Contrôleurs](#liste-des-domaines-et-contrôleurs)
7. [Gestion des Erreurs](#gestion-des-erreurs)

---

## Installation

Le SDK peut être installé ou linké en tant que dépendance npm ou yarn depuis le repo local.

\`\`\`bash
npm install smp-sdk-ts
# ou
yarn add smp-sdk-ts
\`\`\`

---

## Initialisation

L'entrée principale du SDK est la classe `SMPClient`, définie dans `src/SMPClient.ts`. Elle instancie et donne accès à tout l'écosystème SMP de façon unifiée.

\`\`\`typescript
import { SMPClient } from 'smp-sdk-ts';

const client = new SMPClient({
  appId: 'YOUR_APP_ID',
  appSecret: 'YOUR_APP_SECRET',
  apiUrl: 'api.smp.example.com',
  persistence: Persistence.LocalStorage, // Ou Memory, SessionStorage...
  defaultLanguage: 'fr'
});
\`\`\`

---

## Configuration & Authentification

### Authentification de l'Application

Avant d'exécuter des requêtes, le client doit authentifier l'application :

\`\`\`typescript
// S'authentifier auprès de l'API avec les identifiants d'application
await client.authenticateApp();
\`\`\`

### Authentification de l'Utilisateur

Pour les requêtes qui nécessitent qu'un utilisateur soit connecté :

\`\`\`typescript
// Connexion utilisateur
const userSession = await client.authenticateUser('user@example.com', 'password123');

// Les requêtes suivantes utiliseront automatiquement le token utilisateur
const myProfile = await client.user.profile.list();

// Déconnexion utilisateur
await client.logoutUser();
\`\`\`

Le `SMPClient` gère automatiquement le rafraîchissement des tokens d'accès (Access Token et Refresh Token) en tâche de fond pour l'app et pour l'utilisateur.

---

## Architecture des Domaines

L'architecture v2 a été mise en place pour améliorer la modularité, la lisibilité et l'organisation du code.
Les anciens "microservices" (mu-catalog, mu-billing, etc.) ne figurent plus dans le SDK côté frontend. À la place, les fonctionnalités sont organisées logiquement par type fonctionnel :

- `client.auth.*`
- `client.catalog.*`
- `client.organization.*`
- `client.accounting.*`
- `client.user.*`
- `client.booking.*`
- `client.communication.*`

---

## Convention de Nommage

Pour garantir une utilisation unifiée et prévisible, **toutes** les méthodes au sein des contrôleurs respectent la convention de nommage standardisée (CRUD) suivante :

| Opération                                     | Nom Standardisé               | Exemples d'usage concrets                                    |
| --------------------------------------------- | ----------------------------- | --------------------------------------------------------------- |
| **Création** d'une entité                     | `create(...)`                 | `const newOrg = await client.organization.organization.create(input);` |
| **Récupération** d'une liste sans filtre      | `list()`                      | `const profiles = await client.user.profile.list();`               |
| **Récupération** d'une liste (filtrée)        | `listBy[Key](...)`            | `const invoices = await client.catalog.invoice.listByOrganizationId(orgId);`<br>`const services = await client.catalog.service.listByCategory(id);` |
| **Récupération** d'une seule entité par son ID| `getById(id)`                 | `const service = await client.catalog.service.getById(serviceId);` |
| **Récupération** de plusieurs entités par IDs | `getByIds(ids)`               | `const services = await client.catalog.service.getByIds(serviceIds);` |
| **Récupération** d'une entité par une clé     | `getBy[Key](...)`             | `const service = await client.catalog.service.getBySlug(slug);`<br>`let notif = await client.communication.notification.getByUniqRef(uniqRef);` |
| **Recherche** complexes avec filtres          | `search(...)` / `searchBy...` | `const availabilities = await client.booking.booking.searchAvailabilities(input);` |
| **Mise à jour** d'une entité                  | `update(id, input)`           | `const updated = await client.catalog.service.update(serviceId, input);` |
| **Suppression** d'une entité                  | `delete(id)`                  | `await client.catalog.service.delete(serviceId);`               |

> **Note Critique :** Le nom de l'entité principale n'est **jamais** répété dans le nom de la méthode, car il est "logiquement déduit" du contrôleur appelé.
> *Par exemple : `client.catalog.service.getById(id)` au lieu de `...service.getServiceById(id)`*.

---

## Liste des Domaines et Contrôleurs

L'arborescence complète des modules de l'API.

### 1. Auth Domain (`client.auth`)
Gère l'authentification avancée, les mots de passe et les affiliés.
- **Affiliate** (`client.auth.affiliate`): `AffiliateController` - Jetons d'affiliation et utilisateurs référés.
- **Password** (`client.auth.password`): `PasswordController` - Mot de passe oublié, réinitialisation (`forgotPassword`, `resetPassword`).
- **Signup** (`client.auth.signup`): `SignupController` - Interface de création de nouveaux utilisateurs finaux.

### 2. Catalog Domain (`client.catalog`)
Gère le catalogue de services mis à disposition sur les plateformes.
- **Category** (`client.catalog.category`): `CategoryController` - Hiérarchie de catégories et sous-catégories.
- **Service** (`client.catalog.service`): `ServiceController` - Moteur de recherche et gestion des fiches services, favoris (`addFavorite`, `removeFavorite`).
- **Asset** (`client.catalog.asset`): `AssetController` - Médias associés, documents, images.
- **Engagement** (`client.catalog.engagement`): `EngagementController` - Prestations/Missions, tracking de l'évolution via `EngagementReport`.

### 3. Organization Domain (`client.organization`)
Gère les entreprises et regroupements d'utilisateurs.
- **Organization** (`client.organization.organization`): `OrganizationController` - Fiches d'organisations, types et détails administratifs.
- **Membership** (`client.organization.membership`): `MembershipController` - Membres d'une organisation, leurs rôles.
- **Location** (`client.organization.location`): `LocationController` - Bureaux et localisations géographiques.

### 4. Accounting Domain (`client.accounting`)
Gère la dimension financière, les portefeuilles virtuels et les paiements.
- **Contract** (`client.accounting.contract`): `ContractController` - Création et validation légale de contrats liés aux achats.
- **Estimate** (`client.accounting.estimate`): `EstimateController` - Demandes de devis, signatures et validations.
- **Invoice** (`client.accounting.invoice`): `InvoiceController` - Génération et suivi des factures.
- **Order** (`client.accounting.order`): `OrderController` - Paniers et commandes de services.
- **Payment** (`client.accounting.payment`): `PaymentController` - Transactions entrantes/sortantes et flux complexes (Stripe, etc.).
- **Transaction** (`client.accounting.transaction`): `TransactionController` - Relevés et logs transactionnels entre wallets.
- **Wallet** (`client.accounting.wallet`): `WalletController` - Dépôts d'argent, conversions en jetons (tokens).

### 5. User Domain (`client.user`)
Gère les profils des utilisateurs.
- **Profile** (`client.user.profile`): `ProfileController` - Paramètres de compte, avatar, biographie, dates de naissance et métadonnées individuelles.

### 6. Booking Domain (`client.booking`)
Idéal pour la prise de rendez-vous de type coaching ou consulting.
- **Booking** (`client.booking.booking`): `BookingController` - Création de réservations sur des services, exceptions calendaires.
- **BookingConfiguration** (`client.booking.config`): `BookingConfigurationController` - Paramètres de configuration (durée min/max, délais).
- **TimeSlot** (`client.booking.timeSlot`): `TimeSlotController` - Disponibilités globales et périodes libres d'un service.

### 7. Communication Domain (`client.communication`)
Gère la transmission des informations vers les utilisateurs et clients.
- **Mailing** (`client.communication.mailing`): `MailingController` - Gestion des newsletters, contacts de mailing et listes d'e-mails, campagnes.
- **Notification** (`client.communication.notification`): `NotificationController` - Suivi des événements système envoyés à l'utilisateur ciblé (App In-app notifications).
- **WaitingList** (`client.communication.waitingList`): `WaitingListController` - File d'attente pour être notifié d'une dispo sur un service saturé.

---

## Gestion des Erreurs

Les requêtes sont traitées par le gestionnaire d'erreurs global (voir `src/utils/ErrorHandler.ts`). Lors de l'utilisation de `async/await`, il est fortement recommandé de wrapper les requêtes SDK dans un `try / catch` :

\`\`\`typescript
try {
   const details = await client.catalog.service.getById("123");
} catch (error) {
   // Le ErrorHandler a potentiellement déjà loggué l'erreur,
   // mais le code client peut la traiter ou l'afficher sur l'UI.
   console.error("Échec du chargement du service :", error);
}
\`\`\`
