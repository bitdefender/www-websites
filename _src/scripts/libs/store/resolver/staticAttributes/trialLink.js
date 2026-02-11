import { getMetadata } from '/scripts/lib-franklin.js';

const trialPeriod = getMetadata('trialbuylinks');

const getLocale = () => {
  const locale = (window.location.pathname.split('/')[1]?.split('-')[0] || '').toLowerCase();
  return !locale || locale === 'en' ? 'COM' : locale.toUpperCase();
};

export const getTrials = async () => {
  const res = await fetch('https://www.bitdefender.com/pages/triallinks.json');
  if (!res.ok) { };

  const { data = [] } = await res.json();

  return data;
};

const applyTrial = async (option, duration) => {
  const trial = await getTrials();
  if (!trial) return;

  const locale = getLocale();
  const optionKey = [
    option.getId(),
    option.getDevices(),
    duration,
    locale,
  ].map(k => String(k).trim().toLowerCase()).join("|");

  const match = trial.find((row) => {
    const rowKey = [
      row.product,
      row.devices,
      parseInt(row.duration, 10),
      row.locale,
    ].map(k => String(k).trim().toLowerCase()).join("|");

    return rowKey === optionKey;
  });

  const optionBuyLink = new URL(await option.buyLink);

  if (match?.buy_link) {
    const matchBuyLink = new URL(match.buy_link);

    optionBuyLink.searchParams.forEach((value, key) => {
      if (['LANG', 'CURRENCY', 'DCURRENCY', 'COUPON'].includes(key)) {
        matchBuyLink.searchParams.set(key, value);
      }
    });
    matchBuyLink.searchParams.set('SRC', window.location.origin + window.location.pathname);

    return matchBuyLink.href
  }

  return optionBuyLink.href;
};

/**
 * @param {HTMLElement} element 
 * @param {import("../resolver").Context} context 
 */
export const resolve = async (element, { option }) => {
  if (!trialPeriod) return;

  const button = element.nodeName === "A"
    ? element
    : element.querySelector("a");

  if (!button) { return; }

  button.href = await applyTrial(option, trialPeriod);
}