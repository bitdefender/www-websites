import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../paragraph/paragraph.js";import{t as s}from"../shared/ensemble.css.js";var c=r`:host{font-family:var(--typography-fontFamily-sans);display:block}.bd-infopanel-container{column-gap:var(--spacing-48);padding-block:var(--spacing-48);box-sizing:border-box;grid-template-rows:auto auto;grid-template-columns:1fr 1fr;row-gap:0;display:grid}.bd-infopanel-title{margin:0;margin-bottom:var(--spacing-48);grid-area:1/1/auto/-1}.bd-infopanel-left{gap:var(--spacing-16);flex-direction:column;grid-area:2/1;display:flex}.bd-infopanel-description{color:var(--color-text-primary);max-width:46ch;font-family:var(--typography-fontFamily-sans);margin:0}.bd-infopanel-right{flex-direction:column;grid-area:2/2;display:flex}.bd-infopanel-row{gap:var(--spacing-4);padding-top:var(--spacing-16);padding-bottom:var(--spacing-24);flex-direction:column;display:flex}.bd-infopanel-row:first-of-type{padding-top:0}.bd-infopanel-row:last-of-type{padding-bottom:0}.bd-infopanel-divider{border-top:var(--border-width-2) solid var(--color-border-brand);margin-bottom:var(--spacing-16)}.bd-infopanel-label{color:var(--color-text-muted);text-transform:uppercase;margin:0}.bd-infopanel-value{color:var(--color-text-primary);margin:0}@media (width<=899px){.bd-infopanel-container{gap:var(--spacing-32);padding:var(--spacing-32) var(--spacing-24);grid-template-rows:auto auto auto;grid-template-columns:1fr}.bd-infopanel-title{margin-bottom:var(--spacing-16);grid-area:1/1}.bd-infopanel-left{grid-area:2/1}.bd-infopanel-right{grid-area:3/1}.bd-infopanel-description{max-width:none}}`,l=class extends n{constructor(...e){super(...e),this.title=``,this.description=``,this.facts=[]}static{this.styles=[s,c]}render(){return e`
      <div class="bd-ensemble bd-infopanel-container">
        ${this.title?e`
              <bd-h as="h2" class="bd-infopanel-title">
                <slot name="title">${this.title}</slot>
              </bd-h>
            `:t}

        <div class="bd-infopanel-left">
          ${this.description?e`
                <bd-p variant="large" class="bd-infopanel-description">
                  <slot name="description">${this.description}</slot>
                </bd-p>
              `:t}

          <slot></slot>
        </div>

        <div class="bd-infopanel-right">
          ${this.facts.map(t=>e`
              <div class="bd-infopanel-row">
                <div class="bd-infopanel-divider"></div>
                <bd-p variant="xsmall" class="bd-infopanel-label">${t.label}</bd-p>
                <bd-p variant="regular" class="bd-infopanel-value">${t.value}</bd-p>
              </div>
            `)}
          <slot name="facts"></slot>
        </div>
      </div>
    `}};o([i({type:String})],l.prototype,`title`,void 0),o([i({type:String})],l.prototype,`description`,void 0),o([i({type:Array})],l.prototype,`facts`,void 0),l=o([a(`bd-overview`)],l);