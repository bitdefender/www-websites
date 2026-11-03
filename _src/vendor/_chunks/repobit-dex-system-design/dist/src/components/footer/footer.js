import{a as e,n as t,t as n}from"../../../../../lit/index.js";import{n as r,t as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import{t as s}from"../../tokens/tokens.js";import{a as c,i as l}from"../shared/token-scales.js";import{t as u}from"../shared/ensemble.css.js";import"../icons/arrow-down-icon.js";import"../icons/arrow-up-icon.js";import"../icons/close-icon.js";import"../link/link.js";import{n as d}from"../shared/controller.media-query.js";import"../divider/divider-horizontal.js";import"../divider/divider-vertical.js";import"./footer-links-group.js";import{a as f,i as p,n as m,o as h,r as g,s as _,t as v}from"./footer.css.js";import"./footer-nav-menu.js";import"../grid/grid.js";import"../icons/globe-icon.js";var y={"zh-HK":{place:`en`,language:`en`},"zh-TW":{place:`en`}},b=class extends n{constructor(...e){super(...e),this.selectedCountry=`Choose your country`,this.currentLocale=`en`,this.maxColumnsPerRow=2,this._isMobile=c(`md`),this._viewport=new d(this,l(`md`),e=>{this._isMobile=e})}connectedCallback(){super.connectedCallback(),this.setAttribute(`data-brand`,s),this._localeExplicit=this.hasAttribute(`current-locale`)||this.currentLocale!==`en`,this._initLocaleFromUrl()}firstUpdated(e){super.firstUpdated(e)}updated(e){e.has(`currentLocale`)&&this._toggleImpressumVisibility()}get _maxColumns(){let e=Math.floor(Number(this.maxColumnsPerRow));return Number.isFinite(e)&&e>=1?e:2}_toggleImpressumVisibility(){g(this.shadowRoot.querySelector(`slot[name="secondary-nav"]`),this.locale)}_scrollToCountries(){this.shadowRoot.querySelector(`.footer-countries-container`)?.scrollIntoView({behavior:this._scrollBehavior,block:`start`})}_scrollToTop(){this.scrollIntoView({behavior:this._scrollBehavior,block:`start`})}get _scrollBehavior(){return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?`auto`:`smooth`}_initLocaleFromUrl(){if(this._localeExplicit)return;let e=m(window.location.pathname);e&&([this.currentLocale,this.selectedCountry]=e)}_onCountriesToggle(e){e.target.open?this._scrollToCountries():this._closingInPlace||this._scrollToTop(),this._closingInPlace=!1}_closeCountries(e){let t=e.currentTarget.closest(`details`);this._closingInPlace=this._isMobile,t.open=!1,t.querySelector(`summary`).focus({preventScroll:!0})}getCountriesList(){return Object.entries(p).map(([e,t])=>({locale:e,label:t}))}_labelLang({locale:e}){return{place:e,language:e,...y[e]}}_renderCountryLabel(t){let{place:n,language:r}=this._labelLang(t),[i,a]=t.label.split(` - `);return n===r||a===void 0?t.label:e`<span lang="${n}">${i}</span> - ${a}`}_isCurrentCountry({locale:e,label:t}){return this.selectedCountry===t||e.toLowerCase()===this.locale}get locale(){return(this.currentLocale||`en`).toLowerCase()}render(){let n=(/* @__PURE__ */ new Date()).getFullYear(),r=this.locale.startsWith(`ro`),i=this.getCountriesList(),a=Math.ceil(i.length/3),o=[i.slice(0,a),i.slice(a,a*2),i.slice(a*2)],s=(this.shadowRoot?.querySelector(`slot[name="quick-links"]`))?.assignedElements({flatten:!0})||[],c=[];return s.forEach(e=>{e.tagName===`BD-FOOTER-LINKS-GROUP`?c.push(e):(e.querySelectorAll?e.querySelectorAll(`bd-footer-links-group`):[]).forEach(e=>c.push(e))}),e`
  <div class="footer-top-bleed">
    <div class="bd-ensemble container">
      <div class="footer-top">
        <div class="footer-logo">
          <slot name="logo">
            <span>${_}</span>
          </slot>
        </div>
        <div class="footer-top-right">
          <slot name="top-right">
            <div slot="top-right">
              <span slot="logo">${h}</span>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>

  <footer class="bd-ensemble container">
    <div class="footer-nav-main-container">
      <slot name="nav"></slot>
    </div>
    <bd-divider-horizontal width="100%" color="inverse" opacity="0.25"></bd-divider-horizontal>

    <div class="footer-links">
      <div class="footer-links-left">
        <bd-grid
          cols="1"
          cols-sm="1"
          cols-md="${Math.min(2,this._maxColumns)}"
          cols-lg="${this._maxColumns}"
          gap="lg"
          align="start"
          justify="start"
          padding="none"
        >
          <slot name="quick-links"></slot>
        </bd-grid>
      </div>
      <bd-divider-horizontal class="tablet-divider" width="100%" color="inverse" opacity="0.25"></bd-divider-horizontal>
      ${this._isMobile?e`<bd-divider-horizontal width="100%" color="inverse" opacity="0.25"></bd-divider-horizontal>`:``}

      <div class="footer-links-right social-icons">
        <slot name="social-links">
          <bd-link href="https://www.facebook.com/bitdefender" target="_blank" variant="secondary" class="bd-facebook">Facebook</bd-link>
          <bd-link href="https://twitter.com/bitdefender" target="_blank" variant="secondary" class="bd-twitter">Twitter</bd-link>
          <bd-link href="https://www.linkedin.com/company/bitdefender" target="_blank" variant="secondary" class="bd-linkedin">LinkedIn</bd-link>
          <bd-link href="https://www.youtube.com/c/Bitdefender" target="_blank" variant="secondary" class="bd-youtube">YouTube</bd-link>
          <bd-link href="https://www.instagram.com/bitdefender/" target="_blank" variant="secondary" class="bd-instagram">Instagram</bd-link>
          <bd-link href="https://www.tiktok.com/@bitdefender" target="_blank" variant="secondary" class="bd-tiktok">TikTok</bd-link>
        </slot>
      </div>
    </div>

    ${this._isMobile?``:e`<bd-divider-horizontal width="100%" color="inverse" opacity="0.25"></bd-divider-horizontal>`}

    <div class="footer-middle-line">
      <div class="secondary-nav-container">
        <slot name="secondary-nav"></slot>
        ${this._isMobile?e`<bd-divider-horizontal width="100%" color="inverse" opacity="0.25"></bd-divider-horizontal>`:``}
      </div>
      <div class="footer-address">
        <slot name="address">
          <div>
            111 W. Houston Street, Suite 2105, Frost Tower Building<br />
            San Antonio, Texas 78205
          </div>
        </slot>
      </div>
    </div>

    <bd-divider-horizontal width="100%" color="inverse" opacity="0.25"></bd-divider-horizontal>

    <div class="footer-extra">
      <div class="footer-copy">
        <slot name="copyright">
          Copyright © 1997 - ${n} Bitdefender
        </slot>
      </div>

      ${r?e`
          <div class="footer-anpc">
            <slot name="anpc">${f}</slot>
          </div>
        `:null}

      <!-- The list is the summary's own content, so it opens under the
           toggle in the same row; the stylesheet runs it the row's full width.
           Its links are plain anchors: a reader who picks a country follows a
           link: hreflang says which language it leads to, lang which one its
           label is in. -->
      <!-- No icon here has a colour of its own: each takes its summary's or
           button's, so forced colours repaint it (footer.css.ts). -->
      <details class="footer-countries-toggle" @toggle="${this._onCountriesToggle}">
        <summary class="country-toggle">
          <span class="country-toggle-row">
            <bd-globe-icon size="20"></bd-globe-icon>
            <span class="country-toggle-label">${this.selectedCountry}</span>
            <bd-arrow-down-icon class="when-closed" size="20"></bd-arrow-down-icon>
            <bd-arrow-up-icon class="when-open" size="20"></bd-arrow-up-icon>
          </span>
        </summary>
        <div class="footer-countries-container">
          <!-- The icon is the only content and bd-close-icon's svg is aria-hidden,
               so without a label this button had no accessible name at all: a
               screen reader announced "button" and nothing else. WCAG 2.2 SC
               4.1.2. The name goes on the control, never on the icon -- naming
               both makes it announce twice. -->
          <button
            class="close-countries-button"
            aria-label="Close country list"
            @click="${this._closeCountries}"
          >
            <bd-close-icon size="18"></bd-close-icon>
          </button>
          ${o.map(n=>e`
            <bd-footer-links-group title="${n===o[0]?`Choose your country`:``}">
              ${n.map(n=>e`<a
                  href="/${n.locale.toLowerCase()}/"
                  hreflang="${n.locale}"
                  lang="${this._labelLang(n).language}"
                  aria-current="${this._isCurrentCountry(n)?`true`:t}"
                >${this._renderCountryLabel(n)}</a>`)}
            </bd-footer-links-group>
          `)}
        </div>
      </details>
    </div>
  </footer>
`}static{this.styles=[u,v]}};o([i()],b.prototype,`selectedCountry`,void 0),o([r({type:String,attribute:`current-locale`})],b.prototype,`currentLocale`,void 0),o([r({type:Number,attribute:`max-columns-per-row`})],b.prototype,`maxColumnsPerRow`,void 0),o([i()],b.prototype,`_isMobile`,void 0),b=o([a(`bd-footer`)],b);export{b as BdFooter};