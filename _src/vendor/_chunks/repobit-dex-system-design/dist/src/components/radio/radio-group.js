import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{radiosOf as s}from"./radio.js";var c=r`:host{display:block}.label{font-family:var(--form-label-default-fontFamily);font-size:var(--form-label-default-fontSize);font-weight:var(--form-label-default-fontWeight);line-height:var(--form-label-default-lineHeight);letter-spacing:var(--form-label-default-letterSpacing);color:var(--form-label-default-color);margin-bottom:var(--form-label-default-marginBottom);display:block}.required{color:var(--form-label-required-color);margin-inline-start:var(--form-label-required-marginLeft)}.options{align-items:flex-start;gap:var(--spacing-8);flex-direction:column;display:flex}`,l=class extends n{constructor(...e){super(...e),this.label=``,this.name=``,this.required=!1}static{this.styles=[c]}get radios(){return s(this)}get value(){return this.radios.find(e=>e.checked)?.value??``}set value(e){let t=this.radios.find(t=>t.value===e);t&&(t.checked=!0)}updated(e){if(e.has(`name`)&&this.name)for(let e of this.radios)e.name=this.name;if(e.has(`required`))for(let e of this.radios)e.requestUpdate?.()}render(){return e`
      <div
        class="bd-radio-group"
        role="radiogroup"
        aria-labelledby=${this.label?`label`:t}
        aria-required=${this.required?`true`:t}
      >
        ${this.label?e`<span id="label" class="label" part="label">${this.label}${this.required?e`<span class="required" aria-hidden="true">*</span>`:t}</span>`:t}
        <div class="options" part="options"><slot></slot></div>
      </div>
    `}};o([i({type:String})],l.prototype,`label`,void 0),o([i({type:String})],l.prototype,`name`,void 0),o([i({type:Boolean})],l.prototype,`required`,void 0),l=o([a(`bd-radio-group`)],l);export{l as BdRadioGroup};