import { ReviewDomain } from './index.js';
/**
 * Domaine Review lié à une identité utilisateur, pour les appels serveur (Next.js API routes)
 * où le jeton utilisateur n'est pas disponible : l'identité est assertée par une signature
 * HMAC (`x-smp-user-id` / `x-smp-user-signature`) vérifiée par mu-review.
 */
export function reviewDomainForUser(client, userID, signature) {
    return new ReviewDomain(client.withUserAssertion(userID, signature));
}
/** Domaine Review avec un jeton utilisateur (mobile / navigateur). */
export function reviewDomainWithToken(client, accessToken) {
    return new ReviewDomain(client.withUserAccessToken(accessToken));
}
