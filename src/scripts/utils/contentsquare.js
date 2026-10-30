/*
 * Minimal, fail-safe wrapper over the Contentsquare Events API.
 *
 * Contentsquare is loaded by Adobe Launch rules after consent, so window._uxa may be queued
 * but never processed. Pushing to the queue before (or entirely without) the tag is the
 * documented Contentsquare pattern: an in-memory array append, no network, no storage, no PII.
 *
 * Contentsquare keeps the first 40 page events and 40 distinct dynamic variable keys per
 * pageview and silently drops the rest, so prefer a fixed set of dynamic variable keys for
 * anything that has to stay accurate across a long-running session.
 */

const MAX_EVENT_NAME_LENGTH = 255;
const MAX_VARIABLE_KEY_LENGTH = 512;
const MAX_VARIABLE_VALUE_LENGTH = 255;
const MAX_VARIABLE_NUMBER = 4294967296;

function sanitizeText(value, maxLength) {
  // eslint-disable-next-line no-control-regex
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]+/g, ' ').trim().slice(0, maxLength);
}

/* eslint-disable no-underscore-dangle -- window._uxa is the Contentsquare queue */
function pushCommand(command) {
  try {
    // Never replace an existing _uxa: the tag swaps the array for its own object once loaded.
    if (!window._uxa) window._uxa = [];
    if (typeof window._uxa.push !== 'function') return false;

    window._uxa.push(command);
    return true;
  } catch {
    return false;
  }
}
/* eslint-enable no-underscore-dangle */

/**
 * Queues a Contentsquare page event.
 * @param {string} name Event name, truncated to 255 characters
 * @returns {boolean} True when the command was queued
 */
export function trackPageEvent(name) {
  const eventName = sanitizeText(name, MAX_EVENT_NAME_LENGTH);

  return eventName ? pushCommand(['trackPageEvent', eventName]) : false;
}

/**
 * Queues a Contentsquare dynamic variable. Repeating a key overwrites its previous value
 * instead of consuming another of the 40 distinct keys allowed per pageview.
 * @param {string} key Variable name, truncated to 512 characters
 * @param {string|number} value Variable value, truncated to 255 characters or clamped to
 * an integer between 0 and 4294967296
 * @returns {boolean} True when the command was queued
 */
export function trackDynamicVariable(key, value) {
  const variableKey = sanitizeText(key, MAX_VARIABLE_KEY_LENGTH);

  if (!variableKey) return false;

  let variableValue;

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return false;
    variableValue = Math.min(Math.max(Math.round(value), 0), MAX_VARIABLE_NUMBER);
  } else {
    variableValue = sanitizeText(value, MAX_VARIABLE_VALUE_LENGTH);
    if (!variableValue) return false;
  }

  return pushCommand(['trackDynamicVariable', { key: variableKey, value: variableValue }]);
}

/**
 * Queues several dynamic variables at once, skipping empty values. Variables pushed in the
 * same tick are batched by Contentsquare into a single request.
 * @param {Object} variables Dynamic variables keyed by name
 */
export function trackDynamicVariables(variables = {}) {
  Object.entries(variables || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') trackDynamicVariable(key, value);
  });
}
