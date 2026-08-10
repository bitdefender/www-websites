import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';

const { getMetadataMock } = vi.hoisted(() => ({
  getMetadataMock: vi.fn(() => ''),
}));

vi.mock('../../../scripts/scripts.js', () => ({
  getLanguageCountryFromPath: vi.fn(() => ({
    language: 'en',
    country: 'us',
  })),
}));

vi.mock('../../../scripts/lib-franklin.js', () => ({
  decorateIcons: vi.fn(),
  getMetadata: getMetadataMock,
}));

const { default: decorate } = await import('../../../blocks/webview-plan-selector/webview-plan-selector.js');

function setupDefaultPlanSelector() {
  document.body.innerHTML = `
    <main>
      <div
        class="section"
        data-products="basic/3/1,premium/10/1"
        data-benefits-product1="true,false"
        data-benefits-product2="true,true"
        data-discount="50%"
        data-save-text="off"
      >
        <div class="webview-plan-selector-wrapper">
          <div class="webview-plan-selector">
            <div><div><h1>Upgrade now</h1></div></div>
            <div>
              <div><p>Antivirus</p><p>Unlimited VPN</p></div>
              <div><p>30-day guarantee</p></div>
            </div>
            <div>
              <div>
                <h2>Basic</h2>
                <p>For essential protection</p>
                <p>&lt;discounted-yearly-price&gt; billed yearly</p>
              </div>
              <div>
                <h2>Premium [checked]</h2>
                <p>For complete protection</p>
                <p>&lt;discounted-yearly-price&gt; billed yearly</p>
              </div>
            </div>
            <div>
              <div>
                <p><a href="#upgrade">Upgrade</a></p>
                <p>Subscription terms apply.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>`;

  return document.querySelector('.webview-plan-selector');
}

function setupV2PlanSelector({
  secondToggleProducts = 'total-family/25/1,premium-family/25/1',
  secondToggleLabel = 'Family · up to 25 devices',
  checkedPlanIndex = 1,
} = {}) {
  const planTitles = ['Bitdefender Total Security', 'Bitdefender Premium Security'];
  if (checkedPlanIndex >= 0) {
    planTitles[checkedPlanIndex] += ' [checked]';
  }

  document.body.innerHTML = `
    <main>
      <div
        class="section"
        data-products="total-individual/5/1,premium-individual/5/1"
        data-second-toggle-products="${secondToggleProducts}"
        data-first-toggle-label="Individual · up to 5 devices"
        data-second-toggle-label="${secondToggleLabel}"
        data-price-period="/ 1st year"
      >
        <div class="webview-plan-selector-wrapper">
          <div class="webview-plan-selector">
            <div><div><h1>Stay protected — choose your plan</h1></div></div>
            <div>
              <div>
                <p>Included in Total Security</p>
                <ul>
                  <li><strong>Real-time device protection</strong></li>
                  <li><strong>Password Manager included</strong></li>
                </ul>
              </div>
              <div>
                <h4>Your current plan</h4>
                <h3>${planTitles[0]}</h3>
                <p>Trusted protection for your devices.</p>
              </div>
            </div>
            <div>
              <div>
                <p>Premium Security also adds</p>
                <ul>
                  <li>Scam Protection Pro [blue-pill AI-powered blue-pill]</li>
                  <li><strong>Email Protection</strong></li>
                </ul>
              </div>
              <div>
                <h4>Recommended</h4>
                <h3>${planTitles[1]}</h3>
                <p>Your most complete defense.</p>
              </div>
            </div>
            <div>
              <div>
                <p><span class="icon icon-money-hand"></span>Cancel anytime, no hidden fees</p>
                <p><span class="icon icon-checkmark-cloud"></span>30-day money-back guarantee</p>
                <p><a href="#upgrade">Upgrade subscription</a></p>
              </div>
            </div>
            <div>
              <div>&lt;privacy-policy-text&gt; Continue in your default browser. <a href="https://www.bitdefender.com/locale/site/view/legal-privacy-policy-for-bitdefender-websites">Privacy Policy</a></div>
            </div>
          </div>
        </div>
      </div>
    </main>`;

  return document.querySelector('.webview-plan-selector');
}

