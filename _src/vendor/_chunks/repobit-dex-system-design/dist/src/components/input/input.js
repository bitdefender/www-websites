import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as s}from"../shared/prop-vocabulary.js";import{r as c,t as l}from"../shared/form-control.js";import{n as u,t as d}from"../../../../../lit/directives/keyed.js";var f=r``,p=`custom-input`,m=`custom-input-help`,h=class extends l(n){constructor(...e){super(...e),this.label=``,this.type=`text`,this.size=`md`,this.kind=``,this.placeholder=``,this.required=!1,this.focused=!1,this.tooltip=``,this.invalid=!1,this.validated=!1,this.disabled=!1,this.value=``,this.name=``,this.inputmode=``,this.autocomplete=``,this.enterkeyhint=``}static{this.styles=[u,f]}get _control(){return this.renderRoot?.querySelector?.(`input`)}_onInput(e){this.value=e.target.value,this._sync(),this.dispatchEvent(new CustomEvent(`bd-input`,{detail:{value:this.value,name:this.name},bubbles:!0,composed:!0}))}_onChange(e){this.value=e.target.value,this.dispatchEvent(new CustomEvent(`bd-change`,{detail:{value:this.value,name:this.name},bubbles:!0,composed:!0}))}willUpdate(e){e.has(`kind`)&&this.kind&&(this.size=this.kind),(e.has(`size`)||e.has(`kind`))&&(this.size=s(this.size))}updated(e){this._sync(),this._followFocused(e)}_followFocused(e){if(!e.has(`focused`))return;let t=this.shadowRoot.querySelector(`input`),n=this.shadowRoot.activeElement===t;this.focused&&!n&&t?.focus(),!this.focused&&n&&t?.blur()}render(){let n={sm:`input-sm`,md:`input-md`,lg:`input-lg`}[this.size],r={sm:`label-sm`,md:`label-md`,lg:`label-lg`}[this.size],i=this.disabled||this._formDisabled,a=i?`form-input--disabled`:this.invalid?`form-input--error`:this.validated?`form-input--success`:``,o=this.invalid?`form-help-text--error`:this.validated?`form-help-text--success`:`form-help-text--default`;return e`
      <div class="input-container">
        ${this.label?e`<label for="${p}" class="form-label ${r}">
              ${this.label}
              ${this.required?e`<span class="form-label__required" aria-hidden="true">*</span>`:``}
            </label>`:t}
        ${d(this._resets,e`<input
          id="${p}"
          class="form-input-bd ${n} ${a} ${this._attempted?`form-input--attempted`:``}"
          type="${this.type}"
          name="${this.name||t}"
          placeholder="${this.placeholder}"
          .value="${this.value}"
          inputmode="${this.inputmode||t}"
          autocomplete="${this.autocomplete||t}"
          enterkeyhint="${this.enterkeyhint||t}"
          ?required="${this.required}"
          ?disabled="${i}"
          aria-invalid="${this.invalid?`true`:t}"
          aria-describedby="${this.tooltip?m:t}"
          @focus="${()=>{this.focused=!0}}"
          @blur="${()=>{this.focused=!1}}"
          @input="${this._onInput}"
          @change="${this._onChange}"
          @keydown="${this._onFieldKeydown}"
        />`)}
        ${this.tooltip?e`<div id="${m}" class="form-help-text ${o}">
              ${this.tooltip}
            </div>`:``}
      </div>
    `}};o([i({type:String})],h.prototype,`label`,void 0),o([i({type:String})],h.prototype,`type`,void 0),o([i({type:String,reflect:!0})],h.prototype,`size`,void 0),o([i({type:String})],h.prototype,`kind`,void 0),o([i({type:String})],h.prototype,`placeholder`,void 0),o([i({type:Boolean})],h.prototype,`required`,void 0),o([i({type:Boolean,reflect:!0})],h.prototype,`focused`,void 0),o([i({type:String})],h.prototype,`tooltip`,void 0),o([i({type:Boolean})],h.prototype,`invalid`,void 0),o([i({type:Boolean,reflect:!0})],h.prototype,`validated`,void 0),o([i({type:Boolean,reflect:!0})],h.prototype,`disabled`,void 0),o([i({type:String})],h.prototype,`value`,void 0),o([i({type:String,reflect:!0,converter:c})],h.prototype,`name`,void 0),o([i({type:String})],h.prototype,`inputmode`,void 0),o([i({type:String})],h.prototype,`autocomplete`,void 0),o([i({type:String})],h.prototype,`enterkeyhint`,void 0),h=o([a(`bd-custom-input`)],h);