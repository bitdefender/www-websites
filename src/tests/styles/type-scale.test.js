import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/* styles.css writes the design system's heading sizes out as --ds-heading-h1-size
   to --ds-heading-h5-size (a page with no design system component never installs
   the typography tokens). This holds those values to the package's own
   --typography-heading-hN-fontSize tokens, so a design system release that moves
   the type scale fails here rather than leaving the site's headings on other
   sizes than its components'. */

const read = (path) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8');
const tokens = read('../../../node_modules/@repobit/dex-system-design/dist/src/tokens/tokens.css');
const styles = read('../../styles/styles.css');

const LEVELS = [1, 2, 3, 4, 5];

// one spelling for a CSS value: no spaces, a leading zero on fractions
const normalize = (value) => value.replace(/\s+/g, '').replace(/(^|[^0-9])\.(\d)/g, '$10.$2');

const token = (name, depth = 0) => {
  const match = tokens.match(new RegExp(`${name}:\\s*([^;}]+)`));
  if (!match || depth > 5) return undefined;
  // the token's own var() references, resolved to the values they hold
  return match[1].trim().replace(/var\((--[\w-]+)\)/g, (ref, inner) => token(inner, depth + 1) ?? ref);
};

const site = (name) => styles.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim();

describe('the type scale in styles.css', () => {
  it('reads the package tokens it is held to', () => {
    expect(token('--typography-heading-h2-fontSize')).toMatch(/^clamp\(/);
  });

  it('is the design system type scale at every heading level', () => {
    LEVELS.forEach((level) => {
      expect({ level, size: normalize(site(`--ds-heading-h${level}-size`) ?? '') })
        .toEqual({ level, size: normalize(token(`--typography-heading-h${level}-fontSize`) ?? '') });
    });
  });

  it('fails on a size that drifts from the tokens', () => {
    expect(normalize('clamp(1.875rem, calc(1.33929rem + 2.6786vw), 3.5rem)'))
      .not.toEqual(normalize(token('--typography-heading-h1-fontSize')));
  });
});
