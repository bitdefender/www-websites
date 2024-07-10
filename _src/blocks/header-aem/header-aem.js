async function runWhitePageHeaderLogic(block, link) {
  block.classList.add('white', 'py-3', 'default-content-wrapper');

  if (link) {
    // create a link and inside it put the logo
    const logoLink = document.createElement('a');
    logoLink.href = link;
    logoLink.classList.add('logo-link');
    const image = block.querySelector('picture');
    logoLink.appendChild(image);
    block.appendChild(logoLink);
  }
}

/**
 * applies header factory based on header variation
 * @param {String} headerMetadata The header variation: landingpage' or none
 * @param {Element} header The header element
 */
function applyHeaderFactorySetup(headerMetadata, header, link) {
  switch (headerMetadata) {
    case 'white':
      runWhitePageHeaderLogic(header, link);
      break;
    default:
      break;
  }
}
export default async function decorate(block, options) {
  const {
    header, link,
  } = options ? options.metadata : block.closest('.section').dataset;

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.header-aem-wrapper');
    blockParent.classList.add('we-container');
  }

  block.parentNode.classList.add(header || 'default');

  applyHeaderFactorySetup(header, block, link);
}
