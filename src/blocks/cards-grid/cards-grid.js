import { load } from '@repobit/dex-system-design/loader';
import {
  liftSectionHeader, pointButtonAt, wrapSectionInDsSection,
} from '../../scripts/utils/utils.js';

/*
 * A row of the design system's cards on the page column, which replaces the
 * card variations Columns drew (DEX-29440). Authored as Columns was: one cell
 * a card, in one row or more. The section's Section Metadata `style` picks the
 * variation; without one the cards are text over a picture.
 *
 *   (none)          text over image: the picture is the card's ground, the
 *                   title and copy at its foot (bd-card appearance="media")
 *   responsible-ai  an icon, a title in brand ink and copy, on the brand wash,
 *                   under a centred section header
 *   benefits        a figure (the cell's first heading), a title and a line
 *   anchor          an eyebrow (the earlier heading), a title and the cell's
 *                   link: the whole card is the link (bd-audience-card)
 *   logo            a partner's logo, a title and paragraphs
 *
 * Every card is a subgrid of the row (bd-grid item-rows), so its parts start
 * on one line with its neighbours' however the words above them wrap.
 */

const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const VARIANTS = ['responsible-ai', 'benefits', 'anchor', 'logo'];

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([name, value]) => {
    if (value !== null && value !== undefined) node.setAttribute(name, value);
  });
  node.append(...children);
  return node;
};

/* A heading's words without the bold authors give it (the title role sets
   the weight), keeping its line breaks. */
const titleNodes = (heading) => {
  const copy = heading.cloneNode(true);
  copy.querySelectorAll('strong, b').forEach((bold) => bold.replaceWith(...bold.childNodes));
  return [...copy.childNodes];
};

/** An authored picture as a bd-img; `sized` keeps its width and height as an aspect hint. */
const toImg = (picture, sized = true) => {
  const img = picture?.querySelector('img');
  const src = img?.currentSrc || img?.getAttribute('src');
  if (!src) return null;
  const image = el('bd-img', { src, alt: img.getAttribute('alt') || '' });
  if (sized) {
    ['width', 'height'].forEach((name) => {
      if (img.hasAttribute(name)) image.setAttribute(name, img.getAttribute(name));
    });
  }
  return image;
};

const iconName = (cell) => [...(cell.querySelector('.icon')?.classList || [])]
  .find((cls) => cls.startsWith('icon-'))
  ?.substring(5);

/** The cell's paragraphs that are copy: not a picture, an icon or a link on its own. */
const copyOf = (cell) => [...cell.querySelectorAll('p')].filter((p) => p.textContent.trim()
  && !p.querySelector('picture, .icon')
  && !(p.querySelector('a') && p.textContent.trim() === p.querySelector('a').textContent.trim()));

const paragraph = (p, appearance) => el('bd-p', { appearance }, ...p.childNodes);

// a[location]: a fragment link, whose href detectModalButtons moved there
const linkOf = (cell) => cell.querySelector('a[href], a[location]');

const cta = (link) => {
  if (!link) return null;
  const button = el('bd-button', { slot: 'actions', appearance: 'accent' }, link.textContent.trim());
  pointButtonAt(button, link);
  return button;
};

/* === The variations: each builds one card from a cell, and says how many
   rows of the grid a card takes, which is the most any card in the row uses. */

