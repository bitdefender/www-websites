import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r}from"../../../../../lit/decorators.js";import{_ as i,h as a,r as o,s}from"../shared/token-scales.js";import{n as c,t as l}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as u}from"../shared/prop-vocabulary.js";var d=n`.hr-line{border:none;border-top:var(--border-width-1) solid var(--color-border-container);width:100%;margin:0 auto}.divider{background-color:var(--color-border-default);display:inline-block}`,f=[`horizontal`,`vertical`],p=class extends t{constructor(...e){super(...e),this.orientation=`horizontal`,this.width=`100%`,this.height=`16`,this.thickness=`1`,this.color=``,this.opacity=``}static{this.styles=[d]}willUpdate(e){e.has(`orientation`)&&!u(f,this.orientation)&&(this.orientation=`horizontal`)}render(){let t=o(this.color),n=s(this.opacity);return this.orientation===`vertical`?e`
        <div
          class="divider"
          style="
            width: ${i(this.thickness)||i(`1`)};
            height: ${a(this.height)};
            ${t?`background-color: ${t};`:``}
            ${n?`opacity: ${n};`:``}
          "
        ></div>
      `:e`
      <hr
        class="hr-line"
        style="
          width: ${this.width};
          ${t?`border-top-color: ${t};`:``}
          ${n?`opacity: ${n};`:``}
        "
      />
    `}};l([r({type:String,reflect:!0})],p.prototype,`orientation`,void 0),l([r({type:String})],p.prototype,`width`,void 0),l([r({type:String})],p.prototype,`height`,void 0),l([r({type:String})],p.prototype,`thickness`,void 0),l([r({type:String})],p.prototype,`color`,void 0),l([r({type:String})],p.prototype,`opacity`,void 0),p=l([c(`bd-divider`)],p);export{p as BdDivider};