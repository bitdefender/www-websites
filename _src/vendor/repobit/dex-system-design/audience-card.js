import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import{t as a}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import{n as o}from"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design11.js";import{t as s}from"../../_chunks/repobit-dex-system-design14.js";var c=e`
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
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--spacing-8);
    padding: var(--card-padding-compact);
    background: var(--color-surface-default);
    border: var(--border-width-1) solid var(--color-border-container);
    border-radius: var(--card-radius);
    /* the containing block for the link's stretched hit area, below */
    position: relative;
  }

  .copy {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-8);
    min-width: 0;
  }

  /* The eyebrow is label-default set in capitals, in text/brand -- the draft
     paints it status/info/accent, a status role on a plain label. */
  .eyebrow {
    display: flex;
    align-items: center;
    gap: var(--spacing-8);
    margin: 0;
    font-family: var(--typography-label-default-fontFamily);
    font-size: var(--typography-label-default-fontSize);
    font-weight: var(--typography-label-default-fontWeight);
    line-height: var(--typography-label-default-lineHeight);
    letter-spacing: var(--typography-label-default-letterSpacing);
    text-transform: uppercase;
    color: var(--color-text-brand);
  }

  ::slotted([slot="icon"]) {
    flex: none;
    color: var(--color-text-brand);
  }

  .heading {
    margin: 0;
  }

  .description {
    margin: 0;
    font-family: var(--typography-body-regular-fontFamily);
    font-size: var(--typography-body-regular-fontSize);
    font-weight: var(--typography-body-regular-fontWeight);
    line-height: var(--typography-body-regular-lineHeight);
    letter-spacing: var(--typography-body-regular-letterSpacing);
    color: var(--color-text-primary);
  }

  .arrow {
    flex: none;
  }

  /* The stretched link: the arrow's own <a> (bd-button-link's part="button")
     draws an ::after over the whole card, so the card is the link's hit area
     -- middle-click, Ctrl/Cmd-click and the link menu included -- with no
     script. Nothing between the card and the <a> is positioned, so the card
     is what it fills. The pointer over it is the link's own. It paints
     nothing, so it takes no corner of its own. */
  .arrow::part(button)::after {
    content: "";
    position: absolute;
    inset: 0;
  }

  /* The tablet row, copy left and the arrow right and centred on it,
     wherever the card is wide enough for it -- not wherever the screen is.
     Following the viewport from md to lg, a card in a two- or three-column
     grid at tablet width took the row with no room for it, and a lone card
     on a desktop page stayed a column with its arrow far below the copy. */
  @container ${n(o(`sm`))} {
    .card {
      flex-direction: row;
      align-items: center;
      gap: var(--spacing-24);
    }

    .copy {
      flex: 1 1 auto;
    }
  }

  /* A newline in the text is a line break, so a page can keep the breaks its
     copy was written with (a <br> in the authored eyebrow, heading or lead
     arrives as a newline in the property). Text only: nothing here renders
     HTML. The rule sits on a span around the text, not on bd-h or on the
     eyebrow, which also holds the slotted icon. */
  .text,
  .description {
    white-space: pre-line;
  }
`,l=class extends i{static properties={eyebrow:{type:String},heading:{type:String},description:{type:String},href:{type:String},target:{type:String},label:{type:String},as:{type:String}};static styles=[a,c];constructor(){super(),this.eyebrow=``,this.heading=``,this.description=``,this.href=``,this.target=``,this.label=``,this.as=`h2`}render(){return t`
      <article class="card">
        <div class="copy">
          ${this.eyebrow?t`<p class="eyebrow"><slot name="icon"></slot><span class="text">${this.eyebrow}</span></p>`:r}
          <bd-h as="${this.as}" visual-level="h4" class="heading"><span class="text">${this.heading}</span></bd-h>
          ${this.description?t`<p class="description">${this.description}</p>`:r}
        </div>
        ${this.href?t`<bd-button-link
              class="arrow"
              variant="accent"
              size="md"
              icon-only
              href="${this.href}"
              target="${this.target||r}"
              label="${this.label||this.eyebrow||this.heading}"
            ></bd-button-link>`:r}
      </article>
    `}};customElements.define(`bd-audience-card`,l);export{l as AudienceCard};