import { getDsnBase } from '../../scripts/utils/utils.js';

const getIconElement = (col) => {
  const iconSpan = col.querySelector('[class*="icon-"]');
  if (iconSpan) {
    const iconName = Array.from(iconSpan.classList)
      .find((cls) => cls.startsWith('icon-'))
      ?.substring(5);
    if (iconName) {
      const img = document.createElement('img');
      img.src = `/common/icons/${iconName}.svg`;
      img.setAttribute('width', '40');
      img.setAttribute('height', '40');
      img.style.width = '40px';
      img.style.height = '40px';
      img.style.display = 'block';
      img.setAttribute('alt', '');
      img.setAttribute('slot', 'icon');
      return img;
    }
  }
  const picture = col.querySelector('picture');
  if (picture) {
    const clone = picture.cloneNode(true);
    clone.setAttribute('slot', 'icon');
    return clone;
  }
  return null;
};

const buildFeatureCol = (col, firstOpen) => {
  const heading = col.querySelector('h1, h2, h3');
  const title = heading?.textContent?.trim() || '';

  const featureCol = document.createElement('bd-feature-col');
  featureCol.setAttribute('title', title);

  const iconEl = getIconElement(col);
  if (iconEl) featureCol.appendChild(iconEl);

  const h4s = [...col.querySelectorAll('h4')];
  const firstH4 = h4s[0] || null;

  const descParts = [];
  for (const child of col.children) {
    if (child === firstH4) break;
    if (child.tagName === 'P'
        && !child.querySelector('[class*="icon-"]')
        && child.textContent.trim()
        && !child.textContent.trim().match(/^#[0-9a-fA-F]{3,6}$/)) {
      descParts.push(child.innerHTML);
    }
  }
  if (descParts.length) {
    const desc = document.createElement('bd-p');
    desc.setAttribute('slot', 'description');
    desc.setAttribute('kind', 'small');
    desc.innerHTML = descParts.join(' ');
    featureCol.appendChild(desc);
  }

  if (h4s.length) {
    const accordionSection = document.createElement('bd-accordion-section');
    accordionSection.setAttribute('no-container', '');

    h4s.forEach((h4, index) => {
      const item = document.createElement('bd-accordion-item');
      item.setAttribute('title', h4.textContent.trim());
      if (index === 0 && firstOpen) item.setAttribute('open', '');

      let next = h4.nextElementSibling;
      while (next && next.tagName !== 'H4') {
        if (next.textContent.trim()) {
          const bdP = document.createElement('bd-p');
          bdP.setAttribute('kind', 'small');
          bdP.innerHTML = next.innerHTML;
          item.appendChild(bdP);
        }
        next = next.nextElementSibling;
      }

      accordionSection.appendChild(item);
    });

    featureCol.appendChild(accordionSection);
  }

  return featureCol;
};

export default async function decorate(block) {
  const base = getDsnBase();
  await Promise.all([
    import(`${base}tabs`),
    import(`${base}paragraph`),
    import(`${base}accordion`),
  ]);

  const firstOpen = block.classList.contains('first-open');
  const featuresEl = document.createElement('bd-features');

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      featuresEl.appendChild(buildFeatureCol(col, firstOpen));
    });
  });

  block.replaceChildren(featuresEl);
}
