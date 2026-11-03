import{a as e,t}from"../../_chunks/lit.js";import{n,t as r}from"../../_chunks/lit2.js";import{n as i,t as a}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design6.js";import"../../_chunks/repobit-dex-system-design8.js";import{t as o}from"../../_chunks/repobit-dex-system-design9.js";import{i as s,n as c,r as l,t as u}from"../../_chunks/repobit-dex-system-design10.js";import"../../_chunks/repobit-dex-system-design11.js";import"../../_chunks/repobit-dex-system-design12.js";var d=class extends t{constructor(...e){super(...e),this.open=!1,this.title=``,this.chevron=!1,this._panelId=`acc-panel-${Math.random().toString(36).slice(2,11)}`}static{this.styles=[s]}toggle(){this.open=!this.open}_onBeforeMatch(){this.open=!0}_onTriggerKeydown(e){c(this,e)}focusTrigger(){this.renderRoot?.querySelector(`.header`)?.focus()}render(){let t=this.querySelector(`[slot='badge']`);return this.chevron?e`<div class="disclosure">
        <button
          type="button"
          class="header header--chevron"
          aria-expanded="${this.open}"
          aria-controls="${this._panelId}"
          @click=${this.toggle}
          @keydown=${this._onTriggerKeydown}
        >
          <span class="title-badge-wrapper">
            <span class="title">${this.title}</span>
            ${t?t.cloneNode(!0):``}
          </span>
          <span class="toggle toggle--chevron" aria-hidden="true">
            ${this.open?e`<bd-arrow-up-icon size="16" color="var(--color-text-brand)"></bd-arrow-up-icon>`:e`<bd-arrow-down-icon size="16" color="var(--color-text-brand)"></bd-arrow-down-icon>`}
          </span>
        </button>
        <div
          id="${this._panelId}"
          class="content content--chevron"
          hidden=${u(this.open)}
          @beforematch=${this._onBeforeMatch}
        >
          <slot></slot>
        </div>
      </div>`:e`<div class="disclosure">
      <button
        type="button"
        class="header"
        aria-expanded="${this.open}"
        aria-controls="${this._panelId}"
        @click=${this.toggle}
        @keydown=${this._onTriggerKeydown}
      >
        <span class="toggle" aria-hidden="true">
          ${this.open?e`<bd-minus-icon size="16" color="var(--color-text-brand)"></bd-minus-icon>`:e`<bd-plus-icon  size="16" color="var(--color-text-brand)"></bd-plus-icon>`}
        </span>
        <span class="title-badge-wrapper">
          <span class="title">${this.title}</span>
          ${t?t.cloneNode(!0):``}
        </span>
      </button>
      <div
        id="${this._panelId}"
        class="content"
        hidden=${u(this.open)}
        @beforematch=${this._onBeforeMatch}
      >
        <slot></slot>
      </div>
    </div>`}};a([n({type:Boolean,reflect:!0})],d.prototype,`open`,void 0),a([n({type:String})],d.prototype,`title`,void 0),a([n({type:Boolean,reflect:!0})],d.prototype,`chevron`,void 0),a([r()],d.prototype,`_panelId`,void 0),d=a([i(`bd-accordion-item`)],d);var f=class extends t{constructor(...e){super(...e),this.title=``,this.variant=`default`,this.guideIcon=``,this.guideLabel=``,this.guideHref=`#`,this.noContainer=!1}static{this.styles=[o,l]}render(){let t=e`
      ${this.title?e`<bd-h as="h6" fontWeight="bold" class="section-title">${this.title}</bd-h>`:``}
      <slot></slot>
      ${this.guideLabel?e`
            <bd-p variant="small" class="user-guide-link">
              <a href=${this.guideHref}>
                ${this.guideIcon?e`<span class="icon"><img src=${this.guideIcon} alt="" /></span>`:``}
                ${this.guideLabel}
              </a>
            </bd-p>`:``}
    `;return this.noContainer?t:e`
      <div class="bd-accordion-section-container">
        <div class="bd-ensemble bd-accordion-section-inner">
          ${t}
        </div>
      </div>
    `}};a([n({type:String})],f.prototype,`title`,void 0),a([n({type:String,reflect:!0})],f.prototype,`variant`,void 0),a([n({type:String,reflect:!0,attribute:`guide-icon`})],f.prototype,`guideIcon`,void 0),a([n({type:String,reflect:!0,attribute:`guide-label`})],f.prototype,`guideLabel`,void 0),a([n({type:String,reflect:!0,attribute:`guide-href`})],f.prototype,`guideHref`,void 0),a([n({type:Boolean,attribute:`no-container`})],f.prototype,`noContainer`,void 0),f=a([i(`bd-accordion-section`)],f);export{d as BdAccordionItem,f as BdAccordionSection};