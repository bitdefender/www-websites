export default function decorate(block) {
  const parentSection = block.closest('.section');
  const [headers, contentTab1, contentTab2] = block.querySelectorAll('table');
  const [tab1, iconTab, tab2] = headers.querySelectorAll('td');
  const [iconTab1, iconTab2] = headers.querySelectorAll('img');
  block.classList.add('columns-wrapper');

  block.innerHTML = `<div class="spp-slider with-active">
      <div class="tabs">
        <button class="tab active" data-tab="with">${tab1.textContent}</button>
        <span class="icon">
          <img class="icon-with" src="${iconTab1.getAttribute('src')}" alt="${tab1.textContent}">
          <img class="icon-without" src="${iconTab2.getAttribute('src')}" alt="${tab2.textContent}">
        </span>
        <button class="tab" data-tab="without">${tab2.textContent}</button>
        <div class="tab-slider"></div>
      </div>

      <div class="slider-container">
        <div class="slider">
          <div class="content with">
            ${Array.from(contentTab1.querySelectorAll('td'))
              .map(item => `<div class="card">${item.innerHTML}</div>`)
              .join('')}
          </div>

          <div class="content without">
            ${Array.from(contentTab2.querySelectorAll('td'))
              .map(item => `<div class="card">${item.innerHTML}</div>`)
              .join('')}
          </div>
        </div>
      </div>
  </div>`;

  const tabs = parentSection.querySelectorAll('.tab');
  const slider = parentSection.querySelector('.slider');
  const sppSlider = parentSection.querySelector('.spp-slider');

  tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          if (tab.getAttribute('data-tab') === 'with') {
              slider.style.transform = 'translateX(0)';
              sppSlider.classList.add('with-active');
              sppSlider.classList.remove('without-active');
          } else {
              slider.style.transform = 'translateX(-50%)';
              sppSlider.classList.add('without-active');
              sppSlider.classList.remove('with-active');
          }
      });
  });
}
