import {
  describe, it, expect, afterEach,
} from 'vitest';
import { getAemFragmentLocale } from '../../scripts/utils/utils.js';

describe('getAemFragmentLocale', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it.each([
    ['en-us', 'en'],
    ['en-global', 'en'],
    ['es-global', 'es'],
    ['en-gb', 'en_gb'],
    ['de-de', 'de_de'],
    ['zh-hk', 'zh_hk'],
    ['EN-GB', 'en_gb'],
  ])('maps locale %s to %s', (domain, expected) => {
    expect(getAemFragmentLocale(domain)).toBe(expected);
  });

  it.each([
    'drafts',
    'tools',
    'en',
    'en-us-old',
    'english-us',
    '',
    undefined,
  ])('falls back to en for non-locale segment %j', (domain) => {
    expect(getAemFragmentLocale(domain)).toBe('en');
  });

  it('reads the locale from the current path by default', () => {
    window.history.replaceState({}, '', '/fr-fr/consumer/');
    expect(getAemFragmentLocale()).toBe('fr_fr');
  });

  it('falls back to en on drafts pages', () => {
    window.history.replaceState({}, '', '/drafts/test-page/');
    expect(getAemFragmentLocale()).toBe('en');
  });

  it('falls back to en on the site root', () => {
    window.history.replaceState({}, '', '/');
    expect(getAemFragmentLocale()).toBe('en');
  });
});
