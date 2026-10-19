import { ContactController } from '../../src/domains/organization';
import { contactMutations } from '../../src/api/graphql/organization/contactMutations';
import { contactQueries } from '../../src/api/graphql/organization/contactQueries';

describe('ContactController — CRM', () => {
  const client = () => ({
    query: jest.fn(async () => ({ organizationContacts: [{ contactID: 'c1', assigneeUserID: 'u1' }] })),
    mutate: jest.fn(async () => ({ assignOrganizationContact: { contactID: 'c1' }, handOverOrganizationContact: { contactID: 'c1', assigneeUserID: 'u2' } })),
  });

  it('liste avec le filtre de responsable et lit assigneeUserID', async () => {
    const c = client();
    const rows = await new ContactController(c as any).list('org1', 'u1', { assignee: 'me', status: 'lead' });
    expect(c.query).toHaveBeenCalledWith(contactQueries.GET_ORGANIZATION_CONTACTS, { organizationID: 'org1', callerUserID: 'u1', assignee: 'me', status: 'lead' });
    expect(rows[0].assigneeUserID).toBe('u1');
    expect(contactQueries.GET_ORGANIZATION_CONTACTS).toMatch(/assignee: \$assignee/);
    expect(contactQueries.GET_ORGANIZATION_CONTACTS).toMatch(/assigneeUserID/);
  });

  it('attribuer à un membre, ou rendre le lead (sans assigneeUserID)', async () => {
    const c = client();
    const ctrl = new ContactController(c as any);
    await ctrl.assign('c1', 'u1');
    await ctrl.assign('c1', null);
    expect(c.mutate.mock.calls.map(([doc, vars]) => [doc, vars])).toEqual([
      [contactMutations.ASSIGN_CONTACT, { input: { contactID: 'c1', assigneeUserID: 'u1' } }],
      [contactMutations.ASSIGN_CONTACT, { input: { contactID: 'c1' } }],
    ]);
  });

  it('transmettre : aucune identité d’auteur dans les variables', async () => {
    const c = client();
    const out = await new ContactController(c as any).handOver({ contactID: 'c1', toUserID: 'u2', message: 'Rappeler jeudi' });
    expect(c.mutate).toHaveBeenCalledWith(contactMutations.HAND_OVER_CONTACT, { input: { contactID: 'c1', toUserID: 'u2', message: 'Rappeler jeudi' } });
    expect(out.assigneeUserID).toBe('u2');
    for (const doc of [contactMutations.ASSIGN_CONTACT, contactMutations.HAND_OVER_CONTACT]) expect(doc).not.toMatch(/callerUserID/);
  });
});

describe('ContactController — décompte et modification groupée', () => {
  it('summary et bulkUpdate : une requête, aucune identité d’auteur', async () => {
    const c = {
      query: jest.fn(async () => ({ organizationContactsSummary: { total: 3, byStatus: [{ status: 'prospect', count: 3 }] } })),
      mutate: jest.fn(async () => ({ bulkUpdateOrganizationContacts: { updated: 2, refused: 1 } })),
    };
    const ctrl = new ContactController(c as any);
    expect((await ctrl.summary('o1')).total).toBe(3);
    expect(c.query).toHaveBeenCalledWith(contactQueries.GET_ORGANIZATION_CONTACTS_SUMMARY, { organizationID: 'o1' });
    expect(await ctrl.bulkUpdate({ organizationID: 'o1', contactIDs: ['c1', 'c2', 'c3'], archive: true })).toEqual({ updated: 2, refused: 1 });
    expect(c.mutate).toHaveBeenCalledWith(contactMutations.BULK_UPDATE_CONTACTS, { input: { organizationID: 'o1', contactIDs: ['c1', 'c2', 'c3'], archive: true } });
    expect(contactMutations.BULK_UPDATE_CONTACTS).not.toMatch(/callerUserID/);
  });
});
