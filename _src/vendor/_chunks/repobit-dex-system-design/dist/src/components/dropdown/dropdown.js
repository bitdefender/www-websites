import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i,t as a}from"../../../../../lit/decorators.js";import{n as o,t as s}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as c}from"../shared/prop-vocabulary.js";import"../icons/arrow-down-icon.js";import{r as l,t as u}from"../shared/form-control.js";import{n as d,t as f}from"../../../../../lit/directives/keyed.js";var p=r`.select-wrap{display:block;position:relative}select.form-input-bd{appearance:none;cursor:pointer;padding-inline-end:calc(var(--icon-sm-size) + var(--spacing-12) * 2)}.select-caret{color:var(--color-text-muted);top:50%;pointer-events:none;transition:transform var(--transition-duration-normal) var(--transition-easing-smooth), color var(--transition-duration-normal) var(--transition-easing-smooth);position:absolute;inset-inline-end:var(--spacing-12);transform:translateY(-50%)}.select-caret--open{color:var(--color-text-brand);transform:translateY(-50%)rotate(180deg)}@media (prefers-reduced-motion:reduce){.select-caret{transition:none}}select.form-input--placeholder:enabled{color:var(--color-text-subtle)}select.form-input--placeholder:enabled:is(.form-input--error,.form-input--success,:user-invalid,.form-input--attempted:invalid){color:var(--color-text-muted)}select.form-input-bd option{color:var(--form-input-default-color)}.select-wrap:has(.form-input--disabled) .select-caret{color:var(--form-input-disabled-color)}`,m=e=>{if(Array.isArray(e))return e;if(typeof e!=`string`)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}},h=class extends u(n){static{this.styles=[d,p]}constructor(){super(),this.label=``,this.size=`md`,this.kind=``,this.required=!1,this.tooltip=``,this.invalid=!1,this.validated=!1,this.disabled=!1,this.value=``,this.name=``,this.placeholder=``,this._open=!1,this.options=[]}get _control(){return this.renderRoot?.querySelector?.(`select`)}get _values(){return[...this.placeholder?[``]:[],...this.options.map(String)]}connectedCallback(){super.connectedCallback(),this._onWindowFocus=()=>{this._open&&=!1},this._onDocPointerDown=e=>{this._open&&e.composedPath()[0]!==this.shadowRoot?.querySelector(`select`)&&(this._open=!1)},window.addEventListener(`focus`,this._onWindowFocus),document.addEventListener(`pointerdown`,this._onDocPointerDown,!0)}disconnectedCallback(){window.removeEventListener(`focus`,this._onWindowFocus),document.removeEventListener(`pointerdown`,this._onDocPointerDown,!0),super.disconnectedCallback()}_onSelectMouseDown(){this._open=!this._open}_onSelectKeyDown(e){(e.key===`Enter`||e.key===` `||e.altKey&&(e.key===`ArrowDown`||e.key===`ArrowUp`))&&(this._open=!0)}_closePicker(){this._open=!1}set options(e){this._options=m(e)}get options(){return this._options}willUpdate(e){e.has(`kind`)&&this.kind&&(this.size=this.kind),(e.has(`size`)||e.has(`kind`))&&(this.size=c(this.size));let t=this._values;t.includes(this.value)||(this.value=t[0]??``)}updated(){let e=this.shadowRoot.querySelector(`select`);e&&e.value!==this.value&&(e.value=this.value),this._sync()}_onChange(e){this._closePicker(),this.value=e.target.value,this._sync();let t={value:this.value,name:this.name};for(let e of[`bd-input`,`bd-change`])this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}render(){let n={sm:`input-sm`,md:`input-md`,lg:`input-lg`}[this.size],r={sm:`label-sm`,md:`label-md`,lg:`label-lg`}[this.size],i=this.disabled||this._formDisabled,a=i?`form-input--disabled`:this.invalid?`form-input--error`:this.validated?`form-input--success`:``,o=this.invalid?`form-help-text--error`:this.validated?`form-help-text--success`:`form-help-text--default`;return e`
      <div class="input-container">
        ${this.label?e`<label for="custom-dropdown" class="form-label ${r}">
              ${this.label}
              ${this.required?e`<span class="form-label__required" aria-hidden="true">*</span>`:``}
            </label>`:t}
        <div class="select-wrap">
          ${f(this._resets,e`<select
            id="custom-dropdown"
            class="form-input-bd ${n} ${a} ${this._attempted?`form-input--attempted`:``} ${this.placeholder&&this.value===``?`form-input--placeholder`:``}"
            ?required="${this.required}"
            ?disabled="${i}"
            aria-invalid="${this.invalid?`true`:t}"
            aria-describedby="${this.tooltip?`custom-dropdown-help`:t}"
            @mousedown="${this._onSelectMouseDown}"
            @keydown="${this._onSelectKeyDown}"
            name="${this.name||t}"
            @change="${this._onChange}"
            @blur="${this._closePicker}"
          >
            ${this.placeholder?e`<option value="" ?selected="${this.value===``}">${this.placeholder}</option>`:t}
            ${this.options.map(t=>e`<option value="${t}" ?selected="${String(t)===this.value}">
                ${t}
              </option>`)}
          </select>`)}
          <bd-arrow-down-icon
            size="sm"
            class="select-caret ${this._open?`select-caret--open`:``}"
          ></bd-arrow-down-icon>
        </div>
        ${this.tooltip?e`<div id="custom-dropdown-help" class="form-help-text ${o}">
              ${this.tooltip}
            </div>`:``}
      </div>
    `}};s([i({type:String})],h.prototype,`label`,void 0),s([i({type:String,reflect:!0})],h.prototype,`size`,void 0),s([i({type:String})],h.prototype,`kind`,void 0),s([i({type:Boolean})],h.prototype,`required`,void 0),s([i({type:String})],h.prototype,`tooltip`,void 0),s([i({type:Boolean})],h.prototype,`invalid`,void 0),s([i({type:Boolean})],h.prototype,`validated`,void 0),s([i({type:Boolean,reflect:!0})],h.prototype,`disabled`,void 0),s([i({type:String})],h.prototype,`value`,void 0),s([i({type:String,reflect:!0,converter:l})],h.prototype,`name`,void 0),s([i({type:String})],h.prototype,`placeholder`,void 0),s([a()],h.prototype,`_open`,void 0),s([i({converter:{fromAttribute:m}})],h.prototype,`options`,null),h=s([o(`bd-custom-dropdown`)],h);