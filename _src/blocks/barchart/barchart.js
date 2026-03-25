/* eslint-disable-next-line import/no-unresolved */
import '@repobit/dex-system-design/compare';
import '@repobit/dex-system-design/heading';
import '@repobit/dex-system-design/paragraph';
import '@repobit/dex-system-design/link';

const getHeadingText = (root) => root?.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() || '';

const getAdjacentParagraph = (element, fallbackRoot) => {
  const candidate = element?.nextElementSibling;
  if (candidate?.tagName === 'P') {
    return candidate;
  }
  return fallbackRoot?.querySelector('p') || null;
};

const normalizeScore = (score) => score.replace(',', '.');

const getCardIconSrc = (iconWrap) => {
  const image = iconWrap?.querySelector('img');
  const imageSrc = image?.currentSrc || image?.getAttribute('src') || '';
  if (imageSrc) {
    return imageSrc;
  }

  const iconElement = iconWrap?.querySelector('[class*="icon-"]');
  if (!iconElement) {
    return '';
  }

  const iconName = Array.from(iconElement.classList).find((className) => className.startsWith('icon-'))?.substring(5);
  if (!iconName) {
    return '';
  }

  return `/common/icons/${iconName}.svg`;
};

export default function decorate(block) {
  const section = block.closest('.section');
  const defaultWrapper = section?.querySelector(':scope > .default-content-wrapper');
  const sectionTitle = getHeadingText(defaultWrapper);
  if (defaultWrapper && sectionTitle) {
    defaultWrapper.remove();
  }

  const compareSection = document.createElement('bd-compare-section');
  if (sectionTitle) {
    compareSection.setAttribute('title', sectionTitle);
  }
  compareSection.setAttribute('gap', '32px');

  const rows = Array.from(block.querySelectorAll(':scope > div'));
  rows.forEach((row) => {
    const [iconWrap, contentWrap] = row.children;
    if (!contentWrap) {
      return;
    }

    const titleEl = contentWrap.querySelector('h1, h2, h3, h4, h5, h6');
    const descriptionEl = getAdjacentParagraph(titleEl, contentWrap);
    const listEl = contentWrap.querySelector('ul');
    const footnoteEl = listEl?.nextElementSibling?.tagName === 'P'
      ? listEl.nextElementSibling
      : contentWrap.querySelector('p:last-of-type');

    const card = document.createElement('compare-card');
    const cardTitle = titleEl?.textContent?.trim();
    if (cardTitle) {
      card.setAttribute('title', cardTitle);
    }
    const cardDescription = descriptionEl?.textContent?.trim();
    if (cardDescription) {
      card.setAttribute('description', cardDescription);
    }

    const iconSrc = getCardIconSrc(iconWrap);
    if (iconSrc) {
      card.setAttribute('icon-src', iconSrc);
    }

    if (footnoteEl) {
      const footnoteText = footnoteEl.textContent.trim();
      if (footnoteText) {
        card.setAttribute('footnote', footnoteText);
      }
      const footnoteLink = footnoteEl.querySelector('a');
      if (footnoteLink?.href) {
        card.setAttribute('footnote-href', footnoteLink.href);
      }
    }

    const listItems = Array.from(listEl?.querySelectorAll('li') || []);
    for (let i = 0; i < listItems.length; i += 2) {
      const label = listItems[i]?.textContent?.trim();
      const score = listItems[i + 1]?.textContent?.trim();

      if (label && score) {
        const bar = document.createElement('compare-bar');
        bar.setAttribute('label', label);
        bar.setAttribute('score', normalizeScore(score));
        bar.setAttribute('max-score', '6');
        bar.setAttribute('variant', /bitdefender/i.test(label) ? 'primary' : 'secondary');
        card.appendChild(bar);
      }
    }

    compareSection.appendChild(card);
  });

  block.replaceChildren(compareSection);
}

