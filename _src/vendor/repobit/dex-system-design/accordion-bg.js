import{c as e,i as t,t as n}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import"../../_chunks/repobit-dex-system-design7.js";import"../../_chunks/repobit-dex-system-design8.js";import{i as r,n as i,r as a,t as o}from"../../_chunks/repobit-dex-system-design9.js";import{t as s}from"../../_chunks/repobit-dex-system-design10.js";var c=e`
  :host {
    display: block;
  }

  :host(bd-accordion-bg-item[data-variant="terms-of-use"]) {
    background-color: transparent !important;
    border-radius: var(--radius-none);
  }

  /* The inline padding is on the item's .disclosure, not here: the focus
     ring is drawn on .disclosure (accordion.css.js), and it has to go round
     the whole tinted card, not 16px inside it. */
  :host(bd-accordion-bg-item) {
    display: block;
    margin-bottom: var(--spacing-16);
    box-sizing: border-box;
    background-color: var(--status-brand-surface);
    border-radius: var(--shape-radius-lg);
    overflow: visible;
  }

  /* The ring is accordion.css.js's .disclosure rule, which this element
     adopts, so there is one ring rule for the whole family and nothing here
     that could give one variant a different colour -- the divergence P5G
     found and P5G.1 closed stays closed by construction.

     What this sheet adds is shape, not colour. The ring follows the item's own
     corner: --radius-lg on the tinted FAQ item, which is right. The terms-of-use
     and no-bg items are transparent boxes with --radius-none, so their ring
     would be a hard rectangle, which Foundations/Focus says the ring should
     not be on an element with no shape of its own. They take the focus radius
     while focused. That changes no resting pixel -- these hosts paint no
     background and no border -- and it is the same radius the trigger used to
     take for the same reason. */
  :host(bd-accordion-bg-item[data-variant="terms-of-use"]) .disclosure:has(> .header:focus-visible),
  :host(bd-accordion-bg-item[no-bg]) .disclosure:has(> .bd-accordion-bg-question:focus-visible) {
    border-radius: var(--focus-outline-radius);
  }

  /* The tinted card's inset, which the host carried until the ring moved to
     this element. The two transparent variants have none. */
  .disclosure.bd-accordion-bg-item {
    padding-inline: var(--spacing-16);
  }

  :host(bd-accordion-bg-item[no-bg]) .disclosure {
    padding-inline: 0;
  }

  :host(bd-accordion-bg-item[no-bg]) {
    margin-bottom: var(--spacing-16);
    background-color: transparent;
    border-radius: var(--radius-none);
    overflow: visible;
  }

  :host(bd-accordion-bg-item[no-bg]:last-of-type) {
    margin-bottom: 0;
  }

  /* bd-p in bd-accordion-bg — fara padding bottom */
  ::slotted(bd-p) {
    padding-bottom: 0;
  }

  ::slotted(bd-list) {
    --bd-li-margin-bottom: var(--spacing-16);
    display: block;
    margin-bottom: var(--spacing-16);
  }

  ::slotted(bd-list:last-child) {
    margin-bottom: 0;
  }

  ::slotted([slot="footer"]) {
    display: block;
    padding-top: var(--spacing-16);
    font-style: italic;
  }
  /* No radius and no box-shadow transition of its own: this is the item's
     .disclosure, and it takes the host's corner so the focus ring does, and
     draws that ring at once, as the host did. */
  .bd-accordion-bg-item {
    margin-bottom: 0;
    background-color: transparent;
    overflow: visible;
  }

  .bd-accordion-bg-question {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: var(--spacing-12);
    width: 100%;
    padding: var(--spacing-16) 0;
    margin: 0;
    border: none;
    font: inherit;
    text-align: start;
    font-family: var(--typography-control-label-xl-fontFamily);
    font-size: var(--typography-control-label-xl-fontSize);
    font-weight: var(--typography-control-label-xl-fontWeight);
    line-height: var(--typography-control-label-xl-lineHeight);
    background-color: transparent;
    color: var(--color-text-primary);
    transition: color var(--transition-duration-normal) var(--transition-easing-smooth);
  }

  .bd-accordion-bg-question[aria-expanded="true"] {
    /* 18px/600 on the blue-50 item ground — below WCAG large (18.66px bold),
       so it needs 4.5:1. blue-500 measured 4.20:1. */
    color: var(--color-text-brand);
  }

  .bd-accordion-bg-question[aria-expanded="false"] {
    color: var(--color-text-primary);
  }

  .bd-accordion-bg-question:hover {
    color: var(--color-text-brand);
  }

  .bd-accordion-bg-question:hover .bd-accordion-bg-question-text {
    text-decoration-line: none;
  }

  /* No ring on the trigger; see the note on .header:focus-visible in
     accordion.css.js. The item draws it. */
  .bd-accordion-bg-question:focus-visible {
    outline: none;
  }

  .bd-accordion-bg-header {
    margin-bottom: var(--spacing-32);
  }

  .bd-accordion-bg-question-text {
    font-family: inherit;
    font-weight: inherit;
    font-size: inherit;
  }

  .bd-accordion-bg-title {
    margin-inline: auto;
    text-align: center;
  }

  .bd-accordion-bg-icon {
    width: var(--icon-sm-size);
    height: var(--icon-sm-size);
    min-width: var(--icon-sm-size);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    /* the box holds an icon, not text; none collapses the leading to the
       glyph rather than reserving a text line around it */
    line-height: var(--typography-lineHeight-none);
    /* Safari reads only the prefixed property */
    -webkit-user-select: none;
    user-select: none;
    /* Derived, like accordion.css.js's .toggle: half the difference between
       the first line box and the glyph. The 1.3 that stood here was a literal
       and it did not match this question's own leading -- the text is set at
       control-label-xl, whose line-height is tight (1.25) -- so the glyph sat
       below the optical centre of the type it is meant to align with. */
    margin-top: calc(
      (var(--typography-control-label-xl-lineHeight) * 1em - var(--icon-sm-size)) / 2
    );
  }

  /* A ".bd-accordion-bg-icon img" rule stood here and could never match, for
     the same reason as accordion.css.js's ".toggle img": the icon is
     <bd-plus-icon> or <bd-minus-icon> with size and color as props, not an
     <img> this stylesheet can reach. Those props carry --color-text-brand for
     the reason accordion.css.js records at the same rule. */

  /* A closed answer is [hidden]. The max-height: 0 / opacity: 0 that also
     hid it, and the 5000px / 1 that undid them when open, were a collapse
     animation transition: none had already switched off. */
  /* Indented past the icon, on the inline start where the icon is: these
     were four-value shorthands with the indent on the left, so on a
     right-to-left page the answer sat under nothing, a toggle's width away
     from the edge its question starts at. */
  .bd-accordion-bg-answer {
    overflow: hidden;
    padding-block: var(--spacing-0);
    padding-inline: calc(var(--icon-sm-size) + var(--spacing-12)) var(--spacing-0);
    background-color: transparent;
    font-family: var(--typography-fontFamily-sans);
    /* body-small: sm / normal / 1.5, which is what this already rendered on all
       three axes. Only the axes this rule declares are adopted -- the role also
       carries a family and a tracking, and importing those would change text
       the rule never spoke for. */
    font-size: var(--typography-body-small-fontSize);
    font-weight: var(--typography-body-small-fontWeight);
    line-height: var(--typography-body-small-lineHeight);
    /* -primary, the default ink. This said -secondary from the day it was
       written, and nothing ever argued for it: it arrived as a raw
       --color-neutral-700 and the token migration only renamed the step to
       whichever role carries that value. -secondary is for supporting copy
       UNDER a title; an answer is the payload of the disclosure, which is body
       copy, and every accordion panel already resolves to -primary. */
    color: var(--color-text-primary);
  }

  /* plain hidden only; see the note at .content[hidden] in accordion.css.js */
  .bd-accordion-bg-answer[hidden]:not([hidden="until-found" i]) {
    display: none !important;
  }

  .bd-accordion-bg-item.open .bd-accordion-bg-answer {
    padding-block: var(--spacing-0) var(--spacing-16);
    padding-inline: calc(var(--icon-sm-size) + var(--spacing-12)) var(--spacing-0);
  }

  ::slotted(p) {
    margin: var(--spacing-0);
  }

  /* A ".bd-accordion-bg-answer > div { overflow: hidden }" rule stood here and
     could never match, and its reason differs from the icon rules above. The
     answer region contains a single <slot>, so its children in the SHADOW tree
     are the slot, not the consumer's markup -- a child combinator never reaches
     slotted content. ::slotted(div) would, and is deliberately not substituted:
     nothing has been clipping here, so turning the clip on now is a behaviour
     change to every accordion body, not a repair. */

  /* FAQ container — padding 64px top/bottom */
  .bd-accordion-bg-container {
    margin: auto;
    padding-top: var(--spacing-64);
    padding-bottom: var(--spacing-64);
  }

  .bd-accordion-bg-container.no-bg {
    background: none;
  }

  .bd-accordion-bg-container.no-padding {
    padding-top: 0;
    padding-bottom: 0;
  }

  /* Inner — the page column, centred */
  .bd-accordion-bg-inner {
    box-sizing: border-box;
  }

  .bd-accordion-bg-item.no-bg {
    background-color: transparent;
    border: none;
  }

  .bd-accordion-bg-item.no-bg .bd-accordion-bg-question {
    background-color: transparent;
  }

  .bd-accordion-bg-item.no-bg .bd-accordion-bg-answer {
    background-color: transparent;
    padding: 0 var(--spacing-40);
  }

  .bd-accordion-bg-item.no-bg.open .bd-accordion-bg-answer {
    padding: var(--spacing-16) var(--spacing-40);
  }

  .bd-accordion-bg-item.no-bg:hover {
    background-color: transparent;
  }

  .bd-accordion-bg-item.no-bg .bd-accordion-bg-question:hover .bd-accordion-bg-question-text {
    text-decoration-line: none;
  }

  /* A reader who asked for less motion was still getting the question colour. Twenty-three
     of the thirty animated directories in this package honour the query; this
     one did not. */
  @media (prefers-reduced-motion: reduce) {
    .bd-accordion-bg-question {
      transition: none;
    }
  }
`,l=class extends n{static properties={title:{type:String},noBg:{type:Boolean,reflect:!0,attribute:`no-bg`},noPadding:{type:Boolean,reflect:!0,attribute:`no-padding`},guideIcon:{type:String,reflect:!0,attribute:`guide-icon`},guideLabel:{type:String,reflect:!0,attribute:`guide-label`},guideHref:{type:String,reflect:!0,attribute:`guide-href`},_variant:{state:!0},variant:{type:String,reflect:!0,attribute:`data-variant`}};constructor(){super(),this.noBg=!1,this.noPadding=!1,this._variant=`default`,this.variant=`default`,this.guideIcon=``,this.guideLabel=``,this.guideHref=`#`}static styles=[s,c,r];connectedCallback(){super.connectedCallback(),Promise.resolve().then(()=>this._detectVariant())}_detectVariant(){let e=this.parentElement;for(;e;){if(e.classList.contains(`faq`)){this._variant=`faq`,this.variant=`faq`,this._propagateVariant(`faq`);return}if(e.classList.contains(`terms-of-use`)||e.classList.contains(`system-requirements`)){this._variant=`terms-of-use`,this.variant=`terms-of-use`,this._propagateVariant(`terms-of-use`);return}e=e.parentElement}this._variant=`default`,this.variant=`default`,this._propagateVariant(`default`)}_propagateVariant(e){this.querySelectorAll(`bd-accordion-bg-item`).forEach(t=>{t.setAttribute(`data-variant`,e)})}_renderFaq(){return t`
    <div class="bd-accordion-bg-container ${this.noBg?`no-bg`:``} ${this.noPadding?`no-padding`:``}">
      <div class="bd-ensemble bd-accordion-bg-inner">
        <div class="bd-accordion-bg-header">
          <bd-h as="h2" class="bd-accordion-bg-title">${this.title}</bd-h>
        </div>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    </div>
  `}_renderTerms(){return t`
    <div class="bd-accordion-section-container">
      <div class="bd-ensemble bd-accordion-section-inner">
        ${this.title?t`<bd-h as="h6" paddingBottom="32" fontWeight="bold" class="section-title">${this.title}</bd-h>`:``}
        <slot></slot>
        <slot name="footer"></slot>
        ${this.guideLabel?t`
              <p class="user-guide-link">
                <a href=${this.guideHref}>
                  ${this.guideIcon?t`<bd-plus-icon  size="16" color="var(--color-text-brand)"></bd-plus-icon>`:``}
                  ${this.guideLabel}
                </a>
              </p>`:``}
      </div>
    </div>
  `}render(){return this._variant===`terms-of-use`?this._renderTerms():this._renderFaq()}},u=class extends n{static properties={title:{type:String},open:{type:Boolean,reflect:!0},noBg:{type:Boolean,reflect:!0,attribute:`no-bg`},_variant:{state:!0},variant:{type:String,reflect:!0,attribute:`data-variant`}};constructor(){super(),this.title=``,this.open=!1,this.noBg=!1,this._variant=`default`,this.variant=`default`;let e=Math.random().toString(36).slice(2,11);this._headerId=`acc-bg-h-${e}`,this._panelId=`acc-bg-p-${e}`}static styles=[c,a];connectedCallback(){super.connectedCallback(),Promise.resolve().then(()=>this._detectVariant())}_detectVariant(){let e=this.parentElement;for(;e;){if(e.classList.contains(`faq`)){this._variant=`faq`,this.variant=`faq`;return}if(e.classList.contains(`terms-of-use`)||e.classList.contains(`system-requirements`)){this._variant=`terms-of-use`,this.variant=`terms-of-use`;return}e=e.parentElement}this._variant=`default`,this.variant=`default`}toggleItem(){this.open=!this.open}_onBeforeMatch(){this.open=!0}_onTriggerKeydown(e){i(this,e)}focusTrigger(){this.renderRoot?.querySelector(`.bd-accordion-bg-question, .header`)?.focus()}_renderTerms(){return t`<div class="disclosure">
      <button
        type="button"
        class="header"
        aria-expanded="${this.open}"
        aria-controls="${this._panelId}"
        @click=${this.toggleItem}
        @keydown=${this._onTriggerKeydown}
      >
        <span class="toggle" aria-hidden="true">
          ${this.open?t`<bd-minus-icon size="16" color="var(--color-text-brand)"></bd-minus-icon>`:t`<bd-plus-icon  size="16" color="var(--color-text-brand)"></bd-plus-icon>`}
        </span>
        <span class="title">${this.title}</span>
      </button>
      <div
        id="${this._panelId}"
        class="content"
        hidden=${o(this.open)}
        @beforematch=${this._onBeforeMatch}
      >
        <slot></slot>
      </div>
    </div>`}_renderDefault(){return t`
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
            ${this.open?t`<bd-minus-icon size="16" color="var(--color-text-brand)"></bd-minus-icon>`:t`<bd-plus-icon  size="16" color="var(--color-text-brand)"></bd-plus-icon>`}
          </span>
          <span class="bd-accordion-bg-question-text">${this.title}</span>
        </button>
        <div
          id="${this._panelId}"
          class="bd-accordion-bg-answer"
          role="region"
          aria-labelledby="${this._headerId}"
          hidden=${o(this.open)}
          @beforematch=${this._onBeforeMatch}
        >
          <slot></slot>
        </div>
      </div>
    `}render(){return this._variant===`terms-of-use`?this._renderTerms():this._renderDefault()}};customElements.define(`bd-accordion-bg`,l),customElements.define(`bd-accordion-bg-item`,u);