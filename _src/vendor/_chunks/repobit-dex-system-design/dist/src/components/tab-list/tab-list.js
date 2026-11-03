import{a as e,n as t,t as n}from"../../../../../lit/index.js";import{n as r}from"../../../../../lit/decorators.js";import{n as i,t as a}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";var o=class extends n{constructor(...e){super(...e),this.tabs=[],this.selected=0,this.label=``,this.panelId=``,this.idPrefix=`bd-tab`}createRenderRoot(){return this}tabId(e){return`${this.idPrefix}-${e}`}_select(e,{focus:t=!1}={}){e!==this.selected&&(this.selected=e,this.dispatchEvent(new CustomEvent(`bd-tab-select`,{detail:{index:e},bubbles:!0,composed:!0})),t&&this.updateComplete.then(()=>this._focusSelected()))}_sizeSwitcherOptions(){if(this.appearance!==`switcher`)return;let e=this.querySelector(`.bd-tabs-container`),t=[...this.querySelectorAll(`.bd-tab-button`)];if(!e||!t.length)return;e.style.removeProperty(`--bd-switcher-option-width`);let n=Math.max(...t.map(e=>e.getBoundingClientRect().width));n>0&&e.style.setProperty(`--bd-switcher-option-width`,`${n}px`)}updated(e){super.updated(e),this._sizeSwitcherOptions()}firstUpdated(){document.fonts?.ready.then(()=>this._sizeSwitcherOptions())}_focusSelected(){this.querySelector(`#${CSS.escape(this.tabId(this.selected))}`)?.focus()}_onKeydown(e){let t=this.tabs.length-1;if(t<0)return;let n=this.matches(`:dir(rtl)`)?{ArrowRight:`ArrowLeft`,ArrowLeft:`ArrowRight`}[e.key]??e.key:e.key,r;switch(n){case`ArrowRight`:r=this.selected===t?0:this.selected+1;break;case`ArrowLeft`:r=this.selected===0?t:this.selected-1;break;case`Home`:r=0;break;case`End`:r=t;break;default:return}e.preventDefault(),this._select(r,{focus:!0})}render(){return e`
      <div
        class="bd-tabs-container ${this.appearance===`switcher`?`bd-tabs-container--switcher`:``}"
        role="tablist"
        aria-label=${this.label||t}
        @keydown=${this._onKeydown}
      >
        ${this.tabs.map((n,r)=>{let i=this.selected===r;return e`
            <button
              type="button"
              role="tab"
              id=${this.tabId(r)}
              aria-selected=${i?`true`:`false`}
              aria-controls=${this.panelId||t}
              tabindex=${i?`0`:`-1`}
              class="bd-tab-button"
              @click=${()=>this._select(r)}
            >
              ${n.icon?e`<img src=${n.icon} alt=${n.iconAlt||``} class="bd-tab-icon" />`:``}
              <span class="bd-tab-label">${n.content??n.label}</span>
            </button>
          `})}
      </div>
    `}};a([r({type:Array})],o.prototype,`tabs`,void 0),a([r({type:Number,reflect:!0})],o.prototype,`selected`,void 0),a([r({type:String})],o.prototype,`label`,void 0),a([r({type:String,attribute:`panel-id`})],o.prototype,`panelId`,void 0),a([r({type:String,attribute:`id-prefix`})],o.prototype,`idPrefix`,void 0),a([r({type:String,reflect:!0})],o.prototype,`appearance`,void 0),o=a([i(`bd-tab-list`)],o);export{o as BdTabList};