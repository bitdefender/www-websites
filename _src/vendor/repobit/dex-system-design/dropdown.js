import{a as e,i as t,l as n,n as r,t as i}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import"../../_chunks/repobit-dex-system-design5.js";import{n as a,r as o}from"../../_chunks/repobit-dex-system-design12.js";import{n as s,t as c}from"../../_chunks/lit-html.js";import{n as l}from"../../_chunks/repobit-dex-system-design19.js";var{I:u}=e,d={},f=(e,t=d)=>e._$AH=t,p=c(class extends s{constructor(){super(...arguments),this.key=r}render(e,t){return this.key=e,t}update(e,[t,n]){return t!==this.key&&(f(e),this.key=t),n}}),m=n`
  /* No width. This used to be 90%, an arbitrary fraction that made every field
     narrower than whatever contained it and left the last tenth unexplained.
     A field is display:block and fills its container; deciding how wide that
     container is belongs to the page. */
  :host {
    display: block;
  }

  .input-container {
    display: flex;
    flex-direction: column;
  }

  /* ---- label ------------------------------------------------------------
     Driven by --form-label-*, the same tokens bd-label reads, so the field's
     built-in label and the standalone atom render identically. They did not
     before: these rules hardcoded bold where the token says medium, which is
     200 units apart on the same line of the same form. */
  .form-label {
    display: block;
    font-family: var(--form-label-default-fontFamily);
    color: var(--form-label-default-color);
    letter-spacing: var(--form-label-default-letterSpacing);
  }

  .label-sm {
    font-size: var(--form-label-small-fontSize);
    font-weight: var(--form-label-small-fontWeight);
    line-height: var(--form-label-small-lineHeight);
    letter-spacing: var(--form-label-small-letterSpacing);
    margin-bottom: var(--form-label-small-marginBottom);
  }

  .label-md {
    font-size: var(--form-label-default-fontSize);
    font-weight: var(--form-label-default-fontWeight);
    line-height: var(--form-label-default-lineHeight);
    margin-bottom: var(--form-label-default-marginBottom);
  }

  .label-lg {
    font-size: var(--form-label-large-fontSize);
    font-weight: var(--form-label-large-fontWeight);
    line-height: var(--form-label-large-lineHeight);
    margin-bottom: var(--form-label-large-marginBottom);
  }

  .form-label__required {
    color: var(--form-label-required-color);
    margin-inline-start: var(--form-label-required-marginLeft);
  }

  /* ---- the control ------------------------------------------------------
     line-height is tight here and only here. The height below is derived from
     padding, type step and line-height, and bd-button derives its own from the
     same three, which is what keeps a field and a button of the same size the
     same height. At normal (1.5) the line box also stood taller than the
     content box the fixed height leaves, and the select clipped the descenders
     of its own option text. */
  .form-input-bd {
    width: 100%;
    box-sizing: border-box;
    font-family: var(--form-input-default-fontFamily);
    /* no role: tight is load-bearing here rather than chosen -- the comment
       above this rule has the argument. The height is DERIVED from padding,
       type step and this leading, so a role's leading would change the
       control's height; and an <input> renders one line, so CLAUDE.md's
       "anything that can wrap needs at least tight" floor is met and its
       concern does not arise. Overridden for the textarea, which does wrap:
       see textarea.css.js. */
    line-height: var(--typography-lineHeight-tight);
    border: var(--form-input-default-borderWidth) solid var(--form-input-default-borderColor);
    background-color: var(--form-input-default-backgroundColor);
    color: var(--form-input-default-color);
    outline: none;
    transition: border-color var(--transition-duration-slow) var(--transition-easing-smooth),
      background-color var(--transition-duration-slow) var(--transition-easing-smooth),
      box-shadow var(--transition-duration-slow) var(--transition-easing-smooth);
  }

  /* :focus-visible, not :focus. On a text field the two agree — a browser
     shows the indicator for a pointer click there too, because typing is
     expected — but the select is a control you click and walk away from, and
     it was drawing the full ring on every mouse press where bd-button drew
     nothing. There is no .focused class any more: a field's focused prop now
     moves real focus, so :focus-visible is the only thing that draws this. */
  .form-input-bd:focus-visible {
    border-color: var(--form-input-focus-borderColor);
    box-shadow: var(--focus-outline-primary);
    /* forced-colors mode does not paint box-shadow, so the ring
       vanishes there; it does paint an outline, in a system colour. This one
       is transparent everywhere else, and the offset lands it on the ring's
       outer band. */
    outline: var(--border-width-2) solid transparent;
    outline-offset: var(--focus-outline-offset);
  }

  /* ---- sizes ------------------------------------------------------------
     Four reads of the size's own token, no arithmetic. The height calc used to
     live here in triplicate; it lives in --form-input-*-height now, where the
     value it produces is also the value the package publishes. */
  .input-sm {
    padding: var(--form-input-small-padding);
    font-size: var(--form-input-small-fontSize);
    height: var(--form-input-small-height);
    border-radius: var(--form-input-small-borderRadius);
  }

  .input-md {
    padding: var(--form-input-medium-padding);
    font-size: var(--form-input-medium-fontSize);
    height: var(--form-input-medium-height);
    border-radius: var(--form-input-medium-borderRadius);
  }

  .input-lg {
    padding: var(--form-input-large-padding);
    font-size: var(--form-input-large-fontSize);
    height: var(--form-input-large-height);
    border-radius: var(--form-input-large-borderRadius);
  }

  /* The text's own room. --form-input-*-height is padding plus the line box,
     and the box is border-box, so the 1px border on each edge came out of the
     content: the line box stood 2px taller than the space left for it. An
     input centres its line and paints into the padding, so it never showed;
     a select does neither -- it clips at the content box -- and at md the
     descenders of "Italy gjpqy ș ț" lost their bottoms. Taking the border out
     of the block padding instead gives the line all of its box and leaves
     every height where it was, on its button. The textarea is left out: its
     height comes from its rows, so this would only make it 2px shorter. */
  .input-sm:not(textarea) {
    padding-block: calc(var(--spacing-8) - var(--form-input-default-borderWidth));
  }

  .input-md:not(textarea) {
    padding-block: calc(var(--spacing-12) - var(--form-input-default-borderWidth));
  }

  .input-lg:not(textarea) {
    padding-block: calc(var(--spacing-16) - var(--form-input-default-borderWidth));
  }

  ::placeholder {
    color: var(--color-text-subtle);
    opacity: 1;
  }

  /* On a tinted field the placeholder takes the next step up. text-subtle on
     the error tint measured 4.22:1 and on the success tint 4.43 -- under 4.5,
     and an empty required field in error is exactly when the placeholder is
     showing. text-muted gives 5.95 and 6.25. The plain field keeps
     text-subtle (4.81). */
  .form-input--error::placeholder,
  .form-input-bd:where(:user-invalid)::placeholder,
  .form-input--attempted:where(:invalid)::placeholder,
  .form-input--success::placeholder {
    color: var(--color-text-muted);
  }

  /* ---- states -----------------------------------------------------------
     Error is what the browser finds, not only a flag. A control that fails
     its own constraints -- required and empty, an email that is not one --
     shows it once the reader has finished with it (:user-invalid: changed,
     then left) or once a submit has been tried (--attempted, which the host
     sets on the form's invalid event: the control in here has no form owner,
     so :user-invalid never hears of the submit). Before either, an empty
     required field is not yet an error, which is the point of :user-invalid.

     The invalid prop still forces the state, for what only the page
     knows -- a server's answer. :where() holds all three at one class's
     weight, so the focus border above still wins while the reader is
     correcting the field, as it always has for the prop. */
  .form-input--error,
  .form-input-bd:where(:user-invalid),
  .form-input--attempted:where(:invalid) {
    background-color: var(--form-input-error-backgroundColor);
    border-color: var(--form-input-error-borderColor);
  }

  .form-input--success {
    background-color: var(--form-input-success-backgroundColor);
    border-color: var(--form-input-success-borderColor);
  }

  .form-input--disabled {
    background-color: var(--form-input-disabled-backgroundColor);
    border-color: var(--form-input-disabled-borderColor);
    color: var(--form-input-disabled-color);
    cursor: not-allowed;
  }

  /* ---- help text --------------------------------------------------------
     The same roles bd-help-text renders, so a field's built-in message and the
     standalone atom agree on colour and measure. */
  .form-help-text {
    font-family: var(--form-help-text-default-fontFamily);
    font-size: var(--form-help-text-default-fontSize);
    font-weight: var(--form-help-text-default-fontWeight);
    line-height: var(--form-help-text-default-lineHeight);
    letter-spacing: var(--form-help-text-default-letterSpacing);
    margin-top: var(--form-help-text-default-marginTop);
  }

  .form-help-text--default {
    color: var(--form-help-text-default-color);
  }

  .form-help-text--error {
    color: var(--form-help-text-error-color);
  }

  /* Rules of their own: :has() is not forgiving, so a browser that does not
     know :user-invalid drops the whole rule it sits in -- in a list with the
     class above, it took the invalid prop's help-text colour with it, and
     beside the attempted case it would take that too. */
  .input-container:has(.form-input--attempted:invalid) .form-help-text--default {
    color: var(--form-help-text-error-color);
  }

  .input-container:has(.form-input-bd:user-invalid) .form-help-text--default {
    color: var(--form-help-text-error-color);
  }

  .form-help-text--success {
    color: var(--form-help-text-success-color);
  }

  @media (prefers-reduced-motion: reduce) {
    .form-input-bd {
      transition: none;
    }
  }
`,h=n`
  /* The caret is a sibling of the select rather than a pseudo-element, because a
     select cannot carry a reliable one of its own.

     This wrapper used to set color: var(--form-input-default-color) purely so
     currentColor on the mark resolved to the field's ink instead of whatever the
     page happened to carry. The caret names its own role now, so that
     declaration had no remaining reader and is gone. */
  .select-wrap {
    position: relative;
    display: block;
  }

  select.form-input-bd {
    appearance: none;
    cursor: pointer;
    /* Clearance for the chevron: its own width plus the gap on either side.
       This used to be a padding-right on a bare select type selector, which the
       .input-* size classes then overrode with the padding shorthand — they
       are a class each and beat a type selector — so the clearance never
       applied and a long option ran underneath the chevron. Typing it onto
       select.form-input-bd outranks them. */
    padding-inline-end: calc(var(--icon-sm-size) + var(--spacing-12) * 2);
  }

  /* bd-arrow-down-icon, positioned over the select. Three versions of this mark,
     and the progression is the point:

       background-image  an encoded SVG carrying fill="%23000000" -- black,
                         percent-encoded inside a url(), which no theme could
                         reach and no lint could see
       mask              the same encoded SVG, alpha only, so the mark finally
                         took currentColor and followed the field's own ink
       the atom          what it is now

     The mask fixed the colour and left the real problem: the glyph was still a
     drawing encoded in a stylesheet, invisible to check:icons, and it was a
     SOLID TRIANGLE where every other disclosure control in the package uses a
     chevron -- which is also what this file's Figma Dropdown has always shown.
     A select cannot carry a reliable pseudo-element of its own, but it can have
     a sibling, so the caret is now the same atom the accordion uses. */
  .select-caret {
    /* muted at rest, brand when open -- the same pair bd-anchor-nav's mobile
       toggle uses, and converged on deliberately. This was action/primary in
       both states, which says "this control opens" and says nothing about
       whether it IS open; the rotation carried that alone. Letting the colour
       carry it too is the answer the other disclosure control already gave.

       Measured on all four grounds a caret sits on, against the 3:1 WCAG
       1.4.11 asks of non-text UI -- and muted beats action/primary on every
       one of them:

                       white   error tint   success tint   disabled
         text/muted     6.59      5.95          6.25         5.12
         text/brand     6.18      5.58          5.86         4.80
         action/primary 4.53      4.10          4.30         3.52

       The disabled rule below is (0,3,0) against this (0,1,0), so a disabled
       field keeps its grey and never shows the open colour. */
    color: var(--color-text-muted);
    position: absolute;
    top: 50%;
    inset-inline-end: var(--spacing-12);
    transform: translateY(-50%);
    pointer-events: none;
    /* normal, not fast: bd-anchor-nav's chevron turns on the same gesture and
       already used it, and two durations for one motion is the kind of thing
       nobody notices as a decision and everybody notices as an inconsistency. */
    transition: transform var(--transition-duration-normal) var(--transition-easing-smooth),
      color var(--transition-duration-normal) var(--transition-easing-smooth);
  }

  /* Rotated rather than swapped for bd-arrow-up-icon, which is the same drawing
     the other way up. One element means the mark cannot change weight as it
     turns, and a transform can be animated where a DOM swap cannot. The weight
     argument was the sharper one when this was written -- arrow-up was still on
     the lighter Eclipse weight while arrow-down was on fill -- and although the
     two now agree, rotating keeps them from drifting apart again here. */
  .select-caret--open {
    transform: translateY(-50%) rotate(180deg);
    color: var(--color-text-brand);
  }

  @media (prefers-reduced-motion: reduce) {
    .select-caret {
      transition: none;
    }
  }

  /* The placeholder option, while it is the choice, takes the placeholder ink
     an empty input shows -- and, as there, the next step up on a tinted
     field, where text-subtle falls under 4.5:1 (form-field.css.js has the
     measurements). :enabled, so a disabled field keeps the disabled ink. */
  select.form-input--placeholder:enabled {
    color: var(--color-text-subtle);
  }

  select.form-input--placeholder:enabled:is(.form-input--error, .form-input--success, :user-invalid, .form-input--attempted:invalid) {
    color: var(--color-text-muted);
  }

  /* The options keep the field's ink. Where the picker is drawn by the page
     rather than the OS, an option inherits the select's colour, and would
     otherwise list every choice in the placeholder's grey. */
  select.form-input-bd option {
    color: var(--form-input-default-color);
  }

  /* The chevron is part of the control, so it greys with it. */
  .select-wrap:has(.form-input--disabled) .select-caret {
    color: var(--form-input-disabled-color);
  }
`,g=e=>{if(Array.isArray(e))return e;if(typeof e!=`string`)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}},_=class extends a(i){static properties={label:{type:String},options:{converter:{fromAttribute:g}},size:{type:String,reflect:!0},kind:{type:String},required:{type:Boolean},tooltip:{type:String},invalid:{type:Boolean},validated:{type:Boolean},disabled:{type:Boolean,reflect:!0},value:{type:String},name:{type:String,reflect:!0,converter:o},placeholder:{type:String},_open:{type:Boolean,state:!0}};constructor(){super(),this.label=``,this.options=[],this.size=`md`,this.kind=``,this.required=!1,this.tooltip=``,this.invalid=!1,this.validated=!1,this.disabled=!1,this.value=``,this.name=``,this.placeholder=``,this._open=!1}get _control(){return this.renderRoot?.querySelector?.(`select`)}get _values(){return[...this.placeholder?[``]:[],...this.options.map(String)]}connectedCallback(){super.connectedCallback(),this._onWindowFocus=()=>{this._open&&=!1},this._onDocPointerDown=e=>{this._open&&e.composedPath()[0]!==this.shadowRoot?.querySelector(`select`)&&(this._open=!1)},window.addEventListener(`focus`,this._onWindowFocus),document.addEventListener(`pointerdown`,this._onDocPointerDown,!0)}disconnectedCallback(){window.removeEventListener(`focus`,this._onWindowFocus),document.removeEventListener(`pointerdown`,this._onDocPointerDown,!0),super.disconnectedCallback()}_onSelectMouseDown(){this._open=!this._open}_onSelectKeyDown(e){(e.key===`Enter`||e.key===` `||e.altKey&&(e.key===`ArrowDown`||e.key===`ArrowUp`))&&(this._open=!0)}_closePicker(){this._open=!1}set options(e){this._options=g(e)}get options(){return this._options}willUpdate(e){e.has(`kind`)&&this.kind&&(this.size=this.kind),(e.has(`size`)||e.has(`kind`))&&(this.size=l(this.size));let t=this._values;t.includes(this.value)||(this.value=t[0]??``)}updated(){let e=this.shadowRoot.querySelector(`select`);e&&e.value!==this.value&&(e.value=this.value),this._sync()}_onChange(e){this._closePicker(),this.value=e.target.value,this._sync();let t={value:this.value,name:this.name};for(let e of[`bd-input`,`bd-change`])this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}render(){let e={sm:`input-sm`,md:`input-md`,lg:`input-lg`}[this.size],n={sm:`label-sm`,md:`label-md`,lg:`label-lg`}[this.size],i=this.disabled||this._formDisabled,a=i?`form-input--disabled`:this.invalid?`form-input--error`:this.validated?`form-input--success`:``,o=this.invalid?`form-help-text--error`:this.validated?`form-help-text--success`:`form-help-text--default`;return t`
      <div class="input-container">
        ${this.label?t`<label for="custom-dropdown" class="form-label ${n}">
              ${this.label}
              ${this.required?t`<span class="form-label__required" aria-hidden="true">*</span>`:``}
            </label>`:r}
        <div class="select-wrap">
          ${p(this._resets,t`<select
            id="custom-dropdown"
            class="form-input-bd ${e} ${a} ${this._attempted?`form-input--attempted`:``} ${this.placeholder&&this.value===``?`form-input--placeholder`:``}"
            ?required="${this.required}"
            ?disabled="${i}"
            aria-invalid="${this.invalid?`true`:r}"
            aria-describedby="${this.tooltip?`custom-dropdown-help`:r}"
            @mousedown="${this._onSelectMouseDown}"
            @keydown="${this._onSelectKeyDown}"
            name="${this.name||r}"
            @change="${this._onChange}"
            @blur="${this._closePicker}"
          >
            ${this.placeholder?t`<option value="" ?selected="${this.value===``}">${this.placeholder}</option>`:r}
            ${this.options.map(e=>t`<option value="${e}" ?selected="${String(e)===this.value}">
                ${e}
              </option>`)}
          </select>`)}
          <bd-arrow-down-icon
            size="sm"
            class="select-caret ${this._open?`select-caret--open`:``}"
          ></bd-arrow-down-icon>
        </div>
        ${this.tooltip?t`<div id="custom-dropdown-help" class="form-help-text ${o}">
              ${this.tooltip}
            </div>`:``}
      </div>
    `}};_.styles=[m,h],customElements.define(`bd-custom-dropdown`,_);