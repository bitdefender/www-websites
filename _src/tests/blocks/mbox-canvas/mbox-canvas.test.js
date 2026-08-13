import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';

vi.mock('@repobit/dex-data-layer', () => ({
  AdobeDataLayerService: {
    push: vi.fn(),
  },
  WindowLoadStartedEvent: vi.fn(),
}));

vi.mock('../../../scripts/target.js', () => ({
  target: {
    getOffers: vi.fn(),
  },
}));

vi.mock('../../../scripts/scripts.js', () => ({
  decorateMain: vi.fn(),
  detectModalButtons: vi.fn(),
}));

vi.mock('../../../scripts/lib-franklin.js', () => ({
  decorateIcons: vi.fn(),
  getMetadata: vi.fn(() => ''),
  loadBlocks: vi.fn(),
}));

vi.mock('../../../scripts/page.js', () => ({
  default: {
    getParamValue: vi.fn(() => null),
  },
}));

vi.mock('../../../scripts/libs/constants.js', () => ({
  Constants: {
    BASE_URL_FOR_PROD: '',
  },
}));

vi.mock('../../../scripts/libs/store/index.js', () => ({
  StoreResolver: {
    resolve: vi.fn(),
  },
}));

const { createOfferParameters, createOfferProfileParameters } = await import('../../../blocks/mbox-canvas/mbox-canvas.js');

describe('mbox-canvas offer parameters', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/en-us/consumer/webview/churn-flow');
  });

  it('adds bundle_id from url parameters', async () => {
    expect(await createOfferParameters()).not.toHaveProperty('bundle_id');

    window.history.pushState({}, '', '/en-us/consumer/webview/churn-flow?bundle_id=com.bitdefender.premiumsecurity.v2');

    expect(await createOfferParameters()).toHaveProperty('bundle_id', 'com.bitdefender.premiumsecurity.v2');
  });

  it('preserves existing url parameters', async () => {
    window.history.pushState(
      {},
      '',
      '/en-us/consumer/webview/churn-flow?feature=main_ui&lang=EN-US&auto_renewal=1&bundle_id=com.bitdefender.tsmd.v2',
    );

    const parameters = await createOfferParameters();

    expect(parameters).toEqual({
      feature: 'main-ui',
      lang: 'en-us',
      auto_renewal: '1',
      bundle_id: 'com.bitdefender.tsmd.v2',
    });
    expect(createOfferProfileParameters(parameters)).toEqual({
      'profile.feature': 'main-ui',
      'profile.lang': 'en-us',
      'profile.auto_renewal': '1',
      'profile.bundle_id': 'com.bitdefender.tsmd.v2',
    });
  });
});
