import { parse, OperationDefinitionNode, FieldNode } from 'graphql';
import { serviceFlowQueries } from '../../src/api/graphql/flow/queries';
import { serviceFlowMutations } from '../../src/api/graphql/flow/mutations';
import { ServiceFlowController } from '../../src/domains/flow/ServiceFlowController';
import { FlowDomain } from '../../src/domains/flow';

/** Flows de service — contrat avec mu-command (docs/architecture/workflows-de-service.md §5). */
function rootField(doc: string): string {
  const op = parse(doc).definitions[0] as OperationDefinitionNode;
  return (op.selectionSet.selections[0] as FieldNode).name.value;
}

describe('flow — documents GraphQL', () => {
  const expected: Record<string, string> = {
    GET_SERVICE_FLOWS: 'serviceFlows',
    GET_SERVICE_FLOW: 'serviceFlow',
    GET_SERVICE_FLOW_VERSIONS: 'serviceFlowVersions',
    GET_SERVICE_FLOW_FOR_SERVICE: 'serviceFlowForService',
    GET_SERVICE_FLOW_STATS: 'serviceFlowStats',
    GET_SERVICE_FLOW_USAGE: 'serviceFlowUsage',
    GET_SERVICE_FLOW_RUNS: 'serviceFlowRuns',
    GET_SERVICE_FLOW_RUN: 'serviceFlowRun',
    GET_MY_SERVICE_FLOW_RUNS: 'myServiceFlowRuns',
    GET_ACTIVE_SERVICE_FLOW_RUN: 'activeServiceFlowRun',
    CREATE_SERVICE_FLOW: 'createServiceFlow',
    UPDATE_SERVICE_FLOW_DRAFT: 'updateServiceFlowDraft',
    PUBLISH_SERVICE_FLOW: 'publishServiceFlow',
    DUPLICATE_SERVICE_FLOW: 'duplicateServiceFlow',
    ARCHIVE_SERVICE_FLOW: 'archiveServiceFlow',
    DELETE_SERVICE_FLOW: 'deleteServiceFlow',
    LINK_SERVICE_FLOW: 'linkServiceFlow',
    UNLINK_SERVICE_FLOW: 'unlinkServiceFlow',
    START_SERVICE_FLOW_RUN: 'startServiceFlowRun',
    SAVE_SERVICE_FLOW_STEP: 'saveServiceFlowStep',
    COMPLETE_SERVICE_FLOW_STEP: 'completeServiceFlowStep',
    PREPARE_SERVICE_FLOW_CONTRACT: 'prepareServiceFlowContract',
    EDIT_SERVICE_FLOW_RUN_ANSWERS: 'editServiceFlowRunAnswers',
    RESTART_SERVICE_FLOW_RUN: 'restartServiceFlowRun',
    POST_SERVICE_FLOW_RUN_MESSAGE: 'postServiceFlowRunMessage',
    VALIDATE_SERVICE_FLOW_RUN: 'validateServiceFlowRun',
    REQUEST_SERVICE_FLOW_CHANGES: 'requestServiceFlowChanges',
    REFUSE_SERVICE_FLOW_RUN: 'refuseServiceFlowRun',
    RELAUNCH_SERVICE_FLOW_RUN: 'relaunchServiceFlowRun',
    CLOSE_SERVICE_FLOW_RUN: 'closeServiceFlowRun',
  };
  const all: Record<string, string> = { ...serviceFlowQueries, ...serviceFlowMutations };

  test('toutes les opérations du moteur sont couvertes, ni plus ni moins', () => {
    expect(Object.keys(all).sort()).toEqual(Object.keys(expected).sort());
  });

  test.each(Object.entries(expected))('%s cible %s', (name, field) => {
    expect(rootField(all[name])).toBe(field);
  });

  test("l'exécution ramène ce que les écrans affichent (étapes, historique, délais, demande de complément)", () => {
    for (const f of ['steps {', 'events {', 'reviewDueAt', 'priceHoldUntil', 'changeRequest', 'contractId', 'refusalReason', 'definition']) {
      expect(serviceFlowQueries.GET_SERVICE_FLOW_RUN).toContain(f);
    }
    expect(serviceFlowQueries.GET_SERVICE_FLOW_USAGE).toContain('biggestLoss');
    expect(serviceFlowQueries.GET_SERVICE_FLOW_USAGE).toContain('pending {');
  });
});

