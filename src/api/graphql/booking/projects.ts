/**
 * Projets internes d'une organisation (mu-command, domaine project) : un projet est un engagement
 * interne, ses activités et livrables des engagements enfants reliés par des prérequis. L'appelant
 * est TOUJOURS l'identité signée de la requête : aucun document ne transmet d'auteur.
 * Seuls `SHARED_PROJECT_VIEW` et `SHARED_DEPOSIT` sont publics (le jeton d'un lien fait foi).
 */
const PROJECT_FIELDS = `projectId organizationId name description objective ownerUserId startAt dueAt status
  progress { total done percent late waiting plannedHours spentHours } criticalPath
  activities { activityId projectId title description type ownerUserId startAt dueAt status state dependsOn waitingOn blocking estimatedHours actualHours critical
    time { status proposedHours counterHours comment initiatedByUserId lastNudgeAt }
    issues { issueId byUserId createdAt category text newDueAt need open resolvedAt resolvedByUserId resolvedNote }
    deliverable { name url mimeType sizeBytes depositedByUserId depositedVia depositedByLabel depositedAt validatedByUserId validatedAt }
    journal { eventId at byUserId kind hours text } }`;

const SHARE_LINK_FIELDS = 'linkId targetType targetId createdAt expiresAt allowUpload revokedAt state';
const SHARED_VIEW_FIELDS = `state allowUpload targetType projectName objective organizationId
  progress { total done percent late waiting plannedHours spentHours }
  activities { activityId title type ownerUserId startAt dueAt state critical }
  prerequisiteTitles focusActivityId focusDescription deliverableReceived`;

export const projectQueries = {
  INTERNAL_PROJECTS: `query InternalProjects($organizationId: ID!) { internalProjects(organizationId: $organizationId) { ${PROJECT_FIELDS} } }`,
  INTERNAL_PROJECT: `query InternalProject($projectId: ID!) { internalProject(projectId: $projectId) { ${PROJECT_FIELDS} } }`,
  /** Projet d'une activité (lien d'une notification). */
  INTERNAL_PROJECT_OF_ACTIVITY: `query InternalProjectOfActivity($activityId: ID!) { internalProjectOfActivity(activityId: $activityId) { ${PROJECT_FIELDS} } }`,
  /** Liens de partage du projet, sans jeton ni empreinte. */
  PROJECT_SHARE_LINKS: `query ProjectShareLinks($projectId: ID!) { projectShareLinks(projectId: $projectId) { ${SHARE_LINK_FIELDS} } }`,
  /** PUBLIC : vue en lecture seule d'un projet ou d'une activité partagés par lien. */
  SHARED_PROJECT_VIEW: `query SharedProjectView($token: String!) { sharedProjectView(token: $token) { ${SHARED_VIEW_FIELDS} } }`,
};

export const projectMutations = {
  CREATE_INTERNAL_PROJECT: `mutation CreateInternalProject($input: CreateInternalProjectInput!) { createInternalProject(input: $input) { ${PROJECT_FIELDS} } }`,
  UPDATE_INTERNAL_PROJECT: `mutation UpdateInternalProject($projectId: ID!, $input: UpdateInternalProjectInput!) { updateInternalProject(projectId: $projectId, input: $input) { ${PROJECT_FIELDS} } }`,
  ADD_PROJECT_ACTIVITY: `mutation AddProjectActivity($input: AddProjectActivityInput!) { addProjectActivity(input: $input) { ${PROJECT_FIELDS} } }`,
  UPDATE_PROJECT_ACTIVITY: `mutation UpdateProjectActivity($activityId: ID!, $input: UpdateProjectActivityInput!) { updateProjectActivity(activityId: $activityId, input: $input) { ${PROJECT_FIELDS} } }`,
  /** Démarrer, terminer, mettre en pause, annuler ou rouvrir. Un livrable se termine après dépôt, par le responsable du projet. */
  PROJECT_ACTIVITY_ACTION: `mutation ProjectActivityAction($input: ProjectActivityActionInput!) { projectActivityAction(input: $input) { ${PROJECT_FIELDS} } }`,
  /** Décale l'échéance (responsable du projet) ; les activités suivantes sont poussées en cascade. */
  SHIFT_PROJECT_ACTIVITY: `mutation ShiftProjectActivity($input: ShiftProjectActivityInput!) { shiftProjectActivity(input: $input) { ${PROJECT_FIELDS} } }`,
  /** Temps alloué : set, propose, ask, accept, counter, acceptCounter, keep, nudge. */
  PROJECT_ACTIVITY_TIME: `mutation ProjectActivityTime($input: ProjectActivityTimeInput!) { projectActivityTime(input: $input) { ${PROJECT_FIELDS} } }`,
  REPORT_ACTIVITY_ISSUE: `mutation ReportActivityIssue($input: ReportActivityIssueInput!) { reportActivityIssue(input: $input) { ${PROJECT_FIELDS} } }`,
  RESOLVE_ACTIVITY_ISSUE: `mutation ResolveActivityIssue($input: ResolveActivityIssueInput!) { resolveActivityIssue(input: $input) { ${PROJECT_FIELDS} } }`,
  DEPOSIT_ACTIVITY_DELIVERABLE: `mutation DepositActivityDeliverable($input: DepositActivityDeliverableInput!) { depositActivityDeliverable(input: $input) { ${PROJECT_FIELDS} } }`,
  VALIDATE_ACTIVITY_DELIVERABLE: `mutation ValidateActivityDeliverable($activityId: ID!) { validateActivityDeliverable(activityId: $activityId) { ${PROJECT_FIELDS} } }`,
  /** Le jeton n'est renvoyé que par cette mutation. */
  CREATE_PROJECT_SHARE_LINK: `mutation CreateProjectShareLink($input: CreateProjectShareLinkInput!) { createProjectShareLink(input: $input) { linkId token expiresAt allowUpload targetType targetId } }`,
  REVOKE_PROJECT_SHARE_LINK: `mutation RevokeProjectShareLink($projectId: ID!, $linkId: ID!) { revokeProjectShareLink(projectId: $projectId, linkId: $linkId) }`,
  /** PUBLIC : dépôt d'un livrable par une personne extérieure, via un lien qui l'autorise. */
  SHARED_DEPOSIT: `mutation SharedDeposit($input: SharedDepositInput!) { sharedDeposit(input: $input) }`,
};
