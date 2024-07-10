import { createTag } from '../../scripts/utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

function createQuote(item) {
  const paragraphs = Array.from(item.querySelectorAll('p'));
  const quote = paragraphs.find((paragraph) => {
    const strongOrEm = paragraph.querySelector('strong, em');
    return !strongOrEm && paragraph.textContent.trim() !== '';
  });

  const author = item.querySelector('p > strong');
  const stars = item.querySelector('p > em');
  if (!quote) {
    return null;
  }

  // Get the text content of the paragraph
  const paragraphText = stars.textContent;

  // Initialize a variable to count the asterisks
  let asteriskCount = 0;

  // Loop through the text and count asterisks
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < paragraphText.length; i++) {
    if (paragraphText[i] === '*') {
      asteriskCount += 1;
    }
  }
  const starsContainer = createTag('div', { class: 'quote-stars-container' });
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < asteriskCount; i++) {
    const star = createTag('span', { class: 'star' });
    starsContainer.append(star);
  }

  return createTag(
    'div',
    {
      class: 'quote-container',

    },
    `<div class="quote-img">
        <span class="icon icon-dark-blue-quote"/>
    </div>
    <div class="quote-content">
        <p class="stars">${starsContainer?.innerHTML}</p>
        <p class="description">${quote?.innerHTML}</p>
        <p class="author">${author?.innerHTML}</p>
    </div>`,
  );
}
export default async function decorate(block) {
  const quoteWrap = createTag('div', { class: 'quote-wrap' });
  [...block.children].forEach((item) => {
    const quote = createQuote(item);
    if (quote) {
      quoteWrap.append(quote);
    }
  });
  block.replaceChildren(quoteWrap);

  decorateIcons(block);
}
