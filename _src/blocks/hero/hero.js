/* eslint-disable max-len */
// Description: Hero block
import { UserAgent } from '@repobit/dex-utils';
import {
  createTag,
  createNanoBlock,
  renderNanoBlocks,
  getBrowserName,
  wrapChildrenWithStoreContext,
} from '../../scripts/utils/utils.js';

function detectAndRenderOSContent(osLinkMapping, androidTemplate, iosTemplate, mobileHide, block) {
  const button = block.querySelector('a.button');
  const dynamicTextElement = button?.parentNode?.nextElementSibling;
  switch (UserAgent.os) {
    case 'android':
      if (mobileHide && block.closest('.section')) {
        block.closest('.section').classList.add('global-display-none');
        break;
      }

      if (button && androidTemplate && osLinkMapping && dynamicTextElement) {
        button.classList.add('android');
        button.href = osLinkMapping.android?.googlePlay;
        dynamicTextElement.querySelectorAll('a')?.forEach((anchor, index) => {
          anchor.textContent = osLinkMapping[androidTemplate.split(',')?.[index]?.trim()]?.text;
          anchor.href = osLinkMapping[androidTemplate.split(',')?.[index].trim()]?.link;
        });
      }
      break;

    case 'ios':
      if (mobileHide && block.closest('.section')) {
        block.closest('.section').classList.add('global-display-none');
        break;
      }

      if (button && iosTemplate && osLinkMapping && dynamicTextElement) {
        button.classList.add('ios');
        button.href = osLinkMapping.ios?.appStore;
        dynamicTextElement.querySelectorAll('a')?.forEach((anchor, index) => {
          anchor.textContent = osLinkMapping[iosTemplate.split(',')?.[index]?.trim()]?.text;
          anchor.href = osLinkMapping[iosTemplate.split(',')?.[index]?.trim()]?.link;
        });
      }
      break;

    default:
      break;
  }
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} element The container element
 */
function buildHeroBlock(element) {
  const h1 = element.querySelector('h1');
  const picture = element.querySelector('picture');
  const pictureParent = picture ? picture.parentNode : false;
  const section = document.querySelector('div.hero');
  const subSection = document.querySelector('div.hero div');
  subSection.classList.add('hero-content');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const isHomePage = window.location.pathname.split('/').filter((item) => item).length === 1;

    if (!isHomePage) {
      const breadcrumb = createTag('div', { class: 'breadcrumb' });
      document.querySelector('div.hero div div:first-child').prepend(breadcrumb);
    }

    const pictureEl = document.createElement('div');
    pictureEl.classList.add('hero-picture');
    pictureEl.append(picture);
    section.prepend(pictureEl);

    pictureParent.remove();
  } else {
    subSection.classList.add('hero-content-full');
  }
}

createNanoBlock('discount', (code, label = '{label}') => {
  // code = "av/3/1"
  const [product, unit, year] = code.split('/');

  const root = document.createElement('bd-product');
  // Add the required attributes to the root element
  root.setAttribute('product-id', product);
  root.innerHTML = `
    <bd-option devices="${unit}" subscription="${year}">
      <div data-store-render data-store-hide="!it.option.price.discounted" class="discount-bubble await-loader">
        <div data-store-render data-store-discount="percentage" class="discount-bubble-0">--%</div>
        <span class="discount-bubble-1">${label}</span>
      </div>
    </bd-option>
  `;

  return root;
});

createNanoBlock('europe_badge', (badgeText) => {
  // code = "europe"
  const root = document.createElement('div');
  root.classList.add('europe-badge');

  const europeFlag = document.createElement('div');
  europeFlag.classList.add('europe-flag');
  root.appendChild(europeFlag);

  const flagText = document.createElement('span');
  flagText.classList.add('europe-badge__text');
  flagText.textContent = badgeText;
  root.appendChild(flagText);

  return root;
});

async function renderBubble(block) {
  await renderNanoBlocks(block);
  const bubble = block?.querySelector('.discount-bubble');
  if (bubble) {
    const { label } = block.closest('.section').dataset;
    if (label) {
      bubble.innerHTML = bubble.innerHTML.replace('{label}', label);
    }

    let sibling = bubble.previousElementSibling;

    while (sibling) {
      if (sibling.matches('.button-container')) {
        sibling.append(bubble);
        break;
      }
      sibling = sibling.previousElementSibling;
    }
  }
}

