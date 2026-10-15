import { OrganizationDomain, WorkspaceController } from '../../src/domains/organization';
import { workspaceMutations, workspaceQueries } from '../../src/api/graphql/organization/workspace';

const TASK = { taskID: 't1', organizationID: 'org1', title: 'Relancer', status: 'todo', labels: [] };

describe('WorkspaceController', () => {
  const client = () => ({
    query: jest.fn(async (doc: string) => (doc.includes('organizationTaskEvents')
      ? { organizationTaskEvents: [{ eventID: 'e1', actorUserID: 'u1', kind: 'status_changed', data: '{"from":"todo","to":"blocked"}', createdAt: 'x' }, { eventID: 'e2', actorUserID: 'u1', kind: 'created', data: 'pas du json', createdAt: 'x' }] }
      : { organizationTasks: [TASK] })),
    mutate: jest.fn(async () => ({ createOrganizationTask: TASK, assignOrganizationTask: TASK, handOverDossier: TASK })),
  });

  it('est exposé sur le domaine organisation', () => {
    expect(new OrganizationDomain(client() as any).workspace).toBeInstanceOf(WorkspaceController);
  });

  it('liste avec le filtre tel quel', async () => {
    const c = client();
    const r = await new WorkspaceController(c as any).listTasks({ organizationID: 'org1', scope: 'team' });
    expect(c.query).toHaveBeenCalledWith(workspaceQueries.LIST_ORGANIZATION_TASKS, { filter: { organizationID: 'org1', scope: 'team' } });
    expect(r).toEqual([TASK]);
  });

  it('décode le détail JSON du journal, sans planter sur une valeur illisible', async () => {
    const r = await new WorkspaceController(client() as any).listEvents('t1');
    expect(r[0].data).toEqual({ from: 'todo', to: 'blocked' });
    expect(r[1].data).toBeNull();
  });

  it('création, assignation, transmission : aucune identité d’auteur dans les variables', async () => {
    const c = client();
    const w = new WorkspaceController(c as any);
    await w.createTask({ organizationID: 'org1', title: 'x' });
    await w.assign('t1', null);
    await w.handOverDossier({ organizationID: 'org1', documentType: 'invoice', documentID: 'inv1', toUserID: 'u2' });
    expect(c.mutate.mock.calls.map(([doc]) => doc)).toEqual([
      workspaceMutations.CREATE_ORGANIZATION_TASK, workspaceMutations.ASSIGN_ORGANIZATION_TASK, workspaceMutations.HAND_OVER_DOSSIER,
    ]);
    expect(c.mutate.mock.calls[1][1]).toEqual({ input: { taskID: 't1', assigneeUserID: null } });
    for (const doc of Object.values(workspaceMutations)) expect(doc).not.toMatch(/creatorUserID:|authorUserID:\s*\$|callerUserID/);
  });
});
