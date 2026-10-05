/* eslint-disable no-underscore-dangle -- window._uxa is the Contentsquare queue */
import {
  describe, it, expect, beforeEach, afterEach, vi,
} from 'vitest';

const CATALOG_PAYLOAD = {
  products: [
    {
      product: 'Total Security',
      productUrl: '/total-security',
      bundleIds: ['com.bitdefender.tsmd'],
    },
  ],
};
const PRICE_PAYLOAD = { price: 49.99, currency: 'USD' };

function jsonResponse(payload, ok = true, status = 200) {
  return { ok, status, json: async () => payload };
}

async function loadWebMcp() {
  vi.resetModules();
  return import('../../scripts/webmcp.js');
}

function getEvents() {
  return (window._uxa || [])
    .filter(([command]) => command === 'trackPageEvent')
    .map(([, name]) => name);
}

function getVariables() {
  return Object.fromEntries((window._uxa || [])
    .filter(([command]) => command === 'trackDynamicVariable')
    .map(([, variable]) => [variable.key, variable.value]));
}

async function registerTools(registerTool = vi.fn()) {
  const { registerBitdefenderWebMcp } = await loadWebMcp();
  document.modelContext = { registerTool };
  await registerBitdefenderWebMcp();

  return Object.fromEntries(registerTool.mock.calls.map(([tool]) => [tool.name, tool]));
}

