import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import"../paragraph/paragraph.js";import"../button/button.js";import"../badge/badge.js";import"../divider/divider-horizontal.js";import{t as s}from"./adopt-styles.js";import"../tab-list/tab-list.js";import{n as c,t as l}from"../tab-list/tab-list.css.js";var u=r`:host{--border-card-green:var(--color-green-700)}button{outline:none}button:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary)}a:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary);border-radius:var(--focus-outline-radius)}.card{background:var(--color-surface-default);border:var(--border-width-1) solid var(--color-border-container);border-radius:var(--card-radius);padding-top:2em;padding:var(--card-padding);text-align:center;max-width:360px;height:100%;position:relative}.highlight{border:var(--spacing-2) solid var(--border-card-green)}.highlight-banner{background:var(--status-success-fill);color:var(--status-success-on-fill);padding:var(--spacing-16) var(--spacing-8);border-top-left-radius:var(--spacing-20);border-top-right-radius:var(--spacing-20);width:85%;font-size:18px;font-family:var(--typography-fontFamily-sans);font-weight:600;line-height:var(--typography-lineHeight-tight);z-index:var(--z-base);position:absolute;top:-30px;left:50%;transform:translate(-50%)}.card-header{text-align:start}.card-title{font-size:2em;font-weight:700;font-family:var(--typography-fontFamily-sans);text-align:start;max-width:300px;margin:0}.pricing-info{align-items:center;gap:var(--spacing-8);display:inline-flex}.badge-subtitle{font-weight:500;font-family:var(--typography-fontFamily-sans);color:var(--color-text-primary);margin:var(--spacing-0);margin-top:var(--spacing-8);font-size:16px!important}.badge img{top:var(--spacing-1);width:11px;height:var(--spacing-14);position:relative}.badge p{font-size:16px}.pricing{text-align:start;margin:var(--spacing-16) 0;flex-direction:column;align-items:start;display:flex}.pricing>*{margin:0}.original-price{font-family:var(--typography-fontFamily-sans);color:var(--color-text-primary);font-size:16px;font-weight:500;text-decoration:line-through}.discount{background:var(--status-success-surface-strong);font-family:var(--typography-fontFamily-sans);border-radius:var(--radius-full);gap:var(--spacing-10);color:var(--color-text-success);margin:var(--spacing-0);font-size:16px;font-weight:700}.price{font-family:var(--typography-heading-h3-fontFamily);font-size:var(--typography-heading-h3-fontSize);font-weight:var(--typography-heading-h3-fontWeight);line-height:var(--typography-heading-h3-lineHeight);letter-spacing:var(--typography-heading-h3-letterSpacing);color:var(--color-text-primary);margin:0}.terms{font-family:var(--typography-fontFamily-sans);color:var(--color-text-primary);max-width:80%;margin-top:15px;font-size:12px;font-weight:400}.terms a{color:var(--color-text-brand);text-decoration:underline}.actions{gap:var(--spacing-12);margin-bottom:var(--spacing-20);flex-direction:column;align-items:stretch;width:100%;display:flex}.features h4{color:var(--color-text-primary);font-size:16px;font-weight:700;font-family:var(--typography-fontFamily-sans);line-height:var(--typography-lineHeight-tight)}.features ul{padding-inline-start:var(--spacing-0);padding-top:var(--spacing-16)}.pricing-card{position:relative}.additional-info{text-align:start;margin:0;padding:0;list-style-type:none}.additional-info li{font-family:var(--typography-fontFamily-sans);margin-bottom:var(--spacing-10);align-items:center;gap:var(--spacing-8);white-space:normal;font-size:14px;font-weight:400;display:flex;overflow:visible}.card .features{max-width:400px!important}.features{padding:var(--spacing-10)}.badge-icon{margin-inline-end:var(--spacing-8)}.features h4{text-align:start}.pricing-container{align-items:center;gap:var(--spacing-16);flex-direction:column;margin-bottom:100px;display:flex}.plan-switch{margin-bottom:var(--spacing-24)}.pricing-cards{justify-content:center;gap:var(--spacing-24);background:var(--status-brand-surface);border-radius:var(--shape-radius-2xl);padding:var(--spacing-64) var(--spacing-32) var(--spacing-48);box-sizing:border-box;flex-wrap:wrap;align-items:stretch;display:flex}.pricing-card{flex-direction:column;flex:1 1 calc(33.333% - var(--spacing-16));max-width:300px;min-height:100%;display:flex}.card-content{flex-grow:1}.switchBox{text-align:center;margin-bottom:var(--spacing-32);margin-top:var(--spacing-32);padding-bottom:var(--spacing-32)}.feature-item{align-items:center;display:flex;position:relative}.feature-toggle{font:inherit;letter-spacing:inherit;color:inherit;text-align:inherit;cursor:pointer;border-radius:var(--focus-outline-radius);background:0 0;border:0;margin:0;padding:0}.feature-toggle:after{content:"";position:absolute;inset:0}.feature-item .tooltip{bottom:calc(100% + var(--spacing-8));background-color:var(--color-surface-container);color:var(--color-text-secondary);padding:var(--spacing-8) var(--spacing-12);border-radius:var(--shape-radius-sm);border:var(--spacing-1) solid var(--color-border-subtle);max-width:250px;box-shadow:0 0 var(--spacing-10) #0000001a;z-index:var(--z-tooltip);font-size:12px;display:none;position:absolute;inset-inline-start:0}.feature-item .tooltip:after{content:"";bottom:-8px;border-left:var(--spacing-8) solid transparent;border-right:var(--spacing-8) solid transparent;border-top:var(--spacing-8) solid var(--color-border-subtle);position:absolute;inset-inline-start:calc(20% - var(--spacing-8))}.feature-item .tooltip.open{display:block}@media (hover:hover){.feature-item:hover .tooltip{display:block}}.badge-feature{background-color:var(--color-surface-brand);color:var(--color-text-inverse);border-radius:var(--shape-radius-2xl);width:var(--spacing-36);height:var(--spacing-20);text-align:center;padding:var(--spacing-2);justify-content:center;align-items:center;margin-inline-start:var(--spacing-8);font-size:12px;display:inline-flex}.badge-feature-icon{height:var(--spacing-14);padding:var(--spacing-2)}.badge-icon-family-subtitle{top:var(--spacing-2);padding-inline-end:var(--spacing-4);width:var(--spacing-20)!important;height:var(--spacing-20)!important}.family-text{bottom:var(--spacing-4);position:relative}@media (width<=1024px){.pricing-cards{align-items:center;gap:var(--spacing-52);flex-direction:column}.pricing-card{max-width:80%}.card-title{font-size:1.5em}.highlight-banner{width:90%;font-size:16px}}@media (width<768px){.pricing-card{max-width:90%;padding:var(--spacing-24)}.switchBox{text-align:center;padding-bottom:30px}.card-title{font-size:1.3em}.badge-subtitle,.original-price,.discount,.terms{font-size:14px}.pricing-info{gap:var(--spacing-4);flex-direction:column}.highlight-banner{padding:var(--spacing-8);font-size:14px}.actions{gap:var(--spacing-8);flex-direction:column}}@media (width<=480px){.pricing-card{max-width:100%;padding:var(--spacing-16)}.card-title{font-size:1.1em}.badge-subtitle,.original-price,.discount,.terms,.highlight-banner{font-size:12px}.badge{padding:var(--spacing-4) var(--spacing-6);font-size:12px}.actions{gap:var(--spacing-6)}}.text-left{padding-bottom:15px;text-align:start!important}`,d={us_i:`consumer/ultimate-security`,ps_i:`consumer/premium-security`,ts_i:`consumer/total-security`},f=(e,t)=>`https://www.bitdefender.com/${(t||`en-US`).toLowerCase()}/${d[e]}`,p=class extends n{constructor(...e){super(...e),this.planType=`individual`,this.locale=`en-US`,this.currency=`EUR`,this.shadow=!0,this.termsHref=``}static{this.styles=[u,c,l]}handleSwitch(e){this.planType=e.detail.planType}render(){return e`
      <div class="pricing-container">
        <pricing-switch
          .planType=${this.planType}
          panel-id="plan-cards"
          @plan-switch=${this.handleSwitch}
        ></pricing-switch>

        <div
          class="pricing-cards"
          id="plan-cards"
          role="tabpanel"
          aria-labelledby=${this.planType===`family`?`plan-1`:`plan-0`}
        >
          ${this.planType===`individual`?e`
                <!-- Card 1: Ultimate Security -->
                <bd-context ignore-events-parent>
                  <bd-product product-id="us_i">
                    <bd-option devices="5" subscription="1" data-layer-event="info">
                      <pricing-card
                        title="Bitdefender Ultimate Security"
                        planType="individual"
                        learn-more-href=${f(`us_i`,this.locale)}
                        .termsHref=${this.termsHref}
                        .shadow=${this.shadow}
                      ></pricing-card>
                    </bd-option>
                  </bd-product>
                </bd-context>

                <!-- Card 2: Premium Security, the default title (highlighted) -->
                <bd-context ignore-events-parent>
                  <bd-product product-id="ps_i">
                    <bd-option devices="5" subscription="1" data-layer-event="info">
                      <pricing-card
                        highlight
                        features
                        identity
                        planType="individual"
                        learn-more-href=${f(`ps_i`,this.locale)}
                        .termsHref=${this.termsHref}
                        .shadow=${this.shadow}
                      ></pricing-card>
                    </bd-option>
                  </bd-product>
                </bd-context>

                <!-- Card 3: Total Security -->
                <bd-context ignore-events-parent>
                  <bd-product product-id="ts_i">
                    <bd-option devices="5" subscription="1" data-layer-event="info">
                      <pricing-card
                        title="Bitdefender Total Security"
                        features
                        privacy
                        identity
                        planType="individual"
                        learn-more-href=${f(`ts_i`,this.locale)}
                        .termsHref=${this.termsHref}
                        .shadow=${this.shadow}
                      ></pricing-card>
                    </bd-option>
                  </bd-product>
                </bd-context>
              `:e`
                <!-- Family Card 1: Ultimate Security -->
                <bd-context ignore-events-parent>
                  <bd-product product-id="us_i">
                    <bd-option devices="5" subscription="1" data-layer-event="info">
                      <pricing-card-family
                        title="Bitdefender Ultimate Security"
                        features
                        privacy
                        identityExtended
                        parentalControl
                        planType="family"
                        learn-more-href=${f(`us_i`,this.locale)}
                        .termsHref=${this.termsHref}
                        .shadow=${this.shadow}
                      ></pricing-card-family>
                    </bd-option>
                  </bd-product>
                </bd-context>

                <!-- Family Card 2: Premium Security, the default title (highlighted) -->
                <bd-context ignore-events-parent>
                  <bd-product product-id="ps_i">
                    <bd-option devices="5" subscription="1" data-layer-event="info">
                      <pricing-card-family
                        highlight
                        features
                        identity
                        planType="family"
                        learn-more-href=${f(`ps_i`,this.locale)}
                        .termsHref=${this.termsHref}
                        .shadow=${this.shadow}
                      ></pricing-card-family>
                    </bd-option>
                  </bd-product>
                </bd-context>

                <!-- Family Card 3: Total Security -->
                <bd-context ignore-events-parent>
                  <bd-product product-id="ts_i">
                    <bd-option devices="5" subscription="1" data-layer-event="info">
                      <pricing-card-family
                        title="Bitdefender Total Security"
                        features
                        privacy
                        identity
                        planType="family"
                        learn-more-href=${f(`ts_i`,this.locale)}
                        .termsHref=${this.termsHref}
                        .shadow=${this.shadow}
                      ></pricing-card-family>
                    </bd-option>
                  </bd-product>
                </bd-context>
              `}
        </div>
      </div>
    `}};o([i({type:String})],p.prototype,`planType`,void 0),o([i({type:String})],p.prototype,`locale`,void 0),o([i({type:String})],p.prototype,`currency`,void 0),o([i({type:Boolean,reflect:!0})],p.prototype,`shadow`,void 0),o([i({type:String,attribute:`terms-href`})],p.prototype,`termsHref`,void 0),p=o([a(`bd-pricing-container`)],p);var m=t=>e`
  <div class="pricing">
    <div class="pricing-info" data-store-hide="!it.option.price.discounted">
      <bd-p variant="small" class="original-price">
        <s data-store-render data-store-price="full"></s>
      </bd-p>
      <bd-p variant="small" class="discount">
        <bd-badge tone="success" variant="shade">
          Save <span data-store-render data-store-discount="percentage"></span>
        </bd-badge>
      </bd-p>
    </div>
    <p class="price">
      <span data-store-render data-store-price="discounted||full"></span>/year
    </p>
    <bd-p variant="small" class="terms">
      First year price. Plus applicable sales tax. See
      ${t?e`<a href=${t}>terms of use</a>`:`terms of use`} below.
    </bd-p>
  </div>
`,h=(t,n)=>e`
  <div class="actions">
    <bd-button-link
      label="Buy Now, ${t}"
      variant="accent"
      fullWidth
      buyLink
    >
      Buy Now
    </bd-button-link>

    ${n?e`<bd-button-link
          href=${n}
          label="Learn more about ${t}"
          variant="ghost"
          fullWidth
        >
          Learn More
        </bd-button-link>`:``}
  </div>
`,g=class extends n{constructor(...e){super(...e),this.title=`Bitdefender Premium Security`,this.features=!1,this.privacy=!1,this.highlight=!1,this.identity=!1,this.identityExtended=!1,this.parentalControl=!1,this.planType=`individual`,this.productId=`vsb`,this.locale=`en-US`,this.currency=`EUR`,this.shadow=!0,this.learnMoreHref=``,this.termsHref=``}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),s(this,u)}render(){return e`
      <div class="card ${this.highlight?`highlight`:``}">
        ${this.highlight?e`<div class="highlight-banner">Best value</div>`:``}
        <div class="card-header">
          <bd-h as="h4" class="card-title">${this.title}</bd-h>

          <bd-badge tone="primary" variant="fill">
            Individual
          </bd-badge>

          <bd-p variant="small" class="badge-subtitle">1 account & 5 devices</bd-p>
          <bd-divider-horizontal color="subtle" opacity="0.25"></bd-divider-horizontal>
        </div>

        <!-- Pricing section with store integration -->
        ${m(this.termsHref)}

        <!-- Actions with store integration -->
        ${h(this.title,this.learnMoreHref)}

        <bd-divider-horizontal color="subtle" opacity="0.25"></bd-divider-horizontal>

        <!-- Features sections -->
        ${this.features?e`<pricing-card-features .shadow=${this.shadow}></pricing-card-features>`:``}
        ${this.privacy?e`<pricing-card-privacy .shadow=${this.shadow}></pricing-card-privacy>`:``}
        ${this.identity?e`<pricing-card-identity .shadow=${this.shadow}></pricing-card-identity>`:``}
        ${this.identityExtended?e`<pricing-card-identity-extended .shadow=${this.shadow}></pricing-card-identity-extended>`:``}
        ${this.parentalControl?e`<pricing-card-parental-control .shadow=${this.shadow}></pricing-card-parental-control>`:``}
      </div>
    `}};o([i({type:String})],g.prototype,`title`,void 0),o([i({type:Boolean})],g.prototype,`features`,void 0),o([i({type:Boolean})],g.prototype,`privacy`,void 0),o([i({type:Boolean})],g.prototype,`highlight`,void 0),o([i({type:Boolean})],g.prototype,`identity`,void 0),o([i({type:Boolean})],g.prototype,`identityExtended`,void 0),o([i({type:Boolean})],g.prototype,`parentalControl`,void 0),o([i({type:String})],g.prototype,`planType`,void 0),o([i({type:String,attribute:`product-id`})],g.prototype,`productId`,void 0),o([i({type:String})],g.prototype,`locale`,void 0),o([i({type:String})],g.prototype,`currency`,void 0),o([i({type:Boolean,reflect:!0})],g.prototype,`shadow`,void 0),o([i({type:String,attribute:`learn-more-href`})],g.prototype,`learnMoreHref`,void 0),o([i({type:String,attribute:`terms-href`})],g.prototype,`termsHref`,void 0),g=o([a(`pricing-card`)],g);var _=class extends n{constructor(...e){super(...e),this.title=`Bitdefender Premium Security`,this.features=!1,this.privacy=!1,this.highlight=!1,this.identity=!1,this.identityExtended=!1,this.parentalControl=!1,this.planType=`family`,this.productId=`vsb`,this.locale=`en-US`,this.currency=`EUR`,this.shadow=!0,this.learnMoreHref=``,this.termsHref=``}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),s(this,u)}render(){return e`
      <div class="card ${this.highlight?`highlight`:``}">
        ${this.highlight?e`<div class="highlight-banner">Best value</div>`:``}
        <div class="card-header">
          <bd-h as="h4" class="card-title">${this.title}</bd-h>

          <bd-badge tone="primary" variant="fill">
            Family
          </bd-badge>

          <bd-p variant="small" class="badge-subtitle">5 accounts & 25 devices</bd-p>
          <bd-divider-horizontal color="subtle" opacity="0.25"></bd-divider-horizontal>
        </div>

        <!-- Pricing section with store integration -->
        ${m(this.termsHref)}

        <!-- Actions with store integration -->
        ${h(this.title,this.learnMoreHref)}

        <bd-divider-horizontal color="subtle" opacity="0.25"></bd-divider-horizontal>
        
        <!-- Features sections -->
        ${this.features?e`<pricing-card-features .shadow=${this.shadow}></pricing-card-features>`:``}
        ${this.privacy?e`<pricing-card-privacy .shadow=${this.shadow}></pricing-card-privacy>`:``}
        ${this.identity?e`<pricing-card-identity .shadow=${this.shadow}></pricing-card-identity>`:``}
        ${this.identityExtended?e`<pricing-card-identity-extended .shadow=${this.shadow}></pricing-card-identity-extended>`:``}
        ${this.parentalControl?e`<pricing-card-parental-control .shadow=${this.shadow}></pricing-card-parental-control>`:``}
      </div>
    `}};o([i({type:String})],_.prototype,`title`,void 0),o([i({type:Boolean})],_.prototype,`features`,void 0),o([i({type:Boolean})],_.prototype,`privacy`,void 0),o([i({type:Boolean})],_.prototype,`highlight`,void 0),o([i({type:Boolean})],_.prototype,`identity`,void 0),o([i({type:Boolean})],_.prototype,`identityExtended`,void 0),o([i({type:Boolean})],_.prototype,`parentalControl`,void 0),o([i({type:String})],_.prototype,`planType`,void 0),o([i({type:String,attribute:`product-id`})],_.prototype,`productId`,void 0),o([i({type:String})],_.prototype,`locale`,void 0),o([i({type:String})],_.prototype,`currency`,void 0),o([i({type:Boolean,reflect:!0})],_.prototype,`shadow`,void 0),o([i({type:String,attribute:`learn-more-href`})],_.prototype,`learnMoreHref`,void 0),o([i({type:String,attribute:`terms-href`})],_.prototype,`termsHref`,void 0),_=o([a(`pricing-card-family`)],_);var v=class extends n{constructor(...e){super(...e),this.planType=`individual`,this.shadow=!0,this.panelId=``}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),s(this,u,c,l)}handleSwitch(e){this.planType=e.detail.index===1?`family`:`individual`,this.dispatchEvent(new CustomEvent(`plan-switch`,{detail:{planType:this.planType},bubbles:!0,composed:!0}))}render(){return e`
      <div class="switchBox">
        <bd-tab-list
          appearance="switcher"
          label="Plan type"
          id-prefix="plan"
          panel-id=${this.panelId||t}
          .tabs=${[{label:`Individual`},{label:`Family`}]}
          .selected=${+(this.planType===`family`)}
          @bd-tab-select=${this.handleSwitch}
        ></bd-tab-list>
      </div>
    `}};o([i({type:String})],v.prototype,`planType`,void 0),o([i({type:Boolean,reflect:!0})],v.prototype,`shadow`,void 0),o([i({type:String,attribute:`panel-id`})],v.prototype,`panelId`,void 0),v=o([a(`pricing-switch`)],v);var y=class{constructor(e){this.host=e,this.open=-1,this._onKeydown=e=>{e.key===`Escape`&&!e.defaultPrevented&&this.close()},this._onPointerdown=e=>{let t=this.host.renderRoot.getElementById(this.id(this.open))?.closest(`.feature-item`);t&&e.composedPath().includes(t)||this.close()},this.onFocusOut=e=>{e.relatedTarget&&this.close()},e.addController(this)}hostDisconnected(){this.open=-1,this._listen(!1)}id(e){return`feature-tip-${e}`}toggle(e){this._set(this.open===e?-1:e)}close(){this.open>=0&&this._set(-1)}_set(e){this.open=e,this._listen(e>=0),this.host.requestUpdate()}_listen(e){let t=e?`addEventListener`:`removeEventListener`;document[t](`keydown`,this._onKeydown),document[t](`pointerdown`,this._onPointerdown,!0)}name(t,n,r){return r?e`<bd-p variant="regular"><button
      type="button"
      class="feature-toggle"
      aria-expanded="${this.open===t}"
      aria-controls="${this.id(t)}"
      @click=${()=>this.toggle(t)}
      @focusout=${this.onFocusOut}
    >${n}</button></bd-p>`:e`<bd-p variant="regular">${n}</bd-p>`}tip(t,n){return n?e`<div id="${this.id(t)}" class="tooltip ${this.open===t?`open`:``}"><bd-p variant="small">${n}</bd-p></div>`:``}},b=class extends n{static{this.styles=[u]}static{this.heading=``}static{this.headingClass=`text-left`}constructor(){super(),this.shadow=!0,this._tips=new y(this)}get _items(){return[]}_name(e){return e.name}render(){let{heading:n,headingClass:r}=this.constructor;return e`
      <div class="features">
        <bd-h as="h4" class="${r||t}">${n}</bd-h>
        <ul class="additional-info">
          ${(this._items||[]).map((t,n)=>e` <li class="feature-item">
                <img
                  src="/assets/verified_arrow.png"
                  alt=""
                  width="16"
                  height="16"
                  class="badge-icon"
                />
              ${this._tips.name(n,this._name(t),t.description)}
              ${t.badge?e`<bd-badge tone="primary" variant="fill">${t.badge}</bd-badge>`:``}
              ${this._tips.tip(n,t.description)}
            </li>`)}
        </ul>
      </div>
    `}};o([i({type:Boolean,reflect:!0})],b.prototype,`shadow`,void 0);var x=class extends b{constructor(...e){super(...e),this.features=[{name:`Multiplatform Windows®, macOS®, Android™, iOS®`},{name:`Multi-Awarded Antivirus, Malware, Ransomware Protection`,description:`Consistent results in independent tests for 10+ years`},{name:`Scam Prevention & Detection`,description:`Outsmart scammers and keep your money, your credentials, identity, and digital assets`},{name:`Cryptomining Protection`,description:`Bad actors can make money using your hardware and power connection without your consent. Protect yourself against "leech" software!`},{name:`Innovative Email Protection`,description:`Scans all incoming email and marks them as "safe" or "unsafe"`},{name:`Scam Copilot`,description:`Scam Copilot: Get protection against online scams with AI-powered anti-scam features.`}]}static{this.heading=`Device Security`}get _items(){return this.features}};o([i({type:Array})],x.prototype,`features`,void 0),x=o([a(`pricing-card-features`)],x);var S=class extends b{constructor(...e){super(...e),this.privacy=[{name:`Password Manager 1x`,description:`Ultra-secure, feature-rich password manager. The last password you will ever need for hundreds of online accounts`,badge:`1x`},{name:`Unlimited VPN traffic 1x`,description:`Keep your internet connections private & secure with VPN. Enjoy total anonymity on public & shared WI-FIs`,badge:`1x`},{name:`Choose from 4000+ VPN servers in 50+ countries`,description:`Our entire fleet of servers uses the latest available hardware, high-speed 10Gbps connections, and dedicated DNS servers.`},{name:`System-wide Ad blocker & Anti-tracker`,description:`Blocks ads, hinders ad targeting, and prevents online behavior profiling.`}]}static{this.heading=`Privacy`}static{this.headingClass=``}get _items(){return this.privacy}_name(e){return e.name.replace(` 1x`,``)}};o([i({type:Array})],S.prototype,`privacy`,void 0),S=o([a(`pricing-card-privacy`)],S);var C=class extends b{constructor(...e){super(...e),this.identity=[{name:`Data Breach Detection`,description:`Ultra-secure, feature-rich password manager. The last password you will ever need for hundreds of online accounts`,badge:`1x`}]}static{this.heading=`Identity Protection`}get _items(){return this.identity}};o([i({type:Array})],C.prototype,`identity`,void 0),C=o([a(`pricing-card-identity`)],C);var w=class extends b{constructor(...e){super(...e),this.identity=[{name:`Digital Identity Protection`,description:`Don't get caught off guard by future data leaks. Every time your personal information ends up in a breach, Bitdefender Digital Identity Protection notifies you so you can act quickly and minimize the impact.`,badge:`1x`},{name:`Data Breach Detection`,description:`Access a comprehensive list detailing organizations that exposed your personal information and get actionable tips to address each breach and fortify your online security.`},{name:`Dark Web Monitoring`,description:`We constantly scan the web (including dark web) for unauthorized leaks of personal data and give real-time alerts so you can act quickly by changing passwords, deleting accounts, or freezing credit cards before a serious incident occurs.`},{name:`Digital Footprint Visualization`,description:`Identify precisely which websites or services have compromised your sensitive information, and see how you can undo the damage.`},{name:`Real Time Breach Notifications`,description:`Stay one step ahead with our real-time breach notification feature. Instant alerts empower you to take immediate action, protecting your sensitive information and maintaining peace of mind effortlessly.`}]}static{this.heading=`Identity Protection`}get _items(){return this.identity}};o([i({type:Array})],w.prototype,`identity`,void 0),w=o([a(`pricing-card-identity-extended`)],w);var T=class extends b{constructor(...e){super(...e),this.parentalControl=[{name:`Internet time limit`,description:`Set healthy limits on the time your child can spend online on a certain device.`},{name:`Content filtering`,description:`Select the content categories you want to keep away from your child.`},{name:`Routines/Schedules`,description:`Manage your child's internet time with customizable daily limits, structured routines like Focus time, Family time and Bedtime`},{name:`Location`,description:`Track child location.`},{name:`Rewards`,description:`Interact with children by responding to their requests for extending daily internet time.`},{name:`Activity reports`,description:`Unified reporting and easier management across all devices, providing you with a better overview of your child's online activities.`}]}static{this.heading=`Parental Control`}get _items(){return this.parentalControl}};o([i({type:Array})],T.prototype,`parentalControl`,void 0),T=o([a(`pricing-card-parental-control`)],T);