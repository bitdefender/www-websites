import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import"../paragraph/paragraph.js";import{t as s}from"../shared/ensemble.css.js";var c=r`:host{font-family:var(--typography-fontFamily-sans);background:radial-gradient(1200px 600px at 78% -10%, var(--color-brand-400) 0%, transparent 55%), linear-gradient(160deg, var(--color-brand-500) 0%, var(--color-brand-700) 48%, var(--color-brand-950) 100%);display:block}.bd-ctabanner-container{padding-block:var(--spacing-64);box-sizing:border-box;text-align:center;align-items:center;gap:var(--spacing-16);flex-direction:column;display:flex}.bd-ctabanner-footer{margin-top:var(--spacing-24);align-items:center;gap:var(--spacing-8);text-align:center;flex-direction:column;display:flex}.bd-ctabanner-footer:not(:has(*)){display:none}.bd-ctabanner-title{max-width:800px;margin:0;display:block}.bd-ctabanner-description{margin:0 0 var(--spacing-16);max-width:640px;display:block}.bd-ctabanner-cta{justify-content:center;gap:var(--spacing-16);flex-wrap:wrap;display:flex}.bd-ctabanner-caption{margin:var(--spacing-8) 0 0;color:color-mix(in srgb, var(--color-brand-on-fill) 65%, transparent);display:block}@media (width<576px){.bd-ctabanner-container{padding-block:var(--spacing-48)}.bd-ctabanner-cta{flex-direction:column;width:100%}}`,l=class extends n{constructor(...e){super(...e),this.title=``,this.description=``,this.caption=``}static{this.styles=[s,c]}render(){return e`
      <div class="bd-ensemble bd-ctabanner-container">
        ${this.title?e`
              <bd-h as="h2" color="on-brand" class="bd-ctabanner-title">
                <slot name="title">${this.title}</slot>
              </bd-h>
            `:t}

        ${this.description?e`
              <bd-p variant="large" color="on-brand" class="bd-ctabanner-description">
                <slot name="description">${this.description}</slot>
              </bd-p>
            `:t}

        <div class="bd-ctabanner-cta">
          <slot name="primary-button"></slot>
          <slot name="secondary-button"></slot>
        </div>

        ${this.caption?e`
              <bd-p variant="small" font-family="mono" class="bd-ctabanner-caption">
                <slot name="caption">${this.caption}</slot>
              </bd-p>
            `:t}

        <!-- Freeform slot for extra content below the caption — contact
             info, legal disclaimers, links, etc. Empty by default,
             collapses to nothing when unused. -->
        <div class="bd-ctabanner-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `}};o([i({type:String})],l.prototype,`title`,void 0),o([i({type:String})],l.prototype,`description`,void 0),o([i({type:String})],l.prototype,`caption`,void 0),l=o([a(`bd-cta-banner`)],l);