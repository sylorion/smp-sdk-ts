import { SERVICE_CAPACITY_FIELDS, ORGANIZATION_CAPACITY_FIELDS } from './queries.js';

const capacityMutations = {
  UPSERT_SERVICE_CAPACITY: `
    mutation UpsertServiceCapacity($serviceId: ID!, $data: ServiceCapacityInput!) {
      upsertServiceCapacity(serviceId: $serviceId, data: $data) {${SERVICE_CAPACITY_FIELDS}}
    }
  `,
  UPSERT_ORGANIZATION_CAPACITY: `
    mutation UpsertOrganizationCapacity($organizationId: ID!, $data: OrganizationCapacityInput!) {
      upsertOrganizationCapacity(organizationId: $organizationId, data: $data) {${ORGANIZATION_CAPACITY_FIELDS}}
    }
  `,
};

export { capacityMutations };
