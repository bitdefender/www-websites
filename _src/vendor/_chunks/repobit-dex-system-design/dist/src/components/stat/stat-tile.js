import{a as e,n as t,t as n}from"../../../../../lit/index.js";import{n as r}from"../../../../../lit/decorators.js";import{n as i,t as a}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{n as o}from"./stat.css.js";var s=class extends n{constructor(...e){super(...e),this.value=``,this.caption=``,this.label=``}static{this.styles=[o]}render(){return e`
      <div class="tile" role="group" aria-label="${this.label?`${this.label} ${this.caption}`.trim():t}">
        <p class="value" aria-hidden="${this.label?`true`:t}">${this.value}</p>
        ${this.caption?e`<p class="caption" aria-hidden="${this.label?`true`:t}">${this.caption}</p>`:t}
      </div>
    `}};a([r({type:String})],s.prototype,`value`,void 0),a([r({type:String})],s.prototype,`caption`,void 0),a([r({type:String})],s.prototype,`label`,void 0),s=a([i(`bd-stat-tile`)],s);export{s as StatTile};