function decorate(block) {
  const parentBlockStyle = block.closest('.section > div').style;
  const {
    // eslint-disable-next-line no-unused-vars
    backgroundColor,
  } = block.closest('.section').dataset;

  if (backgroundColor) parentBlockStyle.backgroundColor = backgroundColor;

  block.querySelectorAll('table').forEach((table) => {
    const newDiv = document.createElement('div');
    newDiv.classList.add('creator-box');
    const linkToCreator = table.querySelector('tr:nth-child(4) td');
    const creatorLink = linkToCreator ? linkToCreator.textContent.trim() : '';

    // Find the image from the last row
    const lastRow = table.querySelector('tr:last-child');
    const img = lastRow.querySelector('img');
    let backgroundImage = '';

    if (img) {
      backgroundImage = `url(${img.src})`;
    }

    table.querySelectorAll('tr').forEach((tr, rowIndex) => {
      // Skip the last row since we've already processed the image
      if (rowIndex === table.rows.length - 1) return;

      tr.querySelectorAll('td').forEach((td) => {
        const innerDiv = document.createElement('div');
        innerDiv.innerHTML = td.innerHTML;
        newDiv.style.background = `linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, #000 100%), ${backgroundImage}`;
        newDiv.style.backgroundSize = 'cover'; // Cover the whole div
        newDiv.style.backgroundPosition = 'center'; // Center the image
        newDiv.appendChild(innerDiv);
      });
    });

    // Remove the 4th div from creator-box
    const fourthDiv = newDiv.querySelectorAll('div:nth-child(4)');
    if (fourthDiv.length > 0) {
      newDiv.removeChild(fourthDiv[0]);
    }

    // Wrap the newDiv in an anchor element if a link is found
    if (creatorLink) {
      const anchor = document.createElement('a');
      anchor.href = creatorLink;
      anchor.target = '_blank';
      anchor.appendChild(newDiv);
      table.parentNode.replaceChild(anchor, table);
    } else {
      table.parentNode.removeChild(table);
    }
  });
}

export { decorate as default };
//# sourceMappingURL=creators-block.js.map
