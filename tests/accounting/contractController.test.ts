import { contractQueries } from '../../src/api/graphql/accounting/queries';
import { contractMutations } from '../../src/api/graphql/accounting/mutations';
import { Contract } from '../../src/domains/accounting/ContractController';

/** Contrats — suivi, refus, relance, nouvelle version, signature de l'organisation (mu-contract). */
describe('Contract controller', () => {
  function build() {
    const client: any = { query: jest.fn(), mutate: jest.fn() };
    return { ctl: new Contract(client), client };
  }

  test("update : `contractId` (obligatoire dans le schéma) est renseigné depuis l'argument", async () => {
    const { ctl, client } = build();
    client.mutate.mockResolvedValue({ updateContract: { contractId: 'c1' } });
    await ctl.update('c1', { details: { workflowStatus: 'review' } });
    expect(client.mutate).toHaveBeenCalledWith(contractMutations.UPDATE_CONTRACT, {
      id: 'c1', data: { details: { workflowStatus: 'review' }, contractId: 'c1' },
    });
  });

  test('list lit bien le champ `getContracts` (régression : `contracts` renvoyait undefined)', async () => {
    const { ctl, client } = build();
    client.query.mockResolvedValue({ getContracts: [{ contractId: 'c1' }] });
    await expect(ctl.list()).resolves.toEqual([{ contractId: 'c1' }]);
    client.query.mockResolvedValue({});
    await expect(ctl.list()).resolves.toEqual([]);
  });

  test('send transmet notifyOnOpen et autoReminder', async () => {
    const { ctl, client } = build();
    client.mutate.mockResolvedValue({ sendContract: { success: true, message: 'ok' } });
    const data = { contractId: 'c1', email: 'camille@vertex.fr', expirationDays: 7, notifyOnOpen: true, autoReminder: true };
    await ctl.send(data);
    expect(client.mutate).toHaveBeenCalledWith(contractMutations.SEND_CONTRACT, { data });
  });

  test('reject, resendInvitation, markInvitationOpened, duplicate', async () => {
    const { ctl, client } = build();
    client.mutate.mockResolvedValueOnce({ rejectContract: { status: 'rejected' } });
    await expect(ctl.reject({ invitationToken: 'inv_a', category: 'amount_or_date', reason: '3 500 € HT' }))
      .resolves.toEqual({ status: 'rejected' });
    expect(client.mutate).toHaveBeenLastCalledWith(contractMutations.REJECT_CONTRACT, {
      data: { invitationToken: 'inv_a', category: 'amount_or_date', reason: '3 500 € HT' },
    });

    client.mutate.mockResolvedValueOnce({ resendContractInvitation: { success: true, message: 'ok', expiresAt: 'x' } });
    await expect(ctl.resendInvitation('c1')).resolves.toEqual({ success: true, message: 'ok', expiresAt: 'x' });
    // La relance ne renvoie jamais le jeton au front.
    expect(contractMutations.RESEND_CONTRACT_INVITATION).not.toContain('invitationToken');

    client.mutate.mockResolvedValueOnce({ markContractInvitationOpened: true });
    await expect(ctl.markInvitationOpened('inv_a')).resolves.toBe(true);
    client.mutate.mockResolvedValueOnce({ markContractInvitationOpened: null });
    await expect(ctl.markInvitationOpened('inv_a')).resolves.toBe(false);

    client.mutate.mockResolvedValueOnce({ duplicateContract: { contractId: 'c2' } });
    await expect(ctl.duplicate('c1')).resolves.toEqual({ contractId: 'c2' });
    expect(client.mutate).toHaveBeenLastCalledWith(contractMutations.DUPLICATE_CONTRACT, { contractId: 'c1' });
  });

  test('signature de l’organisation : lire, régler, enregistrer, retirer', async () => {
    const { ctl, client } = build();
    const settings = { organizationId: 'org1', signers: [], countersignDelayHours: 48, autoCountersign: false };
    client.query.mockResolvedValue({ organizationSignatureSettings: settings });
    await expect(ctl.getSignatureSettings('org1')).resolves.toBe(settings);
    expect(client.query).toHaveBeenCalledWith(contractQueries.GET_ORGANIZATION_SIGNATURE_SETTINGS, { organizationId: 'org1' });

    client.mutate.mockResolvedValueOnce({ updateOrganizationSignatureSettings: settings });
    await ctl.updateSignatureSettings('org1', { countersignDelayHours: 24 });
    expect(client.mutate).toHaveBeenLastCalledWith(contractMutations.UPDATE_ORGANIZATION_SIGNATURE_SETTINGS, { organizationId: 'org1', data: { countersignDelayHours: 24 } });

    client.mutate.mockResolvedValueOnce({ saveOrganizationSigner: settings });
    await ctl.saveSigner('org1', { name: 'Nora Benali', title: 'Gérante', signatureImage: 'data:image/png;base64,AAA' });
    expect(client.mutate).toHaveBeenLastCalledWith(contractMutations.SAVE_ORGANIZATION_SIGNER, {
      organizationId: 'org1', data: { name: 'Nora Benali', title: 'Gérante', signatureImage: 'data:image/png;base64,AAA' },
    });

    client.mutate.mockResolvedValueOnce({ removeOrganizationSigner: settings });
    await ctl.removeSigner('org1', 'u1');
    expect(client.mutate).toHaveBeenLastCalledWith(contractMutations.REMOVE_ORGANIZATION_SIGNER, { organizationId: 'org1', userId: 'u1' });
  });
});
