import {
  beforeEach, describe, expect, it,
} from 'vitest';
import decorate from '../../../blocks/dropdown-box/dropdown-box.js';

function createSection({ staticFeatures = true, type = 'slider-no-load-bar' } = {}) {
  const section = document.createElement('div');
  section.className = `section dropdown-box-container${staticFeatures ? ' no-dropdown-logic' : ''}`;
  section.dataset.type = type;
  document.body.append(section);
  return section;
}

function addFeature(section, title, content, closed = true) {
  const wrapper = document.createElement('div');
  wrapper.className = 'dropdown-box-wrapper';
  wrapper.innerHTML = `<div class="dropdown-box block new${closed ? ' closed' : ''}">
    <div><div>${title}</div></div>
    ${content === undefined ? '' : `<div><div>${content}</div></div>`}
  </div>`;
  section.append(wrapper);
  return wrapper.firstElementChild;
}

const overview = '<p><picture><img src="/overview.png?width=750" alt=""></picture></p>'
  + '<p>Shared overview of scam protection.</p><h6>Windows only</h6>';

describe('dropdown-box static feature titles', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('preserves authored states and content when static titles are clicked', () => {
    const section = createSection();
    const first = addFeature(section, 'Scamio Pro', overview, false);
    const duplicate = addFeature(section, 'Scam Radar', overview
      .replace('width=750', 'width=2000')
      .replace('<h6>Windows only</h6>', '<p>Windows only</p>'));
    const textDuplicate = addFeature(
      section,
      'Chat Protection',
      '<p>Shared overview of scam protection.</p><p>Windows only</p>',
    );
    const distinct = addFeature(section, 'Calendar Invites', '<p>Distinct calendar description.</p>');

    [first, duplicate, textDuplicate, distinct].forEach(decorate);

    expect(section.querySelectorAll('.dropdown-box img')).toHaveLength(2);
    expect(duplicate.children).toHaveLength(2);
    expect(textDuplicate.children).toHaveLength(2);
    expect(distinct.textContent).toContain('Distinct calendar description.');
    expect(first.classList.contains('closed')).toBe(false);
    expect(duplicate.classList.contains('closed')).toBe(true);
    expect(textDuplicate.classList.contains('closed')).toBe(true);
    expect(distinct.classList.contains('closed')).toBe(true);
    expect(section.querySelectorAll('.slider-box')).toHaveLength(4);
    expect(section.querySelectorAll('.slider-box .description img')).toHaveLength(2);
    expect(section.querySelector('.slider-box:last-child .description').textContent)
      .toContain('Distinct calendar description.');

    [first, duplicate, textDuplicate, distinct].forEach((block) => {
      block.firstElementChild.click();
      expect(block.classList.contains('inactive')).toBe(false);
    });
    expect(first.classList.contains('closed')).toBe(false);
    expect(duplicate.classList.contains('closed')).toBe(true);
    expect(textDuplicate.classList.contains('closed')).toBe(true);
    expect(distinct.classList.contains('closed')).toBe(true);
  });

  it('retains different descriptions that use the same image', () => {
    const section = createSection();
    const first = addFeature(section, 'Scamio Pro', overview, false);
    const distinct = addFeature(section, 'Another feature', overview
      .replace('Shared overview of scam protection.', 'A different feature description.'));

    [first, distinct].forEach(decorate);

    expect(distinct.children).toHaveLength(2);
    expect(distinct.textContent).toContain('A different feature description.');
  });

  it('disables toggling even when old metadata omits no-dropdown-logic', () => {
    const section = createSection({ staticFeatures: false });
    const block = addFeature(section, 'Scam Radar', overview);
    decorate(block);

    block.firstElementChild.click();
    expect(section.classList.contains('no-dropdown-logic')).toBe(true);
    expect(block.classList.contains('inactive')).toBe(false);
    expect(block.classList.contains('closed')).toBe(true);
    expect(block.children).toHaveLength(2);
  });

  it('keeps normal accordion toggling outside the static slider variant', () => {
    const section = createSection({ staticFeatures: false, type: '' });
    const block = addFeature(section, 'Scam Radar', overview);
    decorate(block);

    block.firstElementChild.click();
    expect(block.classList.contains('inactive')).toBe(true);
    expect(block.children).toHaveLength(2);
    block.firstElementChild.click();
    expect(block.classList.contains('inactive')).toBe(false);
  });

  it('does not change the rotating slider variant', () => {
    const section = createSection({ type: 'slider' });
    const block = addFeature(section, 'Scam Radar', overview);
    decorate(block);

    expect(section.querySelector('.loading-bar')).not.toBeNull();
    expect(block.children).toHaveLength(2);
    block.firstElementChild.click();
    expect(block.classList.contains('inactive')).toBe(true);
  });

  it('handles omitted content rows without throwing', () => {
    const section = createSection();
    const block = addFeature(section, 'Title only');

    expect(() => decorate(block)).not.toThrow();
    expect(section.querySelector('.slider-box')).toBeNull();
  });
});
