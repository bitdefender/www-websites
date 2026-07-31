import { getDsnBase } from '../../scripts/utils/utils.js';

export default async function decorate(block, options) {
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  }

  block.classList.add('bd-tabs-component');

  const base = getDsnBase();
  await Promise.all([
    import(`${base}heading`),
    import(`${base}paragraph`),
  ]);

  const parentSelector = block.closest('.section');
  // eslint-disable-next-line no-unused-vars
  const metaData = parentSelector.dataset;
  const [title, subtitle, tabsTitle, ...sections] = block.children;

  const bdTitle = document.createElement('bd-h');
  bdTitle.setAttribute('as', 'h2');
  bdTitle.classList.add('bd-tabs-title');
  bdTitle.textContent = title.textContent.trim();
  title.replaceWith(bdTitle);

  const bdSubtitle = document.createElement('bd-p');
  bdSubtitle.setAttribute('kind', 'regular');
  bdSubtitle.classList.add('bd-tabs-subtitle');
  bdSubtitle.textContent = subtitle.textContent.trim();
  subtitle.replaceWith(bdSubtitle);

  tabsTitle.classList.add('bd-tabs-container');

  const container = block.querySelector('.bd-tabs-container');

  if (container) {
    const divs = container.querySelectorAll('div');

    divs.forEach((div, index) => {
      const button = document.createElement('button');
      button.classList.add('bd-tab-button');
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.setAttribute('aria-controls', `tab-content-${index}`);
      button.setAttribute('id', `tab-${index}`);
      if (index === 0) button.classList.add('bd-selected');
      button.innerHTML = div.innerHTML;
      button.addEventListener('click', () => {
        block.querySelectorAll('.bd-tabs-container button').forEach((btn) => {
          btn.classList.remove('bd-selected');
          btn.setAttribute('aria-selected', 'false');
        });
        button.classList.add('bd-selected');
        button.setAttribute('aria-selected', 'true');

        block.querySelectorAll('.bd-card-container').forEach((card) => { card.style.display = 'none'; });
        sections[index].style.display = '';
      });

      div.parentNode.replaceChild(button, div);
    });
  } else {
    // eslint-disable-next-line no-console
    console.error('Container not found');
  }

  sections.forEach((element, index) => {
    element.classList.add('bd-card-container');
    element.setAttribute('id', `tab-content-${index}`);
    element.setAttribute('role', 'tabpanel');
    element.setAttribute('aria-labelledby', `tab-${index}`);
    if (index !== 0) element.style.display = 'none';

    const photoDiv = element.querySelector('div:nth-child(1)');
    const textDiv = element.querySelector('div:nth-child(2)');
    photoDiv.classList.add('bd-left');
    textDiv.classList.add('bd-right');

    const heading = textDiv.querySelector('h2, h3, h4');
    if (heading) heading.id = `tab-content-heading-${index}`;
  });

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true,
  });
}
