import { productAliases } from '../../scripts/scripts.js';
import { updateProductsList } from '../../scripts/utils.js';

export default function decorate(block) {
  const metaData = block.closest('.section').dataset;
  const {
    products, priceType,
  } = metaData;

  const productsAsList = products && products.split(',');
  if (productsAsList.length) {
    productsAsList.forEach((prod) => updateProductsList(prod));

    [...block.children].forEach((prod, key) => {
      const [greenTag, title, blueTag, subtitle, saveOldPrice, price, billed, buyLink, underBuyLink, benefitsLists] = [...prod.querySelectorAll('tbody > tr')];

      const [prodName, prodUsers, prodYears] = productsAsList[key].split('/');
      const onSelectorClass = `${productAliases(prodName)}-${prodUsers}${prodYears}`;
      const buyLinkText = buyLink.innerText.trim();

      [...block.children][key].innerHTML = '';

      // if we have vpn
      if (billed.innerText.includes('[vpn_box]')) {
        // add VPN
        updateProductsList('vpn/10/1');

        const billedUL = billed.querySelector('ul');
        /* eslint-disable-next-line no-unused-vars */
        const [alias, text1, text2] = billedUL.querySelectorAll('li');

        const modifiedText1 = text1.innerHTML.replace('0', '<span class="newprice-vpn-101"></span>');
        const modifiedText2 = text2.innerHTML.replace('0', '<span class="oldprice-vpn-101"></span>').replace('0%', '<span class="percent-vpn-101"></span>');

        let labelId = `checkboxVPN-${onSelectorClass}`;
        if (document.getElementById(labelId)) {
          labelId = `${labelId}-1`;
        }

        const vpnContent = `
          <input id="${labelId}" class="${labelId} checkboxVPN" type="checkbox" value="">
          <label for="${labelId}">
            <span>${modifiedText1} ${modifiedText2}</span>
          </label>
        `;

        const vpnBox = document.createElement('div');
        vpnBox.classList = `vpn_box prodload prodload-${onSelectorClass}`;
        vpnBox.innerHTML = `<div>${vpnContent}</div>`;

        billedUL.before(vpnBox);
        billedUL.remove();
      }

      const featuresSet = benefitsLists.querySelectorAll('table');
      const featureList = Array.from(featuresSet).map((table) => {
        const trList = Array.from(table.querySelectorAll('tr'));

        const liString = trList.map((tr) => {
          const tdList = Array.from(tr.querySelectorAll('td'));

          // Extract the content of the first <td> to be placed outside the <li>
          let firstTdContent = tdList.length > 0 && tdList[0].textContent.trim() !== '' ? `${tdList[0].innerHTML}` : '';

          // Extract the content of the second <td> (if present) inside a <span>
          const secondTdContent = tdList.length > 1 && tdList[1].textContent.trim() !== '' ? `<span>${tdList[1].innerHTML}</span>` : '';

          // Create the <li> combining the first and second td content
          let liClass = '';
          if (firstTdContent === '') {
            liClass += 'd-none';
          }

          // &lt reffers to '<' character
          if (firstTdContent.indexOf('&lt;-') !== -1 || firstTdContent.indexOf('&lt;') !== -1) {
            liClass += ' has_arrow';
            firstTdContent = firstTdContent.replace('&lt;-', '');
          }

          // &gt reffers to '>' character
          if (firstTdContent.indexOf('-&gt;') !== -1 || firstTdContent.indexOf('&gt;') !== -1) {
            liClass += ' has_arrow_right';
            firstTdContent = firstTdContent.replace('-&gt;', '<span class="arrow-right"></span>');
          }

          const liContent = `<li class="${liClass}">${firstTdContent}${secondTdContent}</li>`;

          return liContent;
        }).join('');

        return `<ul>${liString}</ul>`;
      });

      if (title.innerHTML.indexOf('href') !== -1) {
        title.innerHTML = `<a href="#" title="${title.innerText}" class="buylink-${onSelectorClass} await-loader prodload prodload-${onSelectorClass}">${title.querySelector('tr a').innerHTML}</a>`;
      }

      block.innerHTML += `
        <div class="prod_box${greenTag.innerText.trim() && ' hasGreenTag'}">
          <div class="inner_prod_box">
            ${greenTag.innerText.trim() ? `<div class="greenTag2">${greenTag.innerText.trim()}</div>` : ''}
            ${title.innerText.trim() ? `<h2>${title.innerHTML}</h2>` : ''}
            ${blueTag.innerText.trim() ? `<div class="blueTag"><div>${blueTag.innerHTML.trim()}</div></div>` : ''}
            ${subtitle.innerText.trim() ? `<p class="subtitle">${subtitle.innerText.trim()}</p>` : ''}
            <hr />

            ${saveOldPrice.innerText.trim() && `<div class="save_price_box await-loader prodload prodload-${onSelectorClass}"">
              <span class="prod-oldprice oldprice-${onSelectorClass}"></span>
              <strong class="prod-percent">
                ${Array.from(saveOldPrice.querySelectorAll('td'))[1].innerText.replace('0%', `<span class="percent-${onSelectorClass}"></span>`)}
              </strong>
            </div>`}

            ${price.innerText.trim() && `<div class="prices_box await-loader prodload prodload-${onSelectorClass}">
              <span class="prod-newprice newprice-${onSelectorClass}${priceType ? `-${priceType}` : ''}"></span>
              <sup>${price.innerText.trim().replace('0', '')}<sup>
            </div>`}

            ${billed ? `<div class="billed">${billed.innerHTML.replace('0', `<span class="newprice-${onSelectorClass}"></span>`)}</div>` : ''}

            ${buyLinkText && `<div class="buy-btn">
              <a class="red-buy-button buylink-${onSelectorClass} await-loader prodload prodload-${onSelectorClass}" href="#" title="Bitdefender">${buyLinkText.includes('0%') ? buyLinkText.replace('0%', `<span class="percent-${onSelectorClass}"></span>`) : buyLinkText}
              </a>
            </div>`}

            ${underBuyLink.innerText.trim() ? `<div class="underBuyLink">${underBuyLink.innerHTML.trim()}</div>` : ''}
            <hr />
            ${benefitsLists.innerText.trim() ? `<div class="benefitsLists">${featureList}</div>` : ''}
          </div>
        </div>`;
    });
  } else {
    block.innerHTML = `
    <div class="container-fluid">
      add some products
    </div>`;
  }

  // get all subtitles
  const subtitles = block.querySelectorAll('.subtitle');

  // detect if at least 1 has more words
  const hasMoreWords = Array.from(subtitles).some((subtitle) => {
    const wordCount = subtitle.textContent.trim().split(/\s+/).length;
    return wordCount > 13;
  });

  // set specific class for all
  if (hasMoreWords) {
    subtitles.forEach((subtitle) => {
      subtitle.classList.add('fixed_height');
    });
  }
}
