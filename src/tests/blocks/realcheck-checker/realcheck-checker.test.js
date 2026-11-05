/**
 * Unit tests for the realcheck-checker block
 */
import {
  describe, it, expect, beforeEach, afterEach, vi,
} from 'vitest';
import mockApi from '../../../blocks/realcheck-checker/realcheck-checker-mock.js';

const userAgent = vi.hoisted(() => ({ isIos: false, isAndroid: false }));
vi.mock('@repobit/dex-utils', () => ({ UserAgent: userAgent }));
vi.mock('../../../scripts/page.js', () => ({ default: { name: 'realcheck' } }));
vi.mock('../../../scripts/utils/utils.js', async (importOriginal) => ({
  ...await importOriginal(),
  renderTurnstile: vi.fn(() => Promise.resolve({ widgetId: 'widget-1' })),
}));

const {
  default: decorate, checkLink, describeResult, runCheck, ENDPOINT,
} = await import('../../../blocks/realcheck-checker/realcheck-checker.js');

describe('checkLink', () => {
  it('adds https to a link typed without a scheme', () => {
    expect(checkLink(' youtube.com/watch?v=abc ')).toEqual({ url: 'https://youtube.com/watch?v=abc' });
  });

  it('accepts every supported platform, subdomains included', () => {
    ['https://www.tiktok.com/@a/video/1', 'https://vm.tiktok.com/x', 'https://youtu.be/x',
      'https://x.com/a/status/1', 'https://twitter.com/a', 'https://m.facebook.com/watch',
      'https://fb.watch/x', 'https://www.instagram.com/reel/x'].forEach((link) => {
      expect(checkLink(link).url).toBe(link);
    });
  });

  it('asks for a link when the field is empty', () => {
    expect(checkLink('   ')).toEqual({ error: 'empty' });
  });

  it('refuses what the API would refuse as not a link', () => {
    ['http://youtube.com/x', 'ftp://youtube.com/x', 'https://user:pass@youtube.com/x',
      'https://1.2.3.4/x', 'not a link', 'youtube', `https://youtube.com/${'a'.repeat(2048)}`]
      .forEach((link) => expect(checkLink(link), link).toEqual({ error: 'invalid' }));
  });

  it('names a link from another site as unsupported', () => {
    expect(checkLink('vimeo.com/76979871')).toEqual({ error: 'unsupported' });
    expect(checkLink('https://notyoutube.com/x')).toEqual({ error: 'unsupported' });
  });
});

describe('describeResult', () => {
  it('shows a clean verdict in blue, whatever the risk', () => {
    expect(describeResult({ verdict: 0, risk_level: 'high' })).toEqual({ tone: 'blue', verdict: 'verdict-0', risk: 'risk-none' });
  });

  it('colours an altered verdict by its risk', () => {
    expect(describeResult({ verdict: 2, risk_level: 'high' }).tone).toBe('red');
    expect(describeResult({ verdict: 1, risk_level: 'medium' }).tone).toBe('orange');
    expect(describeResult({ verdict: 1, risk_level: 'low' })).toEqual({ tone: 'grey', verdict: 'verdict-1', risk: 'risk-low' });
  });

  it('shows a benign risk like a low one', () => {
    expect(describeResult({ verdict: 2, risk_level: 'benign' })).toEqual(describeResult({ verdict: 2, risk_level: 'low' }));
  });

  it('keeps a missing risk grey, with no risk line', () => {
    expect(describeResult({ verdict: 2, risk_level: null })).toEqual({ tone: 'grey', verdict: 'verdict-2', risk: null });
  });
});

