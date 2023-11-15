export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('img-container');
          imgContainer.append(picWrapper.children[0]);
          picWrapper.append(imgContainer);
          // picture is only content in column
          picWrapper.classList.add('image-columns-img-col');
        }
      } else {
        col.classList.add('image-columns-txt-col');
      }
    });
  });
}
