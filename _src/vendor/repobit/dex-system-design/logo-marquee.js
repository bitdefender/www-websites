import{c as e,i as t,t as n}from"../../_chunks/lit.js";import{t as r}from"../../_chunks/repobit-dex-system-design.js";import{p as i}from"../../_chunks/repobit-dex-system-design3.js";import{t as a}from"../../_chunks/repobit-dex-system-design10.js";import"../../_chunks/repobit-dex-system-design11.js";import"../../_chunks/repobit-dex-system-design20.js";var o=e`
  :host {
    display: block;
  }

  .root {
    display: flex;
    align-items: center;
    gap: var(--spacing-16);
  }

  .viewport {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    /* no token: a mask is read for its alpha only, so the colour is a
       placeholder for "opaque" and carries no ink. Solid from 12% to 88%, the
       fade the Figma Logo marquee draws. */
    mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
  }

  .track {
    display: flex;
    width: max-content;
    animation: bd-logo-marquee var(--bd-logo-marquee-duration) var(--transition-easing-linear) infinite;
  }

  @keyframes bd-logo-marquee {
    to {
      transform: translateX(calc(-100% / var(--bd-logo-marquee-copies)));
    }
  }

  /* Held while the pointer or focus is on the row, and stopped by the paused
     attribute, which the button sets. */
  .viewport:hover .track,
  .viewport:focus-within .track,
  :host([paused]) .track {
    animation-play-state: paused;
  }

  .group {
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--bd-logo-marquee-gap);
    padding-inline-end: var(--bd-logo-marquee-gap);
  }

  ::slotted(*),
  .copy > * {
    flex: none;
  }

  /* the pause button, at the row's inline end, outside the fade */
  .toggle {
    flex: none;
  }

  /* Still, and nothing hidden: the set wraps in place, and the copies and
     the fade go. */
  @media (prefers-reduced-motion: reduce) {
    .viewport {
      mask-image: none;
    }

    .track {
      width: 100%;
      animation: none;
    }

    .group {
      flex: 1 1 auto;
      flex-wrap: wrap;
      justify-content: center;
      padding-inline-end: 0;
    }

    .copy {
      display: none;
    }

    /* nothing moves, so there is nothing to pause */
    .toggle {
      display: none;
    }
  }
`,s=class extends n{static properties={label:{type:String},duration:{type:Number},gap:{type:String},paused:{type:Boolean,reflect:!0},pauseLabel:{type:String,attribute:`pause-label`},playLabel:{type:String,attribute:`play-label`},_copies:{state:!0}};static styles=[r,a,o];constructor(){super(),this.label=``,this.duration=35,this.gap=`48`,this.paused=!1,this.pauseLabel=`Pause the moving logos`,this.playLabel=`Play the moving logos`,this._copies=1,this._resize=new ResizeObserver(()=>this._measure())}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this._observe()}disconnectedCallback(){super.disconnectedCallback(),this._resize.disconnect()}firstUpdated(){this._observe()}_observe(){this._resize.observe(this.renderRoot.querySelector(`.viewport`)),this._resize.observe(this.renderRoot.querySelector(`.group`))}_measure(){let e=this.renderRoot.querySelector(`.viewport`),t=this.renderRoot.querySelector(`.group`);if(!e||!t||!t.offsetWidth)return;let n=Math.max(1,Math.ceil(e.offsetWidth/t.offsetWidth));n!==this._copies&&(this._copies=n)}_onSlotChange(){this._fillCopies(),this._measure()}_fillCopies(){let e=this.renderRoot.querySelector(`slot`);if(!e)return;let t=e.assignedElements({flatten:!0});for(let e of this.renderRoot.querySelectorAll(`.copy`))e.replaceChildren(...t.map(e=>e.cloneNode(!0)))}updated(e){e.has(`_copies`)&&this._fillCopies()}_toggle(){this.paused=!this.paused}render(){let e=Array.from({length:this._copies});return t`
      <section
        class="bd-ensemble root"
        aria-label="${this.label}"
        style="--bd-logo-marquee-gap: ${i(this.gap)||`var(--spacing-48)`}; --bd-logo-marquee-duration: ${this.duration}s; --bd-logo-marquee-copies: ${this._copies+1};"
      >
        <div class="viewport">
          <div class="track">
            <div class="group"><slot @slotchange=${this._onSlotChange}></slot></div>
            ${e.map(()=>t`<div class="group copy" aria-hidden="true" inert></div>`)}
          </div>
        </div>
        <bd-button
          class="toggle"
          variant="ghost"
          size="sm"
          icon-only
          label="${this.paused?this.playLabel:this.pauseLabel}"
          @click=${this._toggle}
        >${this.paused?t`<bd-play-icon size="sm"></bd-play-icon>`:t`<bd-pause-icon size="sm"></bd-pause-icon>`}</bd-button>
      </section>
    `}};customElements.define(`bd-logo-marquee`,s);export{s as LogoMarquee};