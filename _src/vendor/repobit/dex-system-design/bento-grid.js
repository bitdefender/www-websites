import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import{t as a}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import{n as o,r as s,t as c}from"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design8.js";import{t as l}from"../../_chunks/repobit-dex-system-design10.js";import"../../_chunks/repobit-dex-system-design17.js";var u=`1.5rem`,d=(e,t,n)=>`(width >= ${c[n]}px) and (width >= calc(${e*t}px + ${e-1} * ${u}))`,f={maxColumns:2,equalColumns:3,minCardWidth:260},p=({maxColumns:e,equalColumns:t,minCardWidth:n})=>{let r=`:host(:not([variant="equal"]))`,i=`:host([variant="equal"])`,a=`
    ${r} .bd-bentogrid-track,
    ${i} .bd-bentogrid-track {
      grid-template-columns: minmax(0, 1fr);
    }

    ${r} ::slotted(bd-bento-item),
    ${i} ::slotted(bd-bento-item) {
      grid-column: auto;
    }
  `;e>=2&&(a+=`
      @container bento ${d(2,n,`sm`)} {
        ${r} .bd-bentogrid-track {
          grid-template-columns: repeat(24, minmax(0, 1fr));
        }

        ${r} ::slotted(bd-bento-item) {
          grid-column: span var(--bd-bento-span, 24);
        }
      }
    `);for(let e=2;e<=t;e+=1)a+=`
      @container bento ${d(e,n,e===2?`sm`:`md`)} {
        ${i} .bd-bentogrid-track {
          grid-template-columns: repeat(${e}, minmax(0, 1fr));
        }
      }
    `;return a},m=e`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .bd-ensemble {
    container: bento / inline-size;
  }

  /* === BACKGROUND VARIANT — section-level tint on the column (header +
     track), not per-card, so the panel lands on the page edges every other
     section uses. === */
  :host([background="tint"]) .bd-ensemble {
    background-color: var(--status-brand-surface);
    border-radius: var(--shape-radius-2xl);
    padding-block: var(--spacing-40);
  }

  /* === HEADER (eyebrow / title / description) === */
  .bd-bentogrid-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-8);
    margin-bottom: var(--spacing-48);
    max-width: 70ch;
  }

 .bd-bentogrid-eyebrow {
    display: block;
    margin: 0;
    /* The brand text role, not the brand primitive. This is a visible change and
       not a refactor: the role is blue-600, so the eyebrow darkens and its
       contrast on white goes 4.53:1 -> 6.18:1. blue-500 is the step CLAUDE.md
       says is not for text, and no text role exists at blue-500's value -- the
       roles sitting there are surface, border, action and indicator. */
    color: var(--color-text-brand);
  }

  .bd-bentogrid-title {
    display: block;
    margin: 0;
  }

  .bd-bentogrid-description {
    display: block;
    margin: 0;
    color: var(--color-text-muted);
  }

  /* === GRID === */
  .bd-bentogrid-track {
    display: grid;
    /* The steps name the scale rather than repeating its values: --spacing-24
       IS 24px at the default root size, but in rem, so it grows when the reader
       enlarges their text and 24px does not. */
    gap: var(--bd-bento-gap, var(--spacing-16));
    /* auto, or 1fr when bento-grid.js finds a set of brand cards: every row
       then takes the tallest row's height, so a full-row card matches the
       pair above it rather than the lines its wider copy column wraps to */
    grid-auto-rows: var(--bd-bento-row-height, auto);
    width: 100%;
  }

  @container bento ${n(o(`sm`))} {
    .bd-bentogrid-track {
      gap: var(--bd-bento-gap, var(--spacing-20));
    }
  }

  @container bento ${n(o(`md`))} {
    .bd-bentogrid-track {
      gap: var(--bd-bento-gap, var(--spacing-24));
    }
  }

  /* One column until a pair has room, and a stacked grid is a single track:
     24 units carry 23 gaps, whose own minimum -- 368px at the small gap -- is
     wider than a phone. The equal grid used to keep them there and ran 25px
     past a 375px screen. */
  ${n(p(f))}

  ::slotted(bd-bento-item) {
    min-width: 0;
  }

  /* A featured item takes the whole row, paired or not. Paired, its span is
     already the row's (bento-grid.js); the equal grid has no spans to set. */
  :host([variant="equal"]) ::slotted(bd-bento-item[priority="featured"]) {
    grid-column: 1 / -1;
  }
`,h=e`
  :host {
    display: block;
    height: 100%;
    box-sizing: border-box;
  }

  /* A brand card is the container its own layout asks: the row, the column
     and the size of the art follow the card's width (BRAND, below). Only the
     brand tone: a size container contributes nothing to its own intrinsic
     width, and the other tones are also set in rows that size them to their
     content (Foundations/Visual Alignment's card family), where one would
     collapse. width: 100% for the same reason, in the grid cell a brand card
     always sits in. */
  :host([tone="brand"]) {
    width: 100%;
    container: bento-item / inline-size;
  }

  .bd-bentoitem-box {
    background: var(--color-surface-container);
    border-radius: var(--card-radius);
    padding: var(--card-padding);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    text-align: start;
    height: 100%;
    box-sizing: border-box;
    font-family: var(--typography-fontFamily-sans);
    min-width: 0;
    /* The same hover lift as trust-panel, now at the same scale step. */
    transition: transform var(--transition-duration-normal) var(--transition-easing-ease),
      box-shadow var(--transition-duration-normal) var(--transition-easing-ease);
    /* No edge. --color-surface-container is documented as "the ground of a
       self-contained object -- a card, a tile, a panel -- one step off the page
       so it reads as its own object WITHOUT needing a border or a shadow to say
       so", and this card sits on the page ground, so the tonal step is the
       separation and an edge is redundant with the role's own purpose.

       The rule, from the cards-and-surfaces review: a card on the page ground
       takes surface/container and no edge; a card on a tinted section takes
       surface/default plus a 1px border/container, because there is no tonal
       step available there and the edge earns its keep. Six components on the
       page ground drew no edge; this one drew one, and five identical siblings
       did not. See CLAUDE.md, "A card's ground and its edge". */
  }


  /* Only where something can hover: a tap leaves :hover on the card it
     touched, so a touch screen kept the last card lifted until the next tap
     landed somewhere else. */
  @media (hover: hover) {
    .bd-bentoitem-box:hover {
      transform: translateY(-3px);
      /* no token: trust-panel's card lift, the same 7% black layer -- see the
         reason there. */
      box-shadow: 0px 14px 40px color-mix(in srgb, var(--color-neutral-1000) 7%, transparent);
    }
  }

  /* Same reasoning as trust-panel, checked separately: the shadow is the part
     that communicates hover, the 3px is the part that moves. */
  @media (prefers-reduced-motion: reduce) {
    .bd-bentoitem-box {
      transition: none;
    }

    .bd-bentoitem-box:hover {
      transform: none;
    }
  }

  .bd-bentoitem-icon-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: var(--spacing-8);
    padding-bottom: var(--spacing-8);
    min-height: 48px;
  }

  .bd-bentoitem-icon,
  ::slotted([slot="icon"]) {
    max-width: 48px;
    max-height: 48px;
    width: 48px;
    height: 48px;
    object-fit: contain;
    display: block;
  }

  .bd-bentoitem-title-wrap {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-4);
    overflow: hidden;
    margin-bottom: var(--spacing-8);
    width: 100%;
  }

  .bd-bentoitem-body {
    margin: 0 0 1em 0;
    color: var(--color-text-secondary);
    width: 100%;
  }

  ::slotted(bd-p) {
    width: 100%;
  }

  /* === TONE VARIANTS ===
     The card has no edge (see .bd-bentoitem-box), so a tone is the fill
     alone. */
  :host([tone="tint"]) .bd-bentoitem-box {
    background: var(--status-brand-surface);
  }

  :host([tone="dark"]) .bd-bentoitem-box {
    /* The inverse ground the card's inverse ink is written for, running into
       the brand's darkest blue.
       no role: blue-950 is a gradient's far stop, decoration rather than a
       ground any text is measured against -- the same stop bd-cta-banner ends on. */
    background: linear-gradient(160deg, var(--color-surface-inverse) 0%, var(--color-brand-950) 130%);
  }

  :host([tone="dark"]) .bd-bentoitem-title-wrap bd-h {
    color: var(--color-text-inverse);
  }

  :host([tone="dark"]) .bd-bentoitem-body {
    color: var(--color-text-inverse);
  }

  /* below('md'), not below('sm'). The Comparison Panel and the Trust Panel both
     take the compact inset at md and this took it at sm, so the same card was
     affording 32px at 600px wide in one component and not in another. Two of
     the three picked md; this one moved. Visible: the inset steps down 192px
     of viewport earlier than it used to. */
  @media ${n(s(`md`))} {
    .bd-bentoitem-box {
      padding: var(--card-padding-compact);
    }
  }

  /* === BRAND ===
     The homepage AI cards, as the Figma 2026_splitter frames draw them. No
     hover lift: the CTA is the card's one control, and a card that moves as a
     whole promises a link it does not have.

     A card narrower than 518 (every phone): a column at the compact inset --
     the copy, the art whole in a square at the card's inner width, the CTA
     across the card -- 24 apart, at the smaller corner. */
  :host([tone="brand"]) .bd-bentoitem-box {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-24);
    padding: var(--spacing-24);
    background: var(--color-surface-brand);
    border-radius: var(--shape-radius-2xl);
    color: var(--color-brand-on-fill);
  }

  /* A set of brand cards shares one row height (bento-grid.js), so a card
     with shorter copy is taller than its content. In the column the slack
     goes above the CTA, which keeps every card's CTA on its bottom edge
     rather than leaving a gap under the shortest one.

     In the column the CTA also runs the card's width, as the Figma phone
     frame draws it; in the row it hugs its label. --bd-button-width is
     bd-button's width hook. It followed the screen (below md) while the
     layout followed the card, so a 518-543 card on a 550-575 screen drew the
     row with a CTA stretched across its 300 copy column. */
  @container bento-item (width < 518px) {
    :host([tone="brand"]) .bd-bentoitem-cta {
      margin-block-start: auto;
    }

    :host([tone="brand"]) .bd-bentoitem-cta ::slotted(*) {
      --bd-button-width: 100%;
    }
  }

  :host([tone="brand"]) .bd-bentoitem-box:hover {
    transform: none;
    box-shadow: none;
  }

  .bd-bentoitem-media {
    position: relative;
    /* the art is square; the phone frame draws its box 302 by 308 */
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: var(--shape-radius-xl);
    /* slotted motion art sizes itself from the box */
    container-type: size;
  }

  ::slotted([slot="media"]) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* bd-motion-art is square and draws at its own width, so the box gives it
     one: here the square box itself, the art whole. Margins, not a translate,
     so it centres in RTL too. */
  ::slotted(bd-motion-art[slot="media"]) {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    width: 100cqh;
    height: auto;
    margin-block-start: -50cqh;
    margin-inline-start: -50cqh;
  }

  .bd-bentoitem-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-12);
  }

  .bd-bentoitem-brand-title {
    margin: 0;
  }

  .bd-bentoitem-brand-body {
    margin: 0;
    font-family: var(--typography-body-regular-fontFamily);
    font-size: var(--typography-body-regular-fontSize);
    font-weight: var(--typography-body-regular-fontWeight);
    line-height: var(--typography-body-regular-lineHeight);
    letter-spacing: var(--typography-body-regular-letterSpacing);
    color: var(--color-brand-on-fill);
  }

  /* A card 518 wide or wider, tablet and desktop alike, is a row at the
     card inset: the copy over the CTA in a 300 column on the near side, 24
     apart and centred down the card, and the art from the column's edge out
     to the card's, bleeding through the inset. The featured card's column is
     a share of the row instead.

     518 is the narrowest card the frames draw as a row -- one of the pair at
     xl, half the 1060 column less the gap -- and it reads the card, not the
     screen: it was md, which gave a card in a narrow column at desktop the
     phone's column, and the 656 tablet card and the 518 pair the same row
     for different reasons. Measured: the column up to 511 wide (575 in
     Storybook), the row from 518, in every story. */
  @container bento-item (width >= 518px) {
    :host([tone="brand"]) .bd-bentoitem-box {
      display: grid;
      /* no token: the copy's measure, the 300 every frame gives it */
      grid-template-columns: 300px minmax(0, 1fr);
      /* The copy and CTA centred down the card by the two 1fr rows around
         them, rather than by align-content: the art spans all four rows, so
         it runs the card's full height however much taller than its copy
         the shared row height makes the card. No row gap, so the empty rows
         add nothing to a card that is only as tall as its content; the 24
         between copy and CTA is the CTA's margin. */
      grid-template-rows: 1fr auto auto 1fr;
      grid-template-areas:
        ".    media"
        "text media"
        "cta  media"
        ".    media";
      gap: 0;
      padding: var(--spacing-32);
      border-radius: var(--shape-radius-3xl);
    }

    :host([tone="brand"][priority="featured"]) .bd-bentoitem-box {
      /* not the column: the copy keeps to the near half of a full-row card */
      grid-template-columns: 42% minmax(0, 1fr);
    }

    .bd-bentoitem-text {
      grid-area: text;
    }

    .bd-bentoitem-cta {
      grid-area: cta;
      margin-block-start: var(--spacing-24);
    }

    .bd-bentoitem-media {
      grid-area: media;
      aspect-ratio: auto;
      border-radius: var(--radius-none);
      margin-block: calc(-1 * var(--spacing-32));
      margin-inline-end: calc(-1 * var(--spacing-32));
    }

    /* Beside the copy the art takes the card's height, so in one of the
       desktop pair -- whose art box is a tall strip -- the stack and the
       globe stay in the card beside their pills; a box wider than that, the
       featured card's, takes its own width. */
    ::slotted(bd-motion-art[slot="media"]) {
      inset-inline-start: 0;
      width: max(100cqw, 100cqh);
      margin-block-start: calc(max(100cqw, 100cqh) / -2);
      margin-inline-start: 0;
    }
  }

  /* A card a whole tablet column wide or wider draws the art larger than its
     box, as the tablet frame does: held against the copy, centred down the
     card, and running off the card's outer edge and its top and bottom --
     never off the side its badges and pills face. 135% of the card's height
     is that frame's 434 square on a 321 card. The pair never reaches 656
     (634 at the widest page) and a card 880 wide is the desktop's, so this
     is the tablet card's rule, between the two; it was the md-to-lg band of
     the screen, where every card is the 656 column. */
  @container bento-item (656px <= width < 880px) {
    ::slotted(bd-motion-art[slot="media"]) {
      width: max(100cqw, 135cqh);
      margin-block-start: calc(max(100cqw, 135cqh) / -2);
    }
  }

  /* A newline in the text is a line break, so a page can keep the breaks its
     copy was written with (a <br> in the authored eyebrow, heading or lead
     arrives as a newline in the property). Text only: nothing here renders
     HTML. The rule sits on a span around the text, not on bd-h or bd-p,
     whose own templates hold newlines that would break too. */
  .text,
  .bd-bentoitem-brand-body {
    white-space: pre-line;
  }
`,g=class extends i{static properties={title:{type:String},body:{type:String},icon:{type:String},priority:{type:String,reflect:!0},orientation:{type:String,attribute:`orientation`},tone:{type:String,reflect:!0},badge:{type:String},as:{type:String}};static styles=[a,h];constructor(){super(),this.title=``,this.body=``,this.icon=``,this.priority=`standard`,this.orientation=`auto`,this.tone=`default`,this.badge=``,this.as=`h3`}connectedCallback(){super.connectedCallback(),this.hasAttribute(`role`)||this.setAttribute(`role`,`listitem`)}_renderBrand(){return t`
      <div class="bd-bentoitem-box bd-bentoitem-brand">
        <div class="bd-bentoitem-text">
          ${this.badge?t`<bd-badge tone="info" variant="shade" size="sm">${this.badge}</bd-badge>`:``}
          ${this.title?t`<bd-h as="${this.as}" visual-level="h3" color="on-brand" class="bd-bentoitem-brand-title"><span class="text">${this.title}</span></bd-h>`:``}
          ${this.body?t`<p class="bd-bentoitem-brand-body">${this.body}</p>`:``}
        </div>
        <div class="bd-bentoitem-media"><slot name="media"></slot></div>
        <div class="bd-bentoitem-cta"><slot></slot></div>
      </div>
    `}render(){return this.tone===`brand`?this._renderBrand():t`
      <div class="bd-bentoitem-box">
        <div class="bd-bentoitem-icon-wrap">
          <slot name="icon">
            ${this.icon?t`<img src="${this.icon}" alt="" class="bd-bentoitem-icon" />`:``}
          </slot>
        </div>

        ${this.title?t`
              <div class="bd-bentoitem-title-wrap">
                <bd-h as="h5" fontWeight="bold"><span class="text">${this.title}</span></bd-h>
              </div>
            `:``}

        ${this.body?t`<bd-p variant="regular" class="bd-bentoitem-body"><span class="text">${this.body}</span></bd-p>`:``}

        <slot></slot>
      </div>
    `}};customElements.define(`bd-bento-item`,g);var _=/* @__PURE__ */ new Map,v=e=>{let t=JSON.stringify(e);if(!_.has(t)){let n=new CSSStyleSheet;n.replaceSync(p(e)),_.set(t,n)}return _.get(t)},y=class extends i{static properties={eyebrow:{type:String},title:{type:String},description:{type:String},maxColumns:{type:Number,attribute:`max-columns`},minCardWidth:{type:Number,attribute:`min-card-width`},wideShare:{type:Number,attribute:`wide-share`},variant:{type:String,reflect:!0},equalColumns:{type:Number,attribute:`equal-columns`},background:{type:String,reflect:!0}};static styles=[a,l,m];constructor(){super(),this.eyebrow=``,this.title=``,this.description=``,this.maxColumns=2,this.minCardWidth=260,this.wideShare=.7,this.variant=`weighted`,this.equalColumns=3,this.background=`none`}updated(e){e.has(`wideShare`)&&this._applyWeights(),[`maxColumns`,`equalColumns`,`minCardWidth`].some(t=>e.has(t))&&this._adoptColumnRules()}get _items(){return[...this.children].filter(e=>e.tagName===`BD-BENTO-ITEM`)}_applyWeights(){let e=this._items,t=0,n=0,r=Math.round(this.wideShare*24),i=24-r;for(;t<e.length;){let a=e[t];if(a.getAttribute(`priority`)===`featured`){a.style.setProperty(`--bd-bento-span`,`24`),t+=1;continue}let o=e[t+1],s=o&&o.getAttribute(`priority`)===`featured`;if(!o||s){a.style.setProperty(`--bd-bento-span`,`24`),t+=1;continue}let c=n%3==0;a.style.setProperty(`--bd-bento-span`,String(c?r:i)),o.style.setProperty(`--bd-bento-span`,String(c?i:r)),t+=2,n+=1}}get _isBrandSet(){let e=this._items;return e.length>1&&e.every(e=>e.getAttribute(`tone`)===`brand`)}_applyRowHeight(){this._isBrandSet?this.style.setProperty(`--bd-bento-row-height`,`1fr`):this.style.removeProperty(`--bd-bento-row-height`)}_adoptColumnRules(){let e={maxColumns:Math.min(2,this.maxColumns),equalColumns:Math.max(1,this.equalColumns),minCardWidth:this.minCardWidth},t=Object.keys(e).every(t=>e[t]===f[t]),n=this.renderRoot,r=n.adoptedStyleSheets.filter(e=>![..._.values()].includes(e));n.adoptedStyleSheets=t?r:[...r,v(e)]}_onSlotChange(){this._applyRowHeight(),this._applyWeights()}render(){return t`
      <div class="bd-ensemble">
      ${this.eyebrow||this.title||this.description?t`
            <div class="bd-bentogrid-header">
              ${this.eyebrow?t`
                    <bd-p variant="eyebrow" class="bd-bentogrid-eyebrow">
                      <slot name="eyebrow">${this.eyebrow}</slot>
                    </bd-p>
                  `:r}

              ${this.title?t`
                    <bd-h as="h2" class="bd-bentogrid-title">
                      <slot name="title">${this.title}</slot>
                    </bd-h>
                  `:r}

              ${this.description?t`
                    <bd-p variant="regular" class="bd-bentogrid-description">
                      <slot name="description">${this.description}</slot>
                    </bd-p>
                  `:r}
            </div>
          `:r}

      <div class="bd-bentogrid-track" role="list">
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
      </div>
    `}};customElements.define(`bd-bento-grid`,y);