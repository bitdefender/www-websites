import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i,t as a}from"../../../../../lit/decorators.js";import{n as o,t as s}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import{i as c}from"../shared/token-scales.js";import"../paragraph/paragraph.js";import{t as l}from"../shared/ensemble.css.js";import{n as u}from"../shared/controller.media-query.js";import"../icons/av-comparatives-icon.js";import"../icons/best-brands-icon.js";import"../icons/laurel-icon.js";import"../icons/pc-mag-2024-icon.js";import"../icons/pc-mag-business-icon.js";import"../icons/pc-mag-icon.js";import"../icons/pc-mag-readers-icon.js";import"../icons/top-product-icon.js";import"../pagination-dots/pagination-dots.js";import{t as d}from"./scroll-slides.js";var f=r`.bd-awardsflex-root{align-items:center;gap:var(--spacing-8);box-sizing:border-box;width:100%;padding-block:var(--spacing-32);border-radius:var(--shape-radius-2xl);text-align:center;font-family:var(--typography-fontFamily-sans);min-height:var(--bd-awardsflex-min-height,320px);flex-direction:column;display:flex}.bd-awardsflex-root--white{background:var(--color-surface-default);border:var(--border-width-2) solid var(--color-border-container);border-radius:var(--shape-radius-2xl);padding-block:var(--spacing-64)}:host([background=tint]){background:var(--status-brand-surface)}.bd-awardsflex-laurel{color:var(--color-brand-500);margin-bottom:var(--spacing-8);justify-content:center;align-items:center;display:flex}.bd-awardsflex-text-group{align-items:center;gap:var(--spacing-8);margin-bottom:var(--spacing-32);flex-direction:column;display:flex}.bd-awardsflex-headline{margin:0}.bd-awardsflex-subtext{color:var(--color-text-muted);max-width:640px;margin:0}.bd-awardsflex-badges-row{justify-content:center;align-items:center;gap:var(--spacing-24);flex-wrap:wrap;min-height:64px;display:flex}.bd-awardsflex-badge{flex-shrink:0;justify-content:center;align-items:center;display:flex}.bd-awardsflex-quotes-row{justify-content:center;gap:var(--spacing-32);flex-wrap:wrap;width:100%;display:flex}.bd-awardsflex-carousel-viewport{scroll-snap-type:x mandatory;overscroll-behavior-x:contain;scrollbar-width:none;scroll-behavior:smooth;width:100%;overflow:auto hidden}.bd-awardsflex-carousel-viewport::-webkit-scrollbar{display:none}.bd-awardsflex-carousel-track{display:flex}.bd-awardsflex-carousel-slide{scroll-snap-align:start;scroll-snap-stop:always;justify-content:center;gap:var(--spacing-32);box-sizing:border-box;flex:0 0 100%;display:flex}.bd-awardsflex-quote-card{align-items:center;gap:var(--spacing-8);box-sizing:border-box;background:0 0;flex-direction:column;flex:200px;max-width:220px;min-height:160px;padding:0;display:flex}.bd-awardsflex-quote-text{font-size:var(--typography-body-small-fontSize);font-weight:var(--typography-body-small-fontWeight);line-height:var(--typography-body-small-lineHeight);letter-spacing:var(--typography-body-small-letterSpacing);font-family:var(--typography-body-small-fontFamily);color:var(--color-text-secondary);margin:0;font-style:italic}.bd-awardsflex-quote-source{font-size:var(--typography-fontSize-xs);color:var(--color-text-muted);margin:0}bd-pagination-dots{margin-top:var(--spacing-8)}@media (prefers-reduced-motion:reduce){.bd-awardsflex-carousel-viewport{scroll-behavior:auto}}@media (width<576px){.bd-awardsflex-root{padding-block:var(--spacing-24);gap:var(--spacing-8);min-height:var(--bd-awardsflex-min-height-mobile,280px)}.bd-awardsflex-quotes-row{flex-direction:column;align-items:center}.bd-awardsflex-quotes-row .bd-awardsflex-quote-card{flex:none;width:100%;min-height:0}.bd-awardsflex-quote-card{max-width:none}}`,p=3,m=1,h=class extends n{static{this.styles=[l,f]}constructor(){super(),this.background=`white`,this.layout=`compact`,this.carousel=!1,this.autoplay=!1,this.autoplayDelay=4e3,this.headline=``,this.subtext=``,this.badges=[],this._slide=0,this._groupSize=p,this._hovered=!1,this._focusWithin=!1,this._live=`polite`,this._slides=new d(this,{scroller:`.bd-awardsflex-carousel-viewport`,onSlide:e=>this._onScrolled(e)}),new u(this,c(`sm`),e=>this._setGroupSize(e?m:p))}_setGroupSize(e){if(e===this._groupSize)return;let t=this._slide*this._groupSize;this._groupSize=e,this._slide=Math.floor(t/e)}updated(e){(e.has(`autoplay`)||e.has(`carousel`)||e.has(`layout`)||e.has(`badges`)||e.has(`_groupSize`))&&this._slide>=this._slidesCount&&(this._slide=0),(e.has(`_slide`)||e.has(`_groupSize`))&&this._slides.go(this._slide)}_onScrolled(e){if(e===this._slide)return;this._slide=e;let t=this.renderRoot.querySelector(`bd-pagination-dots`);t?.autoplay&&(t.paused=!0)}get _groups(){let e=[];for(let t=0;t<this.badges.length;t+=this._groupSize)e.push(this.badges.slice(t,t+this._groupSize));return e}get _slidesCount(){return this.layout===`quotes`?this._groups.length:0}get _autoplayOffered(){return this.autoplay&&this.carousel&&this.layout===`quotes`&&this._slidesCount>1}_iconHeight(){return this.layout===`grid`?64:(this.layout,56)}_renderIcon(t){let n=this._iconHeight();switch(t){case`pc-mag`:return e`<bd-pc-mag-icon height=${n}></bd-pc-mag-icon>`;case`pc-mag-2024`:return e`<bd-pc-mag-2024-icon height=${n}></bd-pc-mag-2024-icon>`;case`pc-mag-business`:return e`<bd-pc-mag-business-icon height=${n}></bd-pc-mag-business-icon>`;case`pc-mag-readers`:return e`<bd-pc-mag-readers-icon height=${n}></bd-pc-mag-readers-icon>`;case`av-comparatives`:return e`<bd-av-comparatives-icon height=${n}></bd-av-comparatives-icon>`;case`best-brands`:return e`<bd-best-brands-icon height=${n}></bd-best-brands-icon>`;case`top-product`:return e`<bd-top-product-icon height=${n}></bd-top-product-icon>`;default:return e`<span class="bd-awardsflex-badge-fallback" aria-hidden="true">?</span>`}}_renderBadge(t){let n=`bd-awardsflex-badge ${t.type===`dark`?`bd-awardsflex-badge--dark`:``}`;return e`
      <div class="${n}" data-award-id="${t.id}" role="listitem" aria-label="${t.label||``}">
        ${this._renderIcon(t.icon)}
      </div>
    `}_renderQuoteCard(n){return n.quote?e`
      <div class="bd-awardsflex-quote-card">
        ${this._renderBadge(n)}
        <p class="bd-awardsflex-quote-text">"${n.quote}"</p>
        ${n.source?e`<p class="bd-awardsflex-quote-source">${n.source}${n.date?e`, ${n.date}`:t}</p>`:t}
      </div>
    `:t}_renderDots(){return!this.carousel||this._slidesCount<2?t:e`
      <bd-pagination-dots
        count=${this._slidesCount}
        current=${this._slide+1}
        label="Awards"
        ?autoplay=${this._autoplayOffered}
        delay=${this.autoplayDelay}
        ?held=${this._hovered||this._focusWithin}
        @bd-change=${e=>{this._slide=e.detail.current-1}}
        @bd-toggle=${e=>{this._live=e.detail.moving?`off`:`polite`}}
      ></bd-pagination-dots>
    `}_renderCarousel(){return e`
      <div
        class="bd-awardsflex-carousel-viewport"
        @mouseenter=${()=>{this._hovered=!0}}
        @mouseleave=${()=>{this._hovered=!1}}
        @focusin=${()=>{this._focusWithin=!0}}
        @focusout=${e=>{this._focusWithin=e.currentTarget.contains(e.relatedTarget)}}
      >
        <div class="bd-awardsflex-carousel-track" aria-live=${this._live}>
          ${this._groups.map((t,n)=>e`
              <div class="bd-awardsflex-carousel-slide" ?inert=${n!==this._slide}>
                ${t.map(e=>this._renderQuoteCard(e))}
              </div>
            `)}
        </div>
      </div>
    `}_renderLaurel(){return e`
      <div class="bd-awardsflex-laurel">
        <slot name="icon">
          <bd-laurel-icon width="80" height="64"></bd-laurel-icon>
        </slot>
      </div>
    `}render(){let n=`bd-ensemble bd-awardsflex-root bd-awardsflex-root--${this.background} bd-awardsflex-root--${this.layout}`;return e`
    <section class="${n}" aria-label="Awards and recognition">
      ${this._renderLaurel()}
      ${this.headline||this.subtext?e`
            <div class="bd-awardsflex-text-group">
              ${this.headline?e`<bd-h as="h3" class="bd-awardsflex-headline">${this.headline}</bd-h>`:t}
              ${this.subtext?e`<bd-p variant="large" class="bd-awardsflex-subtext">${this.subtext}</bd-p>`:t}
            </div>
          `:t}

      ${this.layout===`quotes`?e`
            ${this.carousel?this._renderCarousel():e`
                  <div class="bd-awardsflex-quotes-row" role="list">
                    ${this.badges.map(e=>this._renderQuoteCard(e))}
                  </div>
                `}
            ${this._renderDots()}
          `:e`
            <div class="bd-awardsflex-badges-row" role="list">
              ${this.badges.map(e=>this._renderBadge(e))}
            </div>
          `}
    </section>
  `}};s([i({type:String,reflect:!0})],h.prototype,`background`,void 0),s([i({type:String})],h.prototype,`layout`,void 0),s([i({type:Boolean})],h.prototype,`carousel`,void 0),s([i({type:Boolean})],h.prototype,`autoplay`,void 0),s([i({type:Number,attribute:`autoplay-delay`})],h.prototype,`autoplayDelay`,void 0),s([i({type:String})],h.prototype,`headline`,void 0),s([i({type:String})],h.prototype,`subtext`,void 0),s([i({type:Array})],h.prototype,`badges`,void 0),s([a()],h.prototype,`_slide`,void 0),s([a()],h.prototype,`_groupSize`,void 0),s([a()],h.prototype,`_hovered`,void 0),s([a()],h.prototype,`_focusWithin`,void 0),s([a()],h.prototype,`_live`,void 0),h=s([o(`bd-awards-flex`)],h);export{h as AwardsFlex};