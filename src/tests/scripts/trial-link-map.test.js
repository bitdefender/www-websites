import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';

// trialLinkMap.js caches the map at module level, so each test loads a fresh copy
const loadGetTrialLinkMap = async () => {
  vi.resetModules();
  return (await import('../../scripts/trialLinkMap.js')).default;
};

const jsonResponse = (body, init = {}) => new Response(JSON.stringify(body), {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
  ...init,
});

describe('getTrialLinkMap', () => {
  let warn;

  beforeEach(() => {
    window.history.replaceState({}, '', '/en-us/consumer/');
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('resolves to an empty map and warns when the request is rejected (CORS, network)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const getTrialLinkMap = await loadGetTrialLinkMap();

    await expect(getTrialLinkMap()).resolves.toEqual({});
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toMatch(/request to .*triallinks\.json failed/);
  });

  it('resolves to an empty map and warns on a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 503 })));
    const getTrialLinkMap = await loadGetTrialLinkMap();

    await expect(getTrialLinkMap()).resolves.toEqual({});
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toMatch(/answered 503/);
  });

  it('resolves to an empty map and warns on invalid JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>', { status: 200 })));
    const getTrialLinkMap = await loadGetTrialLinkMap();

    await expect(getTrialLinkMap()).resolves.toEqual({});
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toMatch(/invalid JSON/);
  });

  it('builds the map for the current locale from a good response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      data: [
        {
          product: 'tsmd', devices: '5', locale: 'COM', duration: '30', buy_link: 'https://example.com/tsmd-5-30',
        },
        {
          product: 'tsmd', devices: '5', locale: 'COM', duration: '30', buy_link: 'https://example.com/duplicate',
        },
        {
          product: 'tsmd', devices: '10', locale: 'com', duration: '90', buy_link: 'https://example.com/tsmd-10-90',
        },
        {
          product: 'tsmd', devices: '5', locale: 'DE', duration: '30', buy_link: 'https://example.com/de',
        },
        {
          product: 'is', devices: '', locale: 'COM', duration: '30', buy_link: 'https://example.com/no-devices',
        },
      ],
    }));
    vi.stubGlobal('fetch', fetchMock);
    const getTrialLinkMap = await loadGetTrialLinkMap();

    const map = await getTrialLinkMap();

    expect(fetchMock).toHaveBeenCalledWith('https://www.bitdefender.com/common/triallinks.json');
    expect(map).toEqual({
      tsmd: {
        default: {
          '5-12': { 30: 'https://example.com/tsmd-5-30' },
          '10-12': { 90: 'https://example.com/tsmd-10-90' },
        },
      },
    });
    expect(warn).not.toHaveBeenCalled();

    // cached: a second call doesn't fetch again
    await expect(getTrialLinkMap()).resolves.toBe(map);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
