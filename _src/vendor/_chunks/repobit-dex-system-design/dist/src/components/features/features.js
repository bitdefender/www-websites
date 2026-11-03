import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r,t as i}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../paragraph/paragraph.js";import{t as a}from"../shared/ensemble.css.js";import"../accordion/accordion.js";import"../image/image.js";var o=n`:host{--bd-acc-header-margin-bottom:var(--spacing-8);box-sizing:border-box;width:100%;padding-top:var(--spacing-64);padding-bottom:var(--bd-features-padding-bottom,var(--spacing-64));justify-content:center;display:flex;container-type:inline-size}.bd-features-container{column-gap:var(--spacing-32);grid-template-rows:repeat(4,auto);grid-auto-columns:minmax(0,400px);grid-auto-flow:column;row-gap:0;width:fit-content;max-width:100%;margin-inline:auto;display:grid}.bd-col{grid-row:span 4;grid-template-rows:subgrid;align-content:start;min-width:0;display:grid}.col-icon-wrapper{grid-row:1}.col-title-wrapper{grid-row:2}.col-description{grid-row:3}.bd-col>bd-accordion-section{grid-row:4;align-self:start}.col-icon-wrapper,.col-title-wrapper{margin-bottom:var(--spacing-8);align-items:flex-start;display:flex;overflow:hidden}.col-description{margin-bottom:var(--spacing-24);font-family:var(--typography-fontFamily-sans);font-size:var(--typography-body-regular-fontSize);color:var(--color-text-secondary);line-height:var(--typography-body-regular-lineHeight);overflow:hidden}@container (width<=600px){.bd-features-container{row-gap:var(--spacing-32);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-auto-flow:row;width:100%}.bd-col{flex-direction:column;grid-row:auto;display:flex}.bd-col>bd-accordion-section{align-self:stretch}}`,s=class extends HTMLElement{};s=i([r(`bd-feature-col`)],s);var c=class extends t{static{this.styles=[a,o]}_getCols(){return Array.from(this.querySelectorAll(`:scope > bd-feature-col`))}_renderCol(t){let n=t.querySelector(`[slot='description']`),r=t.querySelector(`[slot='icon']`),i=t.querySelector(`bd-accordion-section`),a=t.getAttribute(`title`),o=t.getAttribute(`icon-src`),s=t.getAttribute(`icon-alt`)||``;return e`
      <div class="bd-col">
        <div class="col-icon-wrapper">
          ${o?e`<bd-img
                src="${o}"
                alt="${s}"
                width="40"
                height="40"
                fit="contain"
                radius="none"
                shadow="none"
                loading="lazy"
              ></bd-img>`:r?r.cloneNode(!0):``}
        </div>
        <div class="col-title-wrapper">
          <bd-h as="h4">${a}</bd-h>
        </div>
        ${n?e`<div class="col-description"><bd-p variant="regular">${n.textContent}</bd-p></div>`:``}
        ${i?(()=>{let e=i.cloneNode(!0);return e.querySelectorAll(`bd-accordion-item`).forEach(e=>{e.style.setProperty(`--bd-acc-header-margin-bottom`,`var(--spacing-8)`)}),e})():``}
      </div>
    `}render(){return e`
      <div class="bd-ensemble">
      <div class="bd-features-container">
        ${this._getCols().map(e=>this._renderCol(e))}
      </div>
      </div>
    `}};c=i([r(`bd-features`)],c);