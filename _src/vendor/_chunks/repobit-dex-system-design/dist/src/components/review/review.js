import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r}from"../../../../../lit/decorators.js";import{n as i,t as a}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../paragraph/paragraph.js";import"../icons/quote-icon.js";var o=n`:host{height:100%;font-family:var(--typography-fontFamily-sans);box-sizing:border-box;display:block}.bd-review-card{background:var(--status-brand-surface);border-radius:var(--shape-radius-3xl);padding:var(--spacing-28);box-sizing:border-box;flex-direction:column;height:100%;display:flex}:host([variant=neutral]) .bd-review-card{background:var(--color-surface-container)}.bd-review-mark{color:var(--color-text-brand);margin-bottom:var(--spacing-8);display:block}.bd-review-quote{--bd-paragraph-color:var(--color-text-primary);margin-bottom:var(--spacing-16);flex-grow:1}.bd-review-meta{flex-direction:column;display:flex}.bd-review-source{--bd-paragraph-color:var(--color-text-primary);margin:0}.bd-review-date{color:var(--color-text-muted);font-family:var(--typography-body-small-fontFamily);font-size:var(--typography-body-small-fontSize);font-weight:var(--typography-body-small-fontWeight);line-height:var(--typography-body-small-lineHeight);letter-spacing:var(--typography-body-small-letterSpacing)}`,s=class extends t{static{this.styles=[o]}constructor(){super(),this.variant=`tint`,this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this._internals.role=this.parentElement?.localName===`bd-review-grid`?`listitem`:null}render(){return e`
      <div class="bd-review-card">
        <bd-quote-icon class="bd-review-mark" size="xl"></bd-quote-icon>

        <bd-p variant="regular" class="bd-review-quote">
          <slot name="quote"></slot>
        </bd-p>

        <div class="bd-review-meta">
          <bd-p variant="small" font-weight="bold" class="bd-review-source"><slot name="source"></slot></bd-p>
          <span class="bd-review-date"><slot name="date"></slot></span>
        </div>
      </div>
    `}};a([r({type:String,reflect:!0})],s.prototype,`variant`,void 0),s=a([i(`bd-review`)],s);