import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r,t as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../paragraph/paragraph.js";import{t as s}from"../shared/ensemble.css.js";import"../features/features.js";import"../highlight/highlight.js";import"../tab-list/tab-list.js";import{n as c}from"../tab-list/tab-list.css.js";var l=n`:host{font-size:100%;font-family:var(--typography-fontFamily-sans);--bd-features-padding-bottom:0;display:block}:host([bg-blue]){background:var(--color-brand-50);--bd-features-padding-bottom:var(--spacing-32)}.bd-tabs-component{box-sizing:border-box;flex-direction:column;align-items:center;display:flex}bd-highlight,.bd-tabs-subtitle,.bd-tabs-container{margin:var(--spacing-24);box-sizing:border-box}.bd-tabs-subtitle{font-size:var(--typography-body-regular-fontSize);text-align:center;max-width:780px;font-family:var(--typography-fontFamily-sans);margin-top:var(--spacing-32);margin-bottom:var(--spacing-32)}.bd-panel-wrapper{box-sizing:border-box;grid-template-columns:minmax(0,1fr);width:100%;display:grid}.bd-panel{grid-area:1/1}.bd-panel[inert]{visibility:hidden}`,u=class extends t{static{this.styles=[]}render(){return e`<slot></slot>`}};u=o([a(`bd-tab-panel`)],u);function*d(e){for(let t of[e,e.shadowRoot].filter(e=>e!=null))for(let e of t.querySelectorAll(`*`))yield e,e.shadowRoot&&(yield*d(e.shadowRoot))}function f(e){e instanceof HTMLMediaElement?(e.autoplay=!1,e.pause()):e instanceof HTMLIFrameElement?(e.removeAttribute(`srcdoc`),e.getAttribute(`src`)!==`about:blank`&&(e.src=`about:blank`)):e.localName.includes(`-`)&&`paused`in e&&(e.paused=!0)}async function p(e){for(let t=0;t<3;t++){let t=[...d(e)];t.forEach(f);let n=t.filter(e=>!!e.isUpdatePending);if(!n.length)return;await Promise.all(n.map(e=>e.updateComplete.catch(()=>{})))}}var m=class extends t{static{this.styles=[s,c,l]}constructor(){super(),this.title=``,this.subtitle=``,this.highlightText=``,this.selectedTab=0,this.bgBlue=!1,this._clones=/* @__PURE__ */ new WeakMap,this._sizers=[]}_getPanels(){return Array.from(this.querySelectorAll(`:scope > bd-tab-panel`))}selectTab(e){this.selectedTab=e}connectedCallback(){super.connectedCallback(),this._panelObserver??=new MutationObserver(()=>this._recopy()),this._panelObserver.observe(this,{childList:!0,subtree:!0,characterData:!0})}disconnectedCallback(){super.disconnectedCallback(),this._panelObserver?.disconnect()}willUpdate(e){e.size||(this._clones=/* @__PURE__ */ new WeakMap)}_recopy(){this._clones=/* @__PURE__ */ new WeakMap,this.requestUpdate()}_cloneOf(e,t){let n=this._clones.get(e);return n?.live!==t&&(n={live:t,node:t?e.cloneNode(!0):this._sizer(e)},this._clones.set(e,n),t||this._sizers.push(n.node)),n.node}_sizer(e){let t=document.createElement(`div`),n=e.cloneNode(!0);return[n,...n.querySelectorAll(`*`)].forEach(f),t.attachShadow({mode:`open`}).append(n),t}updated(){for(let e of this._sizers.splice(0))p(e)}render(){let t=this._getPanels();return e`
      <div class="bd-ensemble bd-tabs-component">

        ${this.title?e`<bd-highlight highlight-text="${this.highlightText}">${this.title}</bd-highlight>`:``}

        ${this.subtitle?e`<bd-p variant="large" class="bd-tabs-subtitle">${this.subtitle}</bd-p>`:``}

        <bd-tab-list
          .tabs=${t.map(e=>({label:e.getAttribute(`title`)}))}
          .selected=${this.selectedTab}
          id-prefix="tab-btn"
          panel-id="tab-panel"
          @bd-tab-select=${e=>this.selectTab(e.detail.index)}
        ></bd-tab-list>

        <div
          id="tab-panel"
          role="tabpanel"
          aria-labelledby="tab-btn-${this.selectedTab}"
          class="bd-panel-wrapper"
        >
          ${t.map((t,n)=>e`
            <div class="bd-panel" ?inert=${n!==this.selectedTab}>${this._cloneOf(t,n===this.selectedTab)}</div>
          `)}
        </div>

      </div>
    `}};o([r({type:String})],m.prototype,`title`,void 0),o([r({type:String})],m.prototype,`subtitle`,void 0),o([r({type:String,attribute:`highlight-text`})],m.prototype,`highlightText`,void 0),o([i()],m.prototype,`selectedTab`,void 0),o([r({type:Boolean,reflect:!0,attribute:`bg-blue`})],m.prototype,`bgBlue`,void 0),m=o([a(`bd-tabs`)],m);