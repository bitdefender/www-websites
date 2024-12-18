export default async function decorate(block) {
  const {
    product, saveText,
  } = block.closest('.section').dataset;

  let prodName; let prodUsers; let prodYears;
  if (product) {
    [prodName, prodUsers, prodYears] = product.split('/');
  }
  block.setAttribute('data-store-context', '');
  block.setAttribute('data-store-id', prodName);
  block.setAttribute('data-store-option', `${prodUsers}-${prodYears}`);
  block.setAttribute('data-store-department', 'consumer');
  block.setAttribute('data-store-event', 'product-loaded');

  const buyLink = block.querySelector('a[href*="#buylink"]');
  buyLink?.setAttribute('data-store-buy-link', '');

  [...block.children].forEach((child) => {
    if (child.textContent.includes('{PRICE_BOX}') && product) {
      child.innerHTML = child.innerHTML.replace('{PRICE_BOX}', '<div class="price-box">Price box</div>');
      child.innerHTML = `
      <div class="price-box">
        <div>
          <span class="prod-oldprice" data-store-price="full" data-store-hide="no-price=discounted"></span>
          <span class="prod-percent" data-store-hide="no-price=discounted"> <span data-store-discount="percentage"></span> ${saveText || ''} </span>
        </div>
        <div class="newprice-container mt-2">
          <span class="prod-newprice"> <span data-store-price="discounted||full"> </span></span>
        </div>
      </div>`;
    }
    if (child.textContent.includes('{under_price_text}')) {
      // remove the p tag that is wrapping the text {under_price_text}
      child.querySelector('p')?.remove();

      child.classList.add('under-price-text');
    }
  });

  const url = new URL(window.location.href);
  if (url.searchParams.has('theme') && url.searchParams.get('theme') === 'dark') {
    block.parentElement.classList.add('dark-mode');
  }

  block.querySelector('a').setAttribute('target', '_blank');
}
