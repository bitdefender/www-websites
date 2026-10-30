import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import{t as a}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import{n as o}from"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design8.js";import{t as s}from"../../_chunks/repobit-dex-system-design10.js";function c(e,{allowed:t,legacy:n={},fallback:r}){let i=Object.hasOwn(n,e)?n[e]:e;return t.includes(i)?i:r}var l=e`
  :host {
    display: block;
  }

  .root {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-16);
  }

  /* bd-p closes every paragraph with a flow margin inside its own shadow
     root; the gap above is this header's spacing, so the switch turns it off */
  .eyebrow {
    --bd-paragraph-margin-bottom: 0;
  }

  .row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-16);
  }

  .heading {
    margin: 0;
  }

  .lead[hidden] {
    display: none;
  }

  /* The lead is body-regular below lg and body-large from lg, the two roles
     the design binds. Set on the wrapper so slotted copy inherits it: the
     page writes the words and this header owns their type. */
  .lead {
    font-family: var(--typography-body-regular-fontFamily);
    font-size: var(--typography-body-regular-fontSize);
    font-weight: var(--typography-body-regular-fontWeight);
    line-height: var(--typography-body-regular-lineHeight);
    letter-spacing: var(--typography-body-regular-letterSpacing);
    color: var(--color-text-primary);
  }

  ::slotted(*) {
    margin: 0;
  }

  :host([layout="centered"]) .root {
    align-items: center;
    text-align: center;
  }

  :host([layout="centered"]) .row {
    align-items: center;
    gap: var(--spacing-24);
    /* not the column: the centred measure the design sets on Proven, a
       heading and lead deliberately narrower than the page.
       no token: 588 is a measure, and the dimension scale stops at 64 */
    max-width: 588px;
  }

  @media ${n(o(`lg`))} {
    .lead {
      font-size: var(--typography-body-large-fontSize);
      font-weight: var(--typography-body-large-fontWeight);
      line-height: var(--typography-body-large-lineHeight);
      letter-spacing: var(--typography-body-large-letterSpacing);
    }

    :host([layout="split"]) .row {
      flex-direction: row;
      align-items: flex-start;
      gap: var(--spacing-24);
    }

    /* two equal halves, so the lead starts on the page's centre line */
    :host([layout="split"]) .heading,
    :host([layout="split"]) .lead {
      flex: 1 1 0;
      min-width: 0;
    }
  }

  /* A newline in the text is a line break, so a page can keep the breaks its
     copy was written with (a <br> in the authored eyebrow, heading or lead
     arrives as a newline in the property). Text only: nothing here renders
     HTML. The rule sits on a span around the text, not on bd-h or bd-p,
     whose own templates hold newlines that would break too, and the lead's
     span is the slot's fallback: slotted copy is markup, which brings its
     own <br>, and its source newlines stay spaces. */
  .text {
    white-space: pre-line;
  }
`,u=[`stacked`,`split`,`centered`],d=class extends i{static properties={eyebrow:{type:String},heading:{type:String},lead:{type:String},as:{type:String},layout:{type:String,reflect:!0},_hasLead:{state:!0}};static styles=[a,s,l];constructor(){super(),this.eyebrow=``,this.heading=``,this.lead=``,this.as=`h2`,this.layout=`stacked`,this._hasLead=!1}willUpdate(e){e.has(`layout`)&&(this.layout=c(this.layout,{allowed:u,fallback:`stacked`}))}_onLeadSlot(e){this._hasLead=e.target.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.ELEMENT_NODE||e.textContent.trim())}render(){let e=this.lead||this._hasLead;return t`
      <header class="bd-ensemble root">
        ${this.eyebrow?t`<bd-p variant="eyebrow" class="eyebrow"><span class="text">${this.eyebrow}</span></bd-p>`:r}
        <div class="row">
          <bd-h as="${this.as}" visual-level="h2" class="heading"><span class="text">${this.heading}</span></bd-h>
          <div class="lead" ?hidden=${!e}>
            <slot name="lead" @slotchange=${this._onLeadSlot}><span class="text">${this.lead}</span></slot>
          </div>
        </div>
      </header>
    `}};customElements.define(`bd-section-header`,d);export{d as SectionHeader};