const BUILDERS = {
  /* Text over image: the picture is the card's ground. */
  media: (cell) => {
    const card = el('bd-card', { appearance: 'media' });
    const image = toImg(cell.querySelector('picture'));
    if (image) card.append(Object.assign(image, { slot: 'media' }));
    const heading = cell.querySelector(HEADINGS);
    if (heading) card.append(el('bd-h', { slot: 'title', as: 'h3' }, ...titleNodes(heading)));
    copyOf(cell).forEach((p) => card.append(paragraph(p)));
    const button = cta(linkOf(cell));
    if (button) card.append(button);
    return card;
  },

  /* An icon, a title in brand ink, copy, on the brand wash. */
  'responsible-ai': (cell) => {
    const card = el('bd-card', { background: 'tint' });
    const name = iconName(cell);
    const icon = name
      ? el('bd-img', { src: `/common/icons/${name}.svg`, alt: '' })
      : toImg(cell.querySelector('picture'));
    if (icon) {
      icon.slot = 'icon';
      icon.setAttribute('fit', 'contain');
      card.append(icon);
    }
    const heading = cell.querySelector(HEADINGS);
    if (heading) {
      card.append(el('bd-h', {
        slot: 'title', as: 'h3', color: 'primary', 'font-weight': 'semibold',
      }, ...titleNodes(heading)));
    }
    copyOf(cell).forEach((p) => card.append(paragraph(p)));
    const button = cta(linkOf(cell));
    if (button) card.append(button);
    return card;
  },

  /* A figure, a title and a line: each a content row, so the figures, the
     titles and the lines line up across the row. */
  benefits: (cell) => {
    const card = el('bd-card');
    const [figure, title] = cell.querySelectorAll(HEADINGS);
    if (figure) card.append(el('bd-display', { appearance: 'md' }, figure.textContent.trim()));
    if (title) {
      card.append(el('bd-h', {
        as: 'h3', 'visual-level': 'h5', 'font-weight': 'bold', padding: '24 0 8 0',
      }, ...titleNodes(title)));
    }
    copyOf(cell).forEach((p) => card.append(paragraph(p, 'small')));
    return card;
  },

  /* An eyebrow and a title; the whole card is the cell's link. */
  anchor: (cell) => {
    const link = linkOf(cell);
    const card = el('bd-audience-card', { appearance: 'outline', href: link?.getAttribute('href') });
    const headings = [...cell.querySelectorAll(HEADINGS)];
    const title = headings.pop();
    const eyebrow = headings.pop();
    if (eyebrow) card.append(el('span', { slot: 'eyebrow' }, eyebrow.textContent.trim()));
    if (title) {
      card.append(el('bd-h', { slot: 'title', as: 'h3', 'font-weight': 'medium' }, ...titleNodes(title)));
    }
    return card;
  },

  /* A partner's logo over a title and paragraphs. The logo is drawn at the
     card's height for it and its own width, so it keeps no size of its own. */
  logo: (cell) => {
    const card = el('bd-card');
    const logo = toImg(cell.querySelector('picture'), false);
    if (logo) card.append(Object.assign(logo, { slot: 'media' }));
    const heading = cell.querySelector(HEADINGS);
    if (heading) {
      // the h3 role, 16 over the copy: the card's 8 and the title's own 8
      card.append(el('bd-h', {
        slot: 'title', as: 'h3', 'visual-level': 'h3', 'font-weight': 'semibold', 'padding-bottom': '8',
      }, ...titleNodes(heading)));
    }
    copyOf(cell).forEach((p) => card.append(paragraph(p)));
    const button = cta(linkOf(cell));
    if (button) card.append(button);
    return card;
  },
};

/* The rows a card takes in the grid: a bd-card's media or icon, its title,
   one per content node and its actions; a bd-audience-card's eyebrow, title,
   description and arrow. */
const rowsOf = (card) => {
  if (card.localName === 'bd-audience-card') return 4;
  const content = [...card.children].filter((child) => !child.slot).length;
  return content + 3;
};

/* Columns per screen step: one below md; from md two for the two-up
   variations; from lg every card of a short row, three to a row beyond four. */
const columnsFor = (variant, count) => {
  if (variant === 'anchor' || variant === 'logo') {
    const two = String(Math.min(2, count));
    return { md: two, lg: two };
  }
  return { md: '1', lg: String(count <= 4 ? count : 3) };
};

export default async function decorate(block) {
  wrapSectionInDsSection(block);
  const section = block.closest('.section');
  const variant = VARIANTS.find((name) => section?.classList.contains(name)
    || block.classList.contains(name)) || 'media';

  // the section's heading and lead, as bd-section-header: centred over the
  // responsible-ai cards, as that section always was
  const header = liftSectionHeader(block, variant === 'responsible-ai' ? { defaultLayout: 'centered' } : {});

  const cells = [...block.querySelectorAll(':scope > div > div')]
    .filter((cell) => cell.textContent.trim() || cell.querySelector('picture, .icon'));
  const cards = cells.map(BUILDERS[variant]);
  if (!cards.length) {
    await header;
    return;
  }

  const { md, lg } = columnsFor(variant, cards.length);
  const grid = el('bd-grid', {
    class: 'ds-page-column',
    cols: '1',
    'cols-sm': '1',
    'cols-md': md,
    'cols-lg': lg,
    gap: 'md',
    'item-rows': String(Math.max(...cards.map(rowsOf))),
  }, ...cards);

  // the cards hold the authored copy now; whatever loads, they replace the table
  try {
    await load(grid);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('cards-grid: DSN import failed, continuing with native rendering', err);
  }
  block.replaceChildren(grid);
  block.dataset.variant = variant;
  await header;
}
