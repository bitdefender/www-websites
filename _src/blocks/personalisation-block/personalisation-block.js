import { target } from '../../scripts/target.js';
import { decorateMain, detectModalButtons } from '../../scripts/scripts.js';
import { decorateIcons, loadBlocks } from '../../scripts/lib-franklin.js';
import page from '../../scripts/page.js';

function decorateHTMLOffer(aemHeaderHtml) {
  const newHtml = document.createElement('div');
  newHtml.innerHTML = aemHeaderHtml;
  decorateMain(newHtml);
  detectModalButtons(newHtml);

  return newHtml;
}

async function loadAndInjectAiPageContent(block, path) {
  try {
    const response = await fetch(path);
    if (response.ok) {
      const htmlContent = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Extract and inject styles from head
      const styles = doc.querySelectorAll('head link[rel="stylesheet"], head style');
      styles.forEach((style) => {
        if (!document.head.contains(style) && !document.head.querySelector(`[href="/_src/blocks/personalisation-block/ai-page/${style.href}"]`)) {
          const clonedStyle = style.cloneNode(true);
          document.head.appendChild(clonedStyle);
        }
      });

      // Extract and inject scripts from head and body
      const scripts = doc.querySelectorAll('body > script');
      scripts.forEach((script) => {
        if (!document.head.querySelector(`script[src="${script.src}"]`)) {
          // const clonedScript = script.cloneNode(true);
          // document.head.appendChild(clonedScript);
          const newScript = document.createElement('script');
          newScript.src = `${script.getAttribute('src')}`;
          newScript.defer = true;
          document.body.appendChild(newScript);
        }
      });

      // Extract just the body content (wrapper div)
      const wrapperContent = doc.querySelector('.wrapper');
      if (wrapperContent) {
        block.innerHTML += wrapperContent.outerHTML;
      } else {
        // Fallback if wrapper not found, use body content
        block.innerHTML = doc.body.innerHTML;
      }
    } else {
      block.innerHTML = '<div class="ai-page-error">Failed to load AI page content</div>';
    }
  } catch (error) {
    block.innerHTML = '<div class="ai-page-error">Failed to load AI page content</div>';
    console.error('Error loading AI page content:', error);
  }
}

async function injectAiPage(block) {
  await loadAndInjectAiPageContent(block, '/_src/blocks/personalisation-block/ai-page/components/hero-js/hero.html');
  await loadAndInjectAiPageContent(block, '/_src/blocks/personalisation-block/ai-page/index.html');
  document.body.classList.add('ai-page');
}



export default async function decorate(block) {
  const {
    mboxName, path, aiPage,
  } = block.closest('.section').dataset;

  if (aiPage) {
    injectAiPage(block);
    return;
  }

  block.innerHTML += `
    <div class="personalized-content"></div>
  `;
  block.classList.add('await-loader');

  const offer = await target.getOffers({
    mboxNames: mboxName,
  });
  if (offer?.offer) {
    const pageCall = await fetch(`/${page.locale}${path}${offer.offer}.plain.html`);
    let offerHtml;
    await loadBlocks(block.querySelector('.personalized-content'));
    if (pageCall.ok) {
      offerHtml = await pageCall.text();
      const decoratedOfferHtml = decorateHTMLOffer(offerHtml);

      block.querySelector('.personalized-content').innerHTML = decoratedOfferHtml.innerHTML;
      await loadBlocks(block.querySelector('.personalized-content'));
      decorateIcons(block);
    }
  }
}
