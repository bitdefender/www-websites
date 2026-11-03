import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r}from"../../../../../lit/decorators.js";import{n as i,t as a}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../paragraph/paragraph.js";import"../badge/badge.js";import"../divider/divider-horizontal.js";var o=n`:host{font-family:var(--typography-fontFamily-sans)}.card-header{text-align:center}.card-title{font-size:var(--typography-heading-h4-fontSize);font-family:var(--typography-fontFamily-sans);text-align:start;color:var(--color-text-primary);margin:0}.card-title-brand{font-family:var(--typography-fontFamily-sans);font-weight:var(--typography-fontWeight-bold);color:var(--color-text-primary);display:block}.plus-text{color:var(--color-text-brand);font-weight:var(--typography-fontWeight-bold);font-family:var(--typography-fontFamily-sans)}.badge{background:var(--status-brand-surface);border-radius:var(--shape-radius-sm);align-items:center;gap:.25rem;margin:.5rem 0;padding:.25rem .5rem;font-size:.875rem;font-weight:700;display:inline-flex}.badge-icon{height:1rem}.badge-subtitle{font-size:var(--typography-body-regular-fontSize);text-align:start;font-family:var(--typography-fontFamily-sans);color:var(--color-text-primary);margin:0;margin-bottom:var(--spacing-16);margin-top:-8px}.hr-line{border:none;border-top:1px solid var(--color-border-subtle);margin:1rem 0}.badge-wrapper{text-align:start;margin-top:var(--spacing-8);margin-bottom:var(--spacing-8)}.badge-wrapper.multiple{gap:var(--spacing-8);margin-top:var(--spacing-8);margin-bottom:var(--spacing-8);flex-wrap:wrap;display:flex}`,s=class extends t{constructor(...e){super(...e),this.title=``}static{this.styles=[o]}get parsedBadges(){return this.badges?this.badges.split(`|`).map(e=>e.trim()):[]}renderTitle(){if(!this.title)return``;let t=this.title.match(/^(Bitdefender)\s+(.*)$/i),n=t?t[1]:``,r=(t?t[2]:this.title).split(/\b(plus)\b/i).map((t,n)=>n%2?e`<span class="plus-text">${t}</span>`:t);return e`
      <bd-h as="h4" class="card-title">
        ${n?e`<span class="card-title-brand">${n}</span>`:``}${r}
      </bd-h>
    `}render(){return e`
      <div class="card-header">
        ${this.renderTitle()}

        ${this.parsedBadges.length?e`
              <div class="badge-wrapper multiple">
                ${this.parsedBadges.map(t=>e`<bd-badge tone="primary" variant="fill">${t}</bd-badge>`)}
              </div>
            `:``}
        <bd-p variant="small" class="badge-subtitle">${this.subtitle}</bd-p>
        <bd-divider-horizontal></bd-divider-horizontal>
      </div>
    `}};a([r({type:String})],s.prototype,`title`,void 0),a([r({type:String})],s.prototype,`subtitle`,void 0),a([r({type:String})],s.prototype,`badges`,void 0),a([r({type:Boolean})],s.prototype,`plus`,void 0),s=a([i(`pricing-card-header`)],s);