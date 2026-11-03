import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i,t as a}from"../../../../../lit/decorators.js";import{n as o,t as s}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import"../paragraph/paragraph.js";import{t as c}from"../shared/ensemble.css.js";import"../link/link.js";import"../image/image.js";var l=r`:host(bd-compare-section){box-sizing:border-box;--cs-bar-primary-fg:var(--status-brand-on-fill);--cs-bar-primary-bg:var(--status-brand-fill);--cs-bar-secondary-bg:var(--color-neutral-100);--cs-bar-track-bg:transparent;--cs-bar-track-border:var(--color-border-subtle);--cs-bar-height:var(--dimension-48);--cs-gap:var(--spacing-32);--cs-section-text:var(--color-text-primary);width:100%;display:block;container-type:inline-size}:host(compare-card){height:100%;display:block}:host(compare-bar){width:100%;display:block}.cs-sr-only{clip-path:inset(50%);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.cs-section{padding-block:var(--spacing-0);box-sizing:border-box;background:0 0}.cs-heading{text-align:center;max-width:var(--grid-container-max-md);margin:0 auto var(--spacing-40)}.cs-title{margin:0 0 var(--spacing-8);color:var(--cs-section-text)}.cs-subtitle{color:var(--cs-section-text);margin:0}.cs-grid{grid-template-columns:repeat(var(--_cols,2), minmax(0, 598px));gap:var(--cs-gap);justify-content:center;align-items:stretch;margin:0 auto;display:grid}@container (width<768px){.cs-grid{grid-template-columns:1fr}}.cs-grid>::slotted(compare-card[layout=horizontal]){grid-column:1/-1}.cs-grid>::slotted(compare-card:not([layout=horizontal])){grid-row:span 3;grid-template-rows:subgrid;row-gap:var(--spacing-24);display:grid}.card{background:var(--color-surface-container);border-radius:var(--card-radius);padding:var(--card-padding);grid-row:1/-1;grid-template-rows:subgrid;row-gap:var(--spacing-24);box-sizing:border-box;align-content:start;height:100%;display:grid}.card-header{align-items:flex-start;gap:var(--spacing-8);flex-direction:column;flex:none;display:flex}.card-icon-wrap{width:var(--icon-2xl-size);height:var(--icon-2xl-size);flex-shrink:0}.card-icon-wrap bd-img{width:100%;height:100%;display:block}.card-text-wrap{gap:var(--spacing-8);flex-direction:column;align-self:stretch;display:flex}.card-title,.card-description{margin:0}.card-bars{gap:var(--spacing-8);flex-direction:column;flex:none;align-self:stretch;display:flex}.card-footnote{color:var(--color-text-primary);flex:none;margin:0}.card>.card-bars,.card>.card-footnote{align-self:start}.card--horizontal{align-items:stretch;gap:var(--spacing-40);grid-template-columns:1fr 1fr;display:grid}.card-left{gap:var(--spacing-16);flex-direction:column;display:flex}slot[name=header]{display:contents}::slotted([slot=header]){flex-direction:column;display:flex}.card-left-top{align-items:center;gap:var(--spacing-12);display:flex}.card--horizontal .card-icon-wrap{width:var(--dimension-40);height:var(--dimension-40)}.card--horizontal .card-description{margin:0}.card--horizontal .card-footnote{margin-top:auto}.card-right{flex-direction:column;justify-content:center;display:flex}@media (width<768px){.card--horizontal{grid-template-columns:1fr}.card--horizontal .card-footnote{margin-top:0}.card-text-wrap .card-title{--typography-heading-h4-fontSize:var(--typography-heading-h5-fontSize);--typography-heading-h4-fontWeight:var(--typography-heading-h5-fontWeight);--typography-heading-h4-lineHeight:var(--typography-heading-h5-lineHeight);--typography-heading-h4-letterSpacing:var(--typography-heading-h5-letterSpacing);--typography-heading-h4-fontFamily:var(--typography-heading-h5-fontFamily)}.card-text-wrap .card-description{--typography-body-regular-fontSize:var(--typography-body-small-fontSize);--typography-body-regular-fontWeight:var(--typography-body-small-fontWeight);--typography-body-regular-lineHeight:var(--typography-body-small-lineHeight);--typography-body-regular-letterSpacing:var(--typography-body-small-letterSpacing)}}@container (width<768px){.card--horizontal{grid-template-columns:1fr}.card--horizontal .card-footnote{margin-top:0}.card-text-wrap .card-title{--typography-heading-h4-fontSize:var(--typography-heading-h5-fontSize);--typography-heading-h4-fontWeight:var(--typography-heading-h5-fontWeight);--typography-heading-h4-lineHeight:var(--typography-heading-h5-lineHeight);--typography-heading-h4-letterSpacing:var(--typography-heading-h5-letterSpacing);--typography-heading-h4-fontFamily:var(--typography-heading-h5-fontFamily)}.card-text-wrap .card-description{--typography-body-regular-fontSize:var(--typography-body-small-fontSize);--typography-body-regular-fontWeight:var(--typography-body-small-fontWeight);--typography-body-regular-lineHeight:var(--typography-body-small-lineHeight);--typography-body-regular-letterSpacing:var(--typography-body-small-letterSpacing)}.cs-title{--typography-heading-h3-fontSize:var(--typography-heading-h4-fontSize);--typography-heading-h3-fontWeight:var(--typography-heading-h4-fontWeight);--typography-heading-h3-lineHeight:var(--typography-heading-h4-lineHeight);--typography-heading-h3-letterSpacing:var(--typography-heading-h4-letterSpacing);--typography-heading-h3-fontFamily:var(--typography-heading-h4-fontFamily)}.cs-subtitle{--typography-body-regular-fontSize:var(--typography-body-small-fontSize);--typography-body-regular-fontWeight:var(--typography-body-small-fontWeight);--typography-body-regular-lineHeight:var(--typography-body-small-lineHeight);--typography-body-regular-letterSpacing:var(--typography-body-small-letterSpacing)}}.bar-track{height:var(--cs-bar-height,var(--dimension-48));border-radius:var(--shape-radius-xl);background:var(--cs-bar-track-bg,transparent);border:var(--border-width-1) solid var(--cs-bar-track-border,var(--color-border-subtle));box-sizing:border-box;position:relative;overflow:hidden}.bar-fill{justify-content:space-between;align-items:center;gap:var(--spacing-8);max-width:100%;height:100%;padding:0 var(--spacing-16);box-sizing:border-box;transition:width calc(var(--transition-duration-slower) + .3s) cubic-bezier(.22, 1, .36, 1);background:0 0;min-width:0;display:flex;position:absolute;inset:0 auto 0 0}:host(compare-bar.compare-no-motion) .bar-fill{transition:none}@media (prefers-reduced-motion:reduce){.bar-fill{transition:none}}.bar-label{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;overflow:hidden}.bar-score{flex:none}.bar-label,.bar-score{font-family:var(--typography-fontFamily-sans);font-size:var(--typography-body-regular-fontSize);line-height:var(--typography-body-regular-lineHeight);letter-spacing:var(--typography-body-regular-letterSpacing)}.bar-score{font-variant-numeric:tabular-nums}:host(compare-bar[variant=primary]) .bar-fill{background:var(--cs-bar-primary-bg,var(--status-brand-fill))}:host(compare-bar[variant=primary]) .bar-label,:host(compare-bar[variant=primary]) .bar-score{color:var(--cs-bar-primary-fg,var(--status-brand-on-fill));font-weight:var(--typography-fontWeight-semibold)}:host(compare-bar[variant=secondary]) .bar-fill,:host(compare-bar:not([variant])) .bar-fill{background:var(--cs-bar-secondary-bg,var(--color-neutral-100))}:host(compare-bar[variant=secondary]) .bar-label,:host(compare-bar:not([variant])) .bar-label,:host(compare-bar[variant=secondary]) .bar-score,:host(compare-bar:not([variant])) .bar-score{color:var(--color-text-primary);font-weight:var(--typography-body-regular-fontWeight)}:host(bd-compare-section.theme-green){--cs-bar-primary-bg:var(--status-success-fill);--cs-bar-primary-fg:var(--status-success-on-fill)}:host(bd-compare-section.theme-red){--cs-bar-primary-bg:var(--status-error-fill);--cs-bar-primary-fg:var(--status-error-on-fill)}:host(bd-compare-section.theme-purple){--cs-bar-primary-bg:#7c3aed;--cs-bar-primary-fg:var(--color-neutral-0)}:host(bd-compare-section.theme-dark){--cs-bar-primary-bg:var(--color-brand-400);--cs-bar-primary-fg:var(--color-text-primary);--cs-section-text:var(--color-text-inverse)}:host(bd-compare-section.bars-tall){--cs-bar-height:var(--dimension-56)}:host(bd-compare-section.bars-compact){--cs-bar-height:var(--dimension-40);--cs-gap:var(--spacing-24)}`,u,d,f;function p(e){let t=getComputedStyle(e);return{stretch:t.getPropertyValue(`--cs-bar-stretch`).trim()!==`0`,rMinStr:t.getPropertyValue(`--cs-stretch-r-min`).trim(),fillMin:parseFloat(t.getPropertyValue(`--cs-bar-fill-min`).trim()),gamma:parseFloat(t.getPropertyValue(`--cs-bar-stretch-gamma`).trim())}}var m=800,h=e=>1-(1-e)**3,g=!1,_=0;function v(){return!g&&!b()}function y(){g||_||(_=setTimeout(()=>{_=0,g=!0},920))}function b(){try{return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}catch{return!1}}var x=class extends n{static{u=this}static{this.styles=[l]}constructor(){super(),this.label=``,this.score=0,this.maxScore=6,this.variant=`secondary`,this.scoreLabel=``,this.referenceScore=0,this.scale=1,this._animatedScore=NaN,this._scoreAnimRaf=0,this._internals=this.attachInternals?.(),this._internals&&(this._internals.role=`meter`)}connectedCallback(){super.connectedCallback(),v()?(y(),this._shouldAnimateCompetitorScore()&&(this._animatedScore=this._scoreAnimStart())):this.classList.add(`compare-no-motion`)}disconnectedCallback(){super.disconnectedCallback(),this._cancelScoreAnim()}updated(e){super.updated(e),this._syncMeter(),[`score`,`referenceScore`,`scoreLabel`,`variant`,`maxScore`,`label`].some(t=>e.has(t))&&(this._cancelScoreAnim(),v()?this._shouldAnimateCompetitorScore()?(this._animatedScore=this._scoreAnimStart(),this._runScoreAnim()):this._animatedScore=NaN:(this.classList.add(`compare-no-motion`),this._animatedScore=NaN))}_shouldAnimateCompetitorScore(){return this.variant===`primary`||this.scoreLabel?!1:Number.isFinite(parseFloat(String(this.score)))}_scoreAnimStart(){let e=parseFloat(String(this.score)),t=parseFloat(String(this.referenceScore)),n=parseFloat(String(this.maxScore))||6,r=t>0?t:n;return r<=e&&(r=Math.min(n,e+.2)),r}_cancelScoreAnim(){this._scoreAnimRaf&&=(cancelAnimationFrame(this._scoreAnimRaf),0)}_runScoreAnim(){let e=parseFloat(String(this.score)),t=this._animatedScore;if(!Number.isFinite(e)||!Number.isFinite(t))return;let n=performance.now(),r=i=>{let a=Math.min(1,(i-n)/m),o=h(a);this._animatedScore=t+(e-t)*o,a<1?this._scoreAnimRaf=requestAnimationFrame(r):(this._scoreAnimRaf=0,this._animatedScore=NaN,this.requestUpdate())};this._scoreAnimRaf=requestAnimationFrame(r)}get _pct(){let e=parseFloat(String(this.score))||0;if(this.variant===`primary`)return 100;let t=parseFloat(String(this.referenceScore));if(t>0){let n=Math.min(1,Math.max(0,e/t)),r=n*100,{stretch:i,rMinStr:a,fillMin:o,gamma:s}=p(this);if(!i||!a||a===`none`)return Math.min(100,Math.max(0,r));let c=parseFloat(a);if(Number.isNaN(c)||c>=1-1e-9)return Math.min(100,Math.max(0,r));let l=1-c,u=Number.isFinite(o)?o:50,d=Number.isFinite(s)&&s>0?s:1,f=(n-c)/l,m=u+Math.min(1,Math.max(0,f))**+d*(100-u);return Math.min(100,Math.max(0,m))}let n=parseFloat(String(this.maxScore))||6;return n===0?0:Math.min(100,Math.max(0,e/n*100))*(this.scale||1)}get _displayScore(){return this.scoreLabel||this.score}_renderScoreText(){return this.variant===`primary`||this.scoreLabel?this._displayScore:Number.isFinite(this._animatedScore)?u._formatScoreTick(this._animatedScore):this._displayScore}static _formatScoreTick(e){return(Math.round(e*100)/100).toFixed(2)}_syncMeter(){let e=this._internals;if(!e)return;let t=this.maxScore??6,n=parseFloat(String(this.score));e.ariaLabel=this.label,e.ariaValueMin=`0`,e.ariaValueMax=String(t),e.ariaValueNow=Number.isFinite(n)?String(n):null,e.ariaValueText=`score ${this.scoreLabel||this.score} out of ${t}`}render(){return e`
      <div class="bar-track">
        <div class="bar-fill" style="width: ${this._pct}%">
          <span class="bar-label" aria-hidden="true">${this.label}</span>
          <span class="bar-score" aria-hidden="true">${this._renderScoreText()}</span>
        </div>
      </div>
    `}};s([i({type:String})],x.prototype,`label`,void 0),s([i({type:Number})],x.prototype,`score`,void 0),s([i({type:Number,attribute:`max-score`})],x.prototype,`maxScore`,void 0),s([i({type:String})],x.prototype,`variant`,void 0),s([i({type:String,attribute:`score-label`})],x.prototype,`scoreLabel`,void 0),s([i({type:Number,attribute:`reference-score`})],x.prototype,`referenceScore`,void 0),s([i({type:Number})],x.prototype,`scale`,void 0),s([a()],x.prototype,`_animatedScore`,void 0),x=u=s([o(`compare-bar`)],x);var S=class extends n{static{d=this}static{this._idSeq=0}static{this.styles=[l]}constructor(){super(),this.title=``,this.description=``,this.footnote=``,this.footnoteHref=``,this.iconSrc=``,this.layout=``,this.barStretch=!0,this.barFillMin=50,this.barStretchGamma=1,this.chartScale=6;let e=++d._idSeq;this._headingId=`compare-card-title-${e}`,this._chartHelpId=`compare-card-chart-${e}`}firstUpdated(){this._syncBarStretch()}updated(e){super.updated(e),(e.has(`barFillMin`)||e.has(`barStretchGamma`)||e.has(`barStretch`))&&this._syncBarStretch()}_syncBarStretch(){let e=this.shadowRoot?.querySelector(`slot`);e&&(()=>{let t=e.assignedElements({flatten:!0}).filter(e=>e.localName===`compare-bar`);if(!this.barStretch){this.style.setProperty(`--cs-bar-stretch`,`0`),this._refreshBars(t);return}let n=t.find(e=>e.variant===`primary`),r=n?parseFloat(String(n.score)):0;if(!r||r<=0||t.filter(e=>e.variant!==`primary`).length<2){this.style.setProperty(`--cs-bar-stretch`,`0`),this._refreshBars(t);return}let i=1;for(let e of t){if(e.variant===`primary`)continue;let t=parseFloat(String(e.score));Number.isNaN(t)||(i=Math.min(i,t/r))}i>=1-1e-6?this.style.setProperty(`--cs-bar-stretch`,`0`):(this.style.setProperty(`--cs-bar-stretch`,`1`),this.style.setProperty(`--cs-stretch-r-min`,String(i)),this.style.setProperty(`--cs-bar-fill-min`,String(this.barFillMin)),this.style.setProperty(`--cs-bar-stretch-gamma`,String(this.barStretchGamma))),this._refreshBars(t)})()}_refreshBars(e){queueMicrotask(()=>{e.forEach(e=>e.requestUpdate?.())})}_renderFootnote(){if(!this.footnote)return``;if(!this.footnoteHref)return e`<bd-p variant="xsmall" class="card-footnote">${this.footnote}</bd-p>`;let t=this.footnote.indexOf(`Source `);if(t===-1)return e`
        <bd-p variant="xsmall" class="card-footnote">
          <bd-link href="${this.footnoteHref}" target="_blank" font-size="xs" color="strong" underline>
            ${this.footnote}
          </bd-link>
        </bd-p>
      `;let n=this.footnote.slice(0,t+7),r=this.footnote.slice(t+7);return e`
      <bd-p variant="xsmall" class="card-footnote">
        ${n}<bd-link href="${this.footnoteHref}" target="_blank" font-size="xs" color="strong" underline>${r}</bd-link>
      </bd-p>
    `}_renderHorizontal(){return e`
      <article
        class="card card--horizontal"
        aria-labelledby="${this._headingId}"
        aria-describedby="${this._chartHelpId}"
      >
        <p class="cs-sr-only" id="${this._chartHelpId}">
          Bar lengths are scaled for visibility between brands. Use the announced scores for exact values; scale is out of ${this.chartScale}.
        </p>

        <div class="card-left">
          <slot name="header">
            <div class="card-left-top">
              ${this.iconSrc?e`
                <div class="card-icon-wrap" aria-hidden="true">
                  <bd-img
                    src="${this.iconSrc}"
                    alt=""
                    width="40"
                    height="40"
                    fit="contain"
                    radius="none"
                    shadow="none"
                    loading="eager"
                  ></bd-img>
                </div>
              `:``}
              <bd-h as="h3" class="card-title" id="${this._headingId}">${this.title}</bd-h>
            </div>
            ${this.description?e`
              <bd-p variant="regular" class="card-description">${this.description}</bd-p>
            `:``}
            ${this._renderFootnote()}
          </slot>
        </div>

        <div class="card-right">
          <div class="card-bars" role="group" aria-label="Scores by brand">
            <slot @slotchange=${this._syncBarStretch}></slot>
          </div>
        </div>
      </article>
    `}render(){return this.layout===`horizontal`?this._renderHorizontal():e`
      <article
        class="card"
        aria-labelledby="${this._headingId}"
        aria-describedby="${this._chartHelpId}"
      >
        <p class="cs-sr-only" id="${this._chartHelpId}">
          Bar lengths are scaled for visibility between brands. Use the announced scores for exact values; scale is out of ${this.chartScale}.
        </p>

        <div class="card-header">
          ${this.iconSrc?e`
              <div class="card-icon-wrap" aria-hidden="true">
                <bd-img
                  src="${this.iconSrc}"
                  alt=""
                  width="48"
                  height="48"
                  fit="contain"
                  radius="none"
                  shadow="none"
                  loading="eager"
                ></bd-img>
              </div>
            `:``}
          <div class="card-text-wrap">
            <bd-h as="h4" class="card-title" id="${this._headingId}">${this.title}</bd-h>
            ${this.description?e`
                <bd-p variant="regular" class="card-description">
                  ${this.description}
                </bd-p>
              `:``}
          </div>
        </div>

        <div class="card-bars" role="group" aria-label="Scores by brand">
          <slot @slotchange=${this._syncBarStretch}></slot>
        </div>

        ${this._renderFootnote()}
      </article>
    `}};s([i({type:String})],S.prototype,`title`,void 0),s([i({type:String})],S.prototype,`description`,void 0),s([i({type:String})],S.prototype,`footnote`,void 0),s([i({type:String,attribute:`footnote-href`})],S.prototype,`footnoteHref`,void 0),s([i({type:String,attribute:`icon-src`})],S.prototype,`iconSrc`,void 0),s([i({type:String})],S.prototype,`layout`,void 0),s([i({type:Boolean,attribute:`bar-stretch`})],S.prototype,`barStretch`,void 0),s([i({type:Number,attribute:`bar-fill-min`})],S.prototype,`barFillMin`,void 0),s([i({type:Number,attribute:`bar-stretch-gamma`})],S.prototype,`barStretchGamma`,void 0),s([i({type:Number,attribute:`chart-scale`})],S.prototype,`chartScale`,void 0),S=d=s([o(`compare-card`)],S);var C=class extends n{static{f=this}static{this._idSeq=0}static{this.styles=[c,l]}constructor(){super(),this.title=``,this.subtitle=``,this.columns=2,this.gap=``,this._sectionTitleId=`bd-compare-section-title-${++f._idSeq}`}firstUpdated(){y()}render(){let n=this.gap?`--_cols: ${this.columns}; --cs-gap: ${this.gap}`:`--_cols: ${this.columns}`;return e`
      <section
        class="bd-ensemble cs-section"
        aria-labelledby="${this.title?this._sectionTitleId:t}"
      >
        ${this.title||this.subtitle?e`
            <div class="cs-heading">
              ${this.title?e`<bd-h as="h3" class="cs-title" id="${this._sectionTitleId}">${this.title}</bd-h>`:``}
              ${this.subtitle?e`
                  <bd-p variant="regular" class="cs-subtitle">
                    ${this.subtitle}
                  </bd-p>
                `:``}
            </div>
          `:``}

        <div class="cs-grid" style="${n}">
          <slot></slot>
        </div>
      </section>
    `}};s([i({type:String})],C.prototype,`title`,void 0),s([i({type:String})],C.prototype,`subtitle`,void 0),s([i({type:Number})],C.prototype,`columns`,void 0),s([i({type:String})],C.prototype,`gap`,void 0),C=f=s([o(`bd-compare-section`)],C);export{x as CompareBar,S as CompareCard,C as CompareSection};