import{a as e,t,u as n}from"../../../../../lit/index.js";import"../shared/token-scales.js";import{n as r,t as i}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../p/p.js";import{t as a}from"../shared/controller.slot.js";import"../h/h.js";import{t as o}from"../shared/ensemble.css.js";import"../fact/fact.js";var s=n`:host{font-family:var(--typography-fontFamily-sans);display:block}.bd-infopanel-container{column-gap:var(--spacing-48);padding-block:var(--spacing-48);box-sizing:border-box;grid-template-rows:auto auto;grid-template-columns:1fr 1fr;row-gap:0;display:grid}.bd-infopanel-title[hidden],.bd-infopanel-left[hidden],.bd-infopanel-right[hidden]{display:none}.bd-infopanel-title{margin:0;margin-bottom:var(--spacing-48);grid-area:1/1/auto/-1}::slotted(bd-h[slot=title]),::slotted(bd-display[slot=title]){--bd-heading-font-size:var(--typography-heading-h2-fontSize);--bd-heading-font-weight:var(--typography-heading-h2-fontWeight);--bd-heading-line-height:var(--typography-heading-h2-lineHeight);--bd-heading-letter-spacing:var(--typography-heading-h2-letterSpacing);--bd-heading-font-family:var(--typography-heading-h2-fontFamily)}.bd-infopanel-left{gap:var(--spacing-16);flex-direction:column;grid-area:2/1;display:flex}::slotted([slot=description]){max-width:46ch;font-family:var(--typography-fontFamily-sans);margin:0}::slotted(bd-p[slot=description]){--bd-paragraph-font-size:var(--typography-body-large-fontSize);--bd-paragraph-font-weight:var(--typography-body-large-fontWeight);--bd-paragraph-line-height:var(--typography-body-large-lineHeight);--bd-paragraph-letter-spacing:var(--typography-body-large-letterSpacing)}.bd-infopanel-right{gap:var(--spacing-40);flex-direction:column;grid-area:2/2;display:flex}@media (width<=899px){.bd-infopanel-container{gap:var(--spacing-32);padding:var(--spacing-32) var(--spacing-24);grid-template-rows:auto auto auto;grid-template-columns:1fr}.bd-infopanel-title{margin-bottom:var(--spacing-16);grid-area:1/1}.bd-infopanel-left{grid-area:2/1}.bd-infopanel-right{grid-area:3/1}::slotted([slot=description]){max-width:none}}`,c=class extends t{constructor(...e){super(...e),this._slots=new a(this,{slots:[`title`,`description`,``]})}static{this.styles=[o,s]}render(){return e`
      <div class="bd-ensemble bd-infopanel-container">
        <div class="bd-infopanel-title" ?hidden=${!this._slots.has(`title`)}>
          <slot name="title"></slot>
        </div>

        <div class="bd-infopanel-left" ?hidden=${!this._slots.has(`description`)}>
          <slot name="description"></slot>
        </div>

        <div class="bd-infopanel-right" ?hidden=${!this._slots.has(``)}>
          <slot></slot>
        </div>
      </div>
    `}};c=i([r(`bd-overview`)],c);export{c as BdOverview};