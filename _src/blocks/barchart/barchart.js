const DSN_FALLBACK = 'https://esm.sh/@repobit/dex-system-design@0.23.7/';

const getDsnBase = () => {
  try {
    const map = document.querySelector('script[type="importmap"]');
    const imports = JSON.parse(map?.textContent || '{}').imports || {};
    return imports['@repobit/dex-system-design/'] || DSN_FALLBACK;
  } catch {
    return DSN_FALLBACK;
  }
};

const DEFAULT_SECONDARY_SCALES = ['0.93', '0.47'];
const VIEWPORT_ANIMATION_MS = 1000;
const EASE_OUT_CUBIC = (value) => 1 - ((1 - value) ** 3);

const getHeadingText = (root) => root?.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() || '';

const getAdjacentParagraph = (element, fallbackRoot) => {
  const candidate = element?.nextElementSibling;
  if (candidate?.tagName === 'P') {
    return candidate;
  }
  return fallbackRoot?.querySelector('p') || null;
};

const normalizeScore = (score) => score.replace(',', '.');

const parseScaleValue = (value) => {
  if (!value) {
    return null;
  }

  const normalizedValue = normalizeScore(value).replace('%', '').trim();
  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  if (parsedValue <= 1) {
    return String(parsedValue);
  }

  if (parsedValue <= 100) {
    return String(parsedValue / 100);
  }

  return null;
};

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

  const iconName = Array.from(iconElement.classList)
    .find((className) => className.startsWith('icon-'))
    ?.substring(5);

  if (!iconName) {
    return '';
  }

  return `/common/icons/${iconName}.svg`;
};

const getFallbackScale = (secondaryIndex) => DEFAULT_SECONDARY_SCALES[secondaryIndex]
  ?? DEFAULT_SECONDARY_SCALES[DEFAULT_SECONDARY_SCALES.length - 1];

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

const buildCompareSection = (block) => {
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
    const footnoteCandidate = listEl?.nextElementSibling;
    const footnoteEl = footnoteCandidate?.tagName === 'P' ? footnoteCandidate : null;

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
    let hasScaledBars = false;
    let secondaryBarIndex = 0;

    for (let i = 0; i < listItems.length;) {
      const label = listItems[i]?.textContent?.trim();
      const score = listItems[i + 1]?.textContent?.trim();

      if (label && score) {
        const isPrimaryBar = /bitdefender/i.test(label);
        const parsedScale = parseScaleValue(listItems[i + 2]?.textContent?.trim());

        const bar = document.createElement('compare-bar');
        bar.setAttribute('label', label);
        bar.setAttribute('score', normalizeScore(score));
        bar.setAttribute('max-score', '6');
        bar.setAttribute('variant', isPrimaryBar ? 'primary' : 'secondary');

        if (parsedScale) {
          bar.setAttribute('scale', parsedScale);
          hasScaledBars = true;
        } else if (!isPrimaryBar) {
          bar.setAttribute('scale', getFallbackScale(secondaryBarIndex));
          hasScaledBars = true;
        }

        if (!isPrimaryBar) {
          secondaryBarIndex += 1;
        }

        i += parsedScale ? 3 : 2;
        card.appendChild(bar);
      } else {
        i += 1;
      }
    }

    if (hasScaledBars) {
      card.setAttribute('bar-stretch', 'false');
    }

    compareSection.appendChild(card);
  });

  return compareSection;
};

const runBarsIntroAnimation = (compareSection) => {
  if (compareSection.dataset.barchartAnimated === 'true' || prefersReducedMotion()) {
    return;
  }

  const secondaryBars = Array.from(compareSection.querySelectorAll('compare-bar'))
    .filter((bar) => bar.getAttribute('variant') !== 'primary');

  if (!secondaryBars.length) {
    return;
  }

  compareSection.dataset.barchartAnimated = 'true';

  const animationState = secondaryBars.map((bar) => {
    const maxScore = Number(normalizeScore(bar.getAttribute('max-score') || '6')) || 6;
    const finalScore = Number(normalizeScore(bar.getAttribute('score') || '0')) || 0;
    const finalScale = Number(parseScaleValue(bar.getAttribute('scale')) ?? '1');

    bar.setAttribute('score', String(maxScore));
    bar.setAttribute('scale', '1');

    return {
      bar,
      maxScore,
      finalScore,
      finalScale,
    };
  });

  const startedAt = performance.now();
  const step = (now) => {
    const elapsed = now - startedAt;
    const progress = Math.min(1, elapsed / VIEWPORT_ANIMATION_MS);
    const easedProgress = EASE_OUT_CUBIC(progress);

    animationState.forEach(({
      bar, maxScore, finalScore, finalScale,
    }) => {
      const nextScore = maxScore + ((finalScore - maxScore) * easedProgress);
      const nextScale = 1 + ((finalScale - 1) * easedProgress);

      bar.setAttribute('score', nextScore.toFixed(2));
      bar.setAttribute('scale', nextScale.toFixed(4));
    });

    if (progress < 1) {
      requestAnimationFrame(step);
      return;
    }

    animationState.forEach(({ bar, finalScore, finalScale }) => {
      bar.setAttribute('score', finalScore.toFixed(2));
      bar.setAttribute('scale', String(finalScale));
    });
  };

  requestAnimationFrame(() => requestAnimationFrame(step));
};

const activateCompareAnimationsOnViewport = (compareSection) => {
  if (!('IntersectionObserver' in window)) {
    runBarsIntroAnimation(compareSection);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) {
      return;
    }
    observer.disconnect();
    runBarsIntroAnimation(compareSection);
  }, {
    threshold: 0.25,
    rootMargin: '0px 0px -10% 0px',
  });

  observer.observe(compareSection);
};

export default async function decorate(block) {
  const base = getDsnBase();
  await Promise.all([
    import(`${base}compare`),
    import(`${base}heading`),
    import(`${base}paragraph`),
    import(`${base}link`),
    import(`${base}image`),
  ]);

  const compareSection = buildCompareSection(block);
  block.replaceChildren(compareSection);
  activateCompareAnimationsOnViewport(compareSection);
}
