export declare const CREATE_ORGANIZATION_MEDIA = "\n  mutation CreateOrganizationMedia($input: CreateOrganizationMediaInput!) {\n    createOrganizationMedia(input: $input) {\n      organizationMediaID\n      mediaID\n      legend\n      listingPosition\n      state\n      media {\n        mediaID\n        url\n        originalName\n        finalName\n      }\n    }\n  }\n";
export declare const UPDATE_ORGANIZATION_MEDIA = "\n  mutation UpdateOrganizationMedia($input: UpdateOrganizationMediaInput!) {\n    updateOrganizationMedia(input: $input) {\n      organizationMediaID\n      mediaID\n      legend\n      listingPosition\n      state\n      media {\n        mediaID\n        url\n        originalName\n        finalName\n      }\n    }\n  }\n";
export declare const DELETE_ORGANIZATION_MEDIA = "\n  mutation DeleteOrganizationMedia($organizationMediaID: ID!) {\n    deleteOrganizationMedia(organizationMediaID: $organizationMediaID) {\n      success\n    }\n  }\n";
export declare const organizationMediaMutations: {
    CREATE_ORGANIZATION_MEDIA: string;
    UPDATE_ORGANIZATION_MEDIA: string;
    DELETE_ORGANIZATION_MEDIA: string;
};