/**
 * decorates hero block
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const parentSection = block.closest('.section');
  const {
    // this defines wether the modals automatically refresh or not in the hero banner
    stopAutomaticModalRefresh,
    signature,
    percentProduct,
    discountedPrice,
    firefoxUrl,
    buttonImage,
    iosLink,
    androidLink,
    windowsLink,
    macLink,
    androidTemplate,
    iosTemplate,
    appStoreLink,
    googlePlayLink,
    backgroundcolor,
    textcolor,
    mobileHide,
  } = parentSection.dataset;

  buildHeroBlock(block);
  renderBubble(block);
  let osLinkMapping = null;
  if (androidLink && iosLink) {
    osLinkMapping = {
      android: {
        link: androidLink,
        googlePlay: googlePlayLink,
        text: 'Android',
      },
      ios: {
        link: iosLink,
        appStore: appStoreLink,
        text: 'iOS',
      },
      windows: {
        link: windowsLink,
        text: 'Windows',
      },
      mac: {
        link: macLink,
        text: 'macOS',
      },
    };
  }

  detectAndRenderOSContent(osLinkMapping, androidTemplate, iosTemplate, mobileHide, block);
  // Eager load images to improve LCP
  [...block.querySelectorAll('img')].forEach((el) => el.setAttribute('loading', 'eager'));

  if (backgroundcolor) {
    parentSection.style.backgroundColor = backgroundcolor;
    block.style.backgroundColor = backgroundcolor;
  }

  // get div class hero-content
  const elementHeroContent = block.querySelector('.hero div.hero-content div');
  if (elementHeroContent !== null) {
    // Select  <ul> elements that contain a <picture> tag
    const ulsWithPicture = Array.from(document.querySelectorAll('ul')).filter((ul) => ul.querySelector('picture'));

    // Apply a CSS class to each selected <ul> element
    ulsWithPicture.forEach((ul) => ul.classList.add('hero-awards'));

    // add signature to the top of the banner
    if (signature) {
      const signatureElement = createTag('div', { class: 'signature' });
      signatureElement.textContent = signature;
      document.querySelector('div.hero div div:first-child').prepend(signatureElement);
    }

    if (textcolor) {
      block.querySelectorAll('.hero-content > div, .hero-content > div *').forEach((el) => {
        el.style.color = textcolor;
      });
    }

    // set the modal buttons in the hero banner to not refresh the modal on click
    if (stopAutomaticModalRefresh === 'true') {
      block.querySelectorAll('a.modal.button').forEach((modalButton) => {
        modalButton.setAttribute('data-stop-automatic-modal-refresh', true);
      });
    }

    if (buttonImage) {
      const buttonImageEl = document.createElement('img');
      buttonImageEl.setAttribute('src', buttonImage);
      const heroBtn = block.querySelector('a');
      heroBtn.insertAdjacentElement('afterbegin', buttonImageEl);
    }
  }

  // make discount dynamic
  if (percentProduct || discountedPrice) {
    const [alias, variant] = percentProduct?.split(',') || discountedPrice.split(',');
    block.setAttribute('data-store-context', '');
    block.setAttribute('data-store-text-variable', '');
    block.setAttribute('data-store-id', alias);
    block.setAttribute('data-store-department', 'consumer');
    block.setAttribute('data-store-option', variant);
    block.querySelector('div').classList.add('await-loader');

    if (discountedPrice) {
      const dicountedTable = block.querySelector('table');
      dicountedTable.innerHTML = dicountedTable.innerHTML.replace('[discounted_price]', '<strong data-store-price="discounted||full"></strong>');
    }
  }

  // Add the await-loader class to the button that leads to the thank you page, this is an exception
  // for the free antivirus page
  if (block.querySelector('.button-container a[href*="/consumer/thank-you"]')) {
    block.querySelector('.button-container a[href*="/consumer/thank-you"]').classList.add('await-loader');
  }

  if (firefoxUrl && getBrowserName() === 'Firefox') {
    block.querySelector('a').href = firefoxUrl;
  }
}
