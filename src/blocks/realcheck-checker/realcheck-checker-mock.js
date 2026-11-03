/*
 * A stand-in for the RealCheck API, loaded only with `?realcheck-mock=<scenario>`, so every
 * screen can be seen and tested before the proxy exists. It answers like the contract:
 * 202 on submit, then the check object, one status further on each poll.
 *
 * Scenarios: `<verdict>-<risk>` (verdict 0, 1 or 2; risk high, medium, low, benign or none),
 * `failed-<error code>` (e.g. failed-no_speech), `http-<status>-<error code>`
 * (e.g. http-422-platform_not_supported), `slow` (never finishes).
 */
const THUMBNAIL = 'https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg';
const TITLE = 'Big Buck Bunny 60fps 4K - Official Blender Foundation Short Film';
const STATUSES = ['queued', 'downloading', 'analyzing', 'intent'];

const json = (status, body, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Retry-After': '1', ...headers },
});

export default function mockApi(scenario = '2-high') {
  const checks = new Map();

  return async (url, { method = 'GET', body } = {}) => {
    const http = scenario.match(/^http-(\d{3})-(\w+)$/);
    if (method === 'POST') {
      if (http) {
        const error = { code: http[2], message: http[2], retryable: false };
        return json(Number(http[1]), { error });
      }
      const id = `mock_${Date.now()}`;
      checks.set(id, { polls: 0, url: JSON.parse(body).url });
      return json(202, {
        id, type: 'social_media', status: 'queued', created_at: new Date().toISOString(), media: { title: null, thumbnail_url: null }, result: null, error: null,
      });
    }

    const id = decodeURIComponent(url.split('/').pop());
    const check = checks.get(id);
    if (!check) return json(404, { error: { code: 'check_not_found', message: 'Not found', retryable: false } });
    check.polls += 1;

    const running = scenario === 'slow' || check.polls < STATUSES.length;
    const status = running ? STATUSES[Math.min(check.polls, STATUSES.length - 1)] : null;
    const media = check.polls > 1
      ? { title: TITLE, thumbnail_url: THUMBNAIL }
      : { title: null, thumbnail_url: null };
    const base = {
      id, type: 'social_media', created_at: new Date().toISOString(), media, result: null, error: null,
    };
    if (running) return json(200, { ...base, status });

    const failed = scenario.match(/^failed-(\w+)$/);
    if (failed) {
      return json(200, {
        ...base,
        status: 'failed',
        error: { code: failed[1], message: `The API's message for ${failed[1]}`, retryable: false },
      }, { 'Retry-After': '' });
    }
    const [verdict, risk] = scenario.split('-');
    return json(200, {
      ...base,
      status: 'completed',
      result: { verdict: Number(verdict) || 0, risk_level: risk === 'none' ? null : risk },
    }, { 'Retry-After': '' });
  };
}
