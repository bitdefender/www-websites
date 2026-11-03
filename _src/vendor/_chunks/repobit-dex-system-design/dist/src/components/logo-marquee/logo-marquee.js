import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r,t as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{p as s}from"../shared/token-scales.js";import{t as c}from"../shared/ensemble.css.js";import"../button/button.js";import"../icons/pause-icon.js";import"../icons/play-icon.js";var l=n`:host{display:block}.root{align-items:center;gap:var(--spacing-16);display:flex}.viewport{flex:auto;min-width:0;overflow:hidden;mask-image:linear-gradient(90deg,#0000,#000 12% 88%,#0000)}.track{width:max-content;animation:bd-logo-marquee var(--bd-logo-marquee-duration) var(--transition-easing-linear) infinite;display:flex}@keyframes bd-logo-marquee{to{transform:translateX(calc(-100% / var(--bd-logo-marquee-copies)))}}.viewport:hover .track,.viewport:focus-within .track,:host([paused]) .track{animation-play-state:paused}.group{align-items:center;gap:var(--bd-logo-marquee-gap);flex:none;padding-inline-end:var(--bd-logo-marquee-gap);display:flex}::slotted(*),.copy>*,.toggle{flex:none}@media (prefers-reduced-motion:reduce){.viewport{mask-image:none}.track{width:100%;animation:none}.group{flex-wrap:wrap;flex:auto;justify-content:center;padding-inline-end:0}.copy,.toggle{display:none}}`,u=class extends t{static{this.styles=[c,l]}constructor(){super(),this.label=``,this.duration=35,this.gap=`48`,this.paused=!1,this.pauseLabel=`Pause the moving logos`,this.playLabel=`Play the moving logos`,this._copies=1,this._frame=0,this._resize=new ResizeObserver(()=>{cancelAnimationFrame(this._frame),this._frame=requestAnimationFrame(()=>this._measure())})}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this._observe()}disconnectedCallback(){super.disconnectedCallback(),this._resize.disconnect(),cancelAnimationFrame(this._frame)}firstUpdated(){this._observe()}_observe(){this._resize.observe(this.renderRoot.querySelector(`.viewport`)),this._resize.observe(this.renderRoot.querySelector(`.group`))}_measure(){let e=this.renderRoot.querySelector(`.viewport`),t=this.renderRoot.querySelector(`.group`);if(!e||!t||!t.offsetWidth)return;let n=Math.max(1,Math.ceil(e.offsetWidth/t.offsetWidth));n!==this._copies&&(this._copies=n)}_onSlotChange(){this._fillCopies(),this._measure()}_fillCopies(){let e=this.renderRoot.querySelector(`slot`);if(!e)return;let t=e.assignedElements({flatten:!0});for(let e of this.renderRoot.querySelectorAll(`.copy`))e.replaceChildren(...t.map(e=>e.cloneNode(!0)))}updated(e){e.has(`_copies`)&&this._fillCopies()}_toggle(){this.paused=!this.paused}render(){let t=Array.from({length:this._copies});return e`
      <section
        class="bd-ensemble root"
        aria-label="${this.label}"
        style="--bd-logo-marquee-gap: ${s(this.gap)||`var(--spacing-48)`}; --bd-logo-marquee-duration: ${this.duration}s; --bd-logo-marquee-copies: ${this._copies+1};"
      >
        <div class="viewport">
          <div class="track">
            <div class="group"><slot @slotchange=${this._onSlotChange}></slot></div>
            ${t.map(()=>e`<div class="group copy" aria-hidden="true" inert></div>`)}
          </div>
        </div>
        <bd-button
          class="toggle"
          variant="ghost"
          size="sm"
          icon-only
          label="${this.paused?this.playLabel:this.pauseLabel}"
          @click=${this._toggle}
        >${this.paused?e`<bd-play-icon size="sm"></bd-play-icon>`:e`<bd-pause-icon size="sm"></bd-pause-icon>`}</bd-button>
      </section>
    `}};o([r({type:String})],u.prototype,`label`,void 0),o([r({type:Number})],u.prototype,`duration`,void 0),o([r({type:String})],u.prototype,`gap`,void 0),o([r({type:Boolean,reflect:!0})],u.prototype,`paused`,void 0),o([r({type:String,attribute:`pause-label`})],u.prototype,`pauseLabel`,void 0),o([r({type:String,attribute:`play-label`})],u.prototype,`playLabel`,void 0),o([i()],u.prototype,`_copies`,void 0),u=o([a(`bd-logo-marquee`)],u);export{u as LogoMarquee};