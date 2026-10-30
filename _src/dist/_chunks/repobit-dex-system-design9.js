import{c as e,n as t}from"./lit.js";var n=e`
  :host {
    display: block;
    margin-bottom: var(--bd-acc-item-margin-bottom, var(--spacing-16));
    box-sizing: border-box;
    border-radius: var(--shape-radius-sm);
  }

  /* The one focus ring, on the item.

     Two owners are in play and they are deliberately different elements. The
     TRIGGER owns focus: it is the button, it carries aria-expanded, a keyboard
     lands on it and a screen reader announces it. The ITEM owns the focus
     VISUAL: a disclosure is perceived as one object -- the question and, when
     open, its answer -- and the ring goes round that object, growing with the
     answer when it is revealed. Measured before the item drew it, on
     Components/Accordion "Item open by default": host [99,131,1242,61],
     trigger [99,131,1242,24], content [99,171,1242,21] -- the ring stopped at
     the question and the answer sat outside it.

     Exactly one painter. The trigger's :focus-visible rule below sets outline
     none and nothing else; the ring lives here. P6C.2.1 found both painting the
     same --focus-outline-primary and removed the host's; P6C.2.2 moved the one
     ring up to the item and took the trigger's away, so the invariant that
     phase established -- one token, one painter -- still holds.

     The item is .disclosure, the element in this shadow root that holds the
     trigger and the panel and fills the host's box, so :has() can see the
     trigger match :focus-visible. The host cannot: :host(:has(...)) looks at
     light-DOM children, never at the shadow tree. It used to be the host all
     the same, through data-bd-acc-focus, an attribute script set two frames
     after focusin and again on every keydown when the trigger matched
     :focus-visible; the selector answers both of those as they happen. A
     mouse click is still not :focus-visible, so it still draws no ring.

     The radius is the host's, inherited, for the reason the bg item's note
     gives: the ring follows the item's own corner.

     The stacking is measured: --bd-acc-item-margin-bottom is a public custom
     property, and with it zeroed on AccordionBg "FAQ - Default" a 300x5
     sample where the ring overlaps the next item holds 600 blue-500 pixels
     with position/z-index and 0 without -- the next item's tint paints over
     the ring. On the untinted bd-accordion-item it reads 600 either way.

     bd-accordion-bg-item adopts this stylesheet too, so this is the one rule
     that rings and stacks the whole accordion family. */
  .disclosure {
    border-radius: inherit;
  }

  .disclosure:has(> :is(.header, .bd-accordion-bg-question):focus-visible) {
    position: relative;
    z-index: var(--z-base);
    /* The host's ground, repainted by the element that draws the ring, so
       one element anti-aliases the ring's inner corner against the tint.
       Split between the two, the corner showed a faint tinted seam inside
       the ring's white band (60 pixels at 8x, measured). Unset hosts are
       transparent, so this paints nothing on them. */
    background-color: inherit;
    box-shadow: var(--focus-outline-primary);
    /* forced-colors mode does not paint box-shadow, so the ring
       vanishes there; it does paint an outline, in a system colour. This one
       is transparent everywhere else, and the offset lands it on the ring's
       outer band. */
    outline: var(--border-width-2) solid transparent;
    outline-offset: var(--focus-outline-offset);
  }

  :host(:last-child) {
    margin-bottom: 0;
  }

  /* The section variants reach the items as custom properties, set on
     bd-accordion-section's own host (accordionSection below) and inherited
     through the slot. They were :host-context() rules here, which only
     Chromium implements: in Safari and Firefox the small variant's padding,
     type and colours, and the item spacing, never applied. The default
     section's block went with them -- every value in it was already the
     fallback each rule below carries, and its title colours were never read. */

  ::slotted(bd-list) {
    --bd-li-margin-bottom: var(--spacing-16);
    display: block;
    margin-bottom: var(--spacing-16);
  }

  ::slotted(bd-list:last-child) {
    margin-bottom: 0;
  }

  /* bd-p in bd-accordion simplu — spacing-16 intre paragrafe */
  ::slotted(bd-p:last-of-type) {
    --bd-paragraph-margin-bottom: 0;
  }

  .header {
    display: flex;
    align-items: flex-start;
    width: 100%;
    padding: var(--bd-acc-header-padding, var(--spacing-0));
    border: none;
    background: none;
    text-align: start;
    cursor: pointer;
    gap: var(--bd-acc-icon-gap, var(--spacing-12));
    font-family: var(--typography-fontFamily-sans);
    font-style: normal;
    font-size: var(--bd-acc-title-font-size, var(--typography-label-large-fontSize));
    font-weight: var(--bd-acc-title-font-weight, var(--typography-label-large-fontWeight));
    line-height: var(--bd-acc-title-line-height, var(--typography-label-large-lineHeight));
    margin-bottom: var(--bd-acc-header-margin-bottom, var(--spacing-16));
  }

  /* No ring on the trigger. outline: none is not a removal: the visible focus
     indicator is the item's ring, drawn by .disclosure above on exactly the
     frames this pseudo-class matches. Painting it here as well is the double
     ring P6C.2.1 measured and removed. */
  .header:focus-visible {
    outline: none;
  }

  .header[aria-expanded="true"] .title {
  /* blue-500 is 4.2:1 on the blue-50 tint these titles sit on; blue-600 is 5.72 */
    color: var(--bd-acc-title-color-expanded, var(--color-text-brand));
  }

  .header[aria-expanded="false"] .title {
    color: var(--bd-acc-title-color-collapsed, var(--color-text-brand));
  }

  /* Only a section that sets a hover colour changes on hover; the fallback is
     each state's own colour. */
  .header[aria-expanded="true"]:hover .title {
    color: var(--bd-acc-title-color-hover, var(--bd-acc-title-color-expanded, var(--color-text-brand)));
  }

  .header[aria-expanded="false"]:hover .title {
    color: var(--bd-acc-title-color-hover, var(--bd-acc-title-color-collapsed, var(--color-text-brand)));
  }

  .toggle {
    flex-shrink: 0;
    width: var(--bd-acc-toggle-size, var(--icon-sm-size));
    min-width: var(--bd-acc-toggle-size, var(--icon-sm-size));
    height: var(--bd-acc-toggle-size, var(--icon-sm-size));
    display: flex;
    align-items: center;
    justify-content: center;
    /* the box holds an icon, not text; none collapses the leading to the
       glyph rather than reserving a text line around it */
    line-height: var(--typography-lineHeight-none);
    /* Safari reads only the prefixed property */
    -webkit-user-select: none;
    user-select: none;
    margin-top: calc(
      (var(--bd-acc-title-line-height, var(--typography-label-large-lineHeight)) * 1em -
      var(--bd-acc-toggle-size, var(--icon-sm-size))) / 2
    );
  }

  /* A ".toggle img" rule stood here and could never match. The toggle renders
     <bd-plus-icon>, <bd-minus-icon> or the chevron atoms, each taking its own
     size and color props -- there has been no <img> here since that migration,
     and the atom's props already carry what this rule was sizing.
     .
     Those props pass --color-text-brand, the same role .header carries and the
     one bd-link's whole family resolves to. They passed --color-blue-500 until
     the Figma audit put icon and label side by side: the label was already the
     role, so the toggle disagreed with its own text by one step. This file had
     already made the same move twice -- on .header[aria-expanded="true"] .title
     and on .user-guide-link a -- and the icon was the hold-out, passing on the
     3:1 non-text bar where the text beside it needed 4.5:1. */

  .title {
    font-weight: var(--bd-acc-title-font-weight, var(--typography-label-large-fontWeight));
  }

  /* Wrapping is the whole mechanism: whether a title and its badge fit on one
     line depends on how long the title is and how much room this accordion
     has, not on how wide the window is. A 430px viewport rule used to force
     the column stack, which was both too eager and too narrow -- measured, a
     320px-wide accordion on a 1280px viewport never triggered it and laid out
     correctly anyway, while a short title on a 320px viewport was stacked when
     it would have fitted. flex-wrap answers the question actually being asked. */
  .title-badge-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-8);
    flex: 1;
    flex-wrap: wrap;
  }

  /* The panel is indented past the toggle, so the indent is on the inline
     start: on a right-to-left page the toggle and the indent are both on the
     right. The section variant passes its padding as a block pair and an
     inline pair (start end) for the same reason; it was one four-value
     shorthand, which put the indent on the left whatever the direction. */
  .content {
    padding-block: var(--bd-acc-panel-padding-block, 0);
    padding-inline: var(--bd-acc-panel-padding-inline, calc(var(--icon-sm-size) + var(--spacing-12)) 0);
    font-family: var(--typography-fontFamily-sans);
    font-size: var(--bd-acc-panel-font-size, var(--typography-body-small-fontSize));
    font-weight: var(--bd-acc-panel-font-weight, var(--typography-body-small-fontWeight));
    line-height: var(--bd-acc-panel-line-height, var(--typography-body-small-lineHeight));
    /* -primary, which is what every section renders this at, and what the
       Figma item draws: text/primary. */
    color: var(--bd-acc-panel-color, var(--color-text-primary));
  }

  /* Plain hidden only: a panel that is hidden="until-found" must keep its
     box, or find in page cannot reach it (accordion-panel.js). The browser
     skips its contents, so it paints nothing, but a box in flow still counts:
     its block padding would show (the small variant's is 8 at the bottom), and
     even at zero height it stops the trigger's bottom margin collapsing
     through the item -- measured, every closed item grew from 24 to 40. Out of
     flow and unpadded, a closed panel lays out as display: none did. */
  .content[hidden]:not([hidden="until-found" i]) {
    display: none !important;
  }

  .content[hidden] {
    position: absolute;
    padding-block: 0;
  }

  ::slotted(p) {
    margin-top: 0;
    margin-bottom: var(--bd-acc-panel-paragraph-gap, var(--spacing-16));
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
  }

  ::slotted(p:last-child) {
    margin-bottom: 0;
  }

  /* === CHEVRON VARIANT (text + arrow icon only, no visible border/pill/background) === */
  .header--chevron {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    width: auto;
    gap: var(--spacing-8);
    padding: 0;
    border: none;
    border-radius: var(--radius-none);
    background: none;
    margin-bottom: var(--spacing-24);
    font-size: var(--typography-label-default-fontSize);
    font-weight: var(--typography-label-default-fontWeight);
  }

  .header--chevron .title-badge-wrapper {
    flex: 0 1 auto;
  }

  .header--chevron .title {
    color: var(--color-text-brand);
    white-space: nowrap;
  }

  .header--chevron:hover .title {
    text-decoration: underline;
  }

  .toggle--chevron {
    width: 16px;
    min-width: 16px;
    height: 16px;
    margin-top: 0;
  }

  .content--chevron {
    padding: 0;
  }
`,r=e`
  /* The band is as wide as the section, and the section, like every page
     section, is as wide as the page; the column inside is .bd-ensemble's. It
     used to escape to the window's edges with width: 100vw and calc(50% -
     50vw) margins, and 100vw counts a classic scrollbar: measured with a 15px
     one, the band ran from -7px to 1273px over a 1265px page, so every page
     with an accordion section scrolled sideways. */
  .bd-accordion-section-container {
    background-color: var(--bd-acc-section-bg, var(--color-surface-container));
    border-radius: var(--radius-none);
    box-sizing: border-box;
    padding-top: var(--bd-acc-section-padding-v, var(--spacing-32));
    padding-bottom: var(--bd-acc-section-padding-v, var(--spacing-32));
  }

  .bd-accordion-section-inner {
    box-sizing: border-box;
  }

  :host([variant="small"]) {
    /* White here means "the untinted page ground", which is -surface-default's
       job; the default variant two rules up already asks for a surface role. */
    --bd-acc-section-bg: var(--color-surface-default);
    --bd-acc-section-padding-v: var(--spacing-24);
    /* Read by the items (accordionItem above), which inherit them through the slot. */
    --bd-acc-header-padding: var(--spacing-12) var(--spacing-8);
    --bd-acc-header-margin-bottom: var(--spacing-0);
    --bd-acc-icon-gap: var(--spacing-12);
    --bd-acc-toggle-size: var(--icon-sm-size);
    --bd-acc-title-font-size: var(--typography-label-default-fontSize);
    --bd-acc-title-font-weight: var(--typography-label-default-fontWeight);
    --bd-acc-title-line-height: var(--typography-label-default-lineHeight);
    --bd-acc-title-color-collapsed: var(--color-text-primary);
    --bd-acc-title-color-expanded: var(--color-brand-800);
    --bd-acc-title-color-hover: var(--color-text-brand);
    --bd-acc-panel-font-size: var(--typography-caption-default-fontSize);
    --bd-acc-panel-font-weight: var(--typography-caption-default-fontWeight);
    --bd-acc-panel-line-height: var(--typography-caption-default-lineHeight);
    /* Panel body copy, small variant. */
    --bd-acc-panel-color: var(--color-text-primary);
    --bd-acc-panel-padding-block: var(--spacing-0) var(--spacing-8);
    --bd-acc-panel-padding-inline: var(--spacing-36) var(--spacing-8);
    --bd-acc-panel-paragraph-gap: var(--spacing-0);
    --bd-acc-item-margin-bottom: var(--spacing-0);
  }

  :host([variant="default-blue"]) {
    /* The brand tint as a surface, which is what the Figma section already
       binds this to (status/brand/surface) and what bd-accordion-bg's item
       ground uses for the same tint. */
    --bd-acc-section-bg: var(--status-brand-surface);
  }

  .section-title {
    margin-bottom: var(--spacing-24);
    margin-top: var(--spacing-0);
  }

  :host([variant="small"]) .section-title {
    margin-bottom: var(--spacing-16);
  }

  .user-guide-link {
    margin-top: var(--spacing-32);
    color: var(--color-text-brand);
  }

  .user-guide-link a {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    /* --color-text-brand, which is what .user-guide-link one rule up already
       says. This anchor overrode its own parent with the raw primitive, and
       blue-500 measures 4.34:1 on the --color-surface-container these links sit
       on -- the exact trap the token comment two hundred lines up describes and
       that this file already avoids twice elsewhere. blue-600 is 5.92. */
    color: var(--color-text-brand);
    gap: var(--spacing-12);
    font-family: var(--typography-fontFamily-sans);
    font-size: var(--typography-body-xsmall-fontSize);
  }

  .user-guide-link a:focus-visible {
    /* forced-colors mode does not paint box-shadow, so the ring
       vanishes there; it does paint an outline, in a system colour. This one
       is transparent everywhere else, and the offset lands it on the ring's
       outer band. */
    outline: var(--border-width-2) solid transparent;
    outline-offset: var(--focus-outline-offset);
    box-shadow: var(--focus-outline-primary);
    border-radius: var(--focus-outline-radius);
  }

  .user-guide-link .icon img {
    display: block;
    width: var(--dimension-16);
    height: var(--dimension-16);
    object-fit: contain;
  }
`,i=/* @__PURE__ */ new Set([`BD-ACCORDION-ITEM`,`BD-ACCORDION-BG-ITEM`]);function a(e){let t=e.parentElement;return t?Array.from(t.children).filter(e=>i.has(e.tagName)):[e]}function o(e,t){if(t.defaultPrevented||t.altKey||t.ctrlKey||t.metaKey)return!1;let n;switch(t.key){case`ArrowDown`:case`ArrowRight`:n=`next`;break;case`ArrowUp`:case`ArrowLeft`:n=`prev`;break;case`Home`:n=`first`;break;case`End`:n=`last`;break;default:return!1}let r=a(e),i=r.indexOf(e);if(i<0)return!1;let o=r.length-1,s;return s=n===`first`?0:n===`last`?o:n===`next`?i===o?0:i+1:i===0?o:i-1,t.preventDefault(),s!==i&&r[s].focusTrigger?.(),!0}var s=`onbeforematch`in HTMLElement.prototype,c=e=>e?t:s?`until-found`:``;export{r as i,o as n,n as r,c as t};