/*
 * AEM Embed WebComponent
 * Include content from one Helix page in any other web surface.
 * https://www.hlx.live/developer/block-collection/TBD
 */
import Launch from '@repobit/dex-launch';
import {
  PageLoadedEvent,
  AdobeDataLayerService,
} from '@repobit/dex-data-layer';
import page from './page.js';
import { target } from './target.js';
import { StoreResolver } from './libs/store/index.js';
import {
  GLOBAL_EVENTS,
} from './utils/utils.js';
import {
  resolveNonProductsDataLayerforWidgets,
} from './libs/data-layer.js';
// eslint-disable-next-line import/prefer-default-export
export class AEMEmbed extends HTMLElement {
  constructor() {
    super();

    // Attaches a shadow DOM tree to the element
    // With mode open the shadow root elements are accessible from JavaScript outside the root
    this.attachShadow({ mode: 'open' });

    // Keep track if we have rendered the fragment yet.
    this.initialized = false;

    window.hlx = window.hlx || {};
    window.hlx.suppressLoadPage = true;
    [window.hlx.codeBasePath] = new URL(import.meta.url).pathname.split('/scripts/');
  }

  // eslint-disable-next-line class-methods-use-this
  async loadBlock(body, block, blockName, origin) {
    const blockCss = `${origin}${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`;
    if (!body.querySelector(`link[href="${blockCss}"]`)) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', blockCss);

      const cssLoaded = new Promise((resolve) => {
        link.onload = resolve;
        link.onerror = resolve;
      });

      body.appendChild(link);
      // eslint-disable-next-line no-await-in-loop
      await cssLoaded;
    }

    try {
      const blockScriptUrl = `${origin}${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.js`;
      // eslint-disable-next-line no-await-in-loop
      const decorateBlock = await import(blockScriptUrl);
      if (decorateBlock.default) {
        // Create callback for when data loads
        const onDataLoaded = new Promise((resolve) => {
          if (window.openai?.toolOutput) {
            // Already available
            resolve(window.openai.toolOutput);
          } else {
            // Wait for the event
            window.addEventListener('openai:set_globals', () => {
              if (window.openai?.toolOutput) {
                resolve(window.openai.toolOutput);
              }
            });
          }
        });

        // Call decorate immediately with the callback
        // eslint-disable-next-line no-await-in-loop
        await decorateBlock.default(block, onDataLoaded);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('An error occured while loading the content');
    }
    const blockLinks = block.querySelectorAll('a[href]');
    blockLinks.forEach((link) => {
      const rawHref = link.getAttribute('href');
      if (!rawHref) return;

      const newUrl = new URL(rawHref, origin).href;
      link.href = newUrl;
    });
  }

  async handleHeader(htmlText, body, origin) {
    await this.pseudoDecorateMain(htmlText, body, origin);

    const main = body.querySelector('main');
    const header = document.createElement('header');
    body.append(header);
    const { buildBlock } = await import(`${origin}${window.hlx.codeBasePath}/scripts/lib-franklin.js`);
    const block = buildBlock('header', '');
    header.append(block);

    const cell = block.firstElementChild.firstElementChild;
    const nav = document.createElement('nav');
    cell.append(nav);
    while (main.firstElementChild) nav.append(main.firstElementChild);
    main.remove();

    await this.loadBlock(body, block, 'header', origin);

    block.dataset.blockStatus = 'loaded';

    body.style.height = 'var(--nav-height)';
    body.classList.add('appear');
  }

  async handleFooter(htmlText, body, origin) {
    await this.pseudoDecorateMain(htmlText, body, origin);

    const main = body.querySelector('main');
    const footer = document.createElement('footer');
    body.append(footer);
    const { buildBlock } = await import(`${origin}${window.hlx.codeBasePath}/scripts/lib-franklin.js`);
    const block = buildBlock('footer', '');
    footer.append(block);

    const cell = block.firstElementChild.firstElementChild;
    const nav = document.createElement('nav');
    cell.append(nav);
    while (main.firstElementChild) nav.append(main.firstElementChild);
    main.remove();

    await this.loadBlock(body, block, 'footer', origin);

    block.dataset.blockStatus = 'loaded';
    body.classList.add('appear');
  }

