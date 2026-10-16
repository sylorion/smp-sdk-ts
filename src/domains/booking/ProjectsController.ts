import { APIClient } from '../../api/APIClient.js';
import { projectMutations, projectQueries } from '../../api/graphql/booking/projects.js';
import {
  AddProjectActivityInput,
  CreateInternalProjectInput,
  InternalProject,
  ProjectActivityAction,
  UpdateInternalProjectInput,
  UpdateProjectActivityInput,
} from '../../types/booking/projects.js';

/**
 * Projets internes d'une organisation : activités, livrables et prérequis. À utiliser avec un
 * client qui porte l'identité de l'utilisateur (`APIClient.withUserAssertion` côté serveur).
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
}
