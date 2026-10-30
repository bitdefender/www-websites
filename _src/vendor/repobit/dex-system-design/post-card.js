import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import{t as a}from"../../_chunks/repobit-dex-system-design.js";import{n as o}from"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design12.js";import{t as s}from"../../_chunks/repobit-dex-system-design14.js";import"../../_chunks/repobit-dex-system-design17.js";var c=e`
  /* The card is a size container, so its content gives it no width: it
     takes its cell's whole width, as it takes the row's height, and lays
     itself out for that. Left to fit its content -- bd-grid places its items
     at start -- a container measures 0 wide. The width is the column less
     the card's margins (shared/fill-width.css.js). */
  :host {
    display: block;
    height: 100%;
    container-type: inline-size;
  }

  ${s()}

  .card {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--color-surface-default);
    border: var(--border-width-1) solid var(--color-border-container);
    border-radius: var(--card-radius);
  }

  .cover {
    position: relative;
    flex: none;
    /* no token: the cover's height in the desktop and phone frames; the
       dimension scale stops at 64 */
    height: 196px;
    background: var(--color-surface-muted);
  }

  .cover img,
  ::slotted([slot="image"]) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* The badge is the post's feed or category, and a feed's channel title can
     be longer than the cover is wide -- "Business Insights Cybersecurity Blog
     by Bitdefender" ran off the card between md and xl. It keeps the cover's
     inset on both sides and wraps inside it instead. */
  .badge {
    position: absolute;
    inset-block-start: var(--spacing-20);
    inset-inline-start: var(--spacing-24);
    max-width: calc(100% - 2 * var(--spacing-24));
    --bd-badge-white-space: normal;
  }

  .body {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacing-24);
    padding: var(--spacing-24);
  }

  .heading {
    margin: 0;
    font-family: var(--typography-heading-h5-fontFamily);
    font-size: var(--typography-heading-h5-fontSize);
    font-weight: var(--typography-heading-h5-fontWeight);
    line-height: var(--typography-heading-h5-lineHeight);
    letter-spacing: var(--typography-heading-h5-letterSpacing);
    color: var(--color-text-primary);
  }

  .link {
    color: inherit;
    text-decoration: none;
  }

  /* the title's box stretched over the card: one target, the whole card */
  .link::after {
    content: "";
    position: absolute;
    inset: 0;
    /* the card's corner (--card-radius is --shape-radius-2xl), so the focus
       ring follows the card's outline */
    border-radius: var(--shape-radius-2xl);
  }

  .link:hover {
    text-decoration: underline;
  }

  /* The ring is drawn on the stretched box below; the title's own outline
     stays transparent rather than none, so forced-colors mode still marks
     the focus. */
  .link:focus-visible {
    outline: var(--border-width-2) solid transparent;
  }

  /* The focus ring belongs to the card, since the card is the target. */
  .link:focus-visible::after {
    outline: var(--focus-outline-traditional);
    outline-offset: var(--focus-outline-offset);
  }

  .more {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-4);
    font-family: var(--typography-link-standalone-fontFamily);
    font-size: var(--typography-link-standalone-fontSize);
    font-weight: var(--typography-link-standalone-fontWeight);
    line-height: var(--typography-link-standalone-lineHeight);
    color: var(--color-text-brand);
  }

  /* The tablet row, the cover on the left, wherever the card is wide enough
     for it -- not wherever the screen is. It used to follow the viewport
     from md to lg, which put a card in a two- or three-column grid at tablet
     width into a row it had no room for (a 384 card: a 154 cover beside
     230 of copy), and a lone card on a desktop page under a full-width
     cover. A card in a three-up grid is at most 415 wide; one alone in the
     tablet column is 656. */
  @container ${n(o(`sm`))} {
    .card {
      flex-direction: row;
    }

    .cover {
      width: 40%;
      height: auto;
    }
  }

  /* A newline in the text is a line break, so a page can keep the breaks its
     copy was written with (a <br> in the authored eyebrow, heading or lead
     arrives as a newline in the property). Text only: nothing here renders
     HTML. */
  .heading {
    white-space: pre-line;
  }
`,l=class extends i{static properties={href:{type:String},heading:{type:String},badge:{type:String},image:{type:String},imageAlt:{type:String,attribute:`image-alt`},readMore:{type:String,attribute:`read-more`},as:{type:String}};static styles=[a,c];constructor(){super(),this.href=``,this.heading=``,this.badge=``,this.image=``,this.imageAlt=``,this.readMore=`Read more`,this.as=`h3`}_renderHeading(){let e=this.href?t`<a class="link" href="${this.href}">${this.heading}</a>`:this.heading;switch(this.as){case`h2`:return t`<h2 class="heading">${e}</h2>`;case`h4`:return t`<h4 class="heading">${e}</h4>`;case`h5`:return t`<h5 class="heading">${e}</h5>`;default:return t`<h3 class="heading">${e}</h3>`}}render(){return t`
      <article class="card">
        <div class="cover">
          <slot name="image">
            ${this.image?t`<img src="${this.image}" alt="${this.imageAlt}" loading="lazy">`:r}
          </slot>
          ${this.badge?t`<bd-badge class="badge" tone="info" variant="shade" size="sm">${this.badge}</bd-badge>`:r}
        </div>
        <div class="body">
          ${this._renderHeading()}
          ${this.href?t`<span class="more" aria-hidden="true">${this.readMore}<bd-arrow-icon size="sm"></bd-arrow-icon></span>`:r}
        </div>
      </article>
    `}};customElements.define(`bd-post-card`,l);export{l as PostCard};