function selectRadio(input) {
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('webview-plan-selector factory', () => {
  beforeEach(() => {
    getMetadataMock.mockReset();
    getMetadataMock.mockReturnValue('');
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true })));
    window.history.pushState({}, '', '/en-us/consumer/webview/plan-selector');
  });

  it('uses the default factory for existing authored content', async () => {
    const block = setupDefaultPlanSelector();

    await decorate(block);

    expect(getMetadataMock).toHaveBeenCalledWith('webview-plan-selector-type');
    expect(block.parentElement.classList.contains('default')).toBe(true);
    expect(block.querySelectorAll('.webview-plan-selector-plan')).toHaveLength(2);
    expect(block.querySelector('[data-plan-index="1"]').classList.contains('is-selected')).toBe(true);
    expect(block.querySelector('.webview-plan-selector-upgrade').href).toContain('#upgrade');
  });

  it('keeps unknown factory values on the wrapper and falls back to default decoration', async () => {
    getMetadataMock.mockReturnValue('experiment');
    const block = setupDefaultPlanSelector();

    await decorate(block);

    expect(block.parentElement.classList.contains('experiment')).toBe(true);
    expect(block.querySelector('.webview-plan-selector-layout')).toBeTruthy();
    expect(block.querySelector('.webview-plan-selector-v2-layout')).toBeFalsy();
  });

  it('decorates the v2 variation from authored content and generic metadata', async () => {
    getMetadataMock.mockReturnValue('v2');
    const block = setupV2PlanSelector();

    await decorate(block);

    expect(block.parentElement.classList.contains('v2')).toBe(true);
    expect(block.classList.contains('v2')).toBe(true);
    expect(block.classList.contains('dark-mode')).toBe(false);
    expect(block.querySelector('.webview-plan-selector-v2-title').textContent).toBe('Stay protected — choose your plan');
    expect(block.querySelectorAll('.webview-plan-selector-v2-feature-group')).toHaveLength(2);
    expect(block.querySelector('.webview-plan-selector-v2-pill').textContent).toBe('AI-powered');
    expect(block.querySelectorAll('fieldset')).toHaveLength(2);
    expect(block.querySelectorAll('.webview-plan-selector-v2-plan-input')).toHaveLength(2);
    expect(block.querySelectorAll('.webview-plan-selector-v2-toggle-input')).toHaveLength(2);
    expect(block.querySelector('[data-store-price="full"]')).toBeTruthy();
    expect(block.querySelector('[data-store-price="discounted||full"]')).toBeTruthy();
    expect(block.querySelector('[data-store-discount="percentage"]')).toBeTruthy();
    expect(block.querySelector('.webview-plan-selector-v2-price-period').textContent).toBe('/ 1st year');
    expect(block.querySelector('.webview-plan-selector-legal a').href).toContain('/en-us/');
    expect(block.querySelector('.webview-plan-selector-upgrade').href).toContain('feature=main_ui');
  });

  it('adds the dark-mode class to v2 when requested through the theme query parameter', async () => {
    getMetadataMock.mockReturnValue('v2');
    window.history.pushState({}, '', '/en-us/consumer/webview/plan-selector?theme=dark');
    const block = setupV2PlanSelector();

    await decorate(block);

    expect(block.classList.contains('v2')).toBe(true);
    expect(block.classList.contains('dark-mode')).toBe(true);
  });

  it('renders both authored generic toggle labels', async () => {
    getMetadataMock.mockReturnValue('v2');
    const block = setupV2PlanSelector();

    await decorate(block);

    const toggleLabels = [...block.querySelectorAll('.webview-plan-selector-v2-toggle-option span')]
      .map((label) => label.textContent);
    expect(toggleLabels).toEqual([
      'Individual · up to 5 devices',
      'Family · up to 25 devices',
    ]);
  });

  it('maps every plan and toggle combination to products in authored plan-cell order', async () => {
    getMetadataMock.mockReturnValue('v2');
    const block = setupV2PlanSelector();

    await decorate(block);

    const contexts = [...block.querySelectorAll('[data-store-context]')];
    expect(contexts).toHaveLength(4);
    expect(contexts.map((context) => ({
      plan: context.dataset.planIndex,
      toggle: context.dataset.toggleIndex,
      id: context.dataset.storeId,
      option: context.dataset.storeOption,
    }))).toEqual([
      {
        plan: '0', toggle: '0', id: 'total-individual', option: '5-1',
      },
      {
        plan: '0', toggle: '1', id: 'total-family', option: '25-1',
      },
      {
        plan: '1', toggle: '0', id: 'premium-individual', option: '5-1',
      },
      {
        plan: '1', toggle: '1', id: 'premium-family', option: '25-1',
      },
    ]);
  });

  it('uses the authored [checked] marker for the initial plan selection', async () => {
    getMetadataMock.mockReturnValue('v2');
    const block = setupV2PlanSelector({ checkedPlanIndex: 1 });

    await decorate(block);

    const planInputs = [...block.querySelectorAll('.webview-plan-selector-v2-plan-input')];
    expect(planInputs[0].checked).toBe(false);
    expect(planInputs[1].checked).toBe(true);
    expect(block.querySelector('[data-plan-index="1"]').classList.contains('is-selected')).toBe(true);
    expect(block.querySelector('.webview-plan-selector-v2-plan-name').textContent).not.toContain('[checked]');
  });

  it('switches native plan and toggle radios and shows the matching store prices', async () => {
    getMetadataMock.mockReturnValue('v2');
    const block = setupV2PlanSelector({ checkedPlanIndex: 1 });

    await decorate(block);

    const familyToggle = block.querySelector('.webview-plan-selector-v2-toggle-input[value="1"]');
    const totalPlan = block.querySelector('.webview-plan-selector-v2-plan-input[value="0"]');
    const familyTotalContext = block.querySelector(
      '[data-store-context][data-plan-index="0"][data-toggle-index="1"]',
    );
    familyTotalContext.querySelector('[data-store-price="discounted||full"]').textContent = '$99.99';
    familyTotalContext.querySelector('[data-store-buy-link]').href = 'https://checkout.example.test/family-total';
    selectRadio(familyToggle);
    selectRadio(totalPlan);

    expect(familyToggle.checked).toBe(true);
    expect(totalPlan.checked).toBe(true);
    expect(block.querySelector('[data-plan-index="0"]').classList.contains('is-selected')).toBe(true);
    expect(block.querySelector('[data-store-context][data-plan-index="0"][data-toggle-index="0"]').hidden).toBe(true);
    expect(block.querySelector('[data-store-context][data-plan-index="0"][data-toggle-index="1"]').hidden).toBe(false);
    expect(familyTotalContext.querySelector('[data-store-price="discounted||full"]').textContent).toBe('$99.99');
    expect(block.querySelector('.webview-plan-selector-upgrade').href)
      .toBe('https://checkout.example.test/family-total');
  });

  it('synchronizes the authored footer CTA after selected store-link mutations', async () => {
    getMetadataMock.mockReturnValue('v2');
    const block = setupV2PlanSelector({ checkedPlanIndex: 1 });

    await decorate(block);

    const activeBuyLink = block.querySelector(
      '[data-store-context][data-plan-index="1"][data-toggle-index="0"] [data-store-buy-link]',
    );
    activeBuyLink.href = 'https://checkout.example.test/premium';
    activeBuyLink.textContent = 'Upgrade subscription';
    activeBuyLink.setAttribute('data-product', 'premium-individual');
    activeBuyLink.setAttribute('data-buy-price', '79.99');
    activeBuyLink.setAttribute('data-old-price', '129.99');
    activeBuyLink.setAttribute('data-currency', 'USD');
    activeBuyLink.setAttribute('data-variation', 'annual');

    await vi.waitFor(() => {
      const cta = block.querySelector('.webview-plan-selector-upgrade');
      expect(cta.href).toBe('https://checkout.example.test/premium');
      expect(cta.textContent).toBe('Upgrade subscription');
      expect(cta.getAttribute('data-product')).toBe('premium-individual');
      expect(cta.getAttribute('data-buy-price')).toBe('79.99');
      expect(cta.getAttribute('data-old-price')).toBe('129.99');
      expect(cta.getAttribute('data-currency')).toBe('USD');
      expect(cta.getAttribute('data-variation')).toBe('annual');
    });
  });

  it.each([
    ['an incomplete product list', 'total-family/25/1', 'Family · up to 25 devices'],
    ['a missing label', 'total-family/25/1,premium-family/25/1', ''],
  ])('omits the second toggle for %s', async (description, secondToggleProducts, secondToggleLabel) => {
    getMetadataMock.mockReturnValue('v2');
    const block = setupV2PlanSelector({ secondToggleProducts, secondToggleLabel });

    await decorate(block);

    expect(description).toBeTruthy();
    expect(block.querySelector('.webview-plan-selector-v2-toggle-fieldset')).toBeFalsy();
    expect(block.querySelectorAll('[data-store-context]')).toHaveLength(2);
    expect([...block.querySelectorAll('[data-store-context]')]
      .every((context) => context.dataset.toggleIndex === '0')).toBe(true);
  });
});
