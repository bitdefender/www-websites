import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{t as i}from"../../../../../lit/decorators.js";import"../shared/token-scales.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../p/p.js";import{t as s}from"../shared/controller.slot.js";import"../h/h.js";import"../link/link.js";import{t as c}from"../shared/ensemble.css.js";import"../badge/badge.js";import"../tag/tag.js";import{t as l}from"../shared/announcer.js";import{codeOf as u}from"./install-option.js";var d=r`:host{font-family:var(--typography-fontFamily-sans);display:block}.bd-installoptions-container{background:var(--status-brand-surface);padding-block:var(--spacing-64);box-sizing:border-box}.bd-installoptions-eyebrow{margin:0 0 var(--spacing-24);color:var(--color-text-brand);font-family:var(--typography-body-regular-fontFamily);font-size:var(--typography-body-regular-fontSize);font-weight:var(--typography-body-regular-fontWeight);line-height:var(--typography-body-regular-lineHeight);letter-spacing:var(--typography-body-regular-letterSpacing)}.bd-installoptions-title{margin:0 0 var(--spacing-16)}.bd-installoptions-title ::slotted([slot=title]),.bd-installoptions-prompt-title ::slotted([slot=prompt-title]){--bd-heading-font-size:var(--typography-heading-h2-fontSize);--bd-heading-font-weight:var(--typography-heading-h2-fontWeight);--bd-heading-line-height:var(--typography-heading-h2-lineHeight);--bd-heading-letter-spacing:var(--typography-heading-h2-letterSpacing);--bd-heading-font-family:var(--typography-heading-h2-fontFamily)}.bd-installoptions-description,.bd-installoptions-prompt-description{max-width:var(--content-width-readable)}.bd-installoptions-description ::slotted([slot=description]),.bd-installoptions-prompt-description ::slotted([slot=prompt-description]){--bd-paragraph-color:var(--color-text-secondary)}.bd-installoptions-description ::slotted(bd-p[slot=description]),.bd-installoptions-prompt-description ::slotted(bd-p[slot=prompt-description]){--bd-paragraph-font-size:var(--typography-body-regular-fontSize);--bd-paragraph-font-weight:var(--typography-body-regular-fontWeight);--bd-paragraph-line-height:var(--typography-body-regular-lineHeight);--bd-paragraph-letter-spacing:var(--typography-body-regular-letterSpacing)}.bd-installoptions-worksin{align-items:center;gap:var(--spacing-16);margin:0 0 var(--spacing-40);flex-wrap:wrap;display:flex}.bd-installoptions-worksin[hidden],.bd-installoptions-pills[hidden],.bd-installoptions-worksin-label[hidden],.bd-installoptions-body[hidden],.bd-installoptions-prompt-label[hidden]{display:none}.bd-installoptions-worksin-label,.bd-installoptions-prompt-label{color:var(--color-text-muted);font-family:var(--typography-fontFamily-mono);font-size:var(--typography-body-xsmall-fontSize);text-transform:uppercase;letter-spacing:.06em;display:block}.bd-installoptions-worksin-label{flex-shrink:0}.bd-installoptions-pills{gap:var(--spacing-12);flex-wrap:wrap;display:flex}.bd-installoptions-body{gap:var(--spacing-24);grid-template-columns:repeat(3,1fr);display:grid}.bd-installoptions-body ::slotted(:not(bd-install-option)){grid-column:1/-1}.bd-installoptions-status{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;margin:-1px;position:absolute;overflow:hidden}.bd-installoptions-copy{top:var(--spacing-12);padding:var(--spacing-4) var(--spacing-10);background:color-mix(in srgb, var(--color-text-inverse) 12%, transparent);color:var(--color-text-inverse);border-radius:var(--shape-radius-sm);font-family:var(--typography-control-label-small-fontFamily);font-size:var(--typography-control-label-small-fontSize);font-weight:var(--typography-control-label-small-fontWeight);line-height:var(--typography-control-label-small-lineHeight);letter-spacing:var(--typography-control-label-small-letterSpacing);cursor:pointer;transition:background var(--transition-duration-fast) var(--transition-easing-smooth);border:none;position:absolute;inset-inline-end:var(--spacing-12)}.bd-installoptions-copy:hover{background:color-mix(in srgb, var(--color-text-inverse) 20%, transparent)}.bd-installoptions-copy:focus-visible{outline:var(--border-width-2) solid var(--color-text-inverse);outline-offset:var(--focus-outline-offset)}.bd-installoptions-promptpanel{margin:var(--spacing-64) 0 0}.bd-installoptions-prompt-title{margin:0 0 var(--spacing-16)}.bd-installoptions-prompt-description{margin:0 0 var(--spacing-24)}.bd-installoptions-prompt-label{margin-bottom:var(--spacing-8)}.bd-installoptions-prompt-code{background:var(--color-surface-inverse);border:var(--border-width-2) solid var(--color-border-brand);border-radius:var(--shape-radius-md);padding:var(--spacing-16);box-sizing:border-box;margin-bottom:var(--spacing-24);padding-inline-end:var(--spacing-64);position:relative}.bd-installoptions-prompt-code-text{color:var(--color-text-inverse);font-family:var(--typography-code-block-fontFamily);font-size:var(--typography-code-block-fontSize);font-weight:var(--typography-code-block-fontWeight);line-height:var(--typography-code-block-lineHeight);letter-spacing:var(--typography-code-block-letterSpacing)}.bd-installoptions-prompt-code-text ::slotted(*){font:inherit;letter-spacing:inherit;color:inherit;margin:0}.bd-installoptions-copy--prompt{top:var(--spacing-12);inset-inline-end:var(--spacing-12)}.bd-installoptions-prompt-note{background:var(--status-warning-surface);border:var(--border-width-1) solid var(--status-warning-border);border-radius:var(--shape-radius-md);padding:var(--spacing-16) var(--spacing-20);color:var(--status-warning-text);font-family:var(--typography-body-small-fontFamily);font-size:var(--typography-body-small-fontSize);font-weight:var(--typography-body-small-fontWeight);line-height:var(--typography-body-small-lineHeight);letter-spacing:var(--typography-body-small-letterSpacing);margin-bottom:var(--spacing-24)}.bd-installoptions-prompt-note ::slotted(*){font:inherit;color:inherit;margin:0}.bd-installoptions-footer{margin-top:var(--spacing-24)}.bd-installoptions-footer ::slotted([slot=footer]){--bd-heading-color:var(--color-text-muted);--bd-paragraph-color:var(--color-text-muted)}.bd-installoptions-footer ::slotted(bd-p[slot=footer]){--bd-paragraph-font-size:var(--typography-body-regular-fontSize);--bd-paragraph-font-weight:var(--typography-body-regular-fontWeight);--bd-paragraph-line-height:var(--typography-body-regular-lineHeight);--bd-paragraph-letter-spacing:var(--typography-body-regular-letterSpacing)}@media (width<992px){.bd-installoptions-body{grid-template-columns:1fr}}`,f=[`prompt-title`,`prompt-description`,`prompt-label`,`prompt`,`prompt-note`],p=class extends n{constructor(...e){super(...e),this._slots=new s(this,{slots:[`eyebrow`,`title`,`description`,`works-in-label`,`works-in`,``,...f,`copy`,`copied`,`footer`]}),this._announcer=new l(this),this._copied=!1,this._busy=!1}static{this.styles=[c,d]}async _copyPrompt(){let e=u(this.renderRoot.querySelector(`slot[name="prompt"]`));if(e&&!this._busy){this._busy=!0;try{await navigator.clipboard.writeText(e),this._copied=!0;let t=this._slots.text(`copied`);t&&this._announcer.say(t),setTimeout(()=>{this._copied=!1,this._busy=!1},1500)}catch{this._busy=!1}}}_renderPromptPanel(){let n=e=>this._slots.has(e),r=n(`prompt-title`),i=this._copied&&this._slots.has(`copied`);return e`
      <div class="bd-installoptions-promptpanel" ?hidden=${!f.some(n)}>
        <div class="bd-installoptions-prompt-title" id="prompt-title" ?hidden=${!r}>
          <slot name="prompt-title"></slot>
        </div>

        <div class="bd-installoptions-prompt-description" ?hidden=${!n(`prompt-description`)}>
          <slot name="prompt-description"></slot>
        </div>

        <div class="bd-installoptions-prompt-label" ?hidden=${!n(`prompt-label`)}>
          <slot name="prompt-label"></slot>
        </div>

        <div class="bd-installoptions-prompt-code" ?hidden=${!n(`prompt`)}>
          <div class="bd-installoptions-prompt-code-text"><slot name="prompt"></slot></div>
          ${n(`prompt`)?e`<button
                type="button"
                class="bd-installoptions-copy bd-installoptions-copy--prompt"
                aria-describedby=${r?`prompt-title`:t}
                @click=${this._copyPrompt}
              ><span ?hidden=${i}><slot name="copy"></slot></span><span ?hidden=${!i}><slot name="copied"></slot></span></button>`:t}
        </div>

        <div class="bd-installoptions-prompt-note" ?hidden=${!n(`prompt-note`)}>
          <slot name="prompt-note"></slot>
        </div>
      </div>
    `}render(){let t=this._slots.has(`works-in`);return e`
      <div class="bd-installoptions-container">
        <div class="bd-ensemble">
          <div class="bd-installoptions-eyebrow" ?hidden=${!this._slots.has(`eyebrow`)}>
            <slot name="eyebrow"></slot>
          </div>

          <div class="bd-installoptions-title" ?hidden=${!this._slots.has(`title`)}>
            <slot name="title"></slot>
          </div>

          <div class="bd-installoptions-description" ?hidden=${!this._slots.has(`description`)}>
            <slot name="description"></slot>
          </div>

          <div class="bd-installoptions-worksin" ?hidden=${!t&&!this._slots.has(`works-in-label`)}>
            <span class="bd-installoptions-worksin-label" ?hidden=${!this._slots.has(`works-in-label`)}>
              <slot name="works-in-label"></slot>
            </span>
            <div class="bd-installoptions-pills" ?hidden=${!t}>
              <slot name="works-in"></slot>
            </div>
          </div>

          <div class="bd-installoptions-body" ?hidden=${!this._slots.has(``)}>
            <slot></slot>
          </div>

          ${this._renderPromptPanel()}

          <div class="bd-installoptions-footer" ?hidden=${!this._slots.has(`footer`)}>
            <slot name="footer"></slot>
          </div>
        </div>
        <span class="bd-installoptions-status" role="status">${this._announcer.status}</span>
      </div>
    `}};o([i()],p.prototype,`_copied`,void 0),p=o([a(`bd-install-options`)],p);export{p as BdInstallOptions};