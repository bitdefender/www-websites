import { load } from '@repobit/dex-system-design/loader';
import { splitAroundHeading, wrapSectionInDsSection } from '../../scripts/utils/utils.js';

/*
 * The homepage hero, rendered by the design system's bd-hero with the brand
 * sphere (bd-motion-art) in its media slot and the audience cards in its
 * default slot. Authored as:
 *   row 1        eyebrow, h1, lead
 *   rows 2..n    an audience card each: [icon + eyebrow] [heading, description, link]
 * The copy is slotted as the design system asks: the eyebrow a span, the
 * heading a bd-h and the lead or description a bd-p.
 */

// the audience icons the design system draws; any other authored icon is kept as is
const DS_ICONS = ['home', 'small-business', 'enterprise'];

// a private-use character stands in for each <br> while the source whitespace collapses
const BREAK = '';

/**
 * The element's text on one line, except where the author wrote a <br>: that
 * becomes a newline, which slotted() writes back as a <br>.
 */
const text = (el) => {
  if (!el) return '';
  const copy = el.cloneNode(true);
  copy.querySelectorAll('br').forEach((br) => br.replaceWith(BREAK));
  return copy.textContent.split(BREAK)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
};

/**
 * An element for one of a component's slots, holding the copy: its lines,
 * a <br> between each, as the author broke them.
 */
const slotted = (tag, slot, copy, attributes = {}) => {
  const el = document.createElement(tag);
  el.slot = slot;
  Object.entries(attributes).forEach(([name, value]) => el.setAttribute(name, value));
  copy.split('\n').forEach((line, index) => {
    if (index) el.append(document.createElement('br'));
    el.append(line);
  });
  return el;
};

/** The cell's text without its icon's, which decorateIcons may fill with markup. */
const labelText = (cell) => {
  if (!cell) return '';
  const copy = cell.cloneNode(true);
  copy.querySelectorAll('.icon').forEach((icon) => icon.remove());
  return text(copy);
};

/**
 * The copy row: paragraphs before the heading are the eyebrow, after it the
 * lead. Without a heading, the first of two or more is still the eyebrow.
 */
const readCopy = (row) => {
  const paragraphs = [...row.querySelectorAll('p')].filter((p) => text(p));
  const { heading, before, after } = splitAroundHeading(row, paragraphs);
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
  if (name && DS_ICONS.includes(name)) {
    const dsIcon = document.createElement('bd-icon');
    dsIcon.setAttribute('name', name);
    return dsIcon;
  }
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
  if (eyebrow) card.append(slotted('span', 'eyebrow', eyebrow));
  // an h2, the level 3.x's card drew its heading at
  if (text(heading)) card.append(slotted('bd-h', 'title', text(heading), { as: 'h2' }));
  if (description) card.append(slotted('bd-p', 'description', text(description)));
  if (link) {
    card.setAttribute('href', link.getAttribute('href') || '');
    if (link.target) card.setAttribute('target', link.target);
    // the arrow link's accessible name, which renders nowhere
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
  // the hero's band starts under the site menu: its section keeps only the
  // inset below it, so the cards stand twice the inset clear of what follows
  wrapSectionInDsSection(block)?.setAttribute('without-padding-top', '');

  const [copyRow, ...cardRows] = [...block.children];
  const { eyebrow, heading, lead } = readCopy(copyRow || block);

  const hero = document.createElement('bd-hero');
  if (eyebrow) hero.append(slotted('span', 'eyebrow', eyebrow));
  // the page's one h1, whatever level the author gave the heading, as 3.x's hero drew it
  if (heading) hero.append(slotted('bd-h', 'title', heading, { as: 'h1' }));
  if (lead) hero.append(slotted('bd-p', 'description', lead));

  const art = document.createElement('bd-motion-art');
  art.setAttribute('slot', 'media');
  art.setAttribute('object', 'brand-surface');
  hero.append(art);

  const cards = cardRows.map(buildCard);
  if (cards.length) {
    // the cards are the hero's default slot
    const grid = document.createElement('bd-grid');
    grid.setAttribute('cols', '1');
    grid.setAttribute('cols-sm', '1');
    grid.setAttribute('cols-md', '1');
    // one row of every card from lg, however many the author gives it
    grid.setAttribute('cols-lg', String(cards.length));
    // each card's eyebrow, title, description and arrow on rows it shares
    // with the cards beside it, so their parts line up however titles wrap
    grid.setAttribute('item-rows', '4');
    // bd-grid takes one gap: the phone and tablet frames stack the cards 16 apart,
    // the desktop row sets them 24 apart (992 is the design system's lg)
    const desktop = window.matchMedia?.('(min-width: 992px)');
    const setGap = () => grid.setAttribute('gap', !desktop || desktop.matches ? 'md' : 'sm');
    setGap();
    desktop?.addEventListener('change', setGap);
    grid.append(...cards);
    hero.append(grid);
  }

  // the hero is built from copies, so the authored rows are whole until it replaces them
  try {
    await load(hero);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('brand-hero: DSN import failed, keeping the authored content', err);
    return;
  }
  block.replaceChildren(hero);
}
