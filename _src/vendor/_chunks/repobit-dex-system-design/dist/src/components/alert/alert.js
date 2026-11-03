import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i,t as a}from"../../../../../lit/decorators.js";import{n as o,t as s}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{r as c}from"../shared/prop-vocabulary.js";import"../icons/circle-info-icon.js";import"../icons/close-icon.js";var l=r`:host{display:block}:host([hidden]){display:none}.alert{align-items:flex-start;gap:var(--spacing-12);padding:var(--spacing-16);border-radius:var(--shape-radius-lg);font-family:var(--typography-fontFamily-sans);font-size:var(--typography-body-small-fontSize);line-height:var(--typography-body-small-lineHeight);color:var(--color-text-primary);background:var(--status-info-surface);display:flex}.icon{color:var(--status-info-accent);flex:none;display:flex}:host([tone=success]) .alert{background:var(--status-success-surface)}:host([tone=success]) .icon{color:var(--status-success-accent)}:host([tone=warning]) .alert{background:var(--status-warning-surface)}:host([tone=warning]) .icon{color:var(--status-warning-accent)}:host([tone=error]) .alert{background:var(--status-error-surface)}:host([tone=error]) .icon{color:var(--status-error-accent)}:host([tone=neutral]) .alert{background:var(--status-neutral-surface)}:host([tone=neutral]) .icon{color:var(--status-neutral-accent)}:host([variant=outline]) .alert{background:var(--color-surface-default);border:var(--border-width-1) solid var(--color-border-container)}.content{gap:var(--spacing-8);overflow-wrap:break-word;flex-direction:column;flex:auto;min-width:0;display:flex}.title{font-weight:var(--typography-fontWeight-semibold)}.body{min-height:var(--icon-lg-size)}.actions{align-items:center;gap:var(--spacing-12);color:var(--color-text-brand);flex-wrap:wrap;display:flex}.actions[hidden]{display:none}.dismiss{padding:var(--spacing-0);color:var(--color-text-muted);border-radius:var(--focus-outline-radius);cursor:pointer;background:0 0;border:none;flex:none;display:flex;position:relative}.dismiss:before{content:"";inset:calc(-1 * var(--spacing-4));position:absolute}.dismiss:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary)}`,u=[`info`,`success`,`warning`,`error`,`neutral`],d=[`tint`,`outline`],f=class extends n{constructor(...e){super(...e),this.tone=`info`,this.variant=`tint`,this.heading=``,this.dismissible=!1,this.dismisslabel=`Dismiss alert`,this._hasActions=!1}static{this.styles=[l]}willUpdate(e){e.has(`tone`)&&!c(u,this.tone)&&(this.tone=`info`),e.has(`variant`)&&!c(d,this.variant)&&(this.variant=`tint`)}_onActionsSlotChange(e){this._hasActions=e.target.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.ELEMENT_NODE||e.textContent.trim())}_onDismiss(){this.dispatchEvent(new CustomEvent(`bd-dismiss`,{bubbles:!0,composed:!0}))}render(){return e`
      <div class="alert" role=${this.tone===`error`?`alert`:`status`}>
        <span class="icon">
          <slot name="icon">
            <bd-circle-info-icon size="lg"></bd-circle-info-icon>
          </slot>
        </span>

        <div class="content">
          ${this.heading?e`<strong class="title">${this.heading}</strong>`:t}
          <div class="body"><slot></slot></div>
          <div class="actions" ?hidden=${!this._hasActions}>
            <slot name="actions" @slotchange=${this._onActionsSlotChange}></slot>
          </div>
        </div>

        ${this.dismissible?e`
            <button
              class="dismiss"
              type="button"
              aria-label=${this.dismisslabel}
              @click=${this._onDismiss}
            >
              <bd-close-icon size="sm"></bd-close-icon>
            </button>`:t}
      </div>
    `}};s([i({type:String,reflect:!0})],f.prototype,`tone`,void 0),s([i({type:String,reflect:!0})],f.prototype,`variant`,void 0),s([i({type:String})],f.prototype,`heading`,void 0),s([i({type:Boolean,reflect:!0})],f.prototype,`dismissible`,void 0),s([i({type:String})],f.prototype,`dismisslabel`,void 0),s([a()],f.prototype,`_hasActions`,void 0),f=s([o(`bd-alert`)],f);export{f as BdAlert};