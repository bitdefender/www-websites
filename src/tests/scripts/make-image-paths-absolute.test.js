import { describe, it, expect } from 'vitest';
import { makeImagePathsAbsolute } from '../../scripts/utils/utils.js';

const ORIGIN = 'https://www.bitdefender.com';
const DM = '/adobe/dynamicmedia/deliver/dm-aid--1/logo.webp';

function parse(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
}

describe('makeImagePathsAbsolute', () => {
  it('prefixes img src, srcset and the AEM data-cmp-src', () => {
    const root = parse(`
      <div class="cmp-image" data-cmp-src="${DM}?width={width}&amp;quality=50">
        <img src="${DM}?quality=50" srcset="${DM}?width=320 320w,${DM}?width=640 640w, ${DM}?width=1280 1280w">
      </div>`);

    makeImagePathsAbsolute(root, ORIGIN);

    const img = root.querySelector('img');
    expect(img.getAttribute('src')).toBe(`${ORIGIN}${DM}?quality=50`);
    expect(img.getAttribute('srcset')).toBe(
      `${ORIGIN}${DM}?width=320 320w,${ORIGIN}${DM}?width=640 640w, ${ORIGIN}${DM}?width=1280 1280w`,
    );
    expect(root.querySelector('.cmp-image').getAttribute('data-cmp-src'))
      .toBe(`${ORIGIN}${DM}?width={width}&quality=50`);
  });

  it('prefixes picture source srcset', () => {
    const root = parse(`<picture><source srcset="${DM} 1x"><img src="${DM}"></picture>`);

    makeImagePathsAbsolute(root, ORIGIN);

    expect(root.querySelector('source').getAttribute('srcset')).toBe(`${ORIGIN}${DM} 1x`);
  });

  it('leaves absolute, protocol-relative and data URLs alone', () => {
    const urls = ['https://cdn.example.com/a.png', '//cdn.example.com/b.png', 'data:image/png;base64,AAAA'];
    const root = parse(urls.map((url) => `<img src="${url}">`).join(''));

    makeImagePathsAbsolute(root, ORIGIN);

    expect([...root.querySelectorAll('img')].map((img) => img.getAttribute('src'))).toEqual(urls);
  });

  it('leaves links and scripts alone', () => {
    const root = parse('<a href="/en-us/consumer/">x</a><script src="/etc.clientlibs/a.js"></script>');

    makeImagePathsAbsolute(root, ORIGIN);

    expect(root.querySelector('a').getAttribute('href')).toBe('/en-us/consumer/');
    expect(root.querySelector('script').getAttribute('src')).toBe('/etc.clientlibs/a.js');
  });

  it('does nothing when the origin is empty (www and stage)', () => {
    const root = parse(`<img src="${DM}">`);

    makeImagePathsAbsolute(root, '');

    expect(root.querySelector('img').getAttribute('src')).toBe(DM);
  });

  it('defaults to the public origin off bitdefender.com', () => {
    const root = parse(`<img src="${DM}">`);

    makeImagePathsAbsolute(root);

    expect(root.querySelector('img').getAttribute('src')).toBe(`${ORIGIN}${DM}`);
  });
});
