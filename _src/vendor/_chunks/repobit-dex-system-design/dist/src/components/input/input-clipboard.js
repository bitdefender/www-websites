import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as s}from"../shared/prop-vocabulary.js";import{r as c,t as l}from"../shared/form-control.js";import{n as u,t as d}from"../../../../../lit/directives/keyed.js";import{t as f}from"../shared/announcer.js";var p=r`.input-with-button{align-items:center;display:flex;position:relative}input.form-input-bd{flex:1;padding-inline-end:var(--spacing-40)}.paste-button{cursor:pointer;font-family:var(--typography-fontFamily-sans);font-size:var(--typography-fontSize-base);color:var(--color-text-secondary);background:0 0;border:none;align-items:center;padding:0;display:inline-flex;position:absolute;inset-inline-end:var(--spacing-8)}.paste-button:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary);border-radius:var(--focus-outline-radius)}.paste-status{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;margin:-1px;position:absolute;overflow:hidden}.paste-button:hover{color:var(--color-text-primary)}.paste-button:disabled{cursor:not-allowed;color:var(--form-input-disabled-color)}`,m=class extends l(n){static{this.styles=[u,p]}constructor(){super(),this.label=``,this.type=`text`,this.size=`md`,this.kind=``,this.placeholder=``,this.required=!1,this.focused=!1,this.tooltip=``,this.invalid=!1,this.validated=!1,this.disabled=!1,this.value=``,this.name=``,this.autocomplete=``,this.spellCheck=null,this.enterkeyhint=``,this.fieldLabel=``,this._announcer=new f(this)}get _control(){return this.renderRoot?.querySelector?.(`input`)}get _accessibleName(){return this.label?``:this.fieldLabel?this.fieldLabel:[...this._internals.labels??[]].map(e=>e.textContent.trim()).filter(Boolean).join(` `)}_emit(e){this.dispatchEvent(new CustomEvent(e,{detail:{value:this.value,name:this.name},bubbles:!0,composed:!0}))}async pasteFromClipboard(){try{let e=await navigator.clipboard.readText();this.value=e,this._sync(),this._emit(`bd-input`),this._emit(`bd-change`),this._announcer.say(`Pasted from clipboard`)}catch(e){console.error(`Clipboard paste failed:`,e),this._announcer.say(`Could not paste from clipboard`)}}handleInput(e){this.value=e.target.value,this._sync(),this._emit(`bd-input`)}handleChange(){this._emit(`bd-change`)}willUpdate(e){e.has(`kind`)&&this.kind&&(this.size=this.kind),(e.has(`size`)||e.has(`kind`))&&(this.size=s(this.size))}updated(e){if(this._sync(),!e.has(`focused`))return;let t=this.shadowRoot.querySelector(`input`),n=this.shadowRoot.activeElement===t;this.focused&&!n&&t?.focus(),!this.focused&&n&&t?.blur()}render(){let n={sm:`input-sm`,md:`input-md`,lg:`input-lg`}[this.size],r={sm:`label-sm`,md:`label-md`,lg:`label-lg`}[this.size],i=this.disabled||this._formDisabled,a=i?`form-input--disabled`:this.invalid?`form-input--error`:this.validated?`form-input--success`:``,o=this.invalid?`form-help-text--error`:this.validated?`form-help-text--success`:`form-help-text--default`;return e`
      <div class="input-container">
        ${this.label?e`<label for="clipboard-input" class="form-label ${r}">
              ${this.label}
              ${this.required?e`<span class="form-label__required" aria-hidden="true">*</span>`:``}
            </label>`:t}
        <div class="input-with-button">
          ${d(this._resets,e`<input
            id="clipboard-input"
            class="form-input-bd ${n} ${a} ${this._attempted?`form-input--attempted`:``}"
            type="${this.type}"
            placeholder="${this.placeholder}"
            .value="${this.value}"
            autocomplete="${this.autocomplete||t}"
            spellcheck="${this.spellCheck??t}"
            enterkeyhint="${this.enterkeyhint||t}"
            ?required="${this.required}"
            ?disabled="${i}"
            name="${this.name||t}"
            aria-label="${this._accessibleName||t}"
            aria-invalid="${this.invalid?`true`:t}"
            aria-describedby="${this.tooltip?`clipboard-input-help`:t}"
            @focus="${()=>{this.focused=!0}}"
            @blur="${()=>{this.focused=!1}}"
            @input="${this.handleInput}"
            @change="${this.handleChange}"
            @keydown="${this._onFieldKeydown}"
          />`)}
          <button
            class="paste-button"
            @click="${this.pasteFromClipboard}"
            title="Paste from clipboard"
            ?disabled="${i}"
            type="button"
            aria-label="Paste from clipboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M16 4H18A2 2 0 0 1 20 6V20A2 2 0 0 1 18 22H6A2 2 0 0 1 4 20V6A2 2 0 0 1 6 4H8"
              />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </button>
        </div>

        ${this.tooltip?e`<div id="clipboard-input-help" class="form-help-text ${o}">
              ${this.tooltip}
            </div>`:``}
        <span class="paste-status" role="status">${this._announcer.status}</span>
      </div>
    `}};o([i({type:String})],m.prototype,`label`,void 0),o([i({type:String})],m.prototype,`type`,void 0),o([i({type:String,reflect:!0})],m.prototype,`size`,void 0),o([i({type:String})],m.prototype,`kind`,void 0),o([i({type:String})],m.prototype,`placeholder`,void 0),o([i({type:Boolean})],m.prototype,`required`,void 0),o([i({type:Boolean,reflect:!0})],m.prototype,`focused`,void 0),o([i({type:String})],m.prototype,`tooltip`,void 0),o([i({type:Boolean})],m.prototype,`invalid`,void 0),o([i({type:Boolean,reflect:!0})],m.prototype,`validated`,void 0),o([i({type:Boolean,reflect:!0})],m.prototype,`disabled`,void 0),o([i({type:String})],m.prototype,`value`,void 0),o([i({type:String,reflect:!0,converter:c})],m.prototype,`name`,void 0),o([i({type:String})],m.prototype,`autocomplete`,void 0),o([i({type:String,attribute:`spellcheck`})],m.prototype,`spellCheck`,void 0),o([i({type:String})],m.prototype,`enterkeyhint`,void 0),o([i({type:String,attribute:`aria-label`})],m.prototype,`fieldLabel`,void 0),m=o([a(`bd-custom-input-clipboard`)],m);