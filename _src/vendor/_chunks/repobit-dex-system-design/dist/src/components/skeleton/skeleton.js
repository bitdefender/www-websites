import{n as e,t}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{a as n,n as r,t as i,u as a}from"../../../../../lit/index.js";import{n as o}from"../../../../../lit/decorators.js";var s=a`:host{display:block}.bone{background:var(--color-surface-muted);border-radius:var(--shape-radius-sm);height:var(--spacing-16);animation:bd-shimmer var(--transition-duration-slower) var(--transition-easing-smooth) infinite alternate}.bone+.bone{margin-top:var(--spacing-8)}:host([shape=circle]) .bone{width:var(--dimension-40);height:var(--dimension-40);border-radius:var(--radius-full)}:host([shape=title]) .bone{height:var(--spacing-24)}@keyframes bd-shimmer{to{opacity:var(--opacity-pulse)}}@media (prefers-reduced-motion:reduce){.bone{animation:none}}`,c=class extends i{constructor(...e){super(...e),this.lines=1,this.shape=`line`}static{this.styles=[s]}render(){return n`
      <span aria-hidden="true">
        ${Array.from({length:this.lines},(e,t)=>n`<div
          class="bone"
          style=${t===this.lines-1&&this.lines>1?`width: 60%`:r}
        ></div>`)}
      </span>
    `}};t([o({type:Number})],c.prototype,`lines`,void 0),t([o({type:String,reflect:!0})],c.prototype,`shape`,void 0),c=t([e(`bd-skeleton`)],c);export{c as BdSkeleton};