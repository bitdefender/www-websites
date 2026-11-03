import{a as e,l as t,t as n}from"../../_chunks/lit.js";import{n as r,t as i}from"../../_chunks/lit2.js";import{n as a,t as o}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design6.js";import"../../_chunks/repobit-dex-system-design8.js";import{t as s}from"../../_chunks/repobit-dex-system-design9.js";import{i as c,n as l,r as u,t as d}from"../../_chunks/repobit-dex-system-design10.js";var f=t`:host{display:block}:host(bd-accordion-bg-item[data-variant=terms-of-use]){border-radius:var(--radius-none);background-color:#0000!important}:host(bd-accordion-bg-item){margin-bottom:var(--spacing-16);box-sizing:border-box;background-color:var(--status-brand-surface);border-radius:var(--shape-radius-lg);display:block;overflow:visible}:host(bd-accordion-bg-item[data-variant=terms-of-use]) .disclosure:has(>.header:focus-visible),:host(bd-accordion-bg-item[no-bg]) .disclosure:has(>.bd-accordion-bg-question:focus-visible){border-radius:var(--focus-outline-radius)}.disclosure.bd-accordion-bg-item{padding-inline:var(--spacing-16)}:host(bd-accordion-bg-item[no-bg]) .disclosure{padding-inline:0}:host(bd-accordion-bg-item[no-bg]){margin-bottom:var(--spacing-16);border-radius:var(--radius-none);background-color:#0000;overflow:visible}:host(bd-accordion-bg-item[no-bg]:last-of-type){margin-bottom:0}::slotted(bd-p){padding-bottom:0}::slotted(bd-list){--bd-li-margin-bottom:var(--spacing-16);margin-bottom:var(--spacing-16);display:block}::slotted(bd-list:last-child){margin-bottom:0}::slotted([slot=footer]){padding-top:var(--spacing-16);font-style:italic;display:block}.bd-accordion-bg-item{background-color:#0000;margin-bottom:0;overflow:visible}.bd-accordion-bg-question{cursor:pointer;justify-content:flex-start;align-items:flex-start;gap:var(--spacing-12);width:100%;padding:var(--spacing-16) 0;font:inherit;text-align:start;font-family:var(--typography-control-label-xl-fontFamily);font-size:var(--typography-control-label-xl-fontSize);font-weight:var(--typography-control-label-xl-fontWeight);line-height:var(--typography-control-label-xl-lineHeight);color:var(--color-text-primary);transition:color var(--transition-duration-normal) var(--transition-easing-smooth);background-color:#0000;border:none;margin:0;display:flex}.bd-accordion-bg-question[aria-expanded=true]{color:var(--color-text-brand)}.bd-accordion-bg-question[aria-expanded=false]{color:var(--color-text-primary)}.bd-accordion-bg-question:hover{color:var(--color-text-brand)}.bd-accordion-bg-question:hover .bd-accordion-bg-question-text{text-decoration-line:none}.bd-accordion-bg-question:focus-visible{outline:none}.bd-accordion-bg-header{margin-bottom:var(--spacing-32)}.bd-accordion-bg-question-text{font-family:inherit;font-weight:inherit;font-size:inherit}.bd-accordion-bg-title{text-align:center;margin-inline:auto}.bd-accordion-bg-icon{width:var(--icon-sm-size);height:var(--icon-sm-size);min-width:var(--icon-sm-size);line-height:var(--typography-lineHeight-none);-webkit-user-select:none;user-select:none;margin-top:calc((var(--typography-control-label-xl-lineHeight) * 1em - var(--icon-sm-size)) / 2);flex-shrink:0;justify-content:center;align-items:center;display:flex}.bd-accordion-bg-answer{padding-block:var(--spacing-0);padding-inline:calc(var(--icon-sm-size) + var(--spacing-12)) var(--spacing-0);font-family:var(--typography-fontFamily-sans);font-size:var(--typography-body-small-fontSize);font-weight:var(--typography-body-small-fontWeight);line-height:var(--typography-body-small-lineHeight);color:var(--color-text-primary);background-color:#0000;overflow:hidden}.bd-accordion-bg-answer[hidden]:not([hidden=until-found i]){display:none!important}.bd-accordion-bg-item.open .bd-accordion-bg-answer{padding-block:var(--spacing-0) var(--spacing-16);padding-inline:calc(var(--icon-sm-size) + var(--spacing-12)) var(--spacing-0)}::slotted(p){margin:var(--spacing-0)}.bd-accordion-bg-container{padding-top:var(--spacing-64);padding-bottom:var(--spacing-64);margin:auto}.bd-accordion-bg-container.no-bg{background:0 0}.bd-accordion-bg-container.no-padding{padding-top:0;padding-bottom:0}.bd-accordion-bg-inner{box-sizing:border-box}.bd-accordion-bg-item.no-bg{background-color:#0000;border:none}.bd-accordion-bg-item.no-bg .bd-accordion-bg-question{background-color:#0000}.bd-accordion-bg-item.no-bg .bd-accordion-bg-answer{padding:0 var(--spacing-40);background-color:#0000}.bd-accordion-bg-item.no-bg.open .bd-accordion-bg-answer{padding:var(--spacing-16) var(--spacing-40)}.bd-accordion-bg-item.no-bg:hover{background-color:#0000}.bd-accordion-bg-item.no-bg .bd-accordion-bg-question:hover .bd-accordion-bg-question-text{text-decoration-line:none}@media (prefers-reduced-motion:reduce){.bd-accordion-bg-question{transition:none}}`,p=class extends n{constructor(...e){super(...e),this.title=``,this.noBg=!1,this.noPadding=!1,this.guideIcon=``,this.guideLabel=``,this.guideHref=`#`,this._variant=`default`,this.variant=`default`}static{this.styles=[s,f,u]}connectedCallback(){super.connectedCallback(),Promise.resolve().then(()=>this._detectVariant())}_detectVariant(){let e=this.parentElement;for(;e;){if(e.classList.contains(`faq`)){this._variant=`faq`,this.variant=`faq`,this._propagateVariant(`faq`);return}if(e.classList.contains(`terms-of-use`)||e.classList.contains(`system-requirements`)){this._variant=`terms-of-use`,this.variant=`terms-of-use`,this._propagateVariant(`terms-of-use`);return}e=e.parentElement}this._variant=`default`,this.variant=`default`,this._propagateVariant(`default`)}_propagateVariant(e){this.querySelectorAll(`bd-accordion-bg-item`).forEach(t=>{t.setAttribute(`data-variant`,e)})}_renderFaq(){return e`
    <div class="bd-accordion-bg-container ${this.noBg?`no-bg`:``} ${this.noPadding?`no-padding`:``}">
      <div class="bd-ensemble bd-accordion-bg-inner">
        <div class="bd-accordion-bg-header">
          <bd-h as="h2" class="bd-accordion-bg-title">${this.title}</bd-h>
        </div>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    </div>
  `}_renderTerms(){return e`
    <div class="bd-accordion-section-container">
      <div class="bd-ensemble bd-accordion-section-inner">
        ${this.title?e`<bd-h as="h6" paddingBottom="32" fontWeight="bold" class="section-title">${this.title}</bd-h>`:``}
        <slot></slot>
        <slot name="footer"></slot>
        ${this.guideLabel?e`
              <p class="user-guide-link">
                <a href=${this.guideHref}>
                  ${this.guideIcon?e`<bd-plus-icon  size="16" color="var(--color-text-brand)"></bd-plus-icon>`:``}
                  ${this.guideLabel}
                </a>
              </p>`:``}
      </div>
    </div>
  `}render(){return this._variant===`terms-of-use`?this._renderTerms():this._renderFaq()}};o([r({type:String})],p.prototype,`title`,void 0),o([r({type:Boolean,reflect:!0,attribute:`no-bg`})],p.prototype,`noBg`,void 0),o([r({type:Boolean,reflect:!0,attribute:`no-padding`})],p.prototype,`noPadding`,void 0),o([r({type:String,reflect:!0,attribute:`guide-icon`})],p.prototype,`guideIcon`,void 0),o([r({type:String,reflect:!0,attribute:`guide-label`})],p.prototype,`guideLabel`,void 0),o([r({type:String,reflect:!0,attribute:`guide-href`})],p.prototype,`guideHref`,void 0),o([i()],p.prototype,`_variant`,void 0),o([r({type:String,reflect:!0,attribute:`data-variant`})],p.prototype,`variant`,void 0),p=o([a(`bd-accordion-bg`)],p);var m=class extends n{constructor(){super(),this.title=``,this.open=!1,this.noBg=!1,this._variant=`default`,this.variant=`default`;let e=Math.random().toString(36).slice(2,11);this._headerId=`acc-bg-h-${e}`,this._panelId=`acc-bg-p-${e}`}static{this.styles=[f,c]}connectedCallback(){super.connectedCallback(),Promise.resolve().then(()=>this._detectVariant())}_detectVariant(){let e=this.parentElement;for(;e;){if(e.classList.contains(`faq`)){this._variant=`faq`,this.variant=`faq`;return}if(e.classList.contains(`terms-of-use`)||e.classList.contains(`system-requirements`)){this._variant=`terms-of-use`,this.variant=`terms-of-use`;return}e=e.parentElement}this._variant=`default`,this.variant=`default`}toggleItem(){this.open=!this.open}_onBeforeMatch(){this.open=!0}_onTriggerKeydown(e){l(this,e)}focusTrigger(){this.renderRoot?.querySelector(`.bd-accordion-bg-question, .header`)?.focus()}_renderTerms(){return e`<div class="disclosure">
      <button
        type="button"
        class="header"
        aria-expanded="${this.open}"
        aria-controls="${this._panelId}"
        @click=${this.toggleItem}
        @keydown=${this._onTriggerKeydown}
      >
        <span class="toggle" aria-hidden="true">
          ${this.open?e`<bd-minus-icon size="16" color="var(--color-text-brand)"></bd-minus-icon>`:e`<bd-plus-icon  size="16" color="var(--color-text-brand)"></bd-plus-icon>`}
        </span>
        <span class="title">${this.title}</span>
      </button>
      <div
        id="${this._panelId}"
        class="content"
        hidden=${d(this.open)}
        @beforematch=${this._onBeforeMatch}
      >
        <slot></slot>
      </div>
    </div>`}_renderDefault(){return e`
      <div class="disclosure bd-accordion-bg-item ${this.open?`open`:``} ${this.noBg?`no-bg`:``}">
        <button
          type="button"
          id="${this._headerId}"
          class="bd-accordion-bg-question"
          aria-expanded="${this.open}"
          aria-controls="${this._panelId}"
          @click=${this.toggleItem}
          @keydown=${this._onTriggerKeydown}
        >
          <span class="bd-accordion-bg-icon" aria-hidden="true">
            ${this.open?e`<bd-minus-icon size="16" color="var(--color-text-brand)"></bd-minus-icon>`:e`<bd-plus-icon  size="16" color="var(--color-text-brand)"></bd-plus-icon>`}
          </span>
          <span class="bd-accordion-bg-question-text">${this.title}</span>
        </button>
        <div
          id="${this._panelId}"
          class="bd-accordion-bg-answer"
          role="region"
          aria-labelledby="${this._headerId}"
          hidden=${d(this.open)}
          @beforematch=${this._onBeforeMatch}
        >
          <slot></slot>
        </div>
      </div>
    `}render(){return this._variant===`terms-of-use`?this._renderTerms():this._renderDefault()}};o([r({type:String})],m.prototype,`title`,void 0),o([r({type:Boolean,reflect:!0})],m.prototype,`open`,void 0),o([r({type:Boolean,reflect:!0,attribute:`no-bg`})],m.prototype,`noBg`,void 0),o([i()],m.prototype,`_variant`,void 0),o([r({type:String,reflect:!0,attribute:`data-variant`})],m.prototype,`variant`,void 0),m=o([a(`bd-accordion-bg-item`)],m);