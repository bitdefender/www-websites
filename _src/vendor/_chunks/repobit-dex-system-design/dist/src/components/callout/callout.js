import{n as e,t}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import{t as n}from"../shared/prop-vocabulary.js";import{t as r}from"../shared/controller.slot.js";import"../icons/close.js";import{a as i,n as a,t as o,u as s}from"../../../../../lit/index.js";import"../icons/circle-info.js";import{n as c}from"../../../../../lit/decorators.js";var l=s`:host{display:block}:host([hidden]){display:none}.callout{align-items:flex-start;gap:var(--spacing-12);padding:var(--spacing-16);border-radius:var(--shape-radius-lg);font-family:var(--typography-fontFamily-sans);font-size:var(--typography-body-small-fontSize);line-height:var(--typography-body-small-lineHeight);color:var(--color-text-primary);background:var(--status-info-surface);display:flex}.icon{color:var(--status-info-accent);flex:none;display:flex}:host([variant=success]) .callout{background:var(--status-success-surface)}:host([variant=success]) .icon{color:var(--status-success-accent)}:host([variant=warning]) .callout{background:var(--status-warning-surface)}:host([variant=warning]) .icon{color:var(--status-warning-accent)}:host([variant=error]) .callout{background:var(--status-error-surface)}:host([variant=error]) .icon{color:var(--status-error-accent)}:host([variant=neutral]) .callout{background:var(--status-neutral-surface)}:host([variant=neutral]) .icon{color:var(--status-neutral-accent)}:host([appearance=outline]) .callout{background:var(--color-surface-default);border:var(--border-width-1) solid var(--color-border-container)}.content{gap:var(--spacing-8);overflow-wrap:break-word;flex-direction:column;flex:auto;min-width:0;display:flex}.title{font-weight:var(--typography-fontWeight-semibold)}.title[hidden]{display:none}.body{min-height:var(--icon-lg-size)}.actions{align-items:center;gap:var(--spacing-12);color:var(--color-text-brand);flex-wrap:wrap;display:flex}.actions[hidden]{display:none}.dismiss{padding:var(--spacing-0);color:var(--color-text-muted);border-radius:var(--focus-outline-radius);cursor:pointer;background:0 0;border:none;flex:none;display:flex;position:relative}.dismiss:before{content:"";inset:calc(-1 * var(--spacing-4));position:absolute}.dismiss:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary)}`,u=[`info`,`success`,`warning`,`error`,`neutral`],d=[`tint`,`outline`],f=class extends o{constructor(...e){super(...e),this.variant=`info`,this.appearance=`tint`,this.dismissible=!1,this.dismissLabel=`Dismiss`,this._slots=new r(this,{slots:[`title`,`actions`]})}static{this.styles=[l]}willUpdate(e){e.has(`variant`)&&!n(u,this.variant)&&(this.variant=`info`),e.has(`appearance`)&&!n(d,this.appearance)&&(this.appearance=`tint`)}_onDismiss(){this.dispatchEvent(new CustomEvent(`bd-dismiss`,{bubbles:!0,composed:!0}))}render(){return i`
      <div class="callout" role=${this.variant===`error`?`alert`:`status`}>
        <span class="icon">
          <slot name="icon">
            <bd-icon name="circle-info" size="lg"></bd-icon>
          </slot>
        </span>

        <div class="content">
          <strong class="title" ?hidden=${!this._slots.has(`title`)}><slot name="title"></slot></strong>
          <div class="body"><slot></slot></div>
          <div class="actions" ?hidden=${!this._slots.has(`actions`)}>
            <slot name="actions"></slot>
          </div>
        </div>

        ${this.dismissible?i`
            <button
              class="dismiss"
              type="button"
              aria-label=${this.dismissLabel}
              @click=${this._onDismiss}
            >
              <bd-icon name="close" size="sm"></bd-icon>
            </button>`:a}
      </div>
    `}};t([c({type:String,reflect:!0})],f.prototype,`variant`,void 0),t([c({type:String,reflect:!0})],f.prototype,`appearance`,void 0),t([c({type:Boolean,reflect:!0})],f.prototype,`dismissible`,void 0),t([c({type:String,attribute:`dismiss-label`})],f.prototype,`dismissLabel`,void 0),f=t([e(`bd-callout`)],f);export{f as BdCallout};