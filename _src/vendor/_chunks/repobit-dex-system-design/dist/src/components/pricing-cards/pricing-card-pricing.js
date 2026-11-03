import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r,t as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../paragraph/paragraph.js";import"../link/link.js";import"../badge/badge.js";import{t as s}from"./adopt-styles.js";import"../radio/radio.js";import"../radio/radio-group.js";var c=n`pricing-card-pricing .pricing{text-align:start;margin-top:var(--spacing-16)}pricing-card-pricing .pricing-info{gap:var(--spacing-8);margin-top:var(--spacing-16);align-items:baseline;display:flex}pricing-card-pricing .original-price{font-family:var(--typography-fontFamily-sans);color:var(--color-text-primary);font-size:var(--typography-body-regular-fontSize);margin:0;text-decoration:line-through}pricing-card-pricing .discount{color:var(--color-text-success);background:var(--status-success-surface-strong);font-weight:700;font-size:var(--typography-body-regular-fontSize);border-radius:var(--radius-full);font-family:var(--typography-fontFamily-sans);margin:0;padding:5px}pricing-card-pricing .price{text-align:start;font-family:var(--typography-heading-h3-fontFamily);font-size:var(--typography-heading-h3-fontSize);font-weight:var(--typography-heading-h3-fontWeight);line-height:var(--typography-heading-h3-lineHeight);letter-spacing:var(--typography-heading-h3-letterSpacing);color:var(--color-text-primary);margin:0}pricing-card-pricing .terms{font-family:var(--typography-fontFamily-sans);font-size:var(--typography-label-small-fontSize);color:var(--color-text-primary);text-align:start;margin:0;margin-top:var(--spacing-8);margin-bottom:var(--spacing-16)}pricing-card-pricing .terms a{font-family:var(--typography-fontFamily-sans);font-size:var(--typography-label-small-fontSize);color:var(--color-text-primary);text-decoration:underline}pricing-card-pricing .billing::part(options){gap:var(--spacing-16);flex-direction:row}pricing-card-pricing .billing::part(label){clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}`,l={monthly:{price:`discounted-monthly||full-monthly`,full:`full-monthly`,per:`/month`},yearly:{price:`discounted||full`,full:`full`,per:`/year`}},u=class extends t{constructor(...e){super(...e),this.productId=`vsb`,this.devices=`5`,this.subscription=`1`,this.billingPeriod=`monthly`,this.dataLayerEvent=`info`,this.termsHref=``}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),s(this,c)}render(){let t=this.billingPeriod===`monthly`,n=l[this.billingPeriod];return e`
      <bd-context ignore-events-parent>
        <bd-product product-id="${this.productId}">
          <bd-option
            devices="${this.devices}"
            subscription="${this.subscription}"
            data-layer-event="${this.dataLayerEvent}">

            <div class="pricing">
              <bd-radio-group class="billing" label="Billing period" name="billing">
                <bd-radio
                  value="monthly"
                  label="Monthly"
                  ?checked=${t}
                  @change=${this.onBillingChange}
                ></bd-radio>
                <bd-radio
                  value="yearly"
                  label="Yearly"
                  ?checked=${!t}
                  @change=${this.onBillingChange}
                ></bd-radio>
              </bd-radio-group>

           <div class="pricing-info" data-store-hide="!it.option.price.discounted">
  <bd-p variant="small" class="original-price">
    <s data-store-render data-store-price="${n.full}"></s>
  </bd-p>

  <bd-badge tone="success" variant="shade">
    Save <span data-store-render data-store-discount="percentage"></span>
  </bd-badge>
</div>

              <p class="price">
                <span data-store-render data-store-price="${n.price}"></span>${n.per}
              </p>

              <bd-p variant="small" class="terms">
                First year price. Plus applicable sales tax. See
                ${this.termsHref?e`<bd-link href="${this.termsHref}" font-size="sm" color="strong" underline>terms of use</bd-link>`:`terms of use`}
              </bd-p>
            </div>

          </bd-option>
        </bd-product>
      </bd-context>
    `}onBillingChange(e){let t=e.target.value;(t===`monthly`||t===`yearly`)&&(this.billingPeriod=t)}};o([r({type:String,attribute:`product-id`})],u.prototype,`productId`,void 0),o([r({type:String})],u.prototype,`devices`,void 0),o([r({type:String})],u.prototype,`subscription`,void 0),o([i()],u.prototype,`billingPeriod`,void 0),o([r({type:String})],u.prototype,`dataLayerEvent`,void 0),o([r({type:String,attribute:`terms-href`})],u.prototype,`termsHref`,void 0),u=o([a(`pricing-card-pricing`)],u);