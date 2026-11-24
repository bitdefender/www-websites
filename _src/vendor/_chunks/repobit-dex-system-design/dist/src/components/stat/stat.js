import{a as e,n as t,t as n}from"../../../../../lit/index.js";import{n as r}from"../../../../../lit/decorators.js";import{n as i,t as a}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as o}from"../shared/controller.slot.js";import{t as s}from"./stat-highlight.js";var c=class extends n{constructor(...e){super(...e),this.label=``,this._slots=new o(this,{slots:[`value`,`caption`],text:[`value`,`caption`]})}static{this.styles=[s]}render(){let n=e=>this._slots.has(e),r=!!this.label,i=[`value`,`caption`].filter(n);return e`
      <div
        class="tile"
        role="group"
        aria-label=${r?`${this.label} ${this._slots.text(`caption`)}`.trim():t}
        aria-labelledby=${!r&&i.length?i.join(` `):t}
      >
        <p class="value" id="value" aria-hidden=${r?`true`:t} ?hidden=${!n(`value`)}><slot name="value"></slot></p>
        <p class="caption" id="caption" aria-hidden=${r?`true`:t} ?hidden=${!n(`caption`)}><slot name="caption"></slot></p>
      </div>
    `}};a([r({type:String,attribute:`label`})],c.prototype,`label`,void 0),c=a([i(`bd-stat`)],c);export{c as BdStat};