describe('runCheck', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const run = (fetch, onUpdate = vi.fn()) => {
    const pending = runCheck({
      endpoint: '/api', url: 'https://youtu.be/x', signal: new AbortController().signal, fetch, onUpdate,
    });
    pending.catch(() => {});
    return vi.runAllTimersAsync().then(() => pending);
  };

  it('submits the link, then polls through every status to the result', async () => {
    const fetch = vi.fn(mockApi('2-high'));
    const onUpdate = vi.fn();
    const check = await run(fetch, onUpdate);

    expect(fetch.mock.calls[0][0]).toBe('/api');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ type: 'social_media', url: 'https://youtu.be/x' });
    expect(fetch.mock.calls[1][0]).toMatch(/^\/api\/mock_\d+$/);
    expect(onUpdate.mock.calls.map(([update]) => update.status)).toEqual(['queued', 'downloading', 'analyzing', 'intent']);
    expect(check).toMatchObject({ status: 'completed', result: { verdict: 2, risk_level: 'high' } });
  });

  it('returns a failed check with the reason the API gave', async () => {
    const check = await run(mockApi('failed-no_speech'));
    expect(check).toMatchObject({ status: 'failed', error: { code: 'no_speech' } });
  });

  it('throws the API error code when the submit is refused', async () => {
    await expect(run(mockApi('http-422-platform_not_supported'))).rejects.toMatchObject({ code: 'platform_not_supported' });
  });

  it('tries a server error once more before giving up', async () => {
    const fetch = vi.fn(mockApi('http-503-service_unavailable'));
    await expect(run(fetch)).rejects.toMatchObject({ code: 'service_unavailable' });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('keeps polling through a dropped connection', async () => {
    const api = mockApi('0-low');
    let dropped = false;
    const fetch = vi.fn((url, options) => {
      if (options.method !== 'POST' && !dropped) {
        dropped = true;
        return Promise.reject(new TypeError('Failed to fetch'));
      }
      return api(url, options);
    });
    expect(await run(fetch)).toMatchObject({ status: 'completed' });
  });

  it('sends the Turnstile token with the link', async () => {
    const fetch = vi.fn(mockApi('0-low'));
    const pending = runCheck({
      endpoint: '/api', url: 'https://youtu.be/x', signal: new AbortController().signal, fetch, token: () => 'cf-token', onUpdate: vi.fn(),
    });
    await vi.runAllTimersAsync();
    await pending;
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ type: 'social_media', url: 'https://youtu.be/x', token: 'cf-token' });
  });

  it('gives up after five minutes', async () => {
    await expect(run(mockApi('slow'))).rejects.toMatchObject({ code: 'timeout' });
  });
});

