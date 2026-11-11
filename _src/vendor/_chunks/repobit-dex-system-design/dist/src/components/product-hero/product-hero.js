import{a as e,t,u as n}from"../../../../../lit/index.js";import{n as r}from"../../../../../lit/decorators.js";import"../shared/token-scales.js";import{n as i,t as a}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../p/p.js";import{t as o}from"../shared/controller.slot.js";import"../h/h.js";import"../link/link.js";import{t as s}from"../shared/ensemble.css.js";import"../badge/badge.js";import"../button/button.js";import"../img/img.js";import"../icons/brand-signature.js";var c=n`:host{background:var(--color-surface-default);padding-top:var(--spacing-16);padding-bottom:var(--spacing-16);display:block}.bd-container [hidden]{display:none}::slotted([slot=media]){object-fit:cover;width:100%;height:100%;z-index:var(--z-base);border-radius:var(--shape-radius-2xl);display:block;position:relative}::slotted(bd-img[slot=media]){grid-template:minmax(0,1fr)/minmax(0,1fr);place-items:stretch stretch;display:grid}.bd-container{gap:var(--spacing-64);grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:stretch;display:grid}.bd-header-left{padding-block:var(--spacing-24)}.bd-header-left,.bd-header-right{flex:1}.bd-header-right{justify-content:center;align-items:stretch;width:100%;display:flex;position:relative}.bd-product-name{font-size:var(--typography-heading-h4-fontSize);font-weight:var(--typography-heading-h4-fontWeight);line-height:var(--typography-heading-h4-lineHeight);letter-spacing:var(--typography-heading-h4-letterSpacing);font-family:var(--typography-heading-h4-fontFamily);color:var(--color-text-brand);margin-top:var(--spacing-0);margin-bottom:var(--spacing-16)}.bd-value-prop{margin:var(--spacing-0)}::slotted(bd-h[slot=title]),::slotted(bd-display[slot=title]){--bd-heading-font-size:var(--typography-heading-h1-fontSize);--bd-heading-font-weight:var(--typography-heading-h1-fontWeight);--bd-heading-line-height:var(--typography-heading-h1-lineHeight);--bd-heading-letter-spacing:var(--typography-heading-h1-letterSpacing);--bd-heading-font-family:var(--typography-heading-h1-fontFamily)}.bd-description{margin-top:var(--spacing-8);margin-bottom:var(--spacing-0)}::slotted([slot=description]){--bd-paragraph-font-size:var(--typography-body-regular-fontSize);--bd-paragraph-font-weight:var(--typography-body-regular-fontWeight);--bd-paragraph-line-height:var(--typography-body-regular-lineHeight);--bd-paragraph-letter-spacing:var(--typography-body-regular-letterSpacing);--bd-heading-color:var(--color-text-primary);--bd-paragraph-color:var(--color-text-primary)}.bd-price-zone-top{gap:var(--spacing-8);margin-top:var(--spacing-16);align-items:center;display:flex}.original-price{--bd-paragraph-margin-bottom:0;color:var(--color-text-muted)}.bd-price-zone-final{font-size:var(--typography-heading-h2-fontSize);font-weight:var(--typography-heading-h2-fontWeight);line-height:var(--typography-heading-h2-lineHeight);letter-spacing:var(--typography-heading-h2-letterSpacing);font-family:var(--typography-heading-h2-fontFamily);margin-bottom:var(--spacing-16);display:block}.bd-cta{gap:var(--spacing-16);flex-wrap:wrap;display:flex}.bd-caption,.bd-small-print{font-size:var(--typography-body-xsmall-fontSize);font-weight:var(--typography-body-small-fontWeight);line-height:var(--typography-body-small-lineHeight);letter-spacing:var(--typography-body-small-letterSpacing);font-family:var(--typography-body-small-fontFamily);color:var(--color-text-muted);margin:var(--spacing-0)}.bd-caption{margin-top:var(--spacing-8)}.bd-small-print{--bd-link-color:var(--color-text-primary)}.bd-header-image-wrapper{border-radius:var(--shape-radius-2xl);--bd-header-mark-inset:var(--spacing-24);--bd-header-mark-height:var(--icon-lg-size);--bd-header-scrim-fade:var(--spacing-112);--bd-header-scrim-mid:var(--spacing-40);justify-content:center;width:100%;height:100%;display:flex;position:relative;overflow:hidden}.bd-header-scrim{height:calc(var(--bd-header-mark-inset) + var(--bd-header-mark-height) + var(--bd-header-scrim-fade));background:linear-gradient(to top, color-mix(in srgb, var(--color-brand-950) 60%, transparent) 0, color-mix(in srgb, var(--color-brand-950) 60%, transparent) calc(var(--bd-header-mark-inset) + var(--bd-header-mark-height)), color-mix(in srgb, var(--color-brand-950) 22%, transparent) calc(var(--bd-header-mark-inset) + var(--bd-header-mark-height) + var(--bd-header-scrim-mid)), transparent 100%);z-index:var(--z-raised);pointer-events:none;position:absolute;inset-block-end:0;inset-inline:0}.bd-header-signature{z-index:var(--z-raised);color:var(--color-text-inverse);pointer-events:none;position:absolute;inset-block-end:var(--bd-header-mark-inset);inset-inline-end:var(--bd-header-mark-inset)}@media (width<992px){.bd-container{row-gap:var(--spacing-32);grid-template-columns:1fr}}@media (width<768px){.bd-cta{flex-direction:column;align-items:stretch}.bd-cta bd-button:not([hidden]){display:grid}.bd-header-image-wrapper{--bd-header-mark-inset:var(--spacing-16);--bd-header-mark-height:var(--icon-sm-size);--bd-header-scrim-fade:var(--spacing-48);--bd-header-scrim-mid:var(--spacing-16)}.bd-header-signature{height:var(--icon-sm-size)}}`,l=class extends t{constructor(...e){super(...e),this.productId=`vsb`,this.devices=`5`,this.subscription=`1`,this.shadow=!0,this.dataLayerEvent=`info`,this.ctaSecondaryHref=``,this._slots=new o(this,{slots:[`product-name`,`title`,`description`,`caption`,`footer`,`media`]})}static{this.styles=[s,c]}render(){let t=e=>this._slots.has(e);return e`
      <bd-context ignore-events-parent>
        <bd-product product-id="${this.productId}">
        <bd-option
          devices="${this.devices}"
          subscription="${this.subscription}"
          data-layer-event="${this.dataLayerEvent}">

        <div class="bd-ensemble bd-container">
          <div class="bd-header-left">
            <!-- ONE HEADING HERE, AND THE KICKER IS NOT IT.

                 3.x before 2026-09-17 drew the product name as="h2" and the
                 headline as="h4", in that order: a kicker announced as a
                 rung of the outline, above the actual promise two levels
                 below it. The headline is the page's main heading, so the
                 page writes it into "title" as <bd-h as="h1">; this hero is
                 the product hero and there is one per page, which is the
                 condition an h1 needs. Its level is the page's to pick -- the
                 SEO team sets the outline on this section -- and its size is
                 not: the title slot draws it at heading-h1, 48/700/1.25,
                 Header / v2's value-prop, at whatever level the page writes
                 (product-hero.css.ts). That is what 3.x's pinned
                 visual-level="h1" did beside heading-level; the hooks do it
                 now, so neither attribute is left.

                 The product name is a kicker -- a label naming the product,
                 and in Figma a plain text layer called product-name rather
                 than a heading. So its slot takes words, not a bd-h, and the
                 box around it is a <p>, out of the heading list entirely,
                 set in the heading-h4 ROLE, which is where a role on a
                 non-heading element belongs. A kicker in the outline is
                 worse than none: it adds a rung nobody navigates by and
                 pushes the real heading down. Words also take markup, so the
                 two-line name the design draws ("Bitdefender" over "Ultimate
                 Security") is the page's <br>, which one string attribute
                 could not hold.

                 THE ALTERNATIVE, and why not. The other accessible pattern
                 puts both inside the h1 --
                 <h1><span>Bitdefender Ultimate Security</span><span>Your
                 Ultimate Digital Protection</span></h1> -- which names the
                 heading with the product as well as the promise. Rejected:
                 every heading list, skip link and rotor entry would read the
                 whole run, and the h1 would be a run of two slots rather than
                 the page's one bd-h. The product is named by the document
                 title, the price block and the buy button; the heading does
                 not have to carry it. -->
            <p class="bd-product-name" ?hidden=${!t(`product-name`)}><slot name="product-name"></slot></p>
            <div class="bd-value-prop" ?hidden=${!t(`title`)}><slot name="title"></slot></div>
            <div class="bd-description" ?hidden=${!t(`description`)}><slot name="description"></slot></div>

            <div class="bd-price-zone-top" data-store-hide="!it.option.price.discounted">
              <!-- font-weight="medium", the atom's own attribute rather than a
                   declaration out in the stylesheet. Header / v2 sets the struck
                   price at 16 Medium, and a weight on a bd-p HOST is inert --
                   the atom sets all five type axes on its inner element -- so
                   the only way in from outside is the attribute. -->
              <bd-p appearance="regular" font-weight="medium" class="original-price">
                <s data-store-render data-store-price="full"></s>
              </bd-p>
              <!-- Header / v2's Badge at variant=success appearance=fill
                   size=lg: 8/12 padding, the control-label size, a full
                   radius. The store writes the percentage into it. -->
              <bd-badge
                variant="success"
                appearance="fill"
                size="lg"
                class="bd-discount"
                data-store-render
                data-store-discount="percentage"
              ></bd-badge>
            </div>

            <span class="bd-price-zone-final" data-store-render data-store-price="discounted||full"></span>

            <div class="bd-cta">
              <!-- No size: the button's responsive default, lg from 992px and
                   md below it. Header / v2 draws both CTAs at 16/32 padding
                   with an 18px label in an 8px-radius box, which is
                   --button-large-* exactly.

                   THE WORDS ARE THE PAGE'S, THE BUTTONS ARE NOT. Each slot is
                   forwarded as the button's own content, so the page's words
                   are the button's label and its accessible name, read
                   through the flat tree; there is no label attribute to
                   duplicate them. The buy button stays here, inside
                   bd-option, where the store finds its anchor (see the class
                   comment). The store fills its href on a real page and in
                   Storybook, though not in the Vitest story tests, which run
                   without it, and never touches the second button.

                   The second button is drawn only with cta-secondary-href:
                   hidden, its slot still renders, so words the page wrote
                   before the href are assigned and wait for it. -->
              <bd-button appearance="accent" part="buy-button" buy-link><slot name="cta"></slot></bd-button>
              <bd-button
                appearance="tertiary"
                href="${this.ctaSecondaryHref}"
                ?hidden=${!this.ctaSecondaryHref}><slot name="cta-secondary"></slot></bd-button>
            </div>

            <p class="bd-caption" ?hidden=${!t(`caption`)}><slot name="caption"></slot></p>
            <p class="bd-small-print" ?hidden=${!t(`footer`)}><slot name="footer"></slot></p>
          </div>

          <!-- The scrim is a blue-950 band and the mark is white: both are
               only right over a picture. Over an empty column they would be a
               wash of colour and a white mark on the page's white, so the
               whole column is drawn only while "media" has content. -->
          <div class="bd-header-right" ?hidden=${!t(`media`)}>
            <div class="bd-header-image-wrapper">
              <slot name="media"></slot>
              <div class="bd-header-scrim" aria-hidden="true"></div>
              <bd-icon name="brand-signature" class="bd-header-signature"></bd-icon>
            </div>
          </div>
        </div>
        </bd-option>
        </bd-product>
      </bd-context>
    `}};a([r({type:String,attribute:`product-id`})],l.prototype,`productId`,void 0),a([r({type:String})],l.prototype,`devices`,void 0),a([r({type:String})],l.prototype,`subscription`,void 0),a([r({type:Boolean,reflect:!0})],l.prototype,`shadow`,void 0),a([r({type:String,attribute:`data-layer-event`})],l.prototype,`dataLayerEvent`,void 0),a([r({type:String,attribute:`cta-secondary-href`})],l.prototype,`ctaSecondaryHref`,void 0),l=a([i(`bd-product-hero`)],l);export{l as BdProductHero};