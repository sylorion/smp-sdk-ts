/**
 * Espace de travail de l'organisation (mu-command, domaine « Travail de l'organisation »; ex-mu-organization) : tâches, commentaires
 * internes, journal, transmission de dossiers. L'appelant est TOUJOURS l'identité signée de la
 * requête (assertion `x-smp-user-id` / jeton) : aucun document ne transmet d'auteur.
 */
const TASK_FIELDS = `taskID organizationID title description status priority creatorUserID assigneeUserID dueAt
  blockedReason blockedByTaskID documentType documentID labels position completedAt createdAt updatedAt
  estimatedHours dueHasTime origin
  planned { eventID startAt endAt }
  deliverables { deliverableID name ownerUserID dueAt status providedAt fileID createdAt }
  files { fileID type name description url fileName mimeType sizeBytes uploadedByUserID uploadedAt deliverableID }`;
const TIME_FIELDS = 'timeEntryID taskID userID startAt endAt minutes note createdAt';
const COMMENT_FIELDS = 'commentID taskID documentType documentID authorUserID content createdAt';
/** Rapport Services d'une tâche : brouillon et versions en JSON, actions déjà créées. */
const REPORT_FIELDS = 'taskID draft versions { version depositedAt depositedByUserID content } createdActions { key kind taskID }';
/** Rapport d'activité de l'équipe : faits et rapport figé en JSON. */
const ACTIVITY_REPORT_FIELDS = 'organizationID period scope facts snapshot';

export const workspaceQueries = {
  LIST_ORGANIZATION_TASKS: `query OrganizationTasks($filter: OrganizationTasksFilter!) { organizationTasks(filter: $filter) { ${TASK_FIELDS} } }`,
  GET_ORGANIZATION_TASK: `query OrganizationTask($taskID: ID!) { organizationTask(taskID: $taskID) { ${TASK_FIELDS} } }`,
  LIST_ORGANIZATION_TASK_EVENTS: `query OrganizationTaskEvents($taskID: ID!) { organizationTaskEvents(taskID: $taskID) { eventID actorUserID kind data createdAt } }`,
  LIST_ORGANIZATION_TASK_COMMENTS: `query OrganizationTaskComments($filter: OrganizationTaskCommentsFilter!) { organizationTaskComments(filter: $filter) { ${COMMENT_FIELDS} } }`,
  LIST_ORGANIZATION_TASK_TIME_ENTRIES: `query OrganizationTaskTimeEntries($taskID: ID!) { organizationTaskTimeEntries(taskID: $taskID) { ${TIME_FIELDS} } }`,
  GET_ORGANIZATION_TASK_REPORT: `query OrganizationTaskReport($taskID: ID!) { organizationTaskReport(taskID: $taskID) { ${REPORT_FIELDS} } }`,
  GET_ORGANIZATION_ACTIVITY_REPORT: `query OrganizationActivityReport($input: OrganizationActivityReportInput!) { organizationActivityReport(input: $input) { ${ACTIVITY_REPORT_FIELDS} } }`,
};

