import{c as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design2.js";import{d as a,r as o}from"../../_chunks/repobit-dex-system-design3.js";import"../../_chunks/repobit-dex-system-design8.js";import{t as s}from"../../_chunks/repobit-dex-system-design10.js";import"../../_chunks/repobit-dex-system-design13.js";import"../../_chunks/repobit-dex-system-design15.js";var c=e`

:host(bd-compare-section) {
  display: block;
  /* The section is the container its narrow layout reads -- one column of
     cards, the horizontal card stacked, the type a step down -- where it read
     the screen. Across the page the section is as wide as the screen, so
     nothing moves there. width: 100% because a size container contributes
     nothing to its own intrinsic width. */
  container-type: inline-size;
  width: 100%;
  box-sizing: border-box;

  /* The brand fill and the ink that belongs to it. theme-green and theme-red
     adopted --status-*-fill / --status-*-on-fill below with the argument that a
     saturated fill carrying a label is exactly that pair's responsibility; the
     default bar IS that shape and the migration skipped it, so it kept the
     primitives. Value-identical -- --status-brand-fill is blue-500 and
     --status-brand-on-fill is neutral-0 -- and the label measures 4.53:1 here,
     which passes 4.5:1 with almost nothing spare. Worth knowing before anyone
     retunes blue-500: green-500 and red-500 both failed this same test. */
  --cs-bar-primary-fg:   var(--status-brand-on-fill);
  --cs-bar-primary-bg:   var(--status-brand-fill);
  /* no role: the competitor bar is a resting fill. The three roles at
     neutral-100 are a state (surface-muted), a disabled control
     (surface-disabled) and a surface in the neutral status family, whose FILL
     is neutral-900 -- so the family that matches on job does not match on
     value, and the ones that match on value do not match on job. */
  --cs-bar-secondary-bg: var(--color-neutral-100);
  --cs-bar-track-bg:     transparent;
  --cs-bar-track-border: var(--color-border-subtle);
  --cs-bar-height:       var(--dimension-48);
  --cs-gap:              var(--spacing-32);

  /* The section's own text, which is the only text that sits on the page's
     ground rather than on a card. .theme-dark recoloured the bars and the icon
     and stopped there, so on a dark ground the section title kept
     --color-text-primary and rendered at 1.05:1 -- a documented story whose
     heading was invisible.

     Deliberately section-scoped. .card sets its own --color-surface-container
     and stays light under .theme-dark, so card titles, descriptions, footnotes
     and bar labels must keep their light-surface roles; inverting those turned
     white text onto a light card at 1.04:1 when it was tried. This is a
     component-context fix, not a theme architecture. */
  --cs-section-text: var(--color-text-primary);
}

:host(compare-card) {
  display: block;
  height:  100%;
}

:host(compare-bar) {
  display: block;
  width:   100%;
}

.cs-sr-only {
  position:    absolute;
  width:       1px;
  height:      1px;
  padding:     0;
  margin:      -1px;
  overflow:    hidden;
  clip-path:   inset(50%);
  white-space: nowrap;
  border:      0;
}

.cs-section {
  background: transparent;
  padding-block: var(--spacing-0);
  box-sizing: border-box;
}

.cs-heading {
  text-align: center;
  /* not the column: a centred heading measure, one grid step narrower than the page */
  max-width:  var(--grid-container-max-md);
  margin:     0 auto var(--spacing-40);
}

.cs-title    { margin: 0 0 var(--spacing-8); color: var(--cs-section-text); }
.cs-subtitle { margin: 0; color: var(--cs-section-text); }

.cs-grid {
  display:               grid;
  grid-template-columns: repeat(var(--_cols, 2), minmax(0, 598px));
  gap:                   var(--cs-gap);
  margin:                0 auto;
  justify-content:       center;
  align-items:           stretch;
}

@container ${n(o(`md`))} {
  .cs-grid {
    grid-template-columns: 1fr;
  }
}

.cs-grid > ::slotted(compare-card[layout="horizontal"]) {
  grid-column: 1 / -1;
}

/* A card's three parts -- the header, the bars, the footnote -- are three of
   the section's rows, so the bars start on one line across a row of cards
   however many lines a title or a description wraps to. The card spans them
   as a subgrid and so does its .card; inside a card they are 24 apart, the
   card's own gap, while rows of cards keep --cs-gap between them. */
.cs-grid > ::slotted(compare-card:not([layout="horizontal"])) {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
  row-gap: var(--spacing-24);
}

.card {
  background:      var(--color-surface-container);
  /* --radius-2xl, the established card-family corner. This card sat at
     --radius-3xl and was otherwise identical to the family: the same
     --color-surface-container, the same 32px inset, no resting elevation and
     no card-level interaction. P5G could find no responsibility, affordance or
     recorded decision behind the extra 8px -- unlike the carousel item, whose
     24px corner goes with a 2px border and real drag/modal behaviour and is a
     recorded open question. */
  border-radius:   var(--card-radius);
  padding:         var(--card-padding);
  /* In a section, the card's rows are the section's (see above); on its own
     the subgrid has no grid to inherit from, and the parts stack in rows of
     their own, 24 apart either way. */
  display:            grid;
  grid-row:           1 / -1;
  grid-template-rows: subgrid;
  row-gap:            var(--spacing-24);
  align-content:      start;
  box-sizing:         border-box;
  height:             100%;
}

.card-header {
  display:        flex;
  flex-direction: column;
  align-items:    flex-start;
  gap:            var(--spacing-8);
  flex:           0 0 auto;
}

.card-icon-wrap {
  flex-shrink: 0;
  width:       var(--icon-2xl-size);
  height:      var(--icon-2xl-size);
}

.card-icon-wrap bd-img {
  display: block;
  width:   100%;
  height:  100%;
}

.card-text-wrap {
  display:        flex;
  flex-direction: column;
  gap:            var(--spacing-8);
  align-self:     stretch;
}

.card-title       { margin: 0; }
.card-description { margin: 0; }

.card-bars {
  display:        flex;
  flex-direction: column;
  gap:            var(--spacing-8);
  align-self:     stretch;
  flex:           0 0 auto;
}

.card-footnote {
  margin: 0;
  color:  var(--color-text-primary);
  flex:   0 0 auto;
}

/* In a card's rows, each part is as tall as itself; the row is as tall as
   the tallest of its row across the cards. */
.card > .card-bars,
.card > .card-footnote {
  align-self: start;
}

/* ── Horizontal layout ──────────────────────────────────────────────────────── */

.card--horizontal {
  display:               grid;
  grid-template-columns: 1fr 1fr;
  align-items:           stretch;
  gap:                   var(--spacing-40);
}

.card-left {
  display:        flex;
  flex-direction: column;
  gap:            var(--spacing-16);
}

/* slot is transparent so fallback children are direct flex items of .card-left */
slot[name="header"] { display: contents; }

::slotted([slot="header"]) {
  display:        flex;
  flex-direction: column;
}

.card-left-top {
  display:     flex;
  align-items: center;
  gap:         var(--spacing-12);
}

.card--horizontal .card-icon-wrap {
  width:  var(--dimension-40);
  height: var(--dimension-40);
}

.card--horizontal .card-description { margin: 0; }

/* footnote sits at the bottom of the left column */
.card--horizontal .card-footnote { margin-top: auto; }

.card-right {
  display:         flex;
  flex-direction:  column;
  justify-content: center;
}

/* Narrow, the horizontal card stacks and the type steps down: the section
   title h3 to the h4 size, a card's title h4 to h5, the subtitle and the
   card descriptions regular to small (the horizontal card keeps its type). The level -- as= -- is the page's outline
   and does not move; see readAs() in token-scales.js for how the size does.

   Twice, because a card is sometimes placed on its own (the SingleCard
   story): with no section around it there is no container to ask, and it
   reads the screen as it always did. In a section the container rule says
   the same thing whenever the screen rule does -- a section is never wider
   than the screen -- and says it alone when the section is narrow on a wide
   screen. */
@media ${n(o(`md`))} {
  .card--horizontal {
    grid-template-columns: 1fr;
  }

  .card--horizontal .card-footnote { margin-top: 0; }

  .card-text-wrap .card-title       { ${n(a(`heading-h4`,`heading-h5`))} }
  .card-text-wrap .card-description { ${n(a(`body-regular`,`body-small`))} }
}

@container ${n(o(`md`))} {
  .card--horizontal {
    grid-template-columns: 1fr;
  }

  .card--horizontal .card-footnote { margin-top: 0; }

  .card-text-wrap .card-title       { ${n(a(`heading-h4`,`heading-h5`))} }
  .card-text-wrap .card-description { ${n(a(`body-regular`,`body-small`))} }
  .cs-title         { ${n(a(`heading-h3`,`heading-h4`))} }
  .cs-subtitle      { ${n(a(`body-regular`,`body-small`))} }
}

/* Every --cs-bar-* read here carries a fallback, because all of them are
   declared on :host(bd-compare-section) and none on :host(compare-bar). A
   var() with no fallback is invalid at computed-value time, so a bar used
   outside a section lost its height entirely: measured on CompareSection
   "compare-bar (isolated)", which puts four bars in a plain div, the track
   was 0px tall with no border and no fill, and the overflow: hidden below
   clipped the label away with it. Four invisible bars in a story whose whole
   job is to show the bar on its own -- and render-health cannot see it,
   because other things on the page do occupy space.
   
   The fallbacks are the same values the section declares, so a bar inside a
   section is unchanged, and a themed section still wins: a custom property
   inheriting from an ancestor beats a fallback, where a declaration on
   :host(compare-bar) would have beaten the theme and pinned every bar. */
.bar-track {
  position:      relative;
  height:        var(--cs-bar-height, var(--dimension-48));
  border-radius: var(--shape-radius-xl);
  overflow:      hidden;
  background:    var(--cs-bar-track-bg, transparent);
  border:        var(--border-width-1) solid var(--cs-bar-track-border, var(--color-border-subtle));
  box-sizing:    border-box;
}

.bar-fill {
  position:        absolute;
  inset:           0 auto 0 0;
  height:          100%;
  max-width:       100%;
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  gap:             var(--spacing-8);
  padding:         0 var(--spacing-16);
  box-sizing:      border-box;
  background:      transparent;
  transition:      width calc(var(--transition-duration-slower) + 300ms)
                   cubic-bezier(0.22, 1, 0.36, 1);
  min-width:       0;
}

:host(compare-bar.compare-no-motion) .bar-fill { transition: none; }

@media (prefers-reduced-motion: reduce) {
  .bar-fill { transition: none; }
}

.bar-label {
  flex:          1 1 auto;
  min-width:     0;
  overflow:      hidden;
  text-overflow: ellipsis;
  white-space:   nowrap;
}

.bar-score { flex: 0 0 auto; }

.bar-label,
.bar-score {
  font-family:    var(--typography-fontFamily-sans);
  font-size:      var(--typography-body-regular-fontSize);
  line-height:    var(--typography-body-regular-lineHeight);
  letter-spacing: var(--typography-body-regular-letterSpacing);
}

.bar-score { font-variant-numeric: tabular-nums; }

/* The fallbacks matter: --cs-bar-primary-bg and -fg are declared on
   :host(bd-compare-section) only, so a compare-bar used on its own has neither.
   var() with no fallback is invalid at computed-value time, which made the fill
   transparent and dropped the label back to inherited ink -- measured on
   CompareSection "compare-bar (isolated)", a primary bar with
   background rgba(0, 0, 0, 0) and a dark label, indistinguishable from a
   secondary bar apart from its weight.
   
   Fallbacks rather than a declaration on :host(compare-bar): a value set on the
   bar's own host would override the one inheriting from a themed section and
   pin every bar blue. */
:host(compare-bar[variant="primary"]) .bar-fill {
  background: var(--cs-bar-primary-bg, var(--status-brand-fill));
}
:host(compare-bar[variant="primary"]) .bar-label,
:host(compare-bar[variant="primary"]) .bar-score {
  color:       var(--cs-bar-primary-fg, var(--status-brand-on-fill));
  /* no role: this weight belongs to the primary VARIANT, not to the text --
     the same bar reads 400 in every other variant. A variant is a UI state,
     the category CLAUDE.md keeps apart from type when it says a focus ring is
     never expressed by swapping a border colour. See button.css.js's
     .button--bold for the argument. */
  font-weight: var(--typography-fontWeight-semibold);
}

:host(compare-bar[variant="secondary"]) .bar-fill,
:host(compare-bar:not([variant]))       .bar-fill {
  /* no role: the same decision as --cs-bar-secondary-bg, which this repeats as
     a fallback for a compare-bar used outside a bd-compare-section. */
  background: var(--cs-bar-secondary-bg, var(--color-neutral-100));
}
:host(compare-bar[variant="secondary"]) .bar-label,
:host(compare-bar:not([variant]))       .bar-label,
:host(compare-bar[variant="secondary"]) .bar-score,
:host(compare-bar:not([variant]))       .bar-score {
  color:       var(--color-text-primary);
  font-weight: var(--typography-body-regular-fontWeight);
}

/* theme-green and theme-red take --status-*-fill and --status-*-on-fill: a
   saturated fill carrying a label on it is exactly the responsibility those
   roles name, and bd-badge variant="fill" already draws it.
   
   This is adopting a decision the system recorded rather than making a new one.
   badge.css.js: "green-700 with a white label, rather than the design's
   green-500 with a dark one. green-700 is the lightest step in the family that
   carries white text at 4.5:1 -- it measures 4.75, where green-600 is only
   3.20." So green-500-with-dark-ink was considered there and rejected.
   
   Measured on the built stories, white label on the primary fill:
     theme-green  green-500 #15c14f  2.39:1  FAIL  ->  green-700 #0e8532  4.75:1
     theme-red    red-500   #ff0000  4.00:1  FAIL  ->  red-600   #d60000  5.44:1
   Both are 16px/600, which is not WCAG large text, so the bar is 4.5:1.

   Each theme also used to set --cs-icon-color and --cs-icon-filter, eight
   declarations in all, and nothing read either one: the card icon is a <bd-img>
   sized by .card-icon-wrap and given no colour treatment at all. git log -S on
   the reading form finds no commit in the history where a consumer existed, so
   they were written and never wired up rather than orphaned by a later change.
   Removed. They were carrying a paragraph of contrast reasoning about the -500
   steps that read as a live decision, and one of the two occurrences of the raw
   #7c3aed literal -- the fill below is the only one left.

   Worth recording so it is not re-derived: green-500 is 2.39:1 on white, which
   is below the 3:1 non-text minimum, so tinting that icon green-500 would have
   been a 1.4.11 question if it had ever happened. It would not have failed even
   then -- compare.js renders the icon aria-hidden with alt="", which is the
   exemption -- but the margin is why nothing should reach for -500 here later
   on the strength of the deleted comment. */
:host(bd-compare-section.theme-green) {
  --cs-bar-primary-bg: var(--status-success-fill);
  --cs-bar-primary-fg: var(--status-success-on-fill);
}
:host(bd-compare-section.theme-red) {
  --cs-bar-primary-bg: var(--status-error-fill);
  --cs-bar-primary-fg: var(--status-error-on-fill);
}
/* theme-dark and theme-purple have no --status-*-fill pair to adopt -- "dark"
   and "purple" are themes, not statuses -- so the migration above does not
   reach them. They are settled separately, and only one of them is settled.

   theme-dark is D1, approved. The label measured 3.35:1 on the blue-400 fill
   and failed. Two directions had precedent here and they look different:
   darken the fill to blue-500 and keep the white label (4.53:1), or keep
   blue-400 and flip the ink dark (5.37:1). The approved direction is the
   second, because blue-400 is deliberately the brighter step so the fill still
   reads on a dark ground -- darkening it to blue-500 would have spent the one
   thing this theme exists for in order to fix the ink.

   The ink is --color-text-primary, and that is a responsibility rather than a
   value. Two tokens resolve to neutral-900 today and only one of them means
   this. --status-warning-on-fill is the ink belonging to the *warning* fill,
   and a compare bar is not a warning; taking it for the value would also tie
   this theme to yellow-500's future, so a warning fill later dark enough to
   carry white would turn this label white on light blue. --color-text-primary
   is the default ink for copy on a light ground, which is what a label on a
   light blue fill is, and it is already what the secondary bar's label uses on
   --cs-bar-secondary-bg two rules above. Same job in the same file, same role.

   Measured on the built stories at 16px/600, which is not WCAG large text, so
   the bar is 4.5:1:
     theme-dark  blue-400 #338bff  white #ffffff  3.35:1  FAIL
                                -> ink   #151719  5.37:1  PASS

   theme-purple measures 5.70:1 and passes, so there is no accessibility
   pressure; #7c3aed is a raw hex for a colour the palette does not contain.
   Giving it a token or retiring the theme is a product decision, still open.

   This used to add "and lint:tokens does not report it", which reads as a gate
   weakness and is not one. lint:tokens carries the literal in ALLOW.hex with
   the reason on the line above it -- no purple in the palette, nearest token
   34.6 deltaE away -- so the silence is a registered exception, not a miss.
   Checked by probe: an unlisted off-scale hex reports hex-off-scale and fails
   the build, a palette value reports hex-for-token, and this one stays quiet.
   The check:color-coverage side needs its own record, which is what the
   no token: marker below is; the two gates do not share an exemption. */
:host(bd-compare-section.theme-purple) {
  /* no token: the open product decision recorded above -- purple is not in the
     palette, so neither the fill nor the ink that belongs to it can resolve.
     green and red take --status-*-fill / --status-*-on-fill because they ARE
     statuses; there is no such pair to adopt here, and giving white ink a role
     while its ground stays a literal would record half a decision. */
  --cs-bar-primary-bg: #7c3aed;
  --cs-bar-primary-fg: var(--color-neutral-0);  /* no token: as above */
}
:host(bd-compare-section.theme-dark) {
  /* no role: nothing in the semantic set resolves to blue-400. That is the
     point of the D1 decision above -- blue-400 is deliberately the brighter
     step so the fill still reads on a dark ground -- so the absence is the
     theme working, not a gap to close. */
  --cs-bar-primary-bg: var(--color-brand-400);
  --cs-bar-primary-fg: var(--color-text-primary);
  --cs-section-text: var(--color-text-inverse);
}

:host(bd-compare-section.bars-tall)    { --cs-bar-height: var(--dimension-56); }
:host(bd-compare-section.bars-compact) { --cs-bar-height: var(--dimension-40); --cs-gap: var(--spacing-24); }
`;function l(e){let t=getComputedStyle(e);return{stretch:t.getPropertyValue(`--cs-bar-stretch`).trim()!==`0`,rMinStr:t.getPropertyValue(`--cs-stretch-r-min`).trim(),fillMin:parseFloat(t.getPropertyValue(`--cs-bar-fill-min`).trim()),gamma:parseFloat(t.getPropertyValue(`--cs-bar-stretch-gamma`).trim())}}var u=800,d=e=>1-(1-e)**3,f=!1,p=0;function m(){return!f&&!g()}function h(){f||p||(p=setTimeout(()=>{p=0,f=!0},920))}function g(){try{return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}catch{return!1}}var _=class e extends i{static properties={label:{type:String},score:{type:Number},maxScore:{type:Number,attribute:`max-score`},variant:{type:String},scoreLabel:{type:String,attribute:`score-label`},referenceScore:{type:Number,attribute:`reference-score`},scale:{type:Number},_animatedScore:{state:!0}};static styles=[c];constructor(){super(),this.label=``,this.score=0,this.maxScore=6,this.variant=`secondary`,this.scoreLabel=``,this.referenceScore=0,this.scale=1,this._animatedScore=NaN,this._scoreAnimRaf=0,this._internals=this.attachInternals?.(),this._internals&&(this._internals.role=`meter`)}connectedCallback(){super.connectedCallback(),m()?(h(),this._shouldAnimateCompetitorScore()&&(this._animatedScore=this._scoreAnimStart())):this.classList.add(`compare-no-motion`)}disconnectedCallback(){super.disconnectedCallback(),this._cancelScoreAnim()}updated(e){super.updated(e),this._syncMeter(),[`score`,`referenceScore`,`scoreLabel`,`variant`,`maxScore`,`label`].some(t=>e.has(t))&&(this._cancelScoreAnim(),m()?this._shouldAnimateCompetitorScore()?(this._animatedScore=this._scoreAnimStart(),this._runScoreAnim()):this._animatedScore=NaN:(this.classList.add(`compare-no-motion`),this._animatedScore=NaN))}_shouldAnimateCompetitorScore(){return this.variant===`primary`||this.scoreLabel?!1:Number.isFinite(parseFloat(this.score))}_scoreAnimStart(){let e=parseFloat(this.score),t=parseFloat(this.referenceScore),n=parseFloat(this.maxScore)||6,r=t>0?t:n;return r<=e&&(r=Math.min(n,e+.2)),r}_cancelScoreAnim(){this._scoreAnimRaf&&=(cancelAnimationFrame(this._scoreAnimRaf),0)}_runScoreAnim(){let e=parseFloat(this.score),t=this._animatedScore;if(!Number.isFinite(e)||!Number.isFinite(t))return;let n=performance.now(),r=i=>{let a=Math.min(1,(i-n)/u),o=d(a);this._animatedScore=t+(e-t)*o,a<1?this._scoreAnimRaf=requestAnimationFrame(r):(this._scoreAnimRaf=0,this._animatedScore=NaN,this.requestUpdate())};this._scoreAnimRaf=requestAnimationFrame(r)}get _pct(){let e=parseFloat(this.score)||0;if(this.variant===`primary`)return 100;let t=parseFloat(this.referenceScore);if(t>0){let n=Math.min(1,Math.max(0,e/t)),r=n*100,{stretch:i,rMinStr:a,fillMin:o,gamma:s}=l(this);if(!i||!a||a===`none`)return Math.min(100,Math.max(0,r));let c=parseFloat(a);if(Number.isNaN(c)||c>=1-1e-9)return Math.min(100,Math.max(0,r));let u=1-c,d=Number.isFinite(o)?o:50,f=Number.isFinite(s)&&s>0?s:1,p=(n-c)/u,m=d+Math.min(1,Math.max(0,p))**+f*(100-d);return Math.min(100,Math.max(0,m))}let n=parseFloat(this.maxScore)||6;return n===0?0:Math.min(100,Math.max(0,e/n*100))*(this.scale||1)}get _displayScore(){return this.scoreLabel||this.score}_renderScoreText(){return this.variant===`primary`||this.scoreLabel?this._displayScore:Number.isFinite(this._animatedScore)?e._formatScoreTick(this._animatedScore):this._displayScore}static _formatScoreTick(e){return(Math.round(e*100)/100).toFixed(2)}_syncMeter(){let e=this._internals;if(!e)return;let t=this.maxScore??6,n=parseFloat(this.score);e.ariaLabel=this.label,e.ariaValueMin=`0`,e.ariaValueMax=String(t),e.ariaValueNow=Number.isFinite(n)?String(n):null,e.ariaValueText=`score ${this.scoreLabel||this.score} out of ${t}`}render(){return t`
      <div class="bar-track">
        <div class="bar-fill" style="width: ${this._pct}%">
          <span class="bar-label" aria-hidden="true">${this.label}</span>
          <span class="bar-score" aria-hidden="true">${this._renderScoreText()}</span>
        </div>
      </div>
    `}};customElements.define(`compare-bar`,_);var v=class e extends i{static _idSeq=0;static properties={title:{type:String},description:{type:String},footnote:{type:String},footnoteHref:{type:String,attribute:`footnote-href`},iconSrc:{type:String,attribute:`icon-src`},layout:{type:String},barStretch:{type:Boolean,attribute:`bar-stretch`},barFillMin:{type:Number,attribute:`bar-fill-min`},barStretchGamma:{type:Number,attribute:`bar-stretch-gamma`},chartScale:{type:Number,attribute:`chart-scale`}};static styles=[c];constructor(){super();let t=++e._idSeq;this._headingId=`compare-card-title-${t}`,this._chartHelpId=`compare-card-chart-${t}`,this.title=``,this.description=``,this.footnote=``,this.footnoteHref=``,this.iconSrc=``,this.layout=``,this.barStretch=!0,this.barFillMin=50,this.barStretchGamma=1,this.chartScale=6}firstUpdated(){this._syncBarStretch()}updated(e){super.updated(e),(e.has(`barFillMin`)||e.has(`barStretchGamma`)||e.has(`barStretch`))&&this._syncBarStretch()}_syncBarStretch(){let e=this.shadowRoot?.querySelector(`slot`);e&&(()=>{let t=e.assignedElements({flatten:!0}).filter(e=>e.localName===`compare-bar`);if(!this.barStretch){this.style.setProperty(`--cs-bar-stretch`,`0`),this._refreshBars(t);return}let n=t.find(e=>e.variant===`primary`),r=n?parseFloat(n.score):0;if(!r||r<=0||t.filter(e=>e.variant!==`primary`).length<2){this.style.setProperty(`--cs-bar-stretch`,`0`),this._refreshBars(t);return}let i=1;for(let e of t){if(e.variant===`primary`)continue;let t=parseFloat(e.score);Number.isNaN(t)||(i=Math.min(i,t/r))}i>=1-1e-6?this.style.setProperty(`--cs-bar-stretch`,`0`):(this.style.setProperty(`--cs-bar-stretch`,`1`),this.style.setProperty(`--cs-stretch-r-min`,String(i)),this.style.setProperty(`--cs-bar-fill-min`,String(this.barFillMin)),this.style.setProperty(`--cs-bar-stretch-gamma`,String(this.barStretchGamma))),this._refreshBars(t)})()}_refreshBars(e){queueMicrotask(()=>{e.forEach(e=>e.requestUpdate?.())})}_renderFootnote(){if(!this.footnote)return``;if(!this.footnoteHref)return t`<bd-p variant="xsmall" class="card-footnote">${this.footnote}</bd-p>`;let e=this.footnote.indexOf(`Source `);if(e===-1)return t`
        <bd-p variant="xsmall" class="card-footnote">
          <bd-link href="${this.footnoteHref}" target="_blank" font-size="xs" color="strong" underline>
            ${this.footnote}
          </bd-link>
        </bd-p>
      `;let n=this.footnote.slice(0,e+7),r=this.footnote.slice(e+7);return t`
      <bd-p variant="xsmall" class="card-footnote">
        ${n}<bd-link href="${this.footnoteHref}" target="_blank" font-size="xs" color="strong" underline>${r}</bd-link>
      </bd-p>
    `}_renderHorizontal(){return t`
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
              ${this.iconSrc?t`
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
            ${this.description?t`
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
    `}render(){return this.layout===`horizontal`?this._renderHorizontal():t`
      <article
        class="card"
        aria-labelledby="${this._headingId}"
        aria-describedby="${this._chartHelpId}"
      >
        <p class="cs-sr-only" id="${this._chartHelpId}">
          Bar lengths are scaled for visibility between brands. Use the announced scores for exact values; scale is out of ${this.chartScale}.
        </p>

        <div class="card-header">
          ${this.iconSrc?t`
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
            ${this.description?t`
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
    `}};customElements.define(`compare-card`,v);var y=class e extends i{static _idSeq=0;static properties={title:{type:String},subtitle:{type:String},columns:{type:Number},gap:{type:String}};static styles=[s,c];constructor(){super(),this._sectionTitleId=`bd-compare-section-title-${++e._idSeq}`,this.title=``,this.subtitle=``,this.columns=2,this.gap=``}firstUpdated(){h()}render(){let e=this.gap?`--_cols: ${this.columns}; --cs-gap: ${this.gap}`:`--_cols: ${this.columns}`;return t`
      <section
        class="bd-ensemble cs-section"
        aria-labelledby="${this.title?this._sectionTitleId:r}"
      >
        ${this.title||this.subtitle?t`
            <div class="cs-heading">
              ${this.title?t`<bd-h as="h3" class="cs-title" id="${this._sectionTitleId}">${this.title}</bd-h>`:``}
              ${this.subtitle?t`
                  <bd-p variant="regular" class="cs-subtitle">
                    ${this.subtitle}
                  </bd-p>
                `:``}
            </div>
          `:``}

        <div class="cs-grid" style="${e}">
          <slot></slot>
        </div>
      </section>
    `}};customElements.define(`bd-compare-section`,y);export{_ as CompareBar,v as CompareCard,y as CompareSection};