describe('decorate', () => {
  let block;
  let fetch;

  const setup = async ({ rows = '', mobile = false, defaultLink = 'https://app.example/default' } = {}) => {
    userAgent.isIos = mobile;
    document.body.innerHTML = `
      <main><div class="section" data-signature="Trusted. Always." ${defaultLink ? `data-default-link="${defaultLink}"` : ''}>
        <div class="realcheck-checker">
          <div><div><h2>Bitdefender RealCheck</h2><h1>Spot deepfakes before they trick you.</h1><p>Description</p></div></div>
          <div><div>Note</div><div><p>Works with public links.</p></div></div>
          <div><div>Terms</div><div><p>You agree to our <a href="/terms">Terms</a>.</p></div></div>
          <div><div>App</div><div><p><a href="https://#os-dynamic-link">Try RealCheck Free</a></p></div></div>
          <div><div>QR</div><div><picture><img src="/qr.png" alt="QR"></picture></div></div>
          <div><div>Report</div><div><picture><img src="/report.jpg" alt=""></picture></div></div>
          ${rows}
        </div>
      </div></main>`;
    block = document.querySelector('.realcheck-checker');
    await decorate(block);
  };

  const submit = async (link) => {
    block.querySelector('input').value = link;
    block.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
    await vi.runAllTimersAsync();
  };

  beforeEach(() => {
    // the report's auto-scroll runs on animation frames: leave those real
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    fetch = vi.spyOn(window, 'fetch');
    window.turnstile = { getResponse: vi.fn(() => 'cf-token'), reset: vi.fn() };
  });

  afterEach(() => {
    vi.useRealTimers();
    fetch.mockRestore();
    delete window.turnstile;
  });

  it('builds the first screen from the intro and the authored rows', async () => {
    await setup();
    expect(block.dataset.state).toBe('idle');
    expect(block.querySelector('.realcheck-checker__eyebrow').textContent).toBe('Bitdefender RealCheck');
    expect(block.querySelector('h1').textContent).toBe('Spot deepfakes before they trick you.');
    expect(block.querySelector('input').placeholder).toBe('Paste a public video link');
    expect(block.querySelector('.realcheck-checker__terms a').target).toBe('_blank');
    expect(block.querySelector('.realcheck-checker__signature').textContent).toBe('Trusted. Always.');
  });

  it('sends the Turnstile token, then resets the widget for the next check', async () => {
    await setup();
    expect(block.querySelector('#realcheck-checker-turnstile')).not.toBeNull();
    fetch.mockImplementation(mockApi('0-low'));
    await submit('youtu.be/x');
    expect(JSON.parse(fetch.mock.calls[0][1].body).token).toBe('cf-token');
    expect(window.turnstile.getResponse).toHaveBeenCalledWith('widget-1');
    expect(window.turnstile.reset).toHaveBeenCalledWith('widget-1');
  });

  it('asks for the security check before calling the API', async () => {
    await setup();
    window.turnstile.getResponse.mockReturnValue('');
    await submit('youtu.be/x');
    expect(fetch).not.toHaveBeenCalled();
    expect(block.dataset.state).toBe('idle');
    expect(block.querySelector('.realcheck-checker__error').textContent).toBe('Please complete the security check.');
  });

  it('keeps the pictures out of the page until there is a result', async () => {
    await setup();
    expect(document.querySelector('main img[src]')).toBeNull();
  });

  it('shows the link error without calling the API', async () => {
    await setup();
    await submit('vimeo.com/1');
    expect(fetch).not.toHaveBeenCalled();
    expect(block.querySelector('.realcheck-checker__error').textContent).toMatch(/isn’t supported/);
    expect(block.querySelector('input').getAttribute('aria-invalid')).toBe('true');
  });

  it('runs a check against the endpoint and shows the result', async () => {
    await setup();
    fetch.mockImplementation(mockApi('1-medium'));
    await submit('youtube.com/watch?v=abc');

    expect(fetch.mock.calls[0][0]).toBe(ENDPOINT);
    expect(block.dataset).toMatchObject({ state: 'completed', tone: 'orange' });
    expect(block.querySelector('.realcheck-checker__verdict__title').textContent).toBe('Possibly altered');
    expect(block.querySelector('.realcheck-checker__risk').textContent).toBe('Medium risk of deception');
    expect(block.querySelector('.realcheck-checker__video__link a').textContent).toBe('youtube.com/watch?v=abc');
    expect(block.querySelector('.realcheck-checker__scroller img').getAttribute('src')).toBe('/report.jpg');
    expect(block.querySelector('.realcheck-checker__qr img')).not.toBeNull();
  });

  it('shows the video title as text', async () => {
    await setup();
    const api = mockApi('2-high');
    fetch.mockImplementation(async (url, options) => {
      const response = await api(url, options);
      const body = await response.json();
      if (body.media) body.media.title = '<img src=x onerror=alert(1)>';
      const { status, headers } = response;
      return new Response(JSON.stringify(body), { status, headers });
    });
    await submit('youtu.be/x');
    const title = block.querySelector('.realcheck-checker__video__title');
    expect(title.textContent).toBe('<img src=x onerror=alert(1)>');
    expect(title.querySelector('img')).toBeNull();
  });

  it('ignores a second Analyze while a check runs', async () => {
    await setup();
    fetch.mockImplementation(mockApi('slow'));
    const form = block.querySelector('form');
    block.querySelector('input').value = 'youtu.be/x';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    await vi.advanceTimersByTimeAsync(0);
    expect(fetch.mock.calls.filter(([, options]) => options?.method === 'POST')).toHaveLength(1);
  });

  it('shows the failed screen with an authored reason, then goes back to the form', async () => {
    await setup({ rows: '<div><div>error no_speech</div><div><p>Try a video where someone speaks.</p></div></div>' });
    fetch.mockImplementation(mockApi('failed-no_speech'));
    await submit('youtu.be/x');

    expect(block.dataset.state).toBe('failed');
    expect(block.querySelector('.realcheck-checker__failed__reason').textContent).toBe('Try a video where someone speaks.');
    block.querySelector('.realcheck-checker__again').click();
    expect(block.dataset.state).toBe('idle');
    expect(block.querySelector('input').value).toBe('youtu.be/x');
  });

  it('falls back to the API message for a reason it has no text for', async () => {
    await setup();
    fetch.mockImplementation(mockApi('failed-content_private'));
    await submit('youtu.be/x');
    expect(block.querySelector('.realcheck-checker__failed__reason').textContent).toBe("The API's message for content_private");
  });

  it('turns a refused platform back into the link error', async () => {
    await setup();
    fetch.mockImplementation(mockApi('http-422-platform_not_supported'));
    await submit('youtu.be/x');
    expect(block.dataset.state).toBe('idle');
    expect(block.querySelector('.realcheck-checker__error').textContent).toMatch(/isn’t supported/);
  });

  it('offers the app button instead of the QR code on a phone', async () => {
    await setup({ mobile: true });
    expect(block.querySelector('.realcheck-checker__qr')).toBeNull();
    const app = block.querySelector('.realcheck-checker__app');
    expect(app.href).toBe('https://app.example/default');
    expect(app.textContent).toBe('Try RealCheck Free');
  });

  it('leaves the app button out when the section has no link for the placeholder', async () => {
    await setup({ mobile: true, defaultLink: '' });
    expect(block.querySelector('.realcheck-checker__app')).toBeNull();
  });

  it('uses localized texts from the authored rows', async () => {
    await setup({ rows: '<div><div>Analyze</div><div><p>Analysieren</p></div></div><div><div>verdict 2</div><div><p>Wahrscheinlich verändert</p></div></div>' });
    expect(block.querySelector('.realcheck-checker__analyze').textContent).toBe('Analysieren');
    fetch.mockImplementation(mockApi('2-high'));
    await submit('youtu.be/x');
    expect(block.querySelector('.realcheck-checker__verdict__title').textContent).toBe('Wahrscheinlich verändert');
  });
});
