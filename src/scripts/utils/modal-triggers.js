/*
 * Fragment links (a.button.modal) open their fragment as a modal instead of navigating to it.
 * Their href moves to `location`, so the fragment is not a page to open in a new tab; a
 * design-system button gets the same `location` from pointButtonAt (utils.js).
 */

// a fragment link decorateModalTriggers turned into a button, or a bd-button pointed at one
export const MODAL_TRIGGER = 'a.button.modal[location], bd-button[location]';

/**
 * Turns the fragment links under root into buttons that open a dialog. Without its href a
 * link is neither focusable nor a control to assistive tech and AI agents, so it gets the
 * role, the tab stop and, through listenForModalTriggers, the keys of a button. Calling it
 * again on the same links changes nothing.
 * @param {ParentNode} root
 */
export function decorateModalTriggers(root) {
  root.querySelectorAll('a.button.modal[href]').forEach((link) => {
    link.setAttribute('location', link.getAttribute('href'));
    link.removeAttribute('href');
    link.setAttribute('role', 'button');
    link.setAttribute('aria-haspopup', 'dialog');
    link.tabIndex = 0;
  });
}

const listening = new WeakSet();

/**
 * Opens the fragment of the modal trigger a click, Enter or Space lands on. It listens on the
 * document, so a trigger opens exactly once however it got into the page: decorated twice,
 * or copied by innerHTML (cards, Target offers), which drops element listeners. A click in a
 * bd-button's shadow root reaches the document from its host. Only a link needs Enter and
 * Space: bd-button renders a native <button>, which turns them into a click itself.
 * @param {(path: string, keepModal: boolean) => void} open opens the fragment at path
 * @param {Document} [doc]
 */
export function listenForModalTriggers(open, doc = document) {
  if (listening.has(doc)) return;
  listening.add(doc);

  const onTrigger = (e) => {
    if (e.defaultPrevented) return;
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    const trigger = e.target.closest?.(MODAL_TRIGGER);
    if (!trigger || (e.type === 'keydown' && trigger.tagName !== 'A')) return;
    e.preventDefault();
    open(trigger.getAttribute('location'), trigger.dataset.stopAutomaticModalRefresh === 'true');
  };
  doc.addEventListener('click', onTrigger);
  doc.addEventListener('keydown', onTrigger);
}
