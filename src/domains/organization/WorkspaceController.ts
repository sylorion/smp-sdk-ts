import { APIClient } from '../../api/APIClient.js';
import { workspaceMutations, workspaceQueries } from '../../api/graphql/organization/workspace.js';
import {
  AddOrganizationTaskCommentInput,
  AddOrganizationTaskDeliverableInput,
  AddOrganizationTaskFileInput,
  LogOrganizationTaskTimeInput,
  OrganizationTaskTimeEntry,
  PlanOrganizationTaskInput,
  SetOrganizationTaskDeliverableStatusInput,
  ChangeOrganizationTaskStatusInput,
  CreateOrganizationTaskInput,
  HandOverDossierInput,
  OrganizationTask,
  OrganizationTaskComment,
  OrganizationTaskEvent,
  OrganizationTasksFilter,
  UpdateOrganizationTaskInput,
} from '../../types/organization/workspace.js';

const decode = (raw: unknown): Record<string, unknown> | null => {
  if (typeof raw !== 'string' || !raw) return null;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};

/**
 * Espace de travail d'une organisation (tâches, commentaires internes, journal, transmission de
 * dossiers). À utiliser avec un client qui porte l'identité de l'utilisateur
 * (`APIClient.withUserAssertion` côté serveur) : le service refuse un appel anonyme.
 */
export class WorkspaceController {
  constructor(private readonly client: APIClient) {}

  async listTasks(filter: OrganizationTasksFilter): Promise<OrganizationTask[]> {
    const r = await this.client.query<{ organizationTasks: OrganizationTask[] }>(workspaceQueries.LIST_ORGANIZATION_TASKS, { filter });
    return r.organizationTasks ?? [];
  }

  async getTask(taskID: string): Promise<OrganizationTask> {
    return (await this.client.query<{ organizationTask: OrganizationTask }>(workspaceQueries.GET_ORGANIZATION_TASK, { taskID })).organizationTask;
  }

  async listEvents(taskID: string): Promise<OrganizationTaskEvent[]> {
    const r = await this.client.query<{ organizationTaskEvents: Array<Omit<OrganizationTaskEvent, 'data'> & { data: string | null }> }>(
      workspaceQueries.LIST_ORGANIZATION_TASK_EVENTS, { taskID });
    return (r.organizationTaskEvents ?? []).map((e) => ({ ...e, data: decode(e.data) }));
  }

  async listComments(filter: { organizationID: string; taskID?: string; documentType?: string; documentID?: string }): Promise<OrganizationTaskComment[]> {
    const r = await this.client.query<{ organizationTaskComments: OrganizationTaskComment[] }>(workspaceQueries.LIST_ORGANIZATION_TASK_COMMENTS, { filter });
    return r.organizationTaskComments ?? [];
  }

  async createTask(input: CreateOrganizationTaskInput): Promise<OrganizationTask> {
    return (await this.client.mutate<{ createOrganizationTask: OrganizationTask }>(workspaceMutations.CREATE_ORGANIZATION_TASK, { input })).createOrganizationTask;
  }

  async updateTask(taskID: string, input: UpdateOrganizationTaskInput): Promise<OrganizationTask> {
    return (await this.client.mutate<{ updateOrganizationTask: OrganizationTask }>(workspaceMutations.UPDATE_ORGANIZATION_TASK, { taskID, input })).updateOrganizationTask;
  }

  async changeStatus(input: ChangeOrganizationTaskStatusInput): Promise<OrganizationTask> {
    return (await this.client.mutate<{ changeOrganizationTaskStatus: OrganizationTask }>(workspaceMutations.CHANGE_ORGANIZATION_TASK_STATUS, { input })).changeOrganizationTaskStatus;
  }

  /** `assigneeUserID` absent ou null : la tâche redevient « à prendre ». */
  async assign(taskID: string, assigneeUserID?: string | null): Promise<OrganizationTask> {
    return (await this.client.mutate<{ assignOrganizationTask: OrganizationTask }>(workspaceMutations.ASSIGN_ORGANIZATION_TASK, { input: { taskID, assigneeUserID } })).assignOrganizationTask;
  }

