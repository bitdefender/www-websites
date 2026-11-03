import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../icons/minus-icon.js";import"../icons/plus-icon.js";var s=r`.show-more-toggle{justify-content:center;align-items:center;gap:var(--spacing-8);color:var(--color-text-brand);cursor:pointer;font-size:var(--typography-fontSize-lg);text-align:center;font-family:var(--typography-fontFamily-sans);font-weight:var(--typography-fontWeight-semibold);background:0 0;border:none;margin:1rem auto;display:flex}.feature-items{flex-direction:column;gap:.5rem;display:flex}`,c=class extends n{constructor(...e){super(...e),this.expanded=!1}static{this.styles=[s]}toggleFeatures(){this.expanded=!this.expanded}render(){return e`
      <button
        @click="${this.toggleFeatures}"
        class="show-more-toggle"
        aria-expanded="${this.expanded}"
        aria-controls="${this.expanded?`feature-items`:t}"
      >
        ${this.expanded?e`<bd-minus-icon aria-hidden="true"></bd-minus-icon>Hide features`:e`<bd-plus-icon aria-hidden="true"></bd-plus-icon>Show more features`}
      </button>
      ${this.expanded?e`<div id="feature-items" class="feature-items"><slot></slot></div>`:``}
    `}};o([i({type:Boolean})],c.prototype,`expanded`,void 0),c=o([a(`pricing-card-show-more`)],c);