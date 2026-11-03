import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import"../paragraph/paragraph.js";import{t as s}from"../shared/ensemble.css.js";import"../link/link.js";import{t as c}from"../shared/announcer.js";var l=r`:host{font-family:var(--typography-fontFamily-sans);display:block}.bd-installoptions-container{background:var(--status-brand-surface);padding-block:var(--spacing-64);box-sizing:border-box}.bd-installoptions-eyebrow{color:var(--color-text-brand);margin:0 0 var(--spacing-24)}.bd-installoptions-title{margin:0 0 var(--spacing-16);color:var(--color-text-primary)}.bd-installoptions-description{color:var(--color-text-secondary);max-width:var(--content-width-readable)}.bd-installoptions-worksin{align-items:center;gap:var(--spacing-16);margin:0 0 var(--spacing-40);flex-wrap:wrap;display:flex}.bd-installoptions-worksin-label{color:var(--color-text-subtle);font-family:var(--typography-fontFamily-mono);font-size:var(--typography-body-xsmall-fontSize);text-transform:uppercase;letter-spacing:.06em;flex-shrink:0}.bd-installoptions-pills{gap:var(--spacing-12);flex-wrap:wrap;display:flex}.bd-installoptions-pill{align-items:center;gap:var(--spacing-8);padding:var(--spacing-8) var(--spacing-16);background:var(--color-surface-default);border:var(--border-width-1) solid var(--color-border-subtle);border-radius:var(--radius-full);font-family:var(--typography-label-default-fontFamily);font-size:var(--typography-label-default-fontSize);font-weight:var(--typography-label-default-fontWeight);line-height:var(--typography-label-default-lineHeight);letter-spacing:var(--typography-label-default-letterSpacing);color:var(--color-text-primary);display:inline-flex}.bd-installoptions-pill-icon{width:var(--dimension-20);height:var(--dimension-20);border-radius:var(--shape-radius-md);color:var(--color-text-inverse);font-size:var(--typography-fontSize-xxs);font-weight:var(--typography-fontWeight-bold);flex-shrink:0;justify-content:center;align-items:center;display:inline-flex}.bd-installoptions-grid{gap:var(--spacing-24);grid-template-columns:repeat(3,1fr);display:grid}.bd-installoptions-card{background:var(--color-surface-default);border:var(--border-width-1) solid var(--color-border-container);border-radius:var(--shape-radius-xl);padding:var(--spacing-24);box-sizing:border-box;gap:var(--spacing-12);flex-direction:column;display:flex}.bd-installoptions-card-head{justify-content:space-between;align-items:flex-start;gap:var(--spacing-12);display:flex}.bd-installoptions-card-title{color:var(--color-text-primary);margin:0}.bd-installoptions-badge{padding:var(--spacing-4) var(--spacing-8);background:var(--status-brand-surface);color:var(--status-brand-text);border-radius:var(--shape-radius-md);font-family:var(--typography-label-extra-small-fontFamily);font-size:var(--typography-label-extra-small-fontSize);font-weight:var(--typography-label-extra-small-fontWeight);line-height:var(--typography-label-extra-small-lineHeight);letter-spacing:var(--typography-label-extra-small-letterSpacing);text-transform:uppercase;white-space:nowrap;flex-shrink:0}.bd-installoptions-card-description{color:var(--color-text-muted);flex-grow:1;margin:0}.bd-installoptions-code{background:var(--color-surface-inverse);border-radius:var(--shape-radius-md);padding:var(--spacing-16);box-sizing:border-box;position:relative}.bd-installoptions-code-text{color:var(--color-text-inverse);font-family:var(--typography-code-block-fontFamily);font-size:var(--typography-code-block-fontSize);font-weight:var(--typography-code-block-fontWeight);line-height:var(--typography-code-block-lineHeight);letter-spacing:var(--typography-code-block-letterSpacing);white-space:pre-wrap;overflow-wrap:anywhere;margin:0;padding-inline-end:var(--spacing-56)}.bd-installoptions-status{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;margin:-1px;position:absolute;overflow:hidden}.bd-installoptions-copy{top:var(--spacing-12);padding:var(--spacing-4) var(--spacing-10);background:color-mix(in srgb, var(--color-text-inverse) 12%, transparent);color:var(--color-text-inverse);border-radius:var(--shape-radius-sm);font-family:var(--typography-control-label-small-fontFamily);font-size:var(--typography-control-label-small-fontSize);font-weight:var(--typography-control-label-small-fontWeight);line-height:var(--typography-control-label-small-lineHeight);letter-spacing:var(--typography-control-label-small-letterSpacing);cursor:pointer;transition:background var(--transition-duration-fast) var(--transition-easing-smooth);border:none;position:absolute;inset-inline-end:var(--spacing-12)}.bd-installoptions-copy:hover{background:color-mix(in srgb, var(--color-text-inverse) 20%, transparent)}.bd-installoptions-copy:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary)}.bd-installoptions-card-link{margin-top:auto}.bd-installoptions-promptpanel{margin:var(--spacing-64) 0 0}.bd-installoptions-prompt-title{margin:0 0 var(--spacing-16);color:var(--color-text-primary)}.bd-installoptions-prompt-description{color:var(--color-text-secondary);max-width:var(--content-width-readable);margin:0 0 var(--spacing-24)}.bd-installoptions-prompt-label{color:var(--color-text-subtle);font-family:var(--typography-fontFamily-mono);font-size:var(--typography-body-xsmall-fontSize);text-transform:uppercase;letter-spacing:.06em;margin-bottom:var(--spacing-8);display:block}.bd-installoptions-prompt-code{background:var(--color-surface-inverse);border:var(--border-width-2) solid var(--color-border-brand);border-radius:var(--shape-radius-md);padding:var(--spacing-16);box-sizing:border-box;margin-bottom:var(--spacing-24);padding-inline-end:var(--spacing-64);position:relative}.bd-installoptions-prompt-code-text{color:var(--color-text-inverse);font-family:var(--typography-code-block-fontFamily);font-size:var(--typography-code-block-fontSize);font-weight:var(--typography-code-block-fontWeight);line-height:var(--typography-code-block-lineHeight);letter-spacing:var(--typography-code-block-letterSpacing)}.bd-installoptions-prompt-code-text ::slotted(*){font:inherit;color:inherit;margin:0}.bd-installoptions-copy--prompt{top:var(--spacing-12);inset-inline-end:var(--spacing-12)}.bd-installoptions-prompt-note{background:var(--status-warning-surface);border:var(--border-width-1) solid var(--status-warning-border);border-radius:var(--shape-radius-md);padding:var(--spacing-16) var(--spacing-20);color:var(--status-warning-text);font-family:var(--typography-body-small-fontFamily);font-size:var(--typography-body-small-fontSize);font-weight:var(--typography-body-small-fontWeight);line-height:var(--typography-body-small-lineHeight);letter-spacing:var(--typography-body-small-letterSpacing);margin-bottom:var(--spacing-24)}.bd-installoptions-prompt-note ::slotted(*){font:inherit;color:inherit;margin:0}.bd-installoptions-prompt-footer{color:var(--color-text-muted);margin:0}@media (width<992px){.bd-installoptions-grid{grid-template-columns:1fr}}`,u=class extends n{static{this.styles=[s,l]}constructor(){super(),this.eyebrow=``,this.title=``,this.description=``,this.worksIn=[],this.cards=[],this.promptPanel=!1,this.promptLabel=``,this._announcer=new c(this)}async _copy(e,t){if(!(`copied`in t.dataset)){t.dataset.copied=``;try{await navigator.clipboard.writeText(e);let n=t.textContent;t.textContent=`Copied`,this._announcer.say(`Copied`),setTimeout(()=>{t.textContent=n,delete t.dataset.copied},1500)}catch{delete t.dataset.copied}}}async _copyPromptSlot(e){let t=((this.renderRoot?.querySelector(`slot[name="prompt"]`))?.assignedNodes({flatten:!0})||[]).map(e=>e.textContent||``).join(``).trim();t&&this._copy(t,e)}_renderWorksIn(){return this.worksIn.length?e`
      <div class="bd-installoptions-worksin">
        <span class="bd-installoptions-worksin-label">Works in</span>
        <div class="bd-installoptions-pills">
          ${this.worksIn.map(({label:t,initial:n,color:r})=>e`
              <span class="bd-installoptions-pill">
                <span
                  class="bd-installoptions-pill-icon"
                  style="background:${r||`var(--color-neutral-800)`}"
                  aria-hidden="true"
                >${n||t?.[0]||`?`}</span>
                ${t}
              </span>
            `)}
        </div>
      </div>
    `:t}_renderCard(n,r){let i=`bd-installoptions-card-title-${r}`;return e`
      <div class="bd-installoptions-card">
        <div class="bd-installoptions-card-head">
          <bd-h as="h3" id=${i} class="bd-installoptions-card-title">${n.title}</bd-h>
          ${n.badge?e`<span class="bd-installoptions-badge">${n.badge}</span>`:t}
        </div>

        ${n.description?e`<bd-p variant="small" class="bd-installoptions-card-description">${n.description}</bd-p>`:t}

        ${n.code?e`
              <div class="bd-installoptions-code">
                <pre class="bd-installoptions-code-text">${n.code}</pre>
                <button
                  type="button"
                  class="bd-installoptions-copy"
                  aria-describedby=${i}
                  @click=${e=>this._copy(n.code,e.currentTarget)}
                >Copy</button>
              </div>
            `:t}

        ${n.linkLabel?e`
              <bd-link href=${n.linkHref||`#`} variant="primary" class="bd-installoptions-card-link">
                ${n.linkLabel} →
              </bd-link>
            `:t}
      </div>
    `}_renderPromptPanel(){return this.promptPanel?e`
      <div class="bd-installoptions-promptpanel">
        <bd-h as="h2" id="bd-installoptions-prompt-title" class="bd-installoptions-prompt-title">
          <slot name="prompt-title"></slot>
        </bd-h>

        <bd-p variant="regular" class="bd-installoptions-prompt-description">
          <slot name="prompt-description"></slot>
        </bd-p>

        ${this.promptLabel?e`<span class="bd-installoptions-prompt-label">${this.promptLabel}</span>`:t}

        <div class="bd-installoptions-prompt-code">
          <div class="bd-installoptions-prompt-code-text">
            <slot name="prompt"></slot>
          </div>
          <button
            type="button"
            class="bd-installoptions-copy bd-installoptions-copy--prompt"
            aria-describedby="bd-installoptions-prompt-title"
            @click=${e=>this._copyPromptSlot(e.currentTarget)}
          >Copy</button>
        </div>

        <div class="bd-installoptions-prompt-note">
          <slot name="prompt-note"></slot>
        </div>

        <bd-p variant="regular" class="bd-installoptions-prompt-footer">
          <slot name="prompt-footer"></slot>
        </bd-p>
      </div>
    `:t}render(){return e`
      <div class="bd-installoptions-container">
        <div class="bd-ensemble">
          ${this.eyebrow?e`<bd-p variant="regular" class="bd-installoptions-eyebrow">${this.eyebrow}</bd-p>`:t}

          <bd-h as="h2" class="bd-installoptions-title">${this.title}</bd-h>

          ${this.description?e`<bd-p variant="regular" class="bd-installoptions-description">${this.description}</bd-p>`:t}

          ${this._renderWorksIn()}

          <!--
            Slot generic (fara nume) -- pentru orice continut care nu se
            potriveste cu grid-ul fix de carduri (ex: un tabel, o casuta
            checklist, o nota de avertizare). Cardurile ramase implicite
            (this.cards) tot se randeaza mai jos daca sunt pasate; cele doua
            pot coexista sau poti folosi doar unul din ele.
          -->
          <div class="bd-installoptions-body">
            <slot></slot>
          </div>

          ${this.cards.length?e`
                <div class="bd-installoptions-grid">
                  ${this.cards.map((e,t)=>this._renderCard(e,t))}
                </div>
              `:t}

          ${this._renderPromptPanel()}
        </div>
        <span class="bd-installoptions-status" role="status">${this._announcer.status}</span>
      </div>
    `}};o([i({type:String})],u.prototype,`eyebrow`,void 0),o([i({type:String})],u.prototype,`title`,void 0),o([i({type:String})],u.prototype,`description`,void 0),o([i({type:Array})],u.prototype,`worksIn`,void 0),o([i({type:Array})],u.prototype,`cards`,void 0),o([i({type:Boolean,reflect:!0,attribute:`prompt-panel`})],u.prototype,`promptPanel`,void 0),o([i({type:String,attribute:`prompt-label`})],u.prototype,`promptLabel`,void 0),u=o([a(`bd-install-options`)],u);