  async deleteTask(taskID: string): Promise<boolean> {
    return (await this.client.mutate<{ deleteOrganizationTask: boolean }>(workspaceMutations.DELETE_ORGANIZATION_TASK, { taskID })).deleteOrganizationTask;
  }

  async addComment(input: AddOrganizationTaskCommentInput): Promise<OrganizationTaskComment> {
    return (await this.client.mutate<{ addOrganizationTaskComment: OrganizationTaskComment }>(workspaceMutations.ADD_ORGANIZATION_TASK_COMMENT, { input })).addOrganizationTaskComment;
  }

  async handOverDossier(input: HandOverDossierInput): Promise<OrganizationTask> {
    return (await this.client.mutate<{ handOverDossier: OrganizationTask }>(workspaceMutations.HAND_OVER_DOSSIER, { input })).handOverDossier;
  }

  /** Réserve un créneau d'agenda pour la tâche (remplace le précédent ; refusé s'il chevauche un autre point). */
  async plan(input: PlanOrganizationTaskInput): Promise<OrganizationTask> {
    return (await this.client.mutate<{ planOrganizationTask: OrganizationTask }>(workspaceMutations.PLAN_ORGANIZATION_TASK, { input })).planOrganizationTask;
  }

  async unplan(taskID: string): Promise<OrganizationTask> {
    return (await this.client.mutate<{ unplanOrganizationTask: OrganizationTask }>(workspaceMutations.UNPLAN_ORGANIZATION_TASK, { taskID })).unplanOrganizationTask;
  }

  async addDeliverable(input: AddOrganizationTaskDeliverableInput): Promise<OrganizationTask> {
    return (await this.client.mutate<{ addOrganizationTaskDeliverable: OrganizationTask }>(workspaceMutations.ADD_ORGANIZATION_TASK_DELIVERABLE, { input })).addOrganizationTaskDeliverable;
  }

  async setDeliverableStatus(input: SetOrganizationTaskDeliverableStatusInput): Promise<OrganizationTask> {
    return (await this.client.mutate<{ setOrganizationTaskDeliverableStatus: OrganizationTask }>(workspaceMutations.SET_ORGANIZATION_TASK_DELIVERABLE_STATUS, { input })).setOrganizationTaskDeliverableStatus;
  }

  async removeDeliverable(taskID: string, deliverableID: string): Promise<OrganizationTask> {
    return (await this.client.mutate<{ removeOrganizationTaskDeliverable: OrganizationTask }>(workspaceMutations.REMOVE_ORGANIZATION_TASK_DELIVERABLE, { taskID, deliverableID })).removeOrganizationTaskDeliverable;
  }

  async addFile(input: AddOrganizationTaskFileInput): Promise<OrganizationTask> {
    return (await this.client.mutate<{ addOrganizationTaskFile: OrganizationTask }>(workspaceMutations.ADD_ORGANIZATION_TASK_FILE, { input })).addOrganizationTaskFile;
  }

  async removeFile(taskID: string, fileID: string): Promise<OrganizationTask> {
    return (await this.client.mutate<{ removeOrganizationTaskFile: OrganizationTask }>(workspaceMutations.REMOVE_ORGANIZATION_TASK_FILE, { taskID, fileID })).removeOrganizationTaskFile;
  }

  async listTimeEntries(taskID: string): Promise<OrganizationTaskTimeEntry[]> {
    const r = await this.client.query<{ organizationTaskTimeEntries: OrganizationTaskTimeEntry[] }>(workspaceQueries.LIST_ORGANIZATION_TASK_TIME_ENTRIES, { taskID });
    return r.organizationTaskTimeEntries ?? [];
  }

  async logTime(input: LogOrganizationTaskTimeInput): Promise<OrganizationTaskTimeEntry> {
    return (await this.client.mutate<{ logOrganizationTaskTime: OrganizationTaskTimeEntry }>(workspaceMutations.LOG_ORGANIZATION_TASK_TIME, { input })).logOrganizationTaskTime;
  }

  async deleteTime(taskID: string, timeEntryID: string): Promise<boolean> {
    return (await this.client.mutate<{ deleteOrganizationTaskTime: boolean }>(workspaceMutations.DELETE_ORGANIZATION_TASK_TIME, { taskID, timeEntryID })).deleteOrganizationTaskTime;
  }
}
