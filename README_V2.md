# SMP SDK TypeScript (V2)

Bienvenue dans la documentation complète du SDK TypeScript pour l'API SMP. Ce SDK a été restructuré pour offrir une approche axée sur les **Domaines**, remplaçant l'ancienne approche par microservices.

## Table des Matières
1. [Installation](#installation)
2. [Initialisation](#initialisation)
3. [Configuration & Authentification](#configuration--authentification)
4. [Architecture des Domaines](#architecture-des-domaines)
5. [Convention de Nommage](#convention-de-nommage)
6. [Liste des Domaines et Contrôleurs](#liste-des-domaines-et-contrôleurs)
7. [Alignement avec les schémas des services](#alignement-avec-les-schémas-des-services)
8. [Gestion des Erreurs](#gestion-des-erreurs)

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
- `client.review.*`
- `client.flow.*`

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
| **Recherche** complexes avec filtres          | `search(...)` / `searchBy...` | `const services = await client.catalog.service.search(input);` |
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
- **Asset** (`client.catalog.asset`): `AssetController` - Médias associés, documents, images. `listMedias()` ne prend plus d'arguments (le service ne pagine pas).
- **ServiceAsset** (`client.catalog.serviceAsset`): `ServiceAssetController` - Liens service ↔ asset. `list({ filter: { serviceID, assetID } })` : le filtre est appliqué côté SDK (`serviceAssets` ne filtre pas) ; pour les assets détaillés d'un service, préférer `client.catalog.asset.listByServiceId(serviceID)`.
- **Media** (`client.catalog.media`): `MediaController` - Médias (mu-document) : `create`, `update`, `delete` (renvoie un booléen), `getById`, `list()` (sans pagination), `getBySlug`, `getByIds`, `getBySlugs`, `getByUniqRef`. Le type `Media` n'a pas de champ `metadata`.
- **Engagement** (`client.catalog.engagementController`): `EngagementController` - Prestations/Missions, tracking de l'évolution via `EngagementReport` (`listReportsByPeriod(year, periodType, periodValue)`). ⚠️ `listByEstimateId` n'a pas d'équivalent côté mu-command (voir [Alignement](#alignement-avec-les-schémas-des-services)).

### 3. Organization Domain (`client.organization`)
Gère les entreprises et regroupements d'utilisateurs.
- **Organization** (`client.organization.organization`): `OrganizationController` - Fiches d'organisations, types et détails administratifs. Médias : `createMedia`, `updateMedia(organizationMediaID, input)`, `deleteMedia` (les lectures `getMediaById` / `listMedias`, sans équivalent backend, ont été retirées). `delete(organizationID)` renvoie l'organisation supprimée.
- **ManageOrganization** (`client.organization.manageOrganization`): `ManageOrganization` - Invitations et membres : `updateUserRole({ organizationID, userID, newRoleID })` et `addUser({ userID, organizationID, roleID })` renvoient `{ success, message, userOrganization }` (`userOrganizationID`, `userID`, `organizationID`, `roleID`, `state`…).
- **Membership** (`client.organization.membership`): `MembershipController` - Membres d'une organisation, leurs rôles.
- **Location** (`client.organization.location`): `LocationController` - Bureaux et localisations géographiques.

### 4. Accounting Domain (`client.accounting`)
Gère la dimension financière, les portefeuilles virtuels et les paiements.
- **Contract** (`client.accounting.contract`): `ContractController` - Création et validation légale de contrats liés aux achats.
  - Suivi et nouvelles versions : `reject({ invitationToken, category, reason })` (refus du client, motif dans `details.rejection`), `resendInvitation(contractId)` (l'ancien lien est révoqué, le jeton n'est pas renvoyé), `markInvitationOpened(invitationToken)` (première ouverture du lien public), `duplicate(contractId)` (version v+1 d'un contrat figé ou refusé ; signatures à refaire).
  - Contre-signature de l'organisation : `getSignatureSettings(organizationId)`, `updateSignatureSettings(organizationId, data)` (`autoCountersign: true` exige le plan Pro, erreur `PLAN_REQUIRED`), `saveSigner(organizationId, data)` (l'appelant enregistre sa signature), `removeSigner(organizationId, userId)`.
- **Estimate** (`client.accounting.estimate`): `EstimateController` - Demandes de devis, signatures et validations.
- **Invoice** (`client.accounting.invoice`): `InvoiceController` - Génération et suivi des factures.
- **Order** (`client.accounting.order`): `OrderController` - Paniers et commandes de services. `getAgentExecutionStatus(orderId)` : suivi de l'exécution d'une commande par un agent (type `AgentExecutionStatus`).
- **Payment** (`client.accounting.smpPayment`): `PaymentController` - Transactions entrantes/sortantes et flux complexes (Stripe, etc.). `updateLine` et `listTransactions` ont été retirés ; ⚠️ `deleteLine` n'a pas d'équivalent côté mu-command.
- **Transaction** (`client.accounting.transaction`): `TransactionController` - `getById(transactionId)` (mu-billing `transaction(input: { transactionId })`, `null` si absente). Les listes par acheteur / vendeur sont sur `smpPayment` (`listTransactionsByBuyerUserId`, …).
- **Wallet** (`client.accounting.wallet`): `WalletController` - Dépôts d'argent, conversions en jetons (tokens).

### 5. User Domain (`client.user`)
Gère les profils des utilisateurs.
- **Profile** (`client.user.profile`): `ProfileController` - Paramètres de compte, avatar, dates de naissance et métadonnées individuelles (`getByUserId(userID)` ; le type `Profile` n'a pas de champ `bio`).

### 6. Booking Domain (`client.booking`)
Idéal pour la prise de rendez-vous de type coaching ou consulting.
- **Booking** (`client.booking.booking`): `BookingController` - Création de réservations sur des services, disponibilités hebdomadaires (`createWeeklyAvailabilityBatch`, `listWeeklyAvailabilities`), exceptions calendaires, créneaux (`listAvailableSlots`, `listCalendarSlots`, `getCalendarData`). ⚠️ `createEstimateRequest`, `listEstimateRequests` et `createAvailability` n'ont pas d'équivalent côté mu-command.
- **BookingConfiguration** (`client.booking.bookingConfiguration`): `BookingConfigurationController` - Paramètres de configuration (durée min/max, délais) : `create`, `update`, `getById`, `getByServiceId`.
- **TimeSlot** (`client.booking.timeSlot`): `TimeSlotController` - `create`, `update`, `delete`. Les créneaux se lisent via les engagements (`Engagement.timeSlots`) ou le calendrier du service.

### 7. Communication Domain (`client.communication`)
Gère la transmission des informations vers les utilisateurs et clients.
- **Mailing** (`client.communication.mailing`): `MailingController` - Gestion des newsletters, contacts de mailing et listes d'e-mails, campagnes.
- **Notification** (`client.communication.notification`): `NotificationController` - Suivi des événements système envoyés à l'utilisateur ciblé (App In-app notifications) : `getById` (`null` si absente), `getByUserId`, `getByOrganizationId`, `getBySlug`, `markAsRead`…
- **WaitingList** (`client.communication.waitingList`): `WaitingListController` - File d'attente : `create(CreateWaitingListInput)`, `update(id, UpdateWaitingListInput)` (partiel), `list({ page, limit, state })`. Un refus métier (`success: false`) lève une erreur portant le message du service.

### 8. Review Domain (`client.review`)
Rapports de prestation, critères, fils d'avis, performance et auto-évaluations (`reports`, `criteria`, `threads`, `performance`, `selfAssessment`).

### 9. Flow Domain (`client.flow`)
Flows de service (mu-command, module `service-flow`) — **ServiceFlow** (`client.flow.serviceFlow`): `ServiceFlowController`.
Les opérations d'organisation exigent l'appartenance à l'organisation du flow, celles de l'acheteur d'être l'acheteur de l'exécution : utiliser un client porteur de l'identité de l'utilisateur.
- Conception (organisation) : `list(organizationId, status?)`, `getById(flowId)`, `versions(flowId)`, `stats(organizationId)`, `usage(flowId, days = 30)`, `create(data)`, `updateDraft(flowId, data)`, `publish(flowId)` (erreur `FLOW_INCOMPLETE` si une étape est incomplète), `duplicate(flowId)`, `archive(flowId)`, `delete(flowId)` (brouillon sans exécution), `link(flowId, serviceId)`, `unlink(serviceId)`.
- Suivi des exécutions (organisation) : `runs(filter)`, `validateRun(runId, data?)` (contre-signe si le flow a un contrat ; erreur `NO_SAVED_SIGNATURE`), `requestChanges(runId, data)`, `refuseRun(runId, reason)`, `relaunchRun(runId)`, `closeRun(runId)`.
- Parcours acheteur : `getForService(serviceId)` (publique, `null` sans flow), `run(runId)`, `myRuns(status?)`, `activeRun(serviceId)`, `startRun(data)` (reprend l'exécution en cours), `saveStep(runId, stepKey, data)`, `completeStep(runId, stepKey, data?)` (erreur `STEP_INVALID`), `prepareContract(runId, stepKey)`, `editAnswers(runId)`, `restartRun(runId)`, `postMessage(runId, message)`.

---

### 10. Referral Domain (`client.referral`)
Apport d'affaires (mu-command, module `referral`) — **Referral** (`client.referral.referral`) : `ReferralController`.
- Prestataire : `getOffer(serviceId)`, `upsertOffer(serviceId, { enabled, commissionRate, approvalMode, terms?, attributionDays? })`, `decidePartnership(id, 'approve' | 'reject', reason?)`.
- Apporteur : `marketplace(apporteurOrganizationId, { search?, limit?, offset? })`, `requestPartnership({ serviceId, apporteurOrganizationId, message?, acceptMandate: true })`, `regenerateToken(id)`.
- Les deux : `partnerships(orgId, role, status?)`, `commissions(orgId, role, { status?, limit?, offset? })`, `stats(orgId, role)`, `revokePartnership(id, reason?)`.
- Public : `resolveToken(token)`. Attribution à la commande : `CreateOrderInput.referralToken` (revalidé par mu-command, jamais bloquant).
- Montants en centimes HT. Référence : `smp/docs/architecture/apport-affaires.md`.

### 11. Capacity Domain (`client.capacity`)
Capacité des prestations (mu-command, module `capacity`) — **Capacity** (`client.capacity.capacity`) : `CapacityController`.
- Membre de l'organisation : `getServiceCapacity(serviceId)`, `upsertServiceCapacity(serviceId, { enabled, maxActive?, maxPerPeriod?, period?, pausedUntil? })` (champ omis = conservé, `null` = limite retirée), `getOrganizationCapacity(orgId)`, `upsertOrganizationCapacity(orgId, { enabled, maxActive? })`.
- Public : `availability(serviceId)`, `availabilities(serviceIds)` (lots de 100) — sans volumes.
- Erreur `SERVICE_CAPACITY_REACHED` (`reason`, `nextAvailableAt`) sur `createOrder`, `startRun`, `restartRun`, `relaunchRun` et la soumission d'un parcours ; `SELLER_MISMATCH` si le vendeur ne correspond pas au service. Référence : `smp/docs/architecture/capacite-prestataire.md`.

## Alignement avec les schémas des services

`tests/schema/schemaAlignment.test.ts` valide chaque requête et mutation du SDK contre le supergraphe reconstitué depuis `schemas/*.graphql` (générés depuis le code des services). Toute opération qui vise un champ, un argument ou un type inexistant fait échouer le test, sauf si elle figure dans `tests/schema/legacy-misaligned.json` — liste qui ne peut que diminuer.

Opérations encore sans équivalent backend (conservées car appelées par les applications, elles échouent à l'exécution) :

| Méthode SDK | Opération | Appelants |
| --- | --- | --- |
| `accounting.smpPayment.deleteLine` | `deleteLine` | smp-webapp `app/api/payment/order/route.ts` |
| `booking.booking.createEstimateRequest` | `createEstimateRequest` | smp-webapp `app/api/booking/estimate-requests/route.ts`, smp-mobile `features/booking/booking.service.ts` |
| `booking.booking.listEstimateRequests` | `estimateRequests` | idem |
| `booking.booking.createAvailability` | `createAvailability` | smp-webapp `app/api/booking/bookings/route.ts` |
| `catalog.engagementController.listByEstimateId` | `engagementsByEstimate` | smp-webapp `app/api/engagements/route.ts` |

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
