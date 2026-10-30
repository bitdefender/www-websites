import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import{t as a}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import{n as o}from"../../_chunks/repobit-dex-system-design3.js";import{t as s}from"../../_chunks/repobit-dex-system-design10.js";import"../../_chunks/repobit-dex-system-design15.js";var c=e`
  :host {
    display: inline-flex;
  }

  .dots {
    display: flex;
    align-items: center;
    /* Each button carries its own target, so the space between two dots comes
       from the boxes. A gap on top would push them apart without making
       either easier to hit. */
  }

  /* ---- dots ---------------------------------------------------------------
     The target. 24px tall for WCAG 2.5.8, and the dot plus 8px either side
     wide: 24 for a resting dot, 56 for the current pill. The dot is drawn
     inside it rather than being it. */
  .dot {
    display: grid;
    place-items: center;
    height: var(--dimension-24);
    margin: 0;
    padding: 0 var(--spacing-8);
    border: none;
    background: transparent;
    cursor: pointer;
  }

  /* The mark is a real element rather than a ::before, because the current
     one holds the progress fill and a Web Animation needs an element to run
     on. */
  .mark {
    position: relative;
    display: block;
    overflow: hidden;
    width: var(--dimension-8);
    height: var(--dimension-8);
    border-radius: var(--radius-full);
    /* no role: a resting slide mark. No semantic role names an inactive
       indicator, and it has to clear the 3:1 WCAG 1.4.11 asks of a control's
       only visual: neutral-500 measures 4.81 on the page and 4.46 on the
       blue-50 info tint the homepage puts it on. The design's 30% neutral-900
       measures 1.94 there; neutral-300, which bd-awards-flex used to draw,
       2.10; and neutral-450 would clear it but exists for the dark theme only. */
    background: var(--color-neutral-500);
    transition: width var(--transition-duration-normal) var(--transition-easing-ease),
      background var(--transition-duration-normal) var(--transition-easing-ease);
  }

  .dot:hover .mark {
    /* no role: the same mark under the pointer, one step darker */
    background: var(--color-neutral-600);
  }

  /* The progress. Scaled rather than sized, so the fill is drawn by the
     compositor and never re-lays the row out. Without autoplay the current
     fill is whole, which is the pill as it always was; with it, the atom's
     Web Animation runs this from 0 to 1 over the delay and the end of the
     animation is the change of slide. */
  .fill {
    position: absolute;
    inset: 0;
    background: var(--indicator-color);
    transform: scaleX(0);
    transform-origin: left center;
  }

  :host(:dir(rtl)) .fill {
    transform-origin: right center;
  }

  /* The current slide. The pill is the design's shape. The colour is the
     indicator role, the one every current-item mark in the package shares --
     the tab and nav underlines -- so they cannot drift apart. The design draws
     it neutral-900 as an unbound value; using that would make this the one
     current mark in the system that is not the indicator. */
  .dot[aria-current="true"] {
    cursor: default;
  }

  /* The current pill is also the autoplay track: the indicator colour at a
     fifth, laid over whatever surface the dots sit on, inside an indicator
     edge. Translucent rather than a colour of its own, so it belongs to every
     ground -- a white track read as a hole on the awards tint and on a band.
     It was the resting grey before that, and the blue fill could not be seen
     on it: blue-500 on neutral-500 is 1.06:1.
     .
     The edge is 2px, drawn as an outline pulled inside the box rather than as
     a border. At 1px it was faint at 1x density, and that is the moment it
     matters most: the start of each slide, when nothing has filled yet and
     the edge alone marks the pill. A 2px border would have taken the 2px out
     of the box and left the fill a 4px sliver; an outline takes no room, and
     it paints above the fill in the fill's own colour, so the fill keeps the
     full 8px and the two merge where they meet. Under a forced palette the
     outline is repainted in a system colour and still draws.
     .
     Measured: the fill against the track is 3.10:1 or better on the page,
     the container, the subtle band and the awards tint; the edge against the
     ground 4.05:1 or better. When the fill is whole the edge and fill are one
     colour, which is the solid pill a dots row without autoplay shows. */
  .dot[aria-current="true"] .mark {
    width: var(--dimension-40);
    background: color-mix(in srgb, var(--indicator-color) 20%, transparent);
    outline: var(--border-width-2) solid var(--indicator-color);
    outline-offset: calc(-1 * var(--border-width-2));
  }

  .dot[aria-current="true"] .fill {
    transform: scaleX(1);
  }

  /* ---- focus ------------------------------------------------------------
     the one focus ring -- see Foundations/Focus. It follows the target, not
     the mark, so keyboard focus shows the size the button really is. */
  .dot:focus {
    outline: none;
  }

  .dot:focus-visible {
    box-shadow: var(--focus-outline-primary);
    /* forced-colors mode does not paint box-shadow, so the ring
       vanishes there; it does paint an outline, in a system colour. This one
       is transparent everywhere else, and the offset lands it on the ring's
       outer band. */
    outline: var(--border-width-2) solid transparent;
    outline-offset: var(--focus-outline-offset);
    border-radius: var(--radius-full);
  }

  @media (prefers-reduced-motion: reduce) {
    .mark {
      transition: none;
    }
  }

  /* A forced palette repaints backgrounds, which would erase every dot.
     Borders survive it, so a resting dot is drawn as a ring, and the fill is
     kept out of the repaint and drawn in the highlight colour -- so the
     current pill still shows, and so does the time it has left. */
  @media (forced-colors: active) {
    .mark {
      box-sizing: border-box;
      border: var(--border-width-1) solid currentColor;
    }
    .fill {
      forced-color-adjust: none;
      background: Highlight;
    }
  }
`,l=1e3,u=class extends i{static styles=[c];static properties={count:{type:Number},current:{type:Number,reflect:!0},label:{type:String},itemLabel:{type:String,attribute:`item-label`},autoplay:{type:Boolean,reflect:!0},delay:{type:Number},paused:{type:Boolean,reflect:!0},held:{type:Boolean},_selfHeld:{state:!0}};constructor(){super(),this.count=0,this.current=1,this.label=`Slides`,this.itemLabel=`Go to slide`,this.autoplay=!1,this.delay=4e3,this.paused=!1,this.held=!1,this._selfHeld=!1,this._progress=null,this._announced=void 0,this._onMotionChange=()=>{this._motionQuery.matches&&(this.paused=!0)}}connectedCallback(){super.connectedCallback(),typeof window<`u`&&window.matchMedia&&(this._motionQuery=window.matchMedia(`(prefers-reduced-motion: reduce)`),this._motionQuery.matches&&(this.paused=!0),this._motionQuery.addEventListener(`change`,this._onMotionChange))}disconnectedCallback(){super.disconnectedCallback(),this._motionQuery?.removeEventListener(`change`,this._onMotionChange),this._stopProgress()}willUpdate(e){if(!e.has(`count`)&&!e.has(`current`))return;let t=Math.max(0,Math.floor(Number(this.count)||0));t!==this.count&&(this.count=t);let n=Math.min(Math.max(1,Math.floor(Number(this.current)||1)),Math.max(1,t));n!==this.current&&(this.current=n)}updated(e){[`count`,`current`,`autoplay`,`delay`].some(t=>e.has(t))&&this._startProgress(),this._syncProgress(),this._announcePlayState()}get _running(){return this.autoplay&&this.count>1}get _moving(){return this._running&&!this.paused&&!this.held&&!this._selfHeld}_startProgress(){if(this._stopProgress(),!this._running)return;let e=this.renderRoot.querySelector(`.dot[aria-current="true"] .fill`);if(!e?.animate)return;let t=Math.max(l,Number(this.delay)||0),n=e.animate([{transform:`scaleX(0)`},{transform:`scaleX(1)`}],{duration:t,easing:`linear`,fill:`forwards`});this._progress=n,n.finished.then(()=>{this._progress===n&&this._select(this.current>=this.count?1:this.current+1)},()=>{})}_stopProgress(){let e=this._progress;this._progress=null,e?.cancel()}_syncProgress(){let e=this._progress;e&&(this._moving&&e.playState===`paused`?e.play():!this._moving&&e.playState===`running`&&e.pause())}_announcePlayState(){let e=`${this.paused}|${this._moving}`;e!==this._announced&&(this._announced=e,this.dispatchEvent(new CustomEvent(`bd-toggle`,{detail:{paused:this.paused,moving:this._moving},bubbles:!0,composed:!0})))}_select(e){e!==this.current&&(this.current=e,this.dispatchEvent(new CustomEvent(`bd-change`,{detail:{current:e},bubbles:!0,composed:!0})))}_pick(e){this._running&&(this.paused=!0),this._select(e)}render(){if(this.count<2)return r;let e=Array.from({length:this.count},(e,t)=>t+1);return t`<div
        class="dots"
        role="group"
        aria-label="${this.label}"
        @pointerenter=${()=>{this._selfHeld=!0}}
        @pointerleave=${()=>{this._selfHeld=this.renderRoot.contains(this.renderRoot.activeElement)}}
        @focusin=${()=>{this._selfHeld=!0}}
        @focusout=${e=>{this._selfHeld=this.renderRoot.contains(e.relatedTarget)||this.matches(`:hover`)}}
      >${e.map(e=>t`<button
          type="button"
          class="dot"
          aria-label="${this.itemLabel} ${e}"
          aria-current="${e===this.current?`true`:r}"
          @click=${()=>this._pick(e)}
        ><span class="mark"><span class="fill"></span></span></button>`)}</div>`}};customElements.define(`bd-pagination-dots`,u);var d=e`
  :host {
    display: block;
  }

  .card {
    /* the card's inside edge, at each step: the padding, and the width of
       the band the slides fade across */
    --bd-awards-spotlight-inset: var(--spacing-24);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-24);
    padding: var(--bd-awards-spotlight-inset);
    /* surface/info, the role the design binds: a tint that marks the card
       off from the page without an edge. On it the title is text-brand,
       blue-600 on blue-50 at 5.72:1, and the body text-primary at 16.65:1. */
    background: var(--color-surface-info);
    border-radius: var(--shape-radius-3xl);
  }

  /* The window the slides move through runs to the card's own edges, and
     fades out across the padding. A slide at rest starts where the fade
     ends, so it is untouched; a slide on the move dissolves into the card's
     edge instead of being cut on a hard line inside it -- which is what
     clipping at the padding did.

     It is a scroller the browser drives: a swipe, a trackpad and a wheel all
     move it, and the snap settles each of them on a whole slide. It used to
     be overflow: hidden around a track moved by an inline translateX, which
     nothing but the dots could move. */
  .viewport {
    width: calc(100% + 2 * var(--bd-awards-spotlight-inset));
    margin-inline: calc(-1 * var(--bd-awards-spotlight-inset));
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    /* a sideways swipe that reaches either end stops here, rather than
       carrying on into the browser's back and forward gesture */
    overscroll-behavior-x: contain;
    /* No scrollbar: the dots say where the slides are. */
    scrollbar-width: none;
    /* a dot's jump glides; see the reduced-motion block for who it does not */
    scroll-behavior: smooth;
    /* no token: a mask is read for its alpha only, so the colour is a
       placeholder for "opaque" and carries no ink */
    mask-image: linear-gradient(
      to right,
      transparent,
      black var(--bd-awards-spotlight-inset),
      black calc(100% - var(--bd-awards-spotlight-inset)),
      transparent
    );
  }

  /* Every slide stretches to the tallest, which is what keeps the dots in one
     place as the slides change. */
  .viewport::-webkit-scrollbar {
    display: none;
  }

  .track {
    display: flex;
  }

  /* One stop a slide, and a swipe moves one slide however hard it is flung. */
  .slide {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    flex: 0 0 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-16);
    padding-inline: var(--bd-awards-spotlight-inset);
    box-sizing: border-box;
    min-width: 0;
  }

  .logo {
    flex: none;
    /* no token: the award column. The marks are publisher artwork at 160
       wide (IDC 132), and the column holds 160 so every title starts on the
       same line; the dimension scale stops at 64. */
    width: 160px;
  }

  .copy {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-12);
    min-width: 0;
  }

  .title {
    margin: 0;
  }

  /* The paragraph is the body-regular role, set here rather than through
     bd-p: bd-p closes every paragraph with a 16px margin inside its own
     shadow root, which this component cannot reach, and it would land under
     the last line of every slide. */
  .body {
    margin: 0;
    font-family: var(--typography-body-regular-fontFamily);
    font-size: var(--typography-body-regular-fontSize);
    font-weight: var(--typography-body-regular-fontWeight);
    line-height: var(--typography-body-regular-lineHeight);
    letter-spacing: var(--typography-body-regular-letterSpacing);
    color: var(--color-text-primary);
  }

  @media ${n(o(`sm`))} {
    .card {
      --bd-awards-spotlight-inset: var(--spacing-32);
      gap: var(--spacing-32);
    }

    .slide {
      gap: var(--spacing-24);
    }
  }

  @media ${n(o(`lg`))} {
    .card {
      --bd-awards-spotlight-inset: var(--spacing-64);
      gap: var(--spacing-48);
    }

    .slide {
      flex-direction: row;
      gap: var(--spacing-48);
    }

    .copy {
      flex: 1;
      gap: var(--spacing-24);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .viewport {
      scroll-behavior: auto;
    }
  }

  /* A newline in the text is a line break, so a page can keep the breaks its
     copy was written with (a <br> in the authored eyebrow, heading or lead
     arrives as a newline in the property). Text only: nothing here renders
     HTML. The rule sits on a span around the text, not on bd-h,
     whose own template could hold newlines that would break too. */
  .text,
  .body {
    white-space: pre-line;
  }
`,f=class{constructor(e,{scroller:t,onSlide:n}){this.host=e,this._selector=t,this._onSlide=n,this._el=null,this._seeking=-1,this._frame=0,this._onScroll=()=>{cancelAnimationFrame(this._frame),this._frame=requestAnimationFrame(()=>this._read())},this._onGrab=()=>{this._seeking=-1},this._wanted=0,this._pending=!1,this._resize=new ResizeObserver(()=>{this._pending&&this._el?.clientWidth&&this.go(this._wanted)}),e.addController(this)}hostUpdated(){let e=this.host.renderRoot.querySelector(this._selector);e!==this._el&&(this._listen(!1),this._el=e,this._listen(!0))}hostConnected(){this.host.hasUpdated&&this.hostUpdated()}hostDisconnected(){this._listen(!1),this._el=null,cancelAnimationFrame(this._frame)}_listen(e){let t=this._el;if(!t)return;let n=e?`addEventListener`:`removeEventListener`;t[n](`scroll`,this._onScroll,{passive:!0});for(let e of[`pointerdown`,`touchstart`,`wheel`,`keydown`])t[n](e,this._onGrab,{passive:!0});e?this._resize.observe(t):this._resize.unobserve(t)}get index(){let e=this._el;return e?.clientWidth?Math.round(Math.abs(e.scrollLeft)/e.clientWidth):0}go(e){let t=this._el;if(this._wanted=e,this._pending=!1,!t||(this._seeking===-1?this.index:this._seeking)===e)return;if(!t.clientWidth){this._pending=!0;return}this._seeking=e;let n=getComputedStyle(t).direction===`rtl`?-1:1;t.scrollTo({left:n*e*t.clientWidth})}_read(){let e=this.index;this._seeking===-1?this._onSlide(e):e===this._seeking&&(this._seeking=-1)}},p=class extends i{static properties={awards:{type:Array},label:{type:String},as:{type:String},autoplay:{type:Boolean},autoplayDelay:{type:Number,attribute:`autoplay-delay`},_slide:{state:!0},_hovered:{state:!0},_focusWithin:{state:!0},_live:{state:!0}};static styles=[a,s,d];constructor(){super(),this.awards=[],this.label=`Awards and recognition`,this.as=`h3`,this.autoplay=!1,this.autoplayDelay=6e3,this._slide=0,this._hovered=!1,this._focusWithin=!1,this._live=`polite`,this._slides=new f(this,{scroller:`.viewport`,onSlide:e=>this._onScrolled(e)})}updated(e){e.has(`awards`)&&this._slide>=this.awards.length&&(this._slide=0),e.has(`_slide`)&&this._slides.go(this._slide)}_onScrolled(e){if(e===this._slide)return;this._slide=e;let t=this.renderRoot.querySelector(`bd-pagination-dots`);t?.autoplay&&(t.paused=!0)}_renderSlide(e,n){let i=n===this._slide;return t`
      <div
        class="slide"
        role="group"
        aria-roledescription="slide"
        aria-label="${n+1} of ${this.awards.length}"
        ?inert=${!i}
      >
        ${e.logo?t`<div class="logo">
              <bd-img
                src="${e.logo}"
                alt="${e.logoAlt||``}"
                width="${e.logoWidth??r}"
                height="${e.logoHeight??r}"
                fit="contain"
              ></bd-img>
            </div>`:r}
        <div class="copy">
          <bd-h as="${this.as}" visual-level="h3" color="primary" class="title"><span class="text">${e.title}</span></bd-h>
          ${e.body?t`<p class="body">${e.body}</p>`:r}
        </div>
      </div>
    `}render(){let e=this.awards.length;return e?t`
      <section class="bd-ensemble root" aria-label="${this.label}" aria-roledescription="carousel">
        <div class="card">
          <div
            class="viewport"
            @mouseenter=${()=>{this._hovered=!0}}
            @mouseleave=${()=>{this._hovered=!1}}
            @focusin=${()=>{this._focusWithin=!0}}
            @focusout=${e=>{this._focusWithin=e.currentTarget.contains(e.relatedTarget)}}
          >
            <div class="track" aria-live=${this._live}>
              ${this.awards.map((e,t)=>this._renderSlide(e,t))}
            </div>
          </div>
          <bd-pagination-dots
            count=${e}
            current=${this._slide+1}
            label="${this.label}"
            item-label="Go to award"
            ?autoplay=${this.autoplay&&e>1}
            delay=${this.autoplayDelay}
            ?held=${this._hovered||this._focusWithin}
            @bd-change=${e=>{this._slide=e.detail.current-1}}
            @bd-toggle=${e=>{this._live=e.detail.moving?`off`:`polite`}}
          ></bd-pagination-dots>
        </div>
      </section>
    `:r}};customElements.define(`bd-awards-spotlight`,p);export{p as AwardsSpotlight};