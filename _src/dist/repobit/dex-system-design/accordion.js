import{i as e,t}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import"../../_chunks/repobit-dex-system-design5.js";import"../../_chunks/repobit-dex-system-design6.js";import"../../_chunks/repobit-dex-system-design7.js";import"../../_chunks/repobit-dex-system-design8.js";import{i as n,n as r,r as i,t as a}from"../../_chunks/repobit-dex-system-design9.js";import{t as o}from"../../_chunks/repobit-dex-system-design10.js";var s=class extends t{static styles=[i];static properties={open:{type:Boolean,reflect:!0},title:{type:String},chevron:{type:Boolean,reflect:!0},_panelId:{type:String,state:!0}};constructor(){super(),this.open=!1,this.title=``,this.chevron=!1,this._panelId=`acc-panel-${Math.random().toString(36).slice(2,11)}`}toggle(){this.open=!this.open}_onBeforeMatch(){this.open=!0}_onTriggerKeydown(e){r(this,e)}focusTrigger(){this.renderRoot?.querySelector(`.header`)?.focus()}render(){let t=this.querySelector(`[slot='badge']`);return this.chevron?e`<div class="disclosure">
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
          hidden=${a(this.open)}
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
        hidden=${a(this.open)}
        @beforematch=${this._onBeforeMatch}
      >
        <slot></slot>
      </div>
    </div>`}},c=class extends t{static styles=[o,n];static properties={title:{type:String},variant:{type:String,reflect:!0},guideIcon:{type:String,reflect:!0,attribute:`guide-icon`},guideLabel:{type:String,reflect:!0,attribute:`guide-label`},guideHref:{type:String,reflect:!0,attribute:`guide-href`},noContainer:{type:Boolean,attribute:`no-container`}};constructor(){super(),this.title=``,this.variant=`default`,this.guideIcon=``,this.guideLabel=``,this.guideHref=`#`,this.noContainer=!1}render(){let t=e`
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
    `}};customElements.define(`bd-accordion-item`,s),customElements.define(`bd-accordion-section`,c);export{s as BdAccordionItem,c as BdAccordionSection};