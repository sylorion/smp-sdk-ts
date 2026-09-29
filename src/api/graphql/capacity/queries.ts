// =========================================
// Capacité des prestations (mu-command, module capacity)
// Référence : smp/docs/architecture/capacite-prestataire.md §4
// =========================================

export const SERVICE_CAPACITY_FIELDS = `
  serviceId
  organizationId
  enabled
  maxActive
  maxPerPeriod
  period
  pausedUntil
  activeCount
  periodCount
  available
  reason
  nextAvailableAt
  updatedAt
`;

export const ORGANIZATION_CAPACITY_FIELDS = `
  organizationId
  enabled
  maxActive
  activeCount
  available
  updatedAt
`;

const capacityQueries = {
  GET_SERVICE_CAPACITY: `
    query ServiceCapacity($serviceId: ID!) {
      serviceCapacity(serviceId: $serviceId) {${SERVICE_CAPACITY_FIELDS}}
    }
  `,
  GET_ORGANIZATION_CAPACITY: `
    query OrganizationCapacity($organizationId: ID!) {
      organizationCapacity(organizationId: $organizationId) {${ORGANIZATION_CAPACITY_FIELDS}}
    }
  `,
  GET_SERVICE_AVAILABILITY: `
    query ServiceAvailability($serviceId: ID!) {
      serviceAvailability(serviceId: $serviceId) { serviceId available reason nextAvailableAt }
    }
  `,
  GET_SERVICES_AVAILABILITY: `
    query ServicesAvailability($serviceIds: [ID!]!) {
      servicesAvailability(serviceIds: $serviceIds) { serviceId available reason nextAvailableAt }
    }
  `,
};

export { capacityQueries };
