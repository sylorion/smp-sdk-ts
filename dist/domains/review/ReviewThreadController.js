import { reviewQueries } from '../../api/graphql/review/queries.js';
import { reviewMutations } from '../../api/graphql/review/mutations.js';
/** Threads d'un Rapport de service : réponse du prestataire, réponses, likes, réactions emoji, GIF. */
export class ReviewThreadController {
    constructor(client) {
        this.client = client;
    }
    async get(serviceReportID) {
        const res = await this.client.query(reviewQueries.GET_REVIEW_THREAD, { serviceReportID });
        return res.reviewThread;
    }
    async createComment(input) {
        const res = await this.client.mutate(reviewMutations.CREATE_REVIEW_COMMENT, { input });
        return res.createReviewComment;
    }
    /** Réponse du prestataire = commentaire racine sur le rapport. */
    async reply(serviceReportID, content, gifUrl, asProvider) {
        return this.createComment({ serviceReportID, content, gifUrl, asProvider });
    }
    /** `asProvider` : agir en tant que prestataire quand le compte est aussi l'auteur du rapport. */
    async like(commentID, asProvider) {
        const res = await this.client.mutate(reviewMutations.LIKE_REVIEW_COMMENT, { commentID, asProvider });
        return res.likeReviewComment;
    }
    async unlike(commentID, asProvider) {
        const res = await this.client.mutate(reviewMutations.UNLIKE_REVIEW_COMMENT, { commentID, asProvider });
        return res.unlikeReviewComment;
    }
    async react(commentID, emoji, active = true, asProvider) {
        const res = await this.client.mutate(reviewMutations.REACT_TO_REVIEW_COMMENT, { commentID, emoji, active, asProvider });
        return res.reactToReviewComment;
    }
}
