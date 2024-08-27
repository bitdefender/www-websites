export default function decorate(block) {
  const parentSelector = block.closest('.section');
  const { type } = parentSelector.dataset;

  block.closest('.dropdownbox-compare-wrapper').classList.add('default-content-wrapper');

  // search for [] to replace with span greeenTag class
  const getFirstDivs = block.querySelectorAll('.dropdownbox-compare-container .block > div > div:nth-child(1)');
  getFirstDivs.forEach((item) => {
    item.innerHTML = item.innerHTML.replace('[', '<span class="greenTag">');
    item.innerHTML = item.innerHTML.replace(']', '</span>');
  });

  // make slideUp slideDown functionality
  const getFirstTabs = block.querySelectorAll('.dropdownbox-compare-container .block > div:first-child');
  getFirstTabs.forEach((tab) => {
    tab.parentNode.classList.remove('closed');
    tab.addEventListener('click', () => {
      tab.parentNode.classList.toggle('closed');
    });
  });

}
