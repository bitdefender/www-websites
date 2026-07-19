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

function setupPlanSelector() {
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

describe('webview-plan-selector factory', () => {
  beforeEach(() => {
    getMetadataMock.mockReset();
    getMetadataMock.mockReturnValue('');
    window.history.pushState({}, '', '/en-us/consumer/webview/plan-selector');
  });

  it('uses the default factory for existing authored content', async () => {
    const block = setupPlanSelector();

    await decorate(block);

    expect(getMetadataMock).toHaveBeenCalledWith('webview-plan-selector-type');
    expect(block.parentElement.classList.contains('default')).toBe(true);
    expect(block.querySelectorAll('.webview-plan-selector-plan')).toHaveLength(2);
    expect(block.querySelector('[data-plan-index="1"]').classList.contains('is-selected')).toBe(true);
    expect(block.querySelector('.webview-plan-selector-upgrade').href).toContain('#upgrade');
  });

  it('keeps unknown factory values on the wrapper and falls back to default decoration', async () => {
    getMetadataMock.mockReturnValue('experiment');
    const block = setupPlanSelector();

    await decorate(block);

    expect(block.parentElement.classList.contains('experiment')).toBe(true);
    expect(block.querySelector('.webview-plan-selector-layout')).toBeTruthy();
  });

  it('clears the block when the hidden factory is selected', async () => {
    getMetadataMock.mockReturnValue('hidden');
    const block = setupPlanSelector();

    await decorate(block);

    expect(block.parentElement.classList.contains('hidden')).toBe(true);
    expect(block.childElementCount).toBe(0);
  });
});
