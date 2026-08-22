import { logger, redact, setLogLevel, getLogLevel } from './Logger';

/**
 * Test de non-régression — fuite de données sensibles dans la console navigateur.
 *
 * L'ancien logger du SDK était un relais direct vers `console` :
 *     const logger = { info: (...a) => { console.log(a); }, ... };
 * `APIClient.post` / `APIClient.get` l'appelaient avec le corps COMPLET de chaque
 * réponse — tokens, factures, devis, données personnelles — qui se retrouvait
 * donc en clair dans les DevTools de l'utilisateur final.
 */
describe('redact', () => {
  it('masque les clés sensibles quel que soit le niveau d’imbrication', () => {
    const payload = {
      user: { email: 'a@b.c', authToken: 'ey.secret', nested: { refreshToken: 'r-123' } },
      appSecret: 's3cr3t',
      client_secret: 'pi_x_secret_y',
      montant: 12800,
    };

    const safe = redact(payload) as any;

    expect(safe.appSecret).toBe('[masqué]');
    expect(safe.client_secret).toBe('[masqué]');
    expect(safe.user.authToken).toBe('[masqué]');
    expect(safe.user.nested.refreshToken).toBe('[masqué]');
    // Les données non sensibles restent lisibles : le logger doit rester utile.
    expect(safe.montant).toBe(12800);
    expect(safe.user.email).toBe('a@b.c');
  });

  it('masque aussi les variantes de casse et de nommage', () => {
    const safe = redact({
      Authorization: 'Bearer x',
      API_KEY: 'k',
      jwt: 'e.y.z',
      IBAN: 'FR76...',
      cardNumber: '4242424242424242',
    }) as any;
    for (const key of Object.keys(safe)) {
      expect(safe[key]).toBe('[masqué]');
    }
  });

  it('tronque les chaînes longues — une réponse API n’a rien à faire en console', () => {
    const long = 'x'.repeat(5000);
    const safe = redact(long) as string;
    expect(safe.length).toBeLessThan(250);
    expect(safe).toContain('5000 caractères');
  });

  it('borne la profondeur et la taille des tableaux', () => {
    const deep = { a: { b: { c: { d: { e: { f: 'trop profond' } } } } } };
    expect(JSON.stringify(redact(deep))).toContain('[…]');
    expect((redact(new Array(100).fill('x')) as unknown[]).length).toBe(20);
  });

  it('laisse passer les valeurs simples', () => {
    expect(redact(null)).toBeNull();
    expect(redact(undefined)).toBeUndefined();
    expect(redact(42)).toBe(42);
    expect(redact(true)).toBe(true);
  });
});

describe('niveaux de journalisation', () => {
  const level = getLogLevel();
  afterEach(() => setLogLevel(level));

  it('est silencieux au-delà de `error` par défaut hors développement', () => {
    setLogLevel('error');
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    const err = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    logger.debug('ne doit pas sortir');
    logger.info('ne doit pas sortir');
    expect(log).not.toHaveBeenCalled();

    logger.error('doit sortir');
    expect(err).toHaveBeenCalled();

    log.mockRestore();
    err.mockRestore();
  });

  it('masque même quand la journalisation est activée', () => {
    setLogLevel('debug');
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    logger.info('réponse', { authToken: 'ey.secret' });

    const printed = JSON.stringify(log.mock.calls);
    expect(printed).not.toContain('ey.secret');
    expect(printed).toContain('[masqué]');

    log.mockRestore();
  });
});
