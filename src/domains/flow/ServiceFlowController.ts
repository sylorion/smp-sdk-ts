import { APIClient } from '../../api/APIClient.js';
import { serviceFlowQueries } from '../../api/graphql/flow/queries.js';
import { serviceFlowMutations } from '../../api/graphql/flow/mutations.js';
import type {
  CreateServiceFlowInput,
  RequestServiceFlowChangesInput,
  ServiceFlow,
  ServiceFlowContractPreparation,
  ServiceFlowPublic,
  ServiceFlowRun,
  ServiceFlowRunStatus,
  ServiceFlowRunsFilter,
  ServiceFlowStats,
  ServiceFlowStatus,
  ServiceFlowStepData,
  ServiceFlowUsage,
  ServiceFlowVersion,
  StartServiceFlowRunInput,
  UpdateServiceFlowInput,
  ValidateServiceFlowRunInput,
} from '../../types/flow/index.js';

/**
 * Flows de service (mu-command, module `service-flow`).
 *
 * Les opérations d'organisation exigent l'appartenance à l'organisation du flow,
 * celles de l'acheteur exigent d'être l'acheteur de l'exécution : utiliser un
 * client porteur de l'identité de l'utilisateur (assertion signée côté BFF).
 * `getForService` est publique.
 */
export class ServiceFlowController {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  // ── Organisation : flows ─────────────────────────────────────────────

  async list(organizationId: string, status?: ServiceFlowStatus): Promise<ServiceFlow[]> {
    const r = await this.client.query<{ serviceFlows: ServiceFlow[] }>(serviceFlowQueries.GET_SERVICE_FLOWS, {
      organizationId,
      ...(status ? { status } : {}),
    });
    return r.serviceFlows ?? [];
  }

  async getById(flowId: string): Promise<ServiceFlow> {
    const r = await this.client.query<{ serviceFlow: ServiceFlow }>(serviceFlowQueries.GET_SERVICE_FLOW, { flowId });
    return r.serviceFlow;
  }

  async versions(flowId: string): Promise<ServiceFlowVersion[]> {
    const r = await this.client.query<{ serviceFlowVersions: ServiceFlowVersion[] }>(
      serviceFlowQueries.GET_SERVICE_FLOW_VERSIONS, { flowId });
    return r.serviceFlowVersions ?? [];
  }

  async stats(organizationId: string): Promise<ServiceFlowStats> {
    const r = await this.client.query<{ serviceFlowStats: ServiceFlowStats }>(
      serviceFlowQueries.GET_SERVICE_FLOW_STATS, { organizationId });
    return r.serviceFlowStats;
  }

  async usage(flowId: string, days = 30): Promise<ServiceFlowUsage> {
    const r = await this.client.query<{ serviceFlowUsage: ServiceFlowUsage }>(
      serviceFlowQueries.GET_SERVICE_FLOW_USAGE, { flowId, days });
    return r.serviceFlowUsage;
  }

  async create(data: CreateServiceFlowInput): Promise<ServiceFlow> {
    const r = await this.client.mutate<{ createServiceFlow: ServiceFlow }>(serviceFlowMutations.CREATE_SERVICE_FLOW, { data });
    return r.createServiceFlow;
  }

  async updateDraft(flowId: string, data: UpdateServiceFlowInput): Promise<ServiceFlow> {
    const r = await this.client.mutate<{ updateServiceFlowDraft: ServiceFlow }>(
      serviceFlowMutations.UPDATE_SERVICE_FLOW_DRAFT, { flowId, data });
    return r.updateServiceFlowDraft;
  }

  /** Crée une nouvelle version. Erreur `FLOW_INCOMPLETE` (extensions.reasons) si une étape est incomplète. */
  async publish(flowId: string): Promise<ServiceFlow> {
    const r = await this.client.mutate<{ publishServiceFlow: ServiceFlow }>(serviceFlowMutations.PUBLISH_SERVICE_FLOW, { flowId });
    return r.publishServiceFlow;
  }

  async duplicate(flowId: string): Promise<ServiceFlow> {
    const r = await this.client.mutate<{ duplicateServiceFlow: ServiceFlow }>(serviceFlowMutations.DUPLICATE_SERVICE_FLOW, { flowId });
    return r.duplicateServiceFlow;
  }

