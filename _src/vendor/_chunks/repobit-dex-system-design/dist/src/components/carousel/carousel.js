import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r,t as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import"../icons/plus-icon.js";import{t as s}from"../shared/controller.observer.js";import"../pagination-dots/pagination-dots.js";import"../modal/modal.js";n`.bd-box{padding:var(--spacing-0) var(--spacing-20);min-height:300px;max-width:calc(100cqi - 2 * var(--spacing-20))}.bd-carousel-icon{bottom:var(--spacing-10)}`,n`@media (width<=480px){.bd-box{padding:var(--spacing-0) var(--spacing-20);min-height:300px;max-width:calc(100cqi - 2 * var(--spacing-20))}.bd-carousel-icon{bottom:var(--spacing-10)}}`;var c=n`:host{display:block}.bd-carousel{margin-bottom:var(--spacing-48);flex-direction:column;align-items:center;max-width:100%;display:block;position:relative}.bd-carousel-track.dragging{cursor:grabbing;scroll-snap-type:none;scroll-behavior:auto}.bd-box:focus-visible,.bd-plus-button:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary)}.bd-header-carousel{text-align:center;align-items:center;margin-top:50px;margin-bottom:50px;display:block}.bd-carousel-controls{margin-top:var(--spacing-24);padding-inline:var(--spacing-10);justify-content:flex-end;display:flex}.bd-carousel-track{padding:var(--spacing-0) var(--spacing-20);scroll-padding-inline:var(--spacing-20);overscroll-behavior-x:contain;scrollbar-width:none;scroll-snap-type:x mandatory;scroll-behavior:smooth;z-index:var(--z-base);flex:1;gap:2em;display:flex;position:relative;overflow:auto hidden;container-type:inline-size}.bd-carousel-track::-webkit-scrollbar{display:none}.bd-carousel-track ::slotted(*){scroll-snap-align:start}.bd-carousel-icon{max-width:100%;height:var(--spacing-40);width:var(--spacing-40);position:relative}.bd-box{min-height:217px;min-width:unset;width:350px;max-width:calc(100cqi - 2 * var(--card-padding));background:var(--color-surface-container);border-radius:var(--card-radius);padding:var(--card-padding);text-align:start;cursor:pointer;transition:transform var(--transition-duration-normal) var(--transition-easing-smooth);font-family:var(--typography-fontFamily-sans);z-index:var(--z-raised);flex-direction:column;flex:none;justify-content:center;align-items:start;display:flex;position:relative}.bd-plus-button{bottom:var(--spacing-10);right:var(--spacing-10);width:var(--spacing-44);height:var(--spacing-44);border-radius:var(--radius-full);cursor:pointer;border:var(--border-width-2) solid var(--color-border-brand);color:var(--color-action-primary);background:0 0;justify-content:center;align-items:center;padding:0;display:flex;position:absolute}.bd-plus-button:hover{background:var(--status-brand-surface)}.bd-plus-button:active{background:var(--color-action-primary);color:var(--color-brand-on-fill)}@media (width<768px){.bd-carousel-track{padding:var(--spacing-0) var(--spacing-0);scroll-padding-inline:var(--spacing-0);flex-wrap:nowrap;gap:1em}}@media (width<=480px){.bd-box{padding:var(--spacing-0) var(--spacing-20);min-height:300px;max-width:calc(100cqi - 2 * var(--spacing-20))}.bd-carousel-icon{bottom:var(--spacing-10)}}@container (width<=480px){.bd-box{padding:var(--spacing-0) var(--spacing-20);min-height:300px;max-width:calc(100cqi - 2 * var(--spacing-20))}.bd-carousel-icon{bottom:var(--spacing-10)}}@media (prefers-reduced-motion:reduce){.bd-box{transition:none}.bd-carousel-track{scroll-behavior:auto}}`,l=class extends t{_openModal(){this.dispatchEvent(new CustomEvent(`open-modal`,{detail:{title:this.title,modalText:this.modalText,icon:this.icon},bubbles:!0,composed:!0}))}render(){return e`
      <div class="bd-box">
        ${this.icon?e`<img src="${this.icon}" alt="" class="bd-carousel-icon" />`:``}
        <div class="bd-content">
          <slot></slot>
        </div>
        <button
          type="button"
          class="bd-plus-button"
          aria-label="Open modal for ${this.title}"
          @click="${this._openModal}"
        >
          <bd-plus-icon size="md"></bd-plus-icon>
        </button>
      </div>
    `}static{this.styles=[c]}};o([r({type:String})],l.prototype,`icon`,void 0),o([r({type:String})],l.prototype,`title`,void 0),o([r({type:String})],l.prototype,`modalText`,void 0),l=o([a(`bd-carousel-item`)],l);var u=class extends t{constructor(){super(),this.title=``,this.headingLevel=2,this.selectedItem=null,this._pages=1,this._page=1,this._trackSize=new s(this,()=>new ResizeObserver(()=>this._measure()),e=>e.observe(this.renderRoot.querySelector(`.bd-carousel-track`))),this._seeking=0}get _headingTag(){let e=Number(this.headingLevel);return Number.isInteger(e)&&e>=1&&e<=6?`h${e}`:`h2`}_renderTitle(t){return e`<bd-h as=${this._headingTag} visual-level="h3" class=${t}
      >${this.title}</bd-h
    >`}firstUpdated(){this.track=this.shadowRoot.querySelector(`.bd-carousel-track`),this.slotElement=this.shadowRoot.querySelector(`slot`),this.track.addEventListener(`scroll`,()=>this._measure(),{passive:!0}),this.track.addEventListener(`scrollend`,()=>{this._seeking=0,this._measure()});for(let e of[`pointerdown`,`touchstart`,`wheel`,`keydown`])this.track.addEventListener(e,()=>{this._seeking=0},{passive:!0});this.slotElement.addEventListener(`slotchange`,()=>{this.waitForImagesToLoad().then(()=>this._measure())}),this.waitForImagesToLoad().then(()=>this._measure()),this.addEventListener(`open-modal`,e=>{this.openModal(e.detail)}),this._enableMouseDrag(this.track)}waitForImagesToLoad(){let e=this.slotElement.assignedElements({flatten:!0}).map(e=>e.shadowRoot?.querySelector(`img`)).filter(e=>e!=null).map(e=>new Promise(t=>{e.complete?t():(e.addEventListener(`load`,t,{once:!0}),e.addEventListener(`error`,t,{once:!0}))}));return Promise.all(e)}_step(){let e=this.slotElement?.assignedElements({flatten:!0})[0];if(!e)return 0;let t=parseFloat(getComputedStyle(this.track).columnGap)||0;return e.offsetWidth+t}_measure(){if(!this.track)return;let e=this.track.scrollWidth-this.track.clientWidth,t=this._step();if(e<=1||t<=0){this._pages=1,this._page=1;return}this._pages=Math.ceil((e-1)/t)+1;let n=this._travelled,r=n>=e-1?this._pages:Math.min(this._pages,Math.round(n/t)+1);this._seeking&&r!==this._seeking||(this._seeking=0,this._page=r)}_stop(e){let t=this.track.scrollWidth-this.track.clientWidth;return Math.min((e-1)*this._step(),t)}get _travelled(){return Math.abs(this.track.scrollLeft)}_scrollToStop(e){let t=getComputedStyle(this.track).direction===`rtl`?-1:1;this.track.scrollTo({left:t*this._stop(e)})}_goToPage(e){this._seeking=e,this._page=e,this._scrollToStop(e)}openModal(e){this.selectedItem=e,this._shownItem=e}closeModal(){this.selectedItem=null}_enableMouseDrag(e){let t=null,n=!1;e.addEventListener(`pointerdown`,n=>{n.pointerType===`mouse`&&n.button===0&&(t={id:n.pointerId,x:n.clientX,left:e.scrollLeft,dragging:!1})}),e.addEventListener(`pointermove`,n=>{if(t?.id!==n.pointerId)return;if(!(n.buttons&1)){t=null;return}let r=n.clientX-t.x;if(!t.dragging){if(Math.abs(r)<4)return;t.dragging=!0,e.setPointerCapture(n.pointerId),e.classList.add(`dragging`)}e.scrollLeft=t.left-r});let r=()=>{let r=t?.dragging;t=null,r&&(e.classList.remove(`dragging`),this._settle(),n=!0,setTimeout(()=>{n=!1}))};for(let t of[`pointerup`,`pointercancel`,`lostpointercapture`])e.addEventListener(t,r);e.addEventListener(`click`,e=>{n&&(e.preventDefault(),e.stopPropagation())},{capture:!0});for(let n of[`selectstart`,`dragstart`])e.addEventListener(n,e=>{t&&e.preventDefault()})}_settle(){let e=this._travelled,t=1;for(let n=2;n<=this._pages;n++)Math.abs(this._stop(n)-e)<Math.abs(this._stop(t)-e)&&(t=n);this._scrollToStop(t)}render(){return e`
      <div class="bd-carousel">
        ${this.title?e`<div class="bd-header-carousel">
              ${this._renderTitle(`bd-section-title`)}
            </div>`:``}

        <div class="bd-carousel-track">
          <slot></slot>
        </div>
        <div class="bd-carousel-controls">
          <bd-pagination-dots
            count=${this._pages}
            current=${this._page}
            label=${this.title||`Slides`}
            item-label="Go to item"
            @bd-change=${e=>this._goToPage(e.detail.current)}
          ></bd-pagination-dots>
        </div>
      </div>

      <!-- Always rendered, and closed through open: a dialog closed is what
           hands focus back to the + that opened it, and one removed while
           open drops it on the page instead. It keeps the last item's copy
           while it closes. -->
      <bd-modal
        .open="${!!this.selectedItem}"
        .title="${this._shownItem?.title??``}"
        .modalText="${this._shownItem?.modalText??``}"
        .icon="${this._shownItem?.icon??``}"
        @close-modal="${this.closeModal}"
      ></bd-modal>
    `}static{this.styles=[c]}};o([r({type:String})],u.prototype,`title`,void 0),o([r({type:Number,attribute:`heading-level`})],u.prototype,`headingLevel`,void 0),o([r({type:Object})],u.prototype,`selectedItem`,void 0),o([i()],u.prototype,`_pages`,void 0),o([i()],u.prototype,`_page`,void 0),u=o([a(`bd-carousel-section`)],u);export{l as CarouselItem};