import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import{o as s}from"../shared/token-scales.js";import"../paragraph/paragraph.js";import{t as c}from"../shared/ensemble.css.js";import"./bento-item.js";var l=`1.5rem`,u=(e,t,n)=>`(width >= ${s[n]}px) and (width >= calc(${e*t}px + ${e-1} * ${l}))`,d={maxColumns:2,equalColumns:3,minCardWidth:260},f=({maxColumns:e,equalColumns:t,minCardWidth:n})=>{let r=`:host(:not([variant="equal"]))`,i=`:host([variant="equal"])`,a=`
    ${r} .bd-bentogrid-track,
    ${i} .bd-bentogrid-track {
      grid-template-columns: minmax(0, 1fr);
    }

    ${r} ::slotted(bd-bento-item),
    ${i} ::slotted(bd-bento-item) {
      grid-column: auto;
    }
  `;e>=2&&(a+=`
      @container bento ${u(2,n,`sm`)} {
        ${r} .bd-bentogrid-track {
          grid-template-columns: repeat(24, minmax(0, 1fr));
        }

        ${r} ::slotted(bd-bento-item) {
          grid-column: span var(--bd-bento-span, 24);
        }
      }
    `);for(let e=2;e<=t;e+=1)a+=`
      @container bento ${u(e,n,e===2?`sm`:`md`)} {
        ${i} .bd-bentogrid-track {
          grid-template-columns: repeat(${e}, minmax(0, 1fr));
        }
      }
    `;return a},p=r`:host{box-sizing:border-box;width:100%;display:block}.bd-ensemble{container:bento/inline-size}:host([background=tint]) .bd-ensemble{background-color:var(--status-brand-surface);border-radius:var(--shape-radius-2xl);padding-block:var(--spacing-40)}.bd-bentogrid-header{align-items:flex-start;gap:var(--spacing-8);margin-bottom:var(--spacing-48);flex-direction:column;max-width:70ch;display:flex}.bd-bentogrid-eyebrow{color:var(--color-text-brand);margin:0;display:block}.bd-bentogrid-title{margin:0;display:block}.bd-bentogrid-description{color:var(--color-text-muted);margin:0;display:block}.bd-bentogrid-track{gap:var(--bd-bento-gap,var(--spacing-16));grid-auto-rows:var(--bd-bento-row-height,auto);width:100%;display:grid}@container bento (width>=576px){.bd-bentogrid-track{gap:var(--bd-bento-gap,var(--spacing-20))}}@container bento (width>=768px){.bd-bentogrid-track{gap:var(--bd-bento-gap,var(--spacing-24))}}:host(:not([variant=equal])) .bd-bentogrid-track,:host([variant=equal]) .bd-bentogrid-track{grid-template-columns:minmax(0,1fr)}:host(:not([variant=equal])) ::slotted(bd-bento-item),:host([variant=equal]) ::slotted(bd-bento-item){grid-column:auto}@container bento (width>=576px) and (width>=calc(520px + 1.5rem)){:host(:not([variant=equal])) .bd-bentogrid-track{grid-template-columns:repeat(24,minmax(0,1fr))}:host(:not([variant=equal])) ::slotted(bd-bento-item){grid-column:span var(--bd-bento-span,24)}:host([variant=equal]) .bd-bentogrid-track{grid-template-columns:repeat(2,minmax(0,1fr))}}@container bento (width>=768px) and (width>=calc(780px + 3rem)){:host([variant=equal]) .bd-bentogrid-track{grid-template-columns:repeat(3,minmax(0,1fr))}}::slotted(bd-bento-item){min-width:0}:host([variant=equal]) ::slotted(bd-bento-item[priority=featured]){grid-column:1/-1}`,m=/* @__PURE__ */ new Map,h=e=>{let t=JSON.stringify(e);if(!m.has(t)){let n=new CSSStyleSheet;n.replaceSync(f(e)),m.set(t,n)}return m.get(t)},g=class extends n{constructor(...e){super(...e),this.eyebrow=``,this.title=``,this.description=``,this.maxColumns=2,this.minCardWidth=260,this.wideShare=.7,this.variant=`weighted`,this.equalColumns=3,this.background=`none`}static{this.styles=[c,p]}updated(e){e.has(`wideShare`)&&this._applyWeights(),[`maxColumns`,`equalColumns`,`minCardWidth`].some(t=>e.has(t))&&this._adoptColumnRules()}get _items(){return[...this.children].filter(e=>e.tagName===`BD-BENTO-ITEM`)}_applyWeights(){let e=this._items,t=0,n=0,r=Math.round(this.wideShare*24),i=24-r;for(;t<e.length;){let a=e[t];if(a.getAttribute(`priority`)===`featured`){a.style.setProperty(`--bd-bento-span`,`24`),t+=1;continue}let o=e[t+1],s=o&&o.getAttribute(`priority`)===`featured`;if(!o||s){a.style.setProperty(`--bd-bento-span`,`24`),t+=1;continue}let c=n%3==0;a.style.setProperty(`--bd-bento-span`,String(c?r:i)),o.style.setProperty(`--bd-bento-span`,String(c?i:r)),t+=2,n+=1}}get _isBrandSet(){let e=this._items;return e.length>1&&e.every(e=>e.getAttribute(`tone`)===`brand`)}_applyRowHeight(){this._isBrandSet?this.style.setProperty(`--bd-bento-row-height`,`1fr`):this.style.removeProperty(`--bd-bento-row-height`)}_adoptColumnRules(){let e={maxColumns:Math.min(2,this.maxColumns),equalColumns:Math.max(1,this.equalColumns),minCardWidth:this.minCardWidth},t=Object.keys(e).every(t=>e[t]===d[t]),n=this.renderRoot,r=n.adoptedStyleSheets.filter(e=>![...m.values()].includes(e));n.adoptedStyleSheets=t?r:[...r,h(e)]}_onSlotChange(){this._applyRowHeight(),this._applyWeights()}render(){return e`
      <div class="bd-ensemble">
      ${this.eyebrow||this.title||this.description?e`
            <div class="bd-bentogrid-header">
              ${this.eyebrow?e`
                    <bd-p variant="eyebrow" class="bd-bentogrid-eyebrow">
                      <slot name="eyebrow">${this.eyebrow}</slot>
                    </bd-p>
                  `:t}

              ${this.title?e`
                    <bd-h as="h2" class="bd-bentogrid-title">
                      <slot name="title">${this.title}</slot>
                    </bd-h>
                  `:t}

              ${this.description?e`
                    <bd-p variant="regular" class="bd-bentogrid-description">
                      <slot name="description">${this.description}</slot>
                    </bd-p>
                  `:t}
            </div>
          `:t}

      <div class="bd-bentogrid-track" role="list">
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
      </div>
    `}};o([i({type:String})],g.prototype,`eyebrow`,void 0),o([i({type:String})],g.prototype,`title`,void 0),o([i({type:String})],g.prototype,`description`,void 0),o([i({type:Number,attribute:`max-columns`})],g.prototype,`maxColumns`,void 0),o([i({type:Number,attribute:`min-card-width`})],g.prototype,`minCardWidth`,void 0),o([i({type:Number,attribute:`wide-share`})],g.prototype,`wideShare`,void 0),o([i({type:String,reflect:!0})],g.prototype,`variant`,void 0),o([i({type:Number,attribute:`equal-columns`})],g.prototype,`equalColumns`,void 0),o([i({type:String,reflect:!0})],g.prototype,`background`,void 0),g=o([a(`bd-bento-grid`)],g);