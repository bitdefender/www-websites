import {
  describe, it, expect, beforeEach,
} from 'vitest';
import { labelWithPlan } from '../../scripts/utils/utils.js';

describe('labelWithPlan', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="card">
        <h4>Bitdefender<br>Total Security</h4>
        <p class="tag"><span class="icon" aria-hidden="true">x</span><svg><title>user</title></svg>Family</p>
        <p class="empty"> </p>
        <div class="switcher"><input type="radio" id="yearly"><label for="yearly">Yearly</label></div>
        <a href="#buylink" class="button">Buy Now</a>
      </div>`;
  });

  it('names a CTA with its own text first, then the plan', () => {
    const cta = document.querySelector('a');
    labelWithPlan(cta, [document.querySelector('h4'), document.querySelector('.tag')]);

    expect(cta.getAttribute('aria-label')).toBe('Buy Now Bitdefender Total Security Family');
    expect(cta.textContent).toBe('Buy Now');
  });

  it('separates adjacent tags', () => {
    const cta = document.querySelector('a');
    const tags = document.createElement('div');
    tags.innerHTML = '<div class="blueTag">Individual</div><div class="blueTag">Standard</div>';
    labelWithPlan(cta, [tags]);

    expect(cta.getAttribute('aria-label')).toBe('Buy Now Individual Standard');
  });

  it('names a plan picker without its own text', () => {
    const switcher = document.querySelector('.switcher');
    labelWithPlan(switcher, [document.querySelector('h4')], { withOwnText: false });

    expect(switcher.getAttribute('aria-label')).toBe('Bitdefender Total Security');
  });

  it('skips missing, empty, repeated and enclosing parts', () => {
    const cta = document.querySelector('a');
    const title = document.querySelector('h4');
    labelWithPlan(cta, [null, undefined, document.querySelector('.empty'), title, title, document.querySelector('.card')]);

    expect(cta.getAttribute('aria-label')).toBe('Buy Now Bitdefender Total Security');
  });

  it('skips parts hidden from readers', () => {
    const cta = document.querySelector('a');
    const spacer = document.createElement('p');
    spacer.setAttribute('aria-hidden', 'true');
    spacer.innerHTML = '<span class="tag">Invisible</span>';
    const hidden = document.createElement('p');
    hidden.hidden = true;
    hidden.textContent = 'Hidden';
    document.querySelector('.card').append(spacer, hidden);
    labelWithPlan(cta, [document.querySelector('h4'), spacer.firstElementChild, hidden]);

    expect(cta.getAttribute('aria-label')).toBe('Buy Now Bitdefender Total Security');
  });

  it('skips parts the CTA already says', () => {
    const cta = document.querySelector('a');
    cta.textContent = 'Buy Bitdefender Total Security';
    labelWithPlan(cta, [document.querySelector('h4'), document.querySelector('.tag')]);

    expect(cta.getAttribute('aria-label')).toBe('Buy Bitdefender Total Security Family');
  });

  it('names a design-system button through its label attribute', () => {
    const button = document.createElement('bd-button-link');
    button.textContent = 'Try It Now';
    labelWithPlan(button, [document.querySelector('h4')], { attribute: 'label' });

    expect(button.getAttribute('label')).toBe('Try It Now Bitdefender Total Security');
    expect(button.hasAttribute('aria-label')).toBe(false);
  });

  it('leaves the CTA alone when nothing names the plan', () => {
    const cta = document.querySelector('a');
    labelWithPlan(cta, [null, document.querySelector('.empty')]);

    expect(cta.hasAttribute('aria-label')).toBe(false);
  });
});
