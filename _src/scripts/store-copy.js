/* esm.sh - @repobit/dex-store@1.1.1 */
var y = class {
    product;
    price;
    discountedPrice;
    devices;
    subscription;
    currency;
    buyLink;
    trialLink;
    discount;
    bundle;
    constructor(t) {
        this.product = t.product,
        this.price = {
            value: t.price,
            monthly: Number(Number(t.price / t.subscription).toFixed(2))
        },
        this.discountedPrice = {
            value: t.discountedPrice,
            monthly: Number(Number(t.discountedPrice / t.subscription).toFixed(2))
        },
        this.devices = t.devices,
        this.subscription = t.subscription,
        this.currency = t.product.getCurrency(),
        this.buyLink = t.buyLink,
        this.trialLink = t.trialLink,
        this.discount = {
            value: Math.round((t.price - t.discountedPrice + Number.EPSILON) * 100) / 100,
            percentage: Math.round((t.price - t.discountedPrice) / t.price * 100),
            monthly: {
                value: Math.round((t.price - t.discountedPrice + Number.EPSILON) * 100 / t.subscription) / 100,
                percentage: Math.round((t.price - t.discountedPrice) / t.price * 100 / t.subscription)
            }
        },
        this.bundle = t.bundle || []
    }
    getProduct() {
        return this.product
    }
    getVariation() {
        return `${this.devices}-${this.subscription}`
    }
    getPrice(t) {
        let {monthly: e=!1, currency: i=!0} = t ?? {}
          , r = e ? this.price.monthly : this.price.value;
        return i ? this.product.getStore().formatPrice({
            price: r,
            currency: this.currency
        }) : r
    }
    getDiscountedPrice(t) {
        let {monthly: e=!1, currency: i=!0} = t ?? {}
          , r = e ? this.discountedPrice.monthly : this.discountedPrice.value;
        return i ? this.product.getStore().formatPrice({
            price: r,
            currency: this.currency
        }) : r
    }
    getDiscount(t) {
        let {percentage: e=!1, symbol: i=!0, monthly: r=!1} = t ?? {}
          , n = r ? this.discount.monthly : this.discount
          , s = e ? n.percentage : n.value;
        return i ? e ? `${s}%` : this.product.getStore().formatPrice({
            price: s,
            currency: this.currency
        }) : s
    }
    getBuyLink() {
        return this.buyLink
    }
    getDevices() {
        return this.devices
    }
    getSubscription() {
        return this.subscription
    }
    getBundle() {
        return this.bundle
    }
    getTrialLink() {
        return this.trialLink
    }
    async getOption(t) {
        if (!t)
            return;
        let e = this.product.getDevices()
          , i = this.product.getSubscriptions()
          , r = (p, v, w) => {
            if (w === void 0)
                return p;
            {
                let D = Number(w);
                return v.findIndex(k => k === D)
            }
        }
          , n = e.values.findIndex(p => p === this.devices)
          , s = i.values.findIndex(p => p === this.subscription)
          , o = r(n, e.values, t.devices)
          , c = r(s, i.values, t.subscription)
          , u = e.values[o]
          , d = i.values[c];
        if (o < 0 || c < 0 || u > e.max || d > i.max || u < e.min || d < e.min)
            return;
        let a = await Promise.all(this.bundle.map(async p => {
            let v = await p.option.getOption({
                devices: p.devicesFixed ? p.option.getDevices() : t.devices,
                subscription: p.subscriptionFixed ? p.option.getSubscription() : t.subscription
            });
            return {
                ...p,
                option: v
            }
        }
        ))
          , h = p => p.option != null;
        if (a.every(h))
            return this.product.getOption({
                devices: u,
                subscription: d,
                bundle: a
            })
    }
    async nextOption(t) {
        if (!t)
            return;
        let e = this.product.getDevices()
          , i = this.product.getSubscriptions()
          , r = (a, h, p) => {
            if (p === void 0)
                return a;
            if (p === "next")
                return a + 1;
            if (p === "prev")
                return a - 1;
            {
                let v = a + Number(p);
                return h.findIndex(w => w === v)
            }
        }
          , n = e.values.findIndex(a => a === this.devices)
          , s = i.values.findIndex(a => a === this.subscription)
          , o = r(n, e.values, t.devices)
          , c = r(s, i.values, t.subscription)
          , u = e.values[o]
          , d = i.values[c];
        if (!(o < 0 || c < 0 || u > e.max || d > i.max || u < e.min || d < e.min))
            return this.getOption({
                devices: u,
                subscription: d
            })
    }
    async toogleBundle(t) {
        let e = n => `${n.getProduct().getId()}${n.getProduct().getCampaign()}${n.getDevices()}${n.getSubscription()}`, i = this.bundle.findIndex(n => e(n.option) === e(t.option)), r;
        return i !== -1 ? r = this.bundle.toSpliced(i, 1) : r = this.bundle.toSpliced(0, 0, t),
        this.product.getOption({
            devices: this.devices,
            subscription: this.subscription,
            bundle: r
        })
    }
    async switchProduct(t) {
        return (await this.product.getStore().getProduct(t))?.getOption({
            devices: this.devices,
            subscription: this.subscription,
            bundle: this.bundle
        })
    }
}
;
var N = class m {
    mapper;
    constructor(t) {
        this.mapper = t
    }
    static async create() {
        let t = await this.getMappings();
        return new m(t)
    }
    async adaptTo(t) {
        let {id: e, devices: i, subscription: r} = t
          , n = {
            id: e,
            devices: i,
            subscription: r
        };
        if (!this.mapper)
            return n;
        let s = this.mapper.get(e);
        if (s)
            n.id = s.id;
        else
            return n;
        if (!s.options) {
            let o = s.sourceId || e;
            s.options = this.getMappingForId(o)
        }
        if (i && r) {
            let o = await s.options;
            if (o) {
                let c = o[i]?.[r];
                c && (n.devices = c.devices,
                n.subscription = c.subscription)
            }
        }
        return n
    }
    static async getMappings() {
        try {
            let t = await fetch("https://www.bitdefender.com/common/store-config/init-to-vlaicu-mappings.json?sheet=id-mappings");
            if (!t.ok)
                return console.error(`${t.status}: ${t.statusText}`),
                null;
            let e = await t.json()
              , i = new Map;
            for (let r of e.data) {
                let {from: n, to: s} = r;
                i.set(n, {
                    id: s,
                    sourceId: n
                }),
                i.set(s, {
                    id: s,
                    sourceId: n
                })
            }
            return i
        } catch (t) {
            return console.error(t),
            null
        }
    }
    async getMappingForId(t) {
        try {
            let e = await fetch(`https://www.bitdefender.com/common/store-config/init-to-vlaicu-mappings.json?sheet=${t}`);
            if (!e.ok)
                return console.error(`${e.status}: ${e.statusText}`),
                null;
            let i = await e.json()
              , r = {};
            for (let n of i.data) {
                let s = Number(n.fromDevices)
                  , o = Number(n.fromSubscription)
                  , c = Number(n.toDevices)
                  , u = Number(n.toSubscription);
                r[s] || (r[s] = {}),
                r[s][o] = {
                    devices: c,
                    subscription: u
                }
            }
            return r
        } catch (e) {
            return console.error(e),
            null
        }
    }
}
;
var L = ({price: m, currency: t, locale: e="en-us"}) => m ? t ? new Intl.NumberFormat(e,{
    style: "currency",
    currency: t,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
}).format(m) : m : "";
var S = ["ignore", "none", "0"]
  , b = class {
    store;
    constructor({store: t}) {
        this.store = t
    }
    async getProduct(t) {
        let e = await this.fetch(t);
        if (e)
            return e = await this.applyOverrides(e),
            e = await this.applyTrialLinks(e),
            e = await this.applyTransformers(e),
            e.product ? new x({
                ...e.product,
                store: this.store
            }) : e.product
    }
    async applyOverrides(t) {
        let {overrides: e, product: i} = t;
        if (!i)
            return t;
        let r = this.store[l]?.[i.id];
        if (!r || !e.oldCampaign)
            return t;
        let n = r[e.oldCampaign]?.options;
        if (!n)
            return t;
        for (let[s,o] of Object.entries(n)) {
            let c = i.options.get(s);
            o ? i.options.set(s, {
                ...c,
                ...o
            }) : i.options.delete(s)
        }
        return t
    }
    async applyTransformers(t) {
        let {product: e} = t;
        if (!e)
            return t;
        for (let i of e.options.values())
            this.store[P]?.option?.buyLink && (i.buyLink = await this.store[P]?.option?.buyLink(i.buyLink));
        return t
    }
    async applyTrialLinks(t) {
        let {overrides: e, product: i} = t;
        if (!i)
            return t;
        let r = this.store[I]?.[i.id];
        if (!r)
            return t;
        let n = r[e.newCampaign || ""] || r.default;
        if (!n)
            return t;
        for (let[s,o] of Object.entries(n)) {
            let c = i.options.get(s);
            c && (c.trialLink = o)
        }
        return t
    }
    async getCampaign(t, e) {
        return !e && this.store[l]?.[t]?.default?.campaign ? this.store[l]?.[t].default.campaign : e && this.store[l]?.[t]?.[e]?.campaign ? this.store[l]?.[t]?.[e].campaign : await this.store[E]({
            id: t,
            campaign: e
        })
    }
    async adaptTo(t) {
        return await (await this.store[f]).adaptTo(t)
    }
}
;
var F = new Map([["gb", "uk"], ["ch", "de"], ["at", "de"], ["us", "us"], ["mx", "en"], ["nz", "au"]])
  , C = m => F.get(m) ?? m
  , T = class extends b {
    country;
    language;
    constructor(t) {
        super(t);
        let[e,i] = this.store[g].split("-");
        this.language = e,
        this.country = C(i)
    }
    async fetch({id: t, campaign: e}) {
        let i = (await this.adaptTo({
            id: t
        })).id, r = await this.getCampaign(i, e), n = this.buildPayload(t, r), s = this.buildApiURL(), o;
        try {
            let a = new FormData;
            a.append("data", n);
            let h = await fetch(s.href, {
                method: "post",
                body: a
            });
            if (!h.ok || (o = await h.json(),
            !o.data.product.variations || Object.keys(o.data.product.variations).length === 0))
                return
        } catch (a) {
            console.error("Failed to fetch product:", a);
            return
        }
        let {options: c, platformId: u, currency: d} = await this.processVariations(t, o.data.product.variations, r);
        return {
            overrides: {
                oldCampaign: e,
                newCampaign: r
            },
            product: {
                id: i,
                name: o.data.product.product_name,
                campaign: r,
                currency: d,
                platformId: u,
                options: c
            }
        }
    }
    buildPayload(t, e) {
        let i = {
            country_code: this.country
        };
        return S.includes(String(e)) ? i.ignore_promotions = !0 : i.extra_params = {
            pid: e || null
        },
        JSON.stringify({
            ev: 1,
            product_id: t,
            config: i
        })
    }
    buildApiURL() {
        let t = new URL("https://www.bitdefender.com/site/Store/ajax");
        return t.searchParams.set("force_country", this.country),
        t
    }
    async processVariations(t, e, i) {
        let r = new Map
          , n = ""
          , s = "";
        for (let[o,c] of Object.entries(e))
            for (let[u,d] of Object.entries(c)) {
                let a = await this.adaptTo({
                    id: t,
                    subscription: Number(u),
                    devices: Number(o)
                })
                  , h = {
                    devices: a.devices,
                    subscription: a.subscription,
                    price: Number(d.price),
                    discountedPrice: Number(d.discount?.discounted_price || 0),
                    buyLink: "",
                    bundle: []
                };
                n = d.platform_product_id,
                s = d.currency_iso,
                i = i || d.promotion,
                h.buyLink = this.buildBuyLink(t, h, d, i),
                r.set(`${a.devices}-${a.subscription}`, h)
            }
        return {
            options: r,
            platformId: n,
            currency: s
        }
    }
    buildBuyLink(t, e, i, r) {
        let n = ["buy", t, e.devices, e.subscription].join("/")
          , s = r ? `pid.${r}` : ""
          , o = new URL(`https://www.bitdefender.com/site/Store/${n}/${s}`);
        return o.searchParams.set("CURRENCY", i.currency_iso),
        o.searchParams.set("DCURRENCY", i.currency_iso),
        o.searchParams.set("CART", "1"),
        o.searchParams.set("CARD", "2"),
        o.searchParams.set("SHORT_FORM", "1"),
        o.searchParams.set("LANG", this.language),
        o.searchParams.set("force_country", this.country),
        o.href
    }
}
;
var R = class extends b {
    constructor(t) {
        super(t)
    }
    async fetch({id: t, campaign: e}) {
        let i = (await this.adaptTo({
            id: t
        })).id, r = await this.getCampaign(i, e), n = this.buildApiURL(i, this.store[g], r), s;
        try {
            let u = await fetch(n.href, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!u.ok)
                return;
            s = await u.json()
        } catch (u) {
            console.error("Failed to fetch product:", u);
            return
        }
        let {options: o, currency: c} = await this.processVariations(i, s.product.options);
        return {
            overrides: {
                oldCampaign: e,
                newCampaign: r
            },
            product: {
                id: i,
                name: s.product.productName,
                campaign: r || s.campaign,
                campaignType: s.campaignType || "",
                currency: c,
                platformId: s.platformProductId,
                options: o
            }
        }
    }
    buildApiURL(t, e, i) {
        let r = ["products", t, "locale", e];
        return i && r.push("campaign", S.includes(String(i)) ? "null" : i),
        new URL(`https://www.bitdefender.com/p-api/v1/${r.join("/")}`)
    }
    async processVariations(t, e) {
        let i = new Map
          , r = "";
        for (let n of e) {
            let s = await this.adaptTo({
                id: t,
                subscription: Number(n.months),
                devices: Number(n.slots)
            })
              , o = {
                devices: s.devices,
                subscription: s.subscription,
                price: Number(n.price),
                discountedPrice: Number(n.discountedPrice || 0),
                buyLink: n.buyLink,
                bundle: []
            };
            r = n.currency,
            i.set(`${s.devices}-${s.subscription}`, o)
        }
        return {
            options: i,
            currency: r
        }
    }
}
;
var $ = {
    init: T,
    vlaicu: R
}
  , g = Symbol("locale")
  , f = Symbol("adapter")
  , E = Symbol("campaign")
  , P = Symbol("transformers")
  , l = Symbol("overrides")
  , I = Symbol("trialLinks")
  , _ = Symbol("formatter")
  , A = class {
    products;
    provider;
    store;
    constructor(t) {
        this.products = new Map,
        this.provider = t.provider,
        this.store = t.store
    }
    async get({id: t, campaign: e}) {
        let i = await this.store[f]
          , {id: r} = await i.adaptTo({
            id: t
        })
          , n = `${r}-${e}`
          , s = this.products.get(n);
        if (s) {
            if (s.ids.has(t))
                return await s.base;
            s.ids.add(t);
            let c = (async () => {
                let u = await s.base
                  , d = await this.provider.getProduct({
                    id: t,
                    campaign: e
                });
                return u && d && u[M]({
                    options: await d.getOption()
                }),
                u
            }
            )();
            return s.base = c,
            await c
        }
        let o = this.provider.getProduct({
            id: t,
            campaign: e
        });
        return this.products.set(n, {
            base: o,
            ids: new Set([t])
        }),
        await o
    }
}
  , O = class {
    cache;
    [g];
    [f];
    [E];
    [P];
    [l];
    [I];
    [_];
    constructor(t) {
        let e = async ({campaign: i}) => i;
        this[g] = t.locale,
        this[f] = N.create(),
        this[E] = t.campaign ?? e,
        this[P] = t.transformers,
        this[l] = t.overrides,
        this[I] = t.trialLinks,
        this.cache = new A({
            provider: this.getProvider(t.provider),
            store: this
        }),
        this[_] = t.formatter || L
    }
    async getProduct(t) {
        let i = (Array.isArray(t) ? t : [t]).map(n => this.cache.get(n))
          , r = (await Promise.allSettled(i)).filter(n => n.status === "fulfilled" && !!n.value).map(n => n.value);
        return Array.isArray(t) ? r : r.pop()
    }
    getProvider(t) {
        let {name: e} = t ?? {};
        if (typeof e == "string") {
            let i = $[e];
            if (i)
                return new i({
                    store: this
                });
            throw new Error(`Unknown provider string: ${e}`)
        }
        return new e({
            store: this
        })
    }
    formatPrice(t) {
        return this[_](t)
    }
}
;
var M = Symbol("setOption")
  , x = class {
    store;
    name;
    campaign;
    campaignType;
    id;
    currency;
    options;
    platformId;
    devices;
    subscriptions;
    discount;
    price;
    discountedPrice;
    constructor(t) {
        this.store = t.store,
        this.name = t.name,
        this.campaign = t.campaign,
        this.campaignType = t.campaignType,
        this.id = t.id,
        this.platformId = t.platformId,
        this.currency = t.currency,
        this.devices = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER,
            values: []
        },
        this.subscriptions = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER,
            values: []
        },
        this.discount = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER,
            percentage: {
                min: Number.MAX_SAFE_INTEGER,
                max: Number.MIN_SAFE_INTEGER
            }
        },
        this.price = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER,
            monthly: {
                min: Number.MAX_SAFE_INTEGER,
                max: Number.MIN_SAFE_INTEGER
            }
        },
        this.discountedPrice = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER,
            monthly: {
                min: Number.MAX_SAFE_INTEGER,
                max: Number.MIN_SAFE_INTEGER
            }
        },
        this.options = new Map;
        let e = new Set
          , i = new Set;
        for (let[r,n] of t.options.entries()) {
            let s = new y({
                ...n,
                product: this
            });
            this.options.set(r, s),
            this.price.min = Math.min(s.getPrice({
                currency: !1
            }), this.price.min),
            this.price.max = Math.max(s.getPrice({
                currency: !1
            }), this.price.max),
            this.price.monthly.min = Math.min(s.getPrice({
                monthly: !0,
                currency: !1
            }), this.price.monthly.min),
            this.price.monthly.max = Math.max(s.getPrice({
                monthly: !0,
                currency: !1
            }), this.price.monthly.max),
            this.discountedPrice.min = Math.min(s.getDiscountedPrice({
                currency: !1
            }), this.discountedPrice.min),
            this.discountedPrice.max = Math.max(s.getDiscountedPrice({
                currency: !1
            }), this.discountedPrice.max),
            this.discountedPrice.monthly.min = Math.min(s.getDiscountedPrice({
                monthly: !0,
                currency: !1
            }), this.discountedPrice.monthly.min),
            this.discountedPrice.monthly.max = Math.max(s.getDiscountedPrice({
                monthly: !0,
                currency: !1
            }), this.discountedPrice.monthly.max),
            this.devices.min = Math.min(s.getDevices(), this.devices.min),
            this.devices.max = Math.max(s.getDevices(), this.devices.max),
            e.add(s.getDevices()),
            this.subscriptions.min = Math.min(s.getSubscription(), this.subscriptions.min),
            this.subscriptions.max = Math.max(s.getSubscription(), this.subscriptions.max),
            i.add(s.getSubscription()),
            this.discount.min = Math.min(s.getDiscount({
                symbol: !1
            }), this.discount.min),
            this.discount.max = Math.max(s.getDiscount({
                symbol: !1
            }), this.discount.max),
            this.discount.percentage.min = Math.min(s.getDiscount({
                percentage: !0,
                symbol: !1
            }), this.discount.percentage.min),
            this.discount.percentage.max = Math.max(s.getDiscount({
                percentage: !0,
                symbol: !1
            }), this.discount.percentage.max)
        }
        this.devices.values = [...e],
        this.subscriptions.values = [...i]
    }
    getStore() {
        return this.store
    }
    getId() {
        return this.id
    }
    getPlatformId() {
        return this.platformId
    }
    getName() {
        return this.name
    }
    getCampaign() {
        return this.campaign
    }
    getCampaignType() {
        return this.campaignType
    }
    getCurrency() {
        return this.currency
    }
    async getOption(t) {
        let e = await this.store[f]
          , {devices: i, subscription: r} = await e.adaptTo({
            id: this.id,
            subscription: Number(t?.subscription),
            devices: Number(t?.devices)
        })
          , n = t?.bundle?.filter(o => !!o)
          , s = async (o, c) => new y({
            ...await this.bundle(o, c),
            product: this
        });
        if (Number(i) && Number(r)) {
            let o = this.options.get(`${i}-${r}`);
            return o ? n && n.length > 0 ? await s(o, n) : o : void 0
        }
        if (n && n.length > 0) {
            let o = [...this.options.values()].map(u => s(u, n));
            return (await Promise.allSettled(o)).map(u => u.status === "fulfilled" ? u.value : void 0)
        }
        return [...this.options.values()]
    }
    [M](t) {
        let e = Array.isArray(t.options) ? t.options : [t.options];
        for (let i of e) {
            let r = i.getDevices()
              , n = i.getSubscription();
            this.options.set(`${r}-${n}`, i)
        }
    }
    getPrice(t) {
        let {monthly: e=!1, currency: i=!0} = t ?? {}
          , r = e ? this.price.monthly : this.price;
        return i ? {
            min: this.store.formatPrice({
                price: r.min,
                currency: this.currency
            }),
            max: this.store.formatPrice({
                price: r.max,
                currency: this.currency
            })
        } : {
            min: r.min,
            max: r.max
        }
    }
    getDiscountedPrice(t) {
        let {monthly: e=!1, currency: i=!0} = t ?? {}
          , r = e ? this.discountedPrice.monthly : this.discountedPrice;
        return i ? {
            min: this.store.formatPrice({
                price: r.min,
                currency: this.currency
            }),
            max: this.store.formatPrice({
                price: r.max,
                currency: this.currency
            })
        } : {
            min: r.min,
            max: r.max
        }
    }
    getDiscount(t) {
        let {percentage: e=!1, symbol: i=!0} = t ?? {}
          , r = e ? this.discount.percentage : this.discount;
        return e ? i ? {
            min: `${r.min}%`,
            max: `${r.max}%`
        } : {
            min: r.min,
            max: r.max
        } : i ? {
            min: this.store.formatPrice({
                price: r.min,
                currency: this.currency
            }),
            max: this.store.formatPrice({
                price: r.max,
                currency: this.currency
            })
        } : {
            min: r.min,
            max: r.max
        }
    }
    getDevices() {
        return this.devices
    }
    getSubscriptions() {
        return this.subscriptions
    }
    async bundle(t, e) {
        let i = n => Number(n.toFixed(2))
          , r = {
            price: t.getPrice({
                currency: !1
            }),
            discountedPrice: t.getDiscountedPrice({
                currency: !1
            }),
            buyLink: t.getBuyLink(),
            subscription: t.getSubscription(),
            devices: t.getDevices(),
            bundle: e
        };
        for (let {option: n} of e) {
            let s = n.getPrice({
                currency: !1
            })
              , o = n.getDiscountedPrice({
                currency: !1
            });
            r.price = i(r.price + s),
            o ? r.discountedPrice ? r.discountedPrice = i(r.discountedPrice + o) : r.discountedPrice = i(r.price + o) : r.discountedPrice && (r.price = i(r.discountedPrice + s))
        }
        return r
    }
}
;
export {x as Product, y as ProductOption, O as Store};
//# sourceMappingURL=dex-store.mjs.map
