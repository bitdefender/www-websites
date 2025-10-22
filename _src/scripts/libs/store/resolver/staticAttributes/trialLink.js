/**
 * @param {HTMLElement} element 
 * @param {import("../resolver").Context} context 
 */
export const resolve = async (element, { option }) => {
  if (element.dataset.storeTrialLink === undefined || !option) { return; }

  const button = element.nodeName === "A"
    ? element
    : element.querySelector("a");

  if (!button) { return; }

  button.href = option.getTrialLink(element.dataset.storeTrialLink);
}