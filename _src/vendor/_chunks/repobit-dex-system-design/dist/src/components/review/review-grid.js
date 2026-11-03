import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i,t as a}from"../../../../../lit/decorators.js";import{n as o,t as s}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import{t as c}from"../shared/ensemble.css.js";import"./review.js";var l=r`:host{box-sizing:border-box;width:100%;display:block;container-type:inline-size}.bd-reviewgrid-title{text-align:center;margin:0 0 var(--spacing-32);color:var(--color-text-primary)}.bd-reviewgrid-grid{grid-template-columns:repeat(var(--bd-review-columns,3), 1fr);gap:var(--spacing-24);width:100%;display:grid}.bd-reviewgrid-grid--single{max-width:var(--bd-review-single-max-width,560px);margin-inline:auto}::slotted(bd-review){min-width:0}@container (width<992px){.bd-reviewgrid-grid{grid-template-columns:1fr}.bd-reviewgrid-grid--single{max-width:100%}}`,u=class extends n{constructor(...e){super(...e),this.title=``,this._columns=3}static{this.styles=[c,l]}get _items(){return[...this.children].filter(e=>e.tagName===`BD-REVIEW`)}_onSlotChange(){let e=this._items.length;this._columns=e<=0?1:Math.min(e,3)}render(){let n=this._columns===1;return e`
      <div class="bd-ensemble">
        ${this.title?e`<bd-h as="h2" class="bd-reviewgrid-title"><slot name="title">${this.title}</slot></bd-h>`:t}

        <div
          class="bd-reviewgrid-grid ${n?`bd-reviewgrid-grid--single`:``}"
          style="--bd-review-columns: ${this._columns};"
          role="list"
        >
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>
      </div>
    `}};s([i({type:String})],u.prototype,`title`,void 0),s([a()],u.prototype,`_columns`,void 0),u=s([o(`bd-review-grid`)],u);