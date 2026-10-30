import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import{r as a}from"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design8.js";import{t as o}from"../../_chunks/repobit-dex-system-design10.js";import"./accordion.js";import"../../_chunks/repobit-dex-system-design15.js";var s=e`
  /* padding-block, not padding-top alone. This section opened with 64px above
     it and closed with nothing, so whatever followed it sat flush against the
     last feature column -- measured 64px/0px while every other module in the
     family pads both ends (48/48 for five of them, 64/64 for three). The
     bottom now matches the top, which is what the module was already doing at
     one end.

     The duplicate display went with it: block was declared and then
     immediately overridden by flex on the next line but one, so it had never
     applied. */
  :host {
    --bd-acc-header-margin-bottom: var(--spacing-8);
    /* The section is the container that decides when the columns stack, not
       the screen: across the page the two are the same width, inside
       bd-tabs or any narrower column the columns stack with it. width: 100%
       because a size container contributes nothing to its own intrinsic
       width. */
    container-type: inline-size;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding-top: var(--spacing-64);
    /* A host that nests the section (bd-tabs) can shorten the closing pad. */
    padding-bottom: var(--bd-features-padding-bottom, var(--spacing-64));
    /* No padding-inline here: the gutter is the column's, inside the shadow
       root. A host pad was 24px on top of it standing alone, and inside
       bd-tabs -- where the nested column collapses to its parent's edges --
       it was the one inset left, putting the features 24px inside every
       other section's edge. */
  }

  /* Columns grid: its own measure -- one track of up to 400 per column, as
     many as there are columns -- centred inside the page column. The column
     count and the N x 400 cap used to be written inline by features.js; an
     auto-flowing column track says both. */
  .bd-features-container {
    margin-inline: auto;
    display: grid;
    grid-auto-flow: column;
    /* no token: the column's measure, the 400 the design gives each one */
    grid-auto-columns: minmax(0, 400px);
    /* The rows every column shares: icon, title, description, accordion. */
    grid-template-rows: repeat(4, auto);
    column-gap: var(--spacing-32);
    row-gap: 0;
    /* as wide as its columns, and no wider than the page column */
    width: fit-content;
    max-width: 100%;
  }

  /* Each column is a subgrid of those four rows, so a title that wraps to two
     lines, or a longer description, moves the next row down in every column
     at once. Each part names its row: a column without a description leaves
     that row empty rather than pulling its accordion up into it. */
  .bd-col {
    display: grid;
    grid-row: span 4;
    grid-template-rows: subgrid;
    align-content: start;
    min-width: 0;
  }

  .col-icon-wrapper     { grid-row: 1; }
  .col-title-wrapper    { grid-row: 2; }
  .col-description      { grid-row: 3; }
  /* The last part keeps its own height: the row is as tall as the longest
     accordion, and a shorter one has nothing to fill it with. */
  .bd-col > bd-accordion-section { grid-row: 4; align-self: start; }

  /* Icon wrapper */
  .col-icon-wrapper {
    display: flex;
    align-items: flex-start;
    margin-bottom: var(--spacing-8);
    overflow: hidden;
  }

  /* Title wrapper */
  .col-title-wrapper {
    display: flex;
    align-items: flex-start;
    margin-bottom: var(--spacing-8);
    overflow: hidden;
  }

  .col-description {
    margin-bottom: var(--spacing-24);
    font-family: var(--typography-fontFamily-sans);
    /* body-regular: base / normal / 1.5, which is what this already rendered.
       Size and leading only -- the role's family and tracking are not adopted. */
    font-size: var(--typography-body-regular-fontSize);
    color: var(--color-text-secondary);
    line-height: var(--typography-body-regular-lineHeight);
    overflow: hidden;
  }

  /* One column under another: nothing to line up across, so each column is a
     plain stack again, its parts at their own heights. The !important that
     stood here was beating the inline repeat(N) features.js wrote. */
  @container (width <= 600px) {
    .bd-features-container {
      grid-auto-flow: row;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: none;
      row-gap: var(--spacing-32);
      width: 100%;
    }

    .bd-col {
      display: flex;
      flex-direction: column;
      grid-row: auto;
    }

    /* across, in a column: full width, as every other part */
    .bd-col > bd-accordion-section {
      align-self: stretch;
    }
  }
`,c=class extends HTMLElement{};customElements.define(`bd-feature-col`,c);var l=class extends i{static styles=[o,s];_getCols(){return Array.from(this.querySelectorAll(`:scope > bd-feature-col`))}_renderCol(e){let n=e.querySelector(`[slot='description']`),r=e.querySelector(`[slot='icon']`),i=e.querySelector(`bd-accordion-section`),a=e.getAttribute(`title`),o=e.getAttribute(`icon-src`),s=e.getAttribute(`icon-alt`)||``;return t`
      <div class="bd-col">
        <div class="col-icon-wrapper">
          ${o?t`<bd-img
                src="${o}"
                alt="${s}"
                width="40"
                height="40"
                fit="contain"
                radius="none"
                shadow="none"
                loading="lazy"
              ></bd-img>`:r?r.cloneNode(!0):``}
        </div>
        <div class="col-title-wrapper">
          <bd-h as="h4">${a}</bd-h>
        </div>
        ${n?t`<div class="col-description"><bd-p variant="regular">${n.textContent}</bd-p></div>`:``}
        ${i?(()=>{let e=i.cloneNode(!0);return e.querySelectorAll(`bd-accordion-item`).forEach(e=>{e.style.setProperty(`--bd-acc-header-margin-bottom`,`var(--spacing-8)`)}),e})():``}
      </div>
    `}render(){return t`
      <div class="bd-ensemble">
      <div class="bd-features-container">
        ${this._getCols().map(e=>this._renderCol(e))}
      </div>
      </div>
    `}};customElements.define(`bd-features`,l);var u=e`
 :host {
  display: block;
  /* No type on this host. The headline is a bd-h and the sub-title a bd-p, and
     each atom sets size, weight and leading on its own inner element, so a
     weight, a size and a leading declared here reached no character of either.
     Proved by forcing this host to 70px/5/100 in all three stories and watching
     .bd-heading hold its heading-h3 role and the sub-title hold body-small,
     whatever those roles currently resolve to — 32/41.6/600 and 14/20.3/400
     when this was last measured, after the leading was derived from the font.
     The numbers move with the roles; the point is that neither budged. The
     .highlight-text spans are slotted into the bd-h, so they inherit through
     the flattened tree from .bd-heading too. text-align stays: neither atom
     sets it, so it does inherit through. */
  font-family: var(--typography-fontFamily-sans);
  text-align: center;
  color: var(--color-text-primary);
  /* no token: a centred title measure, deliberately narrower than the page
     column (--layout-ensemble-max-width); nothing on the scale sits between
     --content-width-readable and that column */
  max-width: 820px;
  margin: 0 auto;
}
  
.sub-title {
  color: var(--color-text-brand);
  margin: 0 0 var(--spacing-24) 0;
}

  .headline {
    margin: 0;
  }

  .highlight {
    display: inline;
    background: var(--color-surface-info);
    color: var(--color-text-primary);
    /* The three rungs of the ladder this atom stacks its own internals on:
       the tint sits below the line, the text on it, the decorations above. */
    z-index: var(--z-below);
    position: relative;
    margin-inline: calc(-1 * var(--spacing-4));
  }

.highlight-text {
  position: relative;
  z-index: var(--z-base);
  padding-inline: var(--spacing-4);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

  /* Empty and inline on purpose: it takes the same content box as the text
     beside it and has no width to break, so it rides along to whichever line
     its end of the phrase lands on. An absolutely positioned child of
     .highlight itself resolves against a single line fragment, which is why
     both decorations piled onto the first line when the phrase wrapped. */
  .highlight-anchor {
    position: relative;
  }

  .highlight-deco {
    /* Local so the two insets below derive from the box rather than restating
       a number per breakpoint. The bar is centred in this box, so pulling the
       box out by half its spare width lands the bar on the background edge. */
    --bd-highlight-deco-width: var(--spacing-8);
    --bd-highlight-deco-inset: calc(
      -1 * (var(--bd-highlight-deco-width) - var(--spacing-2)) / 2
    );

    position: absolute;
    width: var(--bd-highlight-deco-width);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    pointer-events: none;
    z-index: var(--z-raised);
  }

  /* .left and .right are the phrase's start and end (highlight.js puts one
     before it and one after), so they sit on the inline edges: in a
     right-to-left page .left is the right-hand bar. */
  .highlight-deco.left {
    inset-inline-start: var(--bd-highlight-deco-inset);
    top: calc(-1 * var(--spacing-4));
    bottom: 0;
  }

  /* Mirrors .left against the other edge of the same box. It used to be
     positioned against a 1px anchor span whose distance from that edge changed
     with the surrounding text, which is why the bar drifted clear of the
     background when the highlight was the last word. */
  .highlight-deco.right {
    inset-inline-end: var(--bd-highlight-deco-inset);
    top: 0;
    bottom: calc(-1 * var(--spacing-4));
  }

  /* no token: the brand decoration mark. blue-500 is the right step but no
     role names it — --color-border-brand is a border, --status-brand-fill is a
     chip background, and neither is an ornament. This needs a decoration role
     before it can be spelled as one; inventing one for a single consumer is
     what the token layer is trying to stop. */
  .highlight-svg-rect {
    width: var(--spacing-2);
    /* whatever the dot leaves, so the bar always ends on the background edge */
    flex: 1;
    /* no role: the deco bar, same decision as the ellipses below -- ornament flanking the
       highlighted text, not a mark, so an ink role is the wrong family. 4.20:1 against
       the blue-50 ground, over the 3:1 non-text bar. */
    fill: var(--color-brand-500);
    margin: 0;
    display: block;
  }

  .highlight-svg-ellipse-top,
  .highlight-svg-ellipse-bottom {
    flex: none;
    width: var(--bd-highlight-deco-width);
    height: var(--bd-highlight-deco-width);
    /* no role: the two deco ellipses. These are ORNAMENT, not a mark and not a glyph in
       a text flow -- highlight.js puts them inside <span class="highlight-deco left|right">
       flanking <span class="highlight-text">, a bracket construct drawn around the
       highlighted words. Every icon role candidate in this package is an INK role, and
       ink is the wrong family for a bracket: naming one here would misdescribe these the
       way calling the terminal's line-kind blues "brand" would have. They pass their bar
       already -- 4.20:1 against the blue-50 ground, where 3:1 is the non-text minimum.
       See plans/reports/phase-2-vocab-b-icon-colour.md. */
    fill: var(--color-brand-500);
    display: block;
  }

  /* Narrower than sm. A media condition cannot read a custom property, so
     below() interpolates the value; 600px was on no scale at all, and the
     576px that replaced it still matched at exactly 576px, where sm begins. */
  @media ${n(a(`sm`))} {

  .highlight-deco {
    --bd-highlight-deco-width: var(--spacing-6);
  }


}

  /* The tint is the highlight, and forced colours repaint it as Canvas: the
     phrase read exactly like the words around it. It opts out into the
     system's Highlight pair, and the bracket bars, which sit on its edges,
     draw in CanvasText so they still show against it.

     It also leaves the rung below the line. Chromium paints a Canvas
     backplate behind forced text, and the heading's backplate covered a tint
     stacked under it -- measured, the phrase came out HighlightText on that
     white, which is to say blank. */
  @media (forced-colors: active) {
    .highlight {
      forced-color-adjust: none;
      background: Highlight;
      color: HighlightText;
      z-index: auto;
    }

    .highlight-svg-rect,
    .highlight-svg-ellipse-top,
    .highlight-svg-ellipse-bottom {
      fill: CanvasText;
    }
  }
`,d=class extends i{static properties={highlightText:{type:String,attribute:`highlight-text`},subTitle:{type:String,attribute:`sub-title`},as:{type:String}};static styles=[u];constructor(){super(),this.highlightText=``,this.subTitle=``,this.as=`h3`}connectedCallback(){super.connectedCallback(),this._observer=new MutationObserver(()=>this.requestUpdate()),this._observer.observe(this,{childList:!0,characterData:!0,subtree:!0})}disconnectedCallback(){this._observer?.disconnect(),super.disconnectedCallback()}_markedHeadline(e){let t=document.createDocumentFragment();for(let e of this.childNodes)t.append(e.cloneNode(!0));let n=document.createTreeWalker(t,NodeFilter.SHOW_TEXT);for(let r=n.nextNode();r;r=n.nextNode()){let n=r.data.indexOf(e);if(n===-1)continue;let i=r.splitText(n);i.splitText(e.length);let a=p().content.cloneNode(!0);return a.querySelector(`.highlight-text`).textContent=e,i.replaceWith(a),t}return null}render(){let e=this.highlightText||``,n=e?this._markedHeadline(e):null,r=this.subTitle?t`<bd-p variant="small" class="sub-title">${this.subTitle}</bd-p>`:null;return t`
      ${r}
      <bd-h as="${this.as}" class="headline">${n??t`<slot></slot>`}</bd-h>
    `}},f,p=()=>(f||(f=document.createElement(`template`),f.innerHTML=`<span class="highlight"><span class="highlight-anchor"><span class="highlight-deco left"><svg class="highlight-svg-ellipse-top" viewBox="0 0 8 8"><ellipse cx="4" cy="4" rx="4" ry="4"/></svg><svg class="highlight-svg-rect" viewBox="0 0 2 42" preserveAspectRatio="none"><rect x="0" y="0" width="2" height="42"/></svg></span></span><span class="highlight-text"></span><span class="highlight-anchor"><span class="highlight-deco right"><svg class="highlight-svg-rect" viewBox="0 0 2 42" preserveAspectRatio="none"><rect x="0" y="0" width="2" height="42"/></svg><svg class="highlight-svg-ellipse-bottom" viewBox="0 0 8 8"><ellipse cx="4" cy="4" rx="4" ry="4"/></svg></span></span></span>`),f);customElements.define(`bd-highlight`,d);var m=class extends i{static properties={tabs:{type:Array},selected:{type:Number,reflect:!0},label:{type:String},panelId:{type:String,attribute:`panel-id`},idPrefix:{type:String,attribute:`id-prefix`},appearance:{type:String,reflect:!0}};createRenderRoot(){return this}constructor(){super(),this.tabs=[],this.selected=0,this.label=``,this.panelId=``,this.idPrefix=`bd-tab`}tabId(e){return`${this.idPrefix}-${e}`}_select(e,{focus:t=!1}={}){e!==this.selected&&(this.selected=e,this.dispatchEvent(new CustomEvent(`bd-tab-select`,{detail:{index:e},bubbles:!0,composed:!0})),t&&this.updateComplete.then(()=>this._focusSelected()))}_sizeSwitcherOptions(){if(this.appearance!==`switcher`)return;let e=this.querySelector(`.bd-tabs-container`),t=[...this.querySelectorAll(`.bd-tab-button`)];if(!e||!t.length)return;e.style.removeProperty(`--bd-switcher-option-width`);let n=Math.max(...t.map(e=>e.getBoundingClientRect().width));n>0&&e.style.setProperty(`--bd-switcher-option-width`,`${n}px`)}updated(e){super.updated(e),this._sizeSwitcherOptions()}firstUpdated(){document.fonts?.ready.then(()=>this._sizeSwitcherOptions())}_focusSelected(){this.querySelector(`#${CSS.escape(this.tabId(this.selected))}`)?.focus()}_onKeydown(e){let t=this.tabs.length-1;if(t<0)return;let n=this.matches(`:dir(rtl)`)?{ArrowRight:`ArrowLeft`,ArrowLeft:`ArrowRight`}[e.key]??e.key:e.key,r;switch(n){case`ArrowRight`:r=this.selected===t?0:this.selected+1;break;case`ArrowLeft`:r=this.selected===0?t:this.selected-1;break;case`Home`:r=0;break;case`End`:r=t;break;default:return}e.preventDefault(),this._select(r,{focus:!0})}render(){return t`
      <div
        class="bd-tabs-container ${this.appearance===`switcher`?`bd-tabs-container--switcher`:``}"
        role="tablist"
        aria-label=${this.label||r}
        @keydown=${this._onKeydown}
      >
        ${this.tabs.map((e,n)=>{let i=this.selected===n;return t`
            <button
              type="button"
              role="tab"
              id=${this.tabId(n)}
              aria-selected=${i?`true`:`false`}
              aria-controls=${this.panelId||r}
              tabindex=${i?`0`:`-1`}
              class="bd-tab-button"
              @click=${()=>this._select(n)}
            >
              ${e.icon?t`<img src=${e.icon} alt=${e.iconAlt||``} class="bd-tab-icon" />`:``}
              <span class="bd-tab-label">${e.content??e.label}</span>
            </button>
          `})}
      </div>
    `}};customElements.define(`bd-tab-list`,m);var h=e`
  /* The element is a pass-through wrapper: the strip itself stays the flex/grid
     item it was before the extraction, so surrounding layout is unaffected. */
  bd-tab-list {
    display: contents;
  }

  .bd-tabs-container {
    display: inline-flex;
    justify-content: center;
    flex-wrap: wrap;
    border-bottom: var(--border-width-1) solid var(--bd-tab-border-color, var(--color-border-container));
  }

  .bd-tab-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--bd-tab-gap, var(--spacing-8));
    background: none;
    border: none;
    padding: var(--bd-tab-padding, var(--spacing-10) var(--spacing-16));
    cursor: pointer;
    position: relative;
    color: var(--bd-tab-color, var(--color-text-brand));
    font-family: var(--typography-fontFamily-sans);
    /* body-regular, the same role bd-anchor-nav's and bd-page-switcher's items
       resolve through.

       This was body-large at semibold -- 18px/600 -- with no leading declared
       at all, on the argument that a tab's type is a control's rather than a
       text role's. The wayfinding family review settled it the other way: all
       three of these components are labels with an action attached, they mark
       the current one the same way, and there was no reason for one of them to
       be a size and a weight apart. At 16/1.5 the tab box is 10 + 24 + 10, so
       all three now measure 44px.

       The leading is declared either way, and that part was a defect on its
       own. An 18px label sat on IBM Plex Sans's own metric while the nav bars
       beside it sat on a declared 24px -- and a leading nobody declares is the
       blind spot neither gate can see: lint:tokens needs a DECLARED value to
       report, and typography coverage only fails on multi-line text, which a
       single-line tab label never is. */
    font-size: var(--bd-tab-font-size, var(--typography-body-regular-fontSize));
    line-height: var(--bd-tab-line-height, var(--typography-body-regular-lineHeight));
    font-weight: var(--bd-tab-font-weight, var(--typography-body-regular-fontWeight));
    transition: color var(--transition-duration-fast) var(--transition-easing-smooth);
  }

  .bd-tab-button::after {
    content: "";
    height: var(--bd-tab-underline-height, var(--indicator-underline-height));
    background: var(--bd-tab-underline-color, var(--indicator-color));
    position: absolute;
    left: 0;
    bottom: 0;
    /* Full width, scaled to nothing at rest and grown with scale, as
       bd-pagination-dots grows its fill: the compositor draws it, where the
       width transition that stood here re-laid the line out every frame. It
       grows from the inline start. :dir() on the button rather than :host(),
       because the stories use this sheet at document scope, where :host()
       matches nothing. */
    width: 100%;
    scale: 0 1;
    transform-origin: left center;
    transition: scale var(--bd-tab-underline-duration, var(--indicator-underline-duration))
      var(--indicator-underline-easing);
  }

  .bd-tab-button:dir(rtl)::after {
    transform-origin: right center;
  }

  /* The transition two rules up had nothing to animate on pointer: this sheet
     declared a colour transition and then no :hover rule anywhere, so a tab
     was the one control in the package that gave no feedback under the
     cursor.

     action/primary-active is the step this system already uses for an
     interactive element under the pointer -- bd-link's :hover and the anchor
     nav's engaged dropdown option both resolve to it -- and it is a step
     darker than the resting --color-text-brand, so the change is visible
     without becoming the selected ink. Excluding the selected tab keeps its
     text/primary from moving under the cursor.

     Selected is read off aria-selected, the attribute the tab already
     carries for a screen reader, rather than a class kept in step with it:
     what is drawn and what is announced cannot disagree. */
  .bd-tab-button:hover:not([aria-selected="true"]) {
    color: var(--color-action-primary-active);
  }

  .bd-tab-button[aria-selected="true"]::after {
    scale: 1;
  }

  .bd-tab-button[aria-selected="true"] {
    color: var(--bd-tab-color-selected, var(--color-text-primary));
    /* no role: the weight that marks the current item -- a state or modifier
       weight, not a text-content type. See button.css.js's .button--bold for
       the argument, and bd-link's current link, which is the same 700 on
       the same job in the other two components of this family. The tab used to
       carry semibold at rest AND selected, so its weight said nothing about
       which item you were on -- colour and the indicator carried it alone. */
    font-weight: var(--bd-tab-font-weight-selected, var(--typography-fontWeight-bold));
  }

  .bd-tab-button:focus-visible {
    /* the one focus ring — see Foundations/Focus */
    /* forced-colors mode does not paint box-shadow, so the ring
       vanishes there; it does paint an outline, in a system colour. This one
       is transparent everywhere else, and the offset lands it on the ring's
       outer band. */
    outline: var(--border-width-2) solid transparent;
    outline-offset: var(--focus-outline-offset);
    box-shadow: var(--focus-outline-primary);
    border-radius: var(--focus-outline-radius);
  }

  /* Icon sizing is deliberately not defaulted here: the two sections that use
     icons size them differently and neither value has a dimension token, so
     each keeps its own rule rather than this atom inventing a size. */

  .bd-tab-label {
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .bd-tab-button,
    .bd-tab-button::after {
      transition: none;
    }
  }

  /* The underline is a background, and forced colours repaint every
     background as Canvas, so the selected tab lost its line and kept only
     its weight. It opts out and draws in Highlight, the system colour for a
     selected thing. */
  @media (forced-colors: active) {
    .bd-tab-button::after {
      forced-color-adjust: none;
      background: Highlight;
    }
  }

  /* Narrower than sm. A media condition cannot read a custom property, so
     below() interpolates the value; 600px was on no scale at all, and the
     576px that replaced it still matched at exactly 576px, where sm begins. */
  @media ${n(a(`sm`))} {
    .bd-tabs-container {
      gap: var(--spacing-4);
    }

    .bd-tab-button {
      padding: var(--bd-tab-padding-mobile, var(--spacing-8) var(--spacing-12));
    }
  }
`;e`
  .bd-tabs-container--switcher {
    display: inline-grid;
    grid-auto-flow: column;
    /* minmax(max-content, 1fr), NOT 1fr. Measured on the Unequal labels story:
       a bare 1fr gave 127.21px and 141.79px -- two unequal columns, both
       narrower than their content, so the labels wrapped to four lines. An fr
       track under a shrink-to-fit container does not equalise to the widest
       sibling, which is the assumption that was wrong.
       .
       minmax(max-content, 1fr) was the next attempt and gave 78.35 and 248.77
       -- each column at its own max-content, still unequal. Once the width IS
       definite an fr track splits it evenly instead, which is a different
       wrong answer. There is no grid declaration that gives all three of hug,
       equal, and equal-to-the-widest.
       .
       So the width arrives measured: _sizeSwitcherOptions in tab-list.js
       publishes the widest option's width and this reads it. max-content is
       the fallback for the frame before the first measurement, which is also
       what keeps the geometry right if the property is ever absent -- and it
       is a component-local property, the one place CLAUDE.md allows a
       fallback. */
    grid-auto-columns: var(--bd-switcher-option-width, max-content);
    gap: var(--spacing-4);
    padding: var(--spacing-4);
    border-bottom: none;
    border-radius: var(--radius-full);
    background: var(--color-action-primary);
  }

  .bd-tabs-container--switcher .bd-tab-button {
    /* the action-label step, which is what a button's label carries */
    --bd-tab-font-weight: var(--typography-control-label-large-fontWeight);
    --bd-tab-font-weight-selected: var(--typography-control-label-large-fontWeight);
    --bd-tab-color: var(--color-brand-on-fill);   /* on the brand track */
    --bd-tab-color-selected: var(--color-text-primary);
    --bd-tab-padding: var(--spacing-12) var(--spacing-24);
    /* held at the same padding below sm: the base sheet drops to 8/12 there,
       which would take the pill off the 48px option the design specifies, and
       two 123px options plus the track padding still fit a 375px viewport. */
    --bd-tab-padding-mobile: var(--spacing-12) var(--spacing-24);
    border-radius: var(--radius-full);
    /* An option is a control label, so it is one line by definition. The base
       sheet lets a tab wrap, which is right for a strip that reflows; here a
       wrap would break the pill geometry the design specifies. */
    white-space: nowrap;
    transition: color var(--transition-duration-fast) var(--transition-easing-smooth),
      background-color var(--transition-duration-fast) var(--transition-easing-smooth);
  }

  .bd-tabs-container--switcher .bd-tab-button[aria-selected="true"] {
    background: var(--color-surface-default);
  }

  /* The underline belongs to the other appearance. Left as display:none rather
     than content:none so the base rule's scale transition has nothing to
     animate either. */
  .bd-tabs-container--switcher .bd-tab-button::after {
    display: none;
  }

  /* The base hover goes to action/primary-active, a darker blue, which on this
     blue track would be close to invisible and is the wrong direction anyway.
     The unselected option is already white, so the pointer affordance is the
     pill appearing under it -- white at 12%, which reads on blue-500 without
     competing with the selected option's solid white. */
  .bd-tabs-container--switcher .bd-tab-button:hover:not([aria-selected="true"]) {
    color: var(--color-brand-on-fill);
    background: var(--color-border-container-inverse);
  }

  @media (prefers-reduced-motion: reduce) {
    .bd-tabs-container--switcher .bd-tab-button {
      transition: none;
    }
  }

  /* The pill is the whole of the selected state here, and forced colours
     repaint it -- and the track under it -- as Canvas: every option read the
     same. The selected one opts out into the system's selected pair. */
  @media (forced-colors: active) {
    .bd-tabs-container--switcher .bd-tab-button[aria-selected="true"] {
      forced-color-adjust: none;
      background: Highlight;
      color: HighlightText;
    }
  }
`;var g=e`
  :host {
    font-size: 100%;
    display: block;
    font-family: var(--typography-fontFamily-sans);
    --bd-features-padding-bottom: 0;
  }

  :host([bg-blue]) {
    background: var(--color-brand-50);
    --bd-features-padding-bottom: var(--spacing-32);
  }

  .bd-tabs-component {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }

  bd-highlight,
  .bd-tabs-subtitle,
  .bd-tabs-container {
    margin: var(--spacing-24);
    box-sizing: border-box;
  }

  .bd-tabs-subtitle {
    font-size: var(--typography-body-regular-fontSize);
    max-width: 780px;
    text-align: center;
    font-family: var(--typography-fontFamily-sans);
    margin-top: var(--spacing-32);
    margin-bottom: var(--spacing-32);
  }

  /* The tab strip itself lives in Components/Tab List (tabListCSS, included in
     static styles above). Only this section's own layout stays here. */

  /* Panel — full width, fara padding inline. Every panel is rendered into the
     one cell, so the row is the tallest panel's height and a tab switch moves
     nothing below the section (see _cloneOf in tabs.js). minmax(0, 1fr) keeps
     the track at the wrapper's width: an auto track would grow to the widest
     panel's min-content and lay the visible panel out wider than the column. */
  .bd-panel-wrapper {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
    box-sizing: border-box;
  }

  .bd-panel {
    grid-area: 1 / 1;
  }

  /* Out of sight, still in layout -- display: none would take the inactive
     panels out of the height they are here to hold. inert keeps them out of
     the tab order and the accessibility tree. */
  .bd-panel[inert] {
    visibility: hidden;
  }

  /* No column rules. A tab panel's columns are bd-features' -- every panel in
     every story wraps its content in <bd-features>, which renders .bd-col,
     .col-icon-wrapper, .col-title-wrapper, .col-title and .col-description
     into its own shadow root and styles them from features.css.js. A copy of
     six of those selectors stood here and could not reach across that
     boundary: measured 0 matches for every one of them across 9 bd-tabs shadow
     roots in 604 built stories.

     Two recorded findings went with them, and neither was a question about
     tabs. The 24px/1.5 column title in scripts/typography-pairings.json was
     this file's .col-title, so the pairing it recorded rendered nowhere; and
     the two responsive widths were this file's entries in the lg and 600
     column groups, where bd-features carries the live ones. */
`,_=class extends i{static styles=[];render(){return t`<slot></slot>`}};customElements.define(`bd-tab-panel`,_);function*v(e){for(let t of[e,e.shadowRoot].filter(Boolean))for(let e of t.querySelectorAll(`*`))yield e,e.shadowRoot&&(yield*v(e.shadowRoot))}function y(e){e instanceof HTMLMediaElement?(e.autoplay=!1,e.pause()):e instanceof HTMLIFrameElement?(e.removeAttribute(`srcdoc`),e.getAttribute(`src`)!==`about:blank`&&(e.src=`about:blank`)):e.localName.includes(`-`)&&`paused`in e&&(e.paused=!0)}async function b(e){for(let t=0;t<3;t++){let t=[...v(e)];t.forEach(y);let n=t.filter(e=>e.isUpdatePending);if(!n.length)return;await Promise.all(n.map(e=>e.updateComplete.catch(()=>{})))}}var x=class extends i{static properties={title:{type:String},subtitle:{type:String},highlightText:{type:String,attribute:`highlight-text`},selectedTab:{type:Number,state:!0},bgBlue:{type:Boolean,reflect:!0,attribute:`bg-blue`}};static styles=[o,h,g];constructor(){super(),this.title=``,this.subtitle=``,this.highlightText=``,this.selectedTab=0,this.bgBlue=!1,this._clones=/* @__PURE__ */ new WeakMap,this._sizers=[]}_getPanels(){return Array.from(this.querySelectorAll(`:scope > bd-tab-panel`))}selectTab(e){this.selectedTab=e}connectedCallback(){super.connectedCallback(),this._panelObserver??=new MutationObserver(()=>this._recopy()),this._panelObserver.observe(this,{childList:!0,subtree:!0,characterData:!0})}disconnectedCallback(){super.disconnectedCallback(),this._panelObserver.disconnect()}willUpdate(e){e.size||(this._clones=/* @__PURE__ */ new WeakMap)}_recopy(){this._clones=/* @__PURE__ */ new WeakMap,this.requestUpdate()}_cloneOf(e,t){let n=this._clones.get(e);return n?.live!==t&&(n={live:t,node:t?e.cloneNode(!0):this._sizer(e)},this._clones.set(e,n),t||this._sizers.push(n.node)),n.node}_sizer(e){let t=document.createElement(`div`),n=e.cloneNode(!0);return[n,...n.querySelectorAll(`*`)].forEach(y),t.attachShadow({mode:`open`}).append(n),t}updated(){for(let e of this._sizers.splice(0))b(e)}render(){let e=this._getPanels();return t`
      <div class="bd-ensemble bd-tabs-component">

        ${this.title?t`<bd-highlight highlight-text="${this.highlightText}">${this.title}</bd-highlight>`:``}

        ${this.subtitle?t`<bd-p variant="large" class="bd-tabs-subtitle">${this.subtitle}</bd-p>`:``}

        <bd-tab-list
          .tabs=${e.map(e=>({label:e.getAttribute(`title`)}))}
          .selected=${this.selectedTab}
          id-prefix="tab-btn"
          panel-id="tab-panel"
          @bd-tab-select=${e=>this.selectTab(e.detail.index)}
        ></bd-tab-list>

        <div
          id="tab-panel"
          role="tabpanel"
          aria-labelledby="tab-btn-${this.selectedTab}"
          class="bd-panel-wrapper"
        >
          ${e.map((e,n)=>t`
            <div class="bd-panel" ?inert=${n!==this.selectedTab}>${this._cloneOf(e,n===this.selectedTab)}</div>
          `)}
        </div>

      </div>
    `}};customElements.define(`bd-tabs`,x);