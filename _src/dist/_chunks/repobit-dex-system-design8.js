import{c as e,i as t,l as n,t as r}from"./lit.js";import"./repobit-dex-system-design.js";import{a as i,i as a,l as o,m as s,o as c,p as l,r as u,s as d}from"./repobit-dex-system-design3.js";var f=e`
  /* --color-text-primary, not --color-neutral-1000. Body copy was set in pure
     black while bd-display used neutral-900 and bd-li neutral-700, so a
     heading, its paragraph and its list rendered in three different inks. The
     line below the font-family used to carry the intended value as
     a // prefix, which CSS does not treat as a comment — the parser dropped
     it, and the pure black above won by default. */
  :host {
    display: block;
    color: var(--bd-paragraph-color, var(--color-text-primary));
  }

  p {
    all: unset;
    display: block;
    font-family: var(--typography-body-regular-fontFamily);
    /* The flow margin between consecutive paragraphs, and the switch to turn
       it off: --bd-paragraph-margin-bottom: 0 on the host or any ancestor.
       It inherits into this shadow root, which the margin itself never did --
       the <p> is unreachable from outside, so a paragraph that ends a card or
       a column carried 16px nobody could remove, and the header cancelled it
       three times with a negative margin.

       It was a no-op until 0.26.0: it read --spacing-md, which no longer
       existed, so every page built on 0.25 was laid out with zero here. The
       rename to --spacing-16 made it live, which is how the step cards on
       security-for-creators gained 16px under each description. */
    margin-bottom: var(--bd-paragraph-margin-bottom, var(--spacing-16));
  }

  /* === Font Size Variants === */
  :host([variant="large"]) p {
    font-size: var(--typography-body-large-fontSize);
    font-weight: var(--typography-body-large-fontWeight);
    line-height: var(--typography-body-large-lineHeight);
    letter-spacing: var(--typography-body-large-letterSpacing);
  }

  :host([variant="regular"]) p {
    font-size: var(--typography-body-regular-fontSize);
    font-weight: var(--typography-body-regular-fontWeight);
    line-height: var(--typography-body-regular-lineHeight);
    letter-spacing: var(--typography-body-regular-letterSpacing);
  }

  :host([variant="small"]) p {
    font-size: var(--typography-body-small-fontSize);
    font-weight: var(--typography-body-small-fontWeight);
    line-height: var(--typography-body-small-lineHeight);
    letter-spacing: var(--typography-body-small-letterSpacing);
  }
  :host([variant="xsmall"]) p {
    font-size: var(--typography-body-xsmall-fontSize);
    font-weight: var(--typography-body-small-fontWeight);
    line-height: var(--typography-body-small-lineHeight);
    letter-spacing: var(--typography-body-small-letterSpacing);
  }
  :host([variant="lead"]) p {
    font-size: var(--typography-body-lead-fontSize);
    font-weight: var(--typography-body-lead-fontWeight);
    line-height: var(--typography-body-lead-lineHeight);
    letter-spacing: var(--typography-body-lead-letterSpacing);
  }

  /* The eyebrow: a short label above a section title. It takes the
     label-large role -- the role whose job is a short label rather than
     running text -- which is 16px at 1.5 like body-regular and Medium 500
     where body-regular is 400. Brand ink is part of the pattern: all five
     eyebrows in the package and every one on the homepage are text-brand.
     A color attribute still wins, for an eyebrow on a dark band. */
  :host([variant="eyebrow"]) p {
    font-size: var(--typography-label-large-fontSize);
    font-weight: var(--typography-label-large-fontWeight);
    line-height: var(--typography-label-large-lineHeight);
    letter-spacing: var(--typography-label-large-letterSpacing);
    font-family: var(--typography-label-large-fontFamily);
    color: var(--color-text-brand);
  }

  /* Below lg the eyebrow steps down to label-default: 14px, the same Medium
     500 at 1.5. The homepage draws it 14 on the 390 and 768 frames and 16 on
     desktop, so the step sits at lg, which is also where every fluid role in
     the system stops growing. A step between two declared roles rather than a
     fluid size, because the label family has no fluid role, and one for a
     single variant would be a new token where two existing roles already
     answer both ends exactly. */
  @media ${n(u(`lg`))} {
    :host([variant="eyebrow"]) p {
      font-size: var(--typography-label-default-fontSize);
      font-weight: var(--typography-label-default-fontWeight);
      line-height: var(--typography-label-default-lineHeight);
      letter-spacing: var(--typography-label-default-letterSpacing);
    }
  }


  

`,p=[`xsmall`,`small`,`regular`,`large`,`lead`,`eyebrow`],m=class extends r{static properties={variant:{type:String,reflect:!0},kind:{type:String},padding:{type:String},paddingBottom:{type:String},paddingTop:{type:String},fontFamily:{type:String,attribute:`font-family`},fontWeight:{type:String,attribute:`font-weight`},fontSize:{type:String,attribute:`font-size`},letterSpacing:{type:String,attribute:`letter-spacing`},color:{type:String}};constructor(){super(),this.variant=`regular`,this.kind=``,this.padding=``,this.paddingBottom=``,this.paddingTop=``,this.fontFamily=``,this.fontWeight=``,this.fontSize=``,this.letterSpacing=``,this.color=``}willUpdate(e){e.has(`kind`)&&this.kind&&(this.variant=this.kind),(e.has(`variant`)||e.has(`kind`))&&(p.includes(this.variant)||(this.variant=`regular`))}render(){let e=[[`padding`,s(this.padding)],[`padding-bottom`,l(this.paddingBottom)],[`padding-top`,l(this.paddingTop)],[`font-family`,i(this.fontFamily)],[`font-weight`,d(this.fontWeight)],[`font-size`,c(this.fontSize)],[`letter-spacing`,o(this.letterSpacing)],[`color`,a(this.color)]].filter(([,e])=>e).map(([e,t])=>`${e}: ${t};`);return t`
      <p class="bd-paragraph" style="${e.join(` `)}">
        <slot></slot>
      </p>
    `}static styles=[f]};customElements.define(`bd-p`,m);export{m as t};