describe('WebMCP Contentsquare tracking', () => {
  beforeEach(() => {
    delete window._uxa;
    delete document.modelContext;
    window.history.replaceState({}, '', '/en-us/consumer/total-security/');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete document.modelContext;
  });

  it('reports a successful registration without altering the tool definitions', async () => {
    const registerTool = vi.fn();
    const tools = await registerTools(registerTool);

    expect(Object.keys(tools)).toEqual([
      'bitdefender_product_catalog',
      'bitdefender_product_prices',
      'bitdefender_product_msrp',
    ]);
    expect(tools.bitdefender_product_prices.annotations).toEqual({
      readOnlyHint: true,
      untrustedContentHint: true,
    });
    expect(tools.bitdefender_product_prices.inputSchema.anyOf).toEqual([
      { required: ['bundleId'] },
      { required: ['product'] },
    ]);
    expect(getEvents()).toContain('webmcp:register:ok');
    expect(getVariables()).toMatchObject({ webmcp_status: 'registered', webmcp_tools: 3 });
  });

  it('reports an unsupported browser', async () => {
    const { registerBitdefenderWebMcp } = await loadWebMcp();

    expect(await registerBitdefenderWebMcp()).toBeNull();
    expect(getEvents()).toEqual(['webmcp:register:unsupported']);
    expect(getVariables()).toEqual({ webmcp_status: 'unsupported' });
  });

  it('reports a duplicate registration against the same model context', async () => {
    const { registerBitdefenderWebMcp } = await loadWebMcp();
    document.modelContext = { registerTool: vi.fn() };
    await registerBitdefenderWebMcp();

    expect(await registerBitdefenderWebMcp()).toBeNull();
    expect(getEvents()).toContain('webmcp:register:duplicate');
    expect(getVariables().webmcp_status).toBe('duplicate');
  });

  it('reports a failed registration and still rejects', async () => {
    const { registerBitdefenderWebMcp } = await loadWebMcp();
    document.modelContext = { registerTool: vi.fn().mockRejectedValue(new Error('denied')) };

    await expect(registerBitdefenderWebMcp()).rejects.toThrow('denied');
    expect(getEvents()).toContain('webmcp:register:error');
    expect(getVariables().webmcp_status).toBe('error');
  });

  it('reports a successful tool call and returns the payload unchanged', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(jsonResponse(CATALOG_PAYLOAD))
      .mockResolvedValueOnce(jsonResponse(PRICE_PAYLOAD)));

    const tools = await registerTools();
    const result = await tools.bitdefender_product_prices.execute({ product: 'Total Security' });

    expect(result).toEqual({
      ...PRICE_PAYLOAD,
      resolvedProduct: {
        product: 'Total Security',
        bundleId: 'com.bitdefender.tsmd',
        locale: 'en-us',
      },
    });
    expect(getEvents()).toEqual(expect.arrayContaining([
      'webmcp:prices:start',
      'webmcp:prices:success',
    ]));

    const variables = getVariables();
    expect(variables).toMatchObject({
      webmcp_calls: 1,
      webmcp_errors: 0,
      webmcp_last_tool: 'prices',
      webmcp_last_outcome: 'success',
      webmcp_last_product: 'Total Security',
      webmcp_last_bundle_id: 'com.bitdefender.tsmd',
      webmcp_last_locale: 'en-us',
    });
    expect(variables.webmcp_last_error).toBeUndefined();
    expect(variables.webmcp_last_duration_ms).toBeGreaterThanOrEqual(0);
  });

  it('reports the error code when the pricing request fails', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(jsonResponse(CATALOG_PAYLOAD))
      .mockResolvedValueOnce(jsonResponse({}, false, 500)));

    const tools = await registerTools();
    const result = await tools.bitdefender_product_prices.execute({ product: 'Total Security' });

    expect(result.error.code).toBe('pricing_request_failed');
    expect(getEvents()).toContain('webmcp:prices:error:pricing_request_failed');
    expect(getVariables()).toMatchObject({
      webmcp_calls: 1,
      webmcp_errors: 1,
      webmcp_last_outcome: 'error',
      webmcp_last_error: 'pricing_request_failed',
    });
  });

  it('reports validation errors raised before any request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const tools = await registerTools();

    await tools.bitdefender_product_prices.execute({});
    await tools.bitdefender_product_prices.execute({ product: 'Total Security', locale: 'zzz' });

    expect(getEvents()).toEqual(expect.arrayContaining([
      'webmcp:prices:error:missing_product',
      'webmcp:prices:error:invalid_locale',
    ]));
    expect(getVariables()).toMatchObject({ webmcp_calls: 2, webmcp_errors: 2 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('counts every call across tools', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(CATALOG_PAYLOAD)));

    const tools = await registerTools();
    await Promise.all(Array.from({ length: 25 }, () => (
      tools.bitdefender_product_catalog.execute({ lineOfBusiness: 'consumer' })
    )));

    expect(getVariables().webmcp_calls).toBe(25);
    expect(getEvents().filter((name) => name === 'webmcp:catalog:start')).toHaveLength(25);
    expect(new Set(Object.keys(getVariables())).size).toBeLessThanOrEqual(12);
  });

  it('reports an exception and rethrows it', async () => {
    const { withTracking } = await loadWebMcp();
    const tool = withTracking({
      name: 'bitdefender_product_prices',
      execute: () => {
        throw new Error('boom');
      },
    });

    await expect(tool.execute({})).rejects.toThrow('boom');
    expect(getEvents()).toContain('webmcp:prices:error:exception');
    expect(getVariables().webmcp_last_error).toBe('exception');
  });

  it('never lets a broken Contentsquare queue affect the tool result', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(jsonResponse(CATALOG_PAYLOAD))
      .mockResolvedValueOnce(jsonResponse(PRICE_PAYLOAD)));

    const tools = await registerTools();
    window._uxa = {
      push: () => {
        throw new Error('tag failure');
      },
    };

    const result = await tools.bitdefender_product_prices.execute({ product: 'Total Security' });

    expect(result.price).toBe(49.99);
    expect(result.resolvedProduct.bundleId).toBe('com.bitdefender.tsmd');
  });

  it('never reports agent-supplied text verbatim', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ products: [] })));

    const tools = await registerTools();
    const hostile = '<script>'.repeat(200);
    await tools.bitdefender_product_prices.execute({ product: hostile });

    expect(getEvents().join('|')).not.toContain('<script>');
    expect(getVariables().webmcp_last_product).toBe('other');
    expect(getEvents()).toContain('webmcp:prices:error:product_not_found');
  });
});
