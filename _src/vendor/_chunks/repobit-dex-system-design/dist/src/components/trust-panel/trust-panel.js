import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import"../paragraph/paragraph.js";import{t as s}from"../shared/ensemble.css.js";import"../icons/arrow-right-icon.js";import"../link/link.js";var c=r`:host{font-family:var(--typography-fontFamily-sans);background:var(--status-brand-surface);display:block}.bd-trustpanel-wrapper{padding-block:var(--spacing-48);box-sizing:border-box}.bd-trustpanel-eyebrow{margin:0 0 var(--spacing-8);color:var(--color-text-brand);display:block}.bd-trustpanel-title{margin:0 0 var(--spacing-16)}.bd-trustpanel-description{margin:0 0 var(--spacing-40);color:var(--color-text-muted);max-width:80ch;display:block}.bd-trustpanel-inline-link{white-space:nowrap}.bd-trustpanel-card-link{color:var(--color-text-brand);font-size:var(--typography-link-standalone-fontSize);font-weight:var(--typography-link-standalone-fontWeight);line-height:var(--typography-link-standalone-lineHeight);white-space:nowrap;text-decoration:none}.bd-trustpanel-card-link:hover{text-decoration:underline}.bd-trustpanel-stats{gap:var(--spacing-24);margin-bottom:var(--spacing-40);grid-template-columns:repeat(6,1fr);display:grid}.bd-trustpanel-stat{flex-direction:column;display:flex}.bd-trustpanel-stat-divider{border-top:2px solid var(--color-border-brand);margin-bottom:var(--spacing-16)}.bd-trustpanel-stat-value{color:var(--color-text-brand);font-size:var(--typography-fontSize-3xl);font-weight:var(--typography-fontWeight-bold);margin-bottom:var(--spacing-4);line-height:1.1}.bd-trustpanel-stat-label{color:var(--color-text-muted);font-size:var(--typography-body-small-fontSize);font-weight:var(--typography-body-small-fontWeight);line-height:var(--typography-body-small-lineHeight);letter-spacing:var(--typography-body-small-letterSpacing);font-family:var(--typography-body-small-fontFamily)}.bd-trustpanel-cards{gap:var(--spacing-24);grid-template-columns:1fr 1fr;display:grid}.bd-trustpanel-card{background:var(--color-surface-default);border:var(--border-width-1) solid var(--color-border-container);border-radius:var(--card-radius);padding:var(--card-padding);box-sizing:border-box;transition:transform var(--transition-duration-normal) var(--transition-easing-ease), box-shadow var(--transition-duration-normal) var(--transition-easing-ease);flex-direction:column;display:flex}@media (hover:hover){.bd-trustpanel-card:hover{box-shadow:0px 14px 40px color-mix(in srgb, var(--color-neutral-1000) 7%, transparent);transform:translateY(-3px)}}@media (prefers-reduced-motion:reduce){.bd-trustpanel-card{transition:none}.bd-trustpanel-card:hover{transform:none}}.bd-trustpanel-card-eyebrow{margin:0 0 var(--spacing-16);color:var(--color-text-brand);display:block}.bd-trustpanel-card-logos{align-items:center;gap:var(--spacing-16);margin-bottom:var(--spacing-20);flex-wrap:wrap;display:flex}.bd-trustpanel-card-logos ::slotted(*){object-fit:contain;width:auto;height:32px}.bd-trustpanel-card-title{margin:0 0 var(--spacing-12)}.bd-trustpanel-card-description{margin:0 0 var(--spacing-16);color:var(--color-text-muted);flex:1;display:block}@media (width<=899px){.bd-trustpanel-stats{grid-template-columns:repeat(3,1fr)}}@media (width<768px){.bd-trustpanel-stats{grid-template-columns:repeat(2,1fr)}.bd-trustpanel-cards{grid-template-columns:1fr}.bd-trustpanel-wrapper{padding:var(--spacing-32) var(--spacing-24)}.bd-trustpanel-card{padding:var(--card-padding-compact)}}`,l=class extends n{constructor(...e){super(...e),this.eyebrow=``,this.title=``,this.description=``,this.linkLabel=``,this.linkHref=`#`,this.stats=[],this.cards=[]}static{this.styles=[s,c]}_renderCard(n,r){let i=`card-${r+1}-logos`;return e`
      <div class="bd-trustpanel-card">
        ${n.eyebrow?e`<bd-p variant="eyebrow" class="bd-trustpanel-card-eyebrow">${n.eyebrow}</bd-p>`:t}

        <div class="bd-trustpanel-card-logos">
          <slot name="${i}"></slot>
        </div>

        ${n.title?e`<bd-h as="h4" class="bd-trustpanel-card-title">${n.title}</bd-h>`:t}

        ${n.description?e`<bd-p variant="regular" class="bd-trustpanel-card-description">${n.description}</bd-p>`:t}

        ${n.linkLabel?e`
              <a class="bd-trustpanel-card-link" href=${n.linkHref||`#`}>
                ${n.linkLabel} <bd-arrow-right-icon size="xs" aria-hidden="true"></bd-arrow-right-icon>
              </a>
            `:t}
      </div>
    `}render(){return e`
      <div class="bd-ensemble bd-trustpanel-wrapper">
        ${this.eyebrow?e`<bd-p variant="eyebrow" class="bd-trustpanel-eyebrow"><slot name="eyebrow">${this.eyebrow}</slot></bd-p>`:t}

        ${this.title?e`<bd-h as="h2" class="bd-trustpanel-title"><slot name="title">${this.title}</slot></bd-h>`:t}

        ${this.description?e`
              <bd-p variant="regular" class="bd-trustpanel-description">
                <slot name="description">${this.description}</slot>
                ${this.linkLabel?e`
                      <bd-link
                        class="bd-trustpanel-inline-link"
                        href=${this.linkHref}
                        underline
                        font-size="inherit"
                      >
                        ${this.linkLabel} <bd-arrow-right-icon size="xs" aria-hidden="true"></bd-arrow-right-icon>
                      </bd-link>
                    `:t}
              </bd-p>
            `:t}

        ${this.stats&&this.stats.length?e`
              <div class="bd-trustpanel-stats">
                ${this.stats.map(t=>e`
                    <div class="bd-trustpanel-stat">
                      <div class="bd-trustpanel-stat-divider"></div>
                      <div class="bd-trustpanel-stat-value">${t.value}</div>
                      <div class="bd-trustpanel-stat-label">${t.label}</div>
                    </div>
                  `)}
              </div>
            `:t}

        ${this.cards&&this.cards.length?e`
              <div class="bd-trustpanel-cards">
                ${this.cards.map((e,t)=>this._renderCard(e,t))}
              </div>
            `:t}
      </div>
    `}};o([i({type:String})],l.prototype,`eyebrow`,void 0),o([i({type:String})],l.prototype,`title`,void 0),o([i({type:String})],l.prototype,`description`,void 0),o([i({type:String,attribute:`link-label`})],l.prototype,`linkLabel`,void 0),o([i({type:String,attribute:`link-href`})],l.prototype,`linkHref`,void 0),o([i({type:Array})],l.prototype,`stats`,void 0),o([i({type:Array})],l.prototype,`cards`,void 0),l=o([a(`bd-trust-panel`)],l);