export default function decorate(block, options) {
  block.classList.add('global-styles');
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  }
  const [
    title,
    subtitle,
    button,
    colTitle1,
    colText1,
    colTitle2,
    colText2,
    colTitle3,
    colText3,
  ] = block.children;

  title.classList.add('title-class');
  subtitle.classList.add('subtitle-class');
  const columnsContainer = document.createElement('div');
  columnsContainer.classList.add('columns-container');

  const column1 = document.createElement('div');
  column1.appendChild(colTitle1);
  column1.appendChild(colText1);
  columnsContainer.appendChild(column1);
  column1.classList.add('col');

  const column2 = document.createElement('div');
  column2.appendChild(colTitle2);
  column2.appendChild(colText2);
  columnsContainer.appendChild(column2);
  column2.classList.add('col');

  const column3 = document.createElement('div');
  column3.appendChild(colTitle3);
  column3.appendChild(colText3);
  columnsContainer.appendChild(column3);
  column3.classList.add('col');
  block.appendChild(columnsContainer);
  button.classList.add('button-container');
  block.appendChild(button);
  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
