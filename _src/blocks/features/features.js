import { matchHeights } from '../../scripts/utils/utils.js';

function expandItem(content) {
  content.style.height = `${content.scrollHeight}px`;
  const transitionEndCallback = () => {
    content.removeEventListener('transitionend', transitionEndCallback);
    content.style.height = 'auto';
  };
  content.addEventListener('transitionend', transitionEndCallback);
  content.classList.add('expanded');
}

function collapseItem(content) {
  content.style.height = `${content.scrollHeight}px`;
  requestAnimationFrame(() => {
    content.classList.remove('expanded');
    content.style.height = 0;
  });
}

function eventListener(ul) {
  return (event) => {
    let target = null;

    // find ancestor a tag
    if (event.target.tagName !== 'A') {
      target = event.target.closest('a');
    } else {
      target = event.target;
    }

    // if the clicked node is not open then open it
    if (!target.classList.contains('is-open')) {
      target.classList.add('is-open');

      // if the clicked node has children then toggle the expanded class
      if (target.parentNode.children.length > 1) {
        target.parentNode.querySelectorAll('.features-tabs-content').forEach((content) => {
          expandItem(content);
        });
      }

      // hid the other tabs
      ul.querySelectorAll('li').forEach((collapsedLi) => {
        if (collapsedLi !== target.parentNode) {
          collapsedLi.children[0].classList.remove('is-open');
          collapsedLi.querySelectorAll('.features-tabs-content').forEach((content) => {
            collapseItem(content);
          });
        }
      });
    } else {
      target.classList.remove('is-open');
      // if the clicked node has children then toggle the expanded class
      if (target.parentNode.children.length > 1) {
        target.parentNode.querySelectorAll('.features-tabs-content').forEach((content) => {
          collapseItem(content);
        });
      }
    }
  };
}

function extractFeatures(col) {
  const ul = document.createElement('ul');
  ul.classList.add('features-tabs');

  // select all h4 tags as feature titles
  col.querySelectorAll('h4').forEach((h4) => {
    const li = document.createElement('li');
    ul.appendChild(li);

    const a = document.createElement('a');
    a.setAttribute('href', '#');

    // register click event on a tag

    a.addEventListener('click', (event) => {
      event.preventDefault();
      eventListener(ul)(event);
    });

    h4.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        a.appendChild(document.createTextNode(node.textContent));
      } else {
        a.appendChild(node);
      }
    });

    a.classList.add('features-tabs-title');

    li.appendChild(a);

    // all descendants of a that have class tag
    a.querySelectorAll('.tag').forEach((tag) => {
      li.appendChild(tag);
    });

    const content = document.createElement('div');
    content.classList.add('features-tabs-content');
    li.appendChild(content);

    // every oaragraph until next h4
    let nextElement = h4.nextElementSibling;
    while (nextElement && nextElement.tagName !== 'H4') {
      content.appendChild(nextElement);
      nextElement = h4.nextElementSibling;
    }

    ul.appendChild(li);

    h4.remove();
  });

  return ul;
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`features-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('features-img-col');
        }
      }

      // setup tabs
      col.appendChild(extractFeatures(col));
    });
  });

  const featuresList = block.querySelectorAll('ul');
  if (featuresList) {
    featuresList.forEach((list) => {
      const featureText = list.previousElementSibling;
      featureText.classList.add('feature-text');
    });
  }
  matchHeights(block, '.feature-text');
}
