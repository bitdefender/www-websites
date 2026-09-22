import { loadScript } from '@repobit/dex-utils';
import { GLOBAL_EVENTS } from '../../scripts/utils/utils.js';
import stylingConfigurations from './style-config.json' with { type: 'json' };

function onAlloyReady(callback) {
  if (window.ADOBE_MC_EVENT_LOADED) callback();
  else document.addEventListener(GLOBAL_EVENTS.ADOBE_MC_LOADED, callback, { once: true });
}

export default async function decorate(block) {
  block.textContent = '';

  const mount = document.createElement('div');
  mount.id = 'brand-concierge-mount';
  block.appendChild(mount);

  await loadScript('https://experience.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js');

  onAlloyReady(() => {
    window.adobe.concierge.bootstrap({
      instanceName: 'alloy',
      stylingConfigurations,
      selector: '#brand-concierge-mount',
      stickySession: false,
    });
  });
}
