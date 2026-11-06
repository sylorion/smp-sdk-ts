import { I18n } from '../../src/i18n/';

/**
 * Langue non reconnue telle quelle (`en`, `fr-FR`, `de`) : avant, `messages` restait vide (toutes les
 * traductions renvoyaient leur clé) et `formatDate` levait une TypeError. Désormais : langue la plus
 * proche, sinon la langue par défaut.
 */
describe('I18n — résolution de la langue', () => {
  it('code exact, forme BCP 47 ou langue seule', () => {
    expect(I18n.resolveLanguage('fr_FR')).toBe('fr_FR');
    expect(I18n.resolveLanguage('fr-FR')).toBe('fr_FR');
    expect(I18n.resolveLanguage('fr')).toBe('fr_FR');
    expect(I18n.resolveLanguage('EN')).toBe('en_US');
    expect(I18n.resolveLanguage('es')).toBe('es_ES');
  });

  it('langue inconnue ou vide : langue par défaut', () => {
    expect(I18n.resolveLanguage('de')).toBe('en_US');
    expect(I18n.resolveLanguage('')).toBe('en_US');
    expect(I18n.resolveLanguage(undefined)).toBe('en_US');
  });

  it('une langue non reconnue traduit quand même et formate sans erreur', () => {
    const i18n = new I18n('de' as any);
    expect(i18n.getCurrentLanguage()).toBe('en_US');
    expect(i18n.translate('greeting', { name: 'Alice' })).toBe('Hello, Alice!');
    expect(() => i18n.formatDate(new Date('2026-11-05T12:00:00Z'))).not.toThrow();
    expect(() => i18n.formatNumber(12.5)).not.toThrow();
  });

  it('code exact inchangé', () => {
    const i18n = new I18n('en_US');
    expect(i18n.getCurrentLanguage()).toBe('en_US');
    expect(i18n.translate('missing_key')).toBe('missing_key');
  });

  it('formatDate / formatNumber acceptent les codes de la SDK (`fr_FR` → balise Intl `fr-FR`)', () => {
    const fr = new I18n('fr_FR');
    expect(fr.formatNumber(1234.5)).toBe(new Intl.NumberFormat('fr-FR', { style: 'decimal', minimumFractionDigits: 2 }).format(1234.5));
    expect(fr.formatDate(new Date('2026-11-05T12:00:00Z'))).toContain('2026');
  });
});