  async archive(flowId: string): Promise<ServiceFlow> {
    const r = await this.client.mutate<{ archiveServiceFlow: ServiceFlow }>(serviceFlowMutations.ARCHIVE_SERVICE_FLOW, { flowId });
    return r.archiveServiceFlow;
  }

  /** Brouillon sans exécution uniquement. */
  async delete(flowId: string): Promise<boolean> {
    const r = await this.client.mutate<{ deleteServiceFlow: boolean }>(serviceFlowMutations.DELETE_SERVICE_FLOW, { flowId });
    return !!r.deleteServiceFlow;
  }

  async link(flowId: string, serviceId: string): Promise<ServiceFlow> {
    const r = await this.client.mutate<{ linkServiceFlow: ServiceFlow }>(serviceFlowMutations.LINK_SERVICE_FLOW, { flowId, serviceId });
    return r.linkServiceFlow;
  }

  async unlink(serviceId: string): Promise<boolean> {
    const r = await this.client.mutate<{ unlinkServiceFlow: boolean }>(serviceFlowMutations.UNLINK_SERVICE_FLOW, { serviceId });
    return !!r.unlinkServiceFlow;
  }

  // ── Organisation : exécutions ────────────────────────────────────────

  async runs(filter: ServiceFlowRunsFilter): Promise<ServiceFlowRun[]> {
    const r = await this.client.query<{ serviceFlowRuns: ServiceFlowRun[] }>(serviceFlowQueries.GET_SERVICE_FLOW_RUNS, {
      organizationId: filter.organizationId,
      ...(filter.flowId ? { flowId: filter.flowId } : {}),
      ...(filter.status?.length ? { status: filter.status } : {}),
      ...(filter.limit != null ? { limit: filter.limit } : {}),
      ...(filter.offset != null ? { offset: filter.offset } : {}),
    });
    return r.serviceFlowRuns ?? [];
  }

  /** Contre-signe (si le flow a un contrat) et valide l'exécution. Erreur `NO_SAVED_SIGNATURE` sans signature enregistrée. */
  async validateRun(runId: string, data?: ValidateServiceFlowRunInput): Promise<ServiceFlowRun> {
    const r = await this.client.mutate<{ validateServiceFlowRun: ServiceFlowRun }>(
      serviceFlowMutations.VALIDATE_SERVICE_FLOW_RUN, { runId, ...(data ? { data } : {}) });
    return r.validateServiceFlowRun;
  }

  async requestChanges(runId: string, data: RequestServiceFlowChangesInput): Promise<ServiceFlowRun> {
    const r = await this.client.mutate<{ requestServiceFlowChanges: ServiceFlowRun }>(
      serviceFlowMutations.REQUEST_SERVICE_FLOW_CHANGES, { runId, data });
    return r.requestServiceFlowChanges;
  }

  async refuseRun(runId: string, reason: string): Promise<ServiceFlowRun> {
    const r = await this.client.mutate<{ refuseServiceFlowRun: ServiceFlowRun }>(
      serviceFlowMutations.REFUSE_SERVICE_FLOW_RUN, { runId, reason });
    return r.refuseServiceFlowRun;
  }

  async relaunchRun(runId: string): Promise<ServiceFlowRun> {
    const r = await this.client.mutate<{ relaunchServiceFlowRun: ServiceFlowRun }>(
      serviceFlowMutations.RELAUNCH_SERVICE_FLOW_RUN, { runId });
    return r.relaunchServiceFlowRun;
  }

  async closeRun(runId: string): Promise<ServiceFlowRun> {
    const r = await this.client.mutate<{ closeServiceFlowRun: ServiceFlowRun }>(
      serviceFlowMutations.CLOSE_SERVICE_FLOW_RUN, { runId });
    return r.closeServiceFlowRun;
  }

  // ── Public et acheteur ───────────────────────────────────────────────

  /** Parcours publié d'un service (fiche publique) ; `null` si le service n'a pas de flow. */
  async getForService(serviceId: string): Promise<ServiceFlowPublic | null> {
    const r = await this.client.query<{ serviceFlowForService: ServiceFlowPublic | null }>(
      serviceFlowQueries.GET_SERVICE_FLOW_FOR_SERVICE, { serviceId });
    return r.serviceFlowForService ?? null;
  }

