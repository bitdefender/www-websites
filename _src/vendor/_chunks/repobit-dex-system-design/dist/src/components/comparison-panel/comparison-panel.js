import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import"../paragraph/paragraph.js";import{t as s}from"../shared/ensemble.css.js";var c=r`:host{font-family:var(--typography-fontFamily-sans);background:var(--status-brand-surface);display:block}:host([variant=dark]){background:linear-gradient(160deg, var(--color-neutral-800) 0%, #0b1626 100%)}:host([variant=dark]) .bd-comparisonpanel-title{color:var(--color-text-inverse)}:host([variant=dark]) .bd-comparisonpanel-description{color:var(--color-text-muted-inverse)}:host([variant=dark]) .bd-comparisonpanel-column{background:color-mix(in srgb, var(--color-neutral-0) 3%, transparent);border-color:var(--color-border-container-inverse)}:host([variant=dark]) .bd-comparisonpanel-column-title{color:var(--color-text-muted-inverse);font-family:var(--typography-fontFamily-mono);text-transform:uppercase;letter-spacing:var(--typography-letterSpacing-widest);font-weight:var(--typography-fontWeight-bold);font-size:var(--typography-fontSize-xs)}:host([variant=dark]) .bd-comparisonpanel-text{color:var(--color-text-inverse)}.bd-comparisonpanel-wrapper{padding-block:var(--spacing-48);box-sizing:border-box}.bd-comparisonpanel-title{margin:0 0 var(--spacing-16)}.bd-comparisonpanel-description{margin:0 0 var(--spacing-48);color:var(--color-text-muted);max-width:var(--content-width-readable)}.bd-comparisonpanel-columns{gap:var(--spacing-24);grid-template-columns:1fr 1fr;display:grid}.bd-comparisonpanel-column{background:var(--color-surface-default);border:var(--border-width-1) solid var(--color-border-container);border-radius:var(--card-radius);padding:var(--card-padding);box-sizing:border-box}.bd-comparisonpanel-column-title{margin:0 0 var(--spacing-16)}.bd-comparisonpanel-list{gap:var(--spacing-16);flex-direction:column;margin:0;padding:0;list-style:none;display:flex}.bd-comparisonpanel-item{align-items:flex-start;gap:var(--spacing-12);display:flex}.bd-comparisonpanel-icon{width:var(--spacing-20);height:var(--spacing-20);border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;margin-top:1px;display:flex}.bd-comparisonpanel-icon--positive{background:var(--status-success-fill)}.bd-comparisonpanel-icon--negative{background:var(--status-error-fill)}.bd-comparisonpanel-text{color:var(--color-text-primary);margin:0}@media (width<768px){.bd-comparisonpanel-columns{grid-template-columns:1fr}.bd-comparisonpanel-wrapper{padding:var(--spacing-32) var(--spacing-24)}.bd-comparisonpanel-column{padding:var(--card-padding-compact)}}`,l=class extends n{constructor(...e){super(...e),this.title=``,this.description=``,this.positiveTitle=``,this.negativeTitle=``,this.positiveItems=[],this.negativeItems=[],this.variant=`light`}static{this.styles=[s,c]}_renderColumn(n,r,i,a){let o=n===`positive`;return e`
      <div class="bd-comparisonpanel-column">
        ${r?e`
              <bd-h as="h4" class="bd-comparisonpanel-column-title">
                <slot name="${a}-title">${r}</slot>
              </bd-h>
            `:t}

        <ul class="bd-comparisonpanel-list">
          ${i.map(t=>e`
              <li class="bd-comparisonpanel-item">
                <span
                  class="bd-comparisonpanel-icon ${o?`bd-comparisonpanel-icon--positive`:`bd-comparisonpanel-icon--negative`}"
                  aria-hidden="true"
                >
                  ${o?e`
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7.2l2.6 2.6L11 4.4" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      `:e`
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      `}
                </span>
                <bd-p variant="regular" class="bd-comparisonpanel-text">${t}</bd-p>
              </li>
            `)}
        </ul>

        <slot name="${a}"></slot>
      </div>
    `}render(){return e`
      <div class="bd-ensemble bd-comparisonpanel-wrapper">
        ${this.title?e`
              <bd-h as="h2" class="bd-comparisonpanel-title">
                <slot name="title">${this.title}</slot>
              </bd-h>
            `:t}

        ${this.description?e`
              <bd-p variant="large" class="bd-comparisonpanel-description">
                <slot name="description">${this.description}</slot>
              </bd-p>
            `:t}

        <div class="bd-comparisonpanel-columns">
          ${this._renderColumn(`positive`,this.positiveTitle,this.positiveItems,`positive`)}
          ${this._renderColumn(`negative`,this.negativeTitle,this.negativeItems,`negative`)}
        </div>
      </div>
    `}};o([i({type:String})],l.prototype,`title`,void 0),o([i({type:String})],l.prototype,`description`,void 0),o([i({type:String,attribute:`positive-title`})],l.prototype,`positiveTitle`,void 0),o([i({type:String,attribute:`negative-title`})],l.prototype,`negativeTitle`,void 0),o([i({type:Array})],l.prototype,`positiveItems`,void 0),o([i({type:Array})],l.prototype,`negativeItems`,void 0),o([i({type:String,reflect:!0})],l.prototype,`variant`,void 0),l=o([a(`bd-comparison-panel`)],l);