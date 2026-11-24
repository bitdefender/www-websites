import { load } from '@repobit/dex-system-design/loader';
import { openModal } from '../../scripts/scripts.js';
import {
  liftSectionHeader, wrapSectionInDsSection,
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
 *   anchor          an eyebrow (an h4 to h6), a title (an h1 to h3) and the
 *                   cell's link: the whole card is the link (bd-audience-card)
 *   logo            a partner's logo under an optional eyebrow, a title and
 *                   paragraphs
 *
 * Every card is a subgrid of the row (bd-grid item-rows), so its parts start
 * on one line with its neighbours' however the words above them wrap.
 *
 * A link on its own line is a button at the card's foot, as Columns drew it:
 * a plain link the red one, a bold one the black (grey on a picture), and a
 * link to a fragment the text one that opens it as a modal. Every one shows
 * the site's arrow on hover, as the red one draws its own.
 *
 * An eyebrow is the brand-ink label over a card, the homepage's: a line of
 * copy authored before the card's title, or an h4 to h6 over an h1 to h3.
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

const isBefore = (node, other) => !!other
  // eslint-disable-next-line no-bitwise
  && !!(node.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING);

/** The cell's eyebrow: the first line of copy before its title, as the
 *  homepage's section headers read one. */
const eyebrowLine = (cell, title) => (title ? copyOf(cell).find((p) => isBefore(p, title)) : null);

const eyebrowText = (text) => el('bd-p', { appearance: 'eyebrow' }, text.trim());

// detectModalButtons has already moved a fragment link's href to `location`
const hrefOf = (link) => link.getAttribute('href') || link.getAttribute('location');

const linkOf = (cell) => [...cell.querySelectorAll('a')].find(hrefOf);

/* decorateButtons has made a link on its own line an a.button: bold is
   .primary, bold italic .secondary, and a fragment's .modal */
const appearanceOf = (link) => {
  if (link.classList.contains('modal')) return 'plain';
  if (link.matches('.primary, .secondary') || link.closest('strong, b')) return 'secondary';
  return 'accent';
};

/* Only the red button draws the arrow it shows on hover; the others are
   given the same one, which cards-grid.css moves in as the red one's does.
   The label is wrapped so it can step aside for it. */
const withArrow = (button, label) => {
  button.classList.add('cards-grid__button--arrow');
  button.append(
    el('span', { class: 'cards-grid__label' }, label),
    el('bd-icon', {
      name: 'arrow', slot: 'end', class: 'cards-grid__arrow', 'aria-hidden': 'true',
    }),
  );
  return button;
};

/** The cell's buttons, every link on its own line, in the order authored.
 *  `surface` is the ground's: the red button keeps the light one, which draws
 *  it without the white ring a dark one gives it, as it is everywhere else. */
const ctas = (cell, surface = 'light') => [...cell.querySelectorAll('p')]
  .map((p) => p.querySelector('a'))
  .filter((link) => link && hrefOf(link)
    && link.closest('p').textContent.trim() === link.textContent.trim())
  .map((link) => {
    const href = hrefOf(link);
    const appearance = appearanceOf(link);
    const label = link.textContent.trim();
    const button = appearance === 'accent'
      ? el('bd-button', { slot: 'actions', appearance }, label)
      : withArrow(el('bd-button', { slot: 'actions', appearance, surface }), label);
    if (link.classList.contains('modal') || href.includes('/fragments/')) {
      // the button's anchor is in its shadow root, out of detectModalButtons' sight
      button.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(href, link.dataset.stopAutomaticModalRefresh === 'true');
      });
    } else {
      button.setAttribute('href', href);
    }
    return button;
  });

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
    // on the picture's dark ground
    card.append(...ctas(cell, 'dark'));
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
    card.append(...ctas(cell));
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
    copyOf(cell).forEach((p, index) => {
      const line = paragraph(p, 'small');
      // without a title the line keeps the figure's 24 under it
      if (!title && figure && index === 0) line.setAttribute('padding-top', '24');
      card.append(line);
    });
    card.append(...ctas(cell));
    return card;
  },

  /* An eyebrow and a title; the whole card is the cell's link. */
  anchor: (cell) => {
    const link = linkOf(cell);
    const card = el('bd-audience-card', { appearance: 'outline', href: link && hrefOf(link) });
    // the heading's level says which it is, so either can be left out
    const headings = [...cell.querySelectorAll(HEADINGS)];
    const title = headings.filter((h) => /^H[1-3]$/.test(h.tagName)).pop();
    const eyebrow = headings.find((h) => /^H[4-6]$/.test(h.tagName));
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
    const heading = cell.querySelector(HEADINGS);
    // the eyebrow stands over the logos, so the two are the card's media
    const line = eyebrowLine(cell, heading);
    const logos = [...cell.querySelectorAll('picture')].map((picture) => toImg(picture, false)).filter(Boolean);
    if (line) {
      card.append(el('div', { slot: 'media', class: 'cards-grid__head' }, eyebrowText(line.textContent), ...logos));
    } else if (logos.length > 1) {
      card.append(el('div', { slot: 'media', class: 'cards-grid__head' }, ...logos));
    } else if (logos.length) {
      card.append(Object.assign(logos[0], { slot: 'media' }));
    }
    if (heading) {
      // the h3 role, 16 over the copy: the card's 8 and the title's own 8
      card.append(el('bd-h', {
        slot: 'title', as: 'h3', 'visual-level': 'h3', 'font-weight': 'semibold', 'padding-bottom': '8',
      }, ...titleNodes(heading)));
    }
    copyOf(cell).filter((p) => p !== line).forEach((p) => card.append(paragraph(p)));
    card.append(...ctas(cell));
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
  const lg = String(count <= 4 ? count : 3);
  if (variant === 'anchor' || variant === 'logo') return { md: String(Math.min(2, count)), lg };
  return { md: '1', lg };
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
