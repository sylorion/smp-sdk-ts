export declare const contactMutations: {
    CREATE_CONTACT: string;
    UPDATE_CONTACT: string;
    DELETE_CONTACT: string;
    BULK_CREATE_CONTACTS: string;
    SET_CONTACT_PRIVACY: string;
    /** Prendre un lead libre, le rendre, ou (gestionnaire) l'attribuer à un membre. Identité signée. */
    ASSIGN_CONTACT: string;
    /** Transmettre un lead à un collègue (il devient responsable et reçoit une tâche). Identité signée. */
    HAND_OVER_CONTACT: string;
};
