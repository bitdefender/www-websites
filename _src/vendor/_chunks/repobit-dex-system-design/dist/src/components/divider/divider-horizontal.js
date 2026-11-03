import{a as e,t}from"../../../../../lit/index.js";import{n}from"../../../../../lit/decorators.js";import{n as r,t as i}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{r as a,s as o}from"../shared/token-scales.js";import{n as s}from"./divider.css.js";var c=class extends t{constructor(...e){super(...e),this.width=`100%`,this.color=``,this.opacity=``}static{this.styles=[s]}render(){let t=a(this.color),n=o(this.opacity);return e`
      <hr
        class="hr-line"
        style="
          width: ${this.width};
          ${t?`border-top-color: ${t};`:``}
          ${n?`opacity: ${n};`:``}
        "
      />
    `}};i([n({type:String})],c.prototype,`width`,void 0),i([n({type:String})],c.prototype,`color`,void 0),i([n({type:String})],c.prototype,`opacity`,void 0),c=i([r(`bd-divider-horizontal`)],c);export{c as BdDividerHorizontal};