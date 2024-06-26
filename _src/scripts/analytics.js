/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
export async function updateUserConsentStatus(isConsentGiven) {
  // eslint-disable-next-line no-undef
  if (!alloy) {
    // eslint-disable-next-line no-console
    console.warn('Alloy is not initialized, cannot update consent status');
    return Promise.resolve();
  }

  const consentObject = {
    consent: [{
      standard: 'Adobe',
      version: '1.0',
      value: {
        general: isConsentGiven ? 'in' : 'out',
      },
    }],
  };

  // eslint-disable-next-line no-undef
  return alloy('setConsent', consentObject);
}

async function trackAnalyticsEvent(xdmObject, eventData) {
  // eslint-disable-next-line no-undef
  if (!alloy) {
    // eslint-disable-next-line no-console
    console.warn('Alloy is not initialized, cannot send analytics event');
    return Promise.resolve();
  }

  // eslint-disable-next-line no-undef
  return alloy('sendEvent', {
    documentUnloading: true,
    xdm: xdmObject,
    data: eventData,
  });
}

function generateAlloyConfigObject(targetDocument, datastreamConfig) {
  const { hostname } = targetDocument.location;
  return {
    debugEnabled: hostname.startsWith('localhost') || hostname.includes('--'),
    clickCollectionEnabled: true,
    defaultConsent: 'in',
    ...datastreamConfig,
  };
}

function generateAlloyInitializationScript() {
  return `!function(n,o){o.forEach(function(o){n[o]||((n.__alloyNS=n.__alloyNS||[]).push(o),n[o]=
  function(){var u=arguments;return new Promise(function(i,l){n[o].q.push([i,l,u])})},n[o].q=[])})}(window,["alloy"]);`;
}

function injectScriptIntoDocument(targetDocument, targetElement, scriptContent, scriptType = 'text/javascript') {
  const script = targetDocument.createElement('script');
  script.type = scriptType;
  script.innerHTML = scriptContent;
  targetElement.appendChild(script);
  return script;
}

export async function loadAnalytics(targetDocument, datastreamConfig) {
  injectScriptIntoDocument(document, document.body, generateAlloyInitializationScript());

  // eslint-disable-next-line no-undef
  if (!alloy) {
    // eslint-disable-next-line no-console
    console.warn('Alloy is not initialized, cannot setup analytics tracking');
    return;
  }

  import('../vendor/adobe/adobe-client-data-layer.min.js');
  import('../vendor/adobe/alloy.min.js');

  // eslint-disable-next-line no-undef
  alloy('configure', generateAlloyConfigObject(targetDocument, datastreamConfig));

  // Setup Adobe Data Layer if not already present
  if (typeof window.adobeDataLayer === 'undefined') {
    window.adobeDataLayer = [];
  }

  window.adobeDataLayer.push((dataLayer) => {
    dataLayer.addEventListener('adobeDataLayer:event', (event) => {
      trackAnalyticsEvent({}, event);
    });
  });
}
