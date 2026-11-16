import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import probeBlocker, {
  PROBE_BAIT_PATH,
  PROBE_CONTROL_PATH,
} from '../../scripts/utils/blocker-probe.js';

describe('blocker probe', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests the control and the bait together, without cookies or the browser cache', () => {
    const fetch = vi.fn(() => Promise.resolve(new Response('')));
    vi.stubGlobal('fetch', fetch);

    probeBlocker();

    expect(fetch.mock.calls.map(([path]) => path)).toEqual([PROBE_CONTROL_PATH, PROBE_BAIT_PATH]);
    fetch.mock.calls.forEach(([, options]) => {
      expect(options).toMatchObject({ cache: 'no-store', credentials: 'omit', keepalive: true });
    });
  });

  it('swallows the rejection of a blocked bait', async () => {
    const rejected = vi.fn();
    process.on('unhandledRejection', rejected);
    vi.stubGlobal('fetch', vi.fn((path) => (path === PROBE_BAIT_PATH
      ? Promise.reject(new TypeError('Failed to fetch'))
      : Promise.resolve(new Response('')))));

    probeBlocker();
    await new Promise((resolve) => { setTimeout(resolve, 0); });

    process.off('unhandledRejection', rejected);
    expect(rejected).not.toHaveBeenCalled();
  });

  it('still sends the bait when the control request throws', () => {
    const fetch = vi.fn((path) => {
      if (path === PROBE_CONTROL_PATH) throw new TypeError('fetch unavailable');
      return Promise.resolve(new Response(''));
    });
    vi.stubGlobal('fetch', fetch);

    expect(() => probeBlocker()).not.toThrow();
    expect(fetch).toHaveBeenLastCalledWith(PROBE_BAIT_PATH, expect.any(Object));
  });
});
