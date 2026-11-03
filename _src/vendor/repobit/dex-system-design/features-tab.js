import{a as e,l as t,t as n}from"../../_chunks/lit.js";import{n as r}from"../../_chunks/lit2.js";import{n as i,t as a}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design4.js";import"../../_chunks/repobit-dex-system-design8.js";import{t as o}from"../../_chunks/repobit-dex-system-design9.js";import"../../_chunks/repobit-dex-system-design13.js";import"../../_chunks/repobit-dex-system-design23.js";var s=t`:host{box-sizing:border-box;width:100%;display:block}.bd-features-tab-container{align-items:center;gap:var(--spacing-64);width:100%;animation:bd-fade-slide-right var(--transition-duration-slow) var(--transition-easing-ease) forwards;display:flex}.bd-features-tab-left{align-items:flex-start;gap:var(--spacing-24);flex-direction:column;flex:1;display:flex}.bd-features-tab-content{gap:var(--spacing-8);flex-direction:column;display:flex}.bd-features-tab-right{flex:1;justify-content:center;align-items:center;display:flex}::slotted([slot=heading]){margin:0}::slotted([slot=media]){border-radius:var(--shape-radius-lg);width:100%;max-width:520px;height:auto;display:block}@media (prefers-reduced-motion:reduce){.bd-features-tab-container{animation:none}}@keyframes bd-fade-slide-right{0%{opacity:0;transform:translate(24px)}to{opacity:1;transform:translate(0)}}@media (width<992px){.bd-features-tab-container{gap:var(--spacing-32);flex-direction:column-reverse}.bd-features-tab-container.bd-features-tab-reverse{flex-direction:column-reverse}.bd-features-tab-left{text-align:center;align-items:center}::slotted([slot=media]){max-width:100%}}@media (width<576px){.bd-features-tab-container{gap:var(--spacing-24)}}`,c=class extends n{constructor(...e){super(...e),this.ctaLabel=``,this.ctaHref=`#`,this.ctaKind=`danger`,this.ctaSize=``,this.reverse=!1}static{this.styles=[o,s]}render(){let t=this.querySelector(`[slot='cta']`),n=this.querySelector(`[slot='media']`),r=e`
      <div class="bd-features-tab-left">
        <slot name="heading"></slot>
        <div class="bd-features-tab-content">
          <slot name="content"></slot>
        </div>
        ${t?e`<slot name="cta"></slot>`:this.ctaLabel?e`
                <bd-button-link
                  href="${this.ctaHref}"
                  variant="${this.ctaKind}"
                  size="${this.ctaSize}"
                  label="${this.ctaLabel}"
                >
                  ${this.ctaLabel}
                </bd-button-link>`:``}
      </div>
    `,i=e`
      <div class="bd-features-tab-right">
        ${n?e`<slot name="media"></slot>`:``}
      </div>
    `;return e`
      <div class="bd-ensemble bd-features-tab-container ${this.reverse?`bd-features-tab-reverse`:``}">
        ${this.reverse?e`${i}${r}`:e`${r}${i}`}
      </div>
    `}};a([r({type:String,attribute:`cta-label`})],c.prototype,`ctaLabel`,void 0),a([r({type:String,attribute:`cta-href`})],c.prototype,`ctaHref`,void 0),a([r({type:String,attribute:`cta-kind`})],c.prototype,`ctaKind`,void 0),a([r({type:String,attribute:`cta-size`})],c.prototype,`ctaSize`,void 0),a([r({type:Boolean,reflect:!0})],c.prototype,`reverse`,void 0),c=a([i(`bd-features-tab`)],c);