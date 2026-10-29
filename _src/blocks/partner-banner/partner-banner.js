import { getDsnBase, wrapSectionInDsSection } from '../../scripts/utils/utils.js';

/*
 * The Ferrari section, on the design system's bd-partner-banner. Authored as:
 *   row 1  the photo (a picture)
 *   row 2  [h2 + the partner lockup (a picture)] [quote, *attribution*, lead,
 *          a **bold** link (white button) and a plain link (outline-white)]
 * Read by role, not by position, so cells may move.
 */

const text = (el) => el?.textContent.replace(/\s+/g, ' ').trim() || '';

const slotted = (picture, slot) => {
  if (!picture) return null;
  picture.setAttribute('slot', slot);
  const img = picture.querySelector('img');
  if (img) img.setAttribute('alt', img.getAttribute('alt') || '');
  return picture;
};

export default async function decorate(block) {
  wrapSectionInDsSection(block);
  const base = getDsnBase();
  try {
    await Promise.all([
      import(`${base}partner-banner`),
      import(`${base}button`),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('partner-banner: DSN import failed, keeping the authored content', err);
    return;
  }

  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const headingCell = heading?.closest('.partner-banner > div > div');
  const pictures = [...block.querySelectorAll('picture')];
  // the lockup sits with the heading; the photo is the other picture
  const lockup = pictures.find((picture) => headingCell?.contains(picture));
  const photo = pictures.find((picture) => picture !== lockup);

  const copy = [...block.querySelectorAll('p')]
    .filter((p) => text(p) && !p.querySelector('picture') && !headingCell?.contains(p));
  const links = copy.filter((p) => p.querySelector('a') && text(p) === text(p.querySelector('a')));
  const prose = copy.filter((p) => !links.includes(p));
  const attribution = prose.find((p) => p.querySelector('em, i') && text(p) === text(p.querySelector('em, i')));
  const [quote, lead] = prose.filter((p) => p !== attribution);

  const banner = document.createElement('bd-partner-banner');
  if (heading) banner.setAttribute('heading', text(heading));
  if (heading) banner.setAttribute('as', heading.tagName.toLowerCase());
  if (quote) banner.setAttribute('quote', text(quote));
  if (attribution) banner.setAttribute('attribution', text(attribution));
  if (lead) banner.setAttribute('lead', text(lead));

  const buttons = links.map((p) => {
    const link = p.querySelector('a');
    const button = document.createElement('bd-button-link');
    button.setAttribute('slot', 'actions');
    // bold is the primary action on the card, a plain link the secondary;
    // decorateButtons has already turned a bold link into a.button.primary
    const primary = p.querySelector('strong, b, a.button.primary');
    button.setAttribute('variant', primary ? 'white' : 'outline-white');
    button.setAttribute('href', link.getAttribute('href') || '');
    button.textContent = text(link);
    return button;
  });

  banner.append(...[slotted(photo, 'photo'), slotted(lockup, 'lockup'), ...buttons].filter(Boolean));
  block.replaceChildren(banner);
}
