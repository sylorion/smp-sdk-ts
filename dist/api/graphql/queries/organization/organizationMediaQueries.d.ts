export declare const GET_ORGANIZATION_MEDIA = "\n  query GetOrganizationMedia($organizationMediaID: ID!) {\n    organizationMedia(organizationMediaID: $organizationMediaID) {\n      organizationMediaID\n      mediaID\n      legend\n      listingPosition\n      state\n      media {\n        mediaID\n        url\n        originalName\n        finalName\n      }\n    }\n  }\n";
export declare const GET_ORGANIZATION_MEDIAS = "\n  query GetOrganizationMedias($organizationID: ID!) {\n    organizationMedias(filter: [{ field: \"organizationID\", value: $organizationID }]) {\n      organizationMediaID\n      mediaID\n      legend\n      listingPosition\n      state\n      media {\n        mediaID\n        url\n        originalName\n        finalName\n      }\n    }\n  }\n";
export declare const organizationMediaQueries: {
    GET_ORGANIZATION_MEDIA: string;
    GET_ORGANIZATION_MEDIAS: string;
};
