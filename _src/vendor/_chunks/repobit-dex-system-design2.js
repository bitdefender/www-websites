import{c as e,i as t,t as n}from"./lit.js";import"./repobit-dex-system-design.js";import{i as r,m as i,p as a,s as o}from"./repobit-dex-system-design3.js";var s=e`
 :host {
    display: block;
  }
  @layer bd-components {
    /* No vertical margin. A heading's spacing depends on what it sits above
       and below, which this element cannot see, so it is the caller's to set —
       through the padding and paddingBottom props, which resolve to spacing
       steps in shared/token-scales.js. Six commented-out margin pairs used to
       stand here recording an earlier answer; they were written with a //
       prefix, which CSS does not recognise as a comment, so the parser was
       discarding them through error recovery rather than honouring them.

       The colour is set rather than inherited. Left to inherit, a heading took
       whatever ink the page happened to carry, which is how bd-h, bd-display,
       bd-p and bd-li ended up with four different blacks between them. */
    .bd-heading {
      margin: 0;
      padding: 0;
      color: var(--color-text-primary);
    }

    /* A heading that wraps shares its words between its lines rather than
       leaving one on the last. text-wrap is inherited, so slotted copy and
       every component titled through bd-h -- bd-section-header among them --
       balances too. Behind @supports: balance is Newly available (Safari 17.5,
       2024-05-13) and Widely available only from 2026-11-13. */
    @supports (text-wrap: balance) {
      .bd-heading {
        text-wrap: balance;
      }
    }

    /* h1 */
    .bd-heading.h1 {
      font-size: var(--typography-heading-h1-fontSize);
      font-weight: var(--typography-heading-h1-fontWeight);
      line-height: var(--typography-heading-h1-lineHeight);
      letter-spacing: var(--typography-heading-h1-letterSpacing);
      font-family: var(--typography-heading-h1-fontFamily);
    }

    /* h2 */
    .bd-heading.h2 {
      font-size: var(--typography-heading-h2-fontSize);
      font-weight: var(--typography-heading-h2-fontWeight);
      line-height: var(--typography-heading-h2-lineHeight);
      letter-spacing: var(--typography-heading-h2-letterSpacing);
      font-family: var(--typography-heading-h2-fontFamily);
    }

    /* h3 */
    .bd-heading.h3 {
      font-size: var(--typography-heading-h3-fontSize);
      font-weight: var(--typography-heading-h3-fontWeight);
      line-height: var(--typography-heading-h3-lineHeight);
      letter-spacing: var(--typography-heading-h3-letterSpacing);
      font-family: var(--typography-heading-h3-fontFamily);
    }

    /* h4 */
    .bd-heading.h4 {
      font-size: var(--typography-heading-h4-fontSize);
      font-weight: var(--typography-heading-h4-fontWeight);
      line-height: var(--typography-heading-h4-lineHeight);
      letter-spacing: var(--typography-heading-h4-letterSpacing);
      font-family: var(--typography-heading-h4-fontFamily);
    }

    /* h5 */
    .bd-heading.h5 {
      font-size: var(--typography-heading-h5-fontSize);
      font-weight: var(--typography-heading-h5-fontWeight);
      line-height: var(--typography-heading-h5-lineHeight);
      letter-spacing: var(--typography-heading-h5-letterSpacing);
      font-family: var(--typography-heading-h5-fontFamily);
    }

    /* h6 */
    .bd-heading.h6 {
      font-size: var(--typography-heading-h6-fontSize);
      font-weight: var(--typography-heading-h6-fontWeight);
      line-height: var(--typography-heading-h6-lineHeight);
      letter-spacing: var(--typography-heading-h6-letterSpacing);
      font-family: var(--typography-heading-h6-fontFamily);
    }
  }
`,c=class extends n{static properties={as:{type:String,reflect:!0},visualLevel:{type:String,attribute:`visual-level`,reflect:!0},ariaLevel:{type:Number,attribute:`aria-level`},padding:{type:String},paddingBottom:{type:String},fontWeight:{type:String},color:{type:String}};constructor(){super(),this.as=`h1`,this.visualLevel=``,this.ariaLevel=null,this.padding=``,this.paddingBottom=``,this.fontWeight=``,this.color=``}_isValidHeadingTag(e){return[`h1`,`h2`,`h3`,`h4`,`h5`,`h6`].includes(e)}_normaliseLevel(e){let t=String(e??``).trim().toLowerCase();return this._isValidHeadingTag(t)?t:/^[1-6]$/.test(t)?`h${t}`:``}_computeStyles(){return[[`padding`,i(this.padding)],[`padding-bottom`,a(this.paddingBottom)],[`font-weight`,o(this.fontWeight)],[`color`,r(this.color)]].filter(([,e])=>e).map(([e,t])=>`${e}: ${t};`).join(` `)}render(){let e=this._normaliseLevel(this.as)||`h2`,n=this._normaliseLevel(this.visualLevel)||e,r=document.createElement(e);r.className=`bd-heading ${n}`,this.ariaLevel&&r.setAttribute(`aria-level`,this.ariaLevel);let i=this._computeStyles();return i&&r.setAttribute(`style`,i),r.innerHTML=`<slot></slot>`,t`${r}`}static styles=[s]};customElements.define(`bd-h`,c);export{c as t};