import {ALL_FRANKLIN_DEV_SUBDOMAINS} from './lib-franklin.js';

async function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchData(url, body) {
  const resp = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
  const json = await resp.json();
  return json.result;
}

export default async function onSubmit(e) {
  try {
    const campaign = e.target.querySelector('input[name="campaign"]')?.value;
    const email = e.target.querySelector('input[type=email]')?.value;

    document.querySelector('.scan-error').classList.remove('show');
    document.querySelector('.form-container').classList.add('hide');
    document.querySelector('.scan-loading').classList.add('show');
    document.querySelector('.scan-loading h3:nth-child(1)').classList.add('show');

    await sleep(1000);

    document.querySelector('.scan-loading h3:nth-child(1)').classList.remove('show');
    document.querySelector('.scan-loading h3:nth-child(2)').classList.add('show');

    // const firstRequest = await fetchData('https://nimbus.bitdefender.net/lid/privacy_check', {
    //   id: 1,
    //   jsonrpc: '2.0',
    //   method: 'on_demand_scan',
    //   params: {
    //     app_id: 'com.bitdefender.vpn',
    //     type: 'emails',
    //     value: email,
    //   },
    // });

    await sleep(1000);

    // const secondRequest = await fetchData('https://nimbus.bitdefender.net/lid/privacy_check', {
    //   id: 2,
    //   jsonrpc: '2.0',
    //   method: 'get_on_demand_issues',
    //   params: { scan_id: firstRequest.scan_id },
    // });

    document.querySelector('.scan-loading h3:nth-child(2)').classList.remove('show');
    document.querySelector('.scan-loading h3:nth-child(3)').classList.add('show');

    await sleep(1000);

    const domain = ALL_FRANKLIN_DEV_SUBDOMAINS.some(subdomain => window.location.hostname.includes(subdomain)) ?
      'https://www.bitdefender.com' :
      '';
    const emarsysRequest = await fetchData(`${domain}/site/Store/offerSubscribe`, {
      email: email,
      flow: campaign
    });

    document.querySelector('.scan-loading h3:nth-child(3)').classList.remove('show');
    document.querySelector('.scan-loading').classList.remove('show');

    if (!emarsysRequest.success) {
      throw new Error('Scan error');
    }

    document.querySelectorAll('.scan-results').forEach((el) => el.classList.add('show'));

    if (secondRequest.total_count === 0) {
      document.querySelector('.scan-result-leaks').classList.remove('show');
      document.querySelector('.scan-result-zero').classList.add('show');
    } else {
      document.querySelector('.scan-result-leaks').classList.add('show');
      document.querySelector('.scan-result-zero').classList.remove('show');
      document.querySelector('.scan-result-leaks h3').textContent = document.querySelector('.scan-result-leaks h3').textContent.replace('{numberOfLeaks}', secondRequest.total_count);
    }
  } catch (error) {
    document.querySelector('.form-container').classList.remove('hide');
    document.querySelector('.scan-error').classList.add('show');
    document.querySelectorAll('.scan-loading, .scan-results').forEach((el) => el.classList.remove('show'));
  }
}
