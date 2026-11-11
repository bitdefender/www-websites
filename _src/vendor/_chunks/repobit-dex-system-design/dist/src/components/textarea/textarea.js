import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{n as s,t as c}from"../shared/prop-vocabulary.js";import{t as l}from"../shared/controller.slot.js";import{c as u,i as d,l as f,n as p,r as m,s as h,t as g}from"../shared/form-control.js";import{n as _,t as v}from"../../../../../lit/directives/keyed.js";var y=r`textarea.form-input-bd{resize:vertical;height:auto;line-height:var(--typography-lineHeight-normal)}`,b=class extends u(n){constructor(...e){super(...e),this.size=`md`,this.value=``,this.placeholder=``,this.rows=4,this.required=!1,this.invalid=!1,this.validated=!1,this.disabled=!1,this.name=``,this._slots=new l(this,{slots:f})}static{this.styles=[_,y]}get _control(){return this.renderRoot?.querySelector?.(`textarea`)}willUpdate(e){e.has(`size`)&&!c(s,this.size)&&(this.size=`md`)}updated(){this._sync()}_onInput(e){this.value=e.target.value,this._sync()}_onChange(e){this.value=e.target.value,this._relayChange()}render(){let n=this.disabled||this._formDisabled,r=n?`form-input--disabled`:this.invalid?`form-input--error`:this.validated?`form-input--success`:``,i=this.invalid?`error`:this.validated?`success`:`default`;return e`
      <div class="input-container">
        ${p(this._slots,{size:this.size,required:this.required},e`<slot name="label"></slot>`)}
        ${v(this._resets,e`<textarea
          id=${g}
          part="textarea"
          class="form-input-bd input-${this.size} ${r} ${this._attempted?`form-input--attempted`:``}"
          rows=${this.rows}
          name="${this.name||t}"
          placeholder=${this.placeholder||t}
          ?required=${this.required}
          ?disabled=${n}
          aria-invalid="${this.invalid?`true`:t}"
          aria-describedby=${h(this._slots)}
          .value=${this.value}
          @input=${this._onInput}
          @change=${this._onChange}
        ></textarea>`)}
        ${m(this._slots,i,e`<slot name="hint"></slot>`)}
      </div>
    `}};o([i({type:String,reflect:!0})],b.prototype,`size`,void 0),o([i({type:String})],b.prototype,`value`,void 0),o([i({type:String})],b.prototype,`placeholder`,void 0),o([i({type:Number})],b.prototype,`rows`,void 0),o([i({type:Boolean})],b.prototype,`required`,void 0),o([i({type:Boolean})],b.prototype,`invalid`,void 0),o([i({type:Boolean,reflect:!0})],b.prototype,`validated`,void 0),o([i({type:Boolean,reflect:!0})],b.prototype,`disabled`,void 0),o([i({type:String,reflect:!0,converter:d})],b.prototype,`name`,void 0),b=o([a(`bd-textarea`)],b);export{b as BdTextarea};