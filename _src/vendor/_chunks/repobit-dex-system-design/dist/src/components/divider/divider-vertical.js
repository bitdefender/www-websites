import{a as e,t}from"../../../../../lit/index.js";import{n}from"../../../../../lit/decorators.js";import{n as r,t as i}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{h as a,p as o,r as s,s as c}from"../shared/token-scales.js";import{t as l}from"./divider.css.js";var u=class extends t{constructor(...e){super(...e),this.height=`16`,this.thickness=`1`,this.color=``,this.opacity=``}static{this.styles=[l]}render(){let t=s(this.color),n=c(this.opacity);return e`
      <div
        class="divider"
        style="
          width: ${a(this.thickness)||a(`1`)};
          height: ${o(this.height)};
          ${t?`background-color: ${t};`:``}
          ${n?`opacity: ${n};`:``}
        "
      ></div>
    `}};i([n({type:String})],u.prototype,`height`,void 0),i([n({type:String})],u.prototype,`thickness`,void 0),i([n({type:String})],u.prototype,`color`,void 0),i([n({type:String})],u.prototype,`opacity`,void 0),u=i([r(`bd-divider-vertical`)],u);export{u as BdDividerVertical};