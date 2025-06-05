export const waitingListMutations = {
  CREATE_WAITING_LIST: `
    mutation CreateWaitingList($input: WaitingListInput!) {
      createWaitingList(input: $input) {
        success
        message
        waitingList {
          waitingListID
          uniqRef
          firstName
          lastName
          email
          city
          details
          age
          jwt
          mailSent
          lastMailSentAt
          state
          slug
          createdAt
          updatedAt
        }
        errors {
          field
          message
        }
      }
    }
  `,

  UPDATE_WAITING_LIST: `
    mutation UpdateWaitingList($waitingListID: ID!, $input: WaitingListInput!) {
      updateWaitingList(waitingListID: $waitingListID, input: $input) {
        success
        message
        waitingList {
          waitingListID
          uniqRef
          firstName
          lastName
          email
          city
          details
          age
          jwt
          mailSent
          lastMailSentAt
          state
          slug
          createdAt
          updatedAt
        }
        errors {
          field
          message
        }
      }
    }
  `,

  DELETE_WAITING_LIST: `
    mutation DeleteWaitingList($waitingListID: ID!) {
      deleteWaitingList(waitingListID: $waitingListID) {
        success
        message
        errors {
          field
          message
        }
      }
    }
  `,

  CONFIRM_WAITING_LIST: `
    mutation ConfirmWaitingList($waitingListID: ID!) {
      confirmWaitingList(waitingListID: $waitingListID) {
        success
        message
        waitingList {
          waitingListID
          uniqRef
          firstName
          lastName
          email
          city
          details
          age
          jwt
          mailSent
          lastMailSentAt
          state
          slug
          createdAt
          updatedAt
        }
        errors {
          field
          message
        }
      }
    }
  `,

  RESEND_WAITING_LIST_EMAIL: `
    mutation ResendWaitingListEmail($waitingListID: ID!) {
      resendWaitingListEmail(waitingListID: $waitingListID) {
        success
        message
        waitingList {
          waitingListID
          uniqRef
          firstName
          lastName
          email
          city
          details
          age
          jwt
          mailSent
          lastMailSentAt
          state
          slug
          createdAt
          updatedAt
        }
        errors {
          field
          message
        }
      }
    }
  `
}; 