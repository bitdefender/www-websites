import{c as e,i as t,l as n,t as r}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import{n as i,r as a}from"../../_chunks/repobit-dex-system-design3.js";import{t as o}from"../../_chunks/repobit-dex-system-design10.js";import"../../_chunks/repobit-dex-system-design11.js";var s=e`
  :host {
    display: block;
  }


  /* The card's width is the track's: a column of the grid from md (see
     ALIGNED ROWS), the full column below it. The counts the grid reads are
     card.js's, set on the section and inherited; they have no default on
     :host, because bd-card-item adopts this sheet too and a default there
     would shadow the section's count on every card. */
  ::slotted(bd-card-item) {
    display: block;
    margin: 0;
  }

  .bd-section-title-s {
    text-align: center;
    margin: 0;
  }

  .bd-section-subtitle-s {
    font-family: var(--typography-fontFamily-sans);
    font-size: var(--typography-body-regular-fontSize);
    color: var(--color-text-secondary);
    text-align: center;
    margin: var(--spacing-8) 0 0 0;
  }

  .bd-header-light-carousel-s {
    margin-bottom: var(--spacing-48);
    margin-top: var(--spacing-48);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-8);
  }

  /* Outline-variant sections get extra top padding above the header,
     per the reference design. */
  :host([variant="outline"]) .bd-header-light-carousel-s {
    padding-top: var(--spacing-80);
  }

  .bd-light-carousel-s {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    flex-direction: column;
    margin: 0 auto;
    padding-top: var(--spacing-64);
    padding-bottom: var(--spacing-64);
  }

  .bd-light-carousel-track-s {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-24);
    width: 100%;
    box-sizing: border-box;
    padding: 0;
  }

  .bd-light-box-s {
    background: var(--color-surface-container);
    border-radius: var(--card-radius);
    padding: var(--card-padding);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: start;
    transition: transform var(--transition-duration-normal) var(--transition-easing-smooth);
    position: relative;
    z-index: var(--z-raised);
    font-family: var(--typography-fontFamily-sans);
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }

  .bd-light-box-blue {
    background: var(--status-brand-surface);
  }

  /* === OUTLINE VARIANT — bordered, tinted, fully centered card. Set
     variant="outline" on bd-card-section (propagates to items) or on an
     individual bd-card-item to opt it in/out per-card. === */
  .bd-light-box-outline {
    background-color: var(--color-surface-container);
    border: var(--border-width-2) solid var(--color-border-brand);
    border-radius: var(--shape-radius-2xl);
    padding: var(--spacing-40);
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
  }

  .bd-light-box-outline .bd-light-box-header-s {
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .bd-light-box-outline .bd-light-title-badge-wrapper-s {
    justify-content: center;
  }

  .bd-light-box-outline .bd-card-title-group {
    align-items: center;
    text-align: center;
    margin-top: var(--spacing-64);
  }

  .bd-light-box-outline .bd-card-title-group bd-h {
    color: var(--color-text-brand);
    text-align: center;
  }

  .bd-light-box-outline .bd-card-item-subtitle,
  .bd-light-box-outline .bd-card-content-wrapper p,
  .bd-light-box-outline .bd-card-content-wrapper ::slotted(*) {
    color: var(--color-text-secondary);
    text-align: center;
  }

  .bd-light-box-outline .bd-card-content-wrapper {
    align-items: center;
    text-align: center;
  }

  .bd-light-box-outline .bd-card-cta-wrapper {
    justify-content: center;
  }

  .bd-light-box-center {
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .bd-light-box-center .bd-light-box-header-s {
    align-items: center;
  }

  .bd-light-box-center .bd-light-title-badge-wrapper-s {
    justify-content: center;
  }

  .bd-light-box-center .bd-card-content-wrapper {
    align-items: center;
    text-align: center;
  }

  .bd-light-box-center .bd-card-cta-wrapper {
    justify-content: center;
  }

  .bd-light-icon-s {
    max-width: 120px;
    max-height: 120px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }

  .bd-light-box-header-s {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: var(--spacing-8);
    padding-bottom: var(--spacing-8);
    position: relative;
  }

  .bd-light-title-badge-wrapper-s {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-4);
    overflow: hidden;
    margin-bottom: var(--spacing-8);
    width: 100%;
  }

  .bd-card-title-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
    width: 100%;
  }

  .bd-card-item-subtitle {
    font-family: var(--typography-fontFamily-sans);
    /* body-small: sm / normal / 1.5, which is what this already rendered on all
       three axes. Only the axes this rule declares are adopted -- the role also
       carries a family and a tracking, and importing those would change text
       the rule never spoke for. */
    font-size: var(--typography-body-small-fontSize);
    color: var(--color-text-muted);
    margin: 0;
    line-height: var(--typography-body-small-lineHeight);
  }

  .bd-card-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /* The card's own padding ends it; a closing paragraph's flow margin would
     add 16px inside that padding. Paragraphs before it keep theirs. */
  .bd-card-content-wrapper ::slotted(bd-p:last-child) {
    --bd-paragraph-margin-bottom: 0;
  }

  .bd-card-cta-wrapper {
    margin-top: var(--spacing-16);
    padding-top: var(--spacing-8);
    display: flex;
    align-items: flex-start;
    width: 100%;
  }

  .bd-card-cta-wrapper:empty {
    display: none;
  }

  /* === ALIGNED ROWS. The track is a grid and every card is a subgrid
     spanning the same rows (header, title, one per content node, CTA), so
     rows line up across cards even when their content wraps differently. Row
     counts come from _syncAlignRows(). Row gaps between tracks stay 0 so
     spacing inside cards is unchanged; spacing between wrapped card rows
     comes from the item margin instead.

     This was the align-rows opt-in, and the default evened the cards out in
     script; it is the only layout now. The track keeps the default's
     geometry: --bd-card-cols cards a row, none narrower than 200, and a short
     last row in the middle. Each card spans two tracks of a grid twice as
     fine, and the first card of a short row starts as many tracks in as the
     row is short (card.js, _syncColumns) -- a wrapping row of cards could
     centre itself, a grid row cannot. The tracks are fixed, not fractions,
     and the grid is centred, which is the flex row's spare space split
     either side. === */
  @media ${n(i(`md`))} {
    .bd-light-carousel-track-s {
      /* half a card: the card is the larger of 200 and its share of the row */
      /* no token: the 200 floor the wrapping row's min-width set */
      --_card-track: calc((max(200px, (100% - (var(--bd-card-cols, 4) - 1) * var(--spacing-24)) / var(--bd-card-cols, 4)) - var(--spacing-24)) / 2);
      display: grid;
      grid-template-columns: repeat(var(--bd-card-tracks, 8), var(--_card-track));
      justify-content: center;
      column-gap: var(--spacing-24);
      row-gap: 0;
      margin-bottom: calc(-1 * var(--spacing-24));
    }

    ::slotted(bd-card-item) {
      display: grid;
      grid-template-rows: subgrid;
      grid-row: span var(--bd-card-rows, 4);
      grid-column: var(--bd-card-start, auto) / span 2;
      width: auto;
      min-width: 0;
      margin: 0 0 var(--spacing-24) !important;
    }

    :host([align-rows]) .bd-light-box-s {
      display: grid;
      grid-template-rows: subgrid;
      grid-row: 1 / -1;
      row-gap: 0;
      /* center/outline boxes force flex centering with !important; in grid
         those would center items vertically and shrink the column */
      align-items: start !important;
      justify-content: normal !important;
      align-content: start;
    }

    :host([align-rows]) .bd-light-box-header-s {
      grid-row: 1;
    }

    :host([align-rows]) .bd-light-title-badge-wrapper-s {
      grid-row: 2;
    }

    :host([align-rows]) .bd-card-content-wrapper {
      display: grid;
      grid-template-rows: subgrid;
      grid-row: 3 / span var(--bd-card-content-rows, 1);
      row-gap: 0;
      align-items: start;
    }

    :host([align-rows]) .bd-light-box-center .bd-card-content-wrapper,
    :host([align-rows]) .bd-light-box-outline .bd-card-content-wrapper {
      justify-items: center;
    }

    :host([align-rows]) .bd-card-cta-wrapper {
      grid-row: -2;
    }
  }

  /* Between md and lg four cards of 200 do not fit the column, so a row
     holds three, as the wrapping row did, and the short row is counted in
     threes. */
  @media ${n(i(`md`))} and ${n(a(`lg`))} {
    .bd-light-carousel-track-s {
      grid-template-columns: repeat(var(--bd-card-tracks-md, 6), var(--_card-track));
    }

    ::slotted(bd-card-item) {
      grid-column: var(--bd-card-start-md, auto) / span 2;
    }
  }


  @media ${n(a(`md`))} {
    .bd-light-carousel-track-s {
      flex-direction: column;
      gap: var(--spacing-20);
      padding: 0;
      align-items: stretch;
    }
  ::slotted(bd-card-section) {
      padding: 0 20px;
  }
    ::slotted(bd-card-item) {
      width: 100%;
      max-width: 100%;
      flex: 0 0 auto;
      min-width: 0;
      margin: 0 auto;
      padding: 0 20px;
      /* The gutters have to sit inside the 100%, exactly as they already do on
         the box below. Without this the item is the full column plus 40px and
         pushes the page 24px wider than the phone. */
      box-sizing: border-box;
    }

    .bd-light-box-s {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      flex: none;
      margin: 0;
      box-sizing: border-box;
    }
  }


  /* A reader who asked for less motion was still getting the card lift. Twenty-three
     of the thirty animated directories in this package honour the query; this
     one did not. */
  @media (prefers-reduced-motion: reduce) {
    .bd-light-box-s {
      transition: none;
    }
  }
`,c=class extends r{static properties={title:{type:String},headingLevel:{type:Number,attribute:`heading-level`},subtitle:{type:String},bgBlue:{type:Boolean,reflect:!0,attribute:`bg-blue`},variant:{type:String,reflect:!0}};constructor(){super(),this.title=``,this.headingLevel=2,this.subtitle=``,this.bgBlue=!1,this.variant=``,this._mutationObserver=null}_getColumnCount(e){return e<=4?e:e<=6?3:e<=8?4:e===9?3:4}_syncColumns(){let e=[...this.querySelectorAll(`bd-card-item`)],t=e.length,n=this._getColumnCount(t),r=Math.min(n,3);this.style.setProperty(`--bd-card-cols`,n),this.style.setProperty(`--bd-card-tracks`,n*2),this.style.setProperty(`--bd-card-tracks-md`,r*2);let i=e=>{let n=t%e;return n?{first:t-n,start:e-n+1}:null},a=i(n),o=i(r);e.forEach((e,t)=>{a?.first===t?e.style.setProperty(`--bd-card-start`,a.start):e.style.removeProperty(`--bd-card-start`),o?.first===t?e.style.setProperty(`--bd-card-start-md`,o.start):e.style.removeProperty(`--bd-card-start-md`)})}_propagateVariant(){this.variant&&this.querySelectorAll(`bd-card-item`).forEach(e=>{e._authorSetVariant||(e.variant=this.variant)})}_syncAlignRows(){let e=[...this.querySelectorAll(`bd-card-item`)];e.forEach(e=>e.setAttribute(`align-rows`,``));let t=Math.max(0,...e.map(e=>e._contentNodes?.().length??0));this.style.setProperty(`--bd-card-content-rows`,t),this.style.setProperty(`--bd-card-rows`,t+3)}_onSlotChange=()=>{this._propagateVariant(),this._syncAlignRows(),this._syncColumns()};firstUpdated(){this._propagateVariant(),this._syncAlignRows(),this._syncColumns(),this._mutationObserver=new MutationObserver(()=>this._syncAlignRows()),this._mutationObserver.observe(this,{childList:!0,subtree:!0})}disconnectedCallback(){super.disconnectedCallback(),this._mutationObserver?.disconnect()}get _headingTag(){let e=Number(this.headingLevel);return Number.isInteger(e)&&e>=1&&e<=6?`h${e}`:`h2`}render(){return t`
      <section class="bd-ensemble bd-light-carousel-s">
        ${this.title?t`
              <div class="bd-header-light-carousel-s">
                <bd-h as="${this._headingTag}" visual-level="h1" class="bd-section-title-s">${this.title}</bd-h>
                ${this.subtitle?t`<p class="bd-section-subtitle-s">${this.subtitle}</p>`:``}
              </div>
            `:``}

        <div class="bd-light-carousel-track-s">
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>

      </section>
    `}},l=class extends r{static properties={title:{type:String},subtitle:{type:String},icon:{type:String},align:{type:String},bgBlue:{type:Boolean,reflect:!0,attribute:`bg-blue`},ctaAlign:{type:String,attribute:`cta-align`},headingLevel:{type:Number,attribute:`heading-level`},variant:{type:String,reflect:!0}};constructor(){super(),this._authorSetVariant=this.hasAttribute(`variant`),this.title=``,this.headingLevel=3,this.subtitle=``,this.icon=``,this.align=`start`,this.bgBlue=!1,this.ctaAlign=``,this.variant=``}_renderIcon(){let e=this.querySelector(`[slot='icon']`),n=this.variant===`outline`,r=n?65:48,i=n?75:48;if(e){let t=e.cloneNode(!0);t.setAttribute(`width`,r),t.setAttribute(`height`,i),t.style.maxWidth=`${r}px`,t.style.maxHeight=`${i}px`,t.style.width=`${r}px`,t.style.height=`${i}px`,t.style.objectFit=`contain`,t.style.display=`block`;let n=t.querySelector(`img`);return n&&(n.style.maxWidth=`${r}px`,n.style.maxHeight=`${i}px`,n.style.width=`${r}px`,n.style.height=`${i}px`,n.style.objectFit=`contain`,n.style.display=`block`,n.removeAttribute(`width`),n.removeAttribute(`height`)),t}return this.icon?t`<img
      src="${this.icon}"
      alt=""
      class="bd-light-icon-s"
      style="width: ${r}px; height: ${i}px;"
    />`:``}_contentNodes(){return[...this.childNodes].filter(e=>{if(e.nodeType===Node.ELEMENT_NODE){let t=e.getAttribute(`slot`);return t!==`icon`&&t!==`cta`}return e.nodeType===Node.TEXT_NODE&&e.textContent.trim()!==``})}_hasContent(){return this._contentNodes().length>0}get _headingTag(){let e=Number(this.headingLevel);return Number.isInteger(e)&&e>=1&&e<=6?`h${e}`:`h3`}render(){let e=this.variant===`outline`,n=this.align===`center`||e,r=this._hasContent(),i=!!this.querySelector(`[slot='cta']`),a=this.ctaAlign||(n?`center`:`start`),o=a===`center`?`justify-content: center;`:a===`end`?`justify-content: flex-end;`:`justify-content: flex-start;`;return t`
      <div
        class="bd-light-box-s
          ${n?`bd-light-box-center`:``}
          ${this.bgBlue?`bd-light-box-blue`:``}
          ${e?`bd-light-box-outline`:``}"
      >
        <div class="bd-light-box-header-s ${n?`bd-light-box-header-center`:``}">
          ${this._renderIcon()}
        </div>

        ${this.title?t`
              <div class="bd-light-title-badge-wrapper-s ${r?``:`bd-light-title-no-content`}">
                <div class="bd-card-title-group">
                  <bd-h as="${this._headingTag}" visual-level="h5" fontWeight="bold">${this.title}</bd-h>
                  ${this.subtitle?t`<p class="bd-card-item-subtitle">${this.subtitle}</p>`:``}
                </div>
              </div>
            `:``}

        ${r?t`
              <div class="bd-card-content-wrapper">
                <slot></slot>
              </div>
            `:``}

        ${i?t`
              <div class="bd-card-cta-wrapper" style="${o}">
                <slot name="cta"></slot>
              </div>
            `:``}

      </div>
    `}};c.styles=[o,s],l.styles=[s],customElements.define(`bd-card-item`,l),customElements.define(`bd-card-section`,c);