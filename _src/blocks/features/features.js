import { getDsnBase } from '../../scripts/utils/utils.js';

const parseTrailingGreenPill = (text) => {
  const marker = text.match(/\[\$([^\]]+?)\$\]\s*$/);
  if (marker) {
    return {
      title: text.replace(/\s*\[\$[^\]]+?\$\]\s*$/, '').trim(),
      pill: marker[1].trim(),
    };
  }

  const bracket = text.match(/\[([^\]]+?)\]\s*$/);
  if (!bracket) return { title: text.trim(), pill: '' };

  const candidate = bracket[1].trim();
  if (!/^[A-Z0-9+&\- ]{2,}$/.test(candidate)) {
    return { title: text.trim(), pill: '' };
  }

  return {
    title: text.replace(/\s*\[[^\]]+?\]\s*$/, '').trim(),
    pill: candidate,
  };
};

const getTitleAndPill = (headingEl) => {
  const greenTag = headingEl.querySelector('.tag-green');
  if (greenTag) {
    const clone = headingEl.cloneNode(true);
    clone.querySelectorAll('.tag-green').forEach((tag) => tag.remove());
    return {
      title: clone.textContent.trim(),
      pill: greenTag.textContent.trim(),
    };
  }

  return parseTrailingGreenPill(headingEl.textContent.trim());
};

const createGreenBadge = (pill) => {
  const badge = document.createElement('span');
  badge.setAttribute('slot', 'badge');
  badge.textContent = pill;
  badge.style.display = 'inline-flex';
  badge.style.alignItems = 'center';
  badge.style.padding = '2px 8px';
  badge.style.borderRadius = '999px';
  badge.style.background = '#0A7D39';
  badge.style.color = '#fff';
  badge.style.fontSize = '12px';
  badge.style.fontWeight = '600';
  badge.style.lineHeight = '1.2';
  return badge;
};

const getIconElement = (col) => {
  const icon = document.createElement('bd-individual-icon');
  icon.setAttribute('slot', 'icon');
  icon.setAttribute('size', '40');

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
      icon.appendChild(img);
      return icon;
    }
  }

  const image = col.querySelector('img');
  if (image) {
    const clone = image.cloneNode(true);
    clone.removeAttribute('slot');
    clone.style.width = '40px';
    clone.style.height = '40px';
    clone.style.display = 'block';
    icon.appendChild(clone);
    return icon;
  }

  const picture = col.querySelector('picture');
  if (picture) {
    const clone = picture.cloneNode(true);
    icon.appendChild(clone);
    return icon;
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
  Array.from(col.children).some((child) => {
    if (child === firstH4) return true;
    if (child.tagName === 'P'
      && !child.querySelector('[class*="icon-"]')
      && child.textContent.trim()
      && !child.textContent.trim().match(/^#[0-9a-fA-F]{3,6}$/)) {
      descParts.push(child.innerHTML);
    }
    return false;
  });
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
      const { title: itemTitle, pill } = getTitleAndPill(h4);
      const item = document.createElement('bd-accordion-item');
      item.setAttribute('title', itemTitle || h4.textContent.trim());
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

      if (pill) {
        item.appendChild(createGreenBadge(pill));
      }

      accordionSection.appendChild(item);
    });

    featureCol.appendChild(accordionSection);
  }

  return featureCol;
};

export default async function decorate(block) {
  const base = getDsnBase();
  try {
    await Promise.all([
      import(`${base}tabs`),
      import(`${base}paragraph`),
      import(`${base}accordion`),
      import(`${base}individual-icon`),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('features: DSN import failed, continuing with native rendering', err);
  }

  const firstOpen = block.classList.contains('first-open');
  const featuresEl = document.createElement('bd-features');

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      featuresEl.appendChild(buildFeatureCol(col, firstOpen));
    });
  });

  block.replaceChildren(featuresEl);
}
