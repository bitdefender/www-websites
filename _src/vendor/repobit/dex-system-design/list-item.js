import{c as e,i as t,n,t as r}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import{i}from"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design21.js";var a=e`
@layer bd-components {
  /* Sans, and the same ink as bd-p. This was set in --font-family-mono, so a
     bulleted list rendered in monospace while the paragraph above it was in
     sans — the only text atom in the system that was not. That token was also
     a duplicate of --typography-fontFamily-mono carrying a shorter fallback
     stack, so the two spellings of "mono" degraded differently; it has been
     retired.

     The ink was neutral-700 against bd-p's neutral-1000 and bd-display's
     neutral-900. A list and the paragraph beside it are the same running text
     and now take the same role. */
  .bd-list-item {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-8);
    color: var(--color-text-primary);
    font-family: var(--typography-fontFamily-sans);
  }

  /* === SIZE VARIANTS === */

  /* The size ladder is body-small / body-regular / body-large: a list item is
     running prose, which is what the body-* family is for. The leading used to
     sit once on the base rule as lineHeight-normal for all three rungs; it now
     comes from each rung's own role, which is what makes the ladder a role
     ladder rather than three sizes over one shared number. */
  .bd-list-item.sm {
    --bd-li-line-height: var(--typography-body-small-lineHeight);
    font-size: var(--typography-body-small-fontSize);
    line-height: var(--bd-li-line-height);
    margin-bottom: var(--spacing-4);
  }

  .bd-list-item.md {
    --bd-li-line-height: var(--typography-body-regular-lineHeight);
    font-size: var(--typography-body-regular-fontSize);
    line-height: var(--bd-li-line-height);
    margin-bottom: var(--bd-li-margin-bottom, var(--spacing-6));
  }

  .bd-list-item.lg {
    --bd-li-line-height: var(--typography-body-large-lineHeight);
    font-size: var(--typography-body-large-fontSize);
    line-height: var(--bd-li-line-height);
    margin-bottom: var(--spacing-8);
  }

  /* === MARKER STYLES === */

  .bd-list-item-marker {
    flex-shrink: 0;
    align-self: flex-start;
    /* centrează markerul pe înălțimea unei linii de text,
       calculat din line-height-ul itemului, indiferent de size.
       Se aplică doar markerelor "forme" (bullet, check) — nu textului (number).

       Reads the rung's own leading, not a fixed 1.5. The three rungs used to
       share one leading on the base rule, so hard-coding it here was
       equivalent; body-large is 1.625, so it no longer is, and a fixed ratio
       would leave the bullet 1.125px above the line's centre at lg. */
    margin-top: calc((1em * var(--bd-li-line-height, var(--typography-body-regular-lineHeight)) - var(--bd-li-marker-size, var(--spacing-6))) / 2);
  }

  /* Bullet List */
  .bd-list-item.bullet .bd-list-item-marker {
    --bd-li-marker-size: var(--spacing-6);
    width: var(--bd-li-marker-size);
    height: var(--bd-li-marker-size);
    background-color: var(--bd-li-marker-color, var(--color-text-primary));
    border-radius: var(--radius-full);
  }

  /* Number List. The number comes from list-item.js, on the marker's
     data-number: a CSS counter cannot count across shadow roots, so each
     item's counter only ever reached 1. */
  .bd-list-item.number .bd-list-item-marker {
    margin-top: 0; /* text — se aliniază natural pe linia de bază, nu geometric */
  }

  .bd-list-item.number .bd-list-item-marker::before {
    content: attr(data-number);
      /* no role: a marker glyph, not running prose. The number or bullet in
         front of a list item is a symbol sized and weighted to sit against the
         text beside it, the same category typography rule 7 already covers for
         an icon-only line box's leading. A role describes text a reader reads
         as a sentence; it has nothing to say about a glyph. This is the
         argument for every "no role: glyph/marker/placeholder" marker in the
         package -- the others point here rather than restating it. */
    font-weight: var(--typography-fontWeight-semibold);
    color: var(--bd-li-marker-color, var(--color-text-primary));
  }

  /* Check List */
  /* green-700, not green-500: the tick is white on this disc, and on
     green-500 that measures 2.39:1 — it fails 1.4.3 as text and 1.4.11 as a
     graphic. green-700 gives 4.75 and is the step bd-badge already picked for
     white-on-green, for the same reason and with the same measurement.
     .
     So the disc and the tick are the badge's fill pair, and read it by name:
     --status-success-fill and --status-success-on-fill. They used to read
     -accent and --color-text-inverse, which resolve to the same two colours
     here and are not the same two roles -- a dark theme moves the accent
     and flips the inverse ink, and the pair it was borrowing from would come
     apart. */
  .bd-list-item.check .bd-list-item-marker {
    --bd-li-marker-size: var(--spacing-16);
    width: var(--bd-li-marker-size);
    height: var(--bd-li-marker-size);
    background-color: var(--status-success-fill);
    border-radius: var(--radius-full);
    position: relative;
  }

  /* The tick is bd-check-icon now, not a "✓" in a ::after. A character here was
     type doing an icon's job -- it changed shape with the font and drew
     differently on macOS and Windows, on a mark whose whole purpose is to be
     recognised at 16px. The atom is drawn at the same 2-unit weight as
     bd-plus-icon and bd-minus-icon, so the three read as one family.
     .
     The absolute centring went with it: the marker is a flex box now, which
     also means no ::after and no transform to keep in step with the disc. The
     icon inherits the white through currentColor from the colour set here, so
     the contrast argument above still holds and is still measured on the disc
     rather than on the glyph. */
  .bd-list-item.check .bd-list-item-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--status-success-on-fill);
  }

  /* Custom Icon */
  .bd-list-item-custom-icon {
    --bd-li-marker-size: var(--spacing-16);
    width: var(--bd-li-marker-size);
    height: var(--bd-li-marker-size);
    flex-shrink: 0;
    /* the rung's own leading -- see .bd-list-item-marker above. */
    margin-top: calc((1em * var(--bd-li-line-height, var(--typography-body-regular-lineHeight)) - var(--bd-li-marker-size)) / 2);
  }

  /* No Marker */
  .bd-list-item.none {
    gap: 0;
  }

  .bd-list-item.none .bd-list-item-marker {
    display: none;
  }

  /* === CONTENT STYLING === */

  .bd-list-item-content {
    flex: 1;
  }

  /* Last Item */
  :host(:last-of-type) .bd-list-item {
    margin-bottom: 0;
  }
}
`,o=[`sm`,`md`,`lg`],s=[`bullet`,`number`,`check`,`none`],c=e=>e.localName===`bd-li`&&(e.variant||e.getAttribute(`variant`)||e.getAttribute(`kind`))===`number`,l=class extends r{static properties={variant:{type:String,reflect:!0},kind:{type:String},size:{type:String},icon:{type:String},color:{type:String}};constructor(){super(),this.variant=`bullet`,this.kind=``,this.size=`md`,this.icon=``,this.color=``}willUpdate(e){e.has(`kind`)&&this.kind&&(this.variant=this.kind),(e.has(`variant`)||e.has(`kind`))&&(s.includes(this.variant)||(this.variant=`bullet`))}get _number(){let e=this.parentElement;return e?(e.localName===`bd-list`&&Number.isFinite(e.start)?e.start:1)+[...e.children].filter(c).indexOf(this):1}_renumberPeers(e=this.parentElement){if(e)for(let t of e.children)t!==this&&t.localName===`bd-li`&&t.requestUpdate?.()}connectedCallback(){super.connectedCallback(),this._parent=this.parentElement,this._renumberPeers()}disconnectedCallback(){super.disconnectedCallback(),this._renumberPeers(this._parent),this._parent=null}updated(e){e.has(`variant`)&&this._renumberPeers()}render(){let e=i(this.color),n=e?`color: ${e}; --bd-li-marker-color: ${e};`:``;return t`
      <li class="bd-list-item ${this.variant} ${o.includes(this.size)?this.size:`md`}" style="${n}">
        ${this._renderMarker()}
        <span class="bd-list-item-content">
          <slot></slot>
        </span>
      </li>
    `}_renderMarker(){return this.variant===`none`?n:this.icon?t`<img src="${this.icon}" alt="" class="bd-list-item-custom-icon" />`:t`<span class="bd-list-item-marker" data-number="${this.variant===`number`?`${this._number}.`:n}">${this.variant===`check`?t`<bd-check-icon size="xs" aria-hidden="true"></bd-check-icon>`:n}</span>`}static styles=[a]};customElements.define(`bd-li`,l);export{l as BdListItem};