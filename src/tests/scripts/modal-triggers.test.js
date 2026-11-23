import {
  describe, it, expect, beforeEach, vi,
} from 'vitest';
import { decorateModalTriggers, listenForModalTriggers } from '../../scripts/utils/modal-triggers.js';
import { pointButtonAt } from '../../scripts/utils/utils.js';

// the document keeps its listener across tests, so every test shares this one
const open = vi.fn();
listenForModalTriggers(open);

const press = (el, key) => el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

describe('modal triggers', () => {
  beforeEach(() => {
    open.mockClear();
    document.body.innerHTML = `
      <main>
        <p class="button-container"><a href="/en-us/consumer/fragments/trial" class="button modal"><span>Start your trial</span></a></p>
        <p class="button-container"><a href="/en-us/consumer/total-security" class="button">Learn more</a></p>
      </main>`;
  });

  it('turns a fragment link into a focusable button that opens a dialog', () => {
    decorateModalTriggers(document);
    const link = document.querySelector('a.modal');

    expect(link.hasAttribute('href')).toBe(false);
    expect(link.getAttribute('location')).toBe('/en-us/consumer/fragments/trial');
    expect(link.getAttribute('role')).toBe('button');
    expect(link.getAttribute('aria-haspopup')).toBe('dialog');
    expect(link.tabIndex).toBe(0);
    expect(document.querySelector('a:not(.modal)').getAttribute('href')).toBe('/en-us/consumer/total-security');
  });

  it('opens the fragment once from a click, decorated twice', () => {
    decorateModalTriggers(document);
    decorateModalTriggers(document);
    listenForModalTriggers(open);
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    document.querySelector('a.modal span').dispatchEvent(click);

    expect(open).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith('/en-us/consumer/fragments/trial', false);
    expect(click.defaultPrevented).toBe(true);
  });

  it('opens the fragment from a copy made with innerHTML', () => {
    decorateModalTriggers(document);
    const copy = document.createElement('li');
    copy.innerHTML = document.querySelector('main').innerHTML;
    document.body.append(copy);
    copy.querySelector('a.modal').click();

    expect(open).toHaveBeenCalledWith('/en-us/consumer/fragments/trial', false);
  });

  it('opens the fragment from Enter and Space, not other keys', () => {
    decorateModalTriggers(document);
    const link = document.querySelector('a.modal');
    press(link, 'Tab');
    expect(open).not.toHaveBeenCalled();

    press(link, 'Enter');
    press(link, ' ');
    expect(open).toHaveBeenCalledTimes(2);
  });

  it('leaves a click another handler took', () => {
    decorateModalTriggers(document);
    const link = document.querySelector('a.modal');
    link.addEventListener('click', (e) => e.preventDefault());
    link.click();

    expect(open).not.toHaveBeenCalled();
  });

  it('keeps the modal when the link asks for it', () => {
    const link = document.querySelector('a.modal');
    link.dataset.stopAutomaticModalRefresh = 'true';
    decorateModalTriggers(document);
    link.click();

    expect(open).toHaveBeenCalledWith('/en-us/consumer/fragments/trial', true);
  });
});

describe('pointButtonAt', () => {
  beforeEach(() => {
    open.mockClear();
    document.body.innerHTML = `
      <a href="/en-us/consumer/fragments/trial" class="button modal" data-stop-automatic-modal-refresh="true">Try it</a>
      <a href="/en-us/consumer/total-security" class="button">Learn more</a>`;
  });

  it('gives a design-system button the href of a page link', () => {
    const button = document.createElement('bd-button');
    pointButtonAt(button, document.querySelector('a:not(.modal)'));

    expect(button.getAttribute('href')).toBe('/en-us/consumer/total-security');
    expect(button.hasAttribute('location')).toBe(false);
  });

  it('points a design-system button at a fragment link, decorated or not, with no href', () => {
    const link = document.querySelector('a.modal');
    const before = document.createElement('bd-button');
    pointButtonAt(before, link);
    decorateModalTriggers(document);
    const after = document.createElement('bd-button');
    pointButtonAt(after, link);

    [before, after].forEach((button) => {
      expect(button.hasAttribute('href')).toBe(false);
      expect(button.getAttribute('location')).toBe('/en-us/consumer/fragments/trial');
      expect(button.dataset.stopAutomaticModalRefresh).toBe('true');
    });
  });

  it('opens the fragment from a click on the button, not from Enter, which a native button turns into a click', () => {
    const button = document.createElement('bd-button');
    pointButtonAt(button, document.querySelector('a.modal'));
    document.body.append(button);
    press(button, 'Enter');
    expect(open).not.toHaveBeenCalled();

    button.click();
    expect(open).toHaveBeenCalledWith('/en-us/consumer/fragments/trial', true);
  });
});
