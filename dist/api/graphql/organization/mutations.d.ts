export declare const CREATE_ORGANIZATION_MEDIA = "\n  mutation CreateOrganizationMedia($input: CreateOrganizationMediaInput!) {\n    createOrganizationMedia(input: $input) {\n      organizationMediaID\n      mediaID\n      legend\n      listingPosition\n      state\n      media {\n        mediaID\n        url\n        originalName\n        finalName\n      }\n    }\n  }\n";
export declare const UPDATE_ORGANIZATION_MEDIA = "\n  mutation UpdateOrganizationMedia($input: UpdateOrganizationMediaInput!) {\n    updateOrganizationMedia(input: $input) {\n      organizationMediaID\n      mediaID\n      legend\n      listingPosition\n      state\n      media {\n        mediaID\n        url\n        originalName\n        finalName\n      }\n    }\n  }\n";
export declare const DELETE_ORGANIZATION_MEDIA = "\n  mutation DeleteOrganizationMedia($organizationMediaID: ID!) {\n    deleteOrganizationMedia(organizationMediaID: $organizationMediaID) {\n      success\n    }\n  }\n";
export declare const organizationMediaMutations: {
    CREATE_ORGANIZATION_MEDIA: string;
    UPDATE_ORGANIZATION_MEDIA: string;
    DELETE_ORGANIZATION_MEDIA: string;
};
export declare const organizationMutations: {
    CREATE_ORGANIZATION: string;
    UPDATE_ORGANIZATION: string;
    DELETE_ORGANIZATION: string;
    VERIFY_INVITATION_TOKEN: string;
    INVITE_USER_TO_ORGANIZATION: string;
    CREATE_USER_ORGANIZATION: string;
    UPDATE_USER_ROLE_IN_ORGANIZATION: string;
    REMOVE_USER_FROM_ORGANIZATION: string;
    REMOVE_INVITATION: string;
    ADD_USER_TO_ORGANIZATION: string;
    UPDATE_MEMBER_PROFILE: string;
    RESEND_INVITATION: string;
    INITIATE_OWNER_TRANSFER: string;
    VALIDATE_OWNER_TRANSFER: string;
};
declare const userOrganizationMutations: {
    ADD_USER_TO_ORGANIZATION: string;
    REMOVE_USER_FROM_ORGANIZATION: string;
    UPDATE_USER_ROLE_IN_ORGANIZATION: string;
};
export { userOrganizationMutations };
