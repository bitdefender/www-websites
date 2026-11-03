import{a as e,l as t,n,t as r}from"../../_chunks/lit.js";import{n as i}from"../../_chunks/lit2.js";import{n as a,t as o}from"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import"../../_chunks/repobit-dex-system-design3.js";import{i as s}from"../../_chunks/repobit-dex-system-design4.js";import"../../_chunks/repobit-dex-system-design8.js";import{t as c}from"../../_chunks/repobit-dex-system-design9.js";import"../../_chunks/repobit-dex-system-design20.js";var l=`1.5rem`,u=(e,t,n)=>`(width >= ${s[n]}px) and (width >= calc(${e*t}px + ${e-1} * ${l}))`,d={maxColumns:2,equalColumns:3,minCardWidth:260},f=({maxColumns:e,equalColumns:t,minCardWidth:n})=>{let r=`:host(:not([variant="equal"]))`,i=`:host([variant="equal"])`,a=`
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
    `;return a},p=t`:host{box-sizing:border-box;width:100%;display:block}.bd-ensemble{container:bento/inline-size}:host([background=tint]) .bd-ensemble{background-color:var(--status-brand-surface);border-radius:var(--shape-radius-2xl);padding-block:var(--spacing-40)}.bd-bentogrid-header{align-items:flex-start;gap:var(--spacing-8);margin-bottom:var(--spacing-48);flex-direction:column;max-width:70ch;display:flex}.bd-bentogrid-eyebrow{color:var(--color-text-brand);margin:0;display:block}.bd-bentogrid-title{margin:0;display:block}.bd-bentogrid-description{color:var(--color-text-muted);margin:0;display:block}.bd-bentogrid-track{gap:var(--bd-bento-gap,var(--spacing-16));grid-auto-rows:var(--bd-bento-row-height,auto);width:100%;display:grid}@container bento (width>=576px){.bd-bentogrid-track{gap:var(--bd-bento-gap,var(--spacing-20))}}@container bento (width>=768px){.bd-bentogrid-track{gap:var(--bd-bento-gap,var(--spacing-24))}}:host(:not([variant=equal])) .bd-bentogrid-track,:host([variant=equal]) .bd-bentogrid-track{grid-template-columns:minmax(0,1fr)}:host(:not([variant=equal])) ::slotted(bd-bento-item),:host([variant=equal]) ::slotted(bd-bento-item){grid-column:auto}@container bento (width>=576px) and (width>=calc(520px + 1.5rem)){:host(:not([variant=equal])) .bd-bentogrid-track{grid-template-columns:repeat(24,minmax(0,1fr))}:host(:not([variant=equal])) ::slotted(bd-bento-item){grid-column:span var(--bd-bento-span,24)}:host([variant=equal]) .bd-bentogrid-track{grid-template-columns:repeat(2,minmax(0,1fr))}}@container bento (width>=768px) and (width>=calc(780px + 3rem)){:host([variant=equal]) .bd-bentogrid-track{grid-template-columns:repeat(3,minmax(0,1fr))}}::slotted(bd-bento-item){min-width:0}:host([variant=equal]) ::slotted(bd-bento-item[priority=featured]){grid-column:1/-1}`,m=t`:host{box-sizing:border-box;height:100%;display:block}:host([tone=brand]){width:100%;container:bento-item/inline-size}.bd-bentoitem-box{background:var(--color-surface-container);border-radius:var(--card-radius);padding:var(--card-padding);text-align:start;box-sizing:border-box;height:100%;font-family:var(--typography-fontFamily-sans);min-width:0;transition:transform var(--transition-duration-normal) var(--transition-easing-ease), box-shadow var(--transition-duration-normal) var(--transition-easing-ease);flex-direction:column;justify-content:flex-start;align-items:stretch;display:flex}@media (hover:hover){.bd-bentoitem-box:hover{box-shadow:0px 14px 40px color-mix(in srgb, var(--color-neutral-1000) 7%, transparent);transform:translateY(-3px)}}@media (prefers-reduced-motion:reduce){.bd-bentoitem-box{transition:none}.bd-bentoitem-box:hover{transform:none}}.bd-bentoitem-icon-wrap{justify-content:flex-start;align-items:flex-start;gap:var(--spacing-8);padding-bottom:var(--spacing-8);flex-direction:column;min-height:48px;display:flex}.bd-bentoitem-icon,::slotted([slot=icon]){object-fit:contain;width:48px;max-width:48px;height:48px;max-height:48px;display:block}.bd-bentoitem-title-wrap{align-items:flex-start;gap:var(--spacing-4);margin-bottom:var(--spacing-8);width:100%;display:flex;overflow:hidden}.bd-bentoitem-body{color:var(--color-text-secondary);width:100%;margin:0 0 1em}::slotted(bd-p){width:100%}:host([tone=tint]) .bd-bentoitem-box{background:var(--status-brand-surface)}:host([tone=dark]) .bd-bentoitem-box{background:linear-gradient(160deg, var(--color-surface-inverse) 0%, var(--color-brand-950) 130%)}:host([tone=dark]) .bd-bentoitem-title-wrap bd-h,:host([tone=dark]) .bd-bentoitem-body{color:var(--color-text-inverse)}@media (width<768px){.bd-bentoitem-box{padding:var(--card-padding-compact)}}:host([tone=brand]) .bd-bentoitem-box{gap:var(--spacing-24);padding:var(--spacing-24);background:var(--color-surface-brand);border-radius:var(--shape-radius-2xl);color:var(--color-brand-on-fill);flex-direction:column;display:flex;position:relative;overflow:hidden}@container bento-item (width<518px){:host([tone=brand]) .bd-bentoitem-cta{margin-block-start:auto}:host([tone=brand]) .bd-bentoitem-cta ::slotted(*){--bd-button-width:100%}}:host([tone=brand]) .bd-bentoitem-box:hover{box-shadow:none;transform:none}.bd-bentoitem-media{aspect-ratio:1;border-radius:var(--shape-radius-xl);position:relative;overflow:hidden;container-type:size}::slotted([slot=media]){object-fit:cover;width:100%;height:100%;display:block}::slotted(bd-motion-art[slot=media]){width:100cqh;height:auto;margin-block-start:-50cqh;margin-inline-start:-50cqh;position:absolute;inset-block-start:50%;inset-inline-start:50%}.bd-bentoitem-text{align-items:flex-start;gap:var(--spacing-12);flex-direction:column;display:flex}.bd-bentoitem-brand-title{margin:0}.bd-bentoitem-brand-body{font-family:var(--typography-body-regular-fontFamily);font-size:var(--typography-body-regular-fontSize);font-weight:var(--typography-body-regular-fontWeight);line-height:var(--typography-body-regular-lineHeight);letter-spacing:var(--typography-body-regular-letterSpacing);color:var(--color-brand-on-fill);margin:0}@container bento-item (width>=518px){:host([tone=brand]) .bd-bentoitem-box{padding:var(--spacing-32);border-radius:var(--shape-radius-3xl);grid-template:".media"1fr"text media""cta media"".media"1fr/300px minmax(0,1fr);gap:0;display:grid}:host([tone=brand][priority=featured]) .bd-bentoitem-box{grid-template-columns:42% minmax(0,1fr)}.bd-bentoitem-text{grid-area:text}.bd-bentoitem-cta{grid-area:cta;margin-block-start:var(--spacing-24)}.bd-bentoitem-media{aspect-ratio:auto;border-radius:var(--radius-none);margin-block:calc(-1 * var(--spacing-32));grid-area:media;margin-inline-end:calc(-1 * var(--spacing-32))}::slotted(bd-motion-art[slot=media]){width:max(100cqw,100cqh);margin-block-start:calc(max(100cqw,100cqh)/-2);margin-inline-start:0;inset-inline-start:0}}@container bento-item (656px<=width<880px){::slotted(bd-motion-art[slot=media]){width:max(100cqw,135cqh);margin-block-start:calc(max(100cqw,135cqh)/-2)}}.text,.bd-bentoitem-brand-body{white-space:pre-line}`,h=class extends r{constructor(...e){super(...e),this.title=``,this.body=``,this.icon=``,this.priority=`standard`,this.orientation=`auto`,this.tone=`default`,this.badge=``,this.as=`h3`}static{this.styles=[m]}connectedCallback(){super.connectedCallback(),this.hasAttribute(`role`)||this.setAttribute(`role`,`listitem`)}_renderBrand(){return e`
      <div class="bd-bentoitem-box bd-bentoitem-brand">
        <div class="bd-bentoitem-text">
          ${this.badge?e`<bd-badge tone="info" variant="shade" size="sm">${this.badge}</bd-badge>`:``}
          ${this.title?e`<bd-h as="${this.as}" visual-level="h3" color="on-brand" class="bd-bentoitem-brand-title"><span class="text">${this.title}</span></bd-h>`:``}
          ${this.body?e`<p class="bd-bentoitem-brand-body">${this.body}</p>`:``}
        </div>
        <div class="bd-bentoitem-media"><slot name="media"></slot></div>
        <div class="bd-bentoitem-cta"><slot></slot></div>
      </div>
    `}render(){return this.tone===`brand`?this._renderBrand():e`
      <div class="bd-bentoitem-box">
        <div class="bd-bentoitem-icon-wrap">
          <slot name="icon">
            ${this.icon?e`<img src="${this.icon}" alt="" class="bd-bentoitem-icon" />`:``}
          </slot>
        </div>

        ${this.title?e`
              <div class="bd-bentoitem-title-wrap">
                <bd-h as="h5" fontWeight="bold"><span class="text">${this.title}</span></bd-h>
              </div>
            `:``}

        ${this.body?e`<bd-p variant="regular" class="bd-bentoitem-body"><span class="text">${this.body}</span></bd-p>`:``}

        <slot></slot>
      </div>
    `}};o([i({type:String})],h.prototype,`title`,void 0),o([i({type:String})],h.prototype,`body`,void 0),o([i({type:String})],h.prototype,`icon`,void 0),o([i({type:String,reflect:!0})],h.prototype,`priority`,void 0),o([i({type:String,attribute:`orientation`})],h.prototype,`orientation`,void 0),o([i({type:String,reflect:!0})],h.prototype,`tone`,void 0),o([i({type:String})],h.prototype,`badge`,void 0),o([i({type:String})],h.prototype,`as`,void 0),h=o([a(`bd-bento-item`)],h);var g=/* @__PURE__ */ new Map,_=e=>{let t=JSON.stringify(e);if(!g.has(t)){let n=new CSSStyleSheet;n.replaceSync(f(e)),g.set(t,n)}return g.get(t)},v=class extends r{constructor(...e){super(...e),this.eyebrow=``,this.title=``,this.description=``,this.maxColumns=2,this.minCardWidth=260,this.wideShare=.7,this.variant=`weighted`,this.equalColumns=3,this.background=`none`}static{this.styles=[c,p]}updated(e){e.has(`wideShare`)&&this._applyWeights(),[`maxColumns`,`equalColumns`,`minCardWidth`].some(t=>e.has(t))&&this._adoptColumnRules()}get _items(){return[...this.children].filter(e=>e.tagName===`BD-BENTO-ITEM`)}_applyWeights(){let e=this._items,t=0,n=0,r=Math.round(this.wideShare*24),i=24-r;for(;t<e.length;){let a=e[t];if(a.getAttribute(`priority`)===`featured`){a.style.setProperty(`--bd-bento-span`,`24`),t+=1;continue}let o=e[t+1],s=o&&o.getAttribute(`priority`)===`featured`;if(!o||s){a.style.setProperty(`--bd-bento-span`,`24`),t+=1;continue}let c=n%3==0;a.style.setProperty(`--bd-bento-span`,String(c?r:i)),o.style.setProperty(`--bd-bento-span`,String(c?i:r)),t+=2,n+=1}}get _isBrandSet(){let e=this._items;return e.length>1&&e.every(e=>e.getAttribute(`tone`)===`brand`)}_applyRowHeight(){this._isBrandSet?this.style.setProperty(`--bd-bento-row-height`,`1fr`):this.style.removeProperty(`--bd-bento-row-height`)}_adoptColumnRules(){let e={maxColumns:Math.min(2,this.maxColumns),equalColumns:Math.max(1,this.equalColumns),minCardWidth:this.minCardWidth},t=Object.keys(e).every(t=>e[t]===d[t]),n=this.renderRoot,r=n.adoptedStyleSheets.filter(e=>![...g.values()].includes(e));n.adoptedStyleSheets=t?r:[...r,_(e)]}_onSlotChange(){this._applyRowHeight(),this._applyWeights()}render(){return e`
      <div class="bd-ensemble">
      ${this.eyebrow||this.title||this.description?e`
            <div class="bd-bentogrid-header">
              ${this.eyebrow?e`
                    <bd-p variant="eyebrow" class="bd-bentogrid-eyebrow">
                      <slot name="eyebrow">${this.eyebrow}</slot>
                    </bd-p>
                  `:n}

              ${this.title?e`
                    <bd-h as="h2" class="bd-bentogrid-title">
                      <slot name="title">${this.title}</slot>
                    </bd-h>
                  `:n}

              ${this.description?e`
                    <bd-p variant="regular" class="bd-bentogrid-description">
                      <slot name="description">${this.description}</slot>
                    </bd-p>
                  `:n}
            </div>
          `:n}

      <div class="bd-bentogrid-track" role="list">
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
      </div>
    `}};o([i({type:String})],v.prototype,`eyebrow`,void 0),o([i({type:String})],v.prototype,`title`,void 0),o([i({type:String})],v.prototype,`description`,void 0),o([i({type:Number,attribute:`max-columns`})],v.prototype,`maxColumns`,void 0),o([i({type:Number,attribute:`min-card-width`})],v.prototype,`minCardWidth`,void 0),o([i({type:Number,attribute:`wide-share`})],v.prototype,`wideShare`,void 0),o([i({type:String,reflect:!0})],v.prototype,`variant`,void 0),o([i({type:Number,attribute:`equal-columns`})],v.prototype,`equalColumns`,void 0),o([i({type:String,reflect:!0})],v.prototype,`background`,void 0),v=o([a(`bd-bento-grid`)],v);