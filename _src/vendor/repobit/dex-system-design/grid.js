import{c as e,i as t,l as n,t as r}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import{f as i,n as a}from"../../_chunks/repobit-dex-system-design3.js";var o=e`
    :host {
      display: block;
    }

    /* Each step below says only which columns and which gap apply; they are
       laid out here, once, so that min-col-width reads the same two. */
    .grid {
      display: grid;
      align-items: stretch;
      justify-items: start;
      --grid-cols-active: var(--grid-cols);
      --grid-gap-active: var(--grid-gap, var(--spacing-24));
      grid-template-columns: repeat(var(--grid-cols-active), 1fr);
      gap: var(--grid-gap-active);
    }

    /* The columns and the gap step together; a gap left unset carries the
       one below it up. */
    @media ${n(a(`sm`))} {
      .grid {
        --grid-cols-active: var(--grid-cols-sm);
        --grid-gap-active: var(--grid-gap-sm, var(--spacing-24));
      }
    }

    @media ${n(a(`md`))} {
      .grid {
        --grid-cols-active: var(--grid-cols-md);
        --grid-gap-active: var(--grid-gap-md, var(--spacing-24));
      }
    }

    @media ${n(a(`lg`))} {
      .grid {
        --grid-cols-active: var(--grid-cols-lg);
        --grid-gap-active: var(--grid-gap-lg, var(--spacing-24));
      }
    }

    /* min-col-width: as many columns as fit at min-col-width, up to the
       step's count. auto-fill takes as many as fit; the second term of max()
       is what holds it to the count -- a column at least the grid less the
       count's gaps, over the count, leaves no room for one more, with a gap
       to spare so rounding cannot drop one either; and min(100%, ...) keeps
       one column inside a grid narrower than the floor. The columns then
       share what is left, as 1fr always has. */
    .grid.grid--fit {
      grid-template-columns: repeat(auto-fill, minmax(min(100%, max(
        var(--grid-min-col-width),
        (100% - var(--grid-cols-active) * var(--grid-gap-active)) / var(--grid-cols-active)
      )), 1fr));
    }
`,s=class extends r{static properties={cols:{type:Number},colsSm:{type:Number,attribute:`cols-sm`},colsMd:{type:Number,attribute:`cols-md`},colsLg:{type:Number,attribute:`cols-lg`},gap:{type:String},gapSm:{type:String,attribute:`gap-sm`},gapMd:{type:String,attribute:`gap-md`},gapLg:{type:String,attribute:`gap-lg`},align:{type:String},justify:{type:String},padding:{type:String},minColWidth:{type:Number,attribute:`min-col-width`}};constructor(){super(),this.cols=1,this.colsSm=1,this.colsMd=2,this.colsLg=3,this.gap=`md`,this.gapSm=``,this.gapMd=``,this.gapLg=``,this.align=`stretch`,this.justify=`start`,this.padding=`none`,this.minColWidth=0}render(){return t`
      <div
        class="grid ${this.minColWidth>0?`grid--fit`:``}"
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
        "
      >
        <slot></slot>
      </div>
    `}};s.styles=[o],customElements.define(`bd-grid`,s);