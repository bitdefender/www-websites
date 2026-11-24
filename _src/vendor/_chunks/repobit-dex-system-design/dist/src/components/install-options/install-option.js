import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{t as i}from"../../../../../lit/decorators.js";import"../shared/token-scales.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as s}from"../shared/controller.slot.js";import{t as c}from"../shared/announcer.js";var l=r`:host{font-family:var(--typography-fontFamily-sans);display:block}.card{background:var(--color-surface-default);border:var(--border-width-1) solid var(--color-border-container);border-radius:var(--shape-radius-xl);height:100%;padding:var(--spacing-24);box-sizing:border-box;gap:var(--spacing-12);flex-direction:column;display:flex}.head{justify-content:space-between;align-items:flex-start;gap:var(--spacing-12);display:flex}.head[hidden]{display:none}::slotted([slot=title]){--bd-heading-font-size:var(--typography-heading-h3-fontSize);--bd-heading-font-weight:var(--typography-heading-h3-fontWeight);--bd-heading-line-height:var(--typography-heading-h3-lineHeight);--bd-heading-letter-spacing:var(--typography-heading-h3-letterSpacing);--bd-heading-font-family:var(--typography-heading-h3-fontFamily)}.badge{flex-shrink:0}.description{flex-grow:1}::slotted([slot=description]){--bd-heading-color:var(--color-text-muted);--bd-paragraph-color:var(--color-text-muted)}::slotted(bd-p[slot=description]){--bd-paragraph-font-size:var(--typography-body-small-fontSize);--bd-paragraph-font-weight:var(--typography-body-small-fontWeight);--bd-paragraph-line-height:var(--typography-body-small-lineHeight);--bd-paragraph-letter-spacing:var(--typography-body-small-letterSpacing)}.code{background:var(--color-surface-inverse);border-radius:var(--shape-radius-md);padding:var(--spacing-16);box-sizing:border-box;position:relative}.code-text{color:var(--color-text-inverse);font-family:var(--typography-code-block-fontFamily);font-size:var(--typography-code-block-fontSize);font-weight:var(--typography-code-block-fontWeight);line-height:var(--typography-code-block-lineHeight);letter-spacing:var(--typography-code-block-letterSpacing);white-space:pre-wrap;overflow-wrap:anywhere;margin:0;padding-inline-end:var(--spacing-56)}::slotted([slot=code]){font:inherit;letter-spacing:inherit;color:inherit}.status{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;margin:-1px;position:absolute;overflow:hidden}.copy{top:var(--spacing-12);padding:var(--spacing-4) var(--spacing-10);background:color-mix(in srgb, var(--color-text-inverse) 12%, transparent);color:var(--color-text-inverse);border-radius:var(--shape-radius-sm);font-family:var(--typography-control-label-small-fontFamily);font-size:var(--typography-control-label-small-fontSize);font-weight:var(--typography-control-label-small-fontWeight);line-height:var(--typography-control-label-small-lineHeight);letter-spacing:var(--typography-control-label-small-letterSpacing);cursor:pointer;transition:background var(--transition-duration-fast) var(--transition-easing-smooth);border:none;position:absolute;inset-inline-end:var(--spacing-12)}.copy:hover{background:color-mix(in srgb, var(--color-text-inverse) 20%, transparent)}.copy:focus-visible{outline:var(--border-width-2) solid var(--color-text-inverse);outline-offset:var(--focus-outline-offset)}.actions{margin-top:auto}`,u=e=>e.nodeType===Node.TEXT_NODE?e.data:e.nodeName===`BR`?`
`:e.nodeType===Node.ELEMENT_NODE?[...e.childNodes].map(u).join(``):``,d=e=>(e?.assignedNodes({flatten:!0})??[]).map(u).join(``).trim(),f=class extends n{constructor(...e){super(...e),this._slots=new s(this,{slots:[`title`,`badge`,`description`,`code`,`copy`,`copied`,`actions`]}),this._announcer=new c(this),this._copied=!1,this._busy=!1}static{this.styles=[l]}async _copy(){let e=d(this.renderRoot.querySelector(`slot[name="code"]`));if(e&&!this._busy){this._busy=!0;try{await navigator.clipboard.writeText(e),this._copied=!0;let t=this._slots.text(`copied`);t&&this._announcer.say(t),setTimeout(()=>{this._copied=!1,this._busy=!1},1500)}catch{this._busy=!1}}}render(){let n=this._slots.has(`title`),r=this._slots.has(`badge`),i=this._slots.has(`code`),a=this._copied&&this._slots.has(`copied`);return e`
      <div class="card">
        <div class="head" ?hidden=${!n&&!r}>
          <div class="title" id="title" ?hidden=${!n}><slot name="title"></slot></div>
          <div class="badge" ?hidden=${!r}><slot name="badge"></slot></div>
        </div>

        <div class="description" ?hidden=${!this._slots.has(`description`)}>
          <slot name="description"></slot>
        </div>

        <div class="code" ?hidden=${!i}>
          <pre class="code-text"><slot name="code"></slot></pre>
          ${i?e`<button
                type="button"
                class="copy"
                aria-describedby=${n?`title`:t}
                @click=${this._copy}
              ><span ?hidden=${a}><slot name="copy"></slot></span><span ?hidden=${!a}><slot name="copied"></slot></span></button>`:t}
        </div>

        <div class="actions" ?hidden=${!this._slots.has(`actions`)}>
          <slot name="actions"></slot>
        </div>
      </div>
      <span class="status" role="status">${this._announcer.status}</span>
    `}};o([i()],f.prototype,`_copied`,void 0),f=o([a(`bd-install-option`)],f);export{f as BdInstallOption,d as codeOf};