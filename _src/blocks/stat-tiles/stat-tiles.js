import { getDsnBase, liftSectionHeader } from '../../scripts/utils/utils.js';

/*
 * The homepage's Why-trust figures, rendered with the design system's
 * bd-stat-highlight and bd-stat-tile. Authored as:
 *   row 1        [highlight value, *spoken label*] [description, link]
 *   rows 2..n    a tile each: [value, *spoken label*] [caption]
 * The italic line is optional: it is what a screen reader says for the value
 * ("$1.5 billion plus" for "$1.5B+").
 */

// the design system's md and lg (768, 992)
const TABLET = '(min-width: 768px)';

const text = (el) => el?.textContent.replace(/\s+/g, ' ').trim() || '';

/** A value cell: the figure, and its spoken form from an <em> when there is one. */
const readValue = (cell) => {
  const spoken = cell?.querySelector('em');
  const copy = cell?.cloneNode(true);
  copy?.querySelectorAll('em').forEach((em) => em.remove());
  return { value: text(copy), label: text(spoken) };
};

const buildLead = (row) => {
  const [valueCell, copyCell] = row.children;
  const { value, label } = readValue(valueCell);
  const lead = document.createElement('div');
  lead.className = 'stat-tiles-lead';

  const highlight = document.createElement('bd-stat-highlight');
  highlight.setAttribute('value', value);
  if (label) highlight.setAttribute('label', label);
  lead.append(highlight);

  const link = copyCell?.querySelector('a');
  [...(copyCell?.querySelectorAll('p') || [])]
    .filter((p) => text(p) && !p.contains(link))
    .forEach((p) => {
      const paragraph = document.createElement('bd-p');
      paragraph.setAttribute('variant', 'large');
      paragraph.textContent = text(p);
      lead.append(paragraph);
    });
  // copy authored straight in the cell, without a paragraph
  if (copyCell && !copyCell.querySelector('p') && text(copyCell)) {
    const paragraph = document.createElement('bd-p');
    paragraph.setAttribute('variant', 'large');
    paragraph.textContent = text(copyCell);
    lead.append(paragraph);
  }

  if (link) {
    const button = document.createElement('bd-button-link');
    button.setAttribute('variant', 'primary');
    button.setAttribute('href', link.getAttribute('href') || '');
    if (link.target) button.setAttribute('target', link.target);
    button.textContent = text(link);
    // the phone frame runs the CTA across the column; from md it hugs its label
    const tablet = window.matchMedia?.(TABLET);
    const setWidth = () => button.toggleAttribute('fullwidth', !!tablet && !tablet.matches);
    setWidth();
    tablet?.addEventListener('change', setWidth);
    lead.append(button);
  }
  return lead;
};

const buildTile = (row) => {
  const [valueCell, captionCell] = row.children;
  const { value, label } = readValue(valueCell);
  const tile = document.createElement('bd-stat-tile');
  tile.setAttribute('value', value);
  if (text(captionCell)) tile.setAttribute('caption', text(captionCell));
  if (label) tile.setAttribute('label', label);
  return tile;
};

const grid = (cols) => {
  const el = document.createElement('bd-grid');
  ['cols', 'cols-sm', 'cols-md', 'cols-lg'].forEach((name, i) => el.setAttribute(name, cols[i]));
  return el;
};

export default async function decorate(block) {
  // the section's eyebrow, heading and lead, as bd-section-header
  const header = liftSectionHeader(block);
  const base = getDsnBase();
  try {
    await Promise.all([
      import(`${base}stat`),
      import(`${base}grid`),
      import(`${base}paragraph`),
      import(`${base}button`),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('stat-tiles: DSN import failed, keeping the authored content', err);
    await header;
    return;
  }

  const rows = [...block.children];
  // a first row with a second cell carrying copy is the highlight; otherwise all are tiles
  const hasLead = rows[0]?.children.length > 1 && rows[0].children[1].querySelector('p, a');
  const leadRow = hasLead ? rows.shift() : null;

  // phone: one column, tiles 16 apart; tablet: tiles two across, 24 apart;
  // desktop: the highlight beside the tiles
  const layout = grid(['1', '1', '1', leadRow ? '2' : '1']);
  layout.className = 'stat-tiles-column';
  layout.setAttribute('gap', 'md');
  const tiles = grid(['1', '1', '2', '2']);
  const tablet = window.matchMedia?.(TABLET);
  const setGap = () => tiles.setAttribute('gap', !tablet || tablet.matches ? 'md' : 'sm');
  setGap();
  tablet?.addEventListener('change', setGap);
  tiles.append(...rows.map(buildTile));

  if (leadRow) layout.append(buildLead(leadRow));
  layout.append(tiles);
  block.replaceChildren(layout);
  await header;
}
