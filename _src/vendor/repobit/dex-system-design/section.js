import{c as e,i as t,l as n,t as r}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import{n as i}from"../../_chunks/repobit-dex-system-design3.js";var a=e`
  :host {
    --bd-section-padding: var(--spacing-24);

    display: flex;
    flex-direction: column;
    gap: calc(var(--bd-section-padding) * 2);
    padding-block: var(--bd-section-padding);
  }

  @media ${n(i(`md`))} {
    :host {
      --bd-section-padding: var(--spacing-32);
    }
  }

  /* An edge is on or off, never another size: the block meets its neighbour
     there, and keeps the inset everywhere else. */
  :host([no-padding-top]) {
    padding-block-start: 0;
  }

  :host([no-padding-bottom]) {
    padding-block-end: 0;
  }
`,o=class extends r{static properties={noPaddingTop:{type:Boolean,reflect:!0,attribute:`no-padding-top`},noPaddingBottom:{type:Boolean,reflect:!0,attribute:`no-padding-bottom`}};static styles=[a];constructor(){super(),this.noPaddingTop=!1,this.noPaddingBottom=!1}render(){return t`<slot></slot>`}};customElements.define(`bd-section`,o);