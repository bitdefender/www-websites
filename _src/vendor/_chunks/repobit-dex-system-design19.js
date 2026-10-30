import{c as e,i as t,n,t as r}from"./lit.js";import"./repobit-dex-system-design.js";import"./repobit-dex-system-design18.js";var i=e`
  :host {
    display: block;
    width: 100%;
  }

  .bd-video-thumb {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: var(--shape-radius-lg);
    overflow: hidden;
  }

  .bd-video-thumb img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: var(--shape-radius-lg);
    transition: transform var(--transition-duration-slow) var(--transition-easing-ease);
  }

  .bd-video-thumb:hover img {
    transform: scale(1.02);
  }

  .bd-video-play-btn {
    /* Centred by inset and auto margins, so the hover can scale it without
       restating a centring transform. */
    position: absolute;
    inset: 0;
    margin: auto;
    width: 64px;
    height: 64px;
    pointer-events: none;
    /* no token: drop-shadow() takes one shadow with no spread, and every
       --shadow-* step is spelled with a spread (two layers from md up), so
       none of them parses here. 30% black, not a card's 10%, because the
       glyph sits on whatever frame the thumbnail shows -- mixed over the
       palette like the close button's ground below, the same pixels as the
       rgba it replaces. */
    filter: drop-shadow(0 4px 12px color-mix(in srgb, var(--color-neutral-1000) 30%, transparent));
    transition: scale var(--transition-duration-slow) var(--transition-easing-ease);
  }

  .bd-video-thumb:hover .bd-video-play-btn {
    scale: 1.1;
  }

  .bd-video-play-btn svg {
    width: 64px;
    height: 64px;
  }

  .bd-video-player {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: var(--shape-radius-lg);
    overflow: hidden;
    /* The media frame, --color-surface-media: around a video, dark in every theme.
       This read --color-surface-inverse until dark mode decision 15 -- the
       polarity flip, which would turn a letterbox light in a dark theme. */
    background: var(--color-surface-media);
  }

  .bd-video-player iframe,
  .bd-video-player video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  .bd-video-close {
    position: absolute;
    top: var(--spacing-8);
    right: var(--spacing-8);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    /* no role: NOT a scrim, though it looks like one next to the modal's. This
       is the close button's own ground -- a 32px circle that has to carry a
       white glyph over whatever frame the video happens to be showing, so the
       darkness is doing contrast work for the icon rather than dimming content
       behind a dialog. Two declarations, one control, no role.
       .
       Mixed over the palette rather than written as a raw rgba, for the same
       reason as the modal's scrim: this follows --color-neutral-1000 where a
       literal black follows nothing. Pixel-identical to the rgba it replaces. */
    background: color-mix(in srgb, var(--color-neutral-1000) 60%, transparent);
    color: var(--color-text-on-media);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Above the video surface it sits on; nothing else in this shadow root
       is positioned. */
    z-index: var(--z-raised);
    transition: background var(--transition-duration-fast) var(--transition-easing-ease);
  }

  .bd-video-close:hover {
    /* no role: the same control ground at 90% under the pointer -- it gets more
       opaque rather than changing hue. Same reasoning as the rest state above,
       and no role for the same reason. Pixel-identical to the rgba it
       replaces. */
    background: color-mix(in srgb, var(--color-neutral-1000) 90%, transparent);
  }

  /* The one focus ring, on both controls. This sheet had no :focus-visible
     rule at all, so the two buttons fell back to the browser's outline:
     measured on the thumbnail with a real Tab, outline 1px auto
     rgb(0, 95, 204) and box-shadow none, where every other control in this
     package draws --focus-outline-primary. The two-colour ring also matters
     more here than most places -- the close button sits on video, so a
     single-colour outline has no guaranteed ground to contrast against, and
     the white inner band is what makes it visible on any frame.

     The ring follows each control's own shape: the thumbnail keeps its
     --radius-lg corner and the close button is a circle. */
  .bd-video-thumb:focus-visible,
  .bd-video-close:focus-visible {
    /* forced-colors mode does not paint box-shadow, so the ring
       vanishes there; it does paint an outline, in a system colour. This one
       is transparent everywhere else, and the offset lands it on the ring's
       outer band. */
    outline: var(--border-width-2) solid transparent;
    outline-offset: var(--focus-outline-offset);
    box-shadow: var(--focus-outline-primary);
  }

  /* The thumbnail lifts on hover and the play mark grows. Measured before
     this: with prefers-reduced-motion: reduce both still reported a 0.3s
     transition, so the scale ran for a reader who asked for less motion.
     The transform is dropped as well as the transition -- a scale that
     arrives instantly is still motion the reader did not ask for. */
  @media (prefers-reduced-motion: reduce) {
    .bd-video-thumb img,
    .bd-video-play-btn,
    .bd-video-close {
      transition: none;
    }

    .bd-video-thumb:hover img {
      transform: none;
    }

    /* scale, not transform. This used to restate a translate(-50%, -50%)
       left from when the mark was centred by top/left 50%; it is centred by
       inset and auto margins now, so the translate threw it up and left by
       half its size on hover -- and the scale it was meant to cancel is
       the individual property, which a transform does not reset. */
    .bd-video-thumb:hover .bd-video-play-btn {
      scale: none;
    }
  }
`,a=class extends r{static properties={src:{type:String},thumb:{type:String},thumbAlt:{type:String,attribute:`thumb-alt`},videoTitle:{type:String,attribute:`video-title`},_open:{state:!0}};static styles=[i];constructor(){super(),this.src=``,this.thumb=``,this.thumbAlt=``,this.videoTitle=``,this._open=!1}_isYoutube(){return this.src.includes(`youtube.com`)||this.src.includes(`youtu.be`)}get _embedSrc(){if(!this.thumb)return this.src;try{let e=new URL(this.src,document.baseURI);return e.searchParams.set(`autoplay`,`1`),e.href}catch{return this.src}}_openVideo(){this._open=!0,this.thumb&&this.updateComplete.then(()=>{this.renderRoot?.querySelector(`.bd-video-close`)?.focus(),this._playOnOpen()})}_playOnOpen(){(this.renderRoot?.querySelector(`video`))?.play().catch(()=>{})}_closeVideo(){this._open=!1,this.updateComplete.then(()=>{this.renderRoot?.querySelector(`.bd-video-thumb`)?.focus()})}_renderVideo(){let e=!this.thumb&&!window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;return t`
      <video
        src="${this.src}"
        poster="${this.thumb||n}"
        controls
        playsinline
        preload="${this.thumb?`none`:`metadata`}"
        ?autoplay=${e}
        ?muted=${e}
        .muted=${e}
      ></video>
    `}render(){return!this.thumb||this._open?t`
        <div class="bd-video-player">
          ${this._isYoutube()?t`
                <iframe
                  src="${this._embedSrc}"
                  title="${this.videoTitle||`Video player`}"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              `:this._renderVideo()}
          ${this.thumb?t`
                <button
                  class="bd-video-close"
                  @click=${this._closeVideo}
                  aria-label="Close video"
                >
                  <bd-close-icon size="xs" aria-hidden="true"></bd-close-icon>
                </button>
              `:``}
        </div>
      `:t`
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
    `}};customElements.define(`bd-video-player`,a);