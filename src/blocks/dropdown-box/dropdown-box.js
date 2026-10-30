/*
  Information:
  - the tab is open by default
  - [add-on] - will be treated as green tag

  Parameters:
  - (closed) : for tab to be closed by default
*/
export default function decorate(block) {
  const parentSelector = block.closest('.section');
  const { type, topBackgroundColor, topTextColor } = parentSelector.dataset;

  // search for [] to replace with span greeenTag class
  const getFirstDivs = block.querySelectorAll('.dropdown-box-container .block > div > div:nth-child(1)');
  getFirstDivs.forEach((item) => {
    item.innerHTML = item.innerHTML.replace('[', '<span class="greenTag">');
    item.innerHTML = item.innerHTML.replace(']', '</span>');
  });

  // make slideUp slideDown functionality
  const getFirstTabs = block.querySelectorAll('.dropdown-box-container .block > div:first-child');
  getFirstTabs.forEach((tab) => {
    tab.parentNode.classList.remove('inactive');
    tab.addEventListener('click', () => {
      tab.parentNode.classList.toggle('inactive');
    });
  });

  if (block.children.length >= 2) {
    const childrenNr = block.children[1].children.length;
    block.classList.add(`has${childrenNr}divs`);

    if (topBackgroundColor) {
      block.querySelector('div:nth-child(1) > div > div').style.backgroundColor = topBackgroundColor;
    }

    if (topTextColor) {
      block.querySelector('div:nth-child(1) > div').style.color = topTextColor;
    }
  }

  // if it's slider
  if (type === 'slider') {
    block.closest('.dropdown-box-container').classList.add('container', 'dropdown-slider', 'has-load-bar');
    const sliderBox = document.createElement('div');
    sliderBox.className = 'slider-box';

    const infoTextEl = block.children[0].children[0];
    const infoTextEl2 = block.children[1].children[0];
    sliderBox.innerHTML = `
          <div class="row">
            <div class="col-12 col-md-5 title">
              <div class="loading-bar"></div>
              ${infoTextEl.innerHTML}
            </div>
            <div class="col-12 col-md-7 description">${infoTextEl2.innerHTML}</div>
          </div>
      `;

    block.closest('.dropdown-box-container').appendChild(sliderBox);
  }

  // if it's slider
  if (type === 'slider-no-load-bar') {
    block.closest('.dropdown-box-container').classList.add('container', 'dropdown-slider', 'no-load-bar');
    const sliderBox = document.createElement('div');
    sliderBox.className = 'slider-box';

    const infoTextEl = block.children[0].children[0];
    const infoTextEl2 = block.children[1].children[0];
    sliderBox.innerHTML = `
          <div class="row">
            <div class="col-12 col-md-5 title">
              ${infoTextEl.innerHTML}
            </div>
            <div class="col-12 col-md-7 description">${infoTextEl2.innerHTML}</div>
          </div>
      `;

    block.closest('.dropdown-box-container').appendChild(sliderBox);
  }
}
