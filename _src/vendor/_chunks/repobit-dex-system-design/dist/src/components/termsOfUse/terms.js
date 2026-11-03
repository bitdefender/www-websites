import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r}from"../../../../../lit/decorators.js";import{n as i,t as a}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../paragraph/paragraph.js";import{t as o}from"../shared/ensemble.css.js";import"../list/list-item/list-item.js";import"../list/list.js";var s=n`:host{background:var(--color-surface-subtle);display:block}.bd-terms-text-a:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary);border-radius:var(--focus-outline-radius)}.bd-terms-container{padding-block:var(--spacing-44);font-family:var(--typography-fontFamily-sans)}.bd-terms-wrapper{max-width:var(--content-width-readable);padding:var(--spacing-14) var(--spacing-20) var(--spacing-40) var(--spacing-20);margin-inline:auto}.bd-terms-text-p{padding:0}.bd-terms-text-a{color:var(--color-text-brand)}`,c=class extends t{constructor(...t){super(...t),this.faqs=[{question:`Auto renewal terms`,items:[`Your subscription automatically begins at the purchase date;`,`By subscribing, you are purchasing a recurring subscription which will automatically renew;`,`The Bitdefender Auto Renewal Plan is designed to save you time, effort, and minimize your vulnerability risk by extending your subscription automatically before you run out of protection.`]},{question:`Here is what the Bitdefender Auto Renewal Plan means for you`,items:[`Continuous protection so that you never have to worry about your subscription running out before you renew manually;`,`Free upgrades whenever a new version of Bitdefender comes out;`,`Peace of mind that your devices are always protected;`,`Save time while we are taking care of the automatic renewal process;`,`Opt out at any time so that you are always in control of your renewal options;`,`24/7 security all-subscription long without interruption;`,`The price offered is valid for the first year of subscription. After that, your subscription will be billed at the applicable renewal price;`,`If a discount is presented, it describes the difference between the first term and renewal term subscription prices (e.g., first year price vs. each year thereafter). The prices are subject to change, but Bitdefender will send a prior notification by email, before the automatic renewal takes place. You will receive an email notification before you will be billed, along with information regarding pricing and the extension of your subscription duration.`]},{question:`Affirmative consent`,items:[`Your subscription automatically begins at the purchase date;`,`By subscribing, you are purchasing a recurring subscription which will automatically renew.`]},{question:`How to cancel + email address cancelation support`,items:[e`You can cancel your automatically subscription from Bitdefender Central or by contacting Customer Support at: <a href="mailto:cancel@bitdefender.com" title="cancel@bitdefender.com">cancel@bitdefender.com</a>`,e`You can refund by contacting <a href="mailto:refunds@bitdefender.com" title="refunds@bitdefender.com">refunds@bitdefender.com</a> within 30 days of your initial purchase or of the automatic renewal date.`]}]}static{this.styles=[o,s]}_renderFAQItem(t){return e`
      <div>
        <div>
          <bd-p variant="small" class="bd-terms-text-p"><strong>${t.question}</strong></bd-p>
          ${t.items?e`
            <bd-p variant="small">
              <bd-list type="unordered" spacing="md" variant="default" orientation="vertical">
                ${t.items.map(t=>e`
                  <bd-li variant="bullet" size="md">${t}</bd-li>
                `)}
              </bd-list>
            </bd-p>
          `:``}
        </div>
      </div>
    `}render(){return e`
      <div
        class="bd-ensemble bd-section bd-terms_section bd-terms-container"
        data-section-status="loaded"
        id="bd-tos"
        style=""
      >
        <div class="bd-terms-wrapper">
          <div
            class="bd-terms bd-block"
            data-block-name="bd-terms"
            data-block-status="loaded"
          >
            <div>
              <div>
                <bd-h as="h2" visual-level="h3" paddingBottom="16" id="bd-terms-of-use">Terms of use</bd-h>
              </div>
            </div>
            
            <!-- Render FAQ items -->
            ${this.faqs.map(e=>this._renderFAQItem(e))}
            
            <!-- Additional content -->
            <div>
              <div class="bd-terms-text-p">
                <bd-p variant="small">
                  Your subscription may include product, service and/or protection
                  updates and features that may be added, modified or removed
                  subject to
                  <a class="bd-terms-text-a"
                    href="https://www.bitdefender.com/legal/?adobe_mc=MCMID%3D63411747395182077784244429321314993670%7CMCORGID%3D0E920C0F53DA9E9B0A490D45%2540AdobeOrg%7CTS%3D1739263766"
                    title="Bitdefender Subscription Agreement and Terms and Conditions for Home Users"
                    >Bitdefender Subscription Agreement and Terms and Conditions
                    for Home Users</a
                  >
                  and
                  <a class="bd-terms-text-a"
                    href="https://www.bitdefender.com/site/view/legal-privacy-policy-for-home-users-solutions.html?adobe_mc=MCMID%3D63411747395182077784244429321314993670%7CMCORGID%3D0E920C0F53DA9E9B0A490D45%2540AdobeOrg%7CTS%3D1739263766"
                    title="Privacy Notice"
                    >Privacy Notice</a
                  >.
                </bd-p>
              </div>
            </div>
            <div>
              <div class="bd-terms-text-p">
                <bd-p variant="small">
                  By using the subscription, You acknowledge and agree that your
                  use of the product which integrates with YouTube API Services is
                  subject to
                  <a class="bd-terms-text-a"
                    href="https://www.youtube.com/static?template=terms"
                    title="YouTube's Terms of Service"
                    >YouTube's Terms of Service</a
                  >.
                </bd-p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}};a([r({type:Array})],c.prototype,`faqs`,void 0),c=a([i(`bd-terms-section`)],c);