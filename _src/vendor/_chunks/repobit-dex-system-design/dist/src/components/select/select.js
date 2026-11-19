import{n as e,t}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{n,t as r}from"../shared/prop-vocabulary.js";import{t as i}from"../shared/controller.observer.js";import{t as a}from"../shared/flat-text.js";import{t as o}from"../shared/controller.slot.js";import"../icons/arrow-down.js";import{a as s,c,i as l,l as u,n as d,r as f,s as p,t as m}from"../shared/form-control.js";import{n as h,t as g}from"../../../../../lit/directives/keyed.js";import"./select-option.js";import{a as _,n as v,t as y,u as b}from"../../../../../lit/index.js";import{n as x,t as S}from"../../../../../lit/decorators.js";var C=b`.select-wrap{display:block;position:relative}select.form-input-bd{appearance:none;cursor:pointer;padding-inline-end:calc(var(--icon-sm-size) + var(--spacing-12) * 2)}.select-caret{color:var(--color-text-muted);top:50%;pointer-events:none;transition:transform var(--transition-duration-normal) var(--transition-easing-smooth), color var(--transition-duration-normal) var(--transition-easing-smooth);position:absolute;inset-inline-end:var(--spacing-12);transform:translateY(-50%)}.select-caret--open{color:var(--color-text-brand);transform:translateY(-50%)rotate(180deg)}@media (prefers-reduced-motion:reduce){.select-caret{transition:none}}select.form-input--placeholder:enabled{color:var(--color-text-subtle)}select.form-input--placeholder:enabled:is(.form-input--error,.form-input--success,:user-invalid,.form-input--attempted:invalid){color:var(--color-text-muted)}select.form-input-bd option{color:var(--form-input-default-color)}.select-wrap:has(.form-input--disabled) .select-caret{color:var(--form-input-disabled-color)}`,w={childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:[`value`,`selected`,`disabled`]},T=class extends c(y){constructor(...e){super(...e),this.size=`md`,this.required=!1,this.invalid=!1,this.validated=!1,this.disabled=!1,this.value=``,this.name=``,this.placeholder=``,this.fieldLabel=``,this._open=!1,this._slots=new o(this,{slots:u}),this._options=new i(this,()=>new MutationObserver(()=>this.requestUpdate()),e=>e.observe(this,w))}static{this.styles=[h,C]}get _control(){return this.renderRoot?.querySelector?.(`select`)}get _accessibleName(){return s(this._slots,this.fieldLabel,this._internals.labels)}get options(){return[...this.children].filter(e=>e.localName===`bd-select-option`)}get _choices(){return this.options.map(e=>{let t=a(e);return{value:e.getAttribute(`value`)??t,text:t,disabled:e.hasAttribute(`disabled`)}})}get _values(){return[...this.placeholder?[``]:[],...this._choices.map(e=>e.value)]}_defaultValue(){let e=this._values,t=this.getAttribute(`value`);if(t!==null&&e.includes(t))return t;let n=this._choices,r=this.options.findIndex(e=>e.hasAttribute(`selected`));return r>=0?n[r].value:this.placeholder?``:(n.find(e=>!e.disabled)??n[0])?.value??``}connectedCallback(){super.connectedCallback(),this._onWindowFocus=()=>{this._open&&=!1},this._onDocPointerDown=e=>{this._open&&e.composedPath()[0]!==this.shadowRoot?.querySelector(`select`)&&(this._open=!1)},window.addEventListener(`focus`,this._onWindowFocus),document.addEventListener(`pointerdown`,this._onDocPointerDown,!0),this.hasUpdated&&this.requestUpdate()}disconnectedCallback(){window.removeEventListener(`focus`,this._onWindowFocus),document.removeEventListener(`pointerdown`,this._onDocPointerDown,!0),super.disconnectedCallback()}_onSelectMouseDown(){this._open=!this._open}_onSelectKeyDown(e){(e.key===`Enter`||e.key===` `||e.altKey&&(e.key===`ArrowDown`||e.key===`ArrowUp`))&&(this._open=!0)}_closePicker(){this._open=!1}willUpdate(e){e.has(`size`)&&!r(n,this.size)&&(this.size=`md`),!this.hasUpdated&&this.value===``&&!this.hasAttribute(`value`)&&(this.value=this._defaultValue()),this._values.includes(this.value)||(this.value=this._defaultValue())}updated(){let e=this.shadowRoot.querySelector(`select`);e&&e.value!==this.value&&(e.value=this.value),this._sync()}_onInput(e){this.value=e.target.value,this._sync()}_onChange(e){this._closePicker(),this.value=e.target.value,this._relayChange()}render(){let e=this.disabled||this._formDisabled,t=e?`form-input--disabled`:this.invalid?`form-input--error`:this.validated?`form-input--success`:``,n=this.invalid?`error`:this.validated?`success`:`default`;return _`
      <div class="input-container">
        ${d(this._slots,{size:this.size,required:this.required},_`<slot name="label"></slot>`)}
        <div class="select-wrap">
          ${g(this._resets,_`<select
            id=${m}
            part="select"
            class="form-input-bd input-${this.size} ${t} ${this._attempted?`form-input--attempted`:``} ${this.placeholder&&this.value===``?`form-input--placeholder`:``}"
            name=${this.name||v}
            ?required=${this.required}
            ?disabled=${e}
            aria-label=${this._accessibleName||v}
            aria-invalid=${this.invalid?`true`:v}
            aria-describedby=${p(this._slots)}
            @mousedown=${this._onSelectMouseDown}
            @keydown=${this._onSelectKeyDown}
            @input=${this._onInput}
            @change=${this._onChange}
            @blur=${this._closePicker}
          >
            ${this.placeholder?_`<option value="" ?selected=${this.value===``}>${this.placeholder}</option>`:v}
            ${this._choices.map(e=>_`<option
              value=${e.value}
              ?selected=${e.value===this.value}
              ?disabled=${e.disabled}
            >${e.text}</option>`)}
          </select>`)}
          <bd-icon name="arrow-down"
            size="sm"
            class="select-caret ${this._open?`select-caret--open`:``}"
          ></bd-icon>
        </div>
        ${f(this._slots,n,_`<slot name="hint"></slot>`)}
      </div>
    `}};t([x({type:String,reflect:!0})],T.prototype,`size`,void 0),t([x({type:Boolean})],T.prototype,`required`,void 0),t([x({type:Boolean})],T.prototype,`invalid`,void 0),t([x({type:Boolean})],T.prototype,`validated`,void 0),t([x({type:Boolean,reflect:!0})],T.prototype,`disabled`,void 0),t([x({type:String})],T.prototype,`value`,void 0),t([x({type:String,reflect:!0,converter:l})],T.prototype,`name`,void 0),t([x({type:String})],T.prototype,`placeholder`,void 0),t([x({type:String,attribute:`aria-label`})],T.prototype,`fieldLabel`,void 0),t([S()],T.prototype,`_open`,void 0),T=t([e(`bd-select`)],T);export{T as BdSelect};