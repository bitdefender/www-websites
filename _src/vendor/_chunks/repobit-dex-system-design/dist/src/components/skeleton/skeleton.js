import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";var s=r`:host{display:block}.bone{background:var(--color-surface-muted);border-radius:var(--shape-radius-sm);height:var(--spacing-16);animation:bd-shimmer var(--transition-duration-slower) var(--transition-easing-smooth) infinite alternate}.bone+.bone{margin-top:var(--spacing-8)}:host([shape=circle]) .bone{width:var(--dimension-40);height:var(--dimension-40);border-radius:var(--radius-full)}:host([shape=title]) .bone{height:var(--spacing-24)}@keyframes bd-shimmer{to{opacity:var(--opacity-pulse)}}@media (prefers-reduced-motion:reduce){.bone{animation:none}}`,c=class extends n{constructor(...e){super(...e),this.lines=1,this.shape=`line`}static{this.styles=[s]}render(){return e`
      <span aria-hidden="true">
        ${Array.from({length:this.lines},(n,r)=>e`<div
          class="bone"
          style=${r===this.lines-1&&this.lines>1?`width: 60%`:t}
        ></div>`)}
      </span>
    `}};o([i({type:Number})],c.prototype,`lines`,void 0),o([i({type:String,reflect:!0})],c.prototype,`shape`,void 0),c=o([a(`bd-skeleton`)],c);export{c as BdSkeleton};