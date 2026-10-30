import{c as e,t}from"./lit.js";import{c as n}from"./repobit-dex-system-design3.js";var r=/* @__PURE__ */ new Map,i=e`
  :host(:dir(rtl)) svg {
    scale: -1 1;
  }
`,a=(e,t)=>{let n=`${e}|${t}`,i=r.get(n);return i||(i=new CSSStyleSheet,i.replaceSync(`:host { --bd-icon-size: ${e}; }`+(t?` svg { color: ${t}; }`:``)),r.set(n,i)),i},o=class extends t{static properties={size:{type:String,reflect:!0},color:{type:String},width:{type:Number},height:{type:Number}};static defaultSize=`md`;static styles=e`
    :host {
      display: inline-flex;
      /* --bd-icon-size is component-local and always set by the instance
         sheet below, so the fallback is only reached if a subclass forgets to
         call super. */
      height: var(--bd-icon-size, var(--icon-md-size));
    }

    /* Whether an icon shows at all is the platform's question, not a prop this
       element should invent: <bd-plus-icon hidden> is what a consumer will
       reach for. It did not work. The UA sheet's [hidden] { display: none } is
       an unlayered type rule on the element, and the :host rule above beats it,
       so every icon in this package ignored the attribute -- measured before
       this: a hidden bd-check-icon still computed inline-flex and still
       occupied 16x16.
       .
       One rule restores it for all of them, and nothing new has to be learned
       or documented: hidden is hidden. */
    :host([hidden]) {
      display: none;
    }

    svg {
      display: block;
      height: 100%;
      /* auto, not 100%: the viewBox carries the aspect ratio, so an icon drawn
         48x49 stays 48x49 rather than being squashed square */
      width: auto;
    }
  `;constructor(){super(),this.size=``,this.color=``,this.width=null,this.height=null}willUpdate(){let e=this.height??this.width,{defaultSize:t}=this.constructor,r=n(this.size)||n(t)||t,i=Number.isFinite(e)?`${e}px`:r,o=this.color&&CSS.supports(`color`,this.color)?this.color:``;this._baseSheets??=this.renderRoot.adoptedStyleSheets;let s=a(i,o);this._instanceSheet!==s&&(this._instanceSheet=s,this.renderRoot.adoptedStyleSheets=[...this._baseSheets,s])}};export{i as n,o as t};