  /** Exécution lisible par son acheteur ou par un membre de l'organisation. */
  async run(runId: string): Promise<ServiceFlowRun> {
    const r = await this.client.query<{ serviceFlowRun: ServiceFlowRun }>(serviceFlowQueries.GET_SERVICE_FLOW_RUN, { runId });
    return r.serviceFlowRun;
  }

  async myRuns(status?: ServiceFlowRunStatus[]): Promise<ServiceFlowRun[]> {
    const r = await this.client.query<{ myServiceFlowRuns: ServiceFlowRun[] }>(
      serviceFlowQueries.GET_MY_SERVICE_FLOW_RUNS, status?.length ? { status } : {});
    return r.myServiceFlowRuns ?? [];
  }

  async activeRun(serviceId: string): Promise<ServiceFlowRun | null> {
    const r = await this.client.query<{ activeServiceFlowRun: ServiceFlowRun | null }>(
      serviceFlowQueries.GET_ACTIVE_SERVICE_FLOW_RUN, { serviceId });
    return r.activeServiceFlowRun ?? null;
  }

  /** Démarre l'exécution, ou renvoie celle en cours pour ce service (reprise). */
  async startRun(data: StartServiceFlowRunInput): Promise<ServiceFlowRun> {
    const r = await this.client.mutate<{ startServiceFlowRun: ServiceFlowRun }>(serviceFlowMutations.START_SERVICE_FLOW_RUN, { data });
    return r.startServiceFlowRun;
  }

  /** Brouillon d'une étape (sauvegarde automatique). */
  async saveStep(runId: string, stepKey: string, data: ServiceFlowStepData): Promise<ServiceFlowRun> {
    const r = await this.client.mutate<{ saveServiceFlowStep: ServiceFlowRun }>(
      serviceFlowMutations.SAVE_SERVICE_FLOW_STEP, { runId, stepKey, data });
    return r.saveServiceFlowStep;
  }

  /** Franchit une étape. Erreur `STEP_INVALID` (extensions.errors) si des réponses manquent. */
  async completeStep(runId: string, stepKey: string, data?: ServiceFlowStepData): Promise<ServiceFlowRun> {
    const r = await this.client.mutate<{ completeServiceFlowStep: ServiceFlowRun }>(
      serviceFlowMutations.COMPLETE_SERVICE_FLOW_STEP, { runId, stepKey, ...(data !== undefined ? { data } : {}) });
    return r.completeServiceFlowStep;
  }

  /** Prépare le contrat pré-rempli et renvoie le jeton de signature (non envoyé par e-mail). */
  async prepareContract(runId: string, stepKey: string): Promise<ServiceFlowContractPreparation> {
    const r = await this.client.mutate<{ prepareServiceFlowContract: ServiceFlowContractPreparation }>(
      serviceFlowMutations.PREPARE_SERVICE_FLOW_CONTRACT, { runId, stepKey });
    return r.prepareServiceFlowContract;
  }

  /** « Modifier mes réponses » : annule le contrat signé et rouvre le parcours. */
  async editAnswers(runId: string): Promise<ServiceFlowRun> {
    const r = await this.client.mutate<{ editServiceFlowRunAnswers: ServiceFlowRun }>(
      serviceFlowMutations.EDIT_SERVICE_FLOW_RUN_ANSWERS, { runId });
    return r.editServiceFlowRunAnswers;
  }

  async restartRun(runId: string): Promise<ServiceFlowRun> {
    const r = await this.client.mutate<{ restartServiceFlowRun: ServiceFlowRun }>(
      serviceFlowMutations.RESTART_SERVICE_FLOW_RUN, { runId });
    return r.restartServiceFlowRun;
  }

  async postMessage(runId: string, message: string): Promise<ServiceFlowRun> {
    const r = await this.client.mutate<{ postServiceFlowRunMessage: ServiceFlowRun }>(
      serviceFlowMutations.POST_SERVICE_FLOW_RUN_MESSAGE, { runId, message });
    return r.postServiceFlowRunMessage;
  }
}
