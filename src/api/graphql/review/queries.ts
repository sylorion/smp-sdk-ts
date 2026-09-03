import { gql } from 'graphql-request';
import { LOCALIZED_LABEL_FRAGMENT, PERFORMANCE_CRITERION_FRAGMENT, REVIEW_COMMENT_FRAGMENT, SERVICE_REPORT_FRAGMENT } from './fragments.js';

export const reviewQueries = {
  GET_SERVICE_REPORT: gql`
    query GetServiceReport($serviceReportID: ID!) {
      serviceReport(serviceReportID: $serviceReportID) { ...ServiceReportFields }
    }
    ${SERVICE_REPORT_FRAGMENT}
  `,
  GET_PENDING_SERVICE_REPORTS: gql`
    query GetPendingServiceReports($pagination: ReviewPaginationInput) {
      pendingServiceReports(pagination: $pagination) {
        items { ...ServiceReportFields }
        pageInfo { page pageSize total hasNextPage }
      }
    }
    ${SERVICE_REPORT_FRAGMENT}
  `,
  GET_MY_SERVICE_REPORTS: gql`
    query GetMyServiceReports($statuses: [ServiceReportStatus!], $pagination: ReviewPaginationInput) {
      myServiceReports(statuses: $statuses, pagination: $pagination) {
        items { ...ServiceReportFields }
        pageInfo { page pageSize total hasNextPage }
      }
    }
    ${SERVICE_REPORT_FRAGMENT}
  `,
  GET_RECEIVED_SERVICE_REPORTS: gql`
    query GetReceivedServiceReports($filter: ServiceReportsFilterInput!, $pagination: ReviewPaginationInput) {
      receivedServiceReports(filter: $filter, pagination: $pagination) {
        items { ...ServiceReportFields }
        pageInfo { page pageSize total hasNextPage }
      }
    }
    ${SERVICE_REPORT_FRAGMENT}
  `,
  GET_SERVICE_REVIEWS: gql`
    query GetServiceReviews($serviceID: ID!, $pagination: ReviewPaginationInput) {
      serviceReviews(serviceID: $serviceID, pagination: $pagination) {
        items { ...ServiceReportFields }
        pageInfo { page pageSize total hasNextPage }
      }
    }
    ${SERVICE_REPORT_FRAGMENT}
  `,
  GET_SERVICE_REVIEW_SUMMARY: gql`
    query GetServiceReviewSummary($serviceID: ID!) {
      serviceReviewSummary(serviceID: $serviceID) {
        serviceID
        reportCount
        averageRating
        performanceScore
        criteria {
          key
          labels { ...ReviewLocalizedLabel }
          block
          average
          count
          countLastMonth
        }
        distribution { score count }
        recommendationRate
        lastReportAt
      }
    }
    ${LOCALIZED_LABEL_FRAGMENT}
  `,
  GET_SERVICE_CRITERIA: gql`
    query GetServiceCriteria($serviceID: ID!, $sourceType: ServiceSourceType) {
      serviceCriteria(serviceID: $serviceID, sourceType: $sourceType) {
        serviceID
        sourceType
        topicID
        topicSlug
        maxAdditionalCriteria
        sets { criteriaSetID scope version name }
        criteria {
          criterionID
          key
          labels { ...ReviewLocalizedLabel }
          descriptions { ...ReviewLocalizedLabel }
          block
          weight
          order
          required
          criteriaSetID
          setVersion
        }
      }
    }
    ${LOCALIZED_LABEL_FRAGMENT}
  `,
  GET_CRITERIA_LIBRARY: gql`
    query GetCriteriaLibrary($block: CriterionBlock, $libraryOnly: Boolean) {
      criteriaLibrary(block: $block, libraryOnly: $libraryOnly) {
        criterionID
        key
        labels { ...ReviewLocalizedLabel }
        descriptions { ...ReviewLocalizedLabel }
        block
        isLibrary
      }
    }
    ${LOCALIZED_LABEL_FRAGMENT}
  `,
  GET_SERVICE_ADDITIONAL_CRITERIA: gql`
    query GetServiceAdditionalCriteria($serviceID: ID!) {
      serviceAdditionalCriteria(serviceID: $serviceID) {
        serviceID
        selectedBy
        createdAt
        criterion {
          criterionID
          key
          labels { ...ReviewLocalizedLabel }
          descriptions { ...ReviewLocalizedLabel }
          block
          isLibrary
        }
      }
    }
    ${LOCALIZED_LABEL_FRAGMENT}
  `,
  GET_REVIEW_THREAD: gql`
    query GetReviewThread($serviceReportID: ID!) {
      reviewThread(serviceReportID: $serviceReportID) {
        serviceReportID
        total
        comments {
          ...ReviewCommentFields
          replies {
            ...ReviewCommentFields
            replies { ...ReviewCommentFields }
          }
        }
      }
    }
    ${REVIEW_COMMENT_FRAGMENT}
  `,
  GET_SELF_ASSESSMENT: gql`
    query GetSelfAssessment($serviceID: ID!) {
      selfAssessment(serviceID: $serviceID) {
        serviceID
        currentPeriod
        canSubmit
        latest {
          selfAssessmentID
          serviceID
          organizationID
          period
          comment
          submittedAt
          ratings { key labels { ...ReviewLocalizedLabel } block selfScore clientAverage gap }
        }
      }
    }
    ${LOCALIZED_LABEL_FRAGMENT}
  `,
  GET_SELF_ASSESSMENT_HISTORY: gql`
    query GetSelfAssessmentHistory($serviceID: ID!) {
      selfAssessmentHistory(serviceID: $serviceID) {
        selfAssessmentID
        serviceID
        organizationID
        period
        comment
        submittedAt
        ratings { key labels { ...ReviewLocalizedLabel } block selfScore clientAverage gap }
      }
    }
    ${LOCALIZED_LABEL_FRAGMENT}
  `,
  GET_PERFORMANCE_OVERVIEW: gql`
    query GetPerformanceOverview($scope: PerformanceScope!, $scopeID: ID!, $range: PerformanceRangePreset) {
      performanceOverview(scope: $scope, scopeID: $scopeID, range: $range) {
        scope
        scopeID
        range
        performanceScore
        minSample
        hasEnoughData
        current { periodStart periodEnd completedCount reportCount responseRate averageRating performanceScore recommendationRate }
        previous { periodStart periodEnd completedCount reportCount responseRate averageRating performanceScore recommendationRate }
        criteria { ...PerformanceCriterionFields }
        insights { kind criterionKey title message value delta }
      }
    }
    ${PERFORMANCE_CRITERION_FRAGMENT}
  `,
  GET_PERFORMANCE_HISTORY: gql`
    query GetPerformanceHistory($scope: PerformanceScope!, $scopeID: ID!, $periodType: PerformancePeriodType, $limit: Int) {
      performanceHistory(scope: $scope, scopeID: $scopeID, periodType: $periodType, limit: $limit) {
        snapshotID
        periodType
        periodStart
        periodEnd
        completedCount
        reportCount
        responseRate
        averageRating
        performanceScore
        criteria { ...PerformanceCriterionFields }
        computedAt
      }
    }
    ${PERFORMANCE_CRITERION_FRAGMENT}
  `,
};
