import{a as e,t,u as n}from"../../../../../lit/index.js";import"../shared/token-scales.js";import{n as r,t as i}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as a}from"../shared/controller.slot.js";import"../h/h.js";import{t as o}from"../shared/ensemble.css.js";import"./review.js";var s=n`:host{box-sizing:border-box;width:100%;display:block;container-type:inline-size}.bd-ensemble>[hidden]{display:none}.bd-reviewgrid-title{text-align:center;margin:0 0 var(--spacing-32)}::slotted(bd-h[slot=title]),::slotted(bd-display[slot=title]){--bd-heading-font-size:var(--typography-heading-h2-fontSize);--bd-heading-font-weight:var(--typography-heading-h2-fontWeight);--bd-heading-line-height:var(--typography-heading-h2-lineHeight);--bd-heading-letter-spacing:var(--typography-heading-h2-letterSpacing);--bd-heading-font-family:var(--typography-heading-h2-fontFamily)}.bd-reviewgrid-grid{grid-template-columns:repeat(var(--bd-review-columns,3), 1fr);gap:var(--spacing-24);width:100%;display:grid}.bd-reviewgrid-grid--single{max-width:var(--bd-review-single-max-width,560px);margin-inline:auto}::slotted(bd-review){min-width:0}@container (width<992px){.bd-reviewgrid-grid{grid-template-columns:1fr}.bd-reviewgrid-grid--single{max-width:100%}}`,c=class extends t{constructor(...e){super(...e),this._slots=new a(this,{slots:[`title`,``]})}static{this.styles=[o,s]}get _columns(){let e=this._slots.elements(``).filter(e=>e.localName===`bd-review`).length;return e<=0?1:Math.min(e,3)}render(){let t=this._columns;return e`
      <div class="bd-ensemble">
        <div class="bd-reviewgrid-title" ?hidden=${!this._slots.has(`title`)}><slot name="title"></slot></div>
        <div
          class="bd-reviewgrid-grid ${t===1?`bd-reviewgrid-grid--single`:``}"
          style="--bd-review-columns: ${t};"
          role="list"
          ?hidden=${!this._slots.has(``)}
        >
          <slot></slot>
        </div>
      </div>
    `}};c=i([r(`bd-review-grid`)],c);export{c as BdReviewGrid};