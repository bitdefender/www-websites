import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../shared/token-scales.js";import"../paragraph/paragraph.js";import"../divider/divider-horizontal.js";var s=r`:host{font-family:var(--typography-fontFamily-sans);display:block}.bd-quickanswer-container{background:var(--status-brand-surface);padding:var(--spacing-32) var(--spacing-28) var(--spacing-32) var(--spacing-28);box-sizing:border-box}.bd-quickanswer-label{color:var(--color-text-brand);margin:0 0 var(--spacing-16)}.bd-quickanswer-text{color:var(--color-text-primary);margin:0}.bd-quickanswer-divider{margin:var(--spacing-24) 0 var(--spacing-16);display:block}.bd-quickanswer-meta{gap:var(--spacing-24);flex-wrap:wrap;display:flex}.bd-quickanswer-meta-item{align-items:baseline;gap:var(--spacing-8);display:inline-flex}.bd-quickanswer-meta-label{color:var(--color-text-muted);font-size:var(--typography-fontSize-xxs);text-transform:uppercase;letter-spacing:.04em;font-family:var(--typography-fontFamily-mono)}.bd-quickanswer-meta-value{color:var(--color-text-primary);font-weight:var(--typography-fontWeight-semibold)}@media (width<576px){.bd-quickanswer-container{padding:var(--spacing-24)}.bd-quickanswer-meta{gap:var(--spacing-12);flex-direction:column}}`,c=class extends n{constructor(...e){super(...e),this.label=`Quick answer`,this.text=``,this.items=[]}static{this.styles=[s]}render(){return e`
      <div class="bd-quickanswer-container">
        ${this.label?e`
              <bd-p variant="regular" font-weight="medium" class="bd-quickanswer-label">
                <slot name="label">${this.label}</slot>
              </bd-p>
            `:t}

        <bd-p variant="large" class="bd-quickanswer-text">
          <slot name="text">${this.text}</slot>
        </bd-p>

        <slot></slot>

        ${this.items&&this.items.length?e`
              <bd-divider-horizontal
                class="bd-quickanswer-divider"
                color="brand-subtle"
                opacity="1"
              ></bd-divider-horizontal>
              <div class="bd-quickanswer-meta">
                ${this.items.map(t=>e`
                    <span class="bd-quickanswer-meta-item">
                      <span class="bd-quickanswer-meta-label">${t.label}</span>
                      <span class="bd-quickanswer-meta-value">${t.value}</span>
                    </span>
                  `)}
              </div>
            `:t}
      </div>
    `}};o([i({type:String})],c.prototype,`label`,void 0),o([i({type:String})],c.prototype,`text`,void 0),o([i({type:Array})],c.prototype,`items`,void 0),c=o([a(`bd-quick-answer`)],c);