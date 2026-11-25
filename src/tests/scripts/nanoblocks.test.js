/**
 * renderNanoBlocks() finds a nanoblock by its placeholder text, or by the
 * data-edge-nanoblock attribute of the element locale-router rendered it into.
 */
import {
  describe, expect, it, vi,
} from 'vitest';
import { createNanoBlock, getNanoBlockText, renderNanoBlocks } from '../../scripts/utils/utils.js';

const rendered = [];
createNanoBlock('record', (label) => {
  rendered.push(label);
  const element = document.createElement('div');
  element.textContent = `rendered ${label}`;
  return element;
});

function section(html) {
  document.body.innerHTML = `<main><div class="section" data-record2="from section"><div class="block">${html}</div></div></main>`;
  return document.querySelector('.block');
}

describe('renderNanoBlocks', () => {
  it('renders text and edge placeholders alike, in document order', async () => {
    rendered.length = 0;
    const block = section(
      '<p>{Record, a}</p>'
      + '<p><span data-edge-nanoblock="{Record, b}">value of b</span></p>'
      + '<table><tr><td>{Record, c}</td><td><span data-edge-nanoblock="{Record, d}">d</span></td></tr></table>',
    );

    await renderNanoBlocks(block);

    expect(rendered).toEqual(['a', 'b', 'c', 'd']);
    // each replaces the element around its placeholder: the paragraph, or the table cell
    expect([...block.children].map((child) => child.tagName)).toEqual(['DIV', 'DIV', 'TABLE']);
    expect([...block.querySelectorAll('tr > .nanoblock')].map((el) => el.textContent)).toEqual(['rendered c', 'rendered d']);
    expect(block.querySelector('[data-edge-nanoblock], td, p')).toBeNull();
  });

  it('reads an edge placeholder\'s section params by its index, like a text one', async () => {
    rendered.length = 0;
    const block = section('<p><span data-edge-nanoblock="{Record}">value</span></p>');

    await renderNanoBlocks(block, undefined, 1);

    expect(rendered).toEqual(['from section']);
  });

  it('doesn\'t take placeholder-like text inside an edge element for a placeholder', async () => {
    rendered.length = 0;
    const block = section('<p><span data-edge-nanoblock="{Record, outer}">{Record, inner}</span></p>');

    await renderNanoBlocks(block);

    expect(rendered).toEqual(['outer']);
  });

  it('leaves elements without placeholders alone', async () => {
    const block = section('<p><span data-other="x">plain</span></p>');
    const before = block.innerHTML;
    const renderer = vi.fn();
    createNanoBlock('plain', renderer);

    await renderNanoBlocks(block);

    expect(block.innerHTML).toBe(before);
    expect(renderer).not.toHaveBeenCalled();
  });
});

describe('getNanoBlockText', () => {
  it('reads the placeholder an element holds, rendered at the edge or not', () => {
    const edge = section('<p><span data-edge-nanoblock="{PriceComparison}">Old price <s>$1</s> $2</span></p>').firstElementChild;
    const authored = section('<p>{PriceComparison}</p>').firstElementChild;
    const other = section('<p>Plus applicable sales tax</p>').firstElementChild;

    expect(getNanoBlockText(edge)).toBe('{PriceComparison}');
    expect(getNanoBlockText(authored)).toBe('{PriceComparison}');
    expect(getNanoBlockText(other)).toBe('Plus applicable sales tax');
  });
});
