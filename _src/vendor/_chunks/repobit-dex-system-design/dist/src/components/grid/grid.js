import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r}from"../../../../../lit/decorators.js";import{n as i,t as a}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as o}from"../shared/token-scales.js";var s=n`:host{display:block}.grid{--grid-cols-active:var(--grid-cols);--grid-gap-active:var(--grid-gap,var(--spacing-24));grid-template-columns:repeat(var(--grid-cols-active), 1fr);place-items:stretch start;gap:var(--grid-gap-active);display:grid}@media (width>=576px){.grid{--grid-cols-active:var(--grid-cols-sm);--grid-gap-active:var(--grid-gap-sm,var(--spacing-24))}}@media (width>=768px){.grid{--grid-cols-active:var(--grid-cols-md);--grid-gap-active:var(--grid-gap-md,var(--spacing-24))}}@media (width>=992px){.grid{--grid-cols-active:var(--grid-cols-lg);--grid-gap-active:var(--grid-gap-lg,var(--spacing-24))}}.grid.grid--fit{grid-template-columns:repeat(auto-fill, minmax(min(100%, max(var(--grid-min-col-width), (100% - var(--grid-cols-active) * var(--grid-gap-active)) / var(--grid-cols-active))), 1fr))}`,c=class extends t{constructor(...e){super(...e),this.cols=1,this.colsSm=1,this.colsMd=2,this.colsLg=3,this.gap=`md`,this.gapSm=``,this.gapMd=``,this.gapLg=``,this.align=`stretch`,this.justify=`start`,this.padding=`none`,this.minColWidth=0}static{this.styles=[s]}render(){return e`
      <div
        class="grid ${this.minColWidth>0?`grid--fit`:``}"
        style="
          --grid-cols: ${this.cols};
          --grid-cols-sm: ${this.colsSm};
          --grid-cols-md: ${this.colsMd};
          --grid-cols-lg: ${this.colsLg};
          ${o(this.gap)?`--grid-gap: ${o(this.gap)};`:``}
          --grid-gap-sm: ${o(this.gapSm)||`var(--grid-gap)`};
          --grid-gap-md: ${o(this.gapMd)||`var(--grid-gap-sm)`};
          --grid-gap-lg: ${o(this.gapLg)||`var(--grid-gap-md)`};
          align-items: ${this.align};
          justify-items: ${this.justify};
          padding: ${o(this.padding)};
          ${this.minColWidth>0?`--grid-min-col-width: ${this.minColWidth/16}rem;`:``}
        "
      >
        <slot></slot>
      </div>
    `}};a([r({type:Number})],c.prototype,`cols`,void 0),a([r({type:Number,attribute:`cols-sm`})],c.prototype,`colsSm`,void 0),a([r({type:Number,attribute:`cols-md`})],c.prototype,`colsMd`,void 0),a([r({type:Number,attribute:`cols-lg`})],c.prototype,`colsLg`,void 0),a([r({type:String})],c.prototype,`gap`,void 0),a([r({type:String,attribute:`gap-sm`})],c.prototype,`gapSm`,void 0),a([r({type:String,attribute:`gap-md`})],c.prototype,`gapMd`,void 0),a([r({type:String,attribute:`gap-lg`})],c.prototype,`gapLg`,void 0),a([r({type:String})],c.prototype,`align`,void 0),a([r({type:String})],c.prototype,`justify`,void 0),a([r({type:String})],c.prototype,`padding`,void 0),a([r({type:Number,attribute:`min-col-width`})],c.prototype,`minColWidth`,void 0),c=a([i(`bd-grid`)],c);