import{n as e,t}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as n}from"../shared/controller.slot.js";import{t as r}from"./stat-highlight.js";import{a as i,n as a,t as o}from"../../../../../lit/index.js";import{n as s}from"../../../../../lit/decorators.js";var c=class extends o{constructor(...e){super(...e),this.label=``,this._slots=new n(this,{slots:[`value`,`caption`],text:[`value`,`caption`]})}static{this.styles=[r]}render(){let e=e=>this._slots.has(e),t=!!this.label,n=[`value`,`caption`].filter(e);return i`
      <div
        class="tile"
        role="group"
        aria-label=${t?`${this.label} ${this._slots.text(`caption`)}`.trim():a}
        aria-labelledby=${!t&&n.length?n.join(` `):a}
      >
        <p class="value" id="value" aria-hidden=${t?`true`:a} ?hidden=${!e(`value`)}><slot name="value"></slot></p>
        <p class="caption" id="caption" aria-hidden=${t?`true`:a} ?hidden=${!e(`caption`)}><slot name="caption"></slot></p>
      </div>
    `}};t([s({type:String,attribute:`label`})],c.prototype,`label`,void 0),c=t([e(`bd-stat`)],c);export{c as BdStat};