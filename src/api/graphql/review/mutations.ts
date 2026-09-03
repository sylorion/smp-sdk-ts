import { gql } from 'graphql-request';
import { LOCALIZED_LABEL_FRAGMENT, REVIEW_COMMENT_FRAGMENT, SERVICE_REPORT_FRAGMENT } from './fragments.js';

export const reviewMutations = {
  SAVE_SERVICE_REPORT_DRAFT: gql`
    mutation SaveServiceReportDraft($serviceReportID: ID!, $input: ServiceReportInput!) {
      saveServiceReportDraft(serviceReportID: $serviceReportID, input: $input) { ...ServiceReportFields }
    }
    ${SERVICE_REPORT_FRAGMENT}
  `,
  SUBMIT_SERVICE_REPORT: gql`
    mutation SubmitServiceReport($serviceReportID: ID!, $input: ServiceReportInput!) {
      submitServiceReport(serviceReportID: $serviceReportID, input: $input) { ...ServiceReportFields }
    }
    ${SERVICE_REPORT_FRAGMENT}
  `,
  LIKE_SERVICE_REPORT: gql`
    mutation LikeServiceReport($serviceReportID: ID!) {
      likeServiceReport(serviceReportID: $serviceReportID) { ...ServiceReportFields }
    }
    ${SERVICE_REPORT_FRAGMENT}
  `,
  UNLIKE_SERVICE_REPORT: gql`
    mutation UnlikeServiceReport($serviceReportID: ID!) {
      unlikeServiceReport(serviceReportID: $serviceReportID) { ...ServiceReportFields }
    }
    ${SERVICE_REPORT_FRAGMENT}
  `,
  CREATE_REVIEW_COMMENT: gql`
    mutation CreateReviewComment($input: CreateReviewCommentInput!) {
      createReviewComment(input: $input) { ...ReviewCommentFields }
    }
    ${REVIEW_COMMENT_FRAGMENT}
  `,
  LIKE_REVIEW_COMMENT: gql`
    mutation LikeReviewComment($commentID: ID!) {
      likeReviewComment(commentID: $commentID) { ...ReviewCommentFields }
    }
    ${REVIEW_COMMENT_FRAGMENT}
  `,
  UNLIKE_REVIEW_COMMENT: gql`
    mutation UnlikeReviewComment($commentID: ID!) {
      unlikeReviewComment(commentID: $commentID) { ...ReviewCommentFields }
    }
    ${REVIEW_COMMENT_FRAGMENT}
  `,
  REACT_TO_REVIEW_COMMENT: gql`
    mutation ReactToReviewComment($commentID: ID!, $emoji: String!, $active: Boolean) {
      reactToReviewComment(commentID: $commentID, emoji: $emoji, active: $active) { ...ReviewCommentFields }
    }
    ${REVIEW_COMMENT_FRAGMENT}
  `,
  SELECT_ADDITIONAL_CRITERIA: gql`
    mutation SelectAdditionalCriteria($serviceID: ID!, $criterionKeys: [String!]!) {
      selectAdditionalCriteria(serviceID: $serviceID, criterionKeys: $criterionKeys) {
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
  SUBMIT_SELF_ASSESSMENT: gql`
    mutation SubmitSelfAssessment($input: SubmitSelfAssessmentInput!) {
      submitSelfAssessment(input: $input) {
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
};
