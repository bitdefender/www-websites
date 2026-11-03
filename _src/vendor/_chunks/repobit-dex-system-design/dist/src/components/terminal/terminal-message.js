import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../paragraph/paragraph.js";import"../list/list-item/list-item.js";import"../list/list.js";import"./terminal-cursor.js";var s=r`:host{font-family:var(--typography-fontFamily-mono);color:var(--color-text-on-media);--bd-terminalmsg-subdued:var(--color-text-on-media-muted);--bd-terminalmsg-ask:var(--color-brand-400);--bd-terminalmsg-cmd:var(--color-text-on-media);--bd-terminalmsg-ok:#27c93f;--bd-terminalmsg-info:var(--color-brand-300);--bd-terminalmsg-warn:var(--color-yellow-400);background:var(--color-surface-media);border-radius:var(--shape-radius-xl);padding:var(--spacing-14) var(--spacing-16) var(--spacing-32);box-sizing:border-box;direction:ltr;display:block}:host([variant=flush]){padding:var(--spacing-18) var(--spacing-20)}.bd-terminalmsg-titlebar{align-items:center;gap:var(--spacing-8);padding-bottom:var(--spacing-16);display:flex}.bd-terminalmsg-dot{width:var(--spacing-8);height:var(--spacing-8);border-radius:50%;flex-shrink:0;display:inline-block}.bd-terminalmsg-dot--red{background:#ff5f56}.bd-terminalmsg-dot--yellow{background:#ffbd2e}.bd-terminalmsg-dot--green{background:#27c93f}.bd-terminalmsg-panel{border:var(--border-width-1) solid var(--color-border-container-inverse);border-radius:var(--shape-radius-lg);padding:var(--spacing-20) var(--spacing-20) calc(var(--spacing-20) + var(--spacing-8));position:relative}:host([variant=flush]) .bd-terminalmsg-panel{border:none;padding:0}.bd-terminalmsg-panel-label{top:0;left:var(--spacing-16);background:var(--color-surface-media);padding:0 var(--spacing-8);color:var(--bd-terminalmsg-subdued);font-family:var(--typography-fontFamily-mono);font-size:var(--typography-fontSize-xs);position:absolute;transform:translateY(-50%)}.bd-terminalmsg-body{font-size:var(--typography-body-small-fontSize);line-height:var(--typography-body-small-lineHeight)}.bd-terminalmsg-greeting-text{color:var(--bd-terminalmsg-ask);font-weight:var(--typography-fontWeight-bold)}.bd-terminalmsg-dim{color:var(--bd-terminalmsg-subdued)}.bd-terminalmsg-greeting,.bd-terminalmsg-intro{color:var(--color-text-on-media)}.bd-terminalmsg-list{padding-left:var(--spacing-16);margin:0 0 var(--spacing-12);display:block}.bd-terminalmsg-footer{color:var(--color-text-on-media);margin:0}.bd-terminalmsg-hint{bottom:0;left:var(--spacing-16);background:var(--color-surface-media);padding:0 var(--spacing-8);color:var(--bd-terminalmsg-subdued);font-family:var(--typography-fontFamily-mono);font-size:var(--typography-fontSize-xs);max-width:calc(100% - var(--spacing-32));position:absolute;transform:translateY(50%)}.bd-terminalmsg-hint-key{color:var(--color-text-on-media);font-weight:var(--typography-fontWeight-bold)}.bd-terminalmsg-caption{color:var(--bd-terminalmsg-subdued);font-size:var(--typography-body-xsmall-fontSize);margin-top:var(--spacing-16);padding-top:var(--spacing-12);border-top:var(--border-width-1) solid var(--color-border-container-inverse)}.bd-terminalmsg-lines{display:block;container:bd-terminalmsg-lines/inline-size}.bd-terminalmsg-l-cmd{color:var(--bd-terminalmsg-cmd);font-weight:var(--typography-fontWeight-bold)}.bd-terminalmsg-l-ok{color:var(--bd-terminalmsg-ok);padding-bottom:var(--spacing-12)}.bd-terminalmsg-l-ask{color:var(--bd-terminalmsg-ask);padding:var(--spacing-12) 0}.bd-terminalmsg-l-strong{color:var(--color-text-on-media);font-weight:var(--typography-fontWeight-bold);padding-top:var(--spacing-12)}.bd-terminalmsg-l-dim{color:var(--bd-terminalmsg-subdued)}.bd-terminalmsg-l-space{height:var(--spacing-12)}.bd-terminalmsg-l-sep{border:none;border-top:var(--border-width-1) solid var(--color-border-container-inverse);margin:var(--spacing-8) 0}.bd-terminalmsg-l-title{justify-content:space-between;align-items:center;gap:var(--spacing-12);color:var(--color-text-on-media);font-weight:var(--typography-fontWeight-bold);padding-bottom:var(--spacing-16);display:flex}.bd-terminalmsg-live{align-items:center;gap:var(--spacing-4);color:var(--bd-terminalmsg-ok);font-size:var(--typography-fontSize-xs);font-weight:var(--typography-fontWeight-bold);letter-spacing:var(--typography-letterSpacing-wider);flex-shrink:0;display:inline-flex}.bd-terminalmsg-live-dot{width:var(--spacing-6);height:var(--spacing-6);border-radius:var(--radius-full);background:var(--bd-terminalmsg-ok)}.bd-terminalmsg-l-row{align-items:start;column-gap:var(--spacing-12);padding:var(--spacing-8) 0;grid-template-columns:72px 1fr auto;display:grid}:host([variant=flush]) .bd-terminalmsg-l-row{border-top:var(--border-width-1) solid var(--color-border-container-inverse)}.bd-terminalmsg-l-row-label{color:var(--bd-terminalmsg-subdued);text-transform:uppercase;font-size:var(--typography-body-xsmall-fontSize);letter-spacing:var(--typography-letterSpacing-wider);padding-top:var(--spacing-2)}.bd-terminalmsg-l-row-text{color:var(--color-text-on-media);overflow-wrap:anywhere}.bd-terminalmsg-badge{padding:var(--spacing-2) var(--spacing-12);border-radius:var(--radius-full);font-size:var(--typography-fontSize-xs);font-weight:var(--typography-fontWeight-bold);white-space:nowrap;align-items:center;margin-top:1px;display:inline-flex}.bd-terminalmsg-badge--green{background:color-mix(in srgb, var(--bd-terminalmsg-ok) 15%, transparent);color:var(--bd-terminalmsg-ok)}.bd-terminalmsg-badge--blue{background:color-mix(in srgb, var(--bd-terminalmsg-info) 15%, transparent);color:var(--bd-terminalmsg-info)}.bd-terminalmsg-badge--amber{background:color-mix(in srgb, var(--bd-terminalmsg-warn) 15%, transparent);color:var(--bd-terminalmsg-warn)}.bd-terminalmsg-badge--neutral{background:color-mix(in srgb, var(--bd-terminalmsg-subdued) 15%, transparent);color:var(--bd-terminalmsg-subdued)}@container bd-terminalmsg-lines (width<=360px){.bd-terminalmsg-l-row{row-gap:var(--spacing-4);grid-template-columns:1fr}.bd-terminalmsg-l-row-label{padding-top:0}.bd-terminalmsg-badge{justify-self:start}}`,c=class extends n{constructor(...e){super(...e),this.showTitlebar=!1,this.panelLabel=``,this.dimText=``,this.greeting=``,this.icon=``,this.intro=``,this.items=[],this.footer=``,this.footerBold=``,this.showCursor=!1,this.hint=``,this.lines=[],this.caption=``,this.variant=`default`}static{this.styles=[s]}_renderTitlebar(){return this.variant===`flush`||!this.showTitlebar?t:e`
      <div class="bd-terminalmsg-titlebar">
        <span class="bd-terminalmsg-dot bd-terminalmsg-dot--red"></span>
        <span class="bd-terminalmsg-dot bd-terminalmsg-dot--yellow"></span>
        <span class="bd-terminalmsg-dot bd-terminalmsg-dot--green"></span>
      </div>
    `}_renderHint(){if(!this.hint)return t;let n=this.hint.split(/(\[[^\]]+\])/g);return e`
      <span class="bd-terminalmsg-hint">
        ${n.map(t=>/^\[[^\]]+\]$/.test(t)?e`<strong class="bd-terminalmsg-hint-key">${t}</strong>`:t)}
      </span>
    `}_renderLines(){return!this.lines||!this.lines.length?t:e`
      <div class="bd-terminalmsg-lines">
        ${this.lines.map(({type:n,text:r,label:i,badge:a,badgeColor:o,live:s})=>{switch(n){case`sep`:return e`<hr class="bd-terminalmsg-l-sep" />`;case`space`:return e`<div class="bd-terminalmsg-l-space" aria-hidden="true">&nbsp;</div>`;case`cmd`:return e`<div class="bd-terminalmsg-l-cmd">${r}</div>`;case`ok`:return e`<div class="bd-terminalmsg-l-ok">${r}</div>`;case`ask`:return e`<div class="bd-terminalmsg-l-ask">${r}</div>`;case`strong`:return e`<div class="bd-terminalmsg-l-strong">${r}</div>`;case`dim`:return e`<div class="bd-terminalmsg-l-dim">${r}</div>`;case`title`:return e`
                <div class="bd-terminalmsg-l-title">
                  <span>${r}</span>
                  ${s?e`<span class="bd-terminalmsg-live"><span class="bd-terminalmsg-live-dot"></span>LIVE</span>`:t}
                </div>
              `;case`row`:return e`
                <div class="bd-terminalmsg-l-row">
                  <span class="bd-terminalmsg-l-row-label">${i}</span>
                  <span class="bd-terminalmsg-l-row-text">${r}</span>
                  ${a?e`<span class="bd-terminalmsg-badge bd-terminalmsg-badge--${o||`neutral`}">${a}</span>`:t}
                </div>
              `;default:return e`<div class="bd-terminalmsg-l-dim">${r}</div>`}})}
      </div>
    `}render(){return e`
      ${this._renderTitlebar()}

      <div class="bd-terminalmsg-panel">
        ${this.panelLabel?e`<span class="bd-terminalmsg-panel-label">${this.panelLabel}</span>`:t}

        <div class="bd-terminalmsg-body">
          ${this._renderLines()}

          ${this.dimText?e`<bd-p variant="small" font-family="mono" paddingBottom="12" class="bd-terminalmsg-dim">${this.dimText}</bd-p>`:t}

          ${this.greeting?e`
                <bd-p variant="regular" font-family="mono" paddingBottom="12" class="bd-terminalmsg-greeting">
                  ${this.icon?e`${this.icon} `:t}
                  <span class="bd-terminalmsg-greeting-text">${this.greeting}</span>
                </bd-p>
              `:t}

          ${this.intro?e`<bd-p variant="regular" font-family="mono" paddingBottom="12" class="bd-terminalmsg-intro">${this.intro}</bd-p>`:t}

          ${this.items&&this.items.length?e`
                <bd-list class="bd-terminalmsg-list">
                  ${this.items.map(t=>e`<bd-li variant="bullet" size="sm" color="inverse">${t}</bd-li>`)}
                </bd-list>
              `:t}

          ${this.footer||this.footerBold?e`
                <bd-p variant="regular" font-family="mono" class="bd-terminalmsg-footer">
                  ${this.footerBold?e`<strong>${this.footerBold}</strong> `:t}
                  ${this.footer}
                  ${this.showCursor?e`<bd-terminal-cursor></bd-terminal-cursor>`:t}
                </bd-p>
              `:t}

          <slot></slot>

          ${this.caption?e`<div class="bd-terminalmsg-caption">${this.caption}</div>`:t}
        </div>

        ${this._renderHint()}
      </div>
    `}};o([i({type:Boolean,attribute:`show-titlebar`})],c.prototype,`showTitlebar`,void 0),o([i({type:String,attribute:`panel-label`})],c.prototype,`panelLabel`,void 0),o([i({type:String,attribute:`dim-text`})],c.prototype,`dimText`,void 0),o([i({type:String})],c.prototype,`greeting`,void 0),o([i({type:String})],c.prototype,`icon`,void 0),o([i({type:String})],c.prototype,`intro`,void 0),o([i({type:Array})],c.prototype,`items`,void 0),o([i({type:String})],c.prototype,`footer`,void 0),o([i({type:String,attribute:`footer-bold`})],c.prototype,`footerBold`,void 0),o([i({type:Boolean,attribute:`show-cursor`})],c.prototype,`showCursor`,void 0),o([i({type:String})],c.prototype,`hint`,void 0),o([i({type:Array})],c.prototype,`lines`,void 0),o([i({type:String})],c.prototype,`caption`,void 0),o([i({type:String,reflect:!0})],c.prototype,`variant`,void 0),c=o([a(`bd-terminal-message`)],c);