  async pseudoDecorateMain(htmlText, body, origin) {
    const main = document.createElement('main');
    body.append(main);
    main.innerHTML = htmlText;

    const { decorateMain } = await import(`${origin}${window.hlx.codeBasePath}/scripts/scripts.js`);
    if (decorateMain) {
      await decorateMain(main, true);
    }

    // Query all the blocks in the aem content
    // The blocks are in the first div inside the main tag
    const blockElements = main.querySelectorAll('.block');

    // Did we find any blocks or all default content?
    if (blockElements.length > 0) {
      // Get the block names
      const blocks = Array.from(blockElements).map((block) => block.classList.item(0));

      // For each block in the embed load it's js/css
      for (let i = 0; i < blockElements.length; i += 1) {
        const blockName = blocks[i];
        const block = blockElements[i];
        // eslint-disable-next-line no-await-in-loop
        await this.loadBlock(body, block, blockName, origin);
      }
    }

    const sections = main.querySelectorAll('.section');
    sections.forEach((s) => {
      s.dataset.sectionStatus = 'loaded';
      s.style = '';
    });
  }

  async handleMain(htmlText, body, origin) {
    await this.pseudoDecorateMain(htmlText, body, origin);

    const onAdobeMcLoaded = () => {
      document.dispatchEvent(new Event(GLOBAL_EVENTS.ADOBE_MC_LOADED));
      window.ADOBE_MC_EVENT_LOADED = true;
    };

    try {
      await Launch.load(page.environment);
      onAdobeMcLoaded();
    } catch {
      target.abort();
    }
    await StoreResolver.resolve(body);
    const elements = body.querySelectorAll('.await-loader');
    // document.dispatchEvent(new Event('bd_page_ready'));
    // window.bd_page_ready = true;
    elements.forEach((element) => {
      element.classList.remove('await-loader');
    });

    body.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(e.target.href, '_blank');
      });
    });

    body.classList.add('appear');
    await resolveNonProductsDataLayerforWidgets();
    AdobeDataLayerService.push(new PageLoadedEvent());
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   * This will happen each time the node is moved, and may happen before the element's contents
   * have been fully parsed.
   */
  async connectedCallback() {
    if (!this.initialized) {
      try {
        const urlAttribute = this.attributes.getNamedItem('url');
        if (!urlAttribute) {
          throw new Error('aem-embed missing url attribute');
        }

        const type = this.getAttribute('type') || 'main';

        const body = document.createElement('body');
        body.style = 'display: none';
        this.shadowRoot.append(body);

        const url = urlAttribute.value;
        const plainUrl = url.endsWith('/') ? `${url}index.plain.html` : `${url}.plain.html`;
        const { href, origin } = new URL(plainUrl);

        // Load fragment
        const resp = await fetch(href);
        if (!resp.ok) {
          throw new Error(`Unable to fetch ${href}`);
        }

        const styles = document.createElement('link');
        styles.setAttribute('rel', 'stylesheet');
        styles.setAttribute('href', `${origin}${window.hlx.codeBasePath}/styles/styles.css`);
        styles.onload = () => { body.style = ''; };
        styles.onerror = () => { body.style = ''; };
        this.shadowRoot.appendChild(styles);

        let htmlText = await resp.text();
        // Fix relative image urls
        const regex = /.\/media/g;
        htmlText = htmlText.replace(regex, `${origin}/media`);

        // Set initialized to true so we don't run through this again
        this.initialized = true;

        if (type === 'main') await this.handleMain(htmlText, body, origin);
        if (type === 'header') await this.handleHeader(htmlText, body, origin);
        if (type === 'footer') await this.handleFooter(htmlText, body, origin);

        const fonts = document.createElement('link');
        fonts.setAttribute('rel', 'stylesheet');
        fonts.setAttribute('href', `${origin}${window.hlx.codeBasePath}/styles/fonts.css`);
        this.shadowRoot.appendChild(fonts);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err || 'An error occured while loading the content');
      }
    }
  }

  /**
   * Imports a script and appends to document body
   * @param {*} url
   * @returns
   */

  // eslint-disable-next-line class-methods-use-this
  async importScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.type = 'module';
      script.onload = resolve;
      script.onerror = reject;

      document.body.appendChild(script);
    });
  }
}

customElements.define('aem-embed', AEMEmbed);
window.AdobeDataLayerService = AdobeDataLayerService;
