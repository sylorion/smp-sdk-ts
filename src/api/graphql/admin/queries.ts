/**
 * Requêtes du back-office (smp-admin-webapp). Réservées aux appels de service :
 * le client doit porter `x-smp-internal-secret` (voir `withInternalSecret`).
 *  - `adminPlatformAnalytics` : mu-authentication (inscriptions, activité, plans)
 *  - `adminCommerceAnalytics` : mu-command (commandes, ventes, abonnements de service)
 */
export const adminAnalyticsQueries = {
  ADMIN_PLATFORM_ANALYTICS: /* GraphQL */ `
    query AdminPlatformAnalytics($days: Int) {
      adminPlatformAnalytics(days: $days) {
        days
        since
        generatedAt
        totalUsers
        signups
        signupsPrevious
        activeUsers
        signupSeries { date count }
        plans { plan users paying trialing monthly yearly }
        payingUsers
        trialingUsers
        recentSignups { userID username email plan createdAt }
      }
    }
  `,

  ADMIN_COMMERCE_ANALYTICS: /* GraphQL */ `
    query AdminCommerceAnalytics($days: Int, $limit: Int) {
      adminCommerceAnalytics(days: $days, limit: $limit) {
        days
        since
        generatedAt
        orders {
          created
          paid
          paidPrevious
          revenue { currency amount count }
          revenuePrevious { currency amount count }
          byStatus { status count }
          createdSeries { date count }
          paidSeries { date count }
          distinctBuyers
        }
        topServices { id count revenue { currency amount count } }
        topSellers { id count revenue { currency amount count } }
        subscriptions {
          live
          createdInPeriod
          canceledInPeriod
          byStatus { status count }
          createdSeries { date count }
          topServices { id count }
        }
      }
    }
  `,
};
