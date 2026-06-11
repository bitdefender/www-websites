import { matchHeights } from '../../scripts/utils/utils.js';

function getCardClass(sizeClass) {
  switch (sizeClass) {
    case '<size-1-card>':
      return 'size-small';
    case '<size-2-card>':
      return 'size-medium';
    case '<size-3-card>':
      return 'size-medium-large';
    case '<size-4-card>':
      return 'size-large';
    default:
      return '';
  }
}

export default async function decorate(block) {
  const section = block.closest('.section');
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('grid-container');
  const grid = document.createElement('div');
  grid.classList.add('grid');

  const table = block.querySelector('table');
  const tableColumns = table.querySelectorAll('tr');

  let gridTemplate = '';
  let hasBigCard;
  tableColumns.forEach((column) => {
    hasBigCard = false;
    const gridColumn = document.createElement('div');
    gridColumn.classList.add('grid-column');
    column.querySelectorAll('td').forEach((element) => {
      const dimensionEL = element.querySelector('p');
      const sizeClass = getCardClass(dimensionEL.innerText);
      if (sizeClass === 'size-large') hasBigCard = true;
      dimensionEL.remove();
      const flipArray = element.innerHTML.split('<hr>');
      gridColumn.innerHTML += `<div class= "card ${sizeClass}"> 
          <div class="card-inner">
            <div class="front">${flipArray[0] ?? element.innerHTML}</div>
            <div class="back">${flipArray[1] ?? element.innerHTML}</div>
          </div>`;
    });
    gridTemplate += hasBigCard ? '2fr ' : '1fr ';

    grid.appendChild(gridColumn);
  });

  gridContainer.style.setProperty('--template-columns', gridTemplate);

  table.remove();
  gridContainer.appendChild(grid);
  const overlayGrid = document.createElement('div');
  overlayGrid.classList.add('overlay');
  gridContainer.appendChild(overlayGrid);

  block.appendChild(gridContainer);

  block.querySelectorAll('div:not(.overlay) .card-inner').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  matchHeights(block, '.size-medium .front p:last-of-type');

  if (section.classList.contains('hover-mask')) {
    const cardsContainer = block.querySelector('.grid');
    const overlay = block.querySelector('.overlay');
    // Clear overlay
    overlay.innerHTML = '';
    // Clone entire grid container content into overlay
    const clonedGrid = cardsContainer.cloneNode(true);
    // optional class for overlay styling
    overlay.appendChild(clonedGrid);
    // Collect all real cards and overlay cards for size sync
    const allRealCards = Array.from(cardsContainer.querySelectorAll('.card-inner'));
    const overlayCards = Array.from(clonedGrid.querySelectorAll('.card-inner'));
    // ResizeObserver to keep overlay cards aligned
    const resizeObserver = new ResizeObserver(() => {
      allRealCards.forEach((card, index) => {
        const overlayCard = overlayCards[index];
        if (!overlayCard) return;
        const rect = card.getBoundingClientRect();
        // Only copy width and height, keep layout structure
        overlayCard.style.width = `${rect.width}px`;
        overlayCard.style.height = `${rect.height}px`;
      });
    });
    allRealCards.forEach((card) => resizeObserver.observe(card));
    // Pointer movement to apply glow/gradient effect
    document.addEventListener('pointermove', (e) => {
      const rect = cardsContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      overlay.style.setProperty('--x', `${x}px`);
      overlay.style.setProperty('--y', `${y}px`);
      overlay.style.setProperty('--opacity', 1);
    });
  }
}
