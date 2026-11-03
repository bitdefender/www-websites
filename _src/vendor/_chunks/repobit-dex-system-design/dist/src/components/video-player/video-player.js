import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i,t as a}from"../../../../../lit/decorators.js";import{n as o,t as s}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../icons/close-icon.js";var c=r`:host{width:100%;display:block}.bd-video-thumb{cursor:pointer;border-radius:var(--shape-radius-lg);background:0 0;border:none;width:100%;padding:0;display:block;position:relative;overflow:hidden}.bd-video-thumb img{border-radius:var(--shape-radius-lg);width:100%;height:auto;transition:transform var(--transition-duration-slow) var(--transition-easing-ease);display:block}.bd-video-thumb:hover img{transform:scale(1.02)}.bd-video-play-btn{pointer-events:none;width:64px;height:64px;filter:drop-shadow(0 4px 12px color-mix(in srgb, var(--color-neutral-1000) 30%, transparent));transition:scale var(--transition-duration-slow) var(--transition-easing-ease);margin:auto;position:absolute;inset:0}.bd-video-thumb:hover .bd-video-play-btn{scale:1.1}.bd-video-play-btn svg{width:64px;height:64px}.bd-video-player{aspect-ratio:16/9;border-radius:var(--shape-radius-lg);background:var(--color-surface-media);width:100%;position:relative;overflow:hidden}.bd-video-player iframe,.bd-video-player video{border:none;width:100%;height:100%;position:absolute;top:0;left:0}.bd-video-close{top:var(--spacing-8);right:var(--spacing-8);background:color-mix(in srgb, var(--color-neutral-1000) 60%, transparent);width:32px;height:32px;color:var(--color-text-on-media);cursor:pointer;z-index:var(--z-raised);transition:background var(--transition-duration-fast) var(--transition-easing-ease);border:none;border-radius:50%;justify-content:center;align-items:center;font-size:16px;display:flex;position:absolute}.bd-video-close:hover{background:color-mix(in srgb, var(--color-neutral-1000) 90%, transparent)}.bd-video-thumb:focus-visible,.bd-video-close:focus-visible{outline:var(--border-width-2) solid transparent;outline-offset:var(--focus-outline-offset);box-shadow:var(--focus-outline-primary)}@media (prefers-reduced-motion:reduce){.bd-video-thumb img,.bd-video-play-btn,.bd-video-close{transition:none}.bd-video-thumb:hover img{transform:none}.bd-video-thumb:hover .bd-video-play-btn{scale:none}}`,l=class extends n{constructor(...e){super(...e),this.src=``,this.thumb=``,this.thumbAlt=``,this.videoTitle=``,this._open=!1}static{this.styles=[c]}_isYoutube(){return this.src.includes(`youtube.com`)||this.src.includes(`youtu.be`)}get _embedSrc(){if(!this.thumb)return this.src;try{let e=new URL(this.src,document.baseURI);return e.searchParams.set(`autoplay`,`1`),e.href}catch{return this.src}}_openVideo(){this._open=!0,this.thumb&&this.updateComplete.then(()=>{this.renderRoot?.querySelector(`.bd-video-close`)?.focus(),this._playOnOpen()})}_playOnOpen(){(this.renderRoot?.querySelector(`video`))?.play().catch(()=>{})}_closeVideo(){this._open=!1,this.updateComplete.then(()=>{this.renderRoot?.querySelector(`.bd-video-thumb`)?.focus()})}_renderVideo(){let n=!this.thumb&&!window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return e`
      <video
        src="${this.src}"
        poster="${this.thumb||t}"
        controls
        playsinline
        preload="${this.thumb?`none`:`metadata`}"
        ?autoplay=${n}
        ?muted=${n}
        .muted=${n}
      ></video>
    `}render(){return!this.thumb||this._open?e`
        <div class="bd-video-player">
          ${this._isYoutube()?e`
                <iframe
                  src="${this._embedSrc}"
                  title="${this.videoTitle||`Video player`}"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              `:this._renderVideo()}
          ${this.thumb?e`
                <button
                  class="bd-video-close"
                  @click=${this._closeVideo}
                  aria-label="Close video"
                >
                  <bd-close-icon size="xs" aria-hidden="true"></bd-close-icon>
                </button>
              `:``}
        </div>
      `:e`
      <button
        class="bd-video-thumb"
        @click=${this._openVideo}
        aria-label="Play video"
      >
        <img
          src="${this.thumb}"
          alt="${this.thumbAlt||`Video preview`}"
          loading="lazy"
        />
        <span class="bd-video-play-btn" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="white" fill-opacity="0.9"/>
            <path d="M26 20L46 32L26 44V20Z" fill="var(--color-brand-500)"/>
          </svg>
        </span>
      </button>
    `}};s([i({type:String})],l.prototype,`src`,void 0),s([i({type:String})],l.prototype,`thumb`,void 0),s([i({type:String,attribute:`thumb-alt`})],l.prototype,`thumbAlt`,void 0),s([i({type:String,attribute:`video-title`})],l.prototype,`videoTitle`,void 0),s([a()],l.prototype,`_open`,void 0),l=s([o(`bd-video-player`)],l);