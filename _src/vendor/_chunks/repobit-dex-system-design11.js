import{c as e,i as t,l as n,n as r,t as i}from"./lit.js";import"./repobit-dex-system-design.js";import{n as a,o,s}from"./repobit-dex-system-design3.js";import"./repobit-dex-system-design12.js";var c=e`
  :host {
    display: inline-flex;

    /* Component-local aliases, not design tokens. Each defaults to the
       --button-* token that carries the system-wide answer, so there are two
       places to change a button and they do different jobs: set the token on
       :root to move every button in the document, or set the alias on the
       bd-button element to move one.

       The alias is also what surface="dark" switches further down, which is
       why it stays even now that the tokens behind it are live. */

    /* ---- primary: blue fill ------------------------------------------- */
    --bd-button-primary-bg: var(--button-primary-background-default);
    --bd-button-primary-bg-hover: var(--button-primary-background-hover);
    --bd-button-primary-bg-active: var(--button-primary-background-active);
    --bd-button-primary-text: var(--button-primary-text-default);

    /* ---- secondary: near-black fill ----------------------------------- */
    --bd-button-secondary-bg: var(--button-secondary-background-default);
    --bd-button-secondary-bg-hover: var(--button-secondary-background-hover);
    --bd-button-secondary-bg-active: var(--button-secondary-background-active);
    --bd-button-secondary-text: var(--button-secondary-text-default);

    /* ---- tertiary: blue outline --------------------------------------- */
    --bd-button-tertiary-text: var(--button-tertiary-text-default);
    --bd-button-tertiary-border: var(--button-tertiary-border-default);
    --bd-button-tertiary-bg-hover: var(--button-tertiary-background-hover);
    --bd-button-tertiary-text-hover: var(--button-tertiary-text-hover);
    --bd-button-tertiary-border-hover: var(--button-tertiary-border-hover);
    --bd-button-tertiary-bg-active: var(--button-tertiary-background-active);
    --bd-button-tertiary-text-active: var(--button-tertiary-text-active);

    /* ---- ghost: dark outline ------------------------------------------ */
    --bd-button-ghost-text: var(--button-ghost-text-default);
    --bd-button-ghost-border: var(--button-ghost-border-default);
    --bd-button-ghost-bg-hover: var(--button-ghost-background-hover);
    --bd-button-ghost-text-hover: var(--button-ghost-text-hover);
    --bd-button-ghost-bg-active: var(--button-ghost-background-active);
    --bd-button-ghost-text-active: var(--button-ghost-text-active);

    /* ---- accent: red fill --------------------------------------------- */
    --bd-button-accent-bg: var(--button-accent-background-default);
    --bd-button-accent-bg-hover: var(--button-accent-background-hover);
    --bd-button-accent-bg-active: var(--button-accent-background-active);
    --bd-button-accent-text: var(--button-accent-text-default);

    /* ---- white and outline-white: fixed presets for a coloured banner --
       They ignore surface on purpose; see the note on VARIANTS in button.js. */
    --bd-button-white-bg: var(--button-white-background-default);
    --bd-button-white-bg-hover: var(--button-white-background-hover);
    --bd-button-white-bg-active: var(--button-white-background-active);
    --bd-button-white-text: var(--button-white-text-default);

    --bd-button-outline-white-text: var(--button-outline-white-text-default);
    --bd-button-outline-white-border: var(--button-outline-white-border-default);
    --bd-button-outline-white-bg-hover: var(--button-outline-white-background-hover);
    --bd-button-outline-white-bg-active: var(--button-outline-white-background-active);

    /* ---- disabled, shared across every variant ----------------------- */
    --bd-button-disabled-bg: var(--button-disabled-backgroundColor);
    --bd-button-disabled-text: var(--button-disabled-color);
    --bd-button-disabled-border: var(--button-disabled-borderColor);

    /* accent carries no ring on a light page; on a dark one it needs a
       boundary, so the value is switched rather than the rule */
    --bd-button-accent-ring: var(--button-accent-ring-default);

    /* the focus ring is switched the same way: surface="dark" swaps the blue
       outline for a white one. white and outline-white do not read this; see
       FOCUS. */
    --bd-button-focus-ring: var(--button-shared-focus-outline);

    --bd-button-border-width: var(--border-width-2);
  }

  /* ============================================
     WIDTH
     --bd-button-width is how wide the button is, and it is the container's
     to set: on the element, or from a ::slotted() rule, which is the one
     thing a component holding a slotted button can reach. bd-anchor-nav and
     bd-bento-item run their CTA full width on a phone this way, where they
     used to listen to the window and write fullwidth on the page's own
     element. Unset, the button hugs its label as before. fullwidth and align
     still win -- :where() gives the inner rule no weight -- and an icon-only
     circle ignores it, as it ignores fullwidth.
     ============================================ */
  :host(:not([icon-only])) {
    width: var(--bd-button-width, auto);
  }

  :where(.button:not(.button--icon-only)) {
    width: var(--bd-button-width, auto);
  }

  /* ============================================
     ALIGNMENT
     ============================================ */
  :host([align="center"]) {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  :host([align="right"]) {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }

  :host([align="left"]) {
    display: inline-flex;
    justify-content: flex-start;
  }

  :host([fullwidth]) {
    display: block;
    width: 100%;
  }

  :host([align="center"][fullwidth]) .button,
  :host([align="right"][fullwidth]) .button {
    width: 100%;
  }

  .max--width {
    width: 100%;
    display: flex;
  }

  /* ============================================
     FOCUS
     The design specifies no focus state, but 2.4.7 requires one.

     The ring is an outline held 2px off the control, and the 2px between is
     left transparent, so it is whatever surface the button sits on. That is
     the one thing code can do here that Figma cannot, and it is why the two
     differ. Figma builds a ring from spread shadows, every band of which is a
     painted colour, so its library paints the gap and keeps one ring per
     surface: focus/ring-primary on light, focus/ring-inverse on dark and
     brand. Painted in code, that gap is what went wrong twice: a white band
     merged into a white fill on surface="dark", and the neutral-900 band
     that replaced it drew a black outline round every button on a brand
     hero. A transparent gap cannot do either, on any surface.

     So only the colour switches: blue on light, white under surface="dark",
     which covers a brand hero and a neutral one alike; the numbers are on
     --focus-outline-traditional. Every variant takes the same ring, ghost
     included. An outline is also kept in forced-colors mode, where a
     box-shadow ring is not drawn at all.

     The rule leaves box-shadow alone, so an outlined variant's own boundary
     in --bd-button-edge stays put while focused.

     This used to be driven from JavaScript: two requestAnimationFrame hops
     checked :focus-visible and set a data attribute the CSS then styled.
     :focus-visible does that natively. There is no :focus { outline: none }
     beside it: the browser's own ring is a :focus-visible ring too, so a
     pointer focus never drew one, and the rule below replaces it.
     ============================================ */
  .button:focus-visible {
    outline: var(--bd-button-focus-ring);
    outline-offset: var(--button-shared-focus-outlineOffset);
  }

  /* white and outline-white are presets for a coloured banner and ignore
     surface, so they take the white ring on their own: 4.53:1 on blue-500,
     7.95:1 at the light end of the banner gradient. A blue ring there was
     2.38:1, and 1.75:1 at that end. */
  .button--white:focus-visible,
  .button--outline-white:focus-visible {
    outline: var(--focus-outline-traditional-inverse);
  }

  a.button {
    text-decoration: none;
  }

  /* ============================================
     SHARED
     ============================================ */
  .button,
  .bd-contact-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    text-decoration: none;
    border: none;
    cursor: pointer;
    font-family: var(--typography-fontFamily-sans);
    font-weight: var(--typography-control-label-large-fontWeight);
    line-height: var(--typography-control-label-large-lineHeight);
    vertical-align: middle;
    box-sizing: border-box;

    /* The variant's own boundary, held in a custom property so each state can
       switch it. It was introduced while the focus ring was a box-shadow, so
       the ring could COMPOSE with it: box-shadow is a single list, not
       additive, and .button:focus-visible (0,2,0) outranks .button--ghost
       (0,1,0) -- so a focus rule that declared box-shadow directly erased the
       border of every outlined variant, and a focused ghost button read as a
       tertiary one. The ring is an outline now and does not touch box-shadow;
       a focus rule that goes back to declaring it brings that defect back. */
    --bd-button-edge: 0 0 0 0 transparent;
    box-shadow: var(--bd-button-edge);

    transition: background-color var(--transition-duration-normal) var(--transition-easing-smooth),
      box-shadow var(--transition-duration-normal) var(--transition-easing-smooth),
      color var(--transition-duration-normal) var(--transition-easing-smooth);
  }

  /* bd-contact-button has no variant, so it would inherit no colour at all */
  .button.bd-contact-btn {
    background-color: transparent;
    color: var(--color-text-brand);
    gap: var(--spacing-8);

    /* Same inset bd-back carries, and for the same reason. Without it this
       control was a bare line box measuring 159x20 -- a 20px tall target
       against the 24x24 WCAG 2.5.8 asks of anything that is not inline in a
       sentence, so 4px short, and a standalone CTA has no exception to claim.
       It also left the focus ring sitting on the glyphs' ascenders.

       bd-back is the same shape of control -- text, a trailing mark, no fill --
       and already answers this with 12px 16px, which takes a 16px line to about
       44px: the same height bd-button reaches through its own padding. Reading
       the inset off the sibling rather than picking a number is what keeps the
       two text CTAs in step. */
    padding: var(--spacing-12) var(--spacing-16);

    /* This control takes no size class -- it is a text CTA with a trailing
       arrow, not a filled button -- so it arrived with no radius at all, and
       the shared ring drew SQUARE corners around a bare line box while every
       other button's ring followed a curve.

       --button-medium-borderRadius, not --focus-outline-radius. The focus
       token is the documented default for an element with NO radius, and that
       is what this rule used first -- but with the inset above the control is
       now a 44px box standing next to bd-button at the same height, and the
       focus token is --radius-sm where medium buttons are --radius-md. Four
       pixels against six is small, and it is visible when they sit in a row.
       Matching the size band this control actually occupies is the better
       answer than matching the rule for controls that occupy none.

       Declared unconditionally rather than under :focus-visible because the
       control draws no background and no border at rest, so the radius is
       invisible until the ring needs it. */
    border-radius: var(--button-medium-borderRadius);
  }

  /* ============================================
     SIZE
     Height is left to padding and line-height rather than pinned with a
     min-height, which lands within half a pixel of the design: 33.5 / 44 /
     54.5 against 34 / 45 / 55. The previous rules also carried hardcoded
     min-widths (115px, 150px) that the design does not ask for at all.

     The radius comes from --button-*-borderRadius rather than --radius-*
     directly. Same values, so nothing moves here — but a button and a field
     of the same size sit in the same form row, and reading both from their
     own size-matched alias is what keeps them in step. Spelled as raw scale
     steps on one side and aliases on the other, they had drifted a step apart
     at sm and md without either side looking wrong on its own.
     ============================================ */
  .button--small {
    padding: var(--button-small-padding);
    font-size: var(--button-small-fontSize);
    border-radius: var(--button-small-borderRadius);
    gap: var(--button-small-gap);
  }

  .button--medium {
    padding: var(--button-medium-padding);
    font-size: var(--button-medium-fontSize);
    border-radius: var(--button-medium-borderRadius);
    gap: var(--button-medium-gap);
  }

  .button--large {
    padding: var(--button-large-padding);
    font-size: var(--button-large-fontSize);
    border-radius: var(--button-large-borderRadius);
    gap: var(--button-large-gap);
  }

  /* No size attribute: md on phone and tablet, lg on desktop. The same
     declarations as the two bands above, switched at lg so it lands on the
     grid's own desktop step rather than a width of its own. */
  .button--responsive {
    padding: var(--button-medium-padding);
    font-size: var(--button-medium-fontSize);
    border-radius: var(--button-medium-borderRadius);
    gap: var(--button-medium-gap);
  }
  @media ${n(a(`lg`))} {
    .button--responsive {
      padding: var(--button-large-padding);
      font-size: var(--button-large-fontSize);
      border-radius: var(--button-large-borderRadius);
      gap: var(--button-large-gap);
    }
  }

  .button--bold {
    /* no role: the class is the semantic. .button--bold says what this
       declaration does, so a role naming it would only restate the class --
       there is no text-content type here for a role to describe, just an
       emphasis the caller asked for by name. The same holds for a weight
       driven by an active or selected state: that is a UI state, the category
       CLAUDE.md keeps apart from type when it says a focus ring is never
       expressed by swapping a border colour. This is the argument for every
       "no role: state or modifier" marker in the package -- the others point
       here rather than restating it. */
    font-weight: var(--typography-fontWeight-semibold);
  }

  /* shape="rounded". After the size rules on purpose: same specificity, so
     source order is what lets the shape replace the size band's corner. */
  .button--rounded {
    border-radius: var(--shape-radius-3xl);
  }

  /* ============================================
     HOVER ARROW — accent, unless no-arrow
     The button keeps its width: the label slides toward the inline start
     and the arrow, absolutely positioned at the end, fades in where the
     label was. --_dir turns both slides round on a right-to-left page, the
     multiplier bd-pagination-dots uses; the arrow itself mirrors there (see
     icon-element.js), so it still points the way the label moved from.
     ============================================ */
  .button__label {
    display: inline-block;
  }

  .button--with-arrow {
    --_dir: 1;
    position: relative;
    overflow: hidden;
  }

  :host(:dir(rtl)) .button--with-arrow {
    --_dir: -1;
  }

  .button--with-arrow .button__label {
    transition: transform var(--transition-duration-normal) var(--transition-easing-smooth);
  }

  .button--with-arrow .button__arrow {
    position: absolute;
    top: 50%;
    inset-inline-end: var(--spacing-12);
    opacity: 0;
    transform: translate(calc(-1 * var(--_dir) * var(--spacing-8)), -50%);
    transition:
      opacity var(--transition-duration-normal) var(--transition-easing-smooth),
      transform var(--transition-duration-normal) var(--transition-easing-smooth);
    pointer-events: none;
  }

  .button--with-arrow:focus-visible .button__label {
    transform: translateX(calc(-1 * var(--_dir) * var(--spacing-12)));
  }

  .button--with-arrow:focus-visible .button__arrow {
    opacity: 1;
    transform: translate(var(--spacing-0), -50%);
  }

  /* Only where a pointer can hover. A touch screen has no real hover, and a
     tap left the arrow stuck out; this was a (hover: none) block undoing the
     hover rules after the fact, and asking first is the same thing said once. */
  @media (hover: hover) {
    .button--with-arrow:hover .button__label {
      transform: translateX(calc(-1 * var(--_dir) * var(--spacing-12)));
    }

    .button--with-arrow:hover .button__arrow {
      opacity: 1;
      transform: translate(var(--spacing-0), -50%);
    }
  }

  /* ============================================
     SHAPE — icon-only
     A circle around one icon. The diameter is not pinned, for the same reason
     the labelled height is not: equal padding on every side plus the icon step
     gives 8+16+8 = 32, 12+20+12 = 44 and 16+24+16 = 56. Only md sits level
     with a labelled button beside it: the labelled heights are 33.5, 44 and
     54.5, so sm is 1.5px shorter and lg 1.5px taller. Both differences come
     from the label's line box, which an icon does not have, and closing them
     would need an off-scale padding. sm is below the 44px target, exactly as
     the labelled sm is.

     The padding stays on the spacing scale, which is rem, while the icon is on
     the icon scale, which is px. So when a reader enlarges their text the
     circle grows and the glyph does not -- the target gets bigger for the
     reader a bigger target helps, and the shape stays round because the
     padding is equal on both axes.

     The compound selectors outrank the size classes whatever the source
     order, and they carry the radius too, so a size class can never put
     its own corner back. The slotted rule sizes a caller's icon to the step
     even if it was given a size of its own: a 20px glyph in a 56px circle
     reads as the wrong control, not as a choice.
     ============================================ */
  .button--icon-only {
    line-height: var(--typography-lineHeight-none);
  }
  .button--icon-only.button--small {
    --bd-button-icon-size: var(--icon-sm-size);
    padding: var(--spacing-8);
    border-radius: var(--radius-full);
  }
  .button--icon-only.button--medium {
    --bd-button-icon-size: var(--icon-md-size);
    padding: var(--spacing-12);
    border-radius: var(--radius-full);
  }
  .button--icon-only.button--large {
    --bd-button-icon-size: var(--icon-lg-size);
    padding: var(--spacing-16);
    border-radius: var(--radius-full);
  }
  .button--icon-only.button--responsive {
    --bd-button-icon-size: var(--icon-md-size);
    padding: var(--spacing-12);
    border-radius: var(--radius-full);
  }
  @media ${n(a(`lg`))} {
    .button--icon-only.button--responsive {
      --bd-button-icon-size: var(--icon-lg-size);
      padding: var(--spacing-16);
    }
  }
  /* the default arrow is fallback content, not slotted, so ::slotted below
     never reaches it; it takes the step through bd-icon's own property */
  .button__icon {
    --bd-icon-size: var(--bd-button-icon-size);
  }
  .button--icon-only > ::slotted(*) {
    height: var(--bd-button-icon-size);
  }
  /* loading swaps the icon for the spinner, so the spinner takes the icon's
     box rather than its em size, and the circle does not shrink while busy */
  .button--icon-only .spinner {
    width: var(--bd-button-icon-size);
    height: var(--bd-button-icon-size);
  }

  /* ============================================
     VARIANT — primary
     ============================================ */
  .button--primary {
    background-color: var(--bd-button-primary-bg);
    color: var(--bd-button-primary-text);
  }
  .button--primary:hover {
    background-color: var(--bd-button-primary-bg-hover);
  }
  .button--primary:active {
    background-color: var(--bd-button-primary-bg-active);
  }

  /* ============================================
     VARIANT — secondary
     ============================================ */
  .button--secondary {
    background-color: var(--bd-button-secondary-bg);
    color: var(--bd-button-secondary-text);
  }
  .button--secondary:hover {
    background-color: var(--bd-button-secondary-bg-hover);
  }
  .button--secondary:active {
    background-color: var(--bd-button-secondary-bg-active);
  }

  /* ============================================
     VARIANT — tertiary (blue outline)
     ============================================ */
  .button--tertiary {
    background-color: transparent;
    --bd-button-edge: inset 0 0 0 var(--bd-button-border-width) var(--bd-button-tertiary-border);
    color: var(--bd-button-tertiary-text);
  }
  .button--tertiary:hover {
    background-color: var(--bd-button-tertiary-bg-hover);
    --bd-button-edge: inset 0 0 0 var(--bd-button-border-width) var(--bd-button-tertiary-border-hover);
    color: var(--bd-button-tertiary-text-hover);
  }
  .button--tertiary:active {
    background-color: var(--bd-button-tertiary-bg-active);
    --bd-button-edge: inset 0 0 0 var(--bd-button-border-width) var(--bd-button-tertiary-bg-active);
    color: var(--bd-button-tertiary-text-active);
  }

  /* ============================================
     VARIANT — ghost (dark outline)
     ============================================ */
  .button--ghost {
    background-color: transparent;
    --bd-button-edge: inset 0 0 0 var(--bd-button-border-width) var(--bd-button-ghost-border);
    color: var(--bd-button-ghost-text);
  }
  .button--ghost:hover {
    background-color: var(--bd-button-ghost-bg-hover);
    color: var(--bd-button-ghost-text-hover);
  }
  .button--ghost:active {
    background-color: var(--bd-button-ghost-bg-active);
    --bd-button-edge: inset 0 0 0 var(--bd-button-border-width) var(--bd-button-ghost-bg-active);
    color: var(--bd-button-ghost-text-active);
  }

  /* ============================================
     VARIANT — accent
     ============================================ */
  .button--accent {
    background-color: var(--bd-button-accent-bg);
    color: var(--bd-button-accent-text);
    --bd-button-edge: inset 0 0 0 var(--bd-button-border-width) var(--bd-button-accent-ring);
  }
  .button--accent:hover {
    background-color: var(--bd-button-accent-bg-hover);
  }
  .button--accent:active {
    background-color: var(--bd-button-accent-bg-active);
  }

  /* ============================================
     SURFACE — dark

     For a hero or any panel with a full background colour. On a light page
     every variant passes; on a coloured one 21 of 25 variant/surface pairings
     failed, because tertiary and ghost put their ink straight onto the page
     and primary is literally the same colour as a blue-500 hero (1.00:1).

     The design carries no on-dark set — its axes are Size, Variant and State
     only — so these values are derived from our own palette rather than read
     off a spec, and every one is measured against blue-500, blue-600,
     blue-700, neutral-900 and neutral-950. They need a designer's sign-off.

     Two notes on what changed shape rather than just colour: ghost drops its
     ring here, because a white ring would make it identical to tertiary, and
     dropping it is what "ghost" conventionally means anyway. accent keeps its
     red so the conversion signal survives, and gains a white ring to give it
     a boundary against blue.

     WHY THE INK IS A ROLE AND THE GROUNDS ARE NOT, which is what the inline
     no role: markers below point at. check:color-coverage gained sight of
     these declarations on 2026-09-15 and classified twenty-three of them; a
     role of the right CATEGORY exists at the value for nineteen, and exactly
     nine survive the second question, which is whether the role's JOB is this
     declaration's job.

     The nine that do are all ink, and each one matches a role's own words.
     tertiary and ghost put their label straight onto the hero, and
     --color-text-inverse is defined as the high-emphasis ink on an inverse
     ground. Once a variant inverts and the label sits on the button's own
     light fill, it is ordinary ink again -- --color-text-primary -- or brand
     ink, --color-text-brand. disabled's label is a control the user cannot
     operate, which is --color-text-disabled's whole definition rather than a
     step on the hierarchy. Every one is value-identical, so nothing here
     renders differently.

     The grounds and hairlines have no role, and the reason is not scarcity.
     --color-surface-default carries this exact white, and its own theme
     clause in Foundations/Surfaces reads "On dark it is the dark ground, not
     white" -- so adopting it here would assert the opposite of what the
     declaration means. surface-subtle is a wash behind a group, not a press
     fill. surface-muted is a state surface and would fit primary's pressed
     step on value and nearly on job, but these three values are one ramp
     measured against the hero rather than three independent choices, and
     binding its last step to a role that can move on its own would break the
     relationship the measurement established. At neutral-700 and neutral-600
     there is no surface or border role at all, and there is no solid white
     border role anywhere: --color-border-container-inverse is white at 12%.

     So the missing vocabulary is nameable, and it is two entries: a control
     fill on an inverse ground, and a solid hairline on an inverse ground.
     Adding either is a vocabulary decision for the same designer pass this
     block is already waiting on, and token-scales.js is explicit that one
     consumer is not enough to name a role. Recorded, not taken.
     ============================================ */
  :host([surface='dark']) {
    /* white fill, brand label — the strongest thing on a coloured hero */
    --bd-button-primary-bg: var(--color-neutral-0);  /* no role: on-dark ground; see the block note */
    --bd-button-primary-bg-hover: var(--color-neutral-50);  /* no role: on-dark ground; see the block note */
    --bd-button-primary-bg-active: var(--color-neutral-100);  /* no role: on-dark ground; see the block note */
    --bd-button-primary-text: var(--color-text-brand);

    /* neutral-100 rather than a lighter step: it is the lightest fill that
       still clears 3:1 against a blue-500 hero while staying distinguishable
       from primary's pure white */
    --bd-button-secondary-bg: var(--color-neutral-100);  /* no role: on-dark ground; see the block note */
    --bd-button-secondary-bg-hover: var(--color-neutral-50);  /* no role: on-dark ground; see the block note */
    --bd-button-secondary-bg-active: var(--color-neutral-0);  /* no role: on-dark ground; see the block note */
    --bd-button-secondary-text: var(--color-text-primary);

    /* the outlined one: white ring, white label, inverting on hover */
    --bd-button-tertiary-text: var(--color-text-inverse);
    --bd-button-tertiary-border: var(--color-neutral-0);  /* no role: on-dark hairline; see the block note */
    --bd-button-tertiary-bg-hover: var(--color-neutral-0);  /* no role: on-dark ground; see the block note */
    --bd-button-tertiary-text-hover: var(--color-text-brand);
    --bd-button-tertiary-border-hover: var(--color-neutral-0);  /* no role: on-dark hairline; see the block note */
    --bd-button-tertiary-bg-active: var(--color-neutral-50);  /* no role: on-dark ground; see the block note */
    --bd-button-tertiary-text-active: var(--color-text-brand);

    /* no ring at all, so it stays distinct from tertiary */
    --bd-button-ghost-text: var(--color-text-inverse);
    --bd-button-ghost-border: transparent;
    --bd-button-ghost-bg-hover: var(--color-neutral-0);  /* no role: on-dark ground; see the block note */
    --bd-button-ghost-text-hover: var(--color-text-primary);
    --bd-button-ghost-bg-active: var(--color-neutral-50);  /* no role: on-dark ground; see the block note */
    --bd-button-ghost-text-active: var(--color-text-primary);

    /* unchanged red, plus a boundary against the hero */
    --bd-button-accent-ring: var(--color-neutral-0);

    /* a white ring, the one colour that clears 3:1 on a brand hero and a
       neutral one alike, which this surface has to cover without knowing
       which it is on. The gap inside it is the hero itself; see FOCUS. */
    --bd-button-focus-ring: var(--focus-outline-traditional-inverse);

    /* muted downward instead of upward: a neutral-100 fill would read as an
       active control on a dark hero. Exempt from contrast under WCAG 1.4.3. */
    --bd-button-disabled-bg: var(--color-neutral-700);  /* no role: on-dark ground; see the block note */
    --bd-button-disabled-text: var(--color-text-disabled);
    --bd-button-disabled-border: var(--color-neutral-600);  /* no role: on-dark hairline; see the block note */

  }

  /* ============================================
     SURFACE — brand

     For a band filled with the brand itself, --color-surface-brand. On
     Bitdefender that band is blue and surface="dark" already reads; on a
     partner whose brand is light, dark's white fills and white rings are
     exactly what cannot be seen.

     So this surface is built from one pair only: the brand's ink,
     --color-brand-on-fill, and the brand fill, --color-action-primary. A theme
     must clear 4.5:1 between those two (verify-brands' ink floor), so every
     label and every boundary below inherits that floor whichever way the
     brand runs -- white ink on a dark brand, dark ink on a light one. Nothing
     here may mix the two into a third colour: a tint moves toward one of them
     and loses contrast against it, and which one depends on the brand.

     That is also why the states swap the pair rather than tint it. primary
     is the ink fill with the brand as its label, and on hover and press it
     becomes the ink outline; tertiary is the ink outline and inverts to the
     ink fill. ghost has no ring and inverts the same way. secondary and
     accent keep their own fills, whose labels are not the brand's to move,
     and gain a ring in the ink so their edge against the band is the same
     floor. Disabled is exempt from contrast (WCAG 1.4.3) and is the ink at
     reduced strength.

     On Bitdefender this differs from surface="dark" on purpose in two places:
     primary's label is the band's blue-500 (4.53:1 on white) rather than
     brand text, and its hover is the outline rather than a neutral-50 fill.
     Both are what a theme-independent surface can promise; dark's choices
     only hold while the brand is dark.
     ============================================ */
  :host([surface='brand']) {
    --bd-button-primary-bg: var(--color-brand-on-fill);
    --bd-button-primary-text: var(--color-action-primary);

    --bd-button-tertiary-text: var(--color-brand-on-fill);
    --bd-button-tertiary-border: var(--color-brand-on-fill);
    --bd-button-tertiary-bg-hover: var(--color-brand-on-fill);
    --bd-button-tertiary-text-hover: var(--color-action-primary);
    --bd-button-tertiary-border-hover: var(--color-brand-on-fill);
    --bd-button-tertiary-bg-active: var(--color-brand-on-fill);
    --bd-button-tertiary-text-active: var(--color-action-primary);

    --bd-button-ghost-text: var(--color-brand-on-fill);
    --bd-button-ghost-border: transparent;
    --bd-button-ghost-bg-hover: var(--color-brand-on-fill);
    --bd-button-ghost-text-hover: var(--color-action-primary);
    --bd-button-ghost-bg-active: var(--color-brand-on-fill);
    --bd-button-ghost-text-active: var(--color-action-primary);

    --bd-button-accent-ring: var(--color-brand-on-fill);

    --bd-button-focus-ring: var(--focus-outline-traditional-on-brand);

    --bd-button-disabled-bg: color-mix(in srgb, var(--color-brand-on-fill) 20%, transparent);
    --bd-button-disabled-text: color-mix(in srgb, var(--color-brand-on-fill) 55%, transparent);
    --bd-button-disabled-border: color-mix(in srgb, var(--color-brand-on-fill) 40%, transparent);
  }

  :host([surface='brand']) .button--primary:hover,
  :host([surface='brand']) .button--primary:active {
    background-color: transparent;
    --bd-button-edge: inset 0 0 0 var(--bd-button-border-width) var(--color-brand-on-fill);
    color: var(--color-brand-on-fill);
  }

  /* not when disabled: the state rule clears the edge, and this is heavier */
  :host([surface='brand']) .button--secondary:not(:disabled, [aria-disabled="true"]) {
    --bd-button-edge: inset 0 0 0 var(--bd-button-border-width) var(--color-brand-on-fill);
  }

  /* ============================================
     STATE — disabled
     Filled variants go grey; outlined ones keep a transparent fill and take
     the subtle border. Contrast is exempt here under WCAG 1.4.3.
     ============================================ */
  .button:disabled,
  .button[aria-disabled="true"] {
    cursor: not-allowed;
    pointer-events: none;
    background-color: var(--bd-button-disabled-bg);
    --bd-button-edge: 0 0 0 0 transparent;
    color: var(--bd-button-disabled-text);
  }

  .button--tertiary:disabled,
  .button--ghost:disabled,
  .button--tertiary[aria-disabled="true"],
  .button--ghost[aria-disabled="true"] {
    background-color: transparent;
    --bd-button-edge: inset 0 0 0 var(--bd-button-border-width) var(--bd-button-disabled-border);
    color: var(--bd-button-disabled-text);
  }

  /* ============================================
     STATE — loading
     The variant keeps its own colours, so the spinner is drawn in
     currentColor and sized in em to track the type scale — which is what the
     design's loading widths imply (they exceed the default by exactly one
     font-size plus the gap).
     ============================================ */
  .button--loading {
    cursor: progress;
    pointer-events: none;
  }

  .spinner {
    width: 1em;
    height: 1em;
    flex: none;
    box-sizing: border-box;
    border: var(--border-width-2) solid currentColor;
    border-top-color: transparent;
    border-radius: var(--radius-full);
    animation: bd-button-spin var(--transition-duration-slower)
      var(--transition-easing-linear) infinite;
  }

  @keyframes bd-button-spin {
    to { transform: rotate(360deg); }
  }

  /* The slot sits inside .button__label now, not directly in .button. */
  .button__label > ::slotted(*) {
    display: inline-block;
    text-align: center;
  }

  /* box-shadow is not rendered in forced-colors mode, which would leave the
     outlined variants with no visible boundary at all, so a real border comes
     back there. It costs 4px of height, which does not matter when the user
     agent is repainting everything anyway. */
  @media (forced-colors: active) {
    .button--tertiary,
    .button--ghost {
      border: var(--bd-button-border-width) solid currentColor;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .button,
    .bd-contact-btn,
    .button__label,
    .button__arrow {
      transition: none !important;
    }

    /* a spinner that cannot spin should still read as busy, so it pulses
       rather than freezing into a static broken ring */
    .spinner {
      animation: bd-button-pulse var(--transition-duration-slower)
        var(--transition-easing-smooth) infinite alternate;
      border-top-color: currentColor;
    }

    @keyframes bd-button-pulse {
      to { opacity: var(--opacity-pulse); }
    }
  }
  /* ============================================
     VARIANT — white and outline-white

     Fixed presets for a solid-colour banner, where even a surface="dark"
     primary would sit too close in tone. They ignore surface on purpose —
     see the note on VARIANTS in button.js.

     These two were appended below the stylesheet's last rule and unindented,
     and they hardcoded their colours instead of going through the aliases
     every other variant uses: 1.5px against the 2px border width the docs
     describe, #ffffff8c, and two rgba() whites. None of it could be rethemed
     and none of it was visible to the lint, which does not read 8-digit hex
     or rgba().
     ============================================ */
  .button--white {
    background-color: var(--bd-button-white-bg);
    color: var(--bd-button-white-text);
  }
  .button--white:hover {
    background-color: var(--bd-button-white-bg-hover);
  }
  .button--white:active {
    background-color: var(--bd-button-white-bg-active);
  }

  .button--outline-white {
    background-color: transparent;
    --bd-button-edge: inset 0 0 0 var(--bd-button-border-width) var(--bd-button-outline-white-border);
    color: var(--bd-button-outline-white-text);
  }
  .button--outline-white:hover {
    background-color: var(--bd-button-outline-white-bg-hover);
  }
  .button--outline-white:active {
    background-color: var(--bd-button-outline-white-bg-active);
  }
`,l=/* @__PURE__ */ new Set([`text`,`search`,`url`,`tel`,`email`,`password`,`date`,`month`,`week`,`time`,`datetime-local`,`number`]),u=e=>class extends e{static formAssociated=!0;static properties={_formDisabled:{state:!0},_attempted:{state:!0}};constructor(){super(),this._internals=this.attachInternals(),this._formDisabled=!1,this._attempted=!1,this.addEventListener(`invalid`,()=>{this._attempted=!0}),this.addEventListener(`click`,e=>{e.composedPath()[0]===this&&this._fromOutside(e)&&(e.stopImmediatePropagation(),this._activate())})}_fromOutside(e){if(!e.isTrusted)return!0;let t=this.getBoundingClientRect();return e.clientX<t.left||e.clientX>t.right||e.clientY<t.top||e.clientY>t.bottom}get _control(){return null}_activate(){this._control?.focus()}get form(){return this._internals.form}get labels(){return this._internals.labels}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}_submitImplicitly(){let e=this.form;if(!e)return;let t=[...e.elements],n=t.find(e=>e.type===`submit`||e.type===`image`);n?n.matches(`:disabled`)||n.click():t.filter(e=>l.has(e.type)).length<=1&&e.requestSubmit()}formDisabledCallback(e){this._formDisabled=e}formResetCallback(){this._attempted=!1}_mirrorValidity(e){!e?.willValidate||e.validity.valid?this._internals.setValidity({}):this._internals.setValidity(e.validity,e.validationMessage,e)}},d=[`primary`,`secondary`,`tertiary`,`ghost`,`accent`,`white`,`outline-white`],f={outline:`ghost`,"primary-outline":`tertiary`,danger:`accent`,destructive:`accent`},p={sm:`button--small`,md:`button--medium`,lg:`button--large`},m=`button--responsive`,h=[`light`,`dark`,`brand`],g=[`default`,`rounded`],_=[`button`,`submit`,`reset`],v=()=>new CustomEvent(`custom-click`,{bubbles:!0,composed:!0}),y=class extends i{static styles=[c];static properties={label:{type:String},size:{type:String},variant:{type:String,reflect:!0},kind:{type:String},fullWidth:{type:Boolean,attribute:`fullwidth`},strong:{type:Boolean},disabled:{type:Boolean,reflect:!0},loading:{type:Boolean,reflect:!0},fontSize:{type:String,attribute:`font-size`},fontWeight:{type:String,attribute:`font-weight`},align:{type:String},surface:{type:String,reflect:!0},shape:{type:String,reflect:!0},noArrow:{type:Boolean,attribute:`no-arrow`},iconOnly:{type:Boolean,attribute:`icon-only`,reflect:!0},description:{type:String}};constructor(){super(),this.label=``,this.size=``,this.variant=`primary`,this.kind=``,this.fullWidth=!1,this.strong=!1,this.disabled=!1,this.loading=!1,this.fontSize=``,this.fontWeight=``,this.align=`left`,this.surface=`light`,this.shape=`default`,this.noArrow=!1,this.iconOnly=!1,this.description=``}willUpdate(e){e.has(`kind`)&&this.kind&&(this.variant=this.kind),(e.has(`variant`)||e.has(`kind`))&&(f[this.variant]&&(this.variant=f[this.variant]),d.includes(this.variant)||(this.variant=`primary`)),e.has(`size`)&&!p[this.size]&&(this.size=``),e.has(`surface`)&&!h.includes(this.surface)&&(this.surface=`light`),e.has(`shape`)&&!g.includes(this.shape)&&(this.shape=`default`)}get _inert(){return this.disabled||this.loading}get _hasArrow(){return this.variant===`accent`&&!this.noArrow&&!this._inert&&!this.iconOnly}get _classes(){return[`button`,`button--${this.variant}`,p[this.size]||m,this.iconOnly?`button--icon-only`:``,this.fullWidth&&!this.iconOnly?`max--width`:``,this.strong?`button--bold`:``,this.shape===`rounded`&&!this.iconOnly?`button--rounded`:``,this._hasArrow?`button--with-arrow`:``,this.loading?`button--loading`:``].filter(Boolean).join(` `)}get _inlineStyle(){return[[`font-size`,o(this.fontSize)],[`font-weight`,s(this.fontWeight)]].filter(([,e])=>e).map(([e,t])=>`${e}: ${t};`).join(` `)}get _content(){return this.iconOnly?this._iconContent:t`${this.loading?t`<span class="spinner" aria-hidden="true"></span>`:r}<span class="button__label"><slot>${this.label}</slot></span>${this._hasArrow?t`<bd-arrow-icon class="button__arrow" aria-hidden="true"></bd-arrow-icon>`:r}`}get _describedBy(){return this.description?`description`:r}get _description(){return this.description?t`<span id="description" hidden>${this.description}</span>`:r}get _iconContent(){return this.loading?t`<span class="spinner" aria-hidden="true"></span>`:t`<slot><bd-arrow-icon class="button__icon" aria-hidden="true"></bd-arrow-icon></slot>`}_handleClick(e){this._inert?(e.preventDefault(),e.stopPropagation()):this.dispatchEvent(v())}},b=class extends u(y){static properties={type:{type:String}};constructor(){super(),this.type=`button`}willUpdate(e){super.willUpdate(e),e.has(`type`)&&!_.includes(this.type)&&(this.type=`button`)}get _control(){return this.renderRoot?.querySelector?.(`button`)}get _inert(){return super._inert||this._formDisabled}_activate(){this._control?.click()}_handleClick(e){super._handleClick(e),!this._inert&&(this.type===`submit`?this.form?.requestSubmit():this.type===`reset`&&this.form?.reset())}render(){return t`
      <button
        type="button"
        part="button"
        class="${this._classes}"
        aria-label="${this.label||r}"
        aria-busy="${this.loading?`true`:r}"
        aria-describedby="${this._describedBy}"
        ?disabled="${this.disabled||this._formDisabled}"
        style="${this._inlineStyle}"
        @click=${this._handleClick}
      >${this._content}</button>${this._description}
    `}},x=class extends y{static properties={href:{type:String},buyLink:{type:Boolean},target:{type:String},rel:{type:String}};constructor(){super(),this.href=``,this.buyLink=!1,this.align=`left`,this.target=``,this.rel=``}connectedCallback(){super.connectedCallback(),this.toggleAttribute(`data-bd-watch-shadow`,this.buyLink)}willUpdate(e){super.willUpdate(e),e.has(`buyLink`)&&this.isConnected&&this.toggleAttribute(`data-bd-watch-shadow`,this.buyLink)}get _rel(){return this.rel?this.rel:this.target===`_blank`?`noopener noreferrer`:``}render(){let e=this._inert||!this.href?r:this.href;return t`
      <a
        part="button"
        href="${e}"
        target="${this.target||r}"
        rel="${this._rel||r}"
        role="${this._inert?`link`:r}"
        tabindex="${this._inert?`-1`:r}"
        class="${this._classes}"
        aria-label="${this.label||r}"
        aria-busy="${this.loading?`true`:r}"
        aria-disabled="${this.disabled?`true`:r}"
        aria-describedby="${this._describedBy}"
        style="${this._inlineStyle}"
        @click=${this._handleClick}
        ?data-store-render="${this.buyLink}"
        ?data-store-buy-link="${this.buyLink}"
      >${this._content}</a>${this._description}
    `}},S=class extends i{static styles=[c];static properties={label:{type:String},href:{type:String},align:{type:String},shape:{type:String,reflect:!0}};constructor(){super(),this.label=`Contact us`,this.href=``,this.align=`left`,this.shape=`default`}_handleClick(){this.dispatchEvent(v())}render(){return t`
      <a
        class="button bd-contact-btn ${this.shape===`rounded`?`button--rounded`:``}"
        href="${this.href||r}"
        aria-label="${this.label||r}"
        @click=${this._handleClick}
      >
        ${this.label}
        <bd-arrow-icon aria-hidden="true"></bd-arrow-icon>
      </a>
    `}};customElements.define(`bd-button`,b),customElements.define(`bd-button-link`,x),customElements.define(`bd-contact-button`,S);