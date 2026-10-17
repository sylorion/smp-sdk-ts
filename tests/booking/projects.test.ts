import { BookingDomain, ProjectsController } from '../../src/domains/booking';
import { projectMutations, projectQueries } from '../../src/api/graphql/booking/projects';

describe('ProjectsController', () => {
  const project = { projectId: 'p1', name: 'Lancement', activities: [] };
  const client = () => ({
    query: jest.fn(async () => ({
      internalProjects: [project], internalProject: project, internalProjectOfActivity: project,
      projectShareLinks: [{ linkId: 'l1', state: 'active' }], sharedProjectView: { state: 'ok', activities: [] },
    })),
    mutate: jest.fn(async () => ({
      createInternalProject: project, updateInternalProject: project, addProjectActivity: project, updateProjectActivity: project, projectActivityAction: project,
      shiftProjectActivity: project, projectActivityTime: project, reportActivityIssue: project, resolveActivityIssue: project,
      depositActivityDeliverable: project, validateActivityDeliverable: project,
      createProjectShareLink: { linkId: 'l1', token: 'tok', allowUpload: false, targetType: 'project', targetId: 'p1' },
      revokeProjectShareLink: true, sharedDeposit: true,
    })),
  });

  it('est exposé sur le domaine booking', () => {
    expect(new BookingDomain(client() as any).projects).toBeInstanceOf(ProjectsController);
  });

  it('lectures : documents et variables tels quels', async () => {
    const c = client();
    const p = new ProjectsController(c as any);
    expect(await p.list('o1')).toEqual([project]);
    await p.get('p1');
    await p.getByActivity('a1');
    expect(c.query.mock.calls).toEqual([
      [projectQueries.INTERNAL_PROJECTS, { organizationId: 'o1' }],
      [projectQueries.INTERNAL_PROJECT, { projectId: 'p1' }],
      [projectQueries.INTERNAL_PROJECT_OF_ACTIVITY, { activityId: 'a1' }],
    ]);
  });

  it('écritures : aucun auteur dans les variables ni dans les documents', async () => {
    const c = client();
    const p = new ProjectsController(c as any);
    await p.create({ organizationId: 'o1', name: 'Lancement' });
    await p.update('p1', { status: 'on_hold' });
    await p.addActivity({ projectId: 'p1', title: 'Dossier', type: 'deliverable', dependsOn: ['a0'] });
    await p.updateActivity('a1', { ownerUserId: 'u2' });
    await p.act('a1', 'complete');
    expect(c.mutate.mock.calls).toEqual([
      [projectMutations.CREATE_INTERNAL_PROJECT, { input: { organizationId: 'o1', name: 'Lancement' } }],
      [projectMutations.UPDATE_INTERNAL_PROJECT, { projectId: 'p1', input: { status: 'on_hold' } }],
      [projectMutations.ADD_PROJECT_ACTIVITY, { input: { projectId: 'p1', title: 'Dossier', type: 'deliverable', dependsOn: ['a0'] } }],
      [projectMutations.UPDATE_PROJECT_ACTIVITY, { activityId: 'a1', input: { ownerUserId: 'u2' } }],
      [projectMutations.PROJECT_ACTIVITY_ACTION, { input: { activityId: 'a1', action: 'complete' } }],
    ]);
    for (const doc of Object.values(projectMutations)) expect(doc).not.toMatch(/callerUserId|actorUserId/);
  });

  it('suivi collaboratif : documents et variables tels quels, sans auteur', async () => {
    const c = client();
    const p = new ProjectsController(c as any);
    await p.shift({ activityId: 'a1', deltaDays: 3 });
    await p.time({ activityId: 'a1', action: 'nudge' });
    await p.time({ activityId: 'a1', action: 'counter', hours: 9, comment: 'plus de relectures' });
    await p.reportIssue({ activityId: 'a1', category: 'third_party', text: 'Client injoignable' });
    await p.resolveIssue({ activityId: 'a1', issueId: 'i1', acceptNewDue: true });
    await p.depositDeliverable({ activityId: 'a1', name: 'dossier.pdf', url: 'project-deliverables/o1/a1/dossier.pdf' });
    await p.validateDeliverable('a1');
    expect(c.mutate.mock.calls).toEqual([
      [projectMutations.SHIFT_PROJECT_ACTIVITY, { input: { activityId: 'a1', deltaDays: 3 } }],
      [projectMutations.PROJECT_ACTIVITY_TIME, { input: { activityId: 'a1', action: 'nudge' } }],
      [projectMutations.PROJECT_ACTIVITY_TIME, { input: { activityId: 'a1', action: 'counter', hours: 9, comment: 'plus de relectures' } }],
      [projectMutations.REPORT_ACTIVITY_ISSUE, { input: { activityId: 'a1', category: 'third_party', text: 'Client injoignable' } }],
      [projectMutations.RESOLVE_ACTIVITY_ISSUE, { input: { activityId: 'a1', issueId: 'i1', acceptNewDue: true } }],
      [projectMutations.DEPOSIT_ACTIVITY_DELIVERABLE, { input: { activityId: 'a1', name: 'dossier.pdf', url: 'project-deliverables/o1/a1/dossier.pdf' } }],
      [projectMutations.VALIDATE_ACTIVITY_DELIVERABLE, { activityId: 'a1' }],
    ]);
  });

  it('liens de partage : création (jeton renvoyé), liste, retrait ; vue et dépôt publics', async () => {
    const c = client();
    const p = new ProjectsController(c as any);
    expect(await p.createShareLink({ targetType: 'project', targetId: 'p1', validityHours: 24 })).toMatchObject({ token: 'tok' });
    expect(await p.revokeShareLink('p1', 'l1')).toBe(true);
    expect(await p.shareLinks('p1')).toEqual([{ linkId: 'l1', state: 'active' }]);
    expect(await p.sharedView('tok')).toEqual({ state: 'ok', activities: [] });
    expect(await p.sharedDeposit({ token: 'tok', name: 'a.pdf', url: 'project-deliverables/o1/a1/a.pdf', depositorLabel: 'Camille' })).toBe(true);
    expect(c.mutate.mock.calls).toEqual([
      [projectMutations.CREATE_PROJECT_SHARE_LINK, { input: { targetType: 'project', targetId: 'p1', validityHours: 24 } }],
      [projectMutations.REVOKE_PROJECT_SHARE_LINK, { projectId: 'p1', linkId: 'l1' }],
      [projectMutations.SHARED_DEPOSIT, { input: { token: 'tok', name: 'a.pdf', url: 'project-deliverables/o1/a1/a.pdf', depositorLabel: 'Camille' } }],
    ]);
    expect(c.query.mock.calls).toEqual([
      [projectQueries.PROJECT_SHARE_LINKS, { projectId: 'p1' }],
      [projectQueries.SHARED_PROJECT_VIEW, { token: 'tok' }],
    ]);
  });

  it('le jeton ne sort que de la création : les documents de lecture ne le demandent pas', () => {
    expect(projectQueries.PROJECT_SHARE_LINKS).not.toMatch(/token|tokenHash/i);
    expect(projectQueries.SHARED_PROJECT_VIEW).not.toMatch(/tokenHash|journal|issues/);
    expect(projectMutations.CREATE_PROJECT_SHARE_LINK).toMatch(/token/);
    for (const doc of Object.values(projectMutations)) expect(doc).not.toMatch(/callerUserId|actorUserId|authorId/);
  });
});

