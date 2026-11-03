import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r,t as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import"../paragraph/paragraph.js";import{t as s}from"../shared/ensemble.css.js";import"../button/button.js";import"../badge/badge.js";import"../icons/brand-signature-icon.js";var c=n`:host{background:var(--color-surface-default);padding-top:var(--spacing-16);padding-bottom:var(--spacing-16);display:block}::slotted(a:focus-visible){outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary);border-radius:var(--focus-outline-radius)}::slotted(a){color:var(--color-text-primary)}::slotted([slot=header-picture]){object-fit:cover;width:100%;height:100%;z-index:var(--z-base);border-radius:var(--shape-radius-2xl);display:block;position:relative}.bd-container{gap:var(--spacing-64);grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:stretch;display:grid}.bd-header-left{padding-block:var(--spacing-24)}.bd-header-left,.bd-header-right{flex:1}.bd-header-right{justify-content:center;align-items:stretch;width:100%;display:flex;position:relative}.bd-header-image{border-radius:var(--shape-radius-2xl);z-index:var(--z-base);position:relative}.bd-product-name{font-size:var(--typography-heading-h4-fontSize);font-weight:var(--typography-heading-h4-fontWeight);line-height:var(--typography-heading-h4-lineHeight);letter-spacing:var(--typography-heading-h4-letterSpacing);font-family:var(--typography-heading-h4-fontFamily);color:var(--color-text-brand);margin-top:var(--spacing-0);margin-bottom:var(--spacing-16)}.bd-value-prop{margin:var(--spacing-0)}.bd-description{color:var(--color-text-primary);margin-top:var(--spacing-8);margin-bottom:var(--spacing-0)}.bd-price-zone-top{gap:var(--spacing-8);margin-top:var(--spacing-16);align-items:center;display:flex}.original-price{--bd-paragraph-margin-bottom:0;color:var(--color-text-muted)}.bd-price-zone-final{font-size:var(--typography-heading-h2-fontSize);font-weight:var(--typography-heading-h2-fontWeight);line-height:var(--typography-heading-h2-lineHeight);letter-spacing:var(--typography-heading-h2-letterSpacing);font-family:var(--typography-heading-h2-fontFamily);margin-bottom:var(--spacing-16);display:block}.bd-cta{gap:var(--spacing-16);flex-wrap:wrap;display:flex}.bd-disclaimer-top{margin-top:var(--spacing-8);--bd-paragraph-margin-bottom:0;color:var(--color-text-muted);display:block}.bd-header-image-wrapper{border-radius:var(--shape-radius-2xl);justify-content:center;width:100%;height:100%;display:flex;position:relative;overflow:hidden}.bd-header-image{object-fit:cover;width:100%;height:100%;display:block}.bd-header-image-wrapper{--bd-header-mark-inset:var(--spacing-24);--bd-header-mark-height:var(--icon-lg-size);--bd-header-scrim-fade:var(--spacing-112);--bd-header-scrim-mid:var(--spacing-40)}.bd-header-scrim{height:calc(var(--bd-header-mark-inset) + var(--bd-header-mark-height) + var(--bd-header-scrim-fade));background:linear-gradient(to top, color-mix(in srgb, var(--color-brand-950) 60%, transparent) 0, color-mix(in srgb, var(--color-brand-950) 60%, transparent) calc(var(--bd-header-mark-inset) + var(--bd-header-mark-height)), color-mix(in srgb, var(--color-brand-950) 22%, transparent) calc(var(--bd-header-mark-inset) + var(--bd-header-mark-height) + var(--bd-header-scrim-mid)), transparent 100%);z-index:var(--z-raised);pointer-events:none;position:absolute;inset-block-end:0;inset-inline:0}.bd-header-signature{z-index:var(--z-raised);color:var(--color-text-inverse);pointer-events:none;position:absolute;inset-block-end:var(--bd-header-mark-inset);inset-inline-end:var(--bd-header-mark-inset)}.bd-disclaimer-bottom{color:var(--color-text-muted);--bd-paragraph-margin-bottom:0;display:block}@media (width<992px){.bd-container{row-gap:var(--spacing-32);grid-template-columns:1fr}}@media (width<768px){.bd-cta{flex-direction:column;align-items:stretch}.bd-cta bd-button-link{display:grid}.bd-header-image-wrapper{--bd-header-mark-inset:var(--spacing-16);--bd-header-mark-height:var(--icon-sm-size);--bd-header-scrim-fade:var(--spacing-48);--bd-header-scrim-mid:var(--spacing-16)}.bd-header-signature{height:var(--icon-sm-size)}}::slotted([slot=disclaimer-bottom-link]){color:var(--color-text-primary);text-decoration:underline}`,l=class extends t{constructor(...e){super(...e),this.title=``,this.subtitle=``,this.description=``,this.headingLevel=`h1`,this.ctaLabel=`Buy now`,this.ctaSecondaryLabel=`View more plans`,this.ctaSecondaryHref=``,this.productId=`vsb`,this.devices=`5`,this.subscription=`1`,this.shadow=!0,this.dataLayerEvent=`info`,this._hasPicture=!1}static{this.styles=[s,c]}_pictureSlotChanged(e){this._hasPicture=e.target.assignedElements({flatten:!0}).length>0}render(){return e`
      <bd-context ignore-events-parent>
        <bd-product product-id="${this.productId}">
        <bd-option 
          devices="${this.devices}" 
          subscription="${this.subscription}" 
          data-layer-event="${this.dataLayerEvent}">

        <div class="bd-ensemble bd-container">
          <div class="bd-header-left">
            <!-- ONE HEADING HERE, AND THE EYEBROW IS NOT IT.

                 What this replaces: the product name was as="h2" and the
                 headline as="h4", so the outline ran h2 then h4 in that DOM
                 order -- an eyebrow announced as a landmark, above the actual
                 promise announced two levels below it. Every page rendering
                 this header carried that.

                 The headline is the page's main heading, so it is h1 --
                 h1 by DEFAULT now rather than hardcoded, see headingLevel
                 above. This component is the product hero and there is one per
                 page, which is the condition an h1 needs, so h1 is the right
                 default; the page can still say otherwise. bd-h's h1 role is
                 5xl/bold/tight -- 48/700/1.25 -- which is Header / v2's
                 value-prop exactly, which is why visual-level is pinned to h1
                 and not left to follow as: the two agree at the default, and
                 when a page separates them the design keeps the size.

                 The product name is a kicker -- a label naming the product, and
                 in Figma a plain text layer called product-name rather than a
                 heading. So it is a <p>, out of the heading list entirely, and
                 it resolves through the heading-h4 ROLE in header.css.ts, which
                 is where a role on a non-heading element belongs. A kicker in
                 the outline is worse than no kicker in the outline: it adds a
                 rung nobody navigates by and pushes the real heading down.

                 THE ALTERNATIVE, and why not. The other accessible pattern is
                 to put both inside the h1 -- <h1><span>Bitdefender Ultimate
                 Security</span><span>Your Ultimate Digital Protection</span>
                 </h1> -- which gives the heading an accessible name carrying
                 the product as well as the promise. It was rejected on two
                 counts: every heading list, skip link and rotor entry would
                 then read the whole run, and it would mean rendering the h1
                 here by hand instead of through bd-h, since the atom takes one
                 slot. The product is named by the document title, the price
                 block and the CTA; the heading does not have to carry it. -->
            <p class="bd-product-name">${this.title}</p>
            <bd-h
              as="${this.headingLevel}"
              visual-level="h1"
              class="bd-value-prop">${this.subtitle}</bd-h>
            <bd-p variant="regular" class="bd-description">${this.description}</bd-p>

            <div class="bd-price-zone-top" data-store-hide="!it.option.price.discounted">
              <!-- font-weight="medium", the atom's own attribute rather than a
                   declaration out in the stylesheet. Header / v2 sets the struck
                   price at 16 Medium, and a weight on a bd-p HOST is inert --
                   the atom sets all five type axes on its inner element -- so
                   the only way in from outside is the attribute, which
                   paragraph.ts resolves through the weight scale and applies to
                   that inner element. Measured before adding it: 400. -->
              <bd-p variant="regular" font-weight="medium" class="original-price">
                <s data-store-render data-store-price="full"></s>
              </bd-p>
              <!-- bd-badge, not the span this used to be. Header / v2 places the
                   Badge component here at tone=success variant=fill size=lg, and
                   the atom's own lg step is that spec exactly: 8/12 padding, the
                   control-label size, a full radius. The span it replaces was a
                   hand-rolled badge and a DIFFERENT one -- green-100 behind
                   text/success, which is the atom's shade variant, at 16px
                   semibold in a --radius-xl box. Its two "no role:" markers went
                   with it: they existed to say "this should be a bd-badge", and
                   the answer to that is a bd-badge. -->
              <bd-badge
                tone="success"
                variant="fill"
                size="lg"
                class="bd-discount"
                data-store-render
                data-store-discount="percentage"
              ></bd-badge>
            </div>

            <span class="bd-price-zone-final" data-store-render data-store-price="discounted||full"></span>

            <div class="bd-cta">
              <!-- No size: the button's responsive default, lg from 992px and md
                   below it, and no font-size override. Header / v2 draws both
                   CTAs at 16/32 padding with an 18px label in an 8px-radius box,
                   and --button-large-* is that set exactly: spacing-16/32,
                   fontSize-lg, radius-lg. These were size="md" (12/24, 16px,
                   radius-md) with font-size="lg" bolted on top, so the label was
                   the large step's and the box was the medium step's -- 18px type
                   in a box padded for 16px type. Dropping the override puts the
                   whole control back on one answer. Narrower than desktop the
                   CTAs drop to md, the band every website CTA uses there.

                   THE LABELS come from cta-label and cta-secondary-label as of
                   2026-09-17, defaulting to the strings this component always
                   rendered. Which words sell a subscription is still not ours
                   -- see the prop declarations above -- but the page can now
                   act on the answer without editing this file.

                   NO label ATTRIBUTE ON EITHER. On bd-button-link, label
                   is the accessible name and the slot is the visible text, and
                   these passed the same string to both -- so the anchor
                   carried an aria-label duplicating its own content. Dropping
                   it lets the accessible name come from the text, which is one
                   source instead of two saying the same thing.

                   The secondary's href is empty by default and the atom then
                   renders an anchor with no href at all. Measured on
                   Components/Header -> Design copy & a live secondary: it
                   refuses focus and matches neither a[href] nor :enabled, so
                   it is not focusable, not a link to a screen reader, and does
                   nothing on click. It has been that way since it was written.
                   Set cta-secondary-href.

                   The store fills the PRIMARY in -- on a real page and in
                   Storybook, though not in the Vitest story tests, which run
                   without it -- and never touches the secondary. -->
              <bd-button-link
                variant="accent"
                part="buy-button"
                buyLink
                >${this.ctaLabel}</bd-button-link
              >
              <bd-button-link
                href="${this.ctaSecondaryHref}"
                variant="tertiary"
                >${this.ctaSecondaryLabel}</bd-button-link
              >
            </div>

            <bd-p variant="xsmall" class="bd-disclaimer-top">
              <slot name="disclaimer-top">
                Protection for 1 account & 5 PCs, Macs, tablets, or smartphones.
                Windows® | macOS® | Android™ | iOS®
              </slot>
            </bd-p>

            <bd-p variant="xsmall" class="bd-disclaimer-bottom">
              <slot name="disclaimer-bottom-text-start"></slot>
              <slot name="disclaimer-bottom-link"></slot>
              <slot name="disclaimer-bottom-text-end"></slot>
            </bd-p>
          </div>

          <div class="bd-header-right">
            <div class="bd-header-image-wrapper">
              <slot name="header-picture" @slotchange=${this._pictureSlotChanged}></slot>
              ${this._hasPicture?e`
                    <div class="bd-header-scrim" aria-hidden="true"></div>
                    <bd-brand-signature-icon
                      class="bd-header-signature"
                    ></bd-brand-signature-icon>
                  `:null}
            </div>
          </div>
        </div>
        </bd-option>
        </bd-product>
      </bd-context>
    `}};o([r({type:String})],l.prototype,`title`,void 0),o([r({type:String})],l.prototype,`subtitle`,void 0),o([r({type:String})],l.prototype,`description`,void 0),o([r({type:String,attribute:`heading-level`})],l.prototype,`headingLevel`,void 0),o([r({type:String,attribute:`cta-label`})],l.prototype,`ctaLabel`,void 0),o([r({type:String,attribute:`cta-secondary-label`})],l.prototype,`ctaSecondaryLabel`,void 0),o([r({type:String,attribute:`cta-secondary-href`})],l.prototype,`ctaSecondaryHref`,void 0),o([r({type:String,attribute:`product-id`})],l.prototype,`productId`,void 0),o([r({type:String})],l.prototype,`devices`,void 0),o([r({type:String})],l.prototype,`subscription`,void 0),o([r({type:Boolean,reflect:!0})],l.prototype,`shadow`,void 0),o([r({type:String})],l.prototype,`dataLayerEvent`,void 0),o([i()],l.prototype,`_hasPicture`,void 0),l=o([a(`bd-header`)],l);