import{_ as e,h as t,r as n,s as r}from"../shared/token-scales.js";import{n as i,t as a}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as o}from"../shared/prop-vocabulary.js";import{a as s,t as c,u as l}from"../../../../../lit/index.js";import{n as u}from"../../../../../lit/decorators.js";var d=l`.hr-line{border:none;border-top:var(--border-width-1) solid var(--color-border-container);width:100%;margin:0 auto}.divider{background-color:var(--color-border-default);display:inline-block}`,f=[`horizontal`,`vertical`],p=class extends c{constructor(...e){super(...e),this.orientation=`horizontal`,this.width=`100%`,this.height=`16`,this.thickness=`1`,this.color=``,this.opacity=``}static{this.styles=[d]}willUpdate(e){e.has(`orientation`)&&!o(f,this.orientation)&&(this.orientation=`horizontal`)}render(){let i=n(this.color),a=r(this.opacity);return this.orientation===`vertical`?s`
        <div
          class="divider"
          style="
            width: ${e(this.thickness)||e(`1`)};
            height: ${t(this.height)};
            ${i?`background-color: ${i};`:``}
            ${a?`opacity: ${a};`:``}
          "
        ></div>
      `:s`
      <hr
        class="hr-line"
        style="
          width: ${this.width};
          ${i?`border-top-color: ${i};`:``}
          ${a?`opacity: ${a};`:``}
        "
      />
    `}};a([u({type:String,reflect:!0})],p.prototype,`orientation`,void 0),a([u({type:String})],p.prototype,`width`,void 0),a([u({type:String})],p.prototype,`height`,void 0),a([u({type:String})],p.prototype,`thickness`,void 0),a([u({type:String})],p.prototype,`color`,void 0),a([u({type:String})],p.prototype,`opacity`,void 0),p=a([i(`bd-divider`)],p);export{p as BdDivider};