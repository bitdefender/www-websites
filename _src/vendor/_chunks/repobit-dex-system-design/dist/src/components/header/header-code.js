import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i,t as a}from"../../../../../lit/decorators.js";import{n as o,t as s}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import"../paragraph/paragraph.js";import{t as c}from"../shared/ensemble.css.js";import"../button/button.js";import"../terminal/terminal-message.js";var l=r`:host{font-family:var(--typography-fontFamily-sans);background-color:var(--color-surface-default);display:block;position:relative;overflow:clip}:host([variant=tint]){background-image:radial-gradient(ellipse 900px 560px at 84% 8%, color-mix(in srgb, var(--color-surface-brand) 16%, transparent), transparent 65%);background-repeat:no-repeat}:host([variant=tint]):after{content:"";transform-origin:50% 0;background:linear-gradient(color-mix(in srgb, var(--color-brand-500) 10%, transparent) 1px, transparent 1px) 0 0 / 100% 44px, linear-gradient(90deg, color-mix(in srgb, var(--color-brand-500) 10%, transparent) 1px, transparent 1px) 0 0 / 44px 100%;height:72%;mask-image:linear-gradient(transparent 0%, var(--color-neutral-1000) 45%, transparent 100%);pointer-events:none;z-index:0;position:absolute;inset-block-end:-38%;inset-inline:-20%;transform:perspective(620px)rotateX(64deg)}.bd-headercode-container{align-items:center;gap:var(--spacing-48);padding-block:var(--spacing-48);box-sizing:border-box;z-index:var(--z-base);grid-template-columns:1fr 1fr;display:grid;position:relative}@keyframes bd-headercode-fade-up{0%{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.bd-headercode-left,.bd-headercode-right{animation:bd-headercode-fade-up var(--transition-duration-slower) var(--transition-easing-ease-out) both}.bd-headercode-right{animation-delay:var(--transition-duration-fast)}@media (prefers-reduced-motion:reduce){.bd-headercode-left,.bd-headercode-right{animation:none}}.bd-headercode-left{align-items:flex-start;gap:var(--spacing-16);flex-direction:column;display:flex}.bd-headercode-breadcrumb{align-items:center;gap:var(--spacing-16);color:var(--color-text-subtle);font-family:var(--typography-fontFamily-mono);font-size:var(--typography-fontSize-xs);flex-wrap:wrap;display:flex}.bd-headercode-breadcrumb:not(:has(*)){display:none}.bd-headercode-eyebrow{color:var(--color-text-brand);margin:0}.bd-headercode-title{margin:0}.bd-headercode-description{color:var(--color-text-muted);max-width:480px;margin:0}.bd-headercode-cta{align-items:center;gap:var(--spacing-16);margin-top:var(--spacing-8);flex-wrap:wrap;display:inline-flex}.bd-headercode-badge{color:var(--color-text-muted);font-family:var(--typography-fontFamily-mono);font-size:var(--typography-fontSize-xs);letter-spacing:.05em;padding:var(--spacing-4) var(--spacing-12);border:1px solid var(--color-border-subtle);border-radius:var(--radius-full);background:var(--color-surface-default);align-items:center;display:inline-flex}.bd-headercode-badge:not(:has(*)){display:none}.bd-headercode-meta{flex-direction:column;width:100%;display:flex}.bd-headercode-meta-spec{color:var(--color-text-subtle);padding-top:var(--spacing-16);margin:0}.bd-headercode-meta-facts{gap:var(--spacing-8) var(--spacing-32);margin-top:var(--spacing-40);padding-top:var(--spacing-24);border-top:1px solid var(--color-border-container);grid-template-columns:repeat(3,auto);display:grid}.bd-headercode-meta-fact{align-items:baseline;gap:var(--spacing-8);white-space:nowrap;display:flex}.bd-headercode-meta-fact-label{color:var(--color-text-subtle);text-transform:uppercase;margin:0}.bd-headercode-meta-fact-value{color:var(--color-text-primary);margin:0}@media (width<576px){.bd-headercode-meta-facts{grid-template-columns:repeat(2,auto)}}.bd-headercode-right{align-items:flex-end;gap:var(--spacing-8);flex-direction:column;display:flex;position:relative}.bd-headercode-scene{perspective:1300px;width:100%;min-height:400px;padding:var(--spacing-16) 0;justify-content:flex-end;align-items:center;margin:0;display:flex;position:relative}.bd-headercode-stack{width:100%;max-width:520px;transform-style:preserve-3d;position:relative}:host([variant=tint]) .bd-headercode-stack{transform:perspective(1300px) rotateY(var(--ry,-10deg)) rotateX(var(--rx,6deg)) rotateZ(1deg);transition:transform var(--transition-duration-slow) var(--transition-easing-ease-out)}@media (prefers-reduced-motion:reduce){:host([variant=tint]) .bd-headercode-stack{transition:none}}.bd-headercode-right ::slotted(*){width:100%;box-shadow:0 1px 2px color-mix(in srgb, var(--color-neutral-1000) 20%, transparent), 0 18px 48px #000a1e73;z-index:var(--z-base);display:block;position:relative}@media (prefers-reduced-motion:reduce){:host([variant=tint]) .bd-headercode-stack{transform:none}}.bd-headercode-terminal-caption{color:var(--color-text-subtle);z-index:var(--z-base);margin:0;position:relative}.bd-headercode-rings{transform-style:preserve-3d;pointer-events:none;z-index:0;position:absolute;inset:0}.bd-headercode-ring{border-radius:var(--shape-radius-3xl);border:var(--border-width-2) solid color-mix(in srgb, var(--color-border-brand) calc((.5 - var(--d) * .08) * 100%), transparent);background:color-mix(in srgb, var(--color-surface-brand) calc((.05 - var(--d) * .008) * 100%), transparent);box-shadow:0 0 26px color-mix(in srgb, var(--color-brand-500) calc((.16 - var(--d) * .025) * 100%), transparent);animation:bd-headercode-ring-breathe 6s var(--transition-easing-smooth) calc(var(--d) * -1.2s) infinite;transform:translate(calc(var(--d) * 10px), calc(var(--d) * 8px));position:absolute;inset:0}@keyframes bd-headercode-ring-breathe{0%,to{opacity:.85}50%{opacity:var(--opacity-pulse)}}@media (prefers-reduced-motion:reduce){.bd-headercode-ring{animation:none}}.bd-headercode-annotation{z-index:var(--z-raised);pointer-events:none;position:absolute}.bd-headercode-annotation--top{inset-block-start:calc(-1 * var(--spacing-14));inset-inline-end:var(--spacing-32)}.bd-headercode-annotation--bottom{inset-block-end:calc(-1 * var(--spacing-14));inset-inline-start:var(--spacing-16);inset-inline-end:auto}.bd-headercode-annotation:not(:has(*)){display:none}.bd-headercode-annotation ::slotted(*){width:auto;max-width:none;box-shadow:0 4px 12px color-mix(in srgb, var(--color-neutral-1000) 12%, transparent);pointer-events:auto}@media (width<=899px){.bd-headercode-container{gap:var(--spacing-32);padding:var(--spacing-32) var(--spacing-24);grid-template-columns:1fr}.bd-headercode-right{align-items:stretch}.bd-headercode-scene{perspective:none;justify-content:stretch;min-height:0}.bd-headercode-stack{max-width:none}:host([variant=tint]) .bd-headercode-stack{transform:none}.bd-headercode-rings{display:none}.bd-headercode-description{max-width:none}.bd-headercode-annotation{display:none}}`,u=class extends n{static{this.styles=[c,l]}constructor(){super(),this.eyebrow=``,this.title=``,this.headingLevel=2,this.description=``,this.terminalCaption=``,this.variant=`default`,this.metaSpec=``,this.metaFacts=[],this._hasBadge=!1,this._scene=null,this._onPointerMove=this._onPointerMove.bind(this),this._onPointerLeave=this._onPointerLeave.bind(this)}firstUpdated(){this._bindScene()}updated(e){e.has(`variant`)&&this._bindScene()}disconnectedCallback(){super.disconnectedCallback(),this._unbindScene()}_bindScene(){this._unbindScene(),this.variant===`tint`&&(this._scene=this.shadowRoot?.querySelector(`.bd-headercode-scene`)||null,this._scene&&(this._scene.addEventListener(`pointermove`,this._onPointerMove),this._scene.addEventListener(`pointerleave`,this._onPointerLeave)))}_unbindScene(){this._scene&&=(this._scene.removeEventListener(`pointermove`,this._onPointerMove),this._scene.removeEventListener(`pointerleave`,this._onPointerLeave),null)}_onPointerMove(e){let t=this._scene.getBoundingClientRect(),n=(e.clientX-t.left)/t.width-.5,r=(e.clientY-t.top)/t.height-.5,i=n*18,a=-r*12;this.style.setProperty(`--rx`,`${a.toFixed(2)}deg`),this.style.setProperty(`--ry`,`${i.toFixed(2)}deg`)}_onPointerLeave(){this.style.removeProperty(`--rx`),this.style.removeProperty(`--ry`)}_onBadgeSlotChange(e){this._hasBadge=e.target.assignedNodes({flatten:!0}).length>0}_renderRings(){return this.variant===`tint`?e`
      <div class="bd-headercode-rings" aria-hidden="true">
        <span class="bd-headercode-ring" style="--d:1"></span>
        <span class="bd-headercode-ring" style="--d:2"></span>
        <span class="bd-headercode-ring" style="--d:3"></span>
        <span class="bd-headercode-ring" style="--d:4"></span>
        <span class="bd-headercode-ring" style="--d:5"></span>
      </div>
    `:t}_renderBadge(){let t=e`<slot name="badge" @slotchange=${this._onBadgeSlotChange}></slot>`;return this._hasBadge?e`<span class="bd-headercode-badge">${t}</span>`:e`<span class="bd-headercode-badge-slot-holder" hidden>${t}</span>`}_renderMeta(){let n=!!this.metaSpec,r=this.metaFacts&&this.metaFacts.length>0;return!n&&!r?t:e`
      <div class="bd-headercode-meta">
        ${n?e`<bd-p
              variant="xsmall"
              class="bd-headercode-meta-spec"
              font-family="mono"
              letter-spacing="widest"
            >${this.metaSpec}</bd-p>`:t}

        ${r?e`
              <div class="bd-headercode-meta-facts">
                ${this.metaFacts.map(t=>e`
                    <div class="bd-headercode-meta-fact">
                      <bd-p
                        variant="xsmall"
                        class="bd-headercode-meta-fact-label"
                        font-family="mono"
                        letter-spacing="widest"
                      >${t.label}</bd-p>
                      <bd-p variant="regular" font-weight="bold" class="bd-headercode-meta-fact-value">${t.value}</bd-p>
                    </div>
                  `)}
              </div>
            `:t}
      </div>
    `}get _headingTag(){let e=Number(this.headingLevel);return Number.isInteger(e)&&e>=1&&e<=6?`h${e}`:`h2`}render(){return e`
      <div class="bd-ensemble bd-headercode-container">
        <div class="bd-headercode-left">
          <div class="bd-headercode-breadcrumb">
            <slot name="breadcrumb"></slot>
          </div>

          ${this.eyebrow?e`<bd-p variant="eyebrow" class="bd-headercode-eyebrow">${this.eyebrow}</bd-p>`:t}

          <bd-h as="${this._headingTag}" visual-level="h1" class="bd-headercode-title">
            <slot name="title">${this.title}</slot>
          </bd-h>

          ${this.description?e`<bd-p variant="regular" class="bd-headercode-description">${this.description}</bd-p>`:t}

          <div class="bd-headercode-cta">
            <slot name="primary-button"></slot>
            <slot name="secondary-button"></slot>
            ${this._renderBadge()}
          </div>

          ${this._renderMeta()}
        </div>

        <div class="bd-headercode-right">
          <div class="bd-headercode-annotation bd-headercode-annotation--top">
            <slot name="annotation-top"></slot>
          </div>


          <div class="bd-headercode-scene">
            <div class="bd-headercode-stack">
              ${this._renderRings()}
              <slot name="terminal-content"></slot>
            </div>
          </div>

          <div class="bd-headercode-annotation bd-headercode-annotation--bottom">
            <slot name="annotation-bottom"></slot>
          </div>

          ${this.terminalCaption?e`<bd-p variant="small" class="bd-headercode-terminal-caption" font-family="mono"
>${this.terminalCaption}</bd-p>`:t}
        </div>
      </div>
    `}};s([i({type:String})],u.prototype,`eyebrow`,void 0),s([i({type:String})],u.prototype,`title`,void 0),s([i({type:Number,attribute:`heading-level`})],u.prototype,`headingLevel`,void 0),s([i({type:String})],u.prototype,`description`,void 0),s([i({type:String,attribute:`terminal-caption`})],u.prototype,`terminalCaption`,void 0),s([i({type:String,reflect:!0})],u.prototype,`variant`,void 0),s([i({type:String,attribute:`meta-spec`})],u.prototype,`metaSpec`,void 0),s([i({type:Array})],u.prototype,`metaFacts`,void 0),s([a()],u.prototype,`_hasBadge`,void 0),u=s([o(`bd-header-code`)],u);