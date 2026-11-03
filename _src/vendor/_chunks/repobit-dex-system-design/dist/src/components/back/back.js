import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../shared/token-scales.js";var s=r`@layer bd-components{.bd-back{all:unset;align-items:center;gap:var(--spacing-8);padding:var(--spacing-12) var(--spacing-16);font-family:var(--typography-fontFamily-sans);font-size:var(--typography-body-regular-fontSize);font-weight:var(--typography-fontWeight-bold);color:var(--color-text-primary);cursor:pointer;border-radius:var(--shape-radius-lg);transition:background-color var(--transition-duration-normal) var(--transition-easing-smooth), color var(--transition-duration-normal) var(--transition-easing-smooth);-webkit-user-select:none;user-select:none;display:inline-flex}.bd-back:hover{background-color:var(--color-surface-muted)}.bd-back:active{background-color:var(--color-surface-pressed);transform:translateY(1px)}.bd-back:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary)}.bd-back-label{line-height:var(--typography-lineHeight-none)}@media (prefers-reduced-motion:reduce){.bd-back{transition:none}.bd-back:active{transform:none}}@media (width<768px){.bd-back{padding:var(--spacing-14) var(--spacing-16);font-size:var(--typography-body-large-fontSize)}}}`,c=class extends n{constructor(...e){super(...e),this.href=``,this.label=`Back`,this.ariaLabel=null}handleClick(){window.history.back()}render(){let n=e`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" class="mi-solid mi-arrow-back" viewBox="0 0 24 24">
  <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1"/>
</svg>
      <span class="bd-back-label">${this.label}</span>`;return this.href?e`
    <a
      class="bd-back"
      href="${this.href}"
      aria-label="${this.ariaLabel??t}"
    >${n}</a>
  `:e`
    <button
      type="button"
      class="bd-back"
      aria-label="${this.ariaLabel??t}"
      @click="${this.handleClick}"
    >${n}</button>
  `}static{this.styles=[s]}};o([i({type:String})],c.prototype,`href`,void 0),o([i({type:String})],c.prototype,`label`,void 0),o([i({type:String,attribute:`aria-label`})],c.prototype,`ariaLabel`,void 0),c=o([a(`bd-back`)],c);export{c as BdBack};