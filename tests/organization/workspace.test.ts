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

describe('WorkspaceController · travail sur la tâche (créneau, livrables, dépôts, temps)', () => {
  const client = () => ({
    query: jest.fn(async () => ({ organizationTaskTimeEntries: [{ timeEntryID: 'te1', minutes: 90 }] })),
    mutate: jest.fn(async (doc: string) => {
      const field = /\{\s*(\w+)\(/.exec(doc)?.[1] as string;
      return { [field]: field === 'logOrganizationTaskTime' ? { timeEntryID: 'te1' } : field === 'deleteOrganizationTaskTime' ? true : TASK };
    }),
  });

  it('chaque action envoie son document et ses variables, jamais une identité', async () => {
    const c = client();
    const w = new WorkspaceController(c as any);
    await w.plan({ taskID: 't1', startAt: '2026-10-19T12:00:00Z', endAt: '2026-10-19T12:30:00Z' });
    await w.unplan('t1');
    await w.addDeliverable({ taskID: 't1', name: 'Devis signé', ownerUserID: 'u2' });
    await w.setDeliverableStatus({ taskID: 't1', deliverableID: 'd1', status: 'provided' });
    await w.removeDeliverable('t1', 'd1');
    await w.addFile({ taskID: 't1', type: 'link', name: 'Maquettes', url: 'https://exemple.com/m' });
    await w.removeFile('t1', 'f1');
    expect(await w.logTime({ taskID: 't1', startAt: '2026-10-19T07:00:00Z', endAt: '2026-10-19T08:30:00Z', note: 'Chiffrage' })).toEqual({ timeEntryID: 'te1' });
    expect(await w.deleteTime('t1', 'te1')).toBe(true);
    expect(await w.listTimeEntries('t1')).toEqual([{ timeEntryID: 'te1', minutes: 90 }]);
    expect(c.mutate.mock.calls.map(([, vars]) => vars)).toEqual([
      { input: { taskID: 't1', startAt: '2026-10-19T12:00:00Z', endAt: '2026-10-19T12:30:00Z' } },
      { taskID: 't1' },
      { input: { taskID: 't1', name: 'Devis signé', ownerUserID: 'u2' } },
      { input: { taskID: 't1', deliverableID: 'd1', status: 'provided' } },
      { taskID: 't1', deliverableID: 'd1' },
      { input: { taskID: 't1', type: 'link', name: 'Maquettes', url: 'https://exemple.com/m' } },
      { taskID: 't1', fileID: 'f1' },
      { input: { taskID: 't1', startAt: '2026-10-19T07:00:00Z', endAt: '2026-10-19T08:30:00Z', note: 'Chiffrage' } },
      { taskID: 't1', timeEntryID: 'te1' },
    ]);
    expect(c.query).toHaveBeenCalledWith(workspaceQueries.LIST_ORGANIZATION_TASK_TIME_ENTRIES, { taskID: 't1' });
  });

  it('le chemin de stockage privé d’un dépôt n’est jamais lu', () => {
    for (const doc of [...Object.values(workspaceQueries), ...Object.values(workspaceMutations)]) expect(doc).not.toMatch(/\bpath\b(?!:)/);
  });
});
