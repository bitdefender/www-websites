// eslint-disable-next-line no-unused-vars
function decorate(block) {
  const tables = block.querySelectorAll('.bitdef-vs-brands-wrapper table');

  tables.forEach((table) => {
    const parentDiv = table.closest('div');

    parentDiv.classList.add('table-container');

    table.querySelectorAll('tr').forEach((row, rowIndex) => {
      row.classList.add(`row-${rowIndex}`);

      if (rowIndex >= 3 && rowIndex <= 5) {
        if (rowIndex === 3) row.classList.add('blue-background');
        else row.classList.add('grey-background');
        row.querySelectorAll('td').forEach((td) => {
          td.classList.add('same-line');
        });
      }

      row.querySelectorAll('td').forEach((cell, cellIndex) => {
        cell.classList.add(`column-${cellIndex}`);
      });
    });
  });
  // Select the first div within the .bitdef-vs-brands container
  const firstDiv = block.querySelector('.bitdef-vs-brands > div');

  // Add class 'heading-container' to the first div
  firstDiv.classList.add('heading-container');

  // Create a new container div
  const newContainerDiv = document.createElement('div');
  newContainerDiv.classList.add('new-container');

  // Move the second and third divs into the new container
  while (firstDiv.nextSibling) {
    newContainerDiv.appendChild(firstDiv.nextSibling);
  }

  // Insert the new container after the first div
  const bitdefContainer = block;
  bitdefContainer.insertBefore(newContainerDiv, firstDiv.nextSibling);

  // Animation
  const section = block;

  const threshold = {
    threshold: 0.5, // Trigger animation when 50% of the section is visible
  };

  // eslint-disable-next-line no-unused-vars, no-shadow
  const observer = new IntersectionObserver(((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.animationTriggered) {
        // Add animation class to each row based on its index
        // eslint-disable-next-line no-shadow
        const tables = entry.target.querySelectorAll('table');
        tables.forEach((table) => {
          const rows = table.querySelectorAll('.same-line');
          rows.forEach((row, index) => {
            row.classList.add(`animate-row${index + 1}`);
          });
        });
        // Set dataset attribute to indicate animation has been triggered
        entry.target.dataset.animationTriggered = true;
      }
    });
  }), threshold);

  observer.observe(section);
}

export { decorate as default };
//# sourceMappingURL=bitdef-vs-brands.js.map
