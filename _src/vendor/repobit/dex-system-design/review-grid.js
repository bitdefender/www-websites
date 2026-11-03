import{i as e,l as t,n,t as r,u as i}from"../../_chunks/lit.js";import{t as a}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import{r as o}from"../../_chunks/repobit-dex-system-design3.js";import{t as s}from"../../_chunks/repobit-dex-system-design10.js";import"../../_chunks/repobit-dex-system-design24.js";var c=t`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
    /* The grid's own width decides when its cards stack, not the screen's:
       across the page the two are the same, in a narrower column the cards
       stack with it. */
    container-type: inline-size;
  }

  .bd-reviewgrid-title {
    text-align: center;
    margin: 0 0 var(--spacing-32);
    color: var(--color-text-primary);
  }

  .bd-reviewgrid-grid {
    display: grid;
    grid-template-columns: repeat(var(--bd-review-columns, 3), 1fr);
    gap: var(--spacing-24);
    width: 100%;
  }

  .bd-reviewgrid-grid--single {
    max-width: var(--bd-review-single-max-width, 560px);
    margin-inline: auto;
  }

  ::slotted(bd-review) {
    min-width: 0;
  }

  /* below lg, as install-options: three cards stack across 900-991 too. */
  @container ${i(o(`lg`))} {
    .bd-reviewgrid-grid {
      grid-template-columns: 1fr;
    }

    .bd-reviewgrid-grid--single {
      max-width: 100%;
    }
  }
`,l=class extends r{static properties={title:{type:String},_columns:{state:!0}};static styles=[a,s,c];constructor(){super(),this.title=``,this._columns=3}get _items(){return[...this.children].filter(e=>e.tagName===`BD-REVIEW`)}_onSlotChange(){let e=this._items.length;this._columns=e<=0?1:Math.min(e,3)}render(){let t=this._columns===1;return e`
      <div class="bd-ensemble">
        ${this.title?e`<bd-h as="h2" class="bd-reviewgrid-title"><slot name="title">${this.title}</slot></bd-h>`:n}

        <div
          class="bd-reviewgrid-grid ${t?`bd-reviewgrid-grid--single`:``}"
          style="--bd-review-columns: ${this._columns};"
          role="list"
        >
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>
      </div>
    `}};customElements.define(`bd-review-grid`,l);