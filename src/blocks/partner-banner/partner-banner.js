import { load } from '@repobit/dex-system-design/loader';
import { wrapSectionInDsSection } from '../../scripts/utils/utils.js';

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

  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const pictures = [...block.querySelectorAll('picture')];
  // the lockup sits with the heading, in the copy row under the photo's; without a
  // heading it is still the picture after the photo
  const headingCell = heading?.closest('.partner-banner > div > div')
    || pictures[1]?.closest('.partner-banner > div > div');
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
    const button = document.createElement('bd-button');
    button.setAttribute('slot', 'actions');
    // bold is the primary action on the card, a plain link the secondary;
    // decorateButtons has already turned a bold link into a.button.primary
    const primary = p.querySelector('strong, b, a.button.primary');
    button.setAttribute('variant', primary ? 'white' : 'outline-white');
    button.setAttribute('href', link.getAttribute('href') || '');
    button.textContent = text(link);
    return button;
  });

  banner.append(...buttons);
  try {
    await load(banner);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('partner-banner: DSN import failed, keeping the authored content', err);
    return;
  }

  // the pictures move only now, so a failed load leaves them in the authored rows
  banner.prepend(...[slotted(photo, 'photo'), slotted(lockup, 'lockup')].filter(Boolean));
  block.replaceChildren(banner);
}
