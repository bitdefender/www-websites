import{a as e,l as t,n,t as r}from"../../_chunks/lit.js";import{n as i,t as a}from"../../_chunks/lit2.js";import{n as o,t as s}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design4.js";import"../../_chunks/repobit-dex-system-design8.js";import{t as c}from"../../_chunks/repobit-dex-system-design9.js";var l=t`:host{font-family:var(--typography-fontFamily-sans);display:block}.bd-spotlightsection-container{background:linear-gradient(87.6deg, var(--color-surface-brand) 0%, var(--color-brand-950) 100%);border-radius:var(--shape-radius-2xl);padding:var(--spacing-48);box-sizing:border-box;align-items:center;gap:var(--spacing-96);flex-wrap:wrap;display:flex}.bd-spotlightsection-left,.bd-spotlightsection-side{align-items:flex-start;gap:var(--spacing-16);max-width:var(--content-width-readable);flex-direction:column;flex:320px;display:flex}.bd-spotlightsection-title{color:var(--color-brand-on-fill);margin:0;display:block}.bd-spotlightsection-icon{color:var(--color-brand-on-fill);margin-bottom:var(--spacing-4);align-items:center;display:flex}.bd-spotlightsection-icon[hidden],.bd-spotlightsection-buttons[hidden]{display:none}.bd-spotlightsection-icon ::slotted(*){width:100%;max-width:160px;height:auto;display:block}.bd-spotlightsection-description{color:var(--color-brand-on-fill);margin:0}.bd-spotlightsection-buttons{align-items:center;gap:var(--spacing-12);margin-top:var(--spacing-4);flex-wrap:wrap;display:flex}@media (width<768px){.bd-spotlightsection-container{padding:var(--spacing-28) var(--spacing-24);flex-direction:column;align-items:flex-start}.bd-spotlightsection-left,.bd-spotlightsection-side{flex-basis:auto;max-width:none}}.bd-spotlightsection-title--small{margin:0}.bd-spotlightsection-description--large{color:var(--color-brand-on-fill);margin:0;display:block}`,u=class extends r{constructor(...e){super(...e),this.title=``,this.description=``,this._hasLeftIcon=!1,this._hasLeftButtons=!1,this._hasRightIcon=!1,this._hasRightButtons=!1}static{this.styles=[c,l]}_onSlotChange(e,t){let n=t.target.assignedNodes({flatten:!0}).length>0;this[e]!==n&&(this[e]=n)}render(){let t=this._hasLeftIcon;return e`
      <div class="bd-ensemble">
        <div class="bd-spotlightsection-container">
          <div class="bd-spotlightsection-left">
            <div class="bd-spotlightsection-icon" ?hidden=${!this._hasLeftIcon}>
              <slot name="left-icon" @slotchange=${e=>this._onSlotChange(`_hasLeftIcon`,e)}></slot>
            </div>

            ${t?e`
                  <bd-p variant="large" color="on-brand" class="bd-spotlightsection-title bd-spotlightsection-title--small">
                    <slot name="title">${this.title}</slot>
                  </bd-p>
                `:e`
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

            ${this.description?t?e`
                    <bd-h as="h2" fontWeight="normal" color="on-brand" class="bd-spotlightsection-description bd-spotlightsection-description--large">
                      <slot name="description">${this.description}</slot>
                    </bd-h>
                  `:e`
                    <bd-p variant="large" color="on-brand" class="bd-spotlightsection-description">
                      <slot name="description">${this.description}</slot>
                    </bd-p>
                  `:n}

            <div class="bd-spotlightsection-buttons" ?hidden=${!this._hasRightButtons}>
              <slot name="right-buttons" @slotchange=${e=>this._onSlotChange(`_hasRightButtons`,e)}></slot>
            </div>
          </div>
        </div>
      </div>
    `}};s([i({type:String})],u.prototype,`title`,void 0),s([i({type:String})],u.prototype,`description`,void 0),s([a()],u.prototype,`_hasLeftIcon`,void 0),s([a()],u.prototype,`_hasLeftButtons`,void 0),s([a()],u.prototype,`_hasRightIcon`,void 0),s([a()],u.prototype,`_hasRightButtons`,void 0),u=s([o(`bd-spotlight-section`)],u);