describe('ServiceFlowController', () => {
  function build() {
    const client: any = { query: jest.fn(), mutate: jest.fn() };
    return { ctl: new ServiceFlowController(client), client };
  }

  test('est exposé sur le domaine flow', () => {
    expect(new FlowDomain({} as any).serviceFlow).toBeInstanceOf(ServiceFlowController);
  });

  test('list : filtre de statut facultatif, liste vide si le serveur ne renvoie rien', async () => {
    const { ctl, client } = build();
    client.query.mockResolvedValueOnce({ serviceFlows: [{ flowId: 'f1' }] });
    await expect(ctl.list('org1')).resolves.toEqual([{ flowId: 'f1' }]);
    expect(client.query).toHaveBeenLastCalledWith(serviceFlowQueries.GET_SERVICE_FLOWS, { organizationId: 'org1' });
    client.query.mockResolvedValueOnce({ serviceFlows: null });
    await expect(ctl.list('org1', 'draft')).resolves.toEqual([]);
    expect(client.query).toHaveBeenLastCalledWith(serviceFlowQueries.GET_SERVICE_FLOWS, { organizationId: 'org1', status: 'draft' });
  });

  test('runs : seuls les filtres renseignés sont envoyés', async () => {
    const { ctl, client } = build();
    client.query.mockResolvedValue({ serviceFlowRuns: [] });
    await ctl.runs({ organizationId: 'org1', flowId: 'f1', status: ['pending_review'], limit: 10, offset: 0 });
    expect(client.query).toHaveBeenLastCalledWith(serviceFlowQueries.GET_SERVICE_FLOW_RUNS, {
      organizationId: 'org1', flowId: 'f1', status: ['pending_review'], limit: 10, offset: 0,
    });
    await ctl.runs({ organizationId: 'org1', status: [] });
    expect(client.query).toHaveBeenLastCalledWith(serviceFlowQueries.GET_SERVICE_FLOW_RUNS, { organizationId: 'org1' });
  });

  test('usage : 30 jours par défaut', async () => {
    const { ctl, client } = build();
    client.query.mockResolvedValue({ serviceFlowUsage: { flowId: 'f1', days: 30 } });
    await ctl.usage('f1');
    expect(client.query).toHaveBeenCalledWith(serviceFlowQueries.GET_SERVICE_FLOW_USAGE, { flowId: 'f1', days: 30 });
  });

  test('getForService / activeRun : null quand le service n’a pas de flow ou pas d’exécution', async () => {
    const { ctl, client } = build();
    client.query.mockResolvedValueOnce({ serviceFlowForService: null });
    await expect(ctl.getForService('s1')).resolves.toBeNull();
    client.query.mockResolvedValueOnce({});
    await expect(ctl.activeRun('s1')).resolves.toBeNull();
  });

  test('parcours acheteur : démarrer, brouillon, franchir, préparer le contrat', async () => {
    const { ctl, client } = build();
    client.mutate.mockResolvedValueOnce({ startServiceFlowRun: { runId: 'r1', status: 'in_progress' } });
    await expect(ctl.startRun({ serviceId: 's1', amount: 395000, currency: 'EUR' })).resolves.toMatchObject({ runId: 'r1' });
    expect(client.mutate).toHaveBeenLastCalledWith(serviceFlowMutations.START_SERVICE_FLOW_RUN, { data: { serviceId: 's1', amount: 395000, currency: 'EUR' } });

    client.mutate.mockResolvedValueOnce({ saveServiceFlowStep: { runId: 'r1' } });
    await ctl.saveStep('r1', 'q1', { answers: { secteur: 'Logiciel B2B' } });
    expect(client.mutate).toHaveBeenLastCalledWith(serviceFlowMutations.SAVE_SERVICE_FLOW_STEP, { runId: 'r1', stepKey: 'q1', data: { answers: { secteur: 'Logiciel B2B' } } });

    client.mutate.mockResolvedValueOnce({ completeServiceFlowStep: { runId: 'r1' } });
    await ctl.completeStep('r1', 'k1');
    // Sans données (étape contrat) : la variable `data` n'est pas envoyée du tout.
    expect(client.mutate).toHaveBeenLastCalledWith(serviceFlowMutations.COMPLETE_SERVICE_FLOW_STEP, { runId: 'r1', stepKey: 'k1' });

    client.mutate.mockResolvedValueOnce({ prepareServiceFlowContract: { contractId: 'c1', invitationToken: 'inv_x' } });
    await expect(ctl.prepareContract('r1', 'k1')).resolves.toEqual({ contractId: 'c1', invitationToken: 'inv_x' });
  });

  test('décisions du prestataire : valider (avec ou sans options), complément, refus', async () => {
    const { ctl, client } = build();
    client.mutate.mockResolvedValue({ validateServiceFlowRun: { status: 'validated' } });
    await ctl.validateRun('r1');
    expect(client.mutate).toHaveBeenLastCalledWith(serviceFlowMutations.VALIDATE_SERVICE_FLOW_RUN, { runId: 'r1' });
    await ctl.validateRun('r1', { signerUserId: 'u2', applyStamp: true });
    expect(client.mutate).toHaveBeenLastCalledWith(serviceFlowMutations.VALIDATE_SERVICE_FLOW_RUN, { runId: 'r1', data: { signerUserId: 'u2', applyStamp: true } });

    client.mutate.mockResolvedValue({ requestServiceFlowChanges: { status: 'changes_requested' } });
    await expect(ctl.requestChanges('r1', { stepKey: 'd1', itemKey: 'organigramme', message: 'Version complète svp' }))
      .resolves.toEqual({ status: 'changes_requested' });

    client.mutate.mockResolvedValue({ refuseServiceFlowRun: { status: 'refused' } });
    await ctl.refuseRun('r1', 'Hors périmètre');
    expect(client.mutate).toHaveBeenLastCalledWith(serviceFlowMutations.REFUSE_SERVICE_FLOW_RUN, { runId: 'r1', reason: 'Hors périmètre' });
  });

  test('booléens : delete et unlink renvoient toujours un booléen', async () => {
    const { ctl, client } = build();
    client.mutate.mockResolvedValueOnce({ deleteServiceFlow: true });
    await expect(ctl.delete('f1')).resolves.toBe(true);
    client.mutate.mockResolvedValueOnce({ unlinkServiceFlow: null });
    await expect(ctl.unlink('s1')).resolves.toBe(false);
  });

  test('les erreurs du serveur remontent telles quelles (FLOW_INCOMPLETE)', async () => {
    const { ctl, client } = build();
    const err = Object.assign(new Error('Flow incomplet'), { extensions: { code: 'FLOW_INCOMPLETE', reasons: ['Aucune étape'] } });
    client.mutate.mockRejectedValue(err);
    await expect(ctl.publish('f1')).rejects.toBe(err);
  });
});
