import { BookingDomain, ProjectsController } from '../../src/domains/booking';
import { projectMutations, projectQueries } from '../../src/api/graphql/booking/projects';

describe('ProjectsController', () => {
  const project = { projectId: 'p1', name: 'Lancement', activities: [] };
  const client = () => ({
    query: jest.fn(async () => ({ internalProjects: [project], internalProject: project, internalProjectOfActivity: project })),
    mutate: jest.fn(async () => ({
      createInternalProject: project, updateInternalProject: project, addProjectActivity: project, updateProjectActivity: project, projectActivityAction: project,
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
});
