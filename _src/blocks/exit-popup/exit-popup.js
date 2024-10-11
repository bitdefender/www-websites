import { getMetadata } from "../../scripts/lib-franklin.js";
import { GLOBAL_V2_LOCALES, getLocale, getPriceLocalMapByLocale, getBuyLinkCountryPrefix } from '../../scripts/utils/utils.js';

function dynamicBuyLink (buyLinkSelector, prodName, ProdUsers, prodYears, pid = null) {
  if (!buyLinkSelector) {
    return null;
  }
  const url = new URL(window.location.href);
  let buyLinkPid = pid || url.searchParams.get('pid') || getMetadata('pid') || '';

  if (GLOBAL_V2_LOCALES.includes(getLocale())) {
    buyLinkPid = 'pid.global_v2';
  }

  const forceCountry = getPriceLocalMapByLocale().country_code;
  let buyLinkHref = new URL(`${getBuyLinkCountryPrefix()}/${prodName.trim()}/${ProdUsers}/${prodYears}/${buyLinkPid}?force_country=${forceCountry}`);
  buyLinkSelector.setAttribute('href', buyLinkHref);
  // return buyLinkHref;
}

// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
  const parentSelector = block.closest('.section');
  const { product } = parentSelector.dataset;
  const url = new URL(window.location.href);
  const pid = url.searchParams.get('pid') || getMetadata('pid') || '';

  const productData = product ? product.split('/') : [];
  const [prodName, prodUsers, prodYears] = productData;
  const variant = `${prodUsers}u-${prodYears}y`;
  const buyLinkSelector = block.querySelector('p.button-container a');

  const existEl = document.createElement('span');
  existEl.id = 'exitAction';
  existEl.innerHTML = '<img src="/_src/icons/close_x.JPG" alt="Bitdefender">';
  parentSelector.appendChild(existEl);

  // add buyLink
  dynamicBuyLink(buyLinkSelector, prodName, prodUsers, prodYears, pid);


  const fetchProductData = async (prodName, variant, pid) => {
    const { fetchProduct } = await import('../../scripts/utils/utils.js');
    return await fetchProduct(prodName, variant, pid);
  };

  try {
    const fetchProduct = await fetchProductData(prodName, variant, pid);
    const { price, discount } = fetchProduct;
    const discountPercentage = Math.round((1 - discount.discounted_price / price) * 100);
    block.innerHTML = block.innerHTML.replace(/0%/g, `${discountPercentage}%`);
  } catch (error) {
    console.error('Error fetching product data:', error);
  }
}
