import{n as e}from"../../../../../deepmerge/dist/cjs.js";import{a as t,t as n}from"../../../../../lit/index.js";import{n as r,t as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../icons/minus-icon.js";import"../icons/plus-icon.js";import"../paragraph/paragraph.js";import{t as s}from"../shared/ensemble.css.js";import{i as c,n as l,r as u,t as d}from"./accordion-panel.js";import"../icons/arrow-down-icon.js";import"../icons/arrow-up-icon.js";var f=/* @__PURE__ */ e({BdAccordionItem:()=>p,BdAccordionSection:()=>m}),p=class extends n{constructor(...e){super(...e),this.open=!1,this.title=``,this.chevron=!1,this._panelId=`acc-panel-${Math.random().toString(36).slice(2,11)}`}static{this.styles=[c]}toggle(){this.open=!this.open}_onBeforeMatch(){this.open=!0}_onTriggerKeydown(e){l(this,e)}focusTrigger(){this.renderRoot?.querySelector(`.header`)?.focus()}render(){let e=this.querySelector(`[slot='badge']`);return this.chevron?t`<div class="disclosure">
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
            ${e?e.cloneNode(!0):``}
          </span>
          <span class="toggle toggle--chevron" aria-hidden="true">
            ${this.open?t`<bd-arrow-up-icon size="16" color="var(--color-text-brand)"></bd-arrow-up-icon>`:t`<bd-arrow-down-icon size="16" color="var(--color-text-brand)"></bd-arrow-down-icon>`}
          </span>
        </button>
        <div
          id="${this._panelId}"
          class="content content--chevron"
          hidden=${d(this.open)}
          @beforematch=${this._onBeforeMatch}
        >
          <slot></slot>
        </div>
      </div>`:t`<div class="disclosure">
      <button
        type="button"
        class="header"
        aria-expanded="${this.open}"
        aria-controls="${this._panelId}"
        @click=${this.toggle}
        @keydown=${this._onTriggerKeydown}
      >
        <span class="toggle" aria-hidden="true">
          ${this.open?t`<bd-minus-icon size="16" color="var(--color-text-brand)"></bd-minus-icon>`:t`<bd-plus-icon  size="16" color="var(--color-text-brand)"></bd-plus-icon>`}
        </span>
        <span class="title-badge-wrapper">
          <span class="title">${this.title}</span>
          ${e?e.cloneNode(!0):``}
        </span>
      </button>
      <div
        id="${this._panelId}"
        class="content"
        hidden=${d(this.open)}
        @beforematch=${this._onBeforeMatch}
      >
        <slot></slot>
      </div>
    </div>`}};o([r({type:Boolean,reflect:!0})],p.prototype,`open`,void 0),o([r({type:String})],p.prototype,`title`,void 0),o([r({type:Boolean,reflect:!0})],p.prototype,`chevron`,void 0),o([i()],p.prototype,`_panelId`,void 0),p=o([a(`bd-accordion-item`)],p);var m=class extends n{constructor(...e){super(...e),this.title=``,this.variant=`default`,this.guideIcon=``,this.guideLabel=``,this.guideHref=`#`,this.noContainer=!1}static{this.styles=[s,u]}render(){let e=t`
      ${this.title?t`<bd-h as="h6" fontWeight="bold" class="section-title">${this.title}</bd-h>`:``}
      <slot></slot>
      ${this.guideLabel?t`
            <bd-p variant="small" class="user-guide-link">
              <a href=${this.guideHref}>
                ${this.guideIcon?t`<span class="icon"><img src=${this.guideIcon} alt="" /></span>`:``}
                ${this.guideLabel}
              </a>
            </bd-p>`:``}
    `;return this.noContainer?e:t`
      <div class="bd-accordion-section-container">
        <div class="bd-ensemble bd-accordion-section-inner">
          ${e}
        </div>
      </div>
    `}};o([r({type:String})],m.prototype,`title`,void 0),o([r({type:String,reflect:!0})],m.prototype,`variant`,void 0),o([r({type:String,reflect:!0,attribute:`guide-icon`})],m.prototype,`guideIcon`,void 0),o([r({type:String,reflect:!0,attribute:`guide-label`})],m.prototype,`guideLabel`,void 0),o([r({type:String,reflect:!0,attribute:`guide-href`})],m.prototype,`guideHref`,void 0),o([r({type:Boolean,attribute:`no-container`})],m.prototype,`noContainer`,void 0),m=o([a(`bd-accordion-section`)],m);export{f as t};