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

export async function loadAnalytics(targetDocument, datastreamConfig) {
  import('../vendor/adobe/adobe-client-data-layer.min.js');

  // Setup Adobe Data Layer if not already present
  if (typeof window.adobeDataLayer === 'undefined') {
    window.adobeDataLayer = [];
  }
}
