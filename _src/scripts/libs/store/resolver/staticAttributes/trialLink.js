export const getTrials = async () => {
  const res = await fetch(`https://www.bitdefender.com/common/store-config/trial-links.json`);

  if (!res.ok) {
    return {};
  }

  return await res.json();
};

const applyTrial = async (option, duration) => {
  if (!duration) {
    return await option.getStoreUrl();
  }

  const trial = await getTrials();
  const locale = window.location.pathname.split('/')[1] || 'en';
  const optionRegex = [
    locale,
    duration,
    option.getId(),
    option.getPromotion(),
    option.getDevices(),
    option.getSubscription()
  ].map(k => String(k).trim()).join("|");

  const match = trial.data.find((row) => {
    const pattern = [
      row.locale,
      row.duration,
      row.product,
      row.campaign,
      row.devices,
      row.subscription
    ].map(k => k.trim()).join("\\|").replaceAll("*", ".*");

    return new RegExp(pattern, "i").test(optionRegex);
  });

  const optionBuyLink = new URL(await option.getStoreUrl());

  if (match?.buy_link) {
    const matchBuyLink = new URL(match.buy_link);

    optionBuyLink.searchParams.forEach((value, key) => {
      matchBuyLink.searchParams.set(value, key)
    })

    return matchBuyLink.href
  }

  return optionBuyLink.href;
};

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

  button.href = await applyTrial(option, element.dataset.storeTrialLink);
}