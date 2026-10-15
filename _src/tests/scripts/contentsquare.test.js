/* eslint-disable no-underscore-dangle -- window._uxa is the Contentsquare queue */
import {
  describe, it, expect, beforeEach,
} from 'vitest';
import {
  trackDynamicVariable,
  trackDynamicVariables,
  trackPageEvent,
} from '../../scripts/utils/contentsquare.js';

describe('Contentsquare events API wrapper', () => {
  beforeEach(() => {
    delete window._uxa;
  });

  it('creates the queue and pushes a page event', () => {
    expect(trackPageEvent('webmcp:register:ok')).toBe(true);
    expect(window._uxa).toEqual([['trackPageEvent', 'webmcp:register:ok']]);
  });

  it('keeps an existing queue object provided by the loaded tag', () => {
    const queued = [];
    const tag = { push: (command) => queued.push(command) };
    window._uxa = tag;

    trackPageEvent('webmcp:prices:start');

    expect(window._uxa).toBe(tag);
    expect(queued).toEqual([['trackPageEvent', 'webmcp:prices:start']]);
  });

  it('returns false instead of throwing when the queue rejects the command', () => {
    window._uxa = {
      push: () => {
        throw new Error('tag failure');
      },
    };

    expect(trackPageEvent('webmcp:prices:start')).toBe(false);
    expect(trackDynamicVariable('webmcp_calls', 1)).toBe(false);
  });

  it('ignores a queue that cannot be pushed to', () => {
    window._uxa = { push: 'not a function' };

    expect(trackPageEvent('webmcp:prices:start')).toBe(false);
  });

  it('truncates event names to 255 characters', () => {
    trackPageEvent('a'.repeat(400));

    expect(window._uxa[0][1]).toHaveLength(255);
  });

  it('truncates dynamic variable keys and values to the documented limits', () => {
    trackDynamicVariable('k'.repeat(600), 'v'.repeat(400));

    const [, variable] = window._uxa[0];
    expect(variable.key).toHaveLength(512);
    expect(variable.value).toHaveLength(255);
  });

  it('strips control characters', () => {
    trackPageEvent('webmcp:\u0000prices:\nstart');

    expect(window._uxa[0][1]).toBe('webmcp: prices: start');
  });

  it('rounds and clamps numeric values', () => {
    trackDynamicVariable('webmcp_last_duration_ms', 412.7);
    trackDynamicVariable('webmcp_calls', -5);
    trackDynamicVariable('webmcp_errors', 0);

    expect(window._uxa.map(([, variable]) => variable.value)).toEqual([413, 0, 0]);
  });

  it('rejects non-finite numbers and empty values', () => {
    expect(trackDynamicVariable('webmcp_calls', NaN)).toBe(false);
    expect(trackDynamicVariable('webmcp_calls', Infinity)).toBe(false);
    expect(trackDynamicVariable('webmcp_last_tool', '   ')).toBe(false);
    expect(trackDynamicVariable('', 'prices')).toBe(false);
    expect(trackPageEvent('')).toBe(false);
    expect(window._uxa).toBeUndefined();
  });

  it('batches several dynamic variables and skips empty ones', () => {
    trackDynamicVariables({
      webmcp_last_tool: 'prices',
      webmcp_last_error: undefined,
      webmcp_last_product: null,
      webmcp_last_locale: '',
      webmcp_calls: 2,
    });

    expect(window._uxa).toEqual([
      ['trackDynamicVariable', { key: 'webmcp_last_tool', value: 'prices' }],
      ['trackDynamicVariable', { key: 'webmcp_calls', value: 2 }],
    ]);
  });
});
