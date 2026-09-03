/**
 * Types du domaine Review — Rapports de service, critères, threads, auto-évaluation, performance.
 * Miroir du schéma GraphQL de mu-review (subgraph `Review`). Source de vérité pour webapp et mobile.
 */

export type ServiceSourceType = 'engagement' | 'booking' | 'order' | 'agent';
export type ServiceReportStatus = 'pending' | 'draft' | 'submitted' | 'published' | 'expired' | 'cancelled';
export type CriterionBlock = 'COMMON' | 'SPECIFIC' | 'CUSTOM';
export type CriteriaSetScope = 'GLOBAL' | 'TOPIC' | 'SUBTOPIC' | 'SERVICE_TYPE';
export type CommentAuthorRole = 'client' | 'provider' | 'other';
export type PerformanceScope = 'service' | 'organization';
export type PerformancePeriodType = 'day' | 'week' | 'month';
export type PerformanceRangePreset = '7d' | '30d' | '3m' | '6m' | '12m' | 'all';
export type PerformanceInsightKind = 'strength' | 'weakness' | 'progression' | 'regression' | 'perception_gap' | 'context';
export type ReviewRewardStatus = 'requested' | 'granted' | 'failed' | 'cancelled';

/** Échelle de notation : /5 par pas de 0,5 (le centre du radar = 1, l'extrémité = 5). */
export const REVIEW_SCORE_MIN = 1;
export const REVIEW_SCORE_MAX = 5;
export const REVIEW_SCORE_STEP = 0.5;
export const REVIEW_REWARD_CREDITS = 10;

export interface LocalizedLabel {
  locale: string;
  value: string;
}

export interface ReviewCriterion {
  criterionID: string;
  key: string;
  labels: LocalizedLabel[];
  descriptions: LocalizedLabel[];
  block: CriterionBlock;
  isLibrary: boolean;
}

export interface ResolvedCriterion {
  criterionID: string;
  key: string;
  labels: LocalizedLabel[];
  descriptions: LocalizedLabel[];
  block: CriterionBlock;
  weight: number;
  order: number;
  required: boolean;
  criteriaSetID?: string | null;
  setVersion?: number | null;
}

export interface CriteriaSetReference {
  criteriaSetID: string;
  scope: CriteriaSetScope;
  version: number;
  name: string;
}

export interface ServiceCriteria {
  serviceID: string;
  sourceType: ServiceSourceType;
  topicID?: string | null;
  topicSlug?: string | null;
  criteria: ResolvedCriterion[];
  sets: CriteriaSetReference[];
  maxAdditionalCriteria: number;
}

export interface ServiceCriterionSelection {
  serviceID: string;
  criterion: ReviewCriterion;
  selectedBy: string;
  createdAt: string;
}

export interface CriterionRating {
  criterionID: string;
  key: string;
  labels: LocalizedLabel[];
  block: CriterionBlock;
  weight: number;
  score?: number | null;
  comment?: string | null;
  order: number;
  required: boolean;
}

