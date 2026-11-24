// src/scripts/utils/blocker-probe.js
var PROBE_CONTROL_PATH = "/_src/scripts/probe/control.js";
var PROBE_BAIT_PATH = "/_src/scripts/probe/adobe-analytics.js";
var PROBE_REQUEST = {
	cache: "no-store",
	credentials: "omit",
	keepalive: true,
	priority: "low"
};
/**
* Requests the control and bait files together. Fire and forget: a blocked bait rejects inside
* the browser and is swallowed, so nothing reaches the console or the page.
*/
function probeBlocker() {
	[PROBE_CONTROL_PATH, PROBE_BAIT_PATH].forEach((path) => {
		try {
			window.fetch(path, PROBE_REQUEST).catch(() => {});
		} catch {}
	});
}
export { PROBE_BAIT_PATH, PROBE_CONTROL_PATH, probeBlocker as default };
