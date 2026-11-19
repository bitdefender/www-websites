import{n as e,t}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{n,t as r}from"../shared/prop-vocabulary.js";import{t as i}from"../shared/controller.slot.js";import{c as a,i as o,l as s,n as c,r as l,s as u,t as d}from"../shared/form-control.js";import{n as f,t as p}from"../../../../../lit/directives/keyed.js";import{a as m,n as h,t as g,u as _}from"../../../../../lit/index.js";import{n as v}from"../../../../../lit/decorators.js";var y=_`textarea.form-input-bd{resize:vertical;height:auto;line-height:var(--typography-lineHeight-normal)}`,b=class extends a(g){constructor(...e){super(...e),this.size=`md`,this.value=``,this.placeholder=``,this.rows=4,this.required=!1,this.invalid=!1,this.validated=!1,this.disabled=!1,this.name=``,this._slots=new i(this,{slots:s})}static{this.styles=[f,y]}get _control(){return this.renderRoot?.querySelector?.(`textarea`)}willUpdate(e){e.has(`size`)&&!r(n,this.size)&&(this.size=`md`)}updated(){this._sync()}_onInput(e){this.value=e.target.value,this._sync()}_onChange(e){this.value=e.target.value,this._relayChange()}render(){let e=this.disabled||this._formDisabled,t=e?`form-input--disabled`:this.invalid?`form-input--error`:this.validated?`form-input--success`:``,n=this.invalid?`error`:this.validated?`success`:`default`;return m`
      <div class="input-container">
        ${c(this._slots,{size:this.size,required:this.required},m`<slot name="label"></slot>`)}
        ${p(this._resets,m`<textarea
          id=${d}
          part="textarea"
          class="form-input-bd input-${this.size} ${t} ${this._attempted?`form-input--attempted`:``}"
          rows=${this.rows}
          name="${this.name||h}"
          placeholder=${this.placeholder||h}
          ?required=${this.required}
          ?disabled=${e}
          aria-invalid="${this.invalid?`true`:h}"
          aria-describedby=${u(this._slots)}
          .value=${this.value}
          @input=${this._onInput}
          @change=${this._onChange}
        ></textarea>`)}
        ${l(this._slots,n,m`<slot name="hint"></slot>`)}
      </div>
    `}};t([v({type:String,reflect:!0})],b.prototype,`size`,void 0),t([v({type:String})],b.prototype,`value`,void 0),t([v({type:String})],b.prototype,`placeholder`,void 0),t([v({type:Number})],b.prototype,`rows`,void 0),t([v({type:Boolean})],b.prototype,`required`,void 0),t([v({type:Boolean})],b.prototype,`invalid`,void 0),t([v({type:Boolean,reflect:!0})],b.prototype,`validated`,void 0),t([v({type:Boolean,reflect:!0})],b.prototype,`disabled`,void 0),t([v({type:String,reflect:!0,converter:o})],b.prototype,`name`,void 0),b=t([e(`bd-textarea`)],b);export{b as BdTextarea};