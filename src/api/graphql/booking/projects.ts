/**
 * Projets internes d'une organisation (mu-command, domaine project) : un projet est un engagement
 * interne, ses activités et livrables des engagements enfants reliés par des prérequis. L'appelant
 * est TOUJOURS l'identité signée de la requête : aucun document ne transmet d'auteur.
 */
const PROJECT_FIELDS = `projectId organizationId name description objective ownerUserId startAt dueAt status
  progress { total done percent late waiting plannedHours spentHours } criticalPath
  activities { activityId projectId title description type ownerUserId startAt dueAt status state dependsOn waitingOn blocking estimatedHours actualHours critical }`;

export const projectQueries = {
  INTERNAL_PROJECTS: `query InternalProjects($organizationId: ID!) { internalProjects(organizationId: $organizationId) { ${PROJECT_FIELDS} } }`,
  INTERNAL_PROJECT: `query InternalProject($projectId: ID!) { internalProject(projectId: $projectId) { ${PROJECT_FIELDS} } }`,
  /** Projet d'une activité (lien d'une notification). */
  INTERNAL_PROJECT_OF_ACTIVITY: `query InternalProjectOfActivity($activityId: ID!) { internalProjectOfActivity(activityId: $activityId) { ${PROJECT_FIELDS} } }`,
};

export const projectMutations = {
  CREATE_INTERNAL_PROJECT: `mutation CreateInternalProject($input: CreateInternalProjectInput!) { createInternalProject(input: $input) { ${PROJECT_FIELDS} } }`,
  UPDATE_INTERNAL_PROJECT: `mutation UpdateInternalProject($projectId: ID!, $input: UpdateInternalProjectInput!) { updateInternalProject(projectId: $projectId, input: $input) { ${PROJECT_FIELDS} } }`,
  ADD_PROJECT_ACTIVITY: `mutation AddProjectActivity($input: AddProjectActivityInput!) { addProjectActivity(input: $input) { ${PROJECT_FIELDS} } }`,
  UPDATE_PROJECT_ACTIVITY: `mutation UpdateProjectActivity($activityId: ID!, $input: UpdateProjectActivityInput!) { updateProjectActivity(activityId: $activityId, input: $input) { ${PROJECT_FIELDS} } }`,
  /** Démarrer, terminer, mettre en pause, annuler ou rouvrir. */
  PROJECT_ACTIVITY_ACTION: `mutation ProjectActivityAction($input: ProjectActivityActionInput!) { projectActivityAction(input: $input) { ${PROJECT_FIELDS} } }`,
};
