export default function decorate(block) {
  block.classList.add('global-styles');
  // search for [] to replace with span greeenTag class
  const getFirstDivs = block.querySelectorAll('.dropdownbox-compare-container .block > div > div:nth-child(1)');
  getFirstDivs.forEach((item) => {
    item.innerHTML = item.innerHTML.replace('[', '<span class="green-tag">');
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
