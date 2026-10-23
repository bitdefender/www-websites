import { getDsnBase } from '../../scripts/utils/utils.js';

/*
 * The homepage hero, rendered by the design system's bd-hero with the brand
 * sphere (bd-motion-art) in its media slot and the audience cards in its cards
 * slot. Authored as:
 *   row 1        eyebrow, h1, lead
 *   rows 2..n    an audience card each: [icon + eyebrow] [heading, description, link]
 */

// the audience icons the design system draws; any other authored icon is kept as is
const DS_ICONS = ['home', 'small-business', 'enterprise'];

const text = (el) => el?.textContent.replace(/\s+/g, ' ').trim() || '';

/** The cell's text without its icon's, which decorateIcons may fill with markup. */
const labelText = (cell) => {
  if (!cell) return '';
  const copy = cell.cloneNode(true);
  copy.querySelectorAll('.icon').forEach((icon) => icon.remove());
  return text(copy);
};

/** The copy row: paragraphs before the heading are the eyebrow, after it the lead. */
const readCopy = (row) => {
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const paragraphs = [...row.querySelectorAll('p')].filter((p) => text(p));
  const before = paragraphs.filter(
    // eslint-disable-next-line no-bitwise
    (p) => heading && (p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING),
  );
  const after = paragraphs.filter((p) => !before.includes(p));
  return {
    eyebrow: before.map(text).join(' '),
    heading: text(heading),
    lead: after.map(text).join(' '),
  };
};

const readIcon = (cell) => {
  const icon = cell?.querySelector('.icon');
  const name = icon && [...icon.classList]
    .find((c) => c.startsWith('icon-'))?.substring(5);
  if (name && DS_ICONS.includes(name)) return document.createElement(`bd-${name}-icon`);
  return icon ? icon.cloneNode(true) : null;
};

/** A card row: [icon + eyebrow] [heading, description, link]; either cell may be missing. */
const buildCard = (row) => {
  const cells = [...row.children];
  const content = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6, a')) || cells.at(-1);
  const label = cells.find((c) => c !== content);
  const heading = content?.querySelector('h1, h2, h3, h4, h5, h6');
  const link = content?.querySelector('a');
  const description = [...(content?.querySelectorAll('p') || [])]
    .find((p) => text(p) && !p.contains(link));

  const card = document.createElement('bd-audience-card');
  const eyebrow = labelText(label);
  if (eyebrow) card.setAttribute('eyebrow', eyebrow);
  card.setAttribute('heading', text(heading));
  if (description) card.setAttribute('description', text(description));
  if (link) {
    card.setAttribute('href', link.getAttribute('href') || '');
    if (link.target) card.setAttribute('target', link.target);
    if (text(link)) card.setAttribute('label', text(link));
  }

  const icon = readIcon(label);
  if (icon) {
    icon.setAttribute('slot', 'icon');
    card.append(icon);
  }
  return card;
};

export default async function decorate(block) {
  const base = getDsnBase();
  try {
    await Promise.all([
      import(`${base}hero`),
      import(`${base}motion-art`),
      import(`${base}audience-card`),
      import(`${base}grid`),
      import(`${base}icons`),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('brand-hero: DSN import failed, keeping the authored content', err);
    return;
  }

  const [copyRow, ...cardRows] = [...block.children];
  const { eyebrow, heading, lead } = readCopy(copyRow || block);

  const hero = document.createElement('bd-hero');
  if (eyebrow) hero.setAttribute('eyebrow', eyebrow);
  hero.setAttribute('heading', heading);
  if (lead) hero.setAttribute('lead', lead);

  const art = document.createElement('bd-motion-art');
  art.setAttribute('slot', 'media');
  art.setAttribute('object', 'brand-surface');
  hero.append(art);

  const cards = cardRows.map(buildCard);
  if (cards.length) {
    const grid = document.createElement('bd-grid');
    grid.setAttribute('slot', 'cards');
    grid.setAttribute('cols', '1');
    grid.setAttribute('cols-sm', '1');
    grid.setAttribute('cols-md', '1');
    grid.setAttribute('cols-lg', String(Math.min(cards.length, 3)));
    // bd-grid takes one gap: the phone and tablet frames stack the cards 16 apart,
    // the desktop row sets them 24 apart (992 is the design system's lg)
    const desktop = window.matchMedia?.('(min-width: 992px)');
    const setGap = () => grid.setAttribute('gap', !desktop || desktop.matches ? 'md' : 'sm');
    setGap();
    desktop?.addEventListener('change', setGap);
    grid.append(...cards);
    hero.append(grid);
  }

  block.replaceChildren(hero);
}
