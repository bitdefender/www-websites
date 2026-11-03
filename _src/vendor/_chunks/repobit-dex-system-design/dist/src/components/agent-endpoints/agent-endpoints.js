import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import"../paragraph/paragraph.js";import{t as s}from"../shared/ensemble.css.js";import"../button/button.js";import"../icons/arrow-right-icon.js";var c=r`:host{font-family:var(--typography-fontFamily-sans);display:block}.bd-agentendpoints-wrapper{padding-block:var(--spacing-48);box-sizing:border-box}.bd-agentendpoints-eyebrow{margin:0 0 var(--spacing-8);color:var(--color-text-brand);display:block}.bd-agentendpoints-title{margin:0 0 var(--spacing-16);display:block}.bd-agentendpoints-description{margin:0 0 var(--spacing-24);color:var(--color-text-muted);max-width:var(--content-width-readable);display:block}.bd-agentendpoints-row{gap:var(--spacing-12);margin-bottom:var(--spacing-12);flex-wrap:wrap;display:flex}.bd-agentendpoints-row:last-of-type{margin-bottom:0}.bd-agentendpoints-mono{font-family:var(--typography-fontFamily-mono)}.bd-agentendpoints-icon{flex-shrink:0;display:block}@media (width<576px){.bd-agentendpoints-wrapper{padding:var(--spacing-32) var(--spacing-24)}}`,l=class extends n{constructor(...e){super(...e),this.eyebrow=``,this.title=``,this.description=``,this.endpoints=[],this.assistants=[]}static{this.styles=[s,c]}render(){return e`
      <div class="bd-ensemble bd-agentendpoints-wrapper">
        ${this.eyebrow?e`<bd-p variant="eyebrow" class="bd-agentendpoints-eyebrow"><slot name="eyebrow">${this.eyebrow}</slot></bd-p>`:t}

        ${this.title?e`<bd-h as="h2" class="bd-agentendpoints-title"><slot name="title">${this.title}</slot></bd-h>`:t}

        ${this.description?e`<bd-p variant="regular" class="bd-agentendpoints-description"><slot name="description">${this.description}</slot></bd-p>`:t}

        ${this.endpoints&&this.endpoints.length?e`
              <div class="bd-agentendpoints-row">
                ${this.endpoints.map(t=>e`
                    <bd-button-link
                      class="bd-agentendpoints-pill"
                      href=${t.href}
                      target="_blank"
                      size="sm"
                      variant="tertiary"
                    >
                      <bd-arrow-right-icon class="bd-agentendpoints-arrow" size="xs" aria-hidden="true"></bd-arrow-right-icon>
                      <span class="bd-agentendpoints-mono">${t.label}</span>
                    </bd-button-link>
                  `)}
              </div>
            `:t}

        ${this.assistants&&this.assistants.length?e`
              <div class="bd-agentendpoints-row">
                ${this.assistants.map(n=>e`
                    <bd-button-link
                      class="bd-agentendpoints-pill"
                      href=${n.href}
                      target="_blank"
                      size="sm"
                      variant="tertiary"
                      label="${n.label} (opens in new tab)"
                    >
                      ${n.icon?e`<img src=${n.icon} alt="" class="bd-agentendpoints-icon" width="20" height="20" loading="lazy" />`:t}
                      <span>${n.label}</span>
                    </bd-button-link>
                  `)}
              </div>
            `:t}

        <slot name="rows"></slot>
      </div>
    `}};o([i({type:String})],l.prototype,`eyebrow`,void 0),o([i({type:String})],l.prototype,`title`,void 0),o([i({type:String})],l.prototype,`description`,void 0),o([i({type:Array})],l.prototype,`endpoints`,void 0),o([i({type:Array})],l.prototype,`assistants`,void 0),l=o([a(`bd-agent-endpoints`)],l);