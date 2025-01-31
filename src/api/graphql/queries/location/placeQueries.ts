const placeQueries = {
    GET_PLACE_BY_ID: `
        query Place($placeId: ID!) {
            place(placeID: $placeId) {
                placeID
                uniqRef
                slug
                authorID
                country
                region
                pstate
                city
                postalCode
                placeKind
                state
                createdAt
                updatedAt
                deletedAt
            }
        }
    `,
};

export { placeQueries };