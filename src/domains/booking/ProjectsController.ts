import { APIClient } from '../../api/APIClient.js';
import { projectMutations, projectQueries } from '../../api/graphql/booking/projects.js';
import {
  AddProjectActivityInput,
  CreateInternalProjectInput,
  CreateProjectShareLinkInput,
  DepositActivityDeliverableInput,
  InternalProject,
  ProjectActivityAction,
  ProjectActivityTimeInput,
  ProjectShareLink,
  ProjectShareLinkCreated,
  ReportActivityIssueInput,
  ResolveActivityIssueInput,
  ShiftProjectActivityInput,
  SharedDepositInput,
  SharedProjectView,
  UpdateInternalProjectInput,
  UpdateProjectActivityInput,
} from '../../types/booking/projects.js';

/**
 * Projets internes d'une organisation : activités, livrables et prérequis. À utiliser avec un
 * client qui porte l'identité de l'utilisateur (`APIClient.withUserAssertion` côté serveur) — sauf
 * `sharedView` et `sharedDeposit`, publics : le jeton d'un lien de partage fait foi.
 */
export class ProjectsController {
  constructor(private readonly client: APIClient) {}

  async list(organizationId: string): Promise<InternalProject[]> {
    return (await this.client.query<{ internalProjects: InternalProject[] }>(projectQueries.INTERNAL_PROJECTS, { organizationId })).internalProjects ?? [];
  }

  async get(projectId: string): Promise<InternalProject> {
    return (await this.client.query<{ internalProject: InternalProject }>(projectQueries.INTERNAL_PROJECT, { projectId })).internalProject;
  }

  async getByActivity(activityId: string): Promise<InternalProject> {
    return (await this.client.query<{ internalProjectOfActivity: InternalProject }>(projectQueries.INTERNAL_PROJECT_OF_ACTIVITY, { activityId })).internalProjectOfActivity;
  }

  async create(input: CreateInternalProjectInput): Promise<InternalProject> {
    return (await this.client.mutate<{ createInternalProject: InternalProject }>(projectMutations.CREATE_INTERNAL_PROJECT, { input })).createInternalProject;
  }

  async update(projectId: string, input: UpdateInternalProjectInput): Promise<InternalProject> {
    return (await this.client.mutate<{ updateInternalProject: InternalProject }>(projectMutations.UPDATE_INTERNAL_PROJECT, { projectId, input })).updateInternalProject;
  }

  async addActivity(input: AddProjectActivityInput): Promise<InternalProject> {
    return (await this.client.mutate<{ addProjectActivity: InternalProject }>(projectMutations.ADD_PROJECT_ACTIVITY, { input })).addProjectActivity;
  }

  async updateActivity(activityId: string, input: UpdateProjectActivityInput): Promise<InternalProject> {
    return (await this.client.mutate<{ updateProjectActivity: InternalProject }>(projectMutations.UPDATE_PROJECT_ACTIVITY, { activityId, input })).updateProjectActivity;
  }

  async act(activityId: string, action: ProjectActivityAction): Promise<InternalProject> {
    return (await this.client.mutate<{ projectActivityAction: InternalProject }>(projectMutations.PROJECT_ACTIVITY_ACTION, { input: { activityId, action } })).projectActivityAction;
  }

  // ── Suivi collaboratif ──

  /** Décale l'échéance (responsable du projet) ; les activités suivantes sont poussées en cascade. */
  async shift(input: ShiftProjectActivityInput): Promise<InternalProject> {
    return (await this.client.mutate<{ shiftProjectActivity: InternalProject }>(projectMutations.SHIFT_PROJECT_ACTIVITY, { input })).shiftProjectActivity;
  }

  /** Temps alloué : `set`, `propose`, `ask`, `accept`, `counter`, `acceptCounter`, `keep`, `nudge`. */
  async time(input: ProjectActivityTimeInput): Promise<InternalProject> {
    return (await this.client.mutate<{ projectActivityTime: InternalProject }>(projectMutations.PROJECT_ACTIVITY_TIME, { input })).projectActivityTime;
  }

  async reportIssue(input: ReportActivityIssueInput): Promise<InternalProject> {
    return (await this.client.mutate<{ reportActivityIssue: InternalProject }>(projectMutations.REPORT_ACTIVITY_ISSUE, { input })).reportActivityIssue;
  }

  async resolveIssue(input: ResolveActivityIssueInput): Promise<InternalProject> {
    return (await this.client.mutate<{ resolveActivityIssue: InternalProject }>(projectMutations.RESOLVE_ACTIVITY_ISSUE, { input })).resolveActivityIssue;
  }

  async depositDeliverable(input: DepositActivityDeliverableInput): Promise<InternalProject> {
    return (await this.client.mutate<{ depositActivityDeliverable: InternalProject }>(projectMutations.DEPOSIT_ACTIVITY_DELIVERABLE, { input })).depositActivityDeliverable;
  }

  /** Valide le livrable déposé (responsable du projet) : termine l'activité. */
  async validateDeliverable(activityId: string): Promise<InternalProject> {
    return (await this.client.mutate<{ validateActivityDeliverable: InternalProject }>(projectMutations.VALIDATE_ACTIVITY_DELIVERABLE, { activityId })).validateActivityDeliverable;
  }

  // ── Liens de partage ──

  /** Le jeton n'est renvoyé que par cet appel. */
  async createShareLink(input: CreateProjectShareLinkInput): Promise<ProjectShareLinkCreated> {
    return (await this.client.mutate<{ createProjectShareLink: ProjectShareLinkCreated }>(projectMutations.CREATE_PROJECT_SHARE_LINK, { input })).createProjectShareLink;
  }

  async revokeShareLink(projectId: string, linkId: string): Promise<boolean> {
    return (await this.client.mutate<{ revokeProjectShareLink: boolean }>(projectMutations.REVOKE_PROJECT_SHARE_LINK, { projectId, linkId })).revokeProjectShareLink;
  }

  async shareLinks(projectId: string): Promise<ProjectShareLink[]> {
    return (await this.client.query<{ projectShareLinks: ProjectShareLink[] }>(projectQueries.PROJECT_SHARE_LINKS, { projectId })).projectShareLinks ?? [];
  }

  /** PUBLIC : vue en lecture seule d'un projet ou d'une activité partagés par lien. */
  async sharedView(token: string): Promise<SharedProjectView> {
    return (await this.client.query<{ sharedProjectView: SharedProjectView }>(projectQueries.SHARED_PROJECT_VIEW, { token })).sharedProjectView;
  }

  /** PUBLIC : dépôt d'un livrable par une personne extérieure, via un lien qui l'autorise. */
  async sharedDeposit(input: SharedDepositInput): Promise<boolean> {
    return (await this.client.mutate<{ sharedDeposit: boolean }>(projectMutations.SHARED_DEPOSIT, { input })).sharedDeposit;
  }
}
