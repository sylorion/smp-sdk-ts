import { APIClient } from '../../api/APIClient.js';
import { adminAnalyticsQueries } from '../../api/graphql/admin/queries.js';

export const INTERNAL_SECRET_HEADER = 'x-smp-internal-secret';

export interface AdminDailyPoint { date: string; count: number }
export interface AdminAmountByCurrency { currency: string; amount: number; count: number }
export interface AdminStatusCount { status: string; count: number }
export interface AdminRankedEntry { id: string; count: number; revenue?: AdminAmountByCurrency[] }

export interface AdminPlatformAnalytics {
  days: number;
  since: string;
  generatedAt: string;
  totalUsers: number;
  signups: number;
  signupsPrevious: number;
  activeUsers: number;
  signupSeries: AdminDailyPoint[];
  plans: Array<{ plan: string; users: number; paying: number; trialing: number; monthly: number; yearly: number }>;
  payingUsers: number;
  trialingUsers: number;
  recentSignups: Array<{ userID: string; username: string; email: string; plan: string; createdAt: string }>;
}

export interface AdminCommerceAnalytics {
  days: number;
  since: string;
  generatedAt: string;
  orders: {
    created: number;
    paid: number;
    paidPrevious: number;
    revenue: AdminAmountByCurrency[];
    revenuePrevious: AdminAmountByCurrency[];
    byStatus: AdminStatusCount[];
    createdSeries: AdminDailyPoint[];
    paidSeries: AdminDailyPoint[];
    distinctBuyers: number;
  };
  topServices: AdminRankedEntry[];
  topSellers: AdminRankedEntry[];
  subscriptions: {
    live: number;
    createdInPeriod: number;
    canceledInPeriod: number;
    byStatus: AdminStatusCount[];
    createdSeries: AdminDailyPoint[];
    topServices: AdminRankedEntry[];
  };
}

/**
 * Indicateurs du back-office (mu-authentication + mu-command).
 *
 * Les requêtes sont réservées aux appels de service : appeler depuis un serveur
 * (route API Next de smp-admin-webapp) avec `withInternalSecret(secret)`, jamais
 * depuis un navigateur. Sans secret, les services répondent « Forbidden ».
 */
export class AdminAnalyticsController {
  constructor(private readonly client: APIClient) {}

  /** Copie du contrôleur dont les requêtes portent `x-smp-internal-secret` (client partagé intact). */
  withInternalSecret(secret: string): AdminAnalyticsController {
    if (!secret) throw new Error('withInternalSecret : secret de service manquant');
    return new AdminAnalyticsController(this.client.withHeaders({ [INTERNAL_SECRET_HEADER]: secret }));
  }

  /** Inscriptions, activité, plans et abonnements à la plateforme sur `days` jours (1 à 365, 30 par défaut). */
  async getPlatformAnalytics(days?: number): Promise<AdminPlatformAnalytics> {
    const response = await this.client.query<{ adminPlatformAnalytics: AdminPlatformAnalytics }>(
      adminAnalyticsQueries.ADMIN_PLATFORM_ANALYTICS,
      { days },
    );
    return response.adminPlatformAnalytics;
  }

  /** Commandes, chiffre d'affaires par devise (unités mineures), top services / vendeurs, abonnements de service. */
  async getCommerceAnalytics(days?: number, limit?: number): Promise<AdminCommerceAnalytics> {
    const response = await this.client.query<{ adminCommerceAnalytics: AdminCommerceAnalytics }>(
      adminAnalyticsQueries.ADMIN_COMMERCE_ANALYTICS,
      { days, limit },
    );
    return response.adminCommerceAnalytics;
  }
}
