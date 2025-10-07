function embedYoutube(url, autoplay) {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? '&muted=1&autoplay=0&enablejsapi=1' : '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const modalContainer = document.createElement('dialog');
  modalContainer.classList.add('modal-container');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalContainer.appendChild(modalContent);

  const closeModal = () => modalContainer.close();
  const close = document.createElement('div');
  close.classList.add('modal-close');
  modalContent.append(close);

  const iframe = document.createElement('iframe');
  iframe.width = 783;
  iframe.height = 440;
  iframe.src = `https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}`;
  iframe.title = 'YouTube video player';
  iframe.frameborder = 0;
  iframe.allow = 'autoplay; fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.loading = 'lazy';
  modalContent.appendChild(iframe);
  close.addEventListener('click', () => {
    iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    closeModal();
  });
  return modalContainer;
  // `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
  //     <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
  // eslint-disable-next-line max-len
  //     allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
  //   </div>`;
}

function decorateLinkedPictures(main) {
  main.querySelectorAll('picture').forEach((picture) => {
    // this condition checks if the picture is part of some content block ( rte )
    // and not a direct element in some DIV block
    // that could have different behaviour for some blocks (ex: columns )
    if (picture.closest('div.block') && picture.parentElement.tagName !== 'DIV') {
      const next = picture.parentNode.nextElementSibling;
      if (next) {
        const a = next.querySelector('a');
        const link = a?.textContent;
        /* Modal video */
        if (a && link.startsWith('https://') && link.includes('fragments')) {
          a.innerHTML = '';
          a.className = 'video-placeholder';
          a.appendChild(picture);
          const overlayPlayButton = document.createElement('span');
          overlayPlayButton.className = 'video-placeholder-play';
          a.appendChild(overlayPlayButton);
          a.addEventListener('click', async (event) => {
            event.preventDefault();
            // eslint-disable-next-line no-use-before-define
          });
          const up = a.parentElement;
          if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
            up.classList.add('modal-video-container');
          }
          return;
        }
        // Basic linked image
        if (a && link.startsWith('https://')) {
          a.innerHTML = '';
          a.className = 'linked-image';
          const pictureParent = picture.parentNode;
          a.append(picture);
          if (pictureParent.children.length === 0) {
            pictureParent.parentNode.removeChild(pictureParent);
          }
          const up = a.parentElement;
          if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
            up.classList.add('linked-image-container');
          }
        }
      }
    }
  });
}

function decorateButtons(element) {
  const wrapButtonText = (a) => ((a.innerHTML.startsWith('<'))
    ? `${a.querySelector('span.icon')?.outerHTML || ''}<span class="button-text">${a.textContent}</span>`
    : `<span class="button-text">${a.textContent}</span>${a.querySelector('span.icon')?.outerHTML || ''}`
  );
  element.querySelectorAll('a').forEach((a) => {
    if (a.closest('.nav-brand') || a.closest('.nav-sections')) {
      return;
    }
    a.title = a.title || a.textContent;
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      const twoup = a.parentElement.parentElement;
      const threeup = a.parentElement.parentElement?.parentElement;

      if (!a.querySelector('img')) {
        // Example: <p><strong><a href="example.com">Text</a></strong></p>
        if (up.childNodes.length === 1 && up.tagName === 'STRONG'
          && twoup.childNodes.length === 1 && twoup.tagName === 'P') {
          a.className = 'button primary';
          twoup.classList.add('button-container');
          up.replaceWith(a);
          a.innerHTML = wrapButtonText(a);
          return;
        }
        if (up.childNodes.length === 1 && up.tagName === 'EM'
            && twoup.childNodes.length === 1 && twoup.tagName === 'STRONG'
            && threeup?.childNodes.length === 1 && threeup?.tagName === 'P') {
          a.className = 'button secondary';
          threeup.classList.add('button-container');
          up.replaceWith(a);
          a.innerHTML = wrapButtonText(a);
          return;
        }
        // Example: <p><a href="example.com">Text</a> (example.com)</p>
        if (up.childNodes.length === 1 && up.tagName === 'P' && a.href.includes('/fragments/')) {
          a.className = 'button modal';
          up.classList.add('button-container');
          return;
        }
        // Example: <p><a href="example.com">Text</a> <em>50% Discount</em></p>
        if (up.childNodes.length === 3 && up.tagName === 'P' && a.nextElementSibling?.tagName === 'EM') {
          a.className = 'button';
          up.classList.add('button-container');
          a.innerHTML = wrapButtonText(a);
          a.dataset.modal = a.nextSibling.textContent.trim().slice(1, -1);
          a.nextSibling.remove();
          return;
        }
        // Example: <p><a href="example.com">? Text</a></p>
        if (up.childNodes.length === 1 && up.tagName === 'P' && up.innerText.startsWith('?')) {
          a.className = 'info-button modal';
          up.classList.add('info-button-container');
          a.textContent = a.textContent.slice(1).trim();
          a.title = a.title.slice(1).trim();
          return;
        }
        // Example: <p><a href="example.com">Text</a></p>
        if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
          a.className = 'button'; // default
          up.classList.add('button-container');
          a.innerHTML = wrapButtonText(a);
        }
      }
    }
  });
}

export default async function decorate(block, options) {
  block.classList.add('global-styles');
  const {
    // eslint-disable-next-line no-unused-vars
    videoUrl,
  } = block.closest('.section').dataset;

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    decorateLinkedPictures(block);
    decorateButtons(block);

    const wrapper = block.querySelector('.video-placeholder');
    block.appendChild(embedYoutube(new URL(videoUrl), true));
    const modalContainer = block.querySelector('dialog');
    wrapper.addEventListener('click', () => {
      modalContainer.showModal();
    });
  }
  const firstButton = block.querySelector('a.button');
  if (firstButton) {
    firstButton.classList.add('blue');
  }

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
