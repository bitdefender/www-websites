import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../paragraph/paragraph.js";import{t as s}from"../shared/ensemble.css.js";import"../icons/close-icon.js";import"../icons/globe-icon.js";import"../icons/guide-icon.js";var c=r`:host{font-family:var(--typography-fontFamily-sans);background:linear-gradient(160deg, var(--color-neutral-800) 0%, #0b1626 100%);display:block}.bd-processsteps-container{color:var(--color-text-inverse);padding-block:var(--spacing-64);box-sizing:border-box}.bd-processsteps-title{margin:0 0 var(--spacing-12);max-width:900px;margin-left:auto;margin-right:auto;display:block}.bd-processsteps-description{margin:0 0 var(--spacing-40);color:var(--color-text-muted-inverse);max-width:900px;margin-left:auto;margin-right:auto;display:block}.bd-processsteps-grid{gap:var(--spacing-32);grid-template-columns:repeat(3,1fr);max-width:900px;margin:0 auto;display:grid}.bd-processsteps-step{flex-direction:column;display:flex}.bd-processsteps-divider{border-top:var(--border-width-1) solid var(--color-border-container-inverse);margin-bottom:var(--spacing-24)}.bd-processsteps-icon-wrap{width:var(--dimension-40);height:var(--dimension-40);margin-bottom:var(--spacing-16);color:var(--color-text-inverse);justify-content:center;align-items:center;display:flex}.bd-processsteps-icon-img{object-fit:contain;width:100%;height:100%}.bd-processsteps-step-title{margin:0 0 var(--spacing-8);display:block}.bd-processsteps-step-description{color:var(--color-text-muted-inverse);margin:0;display:block}@media (width<=899px){.bd-processsteps-grid{gap:var(--spacing-32);grid-template-columns:1fr}.bd-processsteps-container{padding:var(--spacing-48) var(--spacing-24)}}`,l=class extends n{constructor(...e){super(...e),this.title=``,this.description=``,this.steps=[]}static{this.styles=[s,c]}_renderIcon(n){return n?typeof n==`string`?e`<img src="${n}" alt="" class="bd-processsteps-icon-img" />`:n:t}render(){return e`
      <div class="bd-ensemble bd-processsteps-container">
        ${this.title?e`
              <bd-h as="h2" color="inverse" class="bd-processsteps-title">
                <slot name="title">${this.title}</slot>
              </bd-h>
            `:t}

        ${this.description?e`
              <bd-p variant="regular" class="bd-processsteps-description">
                <slot name="description">${this.description}</slot>
              </bd-p>
            `:t}

        <div class="bd-processsteps-grid">
          ${this.steps.map(t=>e`
              <div class="bd-processsteps-step">
                <div class="bd-processsteps-divider"></div>
                <div class="bd-processsteps-icon-wrap">${this._renderIcon(t.icon)}</div>
                <bd-h as="h4" color="inverse" class="bd-processsteps-step-title">${t.title}</bd-h>
                <bd-p variant="regular" class="bd-processsteps-step-description">${t.description}</bd-p>
              </div>
            `)}
        </div>

        <slot name="steps"></slot>
      </div>
    `}};o([i({type:String})],l.prototype,`title`,void 0),o([i({type:String})],l.prototype,`description`,void 0),o([i({type:Array})],l.prototype,`steps`,void 0),l=o([a(`bd-process-steps`)],l);