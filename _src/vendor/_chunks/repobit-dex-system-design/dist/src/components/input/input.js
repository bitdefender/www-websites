import{n as e,t}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{n,t as r}from"../shared/prop-vocabulary.js";import{t as i}from"../shared/controller.slot.js";import{a,c as o,i as s,l as c,n as l,r as u,s as d,t as f}from"../shared/form-control.js";import{a as p,n as m,t as h,u as g}from"../../../../../lit/index.js";import{n as _,t as v}from"../../../../../lit/directives/keyed.js";import{n as y}from"../../../../../lit/decorators.js";var b=g`.control-row{align-items:center;display:flex;position:relative}input.form-input--with-end{flex:1;padding-inline-end:var(--spacing-40)}.end{align-items:center;display:inline-flex;position:absolute;inset-inline-end:var(--spacing-8)}.end[hidden]{display:none}`,x=class extends o(h){constructor(...e){super(...e),this.type=`text`,this.size=`md`,this.placeholder=``,this.required=!1,this.focused=!1,this.invalid=!1,this.validated=!1,this.disabled=!1,this.value=``,this.name=``,this.inputmode=``,this.autocomplete=``,this.enterkeyhint=``,this.fieldSpellcheck=null,this.fieldLabel=``,this._slots=new i(this,{slots:[...c,`end`],text:[`label`]})}static{this.styles=[_,b]}get _control(){return this.renderRoot?.querySelector?.(`input`)}get _accessibleName(){return a(this._slots,this.fieldLabel,this._internals.labels)}_onInput(e){this.value=e.target.value,this._sync()}_onChange(e){this.value=e.target.value,this._relayChange()}willUpdate(e){e.has(`size`)&&!r(n,this.size)&&(this.size=`md`)}updated(e){this._sync(),this._followFocused(e);for(let e of this._slots.elements(`end`))e.requestUpdate?.()}_followFocused(e){if(!e.has(`focused`))return;let t=this.shadowRoot.querySelector(`input`),n=this.shadowRoot.activeElement===t;this.focused&&!n&&t?.focus(),!this.focused&&n&&t?.blur()}render(){let e=this.disabled||this._formDisabled,t=e?`form-input--disabled`:this.invalid?`form-input--error`:this.validated?`form-input--success`:``,n=this.invalid?`error`:this.validated?`success`:`default`,r=this._slots.has(`end`);return p`
      <div class="input-container">
        ${l(this._slots,{size:this.size,required:this.required},p`<slot name="label"></slot>`)}
        <div class="control-row">
          ${v(this._resets,p`<input
            id=${f}
            part="input"
            class="form-input-bd input-${this.size} ${t} ${this._attempted?`form-input--attempted`:``} ${r?`form-input--with-end`:``}"
            type=${this.type}
            name=${this.name||m}
            placeholder=${this.placeholder||m}
            .value=${this.value}
            inputmode=${this.inputmode||m}
            autocomplete=${this.autocomplete||m}
            spellcheck=${this.fieldSpellcheck??m}
            enterkeyhint=${this.enterkeyhint||m}
            ?required=${this.required}
            ?disabled=${e}
            aria-label=${this._accessibleName||m}
            aria-invalid=${this.invalid?`true`:m}
            aria-describedby=${d(this._slots)}
            @focus=${()=>{this.focused=!0}}
            @blur=${()=>{this.focused=!1}}
            @input=${this._onInput}
            @change=${this._onChange}
            @keydown=${this._onFieldKeydown}
          />`)}
          <span class="end" part="end" ?hidden=${!r}><slot name="end"></slot></span>
        </div>
        ${u(this._slots,n,p`<slot name="hint"></slot>`)}
      </div>
    `}};t([y({type:String})],x.prototype,`type`,void 0),t([y({type:String,reflect:!0})],x.prototype,`size`,void 0),t([y({type:String})],x.prototype,`placeholder`,void 0),t([y({type:Boolean})],x.prototype,`required`,void 0),t([y({type:Boolean,reflect:!0})],x.prototype,`focused`,void 0),t([y({type:Boolean})],x.prototype,`invalid`,void 0),t([y({type:Boolean,reflect:!0})],x.prototype,`validated`,void 0),t([y({type:Boolean,reflect:!0})],x.prototype,`disabled`,void 0),t([y({type:String})],x.prototype,`value`,void 0),t([y({type:String,reflect:!0,converter:s})],x.prototype,`name`,void 0),t([y({type:String})],x.prototype,`inputmode`,void 0),t([y({type:String})],x.prototype,`autocomplete`,void 0),t([y({type:String})],x.prototype,`enterkeyhint`,void 0),t([y({type:String,attribute:`spellcheck`})],x.prototype,`fieldSpellcheck`,void 0),t([y({type:String,attribute:`aria-label`})],x.prototype,`fieldLabel`,void 0),x=t([e(`bd-input`)],x);export{x as BdInput};