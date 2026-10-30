import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import{t as a}from"../../_chunks/repobit-dex-system-design.js";import{n as o}from"../../_chunks/repobit-dex-system-design3.js";import{t as s}from"../../_chunks/repobit-dex-system-design14.js";var c=e`
  /* the full cell, both ways, so a row of tiles is one height and one width
     whatever each one holds */
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  .tile {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacing-12);
    padding: var(--spacing-20);
    text-align: start;
    background: var(--color-surface-info);
    border-radius: var(--shape-radius-3xl);
  }

  /* The phone and tablet frames hold the copy 20 in and the caption at least
     12 under the value; the desktop frame opens both up. */
  @media ${n(o(`lg`))} {
    .tile {
      gap: var(--spacing-48);
      padding: var(--spacing-24);
    }
  }

  .value,
  .caption {
    margin: 0;
    color: var(--color-text-primary);
  }

  .value {
    font-family: var(--typography-display-md-fontFamily);
    font-size: var(--typography-display-md-fontSize);
    font-weight: var(--typography-display-md-fontWeight);
    line-height: var(--typography-display-md-lineHeight);
    letter-spacing: var(--typography-display-md-letterSpacing);
    font-variant-numeric: tabular-nums;
  }

  .caption {
    font-family: var(--typography-body-small-fontFamily);
    font-size: var(--typography-body-small-fontSize);
    font-weight: var(--typography-body-small-fontWeight);
    line-height: var(--typography-body-small-lineHeight);
    letter-spacing: var(--typography-body-small-letterSpacing);
  }

  /* A newline in the text is a line break, so a page can keep the breaks its
     copy was written with (a <br> in the authored eyebrow, heading or lead
     arrives as a newline in the property). Text only: nothing here renders
     HTML. */
  .caption {
    white-space: pre-line;
  }
`,l=e`
  /* The figure is held to the width it is given, so the host is a size
     container and takes its column's whole width: its content gives it none,
     and in a flex column that aligns its items to the start it would measure
     0 and hold the figure at its floor. The width is the column less the
     host's margins (shared/fill-width.css.js). */
  :host {
    display: block;
    container-type: inline-size;
  }

  ${s()}

  .highlight {
    margin: 0;
    text-align: start;
    color: var(--color-text-primary);
    font-family: var(--typography-display-3xl-fontFamily);
    /* no role: every display role is bold, and the design sets this one-off
       figure in IBM Plex Sans Text (450), a cut the system does not ship;
       Regular is the nearest it does */
    font-weight: var(--typography-fontWeight-normal);
    letter-spacing: var(--typography-display-3xl-letterSpacing);
    /* no token: the one-off figure the design sets; the display scale stops
       at 128. The frames scale it with the page, not with its own column --
       80 on a phone, about 107 in the tablet frame's 656 column, 180 in the
       desktop frame's 588 half-column -- so the viewport stays the measure.
       The column is the cap: never more of it than the desktop frame takes,
       180 of 588. Uncapped, the story's $1.5B+ ran past its half of the page
       column at 1060-1199 and 1283-1399, where the half holds at 428 and
       518 while the viewport keeps growing. */
    font-size: clamp(5rem, min(12.5vw, 100cqi * 180 / 588), 11.25rem);
    /* no token: a reel of digits needs a line box exactly one digit tall, so
       the window and the steps the reel moves by are the same length */
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .chars {
    display: inline-flex;
    align-items: flex-end;
  }

  .char {
    display: inline-block;
    height: 1em;
  }

  .digit {
    overflow: hidden;
  }

  .reel {
    display: flex;
    flex-direction: column;
    transform: translateY(calc(var(--bd-stat-digit) * -1em));
    transition: transform var(--transition-duration-slower) var(--transition-easing-smooth);
    transition-delay: calc(var(--bd-stat-order) * var(--transition-duration-fast));
  }

  .reel > span {
    height: 1em;
  }

  @media (prefers-reduced-motion: reduce) {
    .reel {
      transition: none;
    }
  }
`,u=`0123456789`,d=class extends i{static properties={value:{type:String},label:{type:String},_rolled:{state:!0}};static styles=[a,l];constructor(){super(),this.value=``,this.label=``,this._rolled=!1,this._observer=null}firstUpdated(){window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches?this._rolled=!0:(this._observer=new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)&&(this._rolled=!0,this._observer.disconnect())},{threshold:.5}),this._observer.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect()}_renderChar(e,n){let r=u.indexOf(e);return r<0?t`<span class="char">${e}</span>`:t`<span class="char digit" style="--bd-stat-digit: ${this._rolled?r:0}; --bd-stat-order: ${n};">
      <span class="reel">${[...u].map(e=>t`<span>${e}</span>`)}</span>
    </span>`}render(){return this.value?t`
      <p class="highlight" role="img" aria-label="${this.label||this.value}">
        <span class="chars" aria-hidden="true">${[...this.value].map((e,t)=>this._renderChar(e,t))}</span>
      </p>
    `:r}};customElements.define(`bd-stat-highlight`,d);var f=class extends i{static properties={value:{type:String},caption:{type:String},label:{type:String}};static styles=[a,c];constructor(){super(),this.value=``,this.caption=``,this.label=``}render(){return t`
      <div class="tile" role="group" aria-label="${this.label?`${this.label} ${this.caption}`.trim():r}">
        <p class="value" aria-hidden="${this.label?`true`:r}">${this.value}</p>
        ${this.caption?t`<p class="caption" aria-hidden="${this.label?`true`:r}">${this.caption}</p>`:r}
      </div>
    `}};customElements.define(`bd-stat-tile`,f);