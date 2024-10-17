export default class ZuoraNLClass {
  static async fetchCampaignName() {
    const jsonFilePath = 'https://www.bitdefender.com/pages/fragment-collection/zuoracampaign.json';

    const resp = await fetch(jsonFilePath);
    if (!resp.ok) {
      console.error(`Failed to fetch data. Status: ${resp.status}`);
      return '';
    }
    const data = await resp.json();

    return data.data[0].CAMPAIGN_NAME;
  }

  static monthlyProducts = ['psm', 'pspm', 'vpn-monthly', 'passm', 'pass_spm', 'dipm', 'vsbm'];

  // this products come with device_no set differently from the init-selector api where they are set to 1
  static wrongDeviceNumber = ['bms', 'mobile', 'ios', 'mobileios', 'psm', 'passm'];

  static productId = {
    av: 'com.bitdefender.cl.av',
    is: 'com.bitdefender.cl.is',
    tsmd: 'com.bitdefender.cl.tsmd',
    fp: 'com.bitdefender.fp',
    ps: 'com.bitdefender.premiumsecurity',
    psm: 'com.bitdefender.premiumsecurity',
    psp: 'com.bitdefender.premiumsecurityplus',
    pspm: 'com.bitdefender.premiumsecurityplus',
    soho: 'com.bitdefender.soho',
    mac: 'com.bitdefender.avformac',
    vpn: 'com.bitdefender.vpn',
    'vpn-monthly': 'com.bitdefender.vpn',
    pass: 'com.bitdefender.passwordmanager',
    passm: 'com.bitdefender.passwordmanager',
    pass_sp: 'com.bitdefender.passwordmanager',
    pass_spm: 'com.bitdefender.passwordmanager',
    bms: 'com.bitdefender.bms',
    mobile: 'com.bitdefender.bms',
    ios: 'com.bitdefender.iosprotection',
    mobileios: 'com.bitdefender.iosprotection',
    dip: 'com.bitdefender.dataprivacy',
    dipm: 'com.bitdefender.dataprivacy',
    vsb: 'com.bitdefender.vsb',
    vsbm: 'com.bitdefender.vsb',

    // dlp
    avpm: 'com.bitdefender.cl.avplus.v2',
    ts_i: 'com.bitdefender.tsmd.v2',
    ts_f: 'com.bitdefender.tsmd.v2',
    ps_i: 'com.bitdefender.premiumsecurity.v2',
    ps_f: 'com.bitdefender.premiumsecurity.v2',
    us_i: 'com.bitdefender.ultimatesecurityeu.v2',
    us_i_m: 'com.bitdefender.ultimatesecurityeu.v2',
    us_f: 'com.bitdefender.ultimatesecurityeu.v2',
    us_f_m: 'com.bitdefender.ultimatesecurityeu.v2',
    us_pf: 'com.bitdefender.ultimatesecurityeu.v2',
    us_pf_m: 'com.bitdefender.ultimatesecurityeu.v2',
    us_pi: 'com.bitdefender.ultimatesecurityplusus.v2',
    us_pi_m: 'com.bitdefender.ultimatesecurityplusus.v2',
    us_pie: 'com.bitdefender.ultimatesecurityplusus.v2',
    us_pie_m: 'com.bitdefender.ultimatesecurityplusus.v2',
    us_pfe: 'com.bitdefender.ultimatesecurityplusus.v2',
    us_pfe_m: 'com.bitdefender.ultimatesecurityplusus.v2',
  };

  static names = {
    pass: 'Bitdefender Password Manager',
    pass_sp: 'Bitdefender Password Manager Shared Plan',
    passm: 'Bitdefender Password Manager',
    pass_spm: 'Bitdefender Password Manager Shared Plan',
  };

  static zuoraConfig = {
    cartUrl: 'https://checkout.bitdefender.com',
    key: 'bb22f980-fa19-11ed-b443-87a99951e6d5', // prod
    endpoint: 'https://checkout-service.bitdefender.com',
    // endpoint: 'https://checkout-service-mars.checkout-app.nmbapp.net', // sandbox
  };

  static config(key) {
    return {
      key: key || this.zuoraConfig.key,
      country: 'NL',
      language: 'nl_NL',
      debug: false,
      request_timeout: 15000, // default value if not set 3500
      default_scenario: 'www.checkout.v1',
      disable_auto_generated_new_session: false,
      return_url: document.referrer ? document.referrer : window.location.href,
      central: true,
    };
  }

  static async getProductVariations(productId, campaign) {
    const endpoint = new URL('/v1/info/variations/price', this.zuoraConfig.endpoint);
    endpoint.searchParams.set('product_id', productId);
    if (campaign) endpoint.searchParams.set('campaign', campaign);
    endpoint.searchParams.set('country_code', 'NL');

    try {
      const response = await fetch(
        endpoint.href,
        {
          method: 'GET',
          headers: {
            'X-Public-Key': this.zuoraConfig.key,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getProductVariationsPrice(product, campaign) {
    const prod = product.trim().split('/');
    const id = prod[0];
    const devicesNo = prod[1];
    const yearsNo = prod[2];

    let payload = (await this.getProductVariations(this.productId[id], campaign))?.payload;

    if (!payload || payload.length === 0) {
      return null;
    }

    /**
     * this rules splits one product into multiple products
     * for example com.bitdefender.passwordmanager maps 2 products
     * Password Manager and Password Manager Shared Plan
     */
    if (this.names[id]) {
      payload = payload.filter((item) => item.name === this.names[id]);
    }

    window.StoreProducts.product[id] = {
      product_alias: id,
      product_id: this.productId[id],
      product_name: payload[0].name,
      variations: {},
    };

    payload.forEach((period) => {
      let billingPeriod;
      switch (period.billing_period) {
        case 'Month':
          billingPeriod = 0;
          break;
        case 'Annual':
          billingPeriod = 1;
          break;
        case 'Two_Years':
          billingPeriod = 2;
          break;
        case 'Three_Years':
          billingPeriod = 3;
          break;
        case 'Five_Years':
          billingPeriod = 5;
          break;
        default:
          billingPeriod = 10;
      }

      // Non monthly product (e.g 'tsmd') and monthly billing period => fast exit
      // same thing if we have a monthly product (e.g 'psm') and non monthly billing period
      if ((this.monthlyProducts.indexOf(id) === -1 && billingPeriod === 0) || (this.monthlyProducts.indexOf(id) !== -1 && billingPeriod !== 0)) {
        return;
      }

      // make sure that the billing period is the one we are searching for
      if (Number(yearsNo) !== billingPeriod && billingPeriod !== 0) {
        return;
      }

      if (this.monthlyProducts.indexOf(id) !== -1) {
        billingPeriod = 1;
      }

      // buylink:
      const windowURL = new URL(window.location.href);
      const zuoraCart = new URL('/index.html:step=cart?theme=light', this.zuoraConfig.cartUrl);

      zuoraCart.searchParams.set('campaign', campaign);
      if (windowURL.searchParams.has('lang')) {
        zuoraCart.searchParams.set('language', windowURL.searchParams.get('lang'));
      }
      if (windowURL.searchParams.has('language')) {
        zuoraCart.searchParams.set('language', windowURL.searchParams.get('language'));
      }
      if (windowURL.searchParams.has('event')) {
        zuoraCart.searchParams.set('event', windowURL.searchParams.get('event'));
      }
      if (windowURL.searchParams.has('channel')) {
        zuoraCart.searchParams.set('channel', windowURL.searchParams.get('channel'));
      }
      zuoraCart.searchParams.set('product_id', this.productId[id]);
      zuoraCart.searchParams.set('payment_period', this.monthlyProducts.includes(id) ? `${devicesNo}d1m` : `${devicesNo}d${yearsNo}y`);
      zuoraCart.searchParams.set('country', 'NL');
      zuoraCart.searchParams.set('language', 'nl_NL');
      zuoraCart.searchParams.set('client', '8f768650-6915-11ed-83e3-e514e761ac46');

      /* if (bundle) {
          zuoraCart.searchParams.set("bundle_id", this.productId);
          zuoraCart.searchParams.set("bundle_payment_period", monthlyProducts[bundle.id]
            ? `${bundle.getDevices()}d1m`
            : `${bundle.getDevices()}d${bundle.getSubscription("years")}y`);
        } */

      const pricing = {};
      period.pricing.forEach((item) => {
        if (item.devices_no === 50) item.devices_no = 1;
        if (item.devices_no === Number(devicesNo)) {
          pricing.total = item.price;
          pricing.discount = item.discount;
          pricing.price = item.total;
        }
      });

      window.StoreProducts.product[id] = {
        selected_users: devicesNo,
        selected_years: yearsNo,
        selected_variation: {
          product_id: id,
          region_id: 22,
          variation_id: 0,
          platform_id: 16,
          price: pricing.total,
          variation: {
            years: yearsNo,
          },
          currency_label: '€',
          currency_iso: 'EUR',
          discount: {
            discounted_price: pricing.price,
            discount_value: pricing.discount,
          },
          promotion: campaign,
        },
        buy_link: zuoraCart.href,
        config: {
          product_id: id,
          name: payload.name,
          full_price_class: `oldprice-${id}`,
          discounted_price_class: `newprice-${id}`,
          price_class: `price-${id}`,
          buy_class: `buylink-${id}`,
          selected_users: devicesNo,
          selected_years: yearsNo,
          users_class: `users_${id}_fake`,
          years_class: `years_${id}_fake`,
        },
      };
    });

    return window.StoreProducts.product[id];
  }

  static async loadProduct(id, campaignParam = '') {
    window.StoreProducts = window.StoreProducts || [];
    window.StoreProducts.product = window.StoreProducts.product || {};

    try {
      let coupon = campaignParam;
      if (!coupon) coupon = await this.fetchCampaignName();
      return this.getProductVariationsPrice(id, coupon);
    } catch (error) {
      console.error('loadProduct error:', error);
    }

    return this.getProductVariationsPrice(id);
  }
}
