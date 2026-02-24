# Rapport d'Analyse et de Documentation Complète du SDK `smp-sdk-ts`

> **Phase : ANALYSE UNIQUEMENT — Aucune modification de code n'a été effectuée.**
> Ce document est destiné à un agent de refactorisation. Il contient l'ensemble des informations nécessaires pour entreprendre la restructuration du SDK de manière efficace et sûre.

---

## Sommaire

1. [Vue d'ensemble et arborescence actuelle](#1-vue-densemble-et-arborescence-actuelle)
2. [Documentation de chaque contrôleur](#2-documentation-de-chaque-contrôleur)
3. [Documentation de la couche API (GraphQL)](#3-documentation-de-la-couche-api-graphql)
4. [Documentation des types](#4-documentation-des-types)
5. [Failles et problèmes identifiés](#5-failles-et-problèmes-identifiés)
6. [Proposition de refactorisation structurelle](#6-proposition-de-refactorisation-structurelle)
7. [Nouvelle architecture proposée](#7-nouvelle-architecture-proposée)
8. [Impact sur SMPClient et les exports](#8-impact-sur-smpclient-et-les-exports)
9. [Plan d'action priorisé pour l'agent de refactorisation](#9-plan-daction-priorisé-pour-lagent-de-refactorisation)

---

## 1. Vue d'ensemble et arborescence actuelle

### Description générale
Le SDK `smp-sdk-ts` est une librairie client TypeScript exposant un accès unifié à l'API backend (GraphQL + REST). Il sert de pont entre les applications clientes (Next.js, React Native) et les microservices backend.

### Arborescence actuelle

```
smp-sdk-ts/
├── src/
│   ├── SMPClient.ts              ← Point d'entrée principal (facade)
│   ├── index.ts                  ← Exports publics du SDK
│   ├── api/
│   │   ├── APIClient.ts          ← Client HTTP/GraphQL centralisé
│   │   └── graphql/
│   │       ├── mutations/        ← Strings des mutations GQL
│   │       │   ├── index.ts
│   │       │   ├── authMutations.ts
│   │       │   ├── accounting/   (invoiceMutations, paymentMutations, transactionMutations, estimateMutations)
│   │       │   ├── authentication/ (waitingListMutations, affiliateMutations)
│   │       │   ├── catalog/      (serviceMutation, assetMutations, serviceAssetMutations, serviceMediaMutation, assetMediaMutations)
│   │       │   ├── command/      (bookingMutations, bookingConfigurationMutations)
│   │       │   ├── contract/     (contractMutations)
│   │       │   ├── document/     (mediaMutation)
│   │       │   ├── engagement/   (engagementMutations)
│   │       │   ├── location/     (placeMutation)
│   │       │   ├── notification/ (mailingMutations)
│   │       │   ├── organization/ (organizationMutation, organizationMediaMutations, userOrganization)
│   │       │   ├── timeSlot/     (timeSlotMutations)
│   │       │   ├── user-space/   (profileMutation)
│   │       │   └── wallet/       (walletMutations)
│   │       ├── queries/          ← Strings des queries GQL
│   │       │   ├── index.ts
│   │       │   ├── statusQueries.ts
│   │       │   ├── accounting/   (invoiceQueries, estimateQueries, orderQueries, transactionQueries)
│   │       │   ├── authentication/ (affiliateQueries)
│   │       │   ├── catalog/      (serviceQueries, assetQueries, assetMediaQueries, serviceMediaQueries)
│   │       │   ├── command/      (bookingQueries)
│   │       │   ├── contract/     (contractQueries)
│   │       │   ├── document/     (mediaQueries)
│   │       │   ├── engagement/   (engagementQueries)
│   │       │   ├── location/     (placeQueries)
│   │       │   ├── notification/ (notificationQueries, mailingQueries)
│   │       │   ├── order/        (orderQueries)
│   │       │   ├── organization/ (organizationQueries, organizationMediaQueries)
│   │       │   ├── timeSlot/     (timeSlotQueries)
│   │       │   ├── user-space/   (profileQueries)
│   │       │   └── wallet/       (walletQueries)
│   │       └── types/
│   │           ├── auth.ts
│   │           ├── command/      (BookingTypes.ts)
│   │           └── engagement/   (EngagementTypes.ts)
│   ├── auth/
│   │   ├── AuthTokenManager.ts   ← Gestion des tokens (app + user)
│   │   ├── AuthTokenStorage.ts   ← Abstraction du stockage des tokens
│   │   └── TokenStorageType.ts   ← Interface de stockage
│   ├── config/
│   │   ├── ConfigManager.ts      ← Gestion de la configuration globale
│   │   ├── Persistence.ts        ← Abstraction persistence (localStorage/memory)
│   │   └── SMPConfig.ts          ← Type SMPClientOptions
│   ├── controllers/              ← 26 fichiers, 1 contrôleur par domaine
│   │   ├── index.ts
│   │   ├── ServiceController.ts
│   │   ├── AssetController.ts
│   │   ├── ServiceAssetController.ts
│   │   ├── BookingController.ts
│   │   ├── BookingConfigurationController.ts
│   │   ├── EngagementController.ts
│   │   ├── TimeSlotController.ts
│   │   ├── OrganizationController.ts
│   │   ├── ManageOrganisationController.ts
│   │   ├── EstimateController.ts
│   │   ├── InvoiceController.ts
│   │   ├── paymentController.ts  ← ⚠️ Nom en minuscule (incohérence)
│   │   ├── ContractController.ts
│   │   ├── WalletController.ts
│   │   ├── ProfileController.ts
│   │   ├── SignupController.ts
│   │   ├── PasswordResolver.ts   ← ⚠️ Nom "Resolver" incohérent
│   │   ├── MediaController.ts
│   │   ├── MailingController.ts
│   │   ├── LocationController.ts
│   │   ├── NotificationController.ts
│   │   ├── OrderController.ts
│   │   ├── WaitingListController.ts
│   │   ├── AffiliateController.ts
│   │   └── Transactioncontroller.ts  ← ⚠️ Casse incohérente
│   ├── i18n/
│   ├── tracking/
│   ├── types/                    ← Types globaux partiels
│   │   ├── Estimate.ts
│   │   ├── Contract.ts
│   │   ├── Wallet.ts
│   │   ├── User.ts
│   │   ├── SMPHeartbeat.ts
│   │   └── index.ts
│   └── utils/
│       ├── ErrorHandler.ts
│       ├── Logger.ts
│       └── statusCheck.ts
├── tests/
│   ├── index.ts
│   ├── auth/
│   └── utils/
├── package.json
└── tsconfig.json
```

---

## 2. Documentation de chaque contrôleur

### Domaine CATALOG (`mu-catalog`)

#### `ServiceController.ts` → classe `Service`
| Méthode | Type | Description |
|---------|------|-------------|
| `list(pagination, sort, filter)` | Query | Liste tous les services |
| `getById(serviceID)` | Query | Récupère un service par son ID |
| `getByAuthorID(authorID)` | Query | Services d'un auteur |
| `getByUniqRef(uniqRef)` | Query | Service par référence unique |
| `getBySlug(slug)` | Query | ⚠️ Utilise `response.data.serviceBySlug` (incohérent) |
| `getByIDs(serviceIDs[])` | Query | Services par liste d'IDs |
| `getBySlugs(slugs[])` | Query | ⚠️ Utilise `response.data.servicesBySlugs` (incohérent) |
| `listByOrganization(input)` | Query | Services d'une organisation |
| `search(input)` | Query | Recherche plein-texte |
| `getByAgentID(agentID)` | Query | ⚠️ Utilise `response.data.servicesByAgentID` (incohérent) |
| `getServiceMedia(id)` | Query | Récupère un service media |
| `listServiceMedias()` | Query | Liste tous les service medias |
| `createService(input)` | Mutation | Crée un service |
| `updateService(id, input)` | Mutation | Met à jour un service |
| `deleteService(id)` | Mutation | Supprime un service |
| `addServiceToFavorites(input)` | Mutation | Ajouter aux favoris |
| `createServiceMedia(input)` | Mutation | Crée un lien service-media |
| `updateServiceMedia(id, input)` | Mutation | Met à jour un service-media |
| `deleteServiceMedia(id)` | Mutation | Supprime un service-media |

**⚠️ Types locaux (non exportés depuis un fichier centralisé) :** `ServiceEntity`, `ServiceMediaEntity`, `CreateServiceInput`, `UpdateServiceInput`

---

#### `AssetController.ts` → classe `Asset`
| Méthode | Type | Description |
|---------|------|-------------|
| `get(assetID)` | Query | Récupère un asset par ID |
| `list(pagination, sort, filter)` | Query | Liste les assets |
| `assetBySlug(slug)` | Query | Asset par slug |
| `assetsByIDs(assetIDs[])` | Query | Assets par liste d'IDs |
| `assetsBySlugs(slugs[])` | Query | Assets par slugs |
| `assetByUniqRef(uniqRef)` | Query | Asset par uniqRef |
| `listByService(input)` | Query | Assets d'un service (avec pivot) |
| `listServicesByAsset(input)` | Query | Services d'un asset (avec pivot) |
| `listByOrganization(input)` | Query | Assets d'une organisation |
| `createAsset(input)` | Mutation | Crée un asset |
| `updateAsset(id, input)` | Mutation | Met à jour un asset |
| `deleteAsset(id)` | Mutation | Supprime un asset |
| `getAssetMedia(id)` | Query | Récupère un media d'asset |
| `listAssetMedias()` | Query | Liste les medias d'assets |
| `assetMediasByIDs(ids[])` | Query | Medias par IDs |
| `createAssetMedia(input)` | Mutation | Crée un asset-media |
| `updateAssetMedia(id, input)` | Mutation | Met à jour |
| `deleteAssetMedia(id)` | Mutation | Supprime |

---

### Domaine COMMAND (`mu-command`)

#### `BookingController.ts` → classe `BookingController`
| Méthode | Type | Description |
|---------|------|-------------|
| `createEstimateRequest(input)` | Mutation | Demande de devis |
| `getEstimateRequests(serviceId, userId?)` | Query | Demandes de devis d'un service |
| `getEstimateRequest(estimateRequestId)` | Query | Une demande de devis |
| `createBooking(input)` | Mutation | Créer une réservation |
| `getBookingsByService(serviceId)` | Query | Réservations d'un service |
| `getBookingsByUser(userId)` | Query | Réservations d'un user |
| `createBookingWithSlot(input)` | Mutation | Réservation avec créneau auto |
| `cancelBooking(bookingId, message?)` | Mutation | Annuler une réservation |
| `updateBooking(input)` | Mutation | Mettre à jour |
| `createAvailability(input)` | Mutation | Crée une disponibilité |
| `updateAvailability(id, input)` | Mutation | Met à jour |
| `cancelAvailability(id)` | Mutation | Annule |
| `searchAvailabilities(input)` | Query | Cherche des disponibilités |
| `createWeeklyAvailability(input)` | Mutation | Disponibilité hebdomadaire |
| `createWeeklyAvailabilityBatch(input)` | Mutation | Batch disponibilités hebdo |
| `getWeeklyAvailabilities(serviceId, userId)` | Query | Disponibilités hebdo |
| `createDailySlots(input)` | Mutation | Créneaux quotidiens |
| `getDailySlots(input)` | Query | Récupère créneaux quotidiens |
| `getAvailableSlots(input)` | Query | Créneaux disponibles |
| `getCalendarSlots(serviceId, start, end, userId?)` | Query | Créneaux calendrier |
| `createAvailabilityException(input)` | Mutation | Exception de disponibilité |
| `getAvailabilityExceptions(...)` | Query | Récupère les exceptions |
| `isSlotAvailable(...)` | Util | ⚠️ Logique métier locale (ne touche pas l'API directement) |
| `getNextAvailableSlot(...)` | Util | ⚠️ Logique métier locale |
| `calculateSlotDuration(...)` | Util helper | Pure fonction utilitaire |
| `formatTime(minutes)` | Util helper | Pure fonction de formatage |

---

#### `EngagementController.ts` → classe `EngagementController`
Gestion des engagements (contrats de mission), time slots et rapports d'engagement.
**Le seul contrôleur qui importe et ré-exporte proprement ses types depuis `../api/graphql/types/engagement/EngagementTypes.js`.**

---

### Domaine ACCOUNTING (`mu-billing` / `mu-command`)

#### `paymentController.ts` → classe `SMPPayment`
**⚠️ Ce fichier est le plus "fourre-tout" du SDK** : il gère en un seul fichier les entités suivantes :
- Paiements Stripe (`initiatePayment`)
- Estimates (`createEstimate`, `updateEstimate`)
- Orders (`createOrder`, `confirmOrder`, `addLine`, `updateLine`, `deleteLine`, `markOrderPaid`, `markOrderDelivered`, `cancelOrder`)
- Transactions (`getTransaction`, `initiateTransaction`, `finalizeTransaction`)
- Contrats (`updateContract`)

#### `EstimateController.ts` → classe `Estimate`
Gestion des estimations et des négociations.
**⚠️ Doublon partiel avec `SMPPayment.createEstimate` et `SMPPayment.updateEstimate`.**

#### `InvoiceController.ts` → classe `Invoice`
Gestion complète des factures : création, mise à jour, listing, PDF, envoi email, paiement tokenisé.

---

### Domaine ORGANIZATION (`mu-organization`)

#### `OrganizationController.ts` → classe `Organization`
CRUD complet de l'organisation + gestion des médias d'organisation.

#### `ManageOrganisationController.ts` → classe `ManageOrganization`
**⚠️ Responsabilités mixtes :** gestion des membres (invitations, rôles, ajout/suppression) ET inscription via invitation (`signupAfterInvitation` qui utilise `MUTATION_SIGNUP_AFTER_INVITATION` de `authMutations`).

---

### Domaine USER/AUTH (`mu-authentication`)

#### `SignupController.ts` → classe `Signup`
Une seule méthode `createUser`. Très faiblement isolé.

#### `PasswordResolver.ts` → classe `Password`
**⚠️ Nommage incohérent (Resolver au lieu de Controller).**

#### `ProfileController.ts` → classe `Profile`
CRUD des profils utilisateurs.

---

### Domaine COMMUNICATION (`mu-notification`)

#### `MailingController.ts` → classe `Mailing`
Gestion des campagnes email, newsletters et contacts newsletter.

#### `NotificationController.ts` → classe `Notification`
Notifications in-app.

---

### Domaine FINANCIAL (`mu-wallet`)

#### `WalletController.ts` → classe `Wallet`
Gestion complète du portefeuille : dépôts, retraits, conversions, transferts, paiements, revenus.
**C'est le contrôleur le mieux structuré du SDK** : il importe ses types depuis `../types/Wallet.ts`, utilise le générique `mutate<T>`, et propose des méthodes utilitaires (helpers) bien nommées.

---

### Résumé des contrôleurs restants

| Contrôleur | Classe | Domaine | Taille |
|------------|--------|---------|--------|
| `ContractController.ts` | `Contract` | ACCOUNTING | 3.9 KB |
| `LocationController.ts` | `Location` | GEO | 2.9 KB |
| `MediaController.ts` | `Media` | DOCUMENT | 4.2 KB |
| `OrderController.ts` | `Order` | ACCOUNTING | 2.4 KB |
| `ServiceAssetController.ts` | `ServiceAsset` | CATALOG | 7 KB |
| `Transactioncontroller.ts` | `Transaction` | ACCOUNTING | 3.7 KB |
| `WaitingListController.ts` | `WaitingList` | AUTH | 4.2 KB |
| `AffiliateController.ts` | `AffiliateController` | AUTH | 2.9 KB |
| `BookingConfigurationController.ts` | `BookingConfigurationController` | COMMAND | 6.7 KB |
| `TimeSlotController.ts` | `TimeSlotController` | COMMAND | 5.3 KB |

---

## 3. Documentation de la couche API (GraphQL)

### Organisation actuelle par microservice

La couche `src/api/graphql/` est organisée par **microservice backend** :

```
graphql/
├── mutations/
│   ├── accounting/    → mu-billing
│   ├── authentication/ → mu-authentication
│   ├── catalog/       → mu-catalog
│   ├── command/       → mu-command
│   ├── contract/      → mu-contract
│   ├── document/      → mu-document
│   ├── engagement/    → mu-engagement
│   ├── location/      → mu-geo
│   ├── notification/  → mu-notification
│   ├── organization/  → mu-organization
│   ├── timeSlot/      → mu-command (confusion !)
│   ├── user-space/    → mu-authentication
│   └── wallet/        → mu-wallet
└── queries/
    ├── (même structure)
```

### Problème principal de la couche API

La séparation par microservice backend introduit une **fuite d'abstraction** dans le SDK : le SDK côté client est couplé à l'architecture backend (ses microservices). Si un microservice est renommé ou fusionné côté backend, le SDK doit être restructuré.

De plus, le nommage des dossiers n'est pas cohérent : `user-space`, `authentication`, `accounting` sont des termes différents mais appartiennent au même domaine métier "utilisateur/facturation".

### Incohérences de nommage dans `queries/index.ts`

```typescript
// Ligne 6 dans queries/index.ts — exporte une MUTATION depuis le dossier queries !
export {paymentMutations} from './../mutations/accounting/paymentMutations.js';
```

**Faille critique :** Le fichier `queries/index.ts` exporte une mutation. Cela crée de la confusion.

### Incohérence dans les exports de mutations (index.ts)

```typescript
// Dans mutations/index.ts, mélange de styles d'export
export { serviceMutations } from './catalog/serviceMutation.js'; // style direct
// vs
import { bookingMutations } from './command/bookingMutations.js';
export { bookingMutations }; // style import/re-export
// vs
import invoiceMutations from './accounting/invoiceMutations.js'; // default import !
export { invoiceMutations };
```

**Trois styles coexistent** : export direct, import+re-export, et même un default import pour `invoiceMutations`. Cela signifie que `invoiceMutations` est le seul fichier qui utilise un `export default` au lieu d'un named export.

---

## 4. Documentation des types

### État actuel : Fragmentation massive

Les types sont dispersés en **4 endroits différents** :

#### A. `src/types/` — Types globaux partiels
- `Estimate.ts` : `EstimateDetails`, `Negotiation`, `CreateNegotiationInput`, etc.
- `Contract.ts` : `ContractResponse`, `CreateContractInput`, `SignContractInput`, etc.
- `Wallet.ts` : Types complets du wallet (le mieux documenté)
- `User.ts` : Type `User` basique

#### B. `src/api/graphql/types/` — Types liés aux queries
- `auth.ts` : `LogIn`, `AppLogIn`, `LoginResponse`, etc.
- `command/BookingTypes.ts` : Types complets du module booking
- `engagement/EngagementTypes.ts` : Types complets du module engagement

#### C. Types inline dans les contrôleurs (problème majeur)
Les contrôleurs suivants définissent leurs types **directement dans le fichier** et **ne les exportent pas publiquement** via `index.ts` :

| Contrôleur | Types définis localement |
|-----------|--------------------------|
| `ServiceController.ts` | `ServiceEntity`, `ServiceMediaEntity`, `CreateServiceInput`, `UpdateServiceInput`, `CreateServiceMediaInput`, etc. |
| `OrganizationController.ts` | `Organization`, `CreateOrganizationInput`, `UpdateOrganizationInput`, `OrganizationMedia`, etc. |
| `InvoiceController.ts` | `InvoiceResponse`, `CreateInvoiceResponse`, `SendInvoiceEmailInput`, etc. |
| `EstimateController.ts` | `EstimateResponse`, `CreateEstimateResponse`, etc. |
| `ProfileController.ts` | `ProfileEntity`, `CreateProfileInput`, `UpdateProfileInput`, `MediaEntity` |
| `paymentController.ts` | `Order`, `Transaction`, `Estimate` (doublon !), `PaymentIntent`, etc. |

#### D. Types dans les contrôleurs exportés mais non relayés dans index.ts
Certains contrôleurs exportent des types (`export interface`) mais `src/index.ts` ne les relaie pas tous, rendant l'utilisation difficile pour les consommateurs du SDK.

### Doublons de types critiques

| Type | Défini dans |
|------|-------------|
| `Estimate` / `EstimateResponse` | `EstimateController.ts` ET `paymentController.ts` |
| `CreateUserInput` | `SignupController.ts` ET `ManageOrganisationController.ts` |
| `MutationResponse` | `ServiceController.ts`, `AssetController.ts`, `ProfileController.ts` |
| `MediaEntity` | `AssetController.ts` ET `ProfileController.ts` |
| `UpdateContractInput` | `paymentController.ts` ET `types/Contract.ts` |

---

## 5. Failles et problèmes identifiés

### 5.1. Problèmes Structurels (Impact fort)

#### ❌ FAILLE 1 : 26 contrôleurs atomiques non regroupés
**Problème :** Le `SMPClient` instancie **25 contrôleurs distincts** (25 propriétés publiques). Le fichier fait 277 lignes et la moitié n'est que de l'instanciation répétitive. Si on ajoute un nouveau domaine, il faut toucher `SMPClient.ts`, `controllers/index.ts`, et `src/index.ts`.
```typescript
// SMPClient.ts : 25 propriétés + 25 lignes d'instanciation dans le constructeur
public service: Service;
public organization: Organization;
public estimate: Estimate;
// ... 22 autres
```

#### ❌ FAILLE 2 : Domaines métier non regroupés
**Problème :** Les contrôleurs d'un même domaine métier sont séparés . Par exemple, le domaine "Catalog" est géré par **4 contrôleurs distincts** (`Service`, `Asset`, `ServiceAsset`, `Media`) accédés via `smp.service`, `smp.asset`, `smp.media`, `smp.serviceAsset`. Il n'y a pas de notion de "Catalog" exposée au consommateur.

#### ❌ FAILLE 3 : La couche GraphQL est couplée à l'architecture interne backend
**Problème :** Les dossiers `mutations/` et `queries/` sont nommés selon les microservices backend (`accounting`, `catalog`, `command`), au lieu de refléter les domaines métier du point de vue client.

#### ❌ FAILLE 4 : Types dispersés et dupliqués
Détaillé en section 4. Il y a des doublons (ex: `Estimate` défini 2 fois, `CreateUserInput` défini 2 fois, `MutationResponse` défini 4 fois).

#### ❌ FAILLE 5 : Nommage incohérent
| Problème | Fichier |
|----------|---------|
| Nom en minuscule | `paymentController.ts` (devrait être `PaymentController.ts`) |
| Nom "Resolver" au lieu de "Controller" | `PasswordResolver.ts` |
| Casse incohérente | `Transactioncontroller.ts` |
| Suffixe `Controller` manquant | `Signup`, `Password`, `Profile`, `Location`, `Service`, `Organization`, `Invoice`, `Estimate`, `Contract`, `Wallet`, `Mailing`, `Media`, `Asset`, `Order` |

### 5.2. Problèmes de Code (Impact moyen à fort)

#### ❌ FAILLE 6 : `JSON.stringify` synchrone sur chaque réponse (Performance)
**Où :** `APIClient.ts`, méthodes `query`, `mutate`, `post`, `get`.
```typescript
const respJson = JSON.stringify(response); // Bloque l'event loop sur gros objets
this.trackDataReceived(respJson.length);
logger.info(`Total Data received : ${this.dataReceived}`);
```
**Impact :** Bloque le fil principal JavaScript sur chaque appel réseau.

#### ❌ FAILLE 7 : `localStorage` utilisé directement dans `SMPClient.logoutUser()`
**Où :** `SMPClient.ts`, lignes 168-169.
```typescript
const storedUser = localStorage.getItem("smp_user_0");   // ❌ crash SSR/Node
const refreshToken = localStorage.getItem("smp_user_refresh_token"); // ❌
```
**Impact :** Plantage garanti côté serveur (Next.js SSR, NestJS, tests Jest/Node).

#### ❌ FAILLE 8 : Bug dans `refreshAppAccessToken` (utilise le mauvais storage)
**Où :** `AuthTokenManager.ts`, ligne 165.
```typescript
private async refreshAppAccessToken(): Promise<void> {
  const refreshToken = this.userTokenStorage.getRefreshToken(); // ❌ devrait être appTokenStorage
```
Le token de refresh de l'**App** est lu depuis le storage de l'**User**. Ce bug critique fait que le refresh de l'app token échouera silencieusement ou utilisera un mauvais token.

#### ❌ FAILLE 9 : `scheduleTokenRefresh` hardcodé à 3600ms (ignore les paramètres)
**Où :** `AuthTokenManager.ts`, ligne 200.
```typescript
const triggerTime = 3600 // timeUntilExpiration - refreshDuration;  ← commenté !
```
Le refresh est toujours déclenché après 3600ms, peu importe la durée de validité du token reçue par le backend. La vraie logique est commentée.

#### ❌ FAILLE 10 : Race Condition sur le refresh de token
**Problème :** Si 5 requêtes partent en même temps avec un token expiré, 5 appels `refreshUserAccessToken` seront lancés simultanément. Aucun mutex/lock n'est en place.

#### ❌ FAILLE 11 : `authenticateUser` ne retourne pas d'erreur si déjà connecté
**Où :** `SMPClient.authenticateUser()`, lignes 103-106.
```typescript
const access = await this.getUserAccessToken();
if (access) {
  logger.info("User already authenticated");
  // ❌ Pas de return ici ! On continue et on re-authentifie quand même
}
```

#### ❌ FAILLE 12 : Logs sensibles en production
**Où :** `APIClient.ts` et `AuthTokenManager.ts`.
```typescript
console.log("GraphQL Response:", response);       // données complètes incluant tokens
console.log("Login succeed");
console.log(JSON.stringify(login));               // credentials complets en clair
console.log("REFRESH TOKEN RESPONSE", JSON.stringify(response.refreshUserToken, null, 2));
```

#### ❌ FAILLE 13 : `paymentController.ts` gère 4 domaines différents
La classe `SMPPayment` contient des méthodes qui appartiennent à des contrôleurs distincts :
- Estimations (doublon avec `EstimateController`)
- Orders (doublon partiel avec `OrderController`)
- Transactions (doublon avec `Transactioncontroller`)
- Contrats (!!)
- Paiements Stripe

#### ❌ FAILLE 14 : Incohérence dans l'accès aux données de réponse
```typescript
// Certaines méthodes accèdent à la réponse directement :
const response = await this.client.query(...) as { services: ServiceEntity[] };
return response.services;  // ✅

// D'autres enveloppent dans .data :
const response = await this.client.query(...) as { data: { serviceBySlug: ServiceEntity } };
return response.data.serviceBySlug; // 🤔 Pourquoi .data ici ?
```
Il n'est pas clair si c'est une différence dans les réponses GraphQL ou un bug.

#### ❌ FAILLE 15 : Paramères `any` non typés
```typescript
async list(pagination?: any, sort?: any, filter?: any) // très fréquent
async update(invoiceId: string, data: any)
async getByBuyerUser(buyerUserId: string) // retourne { data: { invoicesByBuyer: any[] } }
```

#### ❌ FAILLE 16 : WebSocket sans reconnexion
La méthode `initWebSocket()` crée une connexion WebSocket sans aucun mécanisme de reconnexion automatique. En cas de perte réseau, la connexion est perdue définitivement jusqu'au rechargement de la page.

### 5.3. Tests manquants

| Zone critique | Couverture actuelle |
|--------------|---------------------|
| `AuthTokenManager.refreshUserAccessToken` (race condition) | ❌ Absent |
| `AuthTokenManager.refreshAppAccessToken` (bug du mauvais storage) | ❌ Absent |
| `SMPClient.logoutUser` (crash localStorage en SSR) | ❌ Absent |
| `APIClient.checkRateLimit` | ❌ Absent |
| Tous les contrôleurs (integration tests) | ❌ Absent |

---

## 6. Proposition de refactorisation structurelle

### Philosophie

> **Regrouper par domaine métier, pas par microservice backend.**

L'objectif est que le consommateur du SDK pense en termes de **ce qu'il veut faire** (gérer un catalogue, gérer des réservations, gérer la facturation) et non pas en termes de sur quel microservice il est.

### Domaines métier proposés (7 domaines)

| Domaine SDK | Contrôleurs actuels fusionnés | Ancienne propriété SMPClient |
|-------------|-------------------------------|------------------------------|
| `catalog` | `Service` + `Asset` + `ServiceAsset` + `MediaController` | `smp.service`, `smp.asset`, `smp.serviceAsset`, `smp.media` |
| `organization` | `Organization` + `ManageOrganization` | `smp.organization`, `smp.manageOrganization` |
| `booking` | `BookingController` + `BookingConfigurationController` + `TimeSlotController` | `smp.booking`, `smp.bookingConfiguration`, `smp.timeSlot` |
| `engagement` | `EngagementController` | `smp.engagement` |
| `accounting` | `EstimateController` + `InvoiceController` + `ContractController` + `paymentController` (fragmenté) + `OrderController` + `Transactioncontroller` | `smp.estimate`, `smp.invoice`, `smp.contract`, `smp.smpPayment`, `smp.order` |
| `user` | `SignupController` + `PasswordResolver` + `ProfileController` + `WaitingListController` + `AffiliateController` | `smp.signup`, `smp.Password`, `smp.profile`, `smp.waitingList`, `smp.affiliate` |
| `communication` | `MailingController` + `NotificationController` | `smp.mailing` |

Domaines transversaux conservés tels quels :
- `location` → `smp.location` (simple, 1 contrôleur)
- `wallet` → `smp.wallet` (bien structuré, conservé)

### Règles de fusion proposées

1. **Un fichier de domaine = une classe agrégée** qui expose les sous-modules en propriétés.
2. **Les types du domaine sont centralisés** dans `src/types/{domaine}/index.ts`.
3. **Les queries/mutations GraphQL sont regroupées** par domaine métier dans `src/api/graphql/{domaine}/`.
4. Le `SMPClient` passe de **25 propriétés** à **9 propriétés** (1 par domaine).

---

## 7. Nouvelle architecture proposée

### Nouvelle arborescence

```
smp-sdk-ts/
└── src/
    ├── SMPClient.ts              ← Simplifié : 9 propriétés au lieu de 25
    ├── index.ts                  ← Exports centralisés et clairs
    ├── api/
    │   ├── APIClient.ts          ← Amélioré (interceptors, pas de JSON.stringify)
    │   └── graphql/
    │       ├── catalog/
    │       │   ├── queries.ts    ← Fusion de serviceQueries + assetQueries + serviceMediaQueries + assetMediaQueries
    │       │   └── mutations.ts  ← Fusion de serviceMutation + assetMutations + serviceMediaMutation + assetMediaMutations
    │       ├── organization/
    │       │   ├── queries.ts
    │       │   └── mutations.ts
    │       ├── booking/
    │       │   ├── queries.ts
    │       │   └── mutations.ts
    │       ├── engagement/
    │       │   ├── queries.ts
    │       │   └── mutations.ts
    │       ├── accounting/
    │       │   ├── queries.ts
    │       │   └── mutations.ts
    │       ├── user/
    │       │   ├── queries.ts
    │       │   └── mutations.ts
    │       ├── communication/
    │       │   ├── queries.ts
    │       │   └── mutations.ts
    │       ├── wallet/           ← Conservé tel quel (bien structuré)
    │       └── auth/             ← authMutations.ts conservé
    ├── domains/                  ← RENOMMÉ (anciennement "controllers/")
    │   ├── catalog/
    │   │   ├── CatalogDomain.ts  ← Agrège Service, Asset, ServiceAsset, Media
    │   │   └── index.ts
    │   ├── organization/
    │   │   ├── OrganizationDomain.ts
    │   │   └── index.ts
    │   ├── booking/
    │   │   ├── BookingDomain.ts
    │   │   └── index.ts
    │   ├── engagement/
    │   │   ├── EngagementDomain.ts
    │   │   └── index.ts
    │   ├── accounting/
    │   │   ├── AccountingDomain.ts
    │   │   └── index.ts
    │   ├── user/
    │   │   ├── UserDomain.ts
    │   │   └── index.ts
    │   ├── communication/
    │   │   ├── CommunicationDomain.ts
    │   │   └── index.ts
    │   ├── wallet/               ← Conservé tel quel
    │   │   └── WalletDomain.ts
    │   └── location/             ← Conservé tel quel
    │       └── LocationDomain.ts
    ├── types/                    ← CENTRALISÉ
    │   ├── catalog/
    │   │   └── index.ts          ← ServiceEntity, AssetEntity, ServiceMediaEntity, etc.
    │   ├── organization/
    │   │   └── index.ts          ← Organization, OrganizationMember, etc.
    │   ├── booking/
    │   │   └── index.ts          ← BookingTypes (déjà bien structuré)
    │   ├── engagement/
    │   │   └── index.ts          ← EngagementTypes (déjà bien structuré)
    │   ├── accounting/
    │   │   └── index.ts          ← Estimate, Invoice, Order, Transaction, Contract, etc.
    │   ├── user/
    │   │   └── index.ts          ← User, Profile, Signup, etc.
    │   ├── communication/
    │   │   └── index.ts          ← Campaign, Newsletter, etc.
    │   ├── wallet/               ← Déjà bien structuré
    │   │   └── index.ts
    │   ├── common/
    │   │   └── index.ts          ← MutationResponse, PaginationInput (partagés)
    │   └── index.ts              ← Re-export global
    └── auth/                     ← Inchangé mais amélioré
        ├── AuthTokenManager.ts
        ├── AuthTokenStorage.ts
        └── TokenStorageType.ts
```

### Exemple : Structure de `CatalogDomain.ts`

```typescript
// src/domains/catalog/CatalogDomain.ts

import { APIClient } from '../../api/APIClient.js';
import { catalogQueries } from '../../api/graphql/catalog/queries.js';
import { catalogMutations } from '../../api/graphql/catalog/mutations.js';
import type {
  ServiceEntity, AssetEntity, ServiceMediaEntity, AssetMediaEntity,
  CreateServiceInput, UpdateServiceInput,
  CreateAssetInput, UpdateAssetInput,
  MutationResponse
} from '../../types/catalog/index.js';

/**
 * CatalogDomain — Domaine unifié pour la gestion du catalogue.
 * Remplace : ServiceController, AssetController, ServiceAssetController, MediaController
 */
export class CatalogDomain {
  constructor(private client: APIClient) {}

  // ===================== SERVICE =====================

  async services = {
    list: (pagination?, sort?, filter?) => ...,
    getById: (id: string) => ...,
    getBySlug: (slug: string) => ...,
    create: (input: CreateServiceInput) => ...,
    update: (id: string, input: UpdateServiceInput) => ...,
    delete: (id: string) => ...,
  };

  // ===================== ASSET =====================

  async assets = {
    list: (pagination?, sort?, filter?) => ...,
    getById: (id: string) => ...,
    create: (input: CreateAssetInput) => ...,
    // ...
  };

  // ===================== SERVICE MEDIA =====================

  serviceMedias = {
    get: (id: string) => ...,
    create: (input) => ...,
    // ...
  };
}
```

### Exemple : `SMPClient.ts` après refactorisation (simplifié)

```typescript
// AVANT : 25 propriétés, ~277 lignes
export class SMPClient {
  public service: Service;
  public organization: Organization;
  public estimate: Estimate;
  public contract: Contract;
  public invoice: Invoice;
  public booking: BookingController;
  public bookingConfiguration: BookingConfigurationController;
  public engagement: EngagementController;
  public timeSlot: TimeSlotController;
  public smpPayment: SMPPayment;
  public signup: Signup;
  public Password: Password;        // ← Majuscule incohérente
  public profile: Profile;
  public location: Location;
  public manageOrganization: ManageOrganization;
  public asset: Asset;
  public serviceAsset: ServiceAsset;
  public mailing: Mailing;
  public order: Order;
  public media: Media;
  public waitingList: WaitingList;
  public wallet: Wallet;
  public affiliate: AffiliateController;
  // ...
}

// APRÈS : 9 propriétés, ~120 lignes
export class SMPClient {
  public catalog: CatalogDomain;
  public organization: OrganizationDomain;
  public booking: BookingDomain;
  public engagement: EngagementDomain;
  public accounting: AccountingDomain;
  public user: UserDomain;
  public communication: CommunicationDomain;
  public wallet: WalletDomain;    // Conservé tel quel
  public location: LocationDomain; // Conservé tel quel
}

// Usage pour le consommateur du SDK :
// AVANT :
smp.service.list()
smp.asset.listByService({ serviceID: '...' })
smp.serviceAsset.create(...)

// APRÈS :
smp.catalog.services.list()
smp.catalog.assets.listByService({ serviceID: '...' })
smp.catalog.serviceAssets.create(...)
```

---

## 8. Impact sur SMPClient et les exports

### `src/index.ts` — État actuel (problèmes)

```typescript
// Imports redondants (même module importé 2 fois)
import { statusByServices } from './api/graphql/queries/index.js';
import { serviceQueries } from './api/graphql/queries/index.js';  // doublon d'import

// Export de contenu de bas niveau (couche interne exposée publiquement)
export { SMPClient, APIClient, serviceQueries, statusByServices };

// Types exportés partiellement : pas tous les types des contrôleurs sont exportés
```

### `src/index.ts` — Version refactorisée proposée

```typescript
// Export principal
export { SMPClient } from './SMPClient.js';

// Export des types par domaine
export type * from './types/catalog/index.js';
export type * from './types/organization/index.js';
export type * from './types/booking/index.js';
export type * from './types/engagement/index.js';
export type * from './types/accounting/index.js';
export type * from './types/user/index.js';
export type * from './types/communication/index.js';
export type * from './types/wallet/index.js';
export type * from './types/common/index.js';

// Export de configuration
export type { SMPClientOptions } from './config/SMPConfig.js';
export { Persistence } from './config/Persistence.js';

// NE PAS exporter APIClient, serviceQueries, etc. (internes au SDK)
```

### Compatibilité rétrograde (breaking changes)

La refactorisation entraînera des **breaking changes** dans les applications consommatrices. Il est recommandé de :
1. Créer une branche dédiée `refactor/v2-architecture`
2. Bumper la version majeure (`v1.x.x` → `v2.0.0`)
3. Fournir une **note de migration** documentant les équivalences (ex: `smp.service.list()` → `smp.catalog.services.list()`)

---

## 9. Plan d'action priorisé pour l'agent de refactorisation

### Phase 1 : Corrections critiques (sans restructuration)
> Corrections immédiates, impact faible sur la structure

1. **Corriger le bug `refreshAppAccessToken`** : ligne 165 de `AuthTokenManager.ts`, remplacer `this.userTokenStorage` par `this.appTokenStorage`.
2. **Corriger `authenticateUser`** : Ajouter `return;` après le `logger.info("User already authenticated")`.
3. **Corriger `scheduleTokenRefresh`** : Décommenter la vraie logique de calcul du `triggerTime`.
4. **Nettoyer les logs sensibles** : Supprimer `console.log(JSON.stringify(login))` et `console.log("GraphQL Response:", response)`.
5. **Corriger `logoutUser`** : Utiliser `this.authTokenManager.userTokenStorage` au lieu de `localStorage` direct.
6. **Ajouter le mutex sur `refreshUserAccessToken`** : Utiliser une `Promise` partagée.

### Phase 2 : Centralisation des types
> Prérequis pour la Phase 3

7. **Créer `src/types/common/index.ts`** : `MutationResponse`, `PaginationInput`, `SortInput`.
8. **Créer `src/types/catalog/index.ts`** : Migrer tous les types de `ServiceController`, `AssetController`.
9. **Créer `src/types/accounting/index.ts`** : Fusionner les types d'`EstimateController`, `InvoiceController`, `paymentController`, `ContractController`.
10. **Créer `src/types/organization/index.ts`** : Types de `OrganizationController`, `ManageOrganisationController`.
11. **Créer `src/types/user/index.ts`** : Types de `SignupController`, `PasswordResolver`, `ProfileController`.
12. **Créer `src/types/communication/index.ts`** : Types de `MailingController`, `NotificationController`.

### Phase 3 : Refactorisation de la couche GraphQL
> Réorganiser sans modifier les strings GQL

13. **Créer `src/api/graphql/catalog/`** : Fusionner les queries/mutations catalog en 2 fichiers.
14. **Créer `src/api/graphql/accounting/`** : Fusionner les queries/mutations accounting.
15. **Créer `src/api/graphql/organization/`** : Fusionner organization.
16. **Créer `src/api/graphql/user/`** : Fusionner user-space + authentication.
17. **Mettre à jour les index** : `mutations/index.ts` et `queries/index.ts` avec un seul style d'export.

### Phase 4 : Refactorisation des contrôleurs en domaines
> La plus grosse phase — créer les `DomainController`

18. **Créer `CatalogDomain`** : Fusionner `Service`, `Asset`, `ServiceAsset`, `Media`.
19. **Créer `AccountingDomain`** : Décomposer `SMPPayment` et fusionner avec `Estimate`, `Invoice`, `Contract`, `Order`, `Transaction`.
20. **Créer `OrganizationDomain`** : Fusionner `Organization` + `ManageOrganization`.
21. **Créer `UserDomain`** : Fusionner `Signup`, `Password`, `Profile`, `WaitingList`, `Affiliate`.
22. **Créer `BookingDomain`** : Fusionner `Booking`, `BookingConfiguration`, `TimeSlot`.
23. **Créer `CommunicationDomain`** : Fusionner `Mailing`, `Notification`.

### Phase 5 : Mise à jour de SMPClient et exports
24. **Mettre à jour `SMPClient.ts`** : 9 propriétés, constructeur simplifié.
25. **Mettre à jour `src/index.ts`** : Exports propres, types centralisés.
26. **Supprimer `controllers/` et `graphql/` par microservice** : Remplacer par la nouvelle structure.
27. **Mettre à jour les tests existants** et en ajouter sur les zones critiques.

### Phase 6 : Performance et fiabilité de l'APIClient
28. **Supprimer `JSON.stringify` des méthodes de tracking** : Utiliser une estimation de taille ou l'en-tête HTTP.
29. **Ajouter un intercepteur Axios pour le refresh automatique** (HTTP 401) au lieu d'un `setTimeout`.
30. **Implémenter le backoff exponentiel sur le WebSocket**.

---

*Document généré le 2026-02-24. Aucune modification de code n'a été effectuée. Ce rapport est un état des lieux exhaustif destiné exclusivement à guider la phase de refactorisation.*
