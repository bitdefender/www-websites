export default function decorate(block, options) {
  block.classList.add('global-styles');
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  }

  const parentSelector = block.closest('.section');
  // eslint-disable-next-line no-unused-vars
  const metaData = parentSelector.dataset;
  const [title, subtitle, tabsTitle, ...sections] = block.children;

  title.classList.add('title-class');
  subtitle.classList.add('subtitle-class');
  // Add class 'tabs-container' to the first div
  tabsTitle.classList.add('tabs-container');

  // Get the container for the buttons
  const container = block.querySelector('.tabs-container');

  // Check if the container exists
  if (container) {
    const divs = container.querySelectorAll('div');

    // Loop through each div to create buttons
    divs.forEach((div, index) => {
      const button = document.createElement('button');
      if (index === 0) button.classList.add('selected');
      button.innerHTML = div.innerHTML; // Use innerHTML instead of textContent
      button.addEventListener('click', () => {
        // Remove 'selected' class from all buttons
        const buttons = block.querySelectorAll('.tabs-container button');
        buttons.forEach((btn) => btn.classList.remove('selected'));

        // Add 'selected' class to the clicked button
        button.classList.add('selected');

        // Hide all card-container elements
        const cardContainers = block.querySelectorAll('.card-container');
        cardContainers.forEach((card) => card.classList.add('hide'));

        // Show the corresponding card-container element based on the index
        sections[index].classList.remove('hide');
      });

      div.parentNode.replaceChild(button, div);
    });
  } else {
    // eslint-disable-next-line no-console
    console.error('Container not found');
  }

  // click on the next element every 5 seconds
  // setInterval(() => {
  //   const buttons = block.querySelectorAll('.tabs-container button');
  //   const selectedButton = block.querySelector('.tabs-container button.selected');
  //   const buttonIndex = Array.from(buttons).indexOf(selectedButton);
  //   const nextIndex = (buttonIndex + 1) % buttons.length;
  //   buttons[nextIndex].click();
  // }, 6000);

  // Add classes to each card-container and hide all but the first one
  sections.forEach((element, index) => {
    element.classList.add('card-container');
    if (index === 0) {
      element.classList.add('show');
    }
    if (index !== 0) {
      element.classList.add('hide');
    }

    // Add classes to children divs
    const photoDiv = element.querySelector('div:nth-child(1)');
    const textDiv = element.querySelector('div:nth-child(2)');
    photoDiv.classList.add('left');
    textDiv.classList.add('right');
  });
  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
