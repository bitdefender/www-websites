import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import{t as a}from"../../_chunks/repobit-dex-system-design.js";import{n as o}from"../../_chunks/repobit-dex-system-design3.js";import{t as s}from"../../_chunks/repobit-dex-system-design10.js";import"../../_chunks/repobit-dex-system-design11.js";import"../../_chunks/repobit-dex-system-design20.js";var c=e`
  :host {
    display: block;
  }

  .band {
    position: relative;
    overflow: hidden;
    background: var(--color-surface-brand);
    padding-block-end: var(--spacing-40);
  }

  .stage {
    position: relative;
    /* no token: the video's box on a phone and a tablet, 360 tall in both
       frames; the dimension scale stops at 64 */
    height: 360px;
    /* the slotted art sizes itself from the stage's height */
    container-type: size;
  }

  /* Below lg the box is narrower than the art, so the crop follows its
     subject: --bd-hero-media-position lets a page say where that is in its
     own video. The default holds the homepage sphere, right of centre. */
  .media {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: var(--bd-hero-media-position, 74% 50%);
  }

  /* Slotted art (bd-motion-art) is square and sizes itself from its own
     width, so the stage gives it one. The sphere fills 78% of the art. The
     phone frame draws it about 300 across, centred 156 down the 360 stage,
     so the B sits clear above the copy rising into the stage: 108% of the
     stage's height, raised 7% of it. The tablet frame draws it about 340
     across and centred (120% from md, below). The glow runs off the stage's
     edges. Margins, not a translate, so it centres in RTL too. */
  ::slotted([slot="media"]) {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    width: 108cqh;
    margin-block-start: -61cqh;
    margin-inline-start: -54cqh;
  }

  /* The frames' video-fade: the video fades into the band so the copy has a
     solid ground under it, the brand at 0, 60, 95 and 100% at 0, 45, 80 and
     100% of the fade. The phone and tablet frames draw it 230 tall at the
     foot of the 360 stage, 64% of it. No token: four stops of a gradient,
     mixed from the brand surface so a partner brand fades into its own. */
  .fade {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    height: 64%;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-surface-brand) 0%, transparent) 0%,
      color-mix(in srgb, var(--color-surface-brand) 60%, transparent) 45%,
      color-mix(in srgb, var(--color-surface-brand) 95%, transparent) 80%,
      var(--color-surface-brand) 100%
    );
    pointer-events: none;
  }

  .column {
    position: relative;
  }

  .copy {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-8);
    margin-block-start: calc(-1 * var(--spacing-80));
    text-align: center;
    color: var(--color-brand-on-fill);
  }

  .eyebrow,
  .heading,
  .lead {
    margin: 0;
    color: inherit;
  }

  /* The eyebrow is a heading role without being a heading: only "Cybersecurity
     for the AI Era." is the h1. h4 on a phone, h3 from md. */
  .eyebrow {
    font-family: var(--typography-heading-h4-fontFamily);
    font-size: var(--typography-heading-h4-fontSize);
    font-weight: var(--typography-heading-h4-fontWeight);
    line-height: var(--typography-heading-h4-lineHeight);
    letter-spacing: var(--typography-heading-h4-letterSpacing);
  }

  .heading {
    font-family: var(--typography-display-sm-fontFamily);
    font-size: var(--typography-display-sm-fontSize);
    font-weight: var(--typography-display-sm-fontWeight);
    line-height: var(--typography-display-sm-lineHeight);
    letter-spacing: var(--typography-display-sm-letterSpacing);
    overflow-wrap: break-word;
  }

  .lead {
    font-family: var(--typography-body-regular-fontFamily);
    font-size: var(--typography-body-regular-fontSize);
    font-weight: var(--typography-body-regular-fontWeight);
    line-height: var(--typography-body-regular-lineHeight);
    letter-spacing: var(--typography-body-regular-letterSpacing);
  }

  /* the pause button sits in the video's top corner at every width */
  .toggle {
    position: absolute;
    z-index: var(--z-raised);
    inset-block-start: var(--spacing-16);
    inset-inline-end: var(--spacing-16);
  }

  /* Below lg the cards follow the band on its own ground, full-bleed, so
     the section is one brand block: the phone frame closes it 24 under the
     cards, the tablet frame 32. The column inside keeps the cards on the
     page's edges. */
  .cards-band {
    position: relative;
    z-index: var(--z-base);
    background: var(--color-surface-brand);
    padding-block-end: var(--spacing-24);
  }

  .cards-band[hidden] {
    display: none;
  }

  /* The glow under the band: only the desktop frame draws it, so it waits
     for lg (below lg the cards sit on the band's own ground). */
  .glow {
    display: none;
  }

  @media ${n(o(`md`))} {
    .copy {
      margin-block-start: calc(-1 * var(--spacing-64));
    }

    .cards-band {
      padding-block-end: var(--spacing-32);
    }

    ::slotted([slot="media"]) {
      width: 120cqh;
      margin-block-start: -60cqh;
      margin-inline-start: -60cqh;
    }

    .eyebrow {
      font-family: var(--typography-heading-h3-fontFamily);
      font-size: var(--typography-heading-h3-fontSize);
      font-weight: var(--typography-heading-h3-fontWeight);
      line-height: var(--typography-heading-h3-lineHeight);
      letter-spacing: var(--typography-heading-h3-letterSpacing);
    }

    .heading {
      font-family: var(--typography-display-md-fontFamily);
      font-size: var(--typography-display-md-fontSize);
      font-weight: var(--typography-display-md-fontWeight);
      line-height: var(--typography-display-md-lineHeight);
      letter-spacing: var(--typography-display-md-letterSpacing);
    }

    .lead {
      font-size: var(--typography-body-large-fontSize);
      font-weight: var(--typography-body-large-fontWeight);
      line-height: var(--typography-body-large-lineHeight);
      letter-spacing: var(--typography-body-large-letterSpacing);
    }
  }

  @media ${n(o(`lg`))} {
    .band {
      padding-block: var(--spacing-64) var(--spacing-40);
    }

    /* the video fills the whole band behind the copy */
    .stage {
      position: absolute;
      inset: 0;
      height: auto;
    }

    .media {
      object-position: var(--bd-hero-media-position-lg, 50% 50%);
    }

    /* The art sits right of the copy, as tall as the band and raised 6% of
       it, with the sphere ending on the page column's content edge, as the
       desktop frame draws it, at every width. The stage is the band's full
       width, so the edge is worked out from the column's own steps
       (--bd-hero-column, set per breakpoint below, and --grid-padding-lg);
       the sphere ends 11% short of the art's own edge. */
    .stage {
      --bd-hero-column: var(--grid-container-max-lg);
    }

    ::slotted([slot="media"]) {
      inset-inline-start: auto;
      inset-inline-end: calc((100% - var(--bd-hero-column)) / 2 + var(--grid-padding-lg) - 11cqh);
      width: 100cqh;
      margin-block-start: -56cqh;
      margin-inline-start: 0;
    }

    /* The desktop frame's video-fade: 246 tall, ending 102 above the band's
       lower edge, so it lies over the lower half of the sphere, with solid
       brand under it to the band's edge (behind the rising cards). The same
       stops, laid over the first 246 of a 348 box: 246 / 348 = 70.7%, and
       45 and 80% of that. */
    .fade {
      /* no token: the frame's fade and its reach; the dimension scale stops
         at 64 */
      height: 348px;
      /* no token: a gradient's stops */
      background: linear-gradient(
        to bottom,
        color-mix(in srgb, var(--color-surface-brand) 0%, transparent) 0%,
        color-mix(in srgb, var(--color-surface-brand) 60%, transparent) 31.8%,
        color-mix(in srgb, var(--color-surface-brand) 95%, transparent) 56.6%,
        var(--color-surface-brand) 70.7%
      );
    }

    .copy {
      align-items: flex-start;
      margin-block-start: 0;
      text-align: start;
      /* not the column: the copy's measure, the left half of the page that
         the design keeps clear of the sphere on the right.
         no token: 588 is a measure, and the dimension scale stops at 64 */
      max-width: 588px;
      gap: var(--spacing-16);
    }

    .heading {
      font-family: var(--typography-display-xl-fontFamily);
      font-size: var(--typography-display-xl-fontSize);
      font-weight: var(--typography-display-xl-fontWeight);
      line-height: var(--typography-display-xl-lineHeight);
      letter-spacing: var(--typography-display-xl-letterSpacing);
    }

    .toggle {
      inset-block-start: var(--spacing-24);
      inset-inline-end: var(--spacing-24);
    }

    /* the cards rise into the band's lower edge */
    .has-cards .band {
      padding-block-end: calc(var(--spacing-40) + var(--spacing-128));
    }

    /* from lg the cards rise into the band over the page, as the desktop
       frame draws them */
    .cards-band {
      margin-block-start: calc(-1 * var(--spacing-128));
      padding-block-end: 0;
      background: none;
    }

    /* The desktop frame's glow (Vector 3): a brand shape at 10%, blurred
       200 in Figma (a Gaussian of 100), 1550 by 666, centred on the page
       and starting 434 above the band's lower edge, so it spills out under
       the band, behind the cards and on past them. The element sits between
       the band and the cards and takes no room; its ::before is the shape,
       clipped to the frame's own path, and the element blurs it. Behind the
       band (the root isolates it), so a partner brand's band keeps its own
       hue and the haze shows only where the band ends. The root clips it
       sideways, where it is wider than the page. */
    .root {
      isolation: isolate;
      overflow-x: clip;
    }

    .glow {
      display: block;
      position: relative;
      z-index: var(--z-below);
      height: 0;
      /* no token: the frame's layer blur */
      filter: blur(100px);
    }

    .glow::before {
      content: "";
      position: absolute;
      inset-inline-start: 50%;
      /* no token: the shape's place and size in the desktop frame; the
         dimension scale stops at 64 */
      inset-block-start: -434px;
      /* no token: the shape's width in the frame */
      width: 1550px;
      /* no token: the shape's height in the frame */
      height: 666px;
      margin-inline-start: -775px;
      background: color-mix(in srgb, var(--color-surface-brand) 10%, transparent);
      /* no token: the frame's path */
      clip-path: path("M1006 130C873.7 -68.8 419.4 3.8 208.7 65C-292.1 216 208.7 594.4 659.6 656.8C1110.5 719.1 1600.4 449.6 1545.8 334.6C1491.2 219.5 1171.4 378.5 1006 130Z");
      pointer-events: none;
    }
  }

  /* the column's cap at each step from lg, for the art's edge above */
  @media ${n(o(`xl`))} {
    .stage {
      --bd-hero-column: var(--grid-container-max-xl);
    }
  }

  @media ${n(o(`xxl`))} {
    .stage {
      --bd-hero-column: var(--grid-container-max-xxl);
    }
  }

  @media ${n(o(`xxxl`))} {
    .stage {
      --bd-hero-column: var(--grid-container-max-xxxl);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle {
      display: none;
    }
  }

  /* A newline in the text is a line break, so a page can keep the breaks its
     copy was written with (a <br> in the authored eyebrow, heading or lead
     arrives as a newline in the property). Text only: nothing here renders
     HTML. */
  .eyebrow,
  .heading,
  .lead {
    white-space: pre-line;
  }
`,l=class extends i{static properties={eyebrow:{type:String},heading:{type:String},lead:{type:String},videoSrc:{type:String,attribute:`video-src`},poster:{type:String},paused:{type:Boolean,reflect:!0},pauseLabel:{type:String,attribute:`pause-label`},playLabel:{type:String,attribute:`play-label`},_reduced:{state:!0},_hasCards:{state:!0},_hasMedia:{state:!0}};static styles=[a,s,c];constructor(){super(),this.eyebrow=``,this.heading=``,this.lead=``,this.videoSrc=``,this.poster=``,this.paused=!1,this.pauseLabel=`Pause the background video`,this.playLabel=`Play the background video`,this._motion=window.matchMedia?.(`(prefers-reduced-motion: reduce)`),this._reduced=!!this._motion?.matches,this._hasCards=!1,this._hasMedia=!1,this._onMotion=()=>{this._reduced=this._motion.matches}}connectedCallback(){super.connectedCallback(),this._motion?.addEventListener(`change`,this._onMotion)}disconnectedCallback(){super.disconnectedCallback(),this._motion?.removeEventListener(`change`,this._onMotion)}updated(e){if((e.has(`paused`)||e.has(`_hasMedia`))&&this._syncMedia(),!e.has(`paused`)&&!e.has(`_reduced`)&&!e.has(`videoSrc`))return;let t=this.renderRoot.querySelector(`video`);t&&(this.paused||this._reduced?t.pause():t.play()?.catch(()=>{}))}_toggle(){this.paused=!this.paused}_onCardsSlot(e){this._hasCards=e.target.assignedElements({flatten:!0}).length>0}_onMediaSlot(e){this._media=e.target.assignedElements({flatten:!0}),this._hasMedia=this._media.length>0,this._syncMedia()}_syncMedia(){for(let e of this._media??[])`paused`in e&&(e.paused=this.paused)}_renderMedia(){return this._hasMedia?r:this.videoSrc?t`<video
        class="media"
        src="${this.videoSrc}"
        poster="${this.poster||r}"
        ?autoplay=${!this._reduced&&!this.paused}
        muted
        loop
        playsinline
        preload="none"
        aria-hidden="true"
        tabindex="-1"
        .muted=${!0}
      ></video>`:this.poster?t`<img class="media" src="${this.poster}" alt="" width="1440" height="613" fetchpriority="high">`:r}render(){let e=this.videoSrc&&!this._hasMedia&&!this._reduced;return t`
      <section class="root ${this._hasCards?`has-cards`:``}">
        <div class="band">
          <div class="stage">
            ${this._renderMedia()}
            <slot name="media" @slotchange=${this._onMediaSlot}></slot>
            <div class="fade"></div>
            ${e?t`<bd-button
                  class="toggle"
                  variant="outline-white"
                  surface="brand"
                  size="md"
                  icon-only
                  label="${this.paused?this.playLabel:this.pauseLabel}"
                  @click=${this._toggle}
                >${this.paused?t`<bd-play-icon size="md"></bd-play-icon>`:t`<bd-pause-icon size="md"></bd-pause-icon>`}</bd-button>`:r}
          </div>
          <div class="bd-ensemble column">
            <div class="copy">
              ${this.eyebrow?t`<p class="eyebrow">${this.eyebrow}</p>`:r}
              <h1 class="heading">${this.heading}</h1>
              ${this.lead?t`<p class="lead">${this.lead}</p>`:r}
            </div>
          </div>
        </div>
        <div class="glow" aria-hidden="true"></div>
        <div class="cards-band" ?hidden=${!this._hasCards}>
          <div class="bd-ensemble cards">
            <slot name="cards" @slotchange=${this._onCardsSlot}></slot>
          </div>
        </div>
      </section>
    `}};customElements.define(`bd-hero`,l);export{l as Hero};