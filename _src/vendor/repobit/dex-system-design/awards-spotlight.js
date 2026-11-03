import{a as e,l as t,n,t as r}from"../../_chunks/lit.js";import{n as i,t as a}from"../../_chunks/lit2.js";import{n as o,t as s}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design4.js";import{t as c}from"../../_chunks/repobit-dex-system-design9.js";import{n as l,t as u}from"../../_chunks/repobit-dex-system-design18.js";import"../../_chunks/repobit-dex-system-design19.js";var d=t`:host{display:inline-flex}.dots{align-items:center;display:flex}.dot{height:var(--dimension-24);padding:0 var(--spacing-8);cursor:pointer;background:0 0;border:none;place-items:center;margin:0;display:grid}.mark{width:var(--dimension-8);height:var(--dimension-8);border-radius:var(--radius-full);background:var(--color-neutral-500);transition:width var(--transition-duration-normal) var(--transition-easing-ease), background var(--transition-duration-normal) var(--transition-easing-ease);display:block;position:relative;overflow:hidden}.dot:hover .mark{background:var(--color-neutral-600)}.fill{background:var(--indicator-color);transform-origin:0;position:absolute;inset:0;transform:scaleX(0)}:host(:dir(rtl)) .fill{transform-origin:100%}.dot[aria-current=true]{cursor:default}.dot[aria-current=true] .mark{width:var(--dimension-40);background:color-mix(in srgb, var(--indicator-color) 20%, transparent);outline:var(--border-width-2) solid var(--indicator-color);outline-offset:calc(-1 * var(--border-width-2))}.dot[aria-current=true] .fill{transform:scaleX(1)}.dot:focus{outline:none}.dot:focus-visible{box-shadow:var(--focus-outline-primary);outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);border-radius:var(--radius-full)}@media (prefers-reduced-motion:reduce){.mark{transition:none}}@media (forced-colors:active){.mark{box-sizing:border-box;border:var(--border-width-1) solid currentColor}.fill{forced-color-adjust:none;background:highlight}}`,f=1e3,p=class extends r{static{this.styles=[d]}constructor(){super(),this.count=0,this.current=1,this.label=`Slides`,this.itemLabel=`Go to slide`,this.autoplay=!1,this.delay=4e3,this.paused=!1,this.held=!1,this._selfHeld=!1,this._progress=null,this._announced=void 0,new l(this,u,e=>{e&&(this.paused=!0)})}disconnectedCallback(){super.disconnectedCallback(),this._stopProgress()}willUpdate(e){if(!e.has(`count`)&&!e.has(`current`))return;let t=Math.max(0,Math.floor(Number(this.count)||0));t!==this.count&&(this.count=t);let n=Math.min(Math.max(1,Math.floor(Number(this.current)||1)),Math.max(1,t));n!==this.current&&(this.current=n)}updated(e){[`count`,`current`,`autoplay`,`delay`].some(t=>e.has(t))&&this._startProgress(),this._syncProgress(),this._announcePlayState()}get _running(){return this.autoplay&&this.count>1}get _moving(){return this._running&&!this.paused&&!this.held&&!this._selfHeld}_startProgress(){if(this._stopProgress(),!this._running)return;let e=this.renderRoot.querySelector(`.dot[aria-current="true"] .fill`);if(!e?.animate)return;let t=Math.max(f,Number(this.delay)||0),n=e.animate([{transform:`scaleX(0)`},{transform:`scaleX(1)`}],{duration:t,easing:`linear`,fill:`forwards`});this._progress=n,n.finished.then(()=>{this._progress===n&&this._select(this.current>=this.count?1:this.current+1)},()=>{})}_stopProgress(){let e=this._progress;this._progress=null,e?.cancel()}_syncProgress(){let e=this._progress;e&&(this._moving&&e.playState===`paused`?e.play():!this._moving&&e.playState===`running`&&e.pause())}_announcePlayState(){let e=`${this.paused}|${this._moving}`;e!==this._announced&&(this._announced=e,this.dispatchEvent(new CustomEvent(`bd-toggle`,{detail:{paused:this.paused,moving:this._moving},bubbles:!0,composed:!0})))}_select(e){e!==this.current&&(this.current=e,this.dispatchEvent(new CustomEvent(`bd-change`,{detail:{current:e},bubbles:!0,composed:!0})))}_pick(e){this._running&&(this.paused=!0),this._select(e)}render(){if(this.count<2)return n;let t=Array.from({length:this.count},(e,t)=>t+1);return e`<div
        class="dots"
        role="group"
        aria-label="${this.label}"
        @pointerenter=${()=>{this._selfHeld=!0}}
        @pointerleave=${()=>{this._selfHeld=this.renderRoot.contains(this.renderRoot.activeElement)}}
        @focusin=${()=>{this._selfHeld=!0}}
        @focusout=${e=>{this._selfHeld=this.renderRoot.contains(e.relatedTarget)||this.matches(`:hover`)}}
      >${t.map(t=>e`<button
          type="button"
          class="dot"
          aria-label="${this.itemLabel} ${t}"
          aria-current="${t===this.current?`true`:n}"
          @click=${()=>this._pick(t)}
        ><span class="mark"><span class="fill"></span></span></button>`)}</div>`}};s([i({type:Number})],p.prototype,`count`,void 0),s([i({type:Number,reflect:!0})],p.prototype,`current`,void 0),s([i({type:String})],p.prototype,`label`,void 0),s([i({type:String,attribute:`item-label`})],p.prototype,`itemLabel`,void 0),s([i({type:Boolean,reflect:!0})],p.prototype,`autoplay`,void 0),s([i({type:Number})],p.prototype,`delay`,void 0),s([i({type:Boolean,reflect:!0})],p.prototype,`paused`,void 0),s([i({type:Boolean})],p.prototype,`held`,void 0),s([a()],p.prototype,`_selfHeld`,void 0),p=s([o(`bd-pagination-dots`)],p);var m=class{constructor(e,{scroller:t,onSlide:n}){this.host=e,this._selector=t,this._onSlide=n,this._el=null,this._seeking=-1,this._frame=0,this._onScroll=()=>{cancelAnimationFrame(this._frame),this._frame=requestAnimationFrame(()=>this._read())},this._onGrab=()=>{this._seeking=-1},this._wanted=0,this._pending=!1,this._resize=new ResizeObserver(()=>{this._pending&&this._el?.clientWidth&&this.go(this._wanted)}),e.addController(this)}hostUpdated(){let e=this.host.renderRoot.querySelector(this._selector);e!==this._el&&(this._listen(!1),this._el=e,this._listen(!0))}hostConnected(){this.host.hasUpdated&&this.hostUpdated()}hostDisconnected(){this._listen(!1),this._el=null,cancelAnimationFrame(this._frame)}_listen(e){let t=this._el;if(!t)return;let n=e?`addEventListener`:`removeEventListener`;t[n](`scroll`,this._onScroll,{passive:!0});for(let e of[`pointerdown`,`touchstart`,`wheel`,`keydown`])t[n](e,this._onGrab,{passive:!0});e?this._resize.observe(t):this._resize.unobserve(t)}get index(){let e=this._el;return e?.clientWidth?Math.round(Math.abs(e.scrollLeft)/e.clientWidth):0}go(e){let t=this._el;if(this._wanted=e,this._pending=!1,!t||(this._seeking===-1?this.index:this._seeking)===e)return;if(!t.clientWidth){this._pending=!0;return}this._seeking=e;let n=getComputedStyle(t).direction===`rtl`?-1:1;t.scrollTo({left:n*e*t.clientWidth})}_read(){let e=this.index;this._seeking===-1?this._onSlide(e):e===this._seeking&&(this._seeking=-1)}},h=t`:host{display:block}.card{--bd-awards-spotlight-inset:var(--spacing-24);align-items:center;gap:var(--spacing-24);padding:var(--bd-awards-spotlight-inset);background:var(--color-surface-info);border-radius:var(--shape-radius-3xl);flex-direction:column;display:flex}.viewport{width:calc(100% + 2 * var(--bd-awards-spotlight-inset));margin-inline:calc(-1 * var(--bd-awards-spotlight-inset));scroll-snap-type:x mandatory;overscroll-behavior-x:contain;scrollbar-width:none;scroll-behavior:smooth;mask-image:linear-gradient(to right, transparent, black var(--bd-awards-spotlight-inset), black calc(100% - var(--bd-awards-spotlight-inset)), transparent);overflow:auto hidden}.viewport::-webkit-scrollbar{display:none}.track{display:flex}.slide{scroll-snap-align:start;scroll-snap-stop:always;gap:var(--spacing-16);padding-inline:var(--bd-awards-spotlight-inset);box-sizing:border-box;flex-direction:column;flex:0 0 100%;min-width:0;display:flex}.logo{flex:none;width:160px}.copy{gap:var(--spacing-12);flex-direction:column;min-width:0;display:flex}.title{margin:0}.body{font-family:var(--typography-body-regular-fontFamily);font-size:var(--typography-body-regular-fontSize);font-weight:var(--typography-body-regular-fontWeight);line-height:var(--typography-body-regular-lineHeight);letter-spacing:var(--typography-body-regular-letterSpacing);color:var(--color-text-primary);margin:0}@media (width>=576px){.card{--bd-awards-spotlight-inset:var(--spacing-32);gap:var(--spacing-32)}.slide{gap:var(--spacing-24)}}@media (width>=992px){.card{--bd-awards-spotlight-inset:var(--spacing-64);gap:var(--spacing-48)}.slide{gap:var(--spacing-48);flex-direction:row}.copy{gap:var(--spacing-24);flex:1}}@media (prefers-reduced-motion:reduce){.viewport{scroll-behavior:auto}}.text,.body{white-space:pre-line}`,g=class extends r{static{this.styles=[c,h]}constructor(){super(),this.awards=[],this.label=`Awards and recognition`,this.as=`h3`,this.autoplay=!1,this.autoplayDelay=6e3,this._slide=0,this._hovered=!1,this._focusWithin=!1,this._live=`polite`,this._slides=new m(this,{scroller:`.viewport`,onSlide:e=>this._onScrolled(e)})}updated(e){e.has(`awards`)&&this._slide>=this.awards.length&&(this._slide=0),e.has(`_slide`)&&this._slides.go(this._slide)}_onScrolled(e){if(e===this._slide)return;this._slide=e;let t=this.renderRoot.querySelector(`bd-pagination-dots`);t?.autoplay&&(t.paused=!0)}_renderSlide(t,r){let i=r===this._slide;return e`
      <div
        class="slide"
        role="group"
        aria-roledescription="slide"
        aria-label="${r+1} of ${this.awards.length}"
        ?inert=${!i}
      >
        ${t.logo?e`<div class="logo">
              <bd-img
                src="${t.logo}"
                alt="${t.logoAlt||``}"
                width="${t.logoWidth??n}"
                height="${t.logoHeight??n}"
                fit="contain"
              ></bd-img>
            </div>`:n}
        <div class="copy">
          <bd-h as="${this.as}" visual-level="h3" color="primary" class="title"><span class="text">${t.title}</span></bd-h>
          ${t.body?e`<p class="body">${t.body}</p>`:n}
        </div>
      </div>
    `}render(){let t=this.awards.length;return t?e`
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
            count=${t}
            current=${this._slide+1}
            label="${this.label}"
            item-label="Go to award"
            ?autoplay=${this.autoplay&&t>1}
            delay=${this.autoplayDelay}
            ?held=${this._hovered||this._focusWithin}
            @bd-change=${e=>{this._slide=e.detail.current-1}}
            @bd-toggle=${e=>{this._live=e.detail.moving?`off`:`polite`}}
          ></bd-pagination-dots>
        </div>
      </section>
    `:n}};s([i({type:Array})],g.prototype,`awards`,void 0),s([i({type:String})],g.prototype,`label`,void 0),s([i({type:String})],g.prototype,`as`,void 0),s([i({type:Boolean})],g.prototype,`autoplay`,void 0),s([i({type:Number,attribute:`autoplay-delay`})],g.prototype,`autoplayDelay`,void 0),s([a()],g.prototype,`_slide`,void 0),s([a()],g.prototype,`_hovered`,void 0),s([a()],g.prototype,`_focusWithin`,void 0),s([a()],g.prototype,`_live`,void 0),g=s([o(`bd-awards-spotlight`)],g);export{g as AwardsSpotlight};