export interface ServiceReport {
  serviceReportID: string;
  sourceType: ServiceSourceType;
  sourceID: string;
  serviceID: string;
  organizationID: string;
  providerUserID?: string | null;
  reviewerUserID: string;
  reviewerName?: string | null;
  serviceTitle?: string | null;
  organizationName?: string | null;
  topicID?: string | null;
  status: ServiceReportStatus;
  criteria: CriterionRating[];
  overallComment?: string | null;
  /** Note publique /5 (2 décimales). */
  overallScore?: number | null;
  /** Performance Score /100 — renvoyé uniquement au prestataire / admin. */
  performanceScore?: number | null;
  wouldRecommend?: boolean | null;
  likesCount: number;
  likedByProvider: boolean;
  likedByMe?: boolean | null;
  commentsCount: number;
  rewardAmount: number;
  rewardStatus?: ReviewRewardStatus | string | null;
  completedAt: string;
  requestedAt: string;
  expiresAt?: string | null;
  submittedAt?: string | null;
  publishedAt?: string | null;
  editableUntil?: string | null;
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewPageInfo {
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
}

export interface ServiceReportPage {
  items: ServiceReport[];
  pageInfo: ReviewPageInfo;
}

export interface ReviewPaginationInput {
  page?: number;
  pageSize?: number;
}

export interface CriterionRatingInput {
  key: string;
  score: number;
  comment?: string;
}

export interface ServiceReportInput {
  ratings: CriterionRatingInput[];
  overallComment?: string;
  wouldRecommend?: boolean;
}

export interface ServiceReportsFilterInput {
  serviceID?: string;
  organizationID?: string;
  statuses?: ServiceReportStatus[];
}

export interface CriterionAverage {
  key: string;
  labels: LocalizedLabel[];
  block: CriterionBlock;
  average?: number | null;
  count: number;
  countLastMonth: number;
}

export interface RatingBucket {
  score: number;
  count: number;
}

export interface ServiceReviewSummary {
  serviceID: string;
  reportCount: number;
  averageRating?: number | null;
  performanceScore?: number | null;
  criteria: CriterionAverage[];
  distribution: RatingBucket[];
  recommendationRate?: number | null;
  lastReportAt?: string | null;
}

export interface ReviewCommentReaction {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export interface ReviewComment {
  commentID: string;
  serviceReportID: string;
  parentCommentID?: string | null;
  authorID: string;
  authorRole: CommentAuthorRole;
  content: string;
  gifUrl?: string | null;
  likesCount: number;
  likedByMe: boolean;
  likedByProvider: boolean;
  reactions: ReviewCommentReaction[];
  replies: ReviewComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewThread {
  serviceReportID: string;
  comments: ReviewComment[];
  total: number;
}

export interface CreateReviewCommentInput {
  serviceReportID: string;
  parentCommentID?: string;
  content: string;
  gifUrl?: string;
}

export interface SelfAssessmentRating {
  key: string;
  labels: LocalizedLabel[];
  block: CriterionBlock;
  selfScore: number;
  clientAverage?: number | null;
  gap?: number | null;
}

export interface SelfAssessment {
  selfAssessmentID: string;
  serviceID: string;
  organizationID: string;
  period: string;
  comment?: string | null;
  ratings: SelfAssessmentRating[];
  submittedAt: string;
}

export interface SelfAssessmentStatus {
  serviceID: string;
  currentPeriod: string;
  canSubmit: boolean;
  latest?: SelfAssessment | null;
}

export interface SubmitSelfAssessmentInput {
  serviceID: string;
  ratings: { key: string; score: number }[];
  comment?: string;
}

export interface PerformanceCriterion {
  key: string;
  labels: LocalizedLabel[];
  block: CriterionBlock;
  average?: number | null;
  count: number;
  previousAverage?: number | null;
  previousCount: number;
  changePercent?: number | null;
}

export interface PerformanceInsight {
  kind: PerformanceInsightKind | string;
  criterionKey?: string | null;
  title: string;
  message: string;
  value?: number | null;
  delta?: number | null;
}

export interface PerformancePeriodStats {
  periodStart: string;
  periodEnd: string;
  completedCount: number;
  reportCount: number;
  responseRate?: number | null;
  averageRating?: number | null;
  performanceScore?: number | null;
  recommendationRate?: number | null;
}

export interface PerformanceOverview {
  scope: PerformanceScope;
  scopeID: string;
  range: PerformanceRangePreset;
  performanceScore?: number | null;
  current: PerformancePeriodStats;
  previous: PerformancePeriodStats;
  criteria: PerformanceCriterion[];
  insights: PerformanceInsight[];
  minSample: number;
  hasEnoughData: boolean;
}

export interface PerformanceSnapshot {
  snapshotID: string;
  periodType: PerformancePeriodType;
  periodStart: string;
  periodEnd: string;
  completedCount: number;
  reportCount: number;
  responseRate?: number | null;
  averageRating?: number | null;
  performanceScore?: number | null;
  criteria: PerformanceCriterion[];
  computedAt: string;
}
