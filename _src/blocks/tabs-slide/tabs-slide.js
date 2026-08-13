/* eslint-disable */
export default function decorate(block) {
  const parentSection = block.closest('.section');
  const reversedtabs = parentSection.dataset.reversedtabs === 'yes';

  const [headers, contentTab1, contentTab2] = block.querySelectorAll('table');
  const [tab1, iconTab, tab2] = headers.querySelectorAll('td');
  const [iconTab1, iconTab2] = headers.querySelectorAll('img');

  block.classList.add('columns-wrapper');

  block.innerHTML = `
    <div class="spp-slider ${!reversedtabs ? 'without-active' : 'with-active'}">
      
      <div class="tabs">
        <button 
          class="tab active" 
          data-tab="${!reversedtabs ? 'without' : 'with'}"
        >
          ${tab1.textContent}
        </button>

        <span class="icon">
          <img 
            class="icon-${!reversedtabs ? 'without' : 'with'}" 
            src="/_src/icons/subscriber-icons/Lock-Open.svg" 
            alt="${tab1.textContent}"
          >

          <img 
            class="icon-${!reversedtabs ? 'with' : 'without'}" 
            src="/_src/icons/subscriber-icons/Lock-Close.svg" 
            alt="${tab2.textContent}"
          >
        </span>

        <button 
          class="tab" 
          data-tab="${!reversedtabs ? 'with' : 'without'}"
        >
          ${tab2.textContent}
        </button>

        <div class="tab-slider"></div>
      </div>

      <div class="slider-container">
        <div class="slider">

          <div class="content without">
            ${Array.from(contentTab1.querySelectorAll('td'))
      .map(item => `<div class="card">${item.innerHTML}</div>`)
      .join('')}
          </div>

          <div class="content with">
            ${Array.from(contentTab2.querySelectorAll('td'))
      .map(item => `<div class="card">${item.innerHTML}</div>`)
      .join('')}
          </div>

        </div>
      </div>

    </div>
  `;

  const tabs = parentSection.querySelectorAll('.tab');
  const slider = parentSection.querySelector('.slider');
  const sppSlider = parentSection.querySelector('.spp-slider');

  // initial state for reversed
  if (reversedtabs) {
    slider.style.transform = 'translateX(-50%)';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const isWith = tab.dataset.tab === 'with';

      slider.style.transform = isWith
        ? 'translateX(-50%)'
        : 'translateX(0)';

      sppSlider.classList.toggle('with-active', isWith);
      sppSlider.classList.toggle('without-active', !isWith);
    });
  });
}