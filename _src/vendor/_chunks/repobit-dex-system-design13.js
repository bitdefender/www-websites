import{c as e,i as t,n,t as r}from"./lit.js";import"./repobit-dex-system-design.js";import{i,o as a}from"./repobit-dex-system-design3.js";import"./repobit-dex-system-design12.js";var o=e`
  /* Every axis here is the standalone role's. Weight used to be the one
     exception -- it read --typography-link-default-fontWeight, the inline
     role's 400 -- so a standalone link rendered 400 against the 500 its own
     role, the Figma link/standalone style and the homepage all draw. The
     inline role's weight now lives in the inline block below, with the rest
     of that role. */
  .bd-link {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-4);
    font-family: var(--typography-fontFamily-sans);
    font-size: var(--typography-link-standalone-fontSize);
    font-weight: var(--typography-link-standalone-fontWeight);
    line-height: var(--typography-link-standalone-lineHeight);
    color: var(--bd-link-color, var(--color-text-brand));
    text-decoration: none;
    text-underline-offset: var(--typography-link-underlineOffset);
    cursor: pointer;
    /* the properties that actually change, rather than all: a link that
       animates every property also animates the ones it inherits */
    transition: color var(--transition-duration-fast) var(--transition-easing-smooth),
      text-decoration-color var(--transition-duration-fast) var(--transition-easing-smooth);
  }

  /* ---- inline ------------------------------------------------------------
     A link in a sentence is that sentence's text, so it takes its type from
     the sentence. --typography-link-default-* is the role that says so: size,
     leading, tracking and family are all inherit. Four of those axes had no
     consumer, because the base rule above reads the standalone role instead --
     1rem and 1.5 regardless of context -- which is why an inline link measured
     16px inside a 12px caption and inside a 32px lede alike.

     display returns to inline as well. An inline-flex box does not hug its
     own text: in a 220px column the same link measured the full 220px where a
     plain <a> measured 209px, so it does not sit in the line the way a real
     inline element does. The gap and align-items above go inert with it, which
     is correct here -- an inline link is a run of text, not a row. */
  :host([inline]) .bd-link {
    display: inline;
    font-size: var(--typography-link-default-fontSize);
    font-weight: var(--typography-link-default-fontWeight);
    line-height: var(--typography-link-default-lineHeight);
    letter-spacing: var(--typography-link-default-letterSpacing);
    font-family: var(--typography-link-default-fontFamily);
  }

  /* ---- kinds ------------------------------------------------------------ */
  .bd-link--primary {
    color: var(--bd-link-color, var(--color-text-brand));
  }
  .bd-link--primary:hover {
    color: var(--color-text-brand-hover);
    text-decoration: underline;
  }

  .bd-link--secondary {
    color: var(--bd-link-color, var(--color-text-muted));
  }
  .bd-link--secondary:hover {
    color: var(--color-text-secondary);
    text-decoration: underline;
  }

  .bd-link--subtle {
    color: var(--bd-link-color, var(--color-text-subtle));
    text-decoration: none;
  }
  .bd-link--subtle:hover {
    color: var(--color-text-secondary);
    text-decoration: underline;
  }

  .bd-link--bold {
    color: var(--bd-link-color, var(--color-text-brand));
    /* no role: the bold modifier on a link -- a state or modifier weight, not a text-content
       type. See button.css.js's .button--bold for the argument. */
    font-weight: var(--typography-fontWeight-semibold);
    text-decoration: none;
  }
  .bd-link--bold:hover {
    color: var(--color-text-brand-hover);
    text-decoration: underline;
  }

  /* Red on a link is the error role, not bd-button's accent. The button's red
     is this system's conversion colour and it deliberately has no danger kind;
     a link is the opposite case — red text reads as a warning about where the
     link goes, so it takes --color-text-error and says so. */
  .bd-link--danger {
    color: var(--bd-link-color, var(--color-text-error));
  }
  .bd-link--danger:hover {
    color: var(--color-text-error);
    text-decoration: underline;
  }

  /* ---- surface ----------------------------------------------------------
     The same attribute bd-button uses to say the same thing. It replaces the
     light kind, which described the surface rather than the link and could
     not be combined with any of the kinds above. */
  :host([surface="dark"]) .bd-link,
  :host([surface="dark"]) .bd-link--primary,
  :host([surface="dark"]) .bd-link--secondary,
  :host([surface="dark"]) .bd-link--subtle,
  :host([surface="dark"]) .bd-link--bold {
    color: var(--color-text-inverse);
  }

  /* Colour only. This rule used to carry text-decoration: underline as well,
     and at (0,4,0) it outweighed .bd-link--no-underline:hover at (0,2,0) --
     so a link explicitly asking for no underline got one anyway, but only on a
     dark surface. Measured: dark/primary/no-underline went none -> underline on
     hover, where the same link on a light surface stayed none.

     The underline is the kinds' business, and every kind already declares it. */
  :host([surface="dark"]) .bd-link:hover {
    color: var(--color-text-inverse);
  }

  /* On a band filled with the brand: the brand's ink, which a theme must
     clear 4.5:1 on that fill. text-inverse is white, and on a light partner
     brand white is the one ink that cannot be read. On Bitdefender the two
     are the same white. */
  :host([surface="brand"]) .bd-link,
  :host([surface="brand"]) .bd-link--primary,
  :host([surface="brand"]) .bd-link--secondary,
  :host([surface="brand"]) .bd-link--subtle,
  :host([surface="brand"]) .bd-link--bold,
  :host([surface="brand"]) .bd-link:hover {
    color: var(--color-brand-on-fill);
  }

  /* ---- modifiers --------------------------------------------------------
     Ordered after the kinds rather than marked !important. Four declarations
     carried it before, which made the atom unoverridable by a consuming page —
     the exact failure the cascade-layer token work was done to avoid. */
  .bd-link--underline {
    text-decoration: underline;
  }
  .bd-link--underline:hover {
    text-decoration-thickness: var(--typography-link-underlineThickness);
  }

  .bd-link--no-underline,
  .bd-link--no-underline:hover {
    text-decoration: none;
  }

  /* ---- arrow ------------------------------------------------------------
     spacing/8 between the label and the arrow, the icon-to-label gap bd-back
     and the md and lg buttons already use. The base row's spacing/4 was set
     for text alone, and the Figma set measures 8.

     The underline needs no rule of its own. The anchor is a flex container,
     so the decoration propagates to its flex items and is drawn only where
     there is text: under the label, not under the arrow, which is what the
     Link arrow set draws. That was the set's open question, and it is
     answered by the layout this atom already had rather than by a choice. */
  .bd-link--arrow {
    gap: var(--spacing-8);
  }

  /* a swapped icon is held to the step the default arrow is drawn at */
  .bd-link--arrow ::slotted([slot="icon"]) {
    height: var(--icon-sm-size);
  }

  /* inline returns the link to a run of text, so there is no row and the gap
     goes inert; a start margin keeps the arrow off the last letter instead.
     The icon has no text, so its baseline is its bottom edge and it sat on
     the line about 4px high; middle centres it on the x-height. */
  :host([inline]) .bd-link--arrow bd-arrow-icon,
  :host([inline]) .bd-link--arrow ::slotted([slot="icon"]) {
    margin-inline-start: var(--spacing-4);
    vertical-align: middle;
  }

  /* The current link, read off the aria-current the <a> carries rather than
     a class beside it, so what is drawn and what is announced are one
     attribute and cannot disagree. */
  .bd-link[aria-current] {
    /* no role: a link in its active state -- a state or modifier weight, not a text-content
       type. See button.css.js's .button--bold for the argument. */
    font-weight: var(--typography-fontWeight-bold);
    color: var(--color-text-primary);
  }

  /* The current item does not move under the pointer.

     The current state and --primary are both present on a current nav item,
     and .bd-link--primary:hover outweighed the class this used to be -- so
     without this rule hovering the page you are already on turned it back to
     the brand ink, which is the one thing that colour is not supposed to mean
     here. Measured on bd-page-switcher before the wayfinding family review:
     current + hover reported action/primary-active, the only one of the
     three that recoloured an item the reader had already arrived at.

     It outranks every kind hover, so it wins whatever the order. */
  .bd-link[aria-current]:hover {
    color: var(--color-text-primary);
  }

  /* ---- states ----------------------------------------------------------- */
  .bd-link--disabled,
  span.bd-link--disabled {
    color: var(--color-text-disabled);
    cursor: not-allowed;
    text-decoration: none;
    pointer-events: none;
  }

  /* No :focus { outline: none } beside this: the browser's own ring is a
     :focus-visible ring too, so a pointer focus never drew one. */
  .bd-link:focus-visible {
    /* the one focus ring — see Foundations/Focus. A two-colour ring whose
       white inner band keeps it visible on a coloured or dark surface, which a
       single-colour outline cannot do. surface="dark" keeps it too: a link has
       no fill or border, so its white band meets the hero directly, 4.53:1 on
       blue-500 and more on every darker ground. */
    /* forced-colors mode does not paint box-shadow, so the ring
       vanishes there; it does paint an outline, in a system colour. This one
       is transparent everywhere else, and the offset lands it on the ring's
       outer band. */
    outline: var(--border-width-2) solid transparent;
    outline-offset: var(--focus-outline-offset);
    box-shadow: var(--focus-outline-primary);
    border-radius: var(--focus-outline-radius);
  }

  /* The two-colour ring puts a white band against the link, which is what
     carries it on Bitdefender's blue band and what vanishes on a light partner
     band. Under surface="brand" the ring is one band in the brand's ink, held
     off the text so the gap is the band itself -- bd-button's ring, for the
     same reason. */
  :host([surface="brand"]) .bd-link:focus-visible {
    outline: var(--focus-outline-traditional-on-brand);
    box-shadow: none;
  }

  a.bd-link {
    cursor: pointer;
  }

  /* There is no element-qualified reset here, and that is the point.

     The anchor's underline is already off: .bd-link sets text-decoration none,
     and an author rule beats the UA stylesheet whatever its specificity. What
     the old a.bd-link:not(.bd-link--underline) rule added was weight -- (0,2,1)
     against the (0,2,0) of every .bd-link--<kind>:hover -- so the hover
     underline each of the five kinds declares lost the cascade and never
     painted. Measured on light surfaces: primary, secondary, subtle, bold and
     danger all went none -> none across a hover. On a dark surface the same
     hover underlined, because that rule is (0,4,0) and outweighed the reset.

     The kinds and the modifiers sort themselves out on class weight alone, in
     source order: --underline and --no-underline are declared after the kinds,
     so they still win. */
  span.bd-link {
    cursor: default;
  }

  /* An <a> with no href is not a link, so it does not get the hand: the
     pointer would promise a destination there is none of. */
  a.bd-link:not([href]) {
    cursor: default;
  }

  @media (prefers-reduced-motion: reduce) {
    .bd-link {
      transition: none;
    }
  }
`,s={light:`primary`},c=[`primary`,`secondary`,`subtle`,`bold`,`danger`],l=class extends r{static properties={href:{type:String},target:{type:String},variant:{type:String,reflect:!0},kind:{type:String},underline:{type:Boolean,reflect:!0},noUnderline:{type:Boolean,attribute:`no-underline`},disabled:{type:Boolean,reflect:!0},fontSize:{type:String,attribute:`font-size`},inline:{type:Boolean,reflect:!0},color:{type:String},current:{type:String,reflect:!0,converter:{toAttribute:e=>e||null}},active:{type:Boolean,reflect:!0},surface:{type:String,reflect:!0},arrow:{type:Boolean,reflect:!0},description:{type:String}};constructor(){super(),this.href=``,this.target=`_self`,this.variant=`primary`,this.kind=``,this.underline=!1,this.noUnderline=!1,this.disabled=!1,this.fontSize=``,this.inline=!1,this.color=``,this.current=``,this.active=!1,this.surface=`light`,this.arrow=!1,this.description=``}willUpdate(e){(e.has(`kind`)||e.has(`variant`))&&(e.has(`kind`)&&this.kind&&(this.variant=this.kind),this.variant===`light`&&(this.surface=`dark`),s[this.variant]&&(this.variant=s[this.variant]),c.includes(this.variant)||(this.variant=`primary`))}static styles=[o];get _classes(){return[`bd-link`,`bd-link--${this.variant}`,this.underline?`bd-link--underline`:``,this.noUnderline?`bd-link--no-underline`:``,this.disabled?`bd-link--disabled`:``,this.arrow?`bd-link--arrow`:``].filter(Boolean).join(` `)}get _arrow(){return this.arrow?t`<slot name="icon"><bd-arrow-icon size="sm" aria-hidden="true"></bd-arrow-icon></slot>`:n}get _inlineStyle(){return[[`font-size`,this.inline?``:a(this.fontSize)],[`--bd-link-color`,i(this.color)]].filter(([,e])=>e).map(([e,t])=>`${e}: ${t}`).join(`; `)}get _current(){return this.current||(this.active?`true`:``)}render(){return this.disabled?t`<span part="link" class="${this._classes}" style="${this._inlineStyle}"><slot></slot>${this._arrow}</span>`:t`<a
        part="link"
        class="${this._classes}"
        style="${this._inlineStyle}"
        href="${this.href||n}"
        target="${this.href?this.target:n}"
        aria-current="${this._current||n}"
        aria-describedby="${this.description?`description`:n}"
        @click="${this._handleClick}"
      ><slot></slot>${this._arrow}</a>${this.description?t`<span id="description" hidden>${this.description}</span>`:n}`}_handleClick(e){this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}};customElements.define(`bd-link`,l);