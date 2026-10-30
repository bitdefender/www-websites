import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import{t as a}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import{r as o}from"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design8.js";import{t as s}from"../../_chunks/repobit-dex-system-design10.js";var c=e`
  :host {
    display: block;
    font-family: var(--typography-fontFamily-sans);
  }

  .bd-spotlightsection-container {
    /* no role: blue-950 is the gradient's far stop, as on bd-cta-banner. */
    background: linear-gradient(87.6deg, var(--color-surface-brand) 0%, var(--color-brand-950) 100%);
    border-radius: var(--shape-radius-2xl);
    padding: var(--spacing-48);
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    /* justify-content: space-between; */
    gap: var(--spacing-96);
  }

  .bd-spotlightsection-left,
  .bd-spotlightsection-side {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-16);
    flex: 1 1 320px;
    max-width: var(--content-width-readable);
  }

  .bd-spotlightsection-title {
    display: block;
    margin: 0;
    color: var(--color-brand-on-fill);
  }

  .bd-spotlightsection-icon {
    display: flex;
    align-items: center;
    color: var(--color-brand-on-fill);
    margin-bottom: var(--spacing-4);
  }

  /* Collapses to nothing when the corresponding slot has no assigned
     content — see _onSlotChange in spotlight-section.js. */
  .bd-spotlightsection-icon[hidden],
  .bd-spotlightsection-buttons[hidden] {
    display: none;
  }

  /* Left and right icon slots share the exact same sizing/style — the
     left column is a mirror of the right one, not a different layout. */
  .bd-spotlightsection-icon ::slotted(*) {
    display: block;
    /* no token: a logo's width cap, set by the artwork rather than a scale. */
    max-width: 160px;
    width: 100%;
    height: auto;
  }

  .bd-spotlightsection-description {
    margin: 0;
    /* Full inverse ink. White at 65% measured 2.6:1 on the brand end of the
       gradient, and bd-p's color="on-brand" already painted over it. */
    color: var(--color-brand-on-fill);
  }

  .bd-spotlightsection-buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-12);
    margin-top: var(--spacing-4);
  }

  @media ${n(o(`md`))} {
    .bd-spotlightsection-container {
      padding: var(--spacing-28) var(--spacing-24);
      flex-direction: column;
      align-items: flex-start;
    }

    .bd-spotlightsection-left,
    .bd-spotlightsection-side {
      max-width: none;
      flex-basis: auto;
    }
  }

  /* When left-icon is present, the left title shrinks to match the
     default right-column description size — visual emphasis moves to
     the right side instead. */
  .bd-spotlightsection-title--small {
    margin: 0;
  }

  /* Mirror case: the right description grows to the default title size
     when it's the "big" side. */
  .bd-spotlightsection-description--large {
    display: block;
    margin: 0;
    color: var(--color-brand-on-fill);
  }
`,l=class extends i{static properties={title:{type:String},description:{type:String},_hasLeftIcon:{state:!0},_hasLeftButtons:{state:!0},_hasRightIcon:{state:!0},_hasRightButtons:{state:!0}};static styles=[a,s,c];constructor(){super(),this.title=``,this.description=``,this._hasLeftIcon=!1,this._hasLeftButtons=!1,this._hasRightIcon=!1,this._hasRightButtons=!1}_onSlotChange(e,t){let n=t.target.assignedNodes({flatten:!0}).length>0;this[e]!==n&&(this[e]=n)}render(){let e=this._hasLeftIcon;return t`
      <div class="bd-ensemble">
        <div class="bd-spotlightsection-container">
          <div class="bd-spotlightsection-left">
            <div class="bd-spotlightsection-icon" ?hidden=${!this._hasLeftIcon}>
              <slot name="left-icon" @slotchange=${e=>this._onSlotChange(`_hasLeftIcon`,e)}></slot>
            </div>

            ${e?t`
                  <bd-p variant="large" color="on-brand" class="bd-spotlightsection-title bd-spotlightsection-title--small">
                    <slot name="title">${this.title}</slot>
                  </bd-p>
                `:t`
                  <bd-h as="h2" fontWeight="normal" class="bd-spotlightsection-title">
                    <slot name="title">${this.title}</slot>
                  </bd-h>
                `}

            <div class="bd-spotlightsection-buttons" ?hidden=${!this._hasLeftButtons}>
              <slot name="left-buttons" @slotchange=${e=>this._onSlotChange(`_hasLeftButtons`,e)}></slot>
            </div>
          </div>

          <div class="bd-spotlightsection-side">
            <div class="bd-spotlightsection-icon" ?hidden=${!this._hasRightIcon}>
              <slot name="icon" @slotchange=${e=>this._onSlotChange(`_hasRightIcon`,e)}></slot>
            </div>

            ${this.description?e?t`
                    <bd-h as="h2" fontWeight="normal" color="on-brand" class="bd-spotlightsection-description bd-spotlightsection-description--large">
                      <slot name="description">${this.description}</slot>
                    </bd-h>
                  `:t`
                    <bd-p variant="large" color="on-brand" class="bd-spotlightsection-description">
                      <slot name="description">${this.description}</slot>
                    </bd-p>
                  `:r}

            <div class="bd-spotlightsection-buttons" ?hidden=${!this._hasRightButtons}>
              <slot name="right-buttons" @slotchange=${e=>this._onSlotChange(`_hasRightButtons`,e)}></slot>
            </div>
          </div>
        </div>
      </div>
    `}};customElements.define(`bd-spotlight-section`,l);