const PRODUCT_PRICE_PATH = '/p-api/v1/products/{bundleId}/locale/{locale}';
const PRODUCT_MSRP_PATH = `${PRODUCT_PRICE_PATH}/campaign/none`;
const PRODUCT_CATALOG_PATH = '/p-api/v1/catalog/products';
const BUNDLE_ID_PATTERN = /^[a-z0-9][a-z0-9._-]*$/i;
const LOCALE_PATTERN = /^[a-z]{2}-(?:[a-z]{2}|global)$/i;
const DEV_DOMAINS = ['localhost', 'stage', '.hlx.', '.aem.'];

let controller;
let registeredModelContext;

const catalogProperties = {
  lineOfBusiness: {
    type: 'string',
    enum: ['consumer', 'business'],
    description: 'Product audience. Accepted values are consumer and business.',
  },
  locale: {
    type: 'string',
    description: 'Locale in language-country format, such as en-us.',
  },
  product: {
    type: 'string',
    description: 'Product display name or product-page slug, such as Total Security or total-security.',
  },
  bundleId: {
    type: 'string',
    description: 'Exact Bitdefender delivery-service bundle id, matched case-insensitively.',
  },
};

const productCatalogInputSchema = {
  type: 'object',
  properties: catalogProperties,
  additionalProperties: false,
};

const productPricingInputSchema = {
  type: 'object',
  properties: {
    ...catalogProperties,
  },
  anyOf: [
    { required: ['bundleId'] },
    { required: ['product'] },
  ],
  additionalProperties: false,
};

function getModelContext() {
  return document.modelContext || window.navigator?.modelContext;
}

