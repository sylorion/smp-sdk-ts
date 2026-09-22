import { APIClient } from '../../api/APIClient.js';
import { CreateReviewCommentInput, ReviewComment, ReviewThread } from '../../types/review/index.js';
/** Threads d'un Rapport de service : réponse du prestataire, réponses, likes, réactions emoji, GIF. */
export declare class ReviewThreadController {
    private readonly client;
    constructor(client: APIClient);
    get(serviceReportID: string): Promise<ReviewThread>;
    createComment(input: CreateReviewCommentInput): Promise<ReviewComment>;
    /** Réponse du prestataire = commentaire racine sur le rapport. */
    reply(serviceReportID: string, content: string, gifUrl?: string, asProvider?: boolean): Promise<ReviewComment>;
    /** `asProvider` : agir en tant que prestataire quand le compte est aussi l'auteur du rapport. */
    like(commentID: string, asProvider?: boolean): Promise<ReviewComment>;
    unlike(commentID: string, asProvider?: boolean): Promise<ReviewComment>;
    react(commentID: string, emoji: string, active?: boolean, asProvider?: boolean): Promise<ReviewComment>;
}
