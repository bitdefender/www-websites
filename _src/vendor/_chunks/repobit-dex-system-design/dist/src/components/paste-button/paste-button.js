import{n as e,t}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as n}from"../shared/flat-text.js";import{t as r}from"../shared/announcer.js";import"../icons/clipboard.js";import{a as i,n as a,t as o,u as s}from"../../../../../lit/index.js";import{n as c}from"../../../../../lit/decorators.js";var l=s`:host{vertical-align:middle;display:inline-flex}.paste-button{min-width:var(--dimension-24);min-height:var(--dimension-24);cursor:pointer;font-family:var(--typography-fontFamily-sans);font-size:var(--typography-fontSize-base);color:var(--color-text-secondary);background:0 0;border:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.paste-button:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary);border-radius:var(--focus-outline-radius)}.paste-button:hover{color:var(--color-text-primary)}.paste-button:disabled{cursor:not-allowed;color:var(--form-input-disabled-color)}.status{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;margin:-1px;position:absolute;overflow:hidden}`,u=class extends o{static{this.styles=[l]}constructor(){super(),this.label=``,this.successLabel=``,this.errorLabel=``,this.disabled=!1,this._announcer=new r(this)}get _field(){let e=this.parentElement;return e?.localName===`bd-input`?e:null}get _isDisabled(){let e=this._field;return this.disabled||!e||e.matches(`:disabled`)}get _description(){let e=this._field;return e?n(...e.querySelectorAll(`:scope > [slot='label']`)):``}async paste(){let e=this._field;if(!this._isDisabled&&e)try{e.value=await navigator.clipboard.readText(),await e.updateComplete;for(let t of[`input`,`change`])e.dispatchEvent(new Event(t,{bubbles:!0,composed:!0}));this.successLabel&&this._announcer.say(this.successLabel)}catch(e){console.error(`Clipboard paste failed:`,e),this.errorLabel&&this._announcer.say(this.errorLabel)}}render(){let e=this._description;return i`
      <button
        type="button"
        part="button"
        class="paste-button"
        title=${this.label||a}
        aria-label=${this.label||a}
        aria-describedby=${e?`description`:a}
        ?disabled=${this._isDisabled}
        @click=${this.paste}
      >
        <bd-icon name="clipboard" size="md"></bd-icon>
      </button>
      <span id="description" hidden>${e}</span>
      <span class="status" role="status">${this._announcer.status}</span>
    `}};t([c({type:String})],u.prototype,`label`,void 0),t([c({type:String,attribute:`success-label`})],u.prototype,`successLabel`,void 0),t([c({type:String,attribute:`error-label`})],u.prototype,`errorLabel`,void 0),t([c({type:Boolean,reflect:!0})],u.prototype,`disabled`,void 0),u=t([e(`bd-paste-button`)],u);export{u as BdPasteButton};