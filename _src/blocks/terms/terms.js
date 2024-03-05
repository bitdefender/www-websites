window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
  bubbles: true,
  composed: true, // This allows the event to cross the shadow DOM boundary
});
