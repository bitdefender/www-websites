import{c as e,i as t,l as n,t as r}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import{r as i}from"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design8.js";import{t as a}from"../../_chunks/repobit-dex-system-design10.js";import"../../_chunks/repobit-dex-system-design11.js";import"../../_chunks/repobit-dex-system-design19.js";var o=e`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .bd-features-tab-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-64);
    width: 100%;
    /* slow, not 350ms: a 50ms difference nobody chose, on a one-shot
       entrance that is not repeated. */
    animation: bd-fade-slide-right var(--transition-duration-slow) var(--transition-easing-ease) forwards;
  }

  .bd-features-tab-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-24);
  }

  .bd-features-tab-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-8);
  }

  .bd-features-tab-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ::slotted([slot="heading"]) {
    margin: 0;
  }

  ::slotted([slot="media"]) {
    width: 100%;
    max-width: 520px;
    height: auto;
    border-radius: var(--shape-radius-lg);
    display: block;
  }

  /* The entrance is skipped rather than shortened. Its first frame is
     opacity 0 and a 24px offset, so under reduced motion the container simply
     renders where it belongs, fully opaque: it declares no opacity of its own,
     and none is what the keyframes stop supplying. Content is present
     immediately rather than waiting to be revealed. */
  @media (prefers-reduced-motion: reduce) {
    .bd-features-tab-container {
      animation: none;
    }
  }

  @keyframes bd-fade-slide-right {
    from {
      opacity: 0;
      transform: translateX(24px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media ${n(i(`lg`))} {
    .bd-features-tab-container {
      flex-direction: column-reverse;
      gap: var(--spacing-32);
    }

    .bd-features-tab-container.bd-features-tab-reverse {
      flex-direction: column-reverse;
    }

    .bd-features-tab-left {
      align-items: center;
      text-align: center;
    }

    ::slotted([slot="media"]) {
      max-width: 100%;
    }
  }

  @media ${n(i(`sm`))} {
    .bd-features-tab-container {
      gap: var(--spacing-24);
    }
  }
`,s=class extends r{static properties={ctaLabel:{type:String,attribute:`cta-label`},ctaHref:{type:String,attribute:`cta-href`},ctaKind:{type:String,attribute:`cta-kind`},ctaSize:{type:String,attribute:`cta-size`},reverse:{type:Boolean,reflect:!0}};static styles=[a,o];constructor(){super(),this.ctaLabel=``,this.ctaHref=`#`,this.ctaKind=`danger`,this.ctaSize=``,this.reverse=!1}render(){let e=this.querySelector(`[slot='cta']`),n=this.querySelector(`[slot='media']`),r=t`
      <div class="bd-features-tab-left">
        <slot name="heading"></slot>
        <div class="bd-features-tab-content">
          <slot name="content"></slot>
        </div>
        ${e?t`<slot name="cta"></slot>`:this.ctaLabel?t`
                <bd-button-link
                  href="${this.ctaHref}"
                  variant="${this.ctaKind}"
                  size="${this.ctaSize}"
                  label="${this.ctaLabel}"
                >
                  ${this.ctaLabel}
                </bd-button-link>`:``}
      </div>
    `,i=t`
      <div class="bd-features-tab-right">
        ${n?t`<slot name="media"></slot>`:``}
      </div>
    `;return t`
      <div class="bd-ensemble bd-features-tab-container ${this.reverse?`bd-features-tab-reverse`:``}">
        ${this.reverse?t`${i}${r}`:t`${r}${i}`}
      </div>
    `}};customElements.define(`bd-features-tab`,s);