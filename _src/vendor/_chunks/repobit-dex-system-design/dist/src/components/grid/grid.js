import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r}from"../../../../../lit/decorators.js";import{t as i}from"../shared/token-scales.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";var s=n`:host{display:block}.grid{--grid-cols-active:var(--grid-cols);--grid-gap-active:var(--grid-gap,var(--spacing-24));grid-template-columns:repeat(var(--grid-cols-active), 1fr);place-items:stretch start;gap:var(--grid-gap-active);display:grid}@media (width>=576px){.grid{--grid-cols-active:var(--grid-cols-sm);--grid-gap-active:var(--grid-gap-sm,var(--spacing-24))}}@media (width>=768px){.grid{--grid-cols-active:var(--grid-cols-md);--grid-gap-active:var(--grid-gap-md,var(--spacing-24))}}@media (width>=992px){.grid{--grid-cols-active:var(--grid-cols-lg);--grid-gap-active:var(--grid-gap-lg,var(--spacing-24))}}.grid.grid--fit{grid-template-columns:repeat(auto-fill, minmax(min(100%, max(var(--grid-min-col-width), (100% - var(--grid-cols-active) * var(--grid-gap-active)) / var(--grid-cols-active))), 1fr))}.grid--rows{row-gap:0;margin-block-end:calc(-1 * var(--grid-gap-active))}.grid--rows ::slotted(*){grid-template-rows:subgrid;grid-row:span var(--grid-item-rows);margin-block-end:var(--grid-gap-active);display:grid}`,c=class extends t{constructor(...e){super(...e),this.cols=1,this.colsSm=1,this.colsMd=2,this.colsLg=3,this.gap=`md`,this.gapSm=``,this.gapMd=``,this.gapLg=``,this.align=`stretch`,this.justify=`start`,this.padding=`none`,this.minColWidth=0,this.itemRows=0}static{this.styles=[s]}render(){return e`
      <div
        class="grid ${this.minColWidth>0?`grid--fit`:``} ${this.itemRows>0?`grid--rows`:``}"
        style="
          --grid-cols: ${this.cols};
          --grid-cols-sm: ${this.colsSm};
          --grid-cols-md: ${this.colsMd};
          --grid-cols-lg: ${this.colsLg};
          ${i(this.gap)?`--grid-gap: ${i(this.gap)};`:``}
          --grid-gap-sm: ${i(this.gapSm)||`var(--grid-gap)`};
          --grid-gap-md: ${i(this.gapMd)||`var(--grid-gap-sm)`};
          --grid-gap-lg: ${i(this.gapLg)||`var(--grid-gap-md)`};
          align-items: ${this.align};
          justify-items: ${this.justify};
          padding: ${i(this.padding)};
          ${this.minColWidth>0?`--grid-min-col-width: ${this.minColWidth/16}rem;`:``}
          ${this.itemRows>0?`--grid-item-rows: ${Math.round(this.itemRows)};`:``}
        "
      >
        <slot></slot>
      </div>
    `}};o([r({type:Number})],c.prototype,`cols`,void 0),o([r({type:Number,attribute:`cols-sm`})],c.prototype,`colsSm`,void 0),o([r({type:Number,attribute:`cols-md`})],c.prototype,`colsMd`,void 0),o([r({type:Number,attribute:`cols-lg`})],c.prototype,`colsLg`,void 0),o([r({type:String})],c.prototype,`gap`,void 0),o([r({type:String,attribute:`gap-sm`})],c.prototype,`gapSm`,void 0),o([r({type:String,attribute:`gap-md`})],c.prototype,`gapMd`,void 0),o([r({type:String,attribute:`gap-lg`})],c.prototype,`gapLg`,void 0),o([r({type:String})],c.prototype,`align`,void 0),o([r({type:String})],c.prototype,`justify`,void 0),o([r({type:String})],c.prototype,`padding`,void 0),o([r({type:Number,attribute:`min-col-width`})],c.prototype,`minColWidth`,void 0),o([r({type:Number,attribute:`item-rows`})],c.prototype,`itemRows`,void 0),c=o([a(`bd-grid`)],c);