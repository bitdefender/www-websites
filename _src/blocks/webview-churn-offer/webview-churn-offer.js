/**
 * Churn offer modal for Bitdefender Central.
 *
 * Central renders it from another origin: @repobit/dex-target's getContentFragment()
 * -> lib-franklin-api.js loadComponent() imports this file and its css into a shadow root
 * and calls decorate(block, componentOptions). The host page has no import map and does not
 * run scripts.js, so this file must stay self-contained: no imports.
 *
 * Content (rows are found by what they contain, so authors can drop or add rows):
 * - copy: heading and text shown above the offer
 * - offer: the row with the <discounted-price-percentage> marker, replaced with the
 *   `hardcoded-discount` section metadata (e.g. 20%)
 * - support text: rows after the offer
 * - actions: a `#buylink` link (accept) and a `view_action=close` link (decline)
 * `<renewal-date>` anywhere is replaced with options.renewalDate, or removed.
 *
 * Options (componentOptions in getContentFragment):
 * - lang: locale used to format the renewal date, e.g. 'fr-fr' (default 'en-us')
 * - renewalDate: Date, ISO string or unix timestamp in seconds
 * - promotion: echoed in the event detail and passed to window.acceptDiscountedOffer
 * - onAccept, onDecline, onClose: callbacks receiving the event detail
 *
 * Every action also dispatches a composed, bubbling, cancelable CustomEvent
 * (`webview-churn-offer:accept`, `webview-churn-offer:decline`, `webview-churn-offer:close`)
 * that reaches the host document through the shadow root.
 * detail: { action, discount, lang, promotion }.
 * Decline and close keep the in-product `https://localhost/dynamicupsell?view_action=close`
 * link; navigation is prevented when a callback is passed or a listener calls preventDefault().
 * Accept without onAccept falls back to the in-product window.acceptDiscountedOffer(promotion).
 */

const CLOSE_URL = 'https://localhost/dynamicupsell?view_action=close';
const DISCOUNT_MARKER = /<\/?discounted-price-percentage>/gi;
const PRICEBOX_MARKER = '{PRICEBOX_V2}';

const isAcceptLink = (link) => link.getAttribute('href')?.includes('#buylink');
const isDeclineLink = (link) => link.getAttribute('href')?.includes('view_action=close');

/**
 * Replaces a text marker in every text node under root.
 * @param {Element} root
 * @param {RegExp} pattern global pattern
 * @param {() => Node|string} replacement
 */
function replaceTextMarker(root, pattern, replacement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    pattern.lastIndex = 0;
    if (pattern.test(walker.currentNode.nodeValue)) textNodes.push(walker.currentNode);
  }

  textNodes.forEach((textNode) => {
    const parts = textNode.nodeValue.split(pattern);
    const matches = textNode.nodeValue.match(pattern);
    const nodes = parts.flatMap((part, index) => {
      if (index === parts.length - 1) return [part];
      return [part, matches[index].startsWith('</') ? '' : replacement()];
    }).filter((node) => node !== '');
    textNode.replaceWith(...nodes);
  });
}

function createElement(tag, className, children = []) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.append(...children);
  return element;
}

/** Moves the children of the authored rows (and their single cell wrappers) into a container. */
function rowsContent(rows) {
  return rows.flatMap((row) => [...row.children].flatMap((cell) => [...cell.childNodes]));
}

function createAction({
  element, action, block, options, detail,
}) {
  const callbacks = {
    accept: options.onAccept,
    decline: options.onDecline,
    close: options.onClose,
  };
  element.dataset.webviewChurnOfferAction = action;
  element.addEventListener('click', (clickEvent) => {
    const eventDetail = { action, ...detail };
    const event = new CustomEvent(`webview-churn-offer:${action}`, {
      bubbles: true, composed: true, cancelable: true, detail: eventDetail,
    });
    const callback = callbacks[action];
    if (typeof callback === 'function') callback(eventDetail);
    block.dispatchEvent(event);

    if (typeof callback === 'function' || event.defaultPrevented) {
      clickEvent.preventDefault();
    } else if (action === 'accept' && typeof window.acceptDiscountedOffer === 'function') {
      window.acceptDiscountedOffer(options.promotion);
    }
  });
  return element;
}

export default function decorate(block, options = {}) {
  const lang = options.lang || 'en-us';
  const discount = block.closest('.section')?.dataset.hardcodedDiscount?.trim() || '';
  const detail = { discount, lang, promotion: options.promotion };

  const rows = [...block.children];
  const links = [...block.querySelectorAll('a')];
  const declineLink = links.find(isDeclineLink);
  // without #buylink, the other link next to the decline link is the accept action
  const declineRow = declineLink && rows.find((row) => row.contains(declineLink));
  const acceptLink = links.find(isAcceptLink)
    || [...(declineRow?.querySelectorAll('a') || [])].find((link) => link !== declineLink);

  const actionRows = rows
    .filter((row) => [acceptLink, declineLink].some((link) => link && row.contains(link)));
  const contentRows = rows.filter((row) => !actionRows.includes(row));
  const offerIndex = contentRows.findIndex((row) => {
    DISCOUNT_MARKER.lastIndex = 0;
    return DISCOUNT_MARKER.test(row.textContent) || row.textContent.includes(PRICEBOX_MARKER);
  });
  const copyRows = offerIndex === -1 ? contentRows : contentRows.slice(0, offerIndex);
  const offerRow = contentRows[offerIndex];
  const supportRows = offerIndex === -1 ? [] : contentRows.slice(offerIndex + 1);

  offerRow?.querySelectorAll('p').forEach((paragraph) => {
    if (paragraph.textContent.trim() === PRICEBOX_MARKER) paragraph.remove();
  });
  offerRow?.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('webview-churn-offer-discount');

  const actions = [];
  if (acceptLink) {
    const button = createElement('button', 'button', [createElement('span', 'button-text', [acceptLink.textContent.trim()])]);
    button.type = 'button';
    actions.push(createElement('p', 'button-container', [createAction({
      element: button, action: 'accept', block, options, detail,
    })]));
  }
  if (declineLink) {
    const link = createElement('a', 'button secondary', [createElement('span', 'button-text', [declineLink.textContent.trim()])]);
    link.href = declineLink.getAttribute('href');
    actions.push(createElement('p', 'button-container webview-churn-offer-dismiss', [createAction({
      element: link, action: 'decline', block, options, detail,
    })]));
  }

  const close = createElement('a', 'webview-churn-offer-close');
  close.href = CLOSE_URL;
  close.setAttribute('aria-label', 'Close');

  const content = createElement('div', 'webview-churn-offer-content', [
    createElement('div', 'webview-churn-offer-copy', rowsContent(copyRows)),
    ...(offerRow ? [createElement('div', 'webview-churn-offer-offer', rowsContent([offerRow]))] : []),
    ...(supportRows.length ? [createElement('div', 'webview-churn-offer-text-bottom', rowsContent(supportRows))] : []),
    ...(actions.length ? [createElement('div', 'webview-churn-offer-actions', actions)] : []),
  ]);

  block.replaceChildren(createAction({
    element: close, action: 'close', block, options, detail,
  }), content);

  replaceTextMarker(content, DISCOUNT_MARKER, () => createElement('span', 'prod-save', [discount]));
}
