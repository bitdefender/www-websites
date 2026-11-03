import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../button/button.js";import{t as s}from"./adopt-styles.js";var c=r`pricing-card-actions .actions{flex-direction:column;gap:.5rem;margin-top:1rem;display:flex}`,l=class extends n{constructor(...e){super(...e),this.productId=`vsb`,this.devices=`5`,this.subscription=`1`,this.dataLayerEvent=`info`}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),s(this,c)}get _label(){let e=this.closest(`new-pricing-card`)?.querySelector(`pricing-card-header`)?.getAttribute(`title`);return e?`Buy Now, ${e}`:t}render(){return e`
      <bd-context ignore-events-parent>
        <!-- AICI TREBUIE product-id CU CRATIMĂ! -->
        <bd-product product-id="${this.productId}">
          <bd-option
            devices="${this.devices}"
            subscription="${this.subscription}"
            data-layer-event="${this.dataLayerEvent}">

            <div class="actions">
              <bd-button-link
                label=${this._label}
                variant="accent"
                fullwidth
                buyLink
              >
                Buy Now
              </bd-button-link>
            </div>

          </bd-option>
        </bd-product>
      </bd-context>
    `}};o([i({type:String,attribute:`product-id`})],l.prototype,`productId`,void 0),o([i({type:String})],l.prototype,`devices`,void 0),o([i({type:String})],l.prototype,`subscription`,void 0),o([i({type:String})],l.prototype,`dataLayerEvent`,void 0),l=o([a(`pricing-card-actions`)],l);