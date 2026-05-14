import { STICKY_NAVIGATION_DATASET_KEY } from '../../scripts/lib-franklin.js';

const DSN_FALLBACK = 'https://esm.sh/@repobit/dex-system-design@0.23.30/';

const getDsnBase = () => {
  try {
    const map = document.querySelector('script[type="importmap"]');
    const imports = JSON.parse(map?.textContent || '{}').imports || {};
    return imports['@repobit/dex-system-design/'] || DSN_FALLBACK;
  } catch {
    return DSN_FALLBACK;
  }
};

// ─── helpers ───────────────────────────────────────────────────────────────────

/** True if href is an anchor on the current page (#id or /same-path#id). */
function isPageAnchorHref(href) {
  if (!href) return false;
  if (href.startsWith('#')) return true;
  try {
    const url = new URL(href, window.location.href);
    return url.pathname === window.location.pathname && Boolean(url.hash);
  } catch {
    return false;
  }
}

/** Extract bare fragment id from #id or /page#id. */
function extractAnchorId(href) {
  if (href.startsWith('#')) return href.slice(1);
  try {
    return new URL(href, window.location.href).hash.slice(1);
  } catch {
    return '';
  }
}

// ─── section items (mode B + fallback for mode A) ────────────────────────────

function collectSectionItems(block) {
  const stickySection = block.closest('.section');
  const sections = Array.from(document.querySelectorAll('.section'))
    .filter((s) => s !== stickySection);

  const labeled = sections.filter((s) => s.dataset[STICKY_NAVIGATION_DATASET_KEY]);
  if (labeled.length) {
    return labeled.map((section) => ({
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

// ─── mode A: authored rows ────────────────────────────────────────────────────

/** Label from an authored <p>: prefers link title/text, falls back to plain text. */
function getRowLabel(p) {
  const link = p.querySelector('a');
  return link?.getAttribute('title') || link?.textContent.trim() || p.textContent.trim();
}

function buildFromAuthoredRows(anchorNav, block, activeLabel) {
  const sectionItems = collectSectionItems(block);

  const rows = Array.from(block.querySelectorAll('p')).filter(
    (p) => p.textContent.trim() !== '',
  );

  rows.forEach((p, index) => {
    const link = p.querySelector('a[href]');
    const label = getRowLabel(p);
    let href = '';

    if (link) {
      const rawHref = link.getAttribute('href') || '';
      href = isPageAnchorHref(rawHref) ? `#${extractAnchorId(rawHref)}` : rawHref;
    } else {
      // No authored link — fall back to section-metadata by matching label.
      const match = sectionItems.find(
        (item) => item.label.toLowerCase() === label.toLowerCase(),
      );
      if (match) {
        if (!match.section.id) match.section.id = `nav-section-${index + 1}`;
        href = `#${match.section.id}`;
      }
    }

    const navItem = document.createElement('bd-anchor-nav-item');
    navItem.setAttribute('title', label);
    if (href) navItem.setAttribute('href', href);
    anchorNav.appendChild(navItem);
  });

  // setTimeout(0) lets LitElement finish before we override the active item.
  if (activeLabel) {
    const idx = rows.findIndex(
      (p) => getRowLabel(p).toLowerCase() === activeLabel.toLowerCase(),
    );
    if (idx >= 0) {
      setTimeout(() => { anchorNav.activeId = `anchor-${idx + 1}`; }, 0);
    }
  }
}

function buildFromSections(anchorNav, block) {
  const items = collectSectionItems(block);

  items.forEach((item, index) => {
    if (!item.section.id) {
      item.section.id = `nav-section-${index + 1}`;
    }

    const navItem = document.createElement('bd-anchor-nav-item');
    navItem.setAttribute('title', item.label);
    navItem.setAttribute('href', `#${item.section.id}`);
    anchorNav.appendChild(navItem);
  });

  // Optional CTA: shown when the block contains a link. `data-kind` on the
  // section controls the button style; falls back to 'danger' when absent.
  const section = block.closest('.section');
  const ctaKind = section?.dataset.kind || 'danger';
  const ctaLink = block.querySelector('a');
  if (ctaLink) {
    const ctaHref = ctaLink.getAttribute('href')?.replace(/\.html(?=#|$)/, '') || '';
    const ctaLabel = ctaLink.textContent.trim();

    const buttonLink = document.createElement('bd-button-link');
    buttonLink.setAttribute('slot', 'cta');
    buttonLink.setAttribute('href', ctaHref);
    buttonLink.setAttribute('kind', ctaKind);
    buttonLink.textContent = ctaLabel;
    anchorNav.appendChild(buttonLink);
  }
}

// ─── main decorator ────────────────────────────────────────────────────────────

function buildAnchorNav(block) {
  const navSection = block.closest('.section');
  const activeLabel = navSection?.dataset.active || '';

  // Mode A: 2+ authored <p> rows → nav from block content, no CTA.
  // Mode B: 0–1 rows → nav from section-metadata/headings, optional CTA.
  const authoredRows = Array.from(block.querySelectorAll('p')).filter(
    (p) => p.textContent.trim() !== '',
  );
  const isAuthoredMode = authoredRows.length >= 2;

  const anchorNav = document.createElement('bd-anchor-nav');

  if (isAuthoredMode) {
    buildFromAuthoredRows(anchorNav, block, activeLabel);

    // DS preventDefault blocks non-hash links — handle navigation manually.
    anchorNav.addEventListener('click', (e) => {
      const bdLink = e.composedPath().find((el) => el.tagName === 'BD-LINK');
      if (!bdLink) return;
      const href = bdLink.getAttribute('href');
      if (!href || href.startsWith('#')) return; // hash links handled by DS scrollspy
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        // Same page, no hash → scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
    });
  } else {
    buildFromSections(anchorNav, block);
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
