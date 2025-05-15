import { matchHeights } from '../../scripts/utils/utils.js';

async function renderBlogGrid(block, endpoint, articlesNumber) {
  const blogGrid = block.querySelector('.blog-grid');
  try {
    const response = await fetch(endpoint);
    const rssText = await response.text();

    const data = new window.DOMParser().parseFromString(rssText, 'text/xml');
    const items = data.querySelectorAll('item');
    let currentCount = 0;
    items.forEach((item) => {
      // eslint-disable-next-line no-plusplus
      currentCount++;
      if (currentCount > articlesNumber) return;
      const link = item.querySelector('link').textContent;

      const title = item.querySelector('title').textContent;
      const media = item.querySelector('content');
      const image = media.getAttribute('url');

      // Create a blog card
      const blogCard = document.createElement('a');
      blogCard.setAttribute('href', link);
      blogCard.classList.add('blog-card');

      blogCard.innerHTML = `
          <img src="${image}" alt="${title}">
          <div class="blog-card-content">
              <p>${title}</p>
              <a href="${link}">Find out more</a>
          </div>
      `;

      blogGrid.appendChild(blogCard);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function decorate(block) {
  const { endpoint, articlesNumber } = block.closest('.section').dataset;
  const blogGrid = document.createElement('div');
  block.appendChild(blogGrid);
  blogGrid.classList.add('blog-grid');
  renderBlogGrid(block, endpoint, articlesNumber);
  matchHeights(block, 'p');
}

export { decorate as default };
//# sourceMappingURL=blog-news.js.map
