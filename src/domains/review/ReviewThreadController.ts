import { APIClient } from '../../api/APIClient.js';
import { reviewQueries } from '../../api/graphql/review/queries.js';
import { reviewMutations } from '../../api/graphql/review/mutations.js';
import { CreateReviewCommentInput, ReviewComment, ReviewThread } from '../../types/review/index.js';

/** Threads d'un Rapport de service : réponse du prestataire, réponses, likes, réactions emoji, GIF. */
export class ReviewThreadController {
  constructor(private readonly client: APIClient) {}

  async get(serviceReportID: string): Promise<ReviewThread> {
    const res = await this.client.query<{ reviewThread: ReviewThread }>(reviewQueries.GET_REVIEW_THREAD, { serviceReportID });
    return res.reviewThread;
  }

  async createComment(input: CreateReviewCommentInput): Promise<ReviewComment> {
    const res = await this.client.mutate<{ createReviewComment: ReviewComment }>(reviewMutations.CREATE_REVIEW_COMMENT, { input });
    return res.createReviewComment;
  }

  /** Réponse du prestataire = commentaire racine sur le rapport. */
  async reply(serviceReportID: string, content: string, gifUrl?: string): Promise<ReviewComment> {
    return this.createComment({ serviceReportID, content, gifUrl });
  }

  async like(commentID: string): Promise<ReviewComment> {
    const res = await this.client.mutate<{ likeReviewComment: ReviewComment }>(reviewMutations.LIKE_REVIEW_COMMENT, { commentID });
    return res.likeReviewComment;
  }

  async unlike(commentID: string): Promise<ReviewComment> {
    const res = await this.client.mutate<{ unlikeReviewComment: ReviewComment }>(reviewMutations.UNLIKE_REVIEW_COMMENT, { commentID });
    return res.unlikeReviewComment;
  }

  async react(commentID: string, emoji: string, active = true): Promise<ReviewComment> {
    const res = await this.client.mutate<{ reactToReviewComment: ReviewComment }>(reviewMutations.REACT_TO_REVIEW_COMMENT, { commentID, emoji, active });
    return res.reactToReviewComment;
  }
}
