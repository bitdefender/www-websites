import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import{t as a}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import{n as o}from"../../_chunks/repobit-dex-system-design3.js";import{t as s}from"../../_chunks/repobit-dex-system-design10.js";var c=e`
  :host {
    display: block;
  }

  .photo {
    /* no token: the photo band's height in each frame -- 260, 320, 600; the
       dimension scale stops at 64 */
    height: 260px;
    overflow: hidden;
  }

  /* Cropped from the foot, never the head. Past about 1900px the 600 band is
     wider than the photo's own ratio, so cover crops it vertically, and a
     centred crop took the top off the Ferrari helmet and its Bitdefender
     mark from 2048 up. The card rises over the photo's lower edge anyway,
     so the foot is the part a crop can spend. An author can still set
     object-position on the img for a photo whose subject sits lower. */
  ::slotted([slot="photo"]) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }

  /* Below md the card is a band: the brand runs edge to edge behind the
     column, and the copy keeps the column's edges, 32 from the band's top
     and foot as the phone frame draws it. */
  .band {
    background: var(--color-surface-brand);
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-24);
    padding-block: var(--spacing-32);
    background: var(--color-surface-brand);
    color: var(--color-brand-on-fill);
  }

  .intro,
  .detail {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-24);
    min-width: 0;
  }

  .lockup {
    display: flex;
  }

  ::slotted([slot="lockup"]) {
    display: block;
    max-width: 100%;
  }

  .heading {
    margin: 0;
  }

  .quote {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
    margin: 0;
  }

  blockquote {
    margin: 0;
    font-family: var(--typography-heading-h4-fontFamily);
    font-size: var(--typography-heading-h4-fontSize);
    font-weight: var(--typography-heading-h4-fontWeight);
    line-height: var(--typography-heading-h4-lineHeight);
    letter-spacing: var(--typography-heading-h4-letterSpacing);
  }

  figcaption {
    font-family: var(--typography-label-large-fontFamily);
    font-size: var(--typography-label-large-fontSize);
    font-weight: var(--typography-label-large-fontWeight);
    line-height: var(--typography-label-large-lineHeight);
    letter-spacing: var(--typography-label-large-letterSpacing);
  }

  .lead {
    margin: 0;
    font-family: var(--typography-body-regular-fontFamily);
    font-size: var(--typography-body-regular-fontSize);
    font-weight: var(--typography-body-regular-fontWeight);
    line-height: var(--typography-body-regular-lineHeight);
    letter-spacing: var(--typography-body-regular-letterSpacing);
  }

  /* on a phone the CTAs stack, each the card's width (the banner sets their
     fullwidth), 22 apart as the phone frame draws them */
  .actions {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    gap: var(--spacing-22);
  }

  @media ${n(o(`md`))} {
    .photo {
      /* no token: the tablet frame's photo band */
      height: 320px;
    }

    .band {
      background: none;
    }

    .column {
      position: relative;
      margin-block-start: calc(-1 * var(--spacing-64));
    }

    /* The card over the photo: the brand from translucent to solid behind a
       blur, so the photo shows through at the top and the copy sits on solid
       brand. No token: a gradient's stops and a blur radius. The draft starts
       the brand at 35%, where the attribution measures 3.6-4.1:1 over the
       photo; it starts at 75% here, so every line of copy sits on ground at
       least 4.5:1 against the brand's ink. */
    .card {
      padding: var(--spacing-32);
      border-radius: var(--shape-radius-3xl);
      background: linear-gradient(
        to bottom,
        color-mix(in srgb, var(--color-surface-brand) 5%, transparent) 0%,
        var(--color-surface-brand) 35%
      );
      /* Safari before 18 knows the blur only by its prefixed name */
      -webkit-backdrop-filter: blur(29px);
      backdrop-filter: blur(29px);
    }

    /* A row as wide as its labels, never wider than the column. While they
       fit there is no free space, so nothing grows and each CTA keeps its
       label's width, as the frames draw them; once one wraps the row is the
       column's width and a CTA alone on its line grows to fill it, instead
       of a short button stranded beside empty space. fit-content rather
       than max-content: from lg the row sits in the detail column's own
       content-sized track, and a max-content box would size that track to
       the unwrapped row and run past the card. */
    .actions {
      flex-direction: row;
      flex-wrap: wrap;
      align-self: auto;
      width: fit-content;
      max-width: 100%;
      gap: var(--spacing-16);
    }

    /* fullwidth (set by the banner) makes the host a 100% block; auto hands
       the width back to the flex line */
    ::slotted([slot="actions"]) {
      flex: 1 1 auto;
      width: auto;
    }

    .lead {
      font-size: var(--typography-body-large-fontSize);
      font-weight: var(--typography-body-large-fontWeight);
      line-height: var(--typography-body-large-lineHeight);
      letter-spacing: var(--typography-body-large-letterSpacing);
    }
  }

  @media ${n(o(`lg`))} {
    .photo {
      /* no token: the desktop frame's photo band */
      height: 600px;
    }

    .column {
      margin-block-start: calc(-1 * var(--spacing-128));
    }

    /* Two columns on three shared rows, as the desktop frame lines them up:
       the lockup and the quote share the first, so the heading and the lead
       start on one line under the taller of the two, 16 below it; the
       actions take the third, under the lead. Each column is a subgrid of
       the card's rows (its row gap normal, so the card's), and the heading
       runs on through the third. */
    .card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto 1fr;
      column-gap: var(--spacing-64);
      row-gap: var(--spacing-16);
      padding: var(--spacing-64);
    }

    .intro,
    .detail {
      display: grid;
      grid-row: span 3;
      grid-template-rows: subgrid;
      row-gap: normal;
    }

    .lockup,
    .quote {
      grid-row: 1;
    }

    .heading {
      grid-row: 2 / span 2;
    }

    .lead {
      grid-row: 2;
    }

    /* the frame sets the actions 24 under the lead: the row gap and 8 more */
    .actions {
      grid-row: 3;
      margin-block-start: var(--spacing-8);
    }
  }

  /* A newline in the text is a line break, so a page can keep the breaks its
     copy was written with (a <br> in the authored eyebrow, heading or lead
     arrives as a newline in the property). Text only: nothing here renders
     HTML. The rule sits on a span around the text, not on bd-h,
     whose own template could hold newlines that would break too. */
  .text,
  blockquote,
  figcaption,
  .lead {
    white-space: pre-line;
  }
`,l=class extends i{static properties={heading:{type:String},quote:{type:String},attribution:{type:String},lead:{type:String},as:{type:String}};static styles=[a,s,c];constructor(){super(),this.heading=``,this.quote=``,this.attribution=``,this.lead=``,this.as=`h2`}_onActionsSlot(e){for(let t of e.target.assignedElements({flatten:!0}))`fullWidth`in t&&t.setAttribute(`fullwidth`,``)}render(){return t`
      <section class="root">
        <div class="photo"><slot name="photo"></slot></div>
        <div class="band">
          <div class="bd-ensemble column">
            <div class="card">
              <div class="intro">
                <div class="lockup"><slot name="lockup"></slot></div>
                <bd-h as="${this.as}" visual-level="h2" color="on-brand" class="heading"><span class="text">${this.heading}</span></bd-h>
              </div>
              <div class="detail">
                ${this.quote?t`<figure class="quote">
                      <blockquote>${this.quote}</blockquote>
                      ${this.attribution?t`<figcaption>${this.attribution}</figcaption>`:r}
                    </figure>`:r}
                ${this.lead?t`<p class="lead">${this.lead}</p>`:r}
                <div class="actions"><slot name="actions" @slotchange=${this._onActionsSlot}></slot></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `}};customElements.define(`bd-partner-banner`,l);export{l as PartnerBanner};