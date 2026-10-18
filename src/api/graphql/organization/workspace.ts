/**
 * Espace de travail de l'organisation (mu-command, domaine « Travail de l'organisation »; ex-mu-organization) : tâches, commentaires
 * internes, journal, transmission de dossiers. L'appelant est TOUJOURS l'identité signée de la
 * requête (assertion `x-smp-user-id` / jeton) : aucun document ne transmet d'auteur.
 */
const TASK_FIELDS = `taskID organizationID title description status priority creatorUserID assigneeUserID dueAt
  blockedReason blockedByTaskID documentType documentID labels position completedAt createdAt updatedAt`;
const COMMENT_FIELDS = 'commentID taskID documentType documentID authorUserID content createdAt';

export const workspaceQueries = {
  LIST_ORGANIZATION_TASKS: `query OrganizationTasks($filter: OrganizationTasksFilter!) { organizationTasks(filter: $filter) { ${TASK_FIELDS} } }`,
  GET_ORGANIZATION_TASK: `query OrganizationTask($taskID: ID!) { organizationTask(taskID: $taskID) { ${TASK_FIELDS} } }`,
  LIST_ORGANIZATION_TASK_EVENTS: `query OrganizationTaskEvents($taskID: ID!) { organizationTaskEvents(taskID: $taskID) { eventID actorUserID kind data createdAt } }`,
  LIST_ORGANIZATION_TASK_COMMENTS: `query OrganizationTaskComments($filter: OrganizationTaskCommentsFilter!) { organizationTaskComments(filter: $filter) { ${COMMENT_FIELDS} } }`,
};

export const workspaceMutations = {
  CREATE_ORGANIZATION_TASK: `mutation CreateOrganizationTask($input: CreateOrganizationTaskInput!) { createOrganizationTask(input: $input) { ${TASK_FIELDS} } }`,
  UPDATE_ORGANIZATION_TASK: `mutation UpdateOrganizationTask($taskID: ID!, $input: UpdateOrganizationTaskInput!) { updateOrganizationTask(taskID: $taskID, input: $input) { ${TASK_FIELDS} } }`,
  CHANGE_ORGANIZATION_TASK_STATUS: `mutation ChangeOrganizationTaskStatus($input: ChangeOrganizationTaskStatusInput!) { changeOrganizationTaskStatus(input: $input) { ${TASK_FIELDS} } }`,
  ASSIGN_ORGANIZATION_TASK: `mutation AssignOrganizationTask($input: AssignOrganizationTaskInput!) { assignOrganizationTask(input: $input) { ${TASK_FIELDS} } }`,
  DELETE_ORGANIZATION_TASK: `mutation DeleteOrganizationTask($taskID: ID!) { deleteOrganizationTask(taskID: $taskID) }`,
  ADD_ORGANIZATION_TASK_COMMENT: `mutation AddOrganizationTaskComment($input: AddOrganizationTaskCommentInput!) { addOrganizationTaskComment(input: $input) { ${COMMENT_FIELDS} } }`,
  HAND_OVER_DOSSIER: `mutation HandOverDossier($input: HandOverDossierInput!) { handOverDossier(input: $input) { ${TASK_FIELDS} } }`,
};
