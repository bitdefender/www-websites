import page from '../page.js';
import { decorateBlocks, decorateSections, loadCSS } from '../lib-franklin.js';

/*
 * TODO(DEX-29605): remove after Black Friday 2026 (ends 2 Dec 2026, 11:00).
 *
 * The Black Friday 2026 ribbon, for the traffic Adobe Target's activity doesn't reach. The
 * markup, classes and copy are the activity's, so whichever of the two renders the ribbon, it
 * looks the same; on Target's traffic the activity replaces this one.
 *
 * Only the news bar at the top of the page becomes the ribbon; a page that doesn't start with one
 * gets a new one there (see addBlackFridayRibbon).
 *
 * Everything for it is in this folder, plus the lines marked TODO(DEX-29605) elsewhere
 * (`grep -rn DEX-29605 src`). To remove it:
 *   1. delete src/scripts/black-friday/ and src/tests/scripts/black-friday-ribbon.test.js
 *   2. delete the marked lines in src/blocks/news-bar/news-bar.js and src/scripts/scripts.js
 *   3. npm run build, commit _src/ with it
 */

// the campaign ends on 2 Dec 2026, 11:00, Bucharest time; it starts when this code ships
const END = new Date('2026-12-02T11:00:00+02:00');

// ribbon linking to the Solutions page, with the biggest discount of its plans
const PAGES_WITH_LINKED_RIBBON = ['antivirus', 'antivirus-for-mac', 'security-for-creators', 'mobile-security-android', 'mobile-security-ios', 'small-office-security', 'scam-protection', 'realcheck', 'identity-theft-protection', 'scamio', 'reverse-phone-lookup', 'digital-footprint-checker', 'password-generator', 'link-checker', 'ai-skills-checker'];
// ribbon without a link, with the biggest discount on the page
const PAGES_WITH_STATIC_RIBBON = ['consumer', 'individual', 'family', 'small-business-security', 'total-security', 'premium-security', 'ultimate-security', 'vpn', 'password-manager', 'digital-identity-protection'];
// Small Office Security links to the Solutions page only on these locales; elsewhere it is static
const SMALL_OFFICE_LINKED_LOCALES = ['en-us', 'en-gb'];

// the plans whose biggest discount a linked ribbon shows, as on the Solutions page
const SOLUTIONS_PRODUCTS = ['ts_f', 'ps_f', 'us_f'];
// en-us also sells Ultimate Security Plus Family
const SOLUTIONS_PRODUCTS_EN_US = [...SOLUTIONS_PRODUCTS, 'us_pf'];

const DISCOUNT = '<span data-store-render data-store-context-discount="max-percentage" class="await-loader"></span>';

const MAIN_TEXT = {
  en: 'Black Friday Limited Time deals!',
  de: 'Zeitlich begrenzte Angebote zum Black Friday!',
  es: '¡Ofertas por tiempo limitado del Black Friday!',
  fr: 'Offres à durée limitée pour le Black Friday&nbsp;!',
  it: 'Offerte a tempo limitato del Black Friday!',
  nl: 'Black Friday-Tijdelijke aanbieding!',
  pt: 'Ofertas por tempo limitado da Black Friday!',
  ro: 'Black Friday! Ofertă limitată!',
  sv: 'Black Friday-Tidsbegränsade erbjudanden!',
  zh: '黑色星期五限時優惠！',
};

const SUB_TEXT = {
  en: `Save up to ${DISCOUNT}!`,
  de: `Sparen Sie bis zu ${DISCOUNT}!`,
  es: `¡Obtenga hasta un ${DISCOUNT} de descuento!`,
  fr: `Économisez jusqu’à ${DISCOUNT}&nbsp;!`,
  it: `Risparmia fino a un ${DISCOUNT}!`,
  nl: `Bespaar tot ${DISCOUNT}!`,
  pt: `Economize até ${DISCOUNT} de desconto!`,
  ro: `Economisește până la ${DISCOUNT}!`,
  sv: `Spara upp till ${DISCOUNT}!`,
  zh: `最高可省 ${DISCOUNT}!`,
};

const isCampaignRunning = () => new Date() < END;

/**
 * @returns {{ linked: boolean } | null} the ribbon this page shows, or null when it shows none
 */