export const workspaceMutations = {
  CREATE_ORGANIZATION_TASK: `mutation CreateOrganizationTask($input: CreateOrganizationTaskInput!) { createOrganizationTask(input: $input) { ${TASK_FIELDS} } }`,
  UPDATE_ORGANIZATION_TASK: `mutation UpdateOrganizationTask($taskID: ID!, $input: UpdateOrganizationTaskInput!) { updateOrganizationTask(taskID: $taskID, input: $input) { ${TASK_FIELDS} } }`,
  CHANGE_ORGANIZATION_TASK_STATUS: `mutation ChangeOrganizationTaskStatus($input: ChangeOrganizationTaskStatusInput!) { changeOrganizationTaskStatus(input: $input) { ${TASK_FIELDS} } }`,
  ASSIGN_ORGANIZATION_TASK: `mutation AssignOrganizationTask($input: AssignOrganizationTaskInput!) { assignOrganizationTask(input: $input) { ${TASK_FIELDS} } }`,
  DELETE_ORGANIZATION_TASK: `mutation DeleteOrganizationTask($taskID: ID!) { deleteOrganizationTask(taskID: $taskID) }`,
  ADD_ORGANIZATION_TASK_COMMENT: `mutation AddOrganizationTaskComment($input: AddOrganizationTaskCommentInput!) { addOrganizationTaskComment(input: $input) { ${COMMENT_FIELDS} } }`,
  HAND_OVER_DOSSIER: `mutation HandOverDossier($input: HandOverDossierInput!) { handOverDossier(input: $input) { ${TASK_FIELDS} } }`,
  PLAN_ORGANIZATION_TASK: `mutation PlanOrganizationTask($input: PlanOrganizationTaskInput!) { planOrganizationTask(input: $input) { ${TASK_FIELDS} } }`,
  UNPLAN_ORGANIZATION_TASK: `mutation UnplanOrganizationTask($taskID: ID!) { unplanOrganizationTask(taskID: $taskID) { ${TASK_FIELDS} } }`,
  ADD_ORGANIZATION_TASK_DELIVERABLE: `mutation AddOrganizationTaskDeliverable($input: AddOrganizationTaskDeliverableInput!) { addOrganizationTaskDeliverable(input: $input) { ${TASK_FIELDS} } }`,
  SET_ORGANIZATION_TASK_DELIVERABLE_STATUS: `mutation SetOrganizationTaskDeliverableStatus($input: SetOrganizationTaskDeliverableStatusInput!) { setOrganizationTaskDeliverableStatus(input: $input) { ${TASK_FIELDS} } }`,
  REMOVE_ORGANIZATION_TASK_DELIVERABLE: `mutation RemoveOrganizationTaskDeliverable($taskID: ID!, $deliverableID: ID!) { removeOrganizationTaskDeliverable(taskID: $taskID, deliverableID: $deliverableID) { ${TASK_FIELDS} } }`,
  ADD_ORGANIZATION_TASK_FILE: `mutation AddOrganizationTaskFile($input: AddOrganizationTaskFileInput!) { addOrganizationTaskFile(input: $input) { ${TASK_FIELDS} } }`,
  REMOVE_ORGANIZATION_TASK_FILE: `mutation RemoveOrganizationTaskFile($taskID: ID!, $fileID: ID!) { removeOrganizationTaskFile(taskID: $taskID, fileID: $fileID) { ${TASK_FIELDS} } }`,
  LOG_ORGANIZATION_TASK_TIME: `mutation LogOrganizationTaskTime($input: LogOrganizationTaskTimeInput!) { logOrganizationTaskTime(input: $input) { ${TIME_FIELDS} } }`,
  DELETE_ORGANIZATION_TASK_TIME: `mutation DeleteOrganizationTaskTime($taskID: ID!, $timeEntryID: ID!) { deleteOrganizationTaskTime(taskID: $taskID, timeEntryID: $timeEntryID) }`,
  SAVE_ORGANIZATION_TASK_REPORT: `mutation SaveOrganizationTaskReport($input: SaveOrganizationTaskReportInput!) { saveOrganizationTaskReport(input: $input) { ${REPORT_FIELDS} } }`,
  EDIT_ORGANIZATION_TASK_REPORT: `mutation EditOrganizationTaskReport($input: EditOrganizationTaskReportInput!) { editOrganizationTaskReport(input: $input) { ${REPORT_FIELDS} } }`,
  DEPOSIT_ORGANIZATION_TASK_REPORT: `mutation DepositOrganizationTaskReport($taskID: ID!) { depositOrganizationTaskReport(taskID: $taskID) { ${TASK_FIELDS} } }`,
  CREATE_ORGANIZATION_TASK_REPORT_ACTIONS: `mutation CreateOrganizationTaskReportActions($input: CreateOrganizationTaskReportActionsInput!) { createOrganizationTaskReportActions(input: $input) { report { ${REPORT_FIELDS} } created { ${TASK_FIELDS} } unplannedMeetings } }`,
  SAVE_ORGANIZATION_ACTIVITY_REPORT: `mutation SaveOrganizationActivityReport($input: SaveOrganizationActivityReportInput!) { saveOrganizationActivityReport(input: $input) { ${ACTIVITY_REPORT_FIELDS} } }`,
  EDIT_ORGANIZATION_ACTIVITY_REPORT: `mutation EditOrganizationActivityReport($input: EditOrganizationActivityReportInput!) { editOrganizationActivityReport(input: $input) { ${ACTIVITY_REPORT_FIELDS} } }`,
};
