import{a as e,t,u as n}from"../../../../../lit/index.js";import"../shared/token-scales.js";import{n as r,t as i}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../p/p.js";import{t as a}from"../shared/controller.slot.js";import"../divider/divider.js";import"../fact/fact.js";var o=n`:host{font-family:var(--typography-fontFamily-sans);display:block}.bd-quickanswer-container{background:var(--status-brand-surface);padding:var(--spacing-32) var(--spacing-28) var(--spacing-32) var(--spacing-28);box-sizing:border-box}.bd-quickanswer-container [hidden]{display:none}.bd-quickanswer-eyebrow{margin:0 0 var(--spacing-16);color:var(--color-text-brand);font-size:var(--typography-label-large-fontSize);font-weight:var(--typography-label-large-fontWeight);line-height:var(--typography-label-large-lineHeight);letter-spacing:var(--typography-label-large-letterSpacing);font-family:var(--typography-label-large-fontFamily)}.bd-quickanswer-text{margin:0}.bd-quickanswer-divider{margin:var(--spacing-24) 0 var(--spacing-16);display:block}.bd-quickanswer-meta{gap:var(--spacing-24);flex-wrap:wrap;display:flex}@media (width<576px){.bd-quickanswer-container{padding:var(--spacing-24)}.bd-quickanswer-meta{gap:var(--spacing-12);flex-direction:column}}`,s=class extends t{constructor(...e){super(...e),this._slots=new a(this,{slots:[`eyebrow`,`description`,``,`facts`]})}static{this.styles=[o]}render(){let t=e=>this._slots.has(e);return e`
      <div class="bd-quickanswer-container">
        <div class="bd-quickanswer-eyebrow" ?hidden=${!t(`eyebrow`)}><slot name="eyebrow"></slot></div>
        <div class="bd-quickanswer-text" ?hidden=${!t(`description`)}><slot name="description"></slot></div>
        <div class="bd-quickanswer-content" ?hidden=${!t(``)}><slot></slot></div>
        <bd-divider
          orientation="horizontal"
          class="bd-quickanswer-divider"
          color="brand-subtle"
          opacity="1"
          ?hidden=${!t(`facts`)}
        ></bd-divider>
        <div class="bd-quickanswer-meta" ?hidden=${!t(`facts`)}><slot name="facts"></slot></div>
      </div>
    `}};s=i([r(`bd-quick-answer`)],s);export{s as BdQuickAnswer};