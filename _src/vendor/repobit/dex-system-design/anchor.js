import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import{r as a,u as o}from"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design5.js";import{t as s}from"../../_chunks/repobit-dex-system-design10.js";import"../../_chunks/repobit-dex-system-design11.js";import"../../_chunks/repobit-dex-system-design13.js";var c=e`
  :host {
    display: block;
    width: 100%;
    background: var(--color-surface-default);
    position: sticky;
    top: var(--sticky-top, 0);
    z-index: var(--z-sticky);
  }

  /* The shadow the bar casts while stuck. A scroll-state container query
     reads the stuck state where the browser has one; elsewhere anchor-nav.js
     sets .is-sticky. */
  @supports (container-type: scroll-state) {
    :host {
      container: anchor-nav / scroll-state;
    }

    @container anchor-nav scroll-state(stuck: top) {
      nav {
        box-shadow: var(--shadow-sm);
      }
    }
  }

  :host(.is-sticky) nav {
    box-shadow: var(--shadow-sm);
  }

  nav {
    display: block;
    margin: var(--spacing-0);
    padding: var(--spacing-0);
    width: 100%;
    box-sizing: border-box;
    border-top: var(--border-width-1) solid var(--color-border-container);
    border-bottom: var(--border-width-1) solid var(--color-border-container);
  }

  .bd-anchor-nav__inner {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-32);
    width: 100%;
    padding-block: var(--spacing-10);
    box-sizing: border-box;
  }

  /* No .anchor-link:focus-visible. .anchor-link is the class this component
     puts on a bd-link HOST, and the focusable anchor lives inside bd-link's own
     shadow root -- a host without delegatesFocus matches :focus and
     :focus-within when focus is inside it, and never :focus-visible. Measured
     with a real keyboard Tab at 1440: 4 .anchor-link hosts, 1 matching :focus,
     0 matching :focus-visible, box-shadow none on all four. bd-link carries the
     one ring and the links get it; the two selectors left here are a real
     button and a real anchor in this shadow root. */
  .bd-anchor-nav__dropdown-toggle:focus-visible,
  .bd-anchor-nav__dropdown-option:focus-visible {
    /* the one focus ring — see Foundations/Focus */
    /* forced-colors mode does not paint box-shadow, so the ring
       vanishes there; it does paint an outline, in a system colour. This one
       is transparent everywhere else, and the offset lands it on the ring's
       outer band. */
    outline: var(--border-width-2) solid transparent;
    outline-offset: var(--focus-outline-offset);
    box-shadow: var(--focus-outline-primary);
    /* No border-radius here, for the reason back.css.js records: the ring is a
       box-shadow and already follows the shape of what it sits on, and both of
       these have a radius of their own -- --radius-lg on the toggle,
       --radius-md on the option. Setting --focus-outline-radius as well pulled
       the toggle's corners from 8px to 4px, and the option's from 6px to 4px,
       for as long as either was focused. That token is the default for an
       element with NO radius, which is what Foundations/Focus says. */
  }

  .anchor-links {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    /* Column gap and row gap say different things here, so they are spelled
       apart. The shorthand carried a --spacing-16 row gap that the next
       declaration overrode on the following line: measured row-gap 8px, so the
       16 was never a value anyone could read off the screen. */
    column-gap: var(--spacing-32);
    row-gap: var(--spacing-8);
    flex: 1 1 auto;
    min-width: 0;
  }

  .anchor-links--desktop { display: flex; }

  .anchor-link {
    position: relative;
    text-decoration: none;
    color: var(--color-text-primary);
    /* No font-weight: body-regular, whose size this rule already asks for, is
       normal -- and the inherited weight here is 400 too, measured, so the
       declaration said nothing. .anchor-link[current] still sets its own. */
    display: inline-block;
    font-size: var(--typography-body-regular-fontSize);
    font-family: var(--typography-body-regular-fontFamily);
    transition: color var(--transition-duration-fast) var(--transition-easing-smooth);
  }

  /* The padding belongs to the PART, not to the host.

     A host's padding does not extend the anchor inside it, so this rule used
     to build a 44px-tall row around a 24px-tall target: measured 63x44 on the
     host with a 63x24 <a> inside it, and elementsFromPoint 4px below the top
     edge came back bd-anchor-nav > bd-root (the former Storybook wrapper) > div with no <a> in the stack at
     all. The top and bottom 10px of every item were dead, 45% of the height a
     reader aims at.

     It is also why the focus ring wrapped the glyphs rather than the item: the
     ring is drawn on whatever element is focusable, and that was the 24px
     anchor. One boundary, two symptoms.

     bd-breadcrumb already fixed exactly this by moving its padding onto
     ::part(link) -- its comment records a 343x40 row whose focusable anchor
     was 43x24 -- and this is the same move. Layout is unchanged: the host has
     no padding now but wraps an anchor that does, so it still measures 44px
     and the indicator's offset still lands on the bar's bottom edge. */
  .anchor-link::part(link) {
    padding: var(--spacing-10) var(--spacing-0);
  }

  /* [current] is the bd-link attribute that becomes aria-current on its <a>,
     so the item is drawn current exactly when it is announced so. */
  .anchor-link[current] {
    /* no role: the active item in the anchor nav -- a state or modifier weight, not a text-content
       type. See button.css.js's .button--bold for the argument. */
    font-weight: var(--typography-fontWeight-semibold);
    color: var(--color-text-primary);
  }

  /* No underline or hover rules here. Three !important ones stood here --
     text-decoration: none on every .anchor-link, hovered or not, and
     text-primary on the hovered active one -- and all three landed on the
     bd-link host, which draws no text: the underline and the colour belong to
     the <a> in its shadow root. The no-underline attribute already keeps that
     <a> undecorated, and bd-link's current-and-hovered rule keeps the
     current item text-primary. Measured on all four Default items, at rest and hovered:
     the same colour, decoration and weight with the rules and without. */

  /* The offset has to equal the inner's padding-bottom, and it did not.

     The indicator is absolute inside the link box, and what it is aiming for
     is the bar's bottom edge -- so the distance it has to travel is exactly
     the padding the inner adds below the link. This rule said 14, which is
     bd-page-switcher's number and not this component's: the inner here pads
     10, so the indicator overshot by 4 and rendered BELOW the nav's bottom
     border, detached from the bar it belongs to.

     Measured before, at 1440 with the nav 66px tall including its borders:
     link box bottom at 55, indicator occupying 66-69, nav bottom edge at 66.
     After: 62-65, sitting directly on the border.

     The indicator is now one element that slides between items rather than
     an ::after per link, so the offset lives in _updateIndicator(), which
     reads the inner's padding-bottom instead of a number -- the two move
     together.

     It spans the whole row and is placed with translate and sized with
     scale from its top-left corner, so a slide is drawn on the compositor;
     it animated top and width, which re-laid it out every frame. Scaled to
     nothing until the first placement. The anchor is the physical left
     because the offsets it is given are physical. */
  .anchor-indicator {
    position: absolute;
    left: var(--spacing-0);
    top: var(--spacing-0);
    width: 100%;
    height: var(--indicator-underline-height);
    background-color: var(--indicator-color);
    transform-origin: left top;
    scale: 0 1;
    transition:
      translate var(--indicator-underline-duration) var(--indicator-underline-easing),
      scale var(--indicator-underline-duration) var(--indicator-underline-easing);
    pointer-events: none;
  }

  .bd-anchor-nav__dropdown {
    display: none;
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    width: 100%;
  }

  .bd-anchor-nav__dropdown-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-12);
    width: 100%;
    min-height: var(--dimension-48);
    padding-block: var(--spacing-10);
    padding-inline: var(--spacing-16);
    box-sizing: border-box;
    font-family: var(--typography-fontFamily-sans);
    font-size: var(--typography-body-regular-fontSize);
    /* The leading that belongs to the size above. It was absent, so the label
       and the ellipsised text inside it were laid out on IBM Plex Sans's own
       "normal" metric -- a leading nobody chose, and one that stops being 1.25
       the moment the font falls back. */
    line-height: var(--typography-body-regular-lineHeight);
    /* no role: the weight of a control, not a text-content type -- see
       button.css.js's .button--bold. Nothing in the vocabulary carries semibold
       at a body size anyway: all ten heavy-weight roles are headings or display
       steps at 2xl and up. */
    font-weight: var(--typography-fontWeight-semibold);
    color: var(--color-text-primary);
    /* no role: --color-surface-container is neutral-25 exactly, and it is the
       wrong role -- it means "the ground of a self-contained object, a card, a
       tile, a panel", and this is a control somebody operates. The control
       families cannot say it either: --form-input-default-backgroundColor is
       white, and this toggle deliberately sits one step off it. A ground for a
       bordered control at rest has no role, and this is its one consumer. */
    background: var(--color-neutral-25);
    /* A control edge, so it takes the role the form-field atom uses for one.
       neutral-200 is border-subtle's value, which is documented as the wrong
       role for the edge of something a person operates. */
    border: var(--border-width-1) solid var(--color-border-default);
    border-radius: var(--shape-radius-lg);
    cursor: pointer;
    text-align: start;
    transition:
      background var(--transition-duration-fast) var(--transition-easing-smooth),
      border-color var(--transition-duration-fast) var(--transition-easing-smooth),
      border-radius var(--transition-duration-fast) var(--transition-easing-smooth);
  }

  .bd-anchor-nav__dropdown-toggle:hover {
    background: var(--color-surface-subtle);
    /* The edge of a bordered control under the pointer, and this package
       already had an answer for it: radio.css.js and checkbox.css.js both take
       --color-action-primary-hover for exactly this job, four declarations
       across two atoms. This rule was the only one on a primitive.
       .
       Measured against this toggle's own hover ground (--color-surface-subtle):
       neutral-500 was 4.17:1 and blue-600 is 5.51:1, so the adoption improves
       the edge rather than trading contrast for consistency. The visible change
       is that the hover edge goes from grey to blue, which is what radio and
       checkbox already do.
       .
       Note the token is an ACTION role rather than a --color-border-* one. That
       is deliberate and is how the two atoms use it too: an interaction state
       is the job, and the border roles describe permanence -- default, subtle,
       strong -- not what a control does under a pointer. */
    border-color: var(--color-action-primary-hover);
  }

  .bd-anchor-nav__dropdown-toggle[aria-expanded="true"] {
    background: var(--color-surface-subtle);
    /* no role: the edge while the panel is open. No border role sits at
       blue-200 -- only --status-brand-border and --status-info-border, and an
       open disclosure is neither a brand nor an information STATUS. The nearest
       control token is --form-input-focus-borderColor, which is blue-500 and
       means focused rather than expanded; the two states are independent here,
       since the toggle can be focused and closed. Expanded has no vocabulary
       in either control family. */
    border-color: var(--color-brand-200);
  }

  .bd-anchor-nav__dropdown-label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transform-origin: left center;
  }

  /* The mark inside is bd-arrow-down-icon, the same atom bd-custom-dropdown's
     caret and the accordion's toggle use. It was an inline stroked svg written
     into the template -- stroke-width 2 with round caps, so a visibly different
     chevron from the filled one the rest of the package draws, and invisible to
     check:icons. This span keeps the colour and the rotation; the icon reads
     currentColor from it, which is what every icon site here does. */
  .bd-anchor-nav__dropdown-chevron {
    flex: 0 0 auto;
    display: flex;
    color: var(--color-text-muted);
    transition: transform var(--transition-duration-normal) var(--transition-easing-smooth);
  }

  .bd-anchor-nav__dropdown-toggle[aria-expanded="true"] .bd-anchor-nav__dropdown-chevron {
    transform: rotate(180deg);
    /* The brand ink, matching the resting state three rules up, which already reads
       --color-text-muted. A chevron is a currentColor glyph, so it takes the ink role
       of its context -- the answer ten other icon sites in this package already give.
       Visible: 4.05:1 -> 5.51:1 on the toggle's grey tint. */
    color: var(--color-text-brand);
  }

  .bd-anchor-nav__dropdown-panel {
    position: absolute;
    left: var(--spacing-0);
    right: var(--spacing-0);
    top: 100%;
    z-index: var(--z-overlay);
    max-height: min(50dvh, 20rem);
    overflow-y: auto;
    background: var(--color-surface-default);
    border: var(--border-width-1) solid var(--color-brand-200);
    border-top: none;
    border-radius: var(--radius-none) var(--radius-none) var(--shape-radius-lg) var(--shape-radius-lg);
    box-shadow: var(--shadow-md);
  }

  /* Where popover and anchor positioning both exist, anchor-nav.js makes the
     panel a popover: the top layer replaces the z-index above, and light
     dismiss replaces the document listeners. In the top layer the panel is
     no longer inside the dropdown's box, so it is tied to the toggle instead,
     at the place the absolute rule above puts it: under the toggle, as wide
     as it. The rest undoes the popover's UA styles -- centred, fit-content,
     padded, CanvasText. */
  @supports (anchor-name: --a) {
    .bd-anchor-nav__dropdown-toggle {
      anchor-name: --bd-anchor-nav-toggle;
    }

    .bd-anchor-nav__dropdown-panel[popover] {
      position-anchor: --bd-anchor-nav-toggle;
      inset: auto;
      top: anchor(bottom);
      left: anchor(left);
      width: anchor-size(width);
      box-sizing: border-box;
      margin: var(--spacing-0);
      padding: var(--spacing-0);
      color: inherit;
    }
  }

  .bd-anchor-nav__dropdown-list {
    list-style: none;
    margin: var(--spacing-0);
    padding: var(--spacing-8);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .bd-anchor-nav__dropdown-option {
    display: flex;
    align-items: center;
    width: 100%;
    text-decoration: none;
    min-height: var(--dimension-48);
    padding-block: var(--spacing-12);
    padding-inline: var(--spacing-16);
    box-sizing: border-box;
    font-family: var(--typography-fontFamily-sans);
    font-size: var(--typography-body-regular-fontSize);
    /* As the toggle above: the size named its role and the leading did not
       follow it. This one can wrap -- a long section title in a narrow
       dropdown -- and CLAUDE.md asks for at least 1.25 on anything that can. */
    line-height: var(--typography-body-regular-lineHeight);
    /* No font-weight: as .anchor-link above -- body-regular is normal and so is
       the inherited value. The current option sets its own. */
    /* text/brand, the same resting ink the desktop items take. This is the
       same component below md showing the same items, so it expresses the same
       meaning: colour is AVAILABLE and neutral is current. It read
       text/primary here, which made the current option the only blue one --
       the inverse of the family, and the arrangement the desktop bar was just
       moved off. */
    color: var(--color-text-brand);
    background: transparent;
    border: none;
    border-radius: var(--shape-radius-md);
    cursor: pointer;
    text-align: start;
    transition:
      color var(--transition-duration-fast) var(--transition-easing-smooth),
      background var(--transition-duration-fast) var(--transition-easing-smooth);
  }

  /* Hover on a dropdown option is the action responsibility, and it is now the
     same step the desktop items hover to -- action/primary-active rather than
     -hover, so brand darkens the same way in both presentations. blue-700 on
     the --color-neutral-25 this hover sets measures 8.19:1; the blue-500 that
     stood here before either role measured 4.34 and failed. The background is
     the dropdown's own affordance and is not part of the ink contract. */
  .bd-anchor-nav__dropdown-option:hover:not([aria-current]) {
    color: var(--color-action-primary-active);
    background: var(--color-neutral-25);
  }

  /* The current option, in the family's terms: neutral ink at the weight the
     other two use for the same job, and the blue-50 fill is this presentation's
     indicator -- a dropdown row has no bottom edge to underline, so the fill
     carries what the 3px line carries on the bars.

     It used to be action/primary-active, which was defensible on its own
     terms -- an option with aria-current, a click handler and a tinted fill is
     an interactive element in an engaged state -- but it made the current item
     the bluest thing in the list while every other item was neutral. Under one
     contract for the whole family that reading is inverted: colour marks what
     you can go to, neutral marks where you are.

     Read off the option's aria-current, not a class kept beside it, so the
     look and the announcement are one attribute. */
  .bd-anchor-nav__dropdown-option[aria-current] {
    /* no role: the weight that marks the current option -- a state or modifier
       weight, not a text-content type. 700, the same as bd-link's current
       link and bd-tab-list's selected tab. */
    font-weight: var(--typography-fontWeight-bold);
    background: var(--color-brand-50);
    color: var(--color-text-primary);
  }

  /* The current option does not move under the pointer, as on the bars. */
  .bd-anchor-nav__dropdown-option[aria-current]:hover {
    color: var(--color-text-primary);
    background: var(--color-brand-50);
  }

  ::slotted([slot="cta"]) {
    flex-shrink: 0;
  }

  /* The .bd-anchor-nav__cta rules stood here: a base rule, hover, active,
     focus-visible, an ::after reset and a full-width rule below md. The class
     appears nowhere but this stylesheet -- not in anchor-nav.js, not in a story
     -- because the CTA became a slot, and ::slotted([slot="cta"]) one rule up
     is what styles it now. Measured across 556 stories: 0 matches in 14 shadow
     roots. */
  .bd-anchor-nav__dropdown-option::after {
    display: none;
  }

  /* Forced colours repaint backgrounds as Canvas, which took the sliding
     indicator and the current option's fill with them. Both opt out into
     Highlight, as bd-tab-list's and bd-page-switcher's indicators do; the
     option takes HighlightText on it. */
  @media (forced-colors: active) {
    .anchor-indicator {
      forced-color-adjust: none;
      background-color: Highlight;
    }

    .bd-anchor-nav__dropdown-option[aria-current],
    .bd-anchor-nav__dropdown-option[aria-current]:hover {
      forced-color-adjust: none;
      background: Highlight;
      color: HighlightText;
    }
  }

  @keyframes bd-anchor-nav-dropdown-label-swap {
    from { opacity: 0.35; transform: translateY(var(--spacing-4)); }
    to   { opacity: 1;    transform: translateY(var(--spacing-0)); }
  }

  @media (prefers-reduced-motion: reduce) {
    .anchor-indicator,
    .bd-anchor-nav__dropdown-chevron,
    .bd-cta,
    .bd-anchor-nav__dropdown-label--swap {
      transition: none !important;
      animation: none !important;
    }

    /* The underline grows via a transition, not an animation, so the rule
       above never reached it. Same for the chevron and the option hover. */
    .anchor-link,
    .bd-anchor-nav__dropdown-chevron,
    .bd-anchor-nav__dropdown-option {
      transition: none !important;
    }
  }

  @media ${n(a(`md`))} {
    .bd-anchor-nav__inner {
      flex-direction: column;
      align-items: stretch;
      gap: var(--spacing-16);
    }

    .anchor-links--desktop { display: none !important; }

    .bd-anchor-nav__dropdown { display: block; }

    .bd-anchor-nav__dropdown-label.bd-anchor-nav__dropdown-label--swap {
      animation: bd-anchor-nav-dropdown-label-swap var(--transition-duration-normal)
        var(--transition-easing-smooth);
    }

    /* The CTA opens below the dropdown once the first section is behind the
       reader. Its row grows from 0fr to 1fr: a grid track interpolates to the
       content's own height, where the max-height that stood here had to
       guess one -- 128px, which clipped a CTA whose label wraps at a large
       text size. visibility follows, so a closed CTA is out of the tab order
       as well as out of sight. */
    .bd-cta {
      align-self: stretch;
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      visibility: hidden;
      transform: translateY(calc(-1 * var(--spacing-8)));
      pointer-events: none;
      margin-top: calc(-1 * var(--spacing-16));
      transition:
        grid-template-rows var(--transition-duration-slow) var(--transition-easing-ease-out),
        opacity var(--transition-duration-normal) var(--transition-easing-smooth),
        transform var(--transition-duration-normal) var(--transition-easing-smooth),
        margin-top var(--transition-duration-normal) var(--transition-easing-smooth),
        visibility var(--transition-duration-slow);
    }

    /* The clip the row needs while it grows, held off the CTA by the width of
       its focus ring -- an outline 2px out at a 2px offset -- so the ring is
       not cut off: the old clip sat on the CTA's own edge and cut it on all
       four sides. Padding and margin cancel, so nothing moves. */
    .bd-cta__inner {
      min-height: 0;
      overflow: hidden;
      padding: var(--spacing-4);
      margin: calc(-1 * var(--spacing-4));
    }

    .bd-anchor-nav__inner[data-mobile-cta-visible] .bd-cta {
      grid-template-rows: 1fr;
      opacity: 1;
      visibility: visible;
      transform: translateY(var(--spacing-0));
      pointer-events: auto;
      margin-top: var(--spacing-0);
    }

    /* Full width on a phone, through bd-button's width hook. This was a
       resize listener writing fullwidth on the page's own element. */
    ::slotted([slot="cta"]) {
      --bd-button-width: 100%;
    }

  }
`;function l(e){let t=(e||``).trim();if(!t)return 0;if(t.endsWith(`px`))return parseFloat(t);if(t.endsWith(`rem`)){let e=parseFloat(getComputedStyle(document.documentElement).fontSize)||16;return parseFloat(t)*e}return parseFloat(t)||0}var u=(e,t)=>(e||``).replace(/^#/,``)||`anchor-${t}-section`,d=`10000%`,f=`popover`in HTMLElement.prototype&&CSS.supports(`anchor-name: --a`),p=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`})}connectedCallback(){this.render()}render(){this.shadowRoot.innerHTML=`<slot></slot>`}},m=class extends i{static properties={activeId:{type:String,state:!0},navLabel:{type:String,attribute:`aria-label`},_dropdownOpen:{type:Boolean,state:!0},_mobileCtaRevealed:{type:Boolean,state:!0},ctaLabel:{type:String,attribute:`cta-label`},ctaHref:{type:String,attribute:`cta-href`},items:{type:Array},maxWidth:{type:String,attribute:`max-width`},stickyTop:{type:String,attribute:`sticky-top`}};static styles=[s,c];constructor(){super(),this.activeId=``,this.navLabel=`Section navigation`,this._dropdownOpen=!1,this._mobileCtaRevealed=!1,this.ctaLabel=`Buy now`,this.ctaHref=``,this.items=null,this.maxWidth=``,this.stickyTop=`0px`,this._panelId=`bd-anchor-nav-panel-${Math.random().toString(36).slice(2,11)}`,this._onDocumentPointerDown=this._onDocumentPointerDown.bind(this),this._onKeydown=this._onKeydown.bind(this),this._onSectionsCrossLine=this._onSectionsCrossLine.bind(this),this._onFirstSectionCross=this._onFirstSectionCross.bind(this),this._scheduleSpy=this._scheduleSpy.bind(this),this._spyFrame=0,this._spyObserver=null,this._ctaObserver=null,this._layoutObserver=null,this._sections=[],this._spyLine=0,this._spyViewport=0,this._passed=/* @__PURE__ */ new Map,this._firstSectionBehind=!1,this._programmaticScrollTargetId=null,this._unlockScrollSpyTimer=null,this._scrollEndUnlockHandler=null,this._onStickyScroll=null,this._restoreScrollBehavior=null,this._handleResize=this._handleResize.bind(this),this._indicatorReady=!1,this._indicatorResizeObserver=null}connectedCallback(){super.connectedCallback(),window.addEventListener(`resize`,this._handleResize),f||(document.addEventListener(`pointerdown`,this._onDocumentPointerDown,!0),document.addEventListener(`keydown`,this._onKeydown,!0)),this._initSticky(),this._layoutObserver=new ResizeObserver(this._scheduleSpy),this._layoutObserver.observe(this),this._layoutObserver.observe(document.documentElement)}disconnectedCallback(){super.disconnectedCallback(),this._cancelScrollSpyUnlock(),this._restoreScrollBehavior?.(),window.removeEventListener(`resize`,this._handleResize),document.removeEventListener(`pointerdown`,this._onDocumentPointerDown,!0),document.removeEventListener(`keydown`,this._onKeydown,!0),this._destroySticky(),this._indicatorResizeObserver?.disconnect(),this._unobserveSections()}willUpdate(e){super.willUpdate(e),!this.hasUpdated&&!this.activeId&&this._resolvedItems().length&&(this.activeId=`anchor-1`)}updated(e){if(super.updated(e),e.has(`stickyTop`)&&this.style.setProperty(`--sticky-top`,this.stickyTop||`0px`),(e.has(`stickyTop`)||e.has(`items`))&&this._scheduleSpy(),(e.has(`activeId`)||e.has(`items`))&&requestAnimationFrame(()=>this._updateIndicator(`updated`)),!e.has(`activeId`))return;let t=e.get(`activeId`);t!==void 0&&t!==``&&t!==this.activeId&&queueMicrotask(()=>this._playMobileDropdownLabelSwap())}firstUpdated(){requestAnimationFrame(()=>this._updateIndicator(`firstUpdated`));let e=this.renderRoot?.querySelector(`.anchor-links--desktop`);e&&(this._indicatorResizeObserver=new ResizeObserver(()=>{this._updateIndicator(`ResizeObserver`)}),this._indicatorResizeObserver.observe(e),this._indicatorResizeObserver.observe(this))}_updateIndicator(){let e=this.renderRoot?.querySelector(`.anchor-indicator`),t=this.renderRoot?.querySelector(`.anchor-links--desktop .anchor-link[current]`);if(!e||!t)return;let n=e.offsetWidth,r=n?t.offsetWidth/n:0,i=this.renderRoot.querySelector(`.bd-anchor-nav__inner`),a=i&&parseFloat(getComputedStyle(i).paddingBottom)||0,o=t.offsetTop+t.offsetHeight+a,s=()=>{e.style.translate=`${t.offsetLeft}px ${o}px`,e.style.scale=`${r} 1`};this._indicatorReady?s():(e.style.transition=`none`,s(),e.offsetWidth,e.style.transition=``,this._indicatorReady=!0)}_handleResize(){this._updateIndicator(`windowResize`),this._scheduleSpy()}_initSticky(){this.style.setProperty(`--sticky-top`,this.stickyTop||`0px`),!CSS.supports(`container-type: scroll-state`)&&(this._onStickyScroll=()=>{let e=parseFloat(getComputedStyle(this).top)||0,t=Math.abs(this.getBoundingClientRect().top-e)<1;this.classList.toggle(`is-sticky`,t&&window.scrollY>0)},window.addEventListener(`scroll`,this._onStickyScroll,{passive:!0}),window.addEventListener(`resize`,this._onStickyScroll,{passive:!0}),requestAnimationFrame(()=>this._onStickyScroll?.()))}_destroySticky(){this._onStickyScroll&&=(window.removeEventListener(`scroll`,this._onStickyScroll),window.removeEventListener(`resize`,this._onStickyScroll),null),this.classList.remove(`is-sticky`)}_cancelScrollSpyUnlock(){this._unlockScrollSpyTimer!=null&&(clearTimeout(this._unlockScrollSpyTimer),this._unlockScrollSpyTimer=null),this._scrollEndUnlockHandler&&=(window.removeEventListener(`scrollend`,this._scrollEndUnlockHandler),null)}_scheduleScrollSpyUnlock(){this._cancelScrollSpyUnlock();let e=()=>{this._cancelScrollSpyUnlock(),this._restoreScrollBehavior?.(),this._programmaticScrollTargetId=null,this._runScrollSpy()};this._scrollEndUnlockHandler=e,window.addEventListener(`scrollend`,e,{passive:!0});let t=window.scrollY,n=()=>{if(window.scrollY===t)return e();t=window.scrollY,this._unlockScrollSpyTimer=window.setTimeout(n,250)};this._unlockScrollSpyTimer=window.setTimeout(n,250)}_onKeydown(e){e.key===`Escape`&&this._dropdownOpen&&(this._dropdownOpen=!1,this.requestUpdate(),this.updateComplete.then(()=>this.renderRoot?.querySelector(`.bd-anchor-nav__dropdown-toggle`)?.focus()))}_onDocumentPointerDown(e){this._dropdownOpen&&(e.composedPath().includes(this)||(this._dropdownOpen=!1,this.requestUpdate()))}_scheduleSpy(){this._spyFrame||=requestAnimationFrame(()=>{this._spyFrame=0,this._observeSections()})}_observeSections(){let e=this._resolvedItems().map(({href:e},t)=>document.getElementById(u(e,t+1))),t=this._stickyOffsetPx(),n=t+2,r=document.documentElement.clientHeight;if(n===this._spyLine&&r===this._spyViewport&&e.length===this._sections.length&&e.every((e,t)=>e===this._sections[t]))return;for(let t of this._sections)t&&!e.includes(t)&&t.style.removeProperty(`scroll-margin-top`);for(let n of e)n?.style.setProperty(`scroll-margin-top`,`${t}px`);this._spyObserver?.disconnect(),this._ctaObserver?.disconnect(),this._spyObserver=this._ctaObserver=null,e[0]!==this._sections[0]&&(this._firstSectionBehind=!1),this._passed=new Map(e.filter(e=>this._passed.has(e)).map(e=>[e,this._passed.get(e)])),this._sections=e,this._spyLine=n,this._spyViewport=r;let i=e.filter(Boolean);i.length&&(this._spyObserver=new IntersectionObserver(this._onSectionsCrossLine,{root:document,rootMargin:`${d} 0px ${n-r}px 0px`}),i.forEach(e=>this._spyObserver.observe(e))),e[0]&&(this._ctaObserver=new IntersectionObserver(this._onFirstSectionCross,{root:document,rootMargin:`0px 0px ${d} 0px`}),this._ctaObserver.observe(e[0])),this._runScrollSpy()}_unobserveSections(){cancelAnimationFrame(this._spyFrame),this._spyFrame=0,this._layoutObserver?.disconnect(),this._spyObserver?.disconnect(),this._ctaObserver?.disconnect(),this._layoutObserver=this._spyObserver=this._ctaObserver=null;for(let e of this._sections)e?.style.removeProperty(`scroll-margin-top`);this._sections=[],this._passed=/* @__PURE__ */ new Map}_onSectionsCrossLine(e){for(let{target:t,boundingClientRect:n,rootBounds:r}of e)this._passed.set(t,n.top<=r.bottom);this._runScrollSpy()}_onFirstSectionCross(e){let{boundingClientRect:t,rootBounds:n}=e[e.length-1];this._firstSectionBehind=t.bottom<=n.top,this._runScrollSpy()}_resolvedItems(){return this.items&&this.items.length?this.items.map((e,t)=>({title:e.title,href:e.href||`#anchor-${t+1}-section`,id:`anchor-${t+1}`})):Array.from(this.children).filter(e=>e.tagName===`BD-ANCHOR-NAV-ITEM`).map((e,t)=>({title:e.getAttribute(`title`),href:e.getAttribute(`href`)||`#anchor-${t+1}-section`,id:`anchor-${t+1}`}))}_runScrollSpy(){let e=this.activeId;this._sections.length&&!this._programmaticScrollTargetId&&(e=`anchor-1`,this._sections.forEach((t,n)=>{t&&this._passed.get(t)&&(e=`anchor-${n+1}`)})),this.activeId=e,this._mobileCtaRevealed=!this._sections[0]||this._firstSectionBehind}_playMobileDropdownLabelSwap(){if(typeof window>`u`||window.matchMedia(`(prefers-reduced-motion: reduce)`).matches||!o(`md`))return;let e=this.renderRoot?.querySelector(`.bd-anchor-nav__dropdown-label`);e&&(e.classList.remove(`bd-anchor-nav__dropdown-label--swap`),e.offsetWidth,e.classList.add(`bd-anchor-nav__dropdown-label--swap`),e.addEventListener(`animationend`,()=>e.classList.remove(`bd-anchor-nav__dropdown-label--swap`),{once:!0}))}_stickyOffsetPx(){let e=this.offsetHeight,t=parseFloat(getComputedStyle(this).top)||0,n=l(getComputedStyle(this).getPropertyValue(`--spacing-8`).trim())||8;return e>0?e+n+t:l(getComputedStyle(this).getPropertyValue(`--spacing-128`).trim())||128}handleClick(e,t,n){if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;this._cancelScrollSpyUnlock(),this._programmaticScrollTargetId=null,this.activeId=t;let r=u(n,t.replace(/^anchor-/,``));document.getElementById(r)&&(this._programmaticScrollTargetId=t,this._smoothFragmentScroll(),this._scheduleScrollSpyUnlock())}_smoothFragmentScroll(){if(this._restoreScrollBehavior||!window.matchMedia(`(prefers-reduced-motion: no-preference)`).matches)return;let e=document.documentElement,t=e.style.scrollBehavior;e.style.scrollBehavior=`smooth`,this._restoreScrollBehavior=()=>{e.style.scrollBehavior=t,this._restoreScrollBehavior=null}}_toggleDropdown(e){f||(e.preventDefault(),e.stopPropagation(),this._dropdownOpen=!this._dropdownOpen)}_onPanelToggle(e){this._dropdownOpen=e.newState===`open`}_selectFromDropdown(e,t,n){if(f){let e=this.renderRoot.querySelector(`.bd-anchor-nav__dropdown-panel`);e?.matches(`:popover-open`)&&e.hidePopover()}else this._dropdownOpen=!1;this.handleClick(e,t,n)}_activeLabel(e){let t=/^anchor-(\d+)$/.exec(this.activeId||``),n=t?parseInt(t[1],10):1;return e[Math.min(Math.max(n-1,0),Math.max(0,e.length-1))]?.title||e[0]?.title||`Section`}render(){let e=this._resolvedItems(),n=this._activeLabel(e),i=n=>t`
      <div class="${n}">
        ${e.map(({id:e,title:n,href:i})=>{let a=this.activeId===e;return t`
            <bd-link
              href="${i}"
              variant="primary"
              no-underline
              class="anchor-link"
              current=${a?`location`:r}
              @click=${t=>this.handleClick(t,e,i)}
            >${n}</bd-link>
          `})}
        <span class="anchor-indicator" aria-hidden="true"></span>
      </div>
    `,a=this.maxWidth?`max-width: ${this.maxWidth};`:``;return t`
      <nav aria-label=${this.navLabel}>
        <div
          class="bd-ensemble bd-anchor-nav__inner"
          part="inner"
          style="${a}"
          ?data-mobile-cta-visible=${this._mobileCtaRevealed}
        >
          ${i(`anchor-links anchor-links--desktop`)}

          <div class="bd-anchor-nav__dropdown" part="dropdown">
            <button
              type="button"
              class="bd-anchor-nav__dropdown-toggle"
              aria-expanded=${this._dropdownOpen?`true`:`false`}
              aria-controls=${this._panelId}
              popovertarget=${f?this._panelId:r}
              @click=${this._toggleDropdown}
            >
              <span class="bd-anchor-nav__dropdown-label">${n}</span>
              <span class="bd-anchor-nav__dropdown-chevron" aria-hidden="true">
                <bd-arrow-down-icon size="md"></bd-arrow-down-icon>
              </span>
            </button>
            <div
              class="bd-anchor-nav__dropdown-panel"
              id=${this._panelId}
              popover=${f?`auto`:r}
              ?hidden=${!f&&!this._dropdownOpen}
              @toggle=${this._onPanelToggle}
            >
              <ul class="bd-anchor-nav__dropdown-list">
                ${e.map(({id:e,title:n,href:i})=>{let a=this.activeId===e;return t`
                    <li>
                      <a
                        href="${i}"
                        class="bd-anchor-nav__dropdown-option"
                        aria-current=${a?`location`:r}
                        @click=${t=>this._selectFromDropdown(t,e,i)}
                      >${n}</a>
                    </li>
                  `})}
              </ul>
            </div>
          </div>

          <div class="bd-cta">
            <div class="bd-cta__inner"><slot name="cta"></slot></div>
          </div>
        </div>
      </nav>
    `}};customElements.define(`bd-anchor-nav-item`,p),customElements.define(`bd-anchor-nav`,m);