import { STICKY_NAVIGATION_DATASET_KEY } from '../../scripts/lib-franklin.js';

const DSN_FALLBACK = 'https://esm.sh/@repobit/dex-system-design@0.23.13/';

const getDsnBase = () => {
  try {
    const map = document.querySelector('script[type="importmap"]');
    const imports = JSON.parse(map?.textContent || '{}').imports || {};
    return imports['@repobit/dex-system-design/'] || DSN_FALLBACK;
  } catch {
    return DSN_FALLBACK;
  }
};

/**
 * Collect nav item definitions from the page sections.
 * Reads labels from section-metadata entries with key "Sticky navigation item"
 * (stored by Franklin as section.dataset[STICKY_NAVIGATION_DATASET_KEY]).
 * Falls back to the first heading found in each section.
 */
function collectMenuItems(block) {
  const stickySection = block.closest('.section');
  const sections = Array.from(document.querySelectorAll('.section'))
    .filter((section) => section !== stickySection);

  const sectionsWithLabels = sections.filter(
    (section) => section.dataset[STICKY_NAVIGATION_DATASET_KEY],
  );

  if (sectionsWithLabels.length) {
    return sectionsWithLabels.map((section) => ({
      label: section.dataset[STICKY_NAVIGATION_DATASET_KEY],
      section,
    }));
  }

  return sections
    .map((section) => {
      const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
      const label = heading?.textContent?.trim() || '';
      return label ? { label, section } : null;
    })
    .filter(Boolean);
}

function buildAnchorNav(block) {
  const menuItems = collectMenuItems(block);

  // Prepend a <span id="anchor-N-section"> to each target section so the DS
  // scrollspy can find its targets without overwriting the section's own id.
  menuItems.forEach((item, index) => {
    if (!item.section) return;
    const anchorId = `anchor-${index + 1}-section`;
    let marker = item.section.querySelector(`:scope > [data-anchor-marker="${anchorId}"]`);
    if (!marker) {
      marker = document.createElement('span');
      marker.setAttribute('data-anchor-marker', anchorId);
      marker.setAttribute('aria-hidden', 'true');
      item.section.prepend(marker);
    }
    marker.id = anchorId;
  });

  const anchorNav = document.createElement('bd-anchor-nav');
  menuItems.forEach((item) => {
    const navItem = document.createElement('bd-anchor-nav-item');
    navItem.setAttribute('title', item.label);
    anchorNav.appendChild(navItem);
  });

  const ctaLink = block.querySelector('a');
  if (ctaLink) {
    const ctaHref = ctaLink.getAttribute('href')?.replace(/\.html(?=#|$)/, '') || '';
    const ctaLabel = ctaLink.textContent.trim();
    const ctaKind = block.closest('.section')?.dataset.kind || 'danger';

    const buttonLink = document.createElement('bd-button-link');
    buttonLink.setAttribute('slot', 'cta');
    buttonLink.setAttribute('href', ctaHref);
    buttonLink.setAttribute('kind', ctaKind);
    buttonLink.textContent = ctaLabel;
    anchorNav.appendChild(buttonLink);
  }

  block.replaceChildren(anchorNav);
}

export default async function decorate(block) {
  const base = getDsnBase();
  await Promise.all([
    import(`${base}anchor`),
    import(`${base}button`),
  ]);
  buildAnchorNav(block);
}
