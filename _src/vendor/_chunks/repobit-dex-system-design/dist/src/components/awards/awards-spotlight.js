import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i,t as a}from"../../../../../lit/decorators.js";import{n as o,t as s}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import{t as c}from"../shared/ensemble.css.js";import"../pagination-dots/pagination-dots.js";import{t as l}from"./scroll-slides.js";import"../image/image.js";var u=r`:host{display:block}.card{--bd-awards-spotlight-inset:var(--spacing-24);align-items:center;gap:var(--spacing-24);padding:var(--bd-awards-spotlight-inset);background:var(--color-surface-info);border-radius:var(--shape-radius-3xl);flex-direction:column;display:flex}.viewport{width:calc(100% + 2 * var(--bd-awards-spotlight-inset));margin-inline:calc(-1 * var(--bd-awards-spotlight-inset));scroll-snap-type:x mandatory;overscroll-behavior-x:contain;scrollbar-width:none;scroll-behavior:smooth;mask-image:linear-gradient(to right, transparent, black var(--bd-awards-spotlight-inset), black calc(100% - var(--bd-awards-spotlight-inset)), transparent);overflow:auto hidden}.viewport::-webkit-scrollbar{display:none}.track{display:flex}.slide{scroll-snap-align:start;scroll-snap-stop:always;gap:var(--spacing-16);padding-inline:var(--bd-awards-spotlight-inset);box-sizing:border-box;flex-direction:column;flex:0 0 100%;min-width:0;display:flex}.logo{flex:none;width:160px}.copy{gap:var(--spacing-12);flex-direction:column;min-width:0;display:flex}.title{margin:0}.body{font-family:var(--typography-body-regular-fontFamily);font-size:var(--typography-body-regular-fontSize);font-weight:var(--typography-body-regular-fontWeight);line-height:var(--typography-body-regular-lineHeight);letter-spacing:var(--typography-body-regular-letterSpacing);color:var(--color-text-primary);margin:0}@media (width>=576px){.card{--bd-awards-spotlight-inset:var(--spacing-32);gap:var(--spacing-32)}.slide{gap:var(--spacing-24)}}@media (width>=992px){.card{--bd-awards-spotlight-inset:var(--spacing-64);gap:var(--spacing-48)}.slide{gap:var(--spacing-48);flex-direction:row}.copy{gap:var(--spacing-24);flex:1}}@media (prefers-reduced-motion:reduce){.viewport{scroll-behavior:auto}}.text,.body{white-space:pre-line}`,d=class extends n{static{this.styles=[c,u]}constructor(){super(),this.awards=[],this.label=`Awards and recognition`,this.as=`h3`,this.autoplay=!1,this.autoplayDelay=6e3,this._slide=0,this._hovered=!1,this._focusWithin=!1,this._live=`polite`,this._slides=new l(this,{scroller:`.viewport`,onSlide:e=>this._onScrolled(e)})}updated(e){e.has(`awards`)&&this._slide>=this.awards.length&&(this._slide=0),e.has(`_slide`)&&this._slides.go(this._slide)}_onScrolled(e){if(e===this._slide)return;this._slide=e;let t=this.renderRoot.querySelector(`bd-pagination-dots`);t?.autoplay&&(t.paused=!0)}_renderSlide(n,r){let i=r===this._slide;return e`
      <div
        class="slide"
        role="group"
        aria-roledescription="slide"
        aria-label="${r+1} of ${this.awards.length}"
        ?inert=${!i}
      >
        ${n.logo?e`<div class="logo">
              <bd-img
                src="${n.logo}"
                alt="${n.logoAlt||``}"
                width="${n.logoWidth??t}"
                height="${n.logoHeight??t}"
                fit="contain"
              ></bd-img>
            </div>`:t}
        <div class="copy">
          <bd-h as="${this.as}" visual-level="h3" color="primary" class="title"><span class="text">${n.title}</span></bd-h>
          ${n.body?e`<p class="body">${n.body}</p>`:t}
        </div>
      </div>
    `}render(){let n=this.awards.length;return n?e`
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
            count=${n}
            current=${this._slide+1}
            label="${this.label}"
            item-label="Go to award"
            ?autoplay=${this.autoplay&&n>1}
            delay=${this.autoplayDelay}
            ?held=${this._hovered||this._focusWithin}
            @bd-change=${e=>{this._slide=e.detail.current-1}}
            @bd-toggle=${e=>{this._live=e.detail.moving?`off`:`polite`}}
          ></bd-pagination-dots>
        </div>
      </section>
    `:t}};s([i({type:Array})],d.prototype,`awards`,void 0),s([i({type:String})],d.prototype,`label`,void 0),s([i({type:String})],d.prototype,`as`,void 0),s([i({type:Boolean})],d.prototype,`autoplay`,void 0),s([i({type:Number,attribute:`autoplay-delay`})],d.prototype,`autoplayDelay`,void 0),s([a()],d.prototype,`_slide`,void 0),s([a()],d.prototype,`_hovered`,void 0),s([a()],d.prototype,`_focusWithin`,void 0),s([a()],d.prototype,`_live`,void 0),d=s([o(`bd-awards-spotlight`)],d);export{d as AwardsSpotlight};