export function getBlackFridayRibbon() {
  if (!MAIN_TEXT[page.language] || !isCampaignRunning()) return null;

  if (PAGES_WITH_LINKED_RIBBON.includes(page.name)) {
    const linked = page.name !== 'small-office-security'
      || SMALL_OFFICE_LINKED_LOCALES.includes(page.locale);
    return { linked };
  }

  return PAGES_WITH_STATIC_RIBBON.includes(page.name) ? { linked: false } : null;
}

// the section of the news bar that becomes the ribbon
const RIBBON_SECTION_CLASS = 'bf-ribbon';

const getFolder = () => `${window.hlx.codeBasePath}/scripts/black-friday`;

// The ribbon sits right above the LCP block, so waitForLCP loads it before the page shows, but
// only once the LCP block has loaded. addBlackFridayRibbon requests the news bar's files and the
// ribbon's styles at once instead, and the ribbon waits for the styles, so it never shows unstyled.
let ribbonStyles;
const loadRibbonStyles = () => {
  ribbonStyles ??= Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/news-bar/news-bar.css`),
    loadCSS(`${getFolder()}/ribbon.css`),
  ]);
  return ribbonStyles;
};

const preloadNewsBar = () => {
  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = `${window.hlx.codeBasePath}/blocks/news-bar/news-bar.js`;
  document.head.append(link);
  loadRibbonStyles();
};

/**
 * Picks the news bar that becomes the ribbon: the one at the top of the page, if the page starts
 * with one. Otherwise the page gets a new one at the top, in place of its blue top ribbon. Either
 * way, the news bars further down the page stay as authored.
 * @param {Element} main the decorated main element
 */
export function addBlackFridayRibbon(main) {
  if (!getBlackFridayRibbon()) return;
  preloadNewsBar();

  const firstSection = main.querySelector(':scope > .section');
  if (firstSection?.classList.contains('news-bar-container')) {
    firstSection.classList.add(RIBBON_SECTION_CLASS);
    return;
  }

  if (firstSection?.classList.contains('top_blue')) firstSection.remove();
  const container = document.createElement('div');
  container.innerHTML = '<div><div class="news-bar"><div><div></div></div></div></div>';
  decorateSections(container);
  decorateBlocks(container);
  const section = container.firstElementChild;
  section.classList.add('no-spacing', RIBBON_SECTION_CLASS);
  main.prepend(section);
}

/**
 * @param {Element} block a news-bar block
 * @returns {boolean} whether addBlackFridayRibbon picked it to become the ribbon
 */
export const isBlackFridayRibbon = (block) => !!block.closest(`.section.${RIBBON_SECTION_CLASS}`);

/**
 * Replaces the news bar's content with the Black Friday ribbon.
 * @param {Element} block the news-bar block, one isBlackFridayRibbon picked
 * @returns {Promise<void>} resolves once the ribbon's styles are loaded
 */
export async function renderBlackFridayRibbon(block) {
  const { linked } = getBlackFridayRibbon();
  const tagIcon = `${getFolder()}/images/ribbon-tag.png`;
  const textArea = `
    <div class="bf-text-area">
      <img class="bf-discount-logo" src="${tagIcon}" width="20" height="23" alt="">
      <p class="bf-text">
        <strong>${MAIN_TEXT[page.language]}</strong>
        <span class="bf-subtext">${SUB_TEXT[page.language]}</span>
      </p>
    </div>`;

  if (!linked) {
    block.innerHTML = `<div>${textArea}</div>`;
  } else {
    // The plans live in the ribbon's own store context, hidden, so "Save up to" is their
    // biggest discount and the rest of the page is not affected.
    const products = page.locale === 'en-us' ? SOLUTIONS_PRODUCTS_EN_US : SOLUTIONS_PRODUCTS;
    const options = products.map((id) => `<bd-product product-id="${id}"><bd-option devices="25" subscription="12"></bd-option></bd-product>`).join('');
    block.innerHTML = `
      <a class="bf-ribbon-link" href="/${page.locale}/consumer/">
        <bd-context class="bf-ribbon-context" topology-boundary>
          <div hidden>${options}</div>
          ${textArea}
        </bd-context>
      </a>`;
  }

  block.closest('.section')?.classList.add('bf-25');
  await loadRibbonStyles();
}
