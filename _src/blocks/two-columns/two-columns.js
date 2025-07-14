export default function decorate(block) {
  const container = block.firstElementChild;
  container.classList.add('columns-container');

  const cols = [...container.children];

  cols.forEach((col, index) => {
    col.classList.add('column', `column-${index + 1}`);
  });

  const pictures = container.querySelectorAll('picture');

  pictures.forEach((picture) => {
    const columnParent = picture.closest('.column');
    if (columnParent) {
      columnParent.classList.add('has-picture');
    }
  });
}
