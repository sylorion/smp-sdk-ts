import { waitingListMutations } from '../../api/graphql/user/mutations.js';
import { waitingListQueries } from '../../api/graphql/user/queries.js';
// Contrôleur des mutations et des requêtes pour la liste d'attente
export class WaitingList {
    constructor(client) {
        this.client = client;
    }
    // ======================= MUTATIONS =======================
    async create(input) {
        const mutation = waitingListMutations.CREATE_WAITING_LIST;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createWaitingList.waitingList;
    }
    async update(waitingListID, input) {
        const mutation = waitingListMutations.UPDATE_WAITING_LIST;
        const variables = { waitingListID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateWaitingList.waitingList;
    }
    async delete(waitingListID) {
        const mutation = waitingListMutations.DELETE_WAITING_LIST;
        const variables = { waitingListID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteWaitingList;
    }
    async confirm(waitingListID) {
        const mutation = waitingListMutations.CONFIRM_WAITING_LIST;
        const variables = { waitingListID };
        const response = await this.client.mutate(mutation, variables);
        return response.confirmWaitingList.waitingList;
    }
    async resendEmail(waitingListID) {
        const mutation = waitingListMutations.RESEND_WAITING_LIST_EMAIL;
        const variables = { waitingListID };
        const response = await this.client.mutate(mutation, variables);
        return response.resendWaitingListEmail.waitingList;
    }
    async verifyToken(token) {
        const mutation = waitingListMutations.VERIFY_WAITING_LIST_TOKEN;
        const variables = { token };
        const response = await this.client.mutate(mutation, variables);
        return response.verifyWaitingListToken.data;
    }
    // ======================= QUERIES =======================
    async getById(waitingListID) {
        const query = waitingListQueries.GET_WAITING_LIST;
        const variables = { waitingListID };
        const response = await this.client.query(query, variables);
        return response.waitingList;
    }
    async list() {
        const query = waitingListQueries.GET_WAITING_LISTS;
        const response = await this.client.query(query);
        return response.waitingLists;
    }
}
