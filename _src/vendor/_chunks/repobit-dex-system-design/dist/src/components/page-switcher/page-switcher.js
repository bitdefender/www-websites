import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as s}from"../shared/ensemble.css.js";import"../link/link.js";import"../icons/bd-ai-icon.js";var c=r`:host{z-index:var(--z-sticky);background:var(--color-surface-default);border-bottom:var(--border-width-1) solid var(--color-border-container);display:block;position:sticky;top:0}.inner{padding-block:var(--spacing-16);box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--spacing-16) var(--spacing-32);flex-wrap:wrap;display:flex}.logo{font-size:var(--typography-fontSize-lg);font-weight:var(--typography-fontWeight-semibold);color:var(--color-text-primary)}nav{align-items:center;gap:var(--spacing-16) var(--spacing-32);flex-wrap:wrap;display:flex}.page-link{font-size:var(--typography-body-regular-fontSize);font-family:var(--typography-body-regular-fontFamily);display:inline-block;position:relative}.page-link::part(link){padding:var(--spacing-10) var(--spacing-0)}.page-link:after{content:"";left:var(--spacing-0);bottom:calc(-1 * var(--spacing-16));transform-origin:0;width:100%;height:var(--indicator-underline-height);background-color:var(--indicator-color);transition:scale var(--indicator-underline-duration) var(--indicator-underline-easing);position:absolute;scale:0 1}.page-link:dir(rtl):after{transform-origin:100%}.page-link[current]:after{scale:1}@media (prefers-reduced-motion:reduce){.page-link:after{transition:none!important}}@media (forced-colors:active){.page-link:after{forced-color-adjust:none;background-color:highlight}}`,l=class extends n{constructor(...e){super(...e),this.items=[]}static{this.styles=[s,c]}render(){return e`
      <div class="bd-ensemble inner">
        <bd-ai-icon class="logo" width="200" height="24"></bd-ai-icon>

        <nav aria-label="Product navigation">
          ${this.items.map(({title:n,href:r,active:i})=>e`
            <bd-link
              href=${r}
              variant="primary"
              no-underline
              current=${i?`page`:t}
              class="page-link"
            >${n||t}</bd-link>
          `)}
        </nav>
      </div>
    `}};o([i({type:Array})],l.prototype,`items`,void 0),l=o([a(`bd-page-switcher`)],l);