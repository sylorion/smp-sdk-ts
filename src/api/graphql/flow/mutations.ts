import { SERVICE_FLOW_FIELDS, SERVICE_FLOW_RUN_FIELDS } from './fragments.js';

const serviceFlowMutations = {
  CREATE_SERVICE_FLOW: `
    mutation CreateServiceFlow($data: CreateServiceFlowInput!) {
      createServiceFlow(data: $data) {${SERVICE_FLOW_FIELDS}}
    }
  `,
  UPDATE_SERVICE_FLOW_DRAFT: `
    mutation UpdateServiceFlowDraft($flowId: ID!, $data: UpdateServiceFlowInput!) {
      updateServiceFlowDraft(flowId: $flowId, data: $data) {${SERVICE_FLOW_FIELDS}}
    }
  `,
  PUBLISH_SERVICE_FLOW: `
    mutation PublishServiceFlow($flowId: ID!) {
      publishServiceFlow(flowId: $flowId) {${SERVICE_FLOW_FIELDS}}
    }
  `,
  DUPLICATE_SERVICE_FLOW: `
    mutation DuplicateServiceFlow($flowId: ID!) {
      duplicateServiceFlow(flowId: $flowId) {${SERVICE_FLOW_FIELDS}}
    }
  `,
  ARCHIVE_SERVICE_FLOW: `
    mutation ArchiveServiceFlow($flowId: ID!) {
      archiveServiceFlow(flowId: $flowId) {${SERVICE_FLOW_FIELDS}}
    }
  `,
  DELETE_SERVICE_FLOW: `
    mutation DeleteServiceFlow($flowId: ID!) {
      deleteServiceFlow(flowId: $flowId)
    }
  `,
  LINK_SERVICE_FLOW: `
    mutation LinkServiceFlow($flowId: ID!, $serviceId: ID!) {
      linkServiceFlow(flowId: $flowId, serviceId: $serviceId) {${SERVICE_FLOW_FIELDS}}
    }
  `,
  UNLINK_SERVICE_FLOW: `
    mutation UnlinkServiceFlow($serviceId: ID!) {
      unlinkServiceFlow(serviceId: $serviceId)
    }
  `,
  START_SERVICE_FLOW_RUN: `
    mutation StartServiceFlowRun($data: StartServiceFlowRunInput!) {
      startServiceFlowRun(data: $data) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  SAVE_SERVICE_FLOW_STEP: `
    mutation SaveServiceFlowStep($runId: ID!, $stepKey: ID!, $data: JSON!) {
      saveServiceFlowStep(runId: $runId, stepKey: $stepKey, data: $data) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  COMPLETE_SERVICE_FLOW_STEP: `
    mutation CompleteServiceFlowStep($runId: ID!, $stepKey: ID!, $data: JSON) {
      completeServiceFlowStep(runId: $runId, stepKey: $stepKey, data: $data) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  PREPARE_SERVICE_FLOW_CONTRACT: `
    mutation PrepareServiceFlowContract($runId: ID!, $stepKey: ID!) {
      prepareServiceFlowContract(runId: $runId, stepKey: $stepKey) { contractId invitationToken }
    }
  `,
  EDIT_SERVICE_FLOW_RUN_ANSWERS: `
    mutation EditServiceFlowRunAnswers($runId: ID!) {
      editServiceFlowRunAnswers(runId: $runId) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  RESTART_SERVICE_FLOW_RUN: `
    mutation RestartServiceFlowRun($runId: ID!) {
      restartServiceFlowRun(runId: $runId) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  POST_SERVICE_FLOW_RUN_MESSAGE: `
    mutation PostServiceFlowRunMessage($runId: ID!, $message: String!) {
      postServiceFlowRunMessage(runId: $runId, message: $message) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  VALIDATE_SERVICE_FLOW_RUN: `
    mutation ValidateServiceFlowRun($runId: ID!, $data: ValidateServiceFlowRunInput) {
      validateServiceFlowRun(runId: $runId, data: $data) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  REQUEST_SERVICE_FLOW_CHANGES: `
    mutation RequestServiceFlowChanges($runId: ID!, $data: RequestServiceFlowChangesInput!) {
      requestServiceFlowChanges(runId: $runId, data: $data) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  REFUSE_SERVICE_FLOW_RUN: `
    mutation RefuseServiceFlowRun($runId: ID!, $reason: String!) {
      refuseServiceFlowRun(runId: $runId, reason: $reason) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  RELAUNCH_SERVICE_FLOW_RUN: `
    mutation RelaunchServiceFlowRun($runId: ID!) {
      relaunchServiceFlowRun(runId: $runId) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  CLOSE_SERVICE_FLOW_RUN: `
    mutation CloseServiceFlowRun($runId: ID!) {
      closeServiceFlowRun(runId: $runId) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
};

export { serviceFlowMutations };
