export default function decorate(block) {
  const contentWrapper = block.querySelector('div:not(:first-child)');
  contentWrapper.classList.add('data-wrapper');
  const columnLeft = block.querySelector('.data-wrapper > div:first-of-type');
  columnLeft.classList.add('data-column-left');
  const columnRight = block.querySelector('.data-wrapper > div:nth-of-type(2)');
  columnRight.classList.add('data-column-right');
}
