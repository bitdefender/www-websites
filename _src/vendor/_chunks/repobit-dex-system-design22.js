import{c as e,i as t,t as n}from"./lit.js";import{t as r}from"./repobit-dex-system-design.js";import{t as i}from"./repobit-dex-system-design4.js";import"./repobit-dex-system-design8.js";var a=class extends i{static defaultSize=`xl`;render(){return t`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 19.5V13c0-4.4 2.2-7.6 6.5-9.2l.9 1.9C7.9 6.9 6.8 8.7 6.6 11H10v8.5H3Zm11 0V13c0-4.4 2.2-7.6 6.5-9.2l.9 1.9c-2.5 1.2-3.6 3-3.8 5.3H21v8.5h-7Z" fill="currentColor"/>
      </svg>
    `}};customElements.define(`bd-quote-icon`,a);var o=e`
  :host {
    display: block;
    height: 100%;
    font-family: var(--typography-fontFamily-sans);
    box-sizing: border-box;
  }

  .bd-review-card {
    background: var(--status-brand-surface);
    border-radius: var(--shape-radius-3xl);
    padding: var(--spacing-28);
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :host([variant="neutral"]) .bd-review-card {
    background: var(--color-surface-container);
  }

  .bd-review-mark {
    display: block;
    color: var(--color-text-brand);
    margin-bottom: var(--spacing-8);
  }

  .bd-review-quote {
    --bd-paragraph-color: var(--color-text-primary);
    margin-bottom: var(--spacing-16);
    flex-grow: 1;
  }

  .bd-review-meta {
    display: flex;
    flex-direction: column;
  }

  .bd-review-source {
    --bd-paragraph-color: var(--color-text-primary);
    margin: 0;
  }

  .bd-review-date {
    color: var(--color-text-muted);
    font-family: var(--typography-body-small-fontFamily);
    font-size: var(--typography-body-small-fontSize);
    font-weight: var(--typography-body-small-fontWeight);
    line-height: var(--typography-body-small-lineHeight);
    letter-spacing: var(--typography-body-small-letterSpacing);
  }
`,s=class extends n{static properties={variant:{type:String,reflect:!0}};static styles=[r,o];constructor(){super(),this._internals=this.attachInternals(),this.variant=`tint`}connectedCallback(){super.connectedCallback(),this._internals.role=this.parentElement?.localName===`bd-review-grid`?`listitem`:null}render(){return t`
      <div class="bd-review-card">
        <bd-quote-icon class="bd-review-mark" size="xl"></bd-quote-icon>

        <bd-p variant="regular" class="bd-review-quote">
          <slot name="quote"></slot>
        </bd-p>

        <div class="bd-review-meta">
          <bd-p variant="small" font-weight="bold" class="bd-review-source"><slot name="source"></slot></bd-p>
          <span class="bd-review-date"><slot name="date"></slot></span>
        </div>
      </div>
    `}};customElements.define(`bd-review`,s);