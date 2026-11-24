import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as s}from"../shared/flat-text.js";import{t as c}from"../shared/announcer.js";import"../icons/clipboard.js";var l=r`:host{vertical-align:middle;display:inline-flex}.paste-button{min-width:var(--dimension-24);min-height:var(--dimension-24);cursor:pointer;font-family:var(--typography-fontFamily-sans);font-size:var(--typography-fontSize-base);color:var(--color-text-secondary);background:0 0;border:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.paste-button:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary);border-radius:var(--focus-outline-radius)}.paste-button:hover{color:var(--color-text-primary)}.paste-button:disabled{cursor:not-allowed;color:var(--form-input-disabled-color)}.status{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;margin:-1px;position:absolute;overflow:hidden}`,u=class extends n{static{this.styles=[l]}constructor(){super(),this.label=``,this.successLabel=``,this.errorLabel=``,this.disabled=!1,this._announcer=new c(this)}get _field(){let e=this.parentElement;return e?.localName===`bd-input`?e:null}get _isDisabled(){let e=this._field;return this.disabled||!e||e.matches(`:disabled`)}get _description(){let e=this._field;return e?s(...e.querySelectorAll(`:scope > [slot='label']`)):``}async paste(){let e=this._field;if(!this._isDisabled&&e)try{e.value=await navigator.clipboard.readText(),await e.updateComplete;for(let t of[`input`,`change`])e.dispatchEvent(new Event(t,{bubbles:!0,composed:!0}));this.successLabel&&this._announcer.say(this.successLabel)}catch(e){console.error(`Clipboard paste failed:`,e),this.errorLabel&&this._announcer.say(this.errorLabel)}}render(){let n=this._description;return e`
      <button
        type="button"
        part="button"
        class="paste-button"
        title=${this.label||t}
        aria-label=${this.label||t}
        aria-describedby=${n?`description`:t}
        ?disabled=${this._isDisabled}
        @click=${this.paste}
      >
        <bd-icon name="clipboard" size="md"></bd-icon>
      </button>
      <span id="description" hidden>${n}</span>
      <span class="status" role="status">${this._announcer.status}</span>
    `}};o([i({type:String})],u.prototype,`label`,void 0),o([i({type:String,attribute:`success-label`})],u.prototype,`successLabel`,void 0),o([i({type:String,attribute:`error-label`})],u.prototype,`errorLabel`,void 0),o([i({type:Boolean,reflect:!0})],u.prototype,`disabled`,void 0),u=o([a(`bd-paste-button`)],u);export{u as BdPasteButton};