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
  const [title, subtitle, source, ...reviews] = block.children;

  title.classList.add('title-class');
  subtitle.classList.add('subtitle-class');
  source.classList.add('source-class');

  // Create a new div for reviews
  const reviewsContainer = document.createElement('div');
  reviewsContainer.classList.add('reviews-container');

  // Iterate over each review element
  reviews.forEach((review, index) => {
    review.classList.add('review');

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 448 512');
    svg.setAttribute('width', '32px'); // Set width to 32 pixels
    svg.setAttribute('height', '32px'); // Set height to 32 pixels
    svg.style.fill = '#006EFF'; // Set the SVG color to blue
    svg.innerHTML = '<!--!Font Awesome Pro 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M0 216C0 149.7 53.7 96 120 96h8 32v64H128h-8c-30.9 0-56 25.1-56 56v8H192V416H0V320 224v-8zm256 0c0-66.3 53.7-120 120-120h8 32v64H384h-8c-30.9 0-56 25.1-56 56v8H448V416H256V320 224v-8z"/>';

    // Create a container for the SVG and review content
    const reviewContainer = document.createElement('div');
    reviewContainer.classList.add('review-container');
    if (index === 0) {
      reviewContainer.classList.add('show');
    } else {
      reviewContainer.classList.add('hide');
    }

    // Append SVG and review to the review container
    reviewContainer.appendChild(svg);
    reviewContainer.appendChild(review);

    // Append review container to the reviews container
    reviewsContainer.appendChild(reviewContainer);
  });

  // Append the reviews container to the block
  block.appendChild(reviewsContainer);

  // Create navigation buttons for the slider
  const prevButton = document.createElement('button');
  // Set SVG icon for previous button with color #006EFF
  prevButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="#006EFF" width="24" height="24"><path d="M18.7 256l22.6 22.6 160 160L224 461.3 269.3 416l-22.6-22.6L109.3 256 246.6 118.6 269.3 96 224 50.7 201.4 73.4l-160 160L18.7 256z"/></svg>';
  prevButton.classList.add('prev-button');
  prevButton.addEventListener('click', () => {
    // eslint-disable-next-line no-use-before-define
    navigateSlider(-1);
  });

  const nextButton = document.createElement('button');
  // Set SVG icon for next button with color #006EFF
  nextButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="#006EFF" width="24" height="24">
  <path d="M301.3 256l-22.6 22.6-160 160L96 461.3 50.7 416l22.6-22.6L210.7 256 73.4 118.6 50.7 96 96 50.7l22.6 22.6 160 160L301.3 256z"></path>
</svg>`;
  nextButton.classList.add('next-button');
  nextButton.addEventListener('click', () => {
    // eslint-disable-next-line no-use-before-define
    navigateSlider(1);
  });

  // Create navigation container
  const navigationContainer = document.createElement('div');
  navigationContainer.classList.add('navigation-container');
  block.appendChild(navigationContainer);
  navigationContainer.appendChild(source);
  // create buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');
  navigationContainer.appendChild(buttonsContainer);
  // Append navigation buttons to the block
  buttonsContainer.appendChild(prevButton);
  buttonsContainer.appendChild(nextButton);

  // Slider navigation function
  let currentIndex = 0;
  const reviewsCount = reviews.length;

  function navigateSlider(direction) {
    const currentReview = block.querySelector('.show');
    const nextIndex = (currentIndex + direction + reviewsCount) % reviewsCount;
    const nextReview = reviewsContainer.children[nextIndex];

    currentReview.classList.remove('show');
    currentReview.classList.add('hide');

    nextReview.classList.remove('hide');
    nextReview.classList.add('show');

    currentIndex = nextIndex;
  }
  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
