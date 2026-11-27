import { load } from '@repobit/dex-system-design/loader';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { slotIcon, wrapSectionInDsSection } from '../../scripts/utils/utils.js';

const slottedCopy = (tag, slot, source) => {
  const element = document.createElement(tag);
  element.slot = slot;
  element.innerHTML = source.innerHTML;
  return element;
};

export default async function decorate(block) {
  wrapSectionInDsSection(block);
  const metadata = block.closest('.section')?.dataset;
  const banner = document.createElement('bd-cta-banner');
  ['appearance', 'width'].forEach((attribute) => {
    if (metadata?.[attribute]) banner.setAttribute(attribute, metadata[attribute]);
  });

  const iconSpan = block.querySelector('span.icon');
  if (iconSpan) {
    await decorateIcons(block);
    const icon = slotIcon(iconSpan, { color: 'inherit' });
    if (!icon) {
      // eslint-disable-next-line no-console
      console.warn('cta-banner: icon failed to load, keeping the authored content');
      return;
    }
    icon.slot = 'media';
    banner.append(icon);
  } else {
    const picture = block.querySelector('picture');
    if (picture) {
      const media = picture.cloneNode(true);
      media.slot = 'media';
      banner.append(media);
    }
  }

  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    const title = slottedCopy('bd-h', 'title', heading);
    title.setAttribute('as', heading.tagName.toLowerCase());
    banner.append(title);
  }

  [...block.querySelectorAll('p')].forEach((paragraph) => {
    if (paragraph.querySelector('span.icon, picture') || !paragraph.textContent.trim()) return;

    const anchor = paragraph.querySelector('a[href]');
    if (anchor && paragraph.textContent.trim() === anchor.textContent.trim()) {
      const button = slottedCopy('bd-button', 'actions', anchor);
      button.setAttribute('href', anchor.getAttribute('href'));
      const secondary = anchor.classList.contains('secondary') || !!paragraph.querySelector('em, i');
      button.setAttribute('appearance', secondary ? 'secondary' : 'accent');
      button.setAttribute('surface', ['brand', 'brand-deep'].includes(metadata?.appearance) ? 'brand' : 'light');
      if (anchor.hasAttribute('target')) button.setAttribute('target', anchor.getAttribute('target'));
      if (anchor.hasAttribute('rel')) button.setAttribute('rel', anchor.getAttribute('rel'));
      if (anchor.target === '_blank') {
        button.setAttribute('rel', `${anchor.getAttribute('rel') || ''} noopener noreferrer`.trim());
      }
      banner.append(button);
    } else {
      banner.append(slottedCopy('bd-p', 'description', paragraph));
    }
  });

  try {
    await load(banner);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('cta-banner: DSN import failed, keeping the authored content', err);
    return;
  }
  block.replaceChildren(banner);
}
