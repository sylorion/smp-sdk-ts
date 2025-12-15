export const affiliateMutations = {
  GENERATE_AFFILIATE_TOKEN: `
    mutation GenerateAffiliateToken($input: GenerateAffiliateTokenInput!) {
      generateAffiliateToken(input: $input) {
        affiliateToken
        expiresAt
        message
        errors {
          message
        }
      }
    }
  `,

  CREATE_AFFILIATE: `
    mutation CreateAffiliate($input: CreateAffiliateInput!) {
      createAffiliate(input: $input) {
        affiliateId
        affiliateToken
        email
        isValidated
        referrerUserId
        createdAt
      }
    }
  `,

  DECODE_AFFILIATE_TOKEN: `
    mutation DecodeAffiliateToken($token: String!) {
      decodeAffiliateToken(token: $token) {
        referrerUserId
        referrerUsername
        type
        createdAt
        isValid
        message
      }
    }
  `
};

