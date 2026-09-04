import { gql } from 'graphql-request';

export const LOCALIZED_LABEL_FRAGMENT = gql`
  fragment ReviewLocalizedLabel on LocalizedLabel {
    locale
    value
  }
`;

export const SERVICE_REPORT_FRAGMENT = gql`
  fragment ServiceReportFields on ServiceReport {
    serviceReportID
    sourceType
    sourceID
    serviceID
    organizationID
    providerUserID
    reviewerUserID
    reviewerName
    serviceTitle
    organizationName
    topicID
    status
    criteria {
      criterionID
      key
      labels { ...ReviewLocalizedLabel }
      descriptions { ...ReviewLocalizedLabel }
      block
      weight
      score
      comment
      order
      required
    }
    overallComment
    overallScore
    performanceScore
    wouldRecommend
    likesCount
    likedByProvider
    likedByMe
    commentsCount
    rewardAmount
    rewardStatus
    completedAt
    requestedAt
    expiresAt
    submittedAt
    publishedAt
    editableUntil
    canEdit
    createdAt
    updatedAt
  }
  ${LOCALIZED_LABEL_FRAGMENT}
`;

export const REVIEW_COMMENT_FRAGMENT = gql`
  fragment ReviewCommentFields on ReviewComment {
    commentID
    serviceReportID
    parentCommentID
    authorID
    authorRole
    content
    gifUrl
    likesCount
    likedByMe
    likedByProvider
    reactions { emoji count reactedByMe }
    createdAt
    updatedAt
  }
`;

export const PERFORMANCE_CRITERION_FRAGMENT = gql`
  fragment PerformanceCriterionFields on PerformanceCriterion {
    key
    labels { ...ReviewLocalizedLabel }
    block
    average
    count
    previousAverage
    previousCount
    changePercent
  }
  ${LOCALIZED_LABEL_FRAGMENT}
`;
