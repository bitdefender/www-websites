import{c as e,i as t,t as n}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";var r=e`
@layer bd-components {
  .bd-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* === COUNTER RESET FOR ORDERED LISTS === */
  .bd-list[type="ordered"] {
    counter-reset: bd-ordered-counter;
  }

  /* === ORIENTATION STYLES === */
  
  /* Vertical (default) */
  .bd-list.vertical {
    display: block;
  }

  .bd-list.vertical ::slotted(li) {
    display: list-item;
    margin-bottom: var(--spacing-8);
  }

  /* Ordered list markers for vertical */
  .bd-list[type="ordered"].vertical ::slotted(li) {
    counter-increment: bd-ordered-counter;
  }

  .bd-list[type="ordered"].vertical ::slotted(li)::before {
    content: counter(bd-ordered-counter) ". ";
      /* no role: the ordered-list number -- a glyph/marker/placeholder box, not running
         prose. See list-item.css.js's .bd-list-item-marker::before for the
         argument. */
    font-weight: var(--typography-fontWeight-semibold);
    color: var(--color-text-muted);
    margin-inline-end: var(--spacing-8);
  }

  /* Unordered list markers for vertical */
  .bd-list[type="unordered"].vertical ::slotted(li)::before {
    content: "•";
      /* no role: the unordered-list bullet -- a glyph/marker/placeholder box, not running
         prose. See list-item.css.js's .bd-list-item-marker::before for the
         argument. */
    font-weight: var(--typography-fontWeight-semibold);
    color: var(--color-text-muted);
    margin-inline-end: var(--spacing-8);
  }

  /* Horizontal */
  .bd-list.horizontal {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-16);
  }

  .bd-list.horizontal ::slotted(li) {
    display: flex;
    align-items: center;
    margin: 0;
  }

  /* Remove markers for horizontal lists */
  .bd-list.horizontal ::slotted(li)::before {
    display: none;
  }

  /* Reset counter for horizontal ordered lists */
  .bd-list[type="ordered"].horizontal {
    counter-reset: none;
  }

  .bd-list[type="ordered"].horizontal ::slotted(li) {
    counter-increment: unset;
  }

  /* === SPACING VARIANTS === */
  
  .bd-list.sm {
    margin: var(--spacing-8) 0;
  }

  .bd-list.md {
    margin: var(--spacing-16) 0;
  }

  .bd-list.lg {
    margin: var(--spacing-24) 0;
  }

  /* Horizontal spacing adjustments */
  .bd-list.horizontal.sm {
    gap: var(--spacing-8);
  }

  .bd-list.horizontal.md {
    gap: var(--spacing-16);
  }

  .bd-list.horizontal.lg {
    gap: var(--spacing-24);
  }

  /* === VARIANT STYLES === */
  
  .bd-list.compact {
    margin: var(--spacing-4) 0;
  }

  .bd-list.compact ::slotted(li) {
    margin-bottom: var(--spacing-4);
  }

  .bd-list.spacious {
    margin: var(--spacing-32) 0;
  }

  .bd-list.spacious ::slotted(li) {
    margin-bottom: var(--spacing-12);
  }

  /* Horizontal variants */
  .bd-list.horizontal.compact {
    gap: var(--spacing-4);
  }

  .bd-list.horizontal.spacious {
    gap: var(--spacing-32);
  }

  /* === NESTED LISTS === */
  
  .bd-list .bd-list {
    margin-inline-start: var(--spacing-16);
    margin-top: var(--spacing-8);
  }

  /* Nested ordered list counter reset */
  .bd-list[type="ordered"] .bd-list[type="ordered"] {
    counter-reset: bd-ordered-nested;
  }

  /* Reset first/last child margins */
  .bd-list:first-child {
    margin-top: 0;
  }

  .bd-list:last-child {
    margin-bottom: 0;
  }

  /* === CUSTOM MARKER STYLES (optional enhancements) === */
  
  /* Different marker styles for unordered lists */
  .bd-list[type="unordered"].circle ::slotted(li)::before {
    content: "○";
  }

  .bd-list[type="unordered"].square ::slotted(li)::before {
    content: "■";
  }

  .bd-list[type="unordered"].dash ::slotted(li)::before {
    content: "–";
  }

  /* Different numbering styles for ordered lists */
  .bd-list[type="ordered"].lower-alpha ::slotted(li)::before {
    content: counter(bd-ordered-counter, lower-alpha) ". ";
  }

  .bd-list[type="ordered"].upper-roman ::slotted(li)::before {
    content: counter(bd-ordered-counter, upper-roman) ". ";
  }
}
`,i={type:[[`ordered`,`unordered`],`unordered`],spacing:[[`sm`,`md`,`lg`],`md`],variant:[[`default`,`compact`,`spacious`],`default`],orientation:[[`vertical`,`horizontal`],`vertical`]},a=class extends n{static properties={type:{type:String,reflect:!0},spacing:{type:String,reflect:!0},variant:{type:String,reflect:!0},start:{type:Number,reflect:!0},orientation:{type:String,reflect:!0}};constructor(){super(),this.type=`unordered`,this.spacing=`md`,this.variant=`default`,this.start=1,this.orientation=`vertical`}willUpdate(e){for(let[t,[n,r]]of Object.entries(i))e.has(t)&&!n.includes(this[t])&&(this[t]=r);e.has(`start`)&&!Number.isFinite(this.start)&&(this.start=1)}updated(e){if(e.has(`start`))for(let e of this.children)e.localName===`bd-li`&&e.requestUpdate?.()}render(){let e=`bd-list ${this.spacing} ${this.variant} ${this.orientation}`;return this.type===`ordered`?t`
        <ol class="${e}" start="${this.start}">
          <slot></slot>
        </ol>
      `:t`
      <ul class="${e}">
        <slot></slot>
      </ul>
    `}static styles=[r]};customElements.define(`bd-list`,a);export{a as BdList};