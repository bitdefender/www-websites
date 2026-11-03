import{a as e,t}from"../../../../../lit/index.js";import{n}from"../../../../../lit/decorators.js";import{n as r,t as i}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import{t as a}from"../../tokens/tokens.js";import{t as o}from"../shared/ensemble.css.js";import"../divider/divider-horizontal.js";import"../divider/divider-vertical.js";import"./footer-links-group.js";import{a as s,n as c,o as l,r as u,s as d,t as f}from"./footer.css.js";import"./footer-nav-menu.js";import"../grid/grid.js";var p=class extends t{constructor(...e){super(...e),this.currentLocale=`en`}connectedCallback(){super.connectedCallback(),this.setAttribute(`data-brand`,a),this._localeExplicit=this.hasAttribute(`current-locale`)||this.currentLocale!==`en`,this._initLocaleFromUrl()}firstUpdated(e){super.firstUpdated(e),this._toggleImpressumVisibility()}updated(e){e.has(`currentLocale`)&&this._toggleImpressumVisibility()}_initLocaleFromUrl(){if(this._localeExplicit)return;let e=c(window.location.pathname);e&&([this.currentLocale]=e)}_toggleImpressumVisibility(){u(this.shadowRoot?.querySelector(`slot[name="secondary-nav"]`),this.locale)}get locale(){return(this.currentLocale||`en`).toLowerCase()}render(){let t=(/* @__PURE__ */ new Date()).getFullYear(),n=this.locale.startsWith(`ro`);return e`
    <div class="footer-top-bleed">
      <div class="bd-ensemble container">
        <div class="footer-top">
          <div class="footer-logo">
            <slot name="logo">
              <span>${d}</span>
            </slot>
          </div>
          <div class="footer-top-right">
            <slot name="top-right">
              <div>
                <span>${l}</span>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>

    <footer class="bd-ensemble container">
      <div class="footer-main-content">
        <slot name="content"></slot>
      </div>

      <div class="footer-secondary-nav">
        <slot name="secondary-nav"></slot>
      </div>
      <bd-divider-horizontal width="100%" color="inverse" opacity="0.25"></bd-divider-horizontal>
      <div class="footer-extra">
        <div class="footer-copy">
          <slot name="copyright">
            Copyright © 1997 - ${t} Bitdefender
          </slot>
        </div>
        
        ${n?e`
          <div class="footer-anpc-lp">
            <slot name="anpc">${s}</slot>
          </div>
        `:``}
      </div>
    </footer>
  `}_hasSecondaryNavContent(){let e=this.shadowRoot?.querySelector(`slot[name="secondary-nav"]`);return e?e.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.ELEMENT_NODE||e.nodeType===Node.TEXT_NODE&&e.textContent.trim()!==``):!1}_hasSlotContent(e){let t=this.shadowRoot?.querySelector(`slot[name="${e}"]`);if(!t)return!1;let n=t.assignedNodes({flatten:!0});return n.length>0&&(n.length!==1||n[0].nodeType!==Node.TEXT_NODE||n[0].textContent.trim()!==``)}static{this.styles=[o,f]}};i([n({type:String,attribute:`current-locale`})],p.prototype,`currentLocale`,void 0),p=i([r(`bd-footer-lp`)],p);export{p as BdFooterLP};