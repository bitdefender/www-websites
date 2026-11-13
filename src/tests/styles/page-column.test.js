import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/* styles.css writes the design system's page column out as --page-column-max
   and --page-column-gutter (a page with no design system component never
   installs the grid tokens). This holds those values to the package's own
   tokens, so a design system release that moves the column fails here rather
   than leaving the site's sections on other edges than its components. */

const read = (path) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8');
const tokens = read('../../../node_modules/@repobit/dex-system-design/dist/src/tokens/tokens.css');
const styles = read('../../styles/styles.css');

const token = (name) => {
  const match = tokens.match(new RegExp(`${name}:\\s*([^;}]+)`));
  return match?.[1].trim();
};

// the column steps ensembleCSS uses: min-width, container step, padding step
// (the padding stops growing at lg, as ensembleCSS's does)
const STEPS = [
  [0, 'xs', 'xs'],
  [576, 'sm', 'sm'],
  [768, 'md', 'md'],
  [992, 'lg', 'lg'],
  [1200, 'xl', 'lg'],
  [1400, 'xxl', 'lg'],
  [1600, 'xxxl', 'lg'],
];

// the :root values styles.css sets at each step, carried forward as a cascade would
const siteColumn = () => {
  const blocks = [...styles.matchAll(/(?:@media \(width >= (\d+)px\) \{\s*)?:root(?:, :host)? \{([^}]*)\}/g)];
  const byStep = new Map();
  blocks.forEach(([, min, body]) => {
    const values = Object.fromEntries([...body.matchAll(/--(page-column-(?:max|gutter)):\s*([^;]+);/g)]
      .map(([, name, value]) => [name, value.trim()]));
    if (Object.keys(values).length) byStep.set(Number(min || 0), values);
  });
  let current = {};
  return STEPS.map(([min]) => {
    current = { ...current, ...byStep.get(min) };
    return { min, ...current };
  });
};

describe('the page column in styles.css', () => {
  it('reads the package tokens it is held to', () => {
    expect(token('--grid-container-max-md')).toMatch(/px$/);
    expect(token('--grid-padding-lg')).toMatch(/px$/);
  });

  const matchesTokens = (site) => STEPS.forEach(([min, container, padding], i) => {
    expect({ min, max: site[i]['page-column-max'], gutter: site[i]['page-column-gutter'] })
      .toEqual({ min, max: token(`--grid-container-max-${container}`), gutter: token(`--grid-padding-${padding}`) });
  });

  it('is the design system page column at every step', () => {
    matchesTokens(siteColumn());
  });

  it('fails on a column that drifts from the tokens', () => {
    const drifted = siteColumn().map((step) => (step.min === 768 ? { ...step, 'page-column-max': '700px' } : step));
    expect(() => matchesTokens(drifted)).toThrow();
  });
});
