import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{n as s,t as c}from"../shared/prop-vocabulary.js";import{t as l}from"../shared/controller.slot.js";import{c as u,i as d,n as f,o as p,r as m,s as h,t as g}from"../shared/form-control.js";import{n as _,t as v}from"../../../../../lit/directives/keyed.js";var y=r`.control-row{align-items:center;display:flex;position:relative}input.form-input--with-end{flex:1;padding-inline-end:var(--spacing-40)}.end{align-items:center;display:inline-flex;position:absolute;inset-inline-end:var(--spacing-8)}.end[hidden]{display:none}`,b=class extends h(n){constructor(...e){super(...e),this.type=`text`,this.size=`md`,this.placeholder=``,this.required=!1,this.focused=!1,this.invalid=!1,this.validated=!1,this.disabled=!1,this.value=``,this.name=``,this.inputmode=``,this.autocomplete=``,this.enterkeyhint=``,this.fieldSpellcheck=null,this.fieldLabel=``,this._slots=new l(this,{slots:[...u,`end`],text:[`label`]})}static{this.styles=[_,y]}get _control(){return this.renderRoot?.querySelector?.(`input`)}get _accessibleName(){return this._slots.has(`label`)?``:this.fieldLabel?this.fieldLabel:[...this._internals.labels??[]].map(e=>e.textContent.trim()).filter(Boolean).join(` `)}_onInput(e){this.value=e.target.value,this._sync()}_onChange(e){this.value=e.target.value,this._relayChange()}willUpdate(e){e.has(`size`)&&!c(s,this.size)&&(this.size=`md`)}updated(e){this._sync(),this._followFocused(e);for(let e of this._slots.elements(`end`))e.requestUpdate?.()}_followFocused(e){if(!e.has(`focused`))return;let t=this.shadowRoot.querySelector(`input`),n=this.shadowRoot.activeElement===t;this.focused&&!n&&t?.focus(),!this.focused&&n&&t?.blur()}render(){let n=this.disabled||this._formDisabled,r=n?`form-input--disabled`:this.invalid?`form-input--error`:this.validated?`form-input--success`:``,i=this.invalid?`error`:this.validated?`success`:`default`,a=this._slots.has(`end`);return e`
      <div class="input-container">
        ${f(this._slots,{size:this.size,required:this.required},e`<slot name="label"></slot>`)}
        <div class="control-row">
          ${v(this._resets,e`<input
            id=${g}
            part="input"
            class="form-input-bd input-${this.size} ${r} ${this._attempted?`form-input--attempted`:``} ${a?`form-input--with-end`:``}"
            type=${this.type}
            name=${this.name||t}
            placeholder=${this.placeholder||t}
            .value=${this.value}
            inputmode=${this.inputmode||t}
            autocomplete=${this.autocomplete||t}
            spellcheck=${this.fieldSpellcheck??t}
            enterkeyhint=${this.enterkeyhint||t}
            ?required=${this.required}
            ?disabled=${n}
            aria-label=${this._accessibleName||t}
            aria-invalid=${this.invalid?`true`:t}
            aria-describedby=${p(this._slots)}
            @focus=${()=>{this.focused=!0}}
            @blur=${()=>{this.focused=!1}}
            @input=${this._onInput}
            @change=${this._onChange}
            @keydown=${this._onFieldKeydown}
          />`)}
          <span class="end" part="end" ?hidden=${!a}><slot name="end"></slot></span>
        </div>
        ${m(this._slots,i,e`<slot name="hint"></slot>`)}
      </div>
    `}};o([i({type:String})],b.prototype,`type`,void 0),o([i({type:String,reflect:!0})],b.prototype,`size`,void 0),o([i({type:String})],b.prototype,`placeholder`,void 0),o([i({type:Boolean})],b.prototype,`required`,void 0),o([i({type:Boolean,reflect:!0})],b.prototype,`focused`,void 0),o([i({type:Boolean})],b.prototype,`invalid`,void 0),o([i({type:Boolean,reflect:!0})],b.prototype,`validated`,void 0),o([i({type:Boolean,reflect:!0})],b.prototype,`disabled`,void 0),o([i({type:String})],b.prototype,`value`,void 0),o([i({type:String,reflect:!0,converter:d})],b.prototype,`name`,void 0),o([i({type:String})],b.prototype,`inputmode`,void 0),o([i({type:String})],b.prototype,`autocomplete`,void 0),o([i({type:String})],b.prototype,`enterkeyhint`,void 0),o([i({type:String,attribute:`spellcheck`})],b.prototype,`fieldSpellcheck`,void 0),o([i({type:String,attribute:`aria-label`})],b.prototype,`fieldLabel`,void 0),b=o([a(`bd-input`)],b);export{b as BdInput};