import{a as e,t,u as n}from"../../../../../lit/index.js";import"../shared/token-scales.js";import{n as r,t as i}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../p/p.js";import{t as a}from"../shared/controller.slot.js";import"../h/h.js";import{t as o}from"../shared/ensemble.css.js";import"../button/button.js";import"../icons/arrow-right.js";import"../img/img.js";import{t as s}from"../shared/adopt-styles.js";var c=n`:where(bd-agent-endpoints)>bd-button[slot=endpoints]::part(button){font-family:var(--typography-fontFamily-mono)}:where(bd-agent-endpoints)>bd-button[slot=endpoints]>bd-icon[slot=start][size=xs]{--bd-icon-size:var(--icon-xs-size)}`,l=n`:host{font-family:var(--typography-fontFamily-sans);display:block}.bd-agentendpoints-wrapper{padding-block:var(--spacing-48);box-sizing:border-box}.bd-agentendpoints-eyebrow{margin:0 0 var(--spacing-8);color:var(--color-text-brand);font-family:var(--typography-label-large-fontFamily);font-size:var(--typography-label-large-fontSize);font-weight:var(--typography-label-large-fontWeight);line-height:var(--typography-label-large-lineHeight);letter-spacing:var(--typography-label-large-letterSpacing)}.bd-agentendpoints-title{margin:0 0 var(--spacing-16)}.bd-agentendpoints-title ::slotted([slot=title]){--bd-heading-font-size:var(--typography-heading-h2-fontSize);--bd-heading-font-weight:var(--typography-heading-h2-fontWeight);--bd-heading-line-height:var(--typography-heading-h2-lineHeight);--bd-heading-letter-spacing:var(--typography-heading-h2-letterSpacing);--bd-heading-font-family:var(--typography-heading-h2-fontFamily)}.bd-agentendpoints-description{margin:0 0 var(--spacing-24);max-width:var(--content-width-readable)}.bd-agentendpoints-description ::slotted([slot=description]){--bd-heading-color:var(--color-text-muted);--bd-paragraph-color:var(--color-text-muted)}.bd-agentendpoints-description ::slotted(bd-p[slot=description]){--bd-paragraph-font-size:var(--typography-body-regular-fontSize);--bd-paragraph-font-weight:var(--typography-body-regular-fontWeight);--bd-paragraph-line-height:var(--typography-body-regular-lineHeight);--bd-paragraph-letter-spacing:var(--typography-body-regular-letterSpacing)}.bd-agentendpoints-rows{gap:var(--spacing-12);flex-direction:column;display:flex}.bd-agentendpoints-row{gap:var(--spacing-12);flex-wrap:wrap;display:flex}.bd-agentendpoints-row[hidden]{display:none}@media (width<992px){.bd-agentendpoints-eyebrow{font-size:var(--typography-label-default-fontSize);font-weight:var(--typography-label-default-fontWeight);line-height:var(--typography-label-default-lineHeight);letter-spacing:var(--typography-label-default-letterSpacing)}}@media (width<576px){.bd-agentendpoints-wrapper{padding:var(--spacing-32) var(--spacing-24)}}`,u=class extends t{constructor(...e){super(...e),this._slots=new a(this,{slots:[`eyebrow`,`title`,`description`,`endpoints`,`assistants`,``]})}static{this.styles=[o,l]}connectedCallback(){super.connectedCallback(),s(this,`bd-agent-endpoints`,c)}render(){return e`
      <div class="bd-ensemble bd-agentendpoints-wrapper">
        <div class="bd-agentendpoints-eyebrow" ?hidden=${!this._slots.has(`eyebrow`)}>
          <slot name="eyebrow"></slot>
        </div>

        <div class="bd-agentendpoints-title" ?hidden=${!this._slots.has(`title`)}>
          <slot name="title"></slot>
        </div>

        <div class="bd-agentendpoints-description" ?hidden=${!this._slots.has(`description`)}>
          <slot name="description"></slot>
        </div>

        <div class="bd-agentendpoints-rows">
          <div class="bd-agentendpoints-row" ?hidden=${!this._slots.has(`endpoints`)}>
            <slot name="endpoints"></slot>
          </div>
          <div class="bd-agentendpoints-row" ?hidden=${!this._slots.has(`assistants`)}>
            <slot name="assistants"></slot>
          </div>
          <div class="bd-agentendpoints-more" ?hidden=${!this._slots.has(``)}>
            <slot></slot>
          </div>
        </div>
      </div>
    `}};u=i([r(`bd-agent-endpoints`)],u);export{u as BdAgentEndpoints};