import { getDsnBase } from '../../scripts/utils/utils.js';

const ICON_COLOR = '#006eff';

const getIconElement = async (col) => {
  const iconSpan = col.querySelector('[class*="icon-"]');
  if (iconSpan) {
    const iconName = Array.from(iconSpan.classList)
      .find((cls) => cls.startsWith('icon-'))
      ?.substring(5);
    if (iconName) {
      try {
        const resp = await fetch(`/common/icons/${iconName}.svg`);
        if (resp.ok) {
          const svgText = await resp.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, 'image/svg+xml');
          const svgEl = doc.querySelector('svg');
          if (svgEl) {
            svgEl.setAttribute('width', '40');
            svgEl.setAttribute('height', '40');
            svgEl.removeAttribute('class');
            const wrapper = document.createElement('span');
            wrapper.style.cssText = `display:inline-flex;color:${ICON_COLOR};width:40px;height:40px;flex-shrink:0;`;
            wrapper.setAttribute('slot', 'icon');
            wrapper.setAttribute('aria-hidden', 'true');
            wrapper.appendChild(document.importNode(svgEl, true));
            return wrapper;
          }
        }
      } catch (e) {
        // fall through to img fallback
      }
      const img = document.createElement('img');
      img.src = `/common/icons/${iconName}.svg`;
      img.setAttribute('width', '40');
      img.setAttribute('height', '40');
      img.style.cssText = 'width:40px;height:40px;display:block;';
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

const buildFeatureCol = async (col, firstOpen) => {
  const heading = col.querySelector('h1, h2, h3');
  const title = heading?.textContent?.trim() || '';

  const featureCol = document.createElement('bd-feature-col');
  featureCol.setAttribute('title', title);

  const iconEl = await getIconElement(col);
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

  const colPromises = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      colPromises.push(buildFeatureCol(col, firstOpen));
    });
  });
  const featureCols = await Promise.all(colPromises);
  featureCols.forEach((fc) => featuresEl.appendChild(fc));

  block.replaceChildren(featuresEl);
}
