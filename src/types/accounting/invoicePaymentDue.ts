/**
 * Montant dû pour régler une facture par lien de paiement — mu-billing `invoicePaymentDue` (C115).
 *
 * Sur une vente de la place de marché (facture d'échéance — jalon, solde —, de relevé, de commande) le
 * client règle TTC + commission de la plateforme + frais de paiement, comme au checkout ; sur une
 * facture manuelle d'un prestataire, TTC + frais de paiement seuls (la plateforme ne prend rien) ; sur
 * un complément de plan PM ou une facture de la plateforme, le TTC seul. Montants en unités mineures.
 */
export interface InvoicePaymentDue {
  invoiceId: string;
  currency: string;
  /** Commission et/ou frais de paiement repris sur cet encaissement. */
  carriesPlatformFees: boolean;
  /** Vente de la place de marché : commission de la plateforme due. */
  carriesCommission: boolean;
  /** TTC de la facture — ce que le prestataire reçoit net. */
  invoiceTotalCents: number;
  priceHTCents: number;
  vatCents: number;
  platformFeeCents: number;
  stripeFeeCents: number;
  /** Ce que le client doit régler : montant à passer à `initiatePayment`. */
  amountDueCents: number;
}
