import { APIClient } from '../../api/APIClient.js';
import { capacityQueries } from '../../api/graphql/capacity/queries.js';
import { capacityMutations } from '../../api/graphql/capacity/mutations.js';
import type {
  OrganizationCapacity,
  OrganizationCapacityInput,
  ServiceAvailability,
  ServiceCapacity,
  ServiceCapacityInput,
} from '../../types/capacity/index.js';

/** Au plus 100 services par appel à `servicesAvailability`. */
export const MAX_AVAILABILITY_IDS = 100;

/**
 * Capacité des prestations (mu-command, module `capacity`).
 * Lecture et réglage : membre de l'organisation. Disponibilité : publique.
 */
export class CapacityController {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async getServiceCapacity(serviceId: string): Promise<ServiceCapacity> {
    const r = await this.client.query<{ serviceCapacity: ServiceCapacity }>(capacityQueries.GET_SERVICE_CAPACITY, { serviceId });
    return r.serviceCapacity;
  }

  async upsertServiceCapacity(serviceId: string, data: ServiceCapacityInput): Promise<ServiceCapacity> {
    const r = await this.client.mutate<{ upsertServiceCapacity: ServiceCapacity }>(capacityMutations.UPSERT_SERVICE_CAPACITY, { serviceId, data });
    return r.upsertServiceCapacity;
  }

  async getOrganizationCapacity(organizationId: string): Promise<OrganizationCapacity> {
    const r = await this.client.query<{ organizationCapacity: OrganizationCapacity }>(capacityQueries.GET_ORGANIZATION_CAPACITY, { organizationId });
    return r.organizationCapacity;
  }

  async upsertOrganizationCapacity(organizationId: string, data: OrganizationCapacityInput): Promise<OrganizationCapacity> {
    const r = await this.client.mutate<{ upsertOrganizationCapacity: OrganizationCapacity }>(
      capacityMutations.UPSERT_ORGANIZATION_CAPACITY, { organizationId, data });
    return r.upsertOrganizationCapacity;
  }

  async availability(serviceId: string): Promise<ServiceAvailability> {
    const r = await this.client.query<{ serviceAvailability: ServiceAvailability }>(capacityQueries.GET_SERVICE_AVAILABILITY, { serviceId });
    return r.serviceAvailability;
  }

  /** Disponibilité de plusieurs services (listes, catalogue) ; découpe par lots de 100, ordre conservé, doublons retirés. */
  async availabilities(serviceIds: string[]): Promise<ServiceAvailability[]> {
    const ids = [...new Set(serviceIds.filter(Boolean))];
    const out: ServiceAvailability[] = [];
    for (let i = 0; i < ids.length; i += MAX_AVAILABILITY_IDS) {
      const r = await this.client.query<{ servicesAvailability: ServiceAvailability[] }>(
        capacityQueries.GET_SERVICES_AVAILABILITY, { serviceIds: ids.slice(i, i + MAX_AVAILABILITY_IDS) });
      out.push(...(r.servicesAvailability ?? []));
    }
    return out;
  }
}
