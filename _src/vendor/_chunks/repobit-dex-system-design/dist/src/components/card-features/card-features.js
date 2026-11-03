import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r}from"../../../../../lit/decorators.js";import{n as i,t as a}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import{t as o}from"../shared/ensemble.css.js";import"../badge/badge.js";var s=n`:host{display:block}:host(bd-card-features-section){box-sizing:border-box;width:100%;container-type:inline-size}.bd-card-features-s{box-sizing:border-box;flex-direction:column;justify-content:center;align-items:center;width:100%;display:flex;position:relative;overflow:hidden}.bd-card-features-header-s{margin-bottom:var(--spacing-48);margin-top:var(--spacing-32);text-align:center}.bd-card-features-track-s{gap:var(--spacing-24);grid-template-columns:repeat(3,1fr);width:100%;display:grid}.bd-card-features-box-s{align-items:flex-start;gap:var(--spacing-16);background:var(--color-surface-container);border-radius:var(--card-radius);padding:var(--card-padding);font-family:var(--typography-fontFamily-sans);box-sizing:border-box;flex-direction:row;height:100%;display:flex}.bd-card-features-icon-s{width:var(--spacing-32);height:var(--spacing-32);object-fit:contain;flex-shrink:0}.bd-card-features-content-s{flex-direction:column;display:flex}.bd-card-features-title-badge-wrapper-s{align-items:center;gap:var(--spacing-8);margin-bottom:var(--spacing-8);display:flex}.bd-card-features-item-title-s{margin:0}::slotted(p){color:var(--color-text-secondary);font-family:var(--typography-fontFamily-sans);margin:0}@container (width<=1024px){.bd-card-features-track-s{grid-template-columns:repeat(2,1fr)}}@container (width>600px){.bd-card-features-track-s{grid-auto-rows:1fr}}@container (width<=600px){.bd-card-features-track-s{grid-template-columns:1fr}.bd-card-features-box-s{flex-direction:column;align-items:flex-start;height:auto}}`,c=class extends t{constructor(...e){super(...e),this.title=``,this.headingLevel=2}static{this.styles=[o,s]}get _headingTag(){let e=Number(this.headingLevel);return Number.isInteger(e)&&e>=1&&e<=6?`h${e}`:`h2`}_renderTitle(t){return e`<bd-h as=${this._headingTag} visual-level="h3" class=${t}
      >${this.title}</bd-h
    >`}render(){return e`
      <section class="bd-ensemble bd-card-features-s">
        ${this.title?e`
              <div class="bd-card-features-header-s">
                ${this._renderTitle(`bd-card-features-title-s`)}
              </div>
            `:null}
        <div class="bd-card-features-track-s">
          <slot></slot>
        </div>
      </section>
    `}};a([r({type:String})],c.prototype,`title`,void 0),a([r({type:Number,attribute:`heading-level`})],c.prototype,`headingLevel`,void 0),c=a([i(`bd-card-features-section`)],c);var l=class extends t{constructor(...e){super(...e),this.title=``,this.icon=``,this.badge=``,this.badgeVariant=`fill`,this.badgeTone=`primary`,this.headingLevel=3}static{this.styles=[s]}_renderIcon(){let t=this.querySelector(`[slot='icon']`);return t?t.cloneNode(!0):this.icon?e`<img
        src="${this.icon}"
        alt=""
        class="bd-card-features-icon-s"
      />`:``}get _headingTag(){let e=Number(this.headingLevel);return Number.isInteger(e)&&e>=1&&e<=6?`h${e}`:`h3`}render(){return e`
      <div class="bd-card-features-box-s">
        ${this._renderIcon()}

        <div class="bd-card-features-content-s">
          ${this.title?e`
                <div class="bd-card-features-title-badge-wrapper-s">
                  <bd-h as="${this._headingTag}" visual-level="h5" fontWeight="bold" class="bd-card-features-item-title-s">${this.title}</bd-h>
                  ${this.badge?e`<bd-badge
                        variant="${this.badgeVariant}"
                        tone="${this.badgeTone}"
                        size="sm"
                      >${this.badge}</bd-badge>`:``}
                </div>
              `:``}
          <slot></slot>
        </div>
      </div>
    `}};a([r({type:String})],l.prototype,`title`,void 0),a([r({type:String})],l.prototype,`icon`,void 0),a([r({type:String})],l.prototype,`badge`,void 0),a([r({type:String,attribute:`badge-variant`})],l.prototype,`badgeVariant`,void 0),a([r({type:String})],l.prototype,`badgeTone`,void 0),a([r({type:Number,attribute:`heading-level`})],l.prototype,`headingLevel`,void 0),l=a([i(`bd-card-features-item`)],l);