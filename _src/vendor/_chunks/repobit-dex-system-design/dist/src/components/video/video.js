import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i,t as a}from"../../../../../lit/decorators.js";import{n as o,t as s}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";var c=r`:host{display:block}video{aspect-ratio:auto 16/9;border-radius:var(--shape-radius-lg);background:var(--color-surface-media);width:100%;height:auto;display:block}`,l=class extends n{constructor(...e){super(...e),this.src=``,this.poster=``,this.controls=!0,this.muted=!1,this.loop=!1,this.preload=`metadata`,this._media=[]}static{this.styles=[c]}connectedCallback(){super.connectedCallback(),this._collect(),this._observer=new MutationObserver(()=>this._collect()),this._observer.observe(this,{childList:!0,subtree:!0,attributes:!0})}disconnectedCallback(){this._observer?.disconnect(),super.disconnectedCallback()}_collect(){this._media=[...this.children].filter(e=>e.localName===`track`||e.localName===`source`).map(e=>e.cloneNode(!0))}render(){return e`
      <video
        src=${this.src||t}
        poster=${this.poster||t}
        ?controls=${this.controls}
        ?muted=${this.muted}
        .muted=${this.muted}
        ?loop=${this.loop}
        preload=${this.preload||t}
        playsinline
      >${this._media}</video>
    `}};s([i({type:String,attribute:`src`})],l.prototype,`src`,void 0),s([i({type:String,attribute:`poster`})],l.prototype,`poster`,void 0),s([i({attribute:`controls`,converter:{fromAttribute:e=>e!==`false`}})],l.prototype,`controls`,void 0),s([i({type:Boolean,attribute:`muted`})],l.prototype,`muted`,void 0),s([i({type:Boolean,attribute:`loop`})],l.prototype,`loop`,void 0),s([i({type:String,attribute:`preload`})],l.prototype,`preload`,void 0),s([a()],l.prototype,`_media`,void 0),l=s([o(`bd-video`)],l);export{l as BdVideo};