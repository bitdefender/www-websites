// src/scripts/utils/contentsquare.js
var MAX_EVENT_NAME_LENGTH = 255;
var MAX_VARIABLE_KEY_LENGTH = 512;
var MAX_VARIABLE_VALUE_LENGTH = 255;
var MAX_VARIABLE_NUMBER = 4294967296;
function sanitizeText(value, maxLength) {
	return String(value ?? "").replace(/[\u0000-\u001F\u007F]+/g, " ").trim().slice(0, maxLength);
}
function pushCommand(command) {
	try {
		if (!window._uxa) window._uxa = [];
		if (typeof window._uxa.push !== "function") return false;
		window._uxa.push(command);
		return true;
	} catch {
		return false;
	}
}
/**
* Queues a Contentsquare page event.
* @param {string} name Event name, truncated to 255 characters
* @returns {boolean} True when the command was queued
*/
function trackPageEvent(name) {
	const eventName = sanitizeText(name, MAX_EVENT_NAME_LENGTH);
	return eventName ? pushCommand(["trackPageEvent", eventName]) : false;
}
/**
* Queues a Contentsquare dynamic variable. Repeating a key overwrites its previous value
* instead of consuming another of the 40 distinct keys allowed per pageview.
* @param {string} key Variable name, truncated to 512 characters
* @param {string|number} value Variable value, truncated to 255 characters or clamped to
* an integer between 0 and 4294967296
* @returns {boolean} True when the command was queued
*/
function trackDynamicVariable(key, value) {
	const variableKey = sanitizeText(key, MAX_VARIABLE_KEY_LENGTH);
	if (!variableKey) return false;
	let variableValue;
	if (typeof value === "number") {
		if (!Number.isFinite(value)) return false;
		variableValue = Math.min(Math.max(Math.round(value), 0), MAX_VARIABLE_NUMBER);
	} else {
		variableValue = sanitizeText(value, MAX_VARIABLE_VALUE_LENGTH);
		if (!variableValue) return false;
	}
	return pushCommand(["trackDynamicVariable", {
		key: variableKey,
		value: variableValue
	}]);
}
/**
* Queues several dynamic variables at once, skipping empty values. Variables pushed in the
* same tick are batched by Contentsquare into a single request.
* @param {Object} variables Dynamic variables keyed by name
*/
function trackDynamicVariables(variables = {}) {
	Object.entries(variables || {}).forEach(([key, value]) => {
		if (value !== void 0 && value !== null && value !== "") trackDynamicVariable(key, value);
	});
}
export { trackDynamicVariable, trackDynamicVariables, trackPageEvent };