function getPageLocale() {
  const match = window.location.pathname.match(/\/([a-z]{2}-(?:[a-z]{2}|global))\//i);
  return match ? match[1] : 'en-us';
}

function getPricingOrigin() {
  if (DEV_DOMAINS.some((domain) => window.location.hostname.includes(domain))) {
    return 'https://www.bitdefender.com';
  }

  return window.location.origin;
}

function createError(code, message) {
  return {
    error: {
      code,
      message,
    },
  };
}

function normalizeProduct(product) {
  return String(product || '').trim().replace(/^bitdefender\s+/i, '');
}

function normalizeLocale(locale = getPageLocale()) {
  const normalized = String(locale || getPageLocale()).trim().toLowerCase();
  return normalized.includes('global') ? 'en-us' : normalized;
}

async function fetchJson(endpoint, errorCode, fallbackMessage) {
  try {
    const response = await fetch(endpoint.href, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload) {
      return createError(errorCode, payload?.message || `${fallbackMessage} HTTP ${response.status}.`);
    }

    return payload;
  } catch {
    return createError(errorCode, fallbackMessage);
  }
}

function validateCatalogInput(input = {}) {
  const toolInput = input || {};
  const lineOfBusiness = String(toolInput.lineOfBusiness || '').trim().toLowerCase();
  const locale = toolInput.locale ? normalizeLocale(toolInput.locale) : '';
  const product = normalizeProduct(toolInput.product);
  const bundleId = String(toolInput.bundleId || '').trim();

  if (lineOfBusiness && !['consumer', 'business'].includes(lineOfBusiness)) {
    return createError('invalid_line_of_business', 'Provide consumer or business as the line of business.');
  }

  if (locale && !LOCALE_PATTERN.test(locale)) {
    return createError('invalid_locale', 'Provide a locale in the format en-us.');
  }

  if (bundleId && !BUNDLE_ID_PATTERN.test(bundleId)) {
    return createError('invalid_bundle_id', 'Provide a valid Bitdefender product bundle id.');
  }

  return {
    lineOfBusiness,
    locale,
    product,
    bundleId,
  };
}

async function fetchProductCatalog(input = {}) {
  const filters = validateCatalogInput(input);

  if (filters.error) {
    return filters;
  }

  const endpoint = new URL(PRODUCT_CATALOG_PATH, getPricingOrigin());
  Object.entries(filters).forEach(([name, value]) => {
    if (value) endpoint.searchParams.set(name, value);
  });

  return fetchJson(endpoint, 'catalog_request_failed', 'Unable to retrieve the Bitdefender product catalog.');
}

function createProductCandidates(products) {
  return products
    .flatMap((product) => (product.bundleIds || []).map((bundleId) => ({
      product: product.product,
      bundleId,
      productUrl: product.productUrl,
    })))
    .filter((candidate, index, candidates) => (
      candidates.findIndex(({ bundleId }) => bundleId === candidate.bundleId) === index
    ));
}

async function resolveProduct(input = {}) {
  const bundleId = String(input.bundleId || '').trim();

  if (bundleId) {
    if (!BUNDLE_ID_PATTERN.test(bundleId)) {
      return createError('invalid_bundle_id', 'Provide a valid Bitdefender product bundle id.');
    }

    return { bundleId };
  }

  const product = normalizeProduct(input.product);

  if (!product) {
    return createError('missing_product', 'Provide a product name, website product id, or bundle id.');
  }

  const catalog = await fetchProductCatalog({
    lineOfBusiness: input.lineOfBusiness,
    locale: input.locale,
    product,
  });

  if (catalog.error) {
    return catalog;
  }

  const candidates = createProductCandidates(catalog.products || []);

  if (!candidates.length) {
    return createError('product_not_found', 'The product could not be matched to a Bitdefender bundle id.');
  }

  if (candidates.length > 1) {
    return {
      ...createError('ambiguous_product', 'The product name matched multiple Bitdefender products. Retry with one candidate.'),
      candidates: candidates.slice(0, 5),
    };
  }

  return {
    bundleId: candidates[0].bundleId,
    product: candidates[0].product,
  };
}

async function validateInput(input = {}) {
  const toolInput = input || {};
  const { locale } = toolInput;
  const normalizedLocale = normalizeLocale(locale);

  if (!LOCALE_PATTERN.test(normalizedLocale)) {
    return createError('invalid_locale', 'Provide a locale in the format en-us.');
  }

  const product = await resolveProduct({
    ...toolInput,
    locale: normalizedLocale,
  });

  if (product.error) {
    return product;
  }

  return {
    ...product,
    locale: normalizedLocale,
  };
}

function getProductPricingUrl(bundleId, locale, path) {
  const productPath = path
    .replace('{bundleId}', encodeURIComponent(bundleId))
    .replace('{locale}', encodeURIComponent(locale));

  return new URL(productPath, getPricingOrigin());
}

async function fetchProductPricing(input, path) {
  const request = await validateInput(input);

  if (request.error) {
    return request;
  }

  const endpoint = getProductPricingUrl(request.bundleId, request.locale, path);
  const payload = await fetchJson(
    endpoint,
    'pricing_request_failed',
    'Unable to retrieve Bitdefender product pricing.',
  );

  if (payload.error) {
    return payload;
  }

  return {
    ...payload,
    resolvedProduct: {
      product: request.product,
      bundleId: request.bundleId,
      locale: request.locale,
    },
  };
}

function createProductCatalogTool() {
  return {
    name: 'bitdefender_product_catalog',
    description: 'Returns the Bitdefender product catalog for product discovery, comparison, and recommendations. Filters are optional and combinable; omit all filters for the full catalog.',
    inputSchema: productCatalogInputSchema,
    execute: fetchProductCatalog,
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
    },
  };
}

function createProductPricingTool() {
  return {
    name: 'bitdefender_product_prices',
    description: 'Returns active website campaign prices for a Bitdefender product name, website product id, or bundle id.',
    inputSchema: productPricingInputSchema,
    execute: (input) => fetchProductPricing(input, PRODUCT_PRICE_PATH),
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
    },
  };
}

function createProductMsrpTool() {
  return {
    name: 'bitdefender_product_msrp',
    description: 'Returns MSRP prices for a Bitdefender product name, website product id, or bundle id.',
    inputSchema: productPricingInputSchema,
    execute: (input) => fetchProductPricing(input, PRODUCT_MSRP_PATH),
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
    },
  };
}

// eslint-disable-next-line import/prefer-default-export
export async function registerBitdefenderWebMcp() {
  const modelContext = getModelContext();

  if (!modelContext?.registerTool) {
    return null;
  }

  if (controller && registeredModelContext === modelContext) {
    return null;
  }

  if (controller) {
    controller.abort();
  }

  const nextController = new AbortController();
  await Promise.all([
    modelContext.registerTool(createProductCatalogTool(), { signal: nextController.signal }),
    modelContext.registerTool(createProductPricingTool(), { signal: nextController.signal }),
    modelContext.registerTool(createProductMsrpTool(), { signal: nextController.signal }),
  ]);

  controller = nextController;
  registeredModelContext = modelContext;

  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) {
      nextController.abort();

      if (controller === nextController) {
        controller = null;
        registeredModelContext = null;
      }
    }
  }, { once: true });

  return controller;
}
