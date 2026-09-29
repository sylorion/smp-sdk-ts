import { SERVICE_FLOW_FIELDS, SERVICE_FLOW_RUN_FIELDS } from './fragments.js';

const serviceFlowQueries = {
  GET_SERVICE_FLOWS: `
    query ServiceFlows($organizationId: ID!, $status: ServiceFlowStatus) {
      serviceFlows(organizationId: $organizationId, status: $status) {${SERVICE_FLOW_FIELDS}}
    }
  `,
  GET_SERVICE_FLOW: `
    query ServiceFlow($flowId: ID!) {
      serviceFlow(flowId: $flowId) {${SERVICE_FLOW_FIELDS}}
    }
  `,
  GET_SERVICE_FLOW_VERSIONS: `
    query ServiceFlowVersions($flowId: ID!) {
      serviceFlowVersions(flowId: $flowId) { versionId flowId version definition publishedAt publishedBy runs }
    }
  `,
  GET_SERVICE_FLOW_FOR_SERVICE: `
    query ServiceFlowForService($serviceId: ID!) {
      serviceFlowForService(serviceId: $serviceId) {
        flowId
        serviceId
        version
        steps { key type title summary count estimatedMinutes items }
        estimatedMinutes
        requiresReview
        reviewTiming
        medianValidationMinutes
        priceHoldDays
      }
    }
  `,
  GET_SERVICE_FLOW_STATS: `
    query ServiceFlowStats($organizationId: ID!) {
      serviceFlowStats(organizationId: $organizationId) {
        pendingRuns
        pendingOverSla
        started30d
        completed30d
        completionRate30d
        medianValidationMinutes
        flowsCount
        activeCount
        draftCount
        servicesCovered
      }
    }
  `,
  GET_SERVICE_FLOW_USAGE: `
    query ServiceFlowUsage($flowId: ID!, $days: Int) {
      serviceFlowUsage(flowId: $flowId, days: $days) {
        flowId
        days
        started
        funnel { stepKey type title reached }
        biggestLoss { stepKey title lost itemKey itemLabel itemAbandons }
        services { serviceId linkedAt runs30d }
        pending {${SERVICE_FLOW_RUN_FIELDS}}
      }
    }
  `,
  GET_SERVICE_FLOW_RUNS: `
    query ServiceFlowRuns($organizationId: ID!, $flowId: ID, $status: [ServiceFlowRunStatus!], $limit: Int, $offset: Int) {
      serviceFlowRuns(organizationId: $organizationId, flowId: $flowId, status: $status, limit: $limit, offset: $offset) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  GET_SERVICE_FLOW_RUN: `
    query ServiceFlowRun($runId: ID!) {
      serviceFlowRun(runId: $runId) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  GET_MY_SERVICE_FLOW_RUNS: `
    query MyServiceFlowRuns($status: [ServiceFlowRunStatus!]) {
      myServiceFlowRuns(status: $status) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
  GET_ACTIVE_SERVICE_FLOW_RUN: `
    query ActiveServiceFlowRun($serviceId: ID!) {
      activeServiceFlowRun(serviceId: $serviceId) {${SERVICE_FLOW_RUN_FIELDS}}
    }
  `,
};

export { serviceFlowQueries };
