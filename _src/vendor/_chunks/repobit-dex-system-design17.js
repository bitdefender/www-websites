import{c as e,i as t,t as n}from"./lit.js";import"./repobit-dex-system-design.js";import"./repobit-dex-system-design16.js";var r=e`
  :host {
    display: inline-flex;
    vertical-align: middle;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-4);
    box-sizing: border-box;
    font-family: var(--typography-fontFamily-sans);
    font-weight: var(--typography-control-label-small-fontWeight);
    line-height: var(--typography-control-label-small-lineHeight);
    border-radius: var(--radius-full);
    /* One line, unless the component holding the badge caps its width and
       lets it wrap through --bd-badge-white-space (bd-post-card does, for a
       feed's long channel title over its cover). Wrapped, it stays a pill:
       the full radius rounds the taller box, the lines centre in it, and the
       leading is control-label-small's tight, which holds a second line. */
    white-space: var(--bd-badge-white-space, nowrap);
    text-align: center;
    /* Safari reads only the prefixed property */
    -webkit-user-select: none;
    user-select: none;
  }

  /* ---- size -------------------------------------------------------------
     sm and md share their padding and differ only in type size, which is what
     makes them 22px and 23px tall. lg steps both up. */
  :host([size='sm']) .badge {
    /* no role: this rung sits below the control-label-* family's floor. The
       base rule takes its weight and leading from control-label-small and the
       lg rung takes its size from control-label-default, so the ladder already
       resolves through the family -- but the family's smallest size is xs, and
       this is xxs. label-extra-small is the only declared role at this size and
       it carries normal leading where this badge is tight, so it describes
       different text. The family was deliberately scoped to four rungs; adding
       a fifth for one consumer is what the token-hygiene item exists to resist,
       so the size stays a primitive and says why. */
    font-size: var(--typography-fontSize-xxs);
    padding: var(--spacing-4) var(--spacing-8);
  }

  :host([size='md']) .badge,
  :host(:not([size])) .badge {
    /* control-label-small's size, completing the rung: the base rule already
       takes this text's weight and leading from that role, so the size is its
       third axis rather than a separate choice. */
    font-size: var(--typography-control-label-small-fontSize);
    padding: var(--spacing-4) var(--spacing-8);
  }

  :host([size='lg']) .badge {
    font-size: var(--typography-control-label-default-fontSize);
    padding: var(--spacing-8) var(--spacing-12);
  }

  /* ---- tone × variant --------------------------------------------------
     shade is a tinted background with dark text; fill is a saturated
     background. Defaults below are the shade/default pair. */
  /* Grey, not blue: a tone called "default" reading as pale blue is
     surprising, and it left default and primary sharing a background while
     differing only in text colour.

     A badge takes the heavier tint and a tag the lighter one, so the two read
     apart. Neutral follows that; it used to sit on the lighter grey, which made
     a neutral badge and a neutral tag the same colour. */
  .badge {
    color: var(--status-neutral-text);
    background: var(--status-neutral-surface-strong);
  }

  /* Brand is the one tone that stays on the lighter tint. Its heavier tint
     would be blue-100, which is info's, and a brand badge would then be
     indistinguishable from an info badge. Telling brand from info matters more
     than telling a brand badge from a brand tag, so brand has no heavier tint
     at all. */
  :host([tone='brand']) .badge {
    color: var(--status-brand-text);
    background: var(--status-brand-surface);
  }

  :host([tone='success']) .badge {
    /* green-800 rather than green-700: on green-100 that is 5.93:1 against
       4.17:1, and it matches the step the warning tone already uses */
    color: var(--status-success-text);
    background: var(--status-success-surface-strong);
  }

  :host([tone='warning']) .badge {
    color: var(--status-warning-text);
    background: var(--status-warning-surface-strong);
  }

  :host([tone='error']) .badge {
    color: var(--status-error-text);
    background: var(--status-error-surface-strong);
  }

  :host([tone='info']) .badge {
    color: var(--status-info-text);
    background: var(--status-info-surface-strong);
  }

  :host([variant='fill']) .badge {
    color: var(--status-neutral-on-fill);
    background: var(--status-neutral-fill);
  }

  :host([variant='fill'][tone='brand']) .badge {
    color: var(--status-brand-on-fill);
    background: var(--status-brand-fill);
  }

  /* Info reads its own fill roles, not brand's. The two resolve to the same
     blue-500 today, which is why info used to borrow brand's; sharing a value
     is not sharing a role, and borrowing meant a change to brand's fill would
     have moved every filled info badge with it. */
  :host([variant='fill'][tone='info']) .badge {
    color: var(--status-info-on-fill);
    background: var(--status-info-fill);
  }

  /* green-700 with a white label, rather than the design's green-500 with a
     dark one. green-700 is the lightest step in the family that carries white
     text at 4.5:1 — it measures 4.75, where green-600 is only 3.20. It also
     lines up with the success dot, which already uses green-700. */
  :host([variant='fill'][tone='success']) .badge {
    color: var(--status-success-on-fill);
    background: var(--status-success-fill);
  }

  :host([variant='fill'][tone='warning']) .badge {
    color: var(--status-warning-on-fill);
    background: var(--status-warning-fill);
  }

  :host([variant='fill'][tone='error']) .badge {
    color: var(--status-error-on-fill);
    background: var(--status-error-fill);
  }

  /* ---- mode: dot ------------------------------------------------------
     The design keeps the dot at one size across sm/md/lg, so size has no
     effect in this mode.

     variant has no effect either. A dot has no text, so there is no
     foreground/background pair for shade and fill to describe — the colour
     *is* the content. That also means it has to carry itself on the page:
     WCAG 1.4.11 wants 3:1 for a graphical object whose colour conveys
     meaning, and the tint steps the shade text sits on measure 1.08 to 1.33.
     Each tone therefore uses a saturated step chosen to clear 3:1. */
  :host([mode='dot']) .badge {
    width: var(--spacing-8);
    height: var(--spacing-8);
    padding: 0;
    gap: 0;
  }

  :host([mode='dot']) .badge                 { background: var(--status-neutral-accent); }
  :host([mode='dot'][tone='brand']) .badge { background: var(--status-brand-accent); }
  /* green-700 rather than the lighter steps: green-500 measures 2.39 and
     green-600 only 3.20, where 700 gives 4.75 and still reads as green */
  :host([mode='dot'][tone='success']) .badge { background: var(--status-success-accent); }
  /* yellow is inherently light — 700 at 3.61 is the lightest step that both
     clears 3:1 and still reads as yellow rather than brown */
  :host([mode='dot'][tone='warning']) .badge { background: var(--status-warning-accent); }
  :host([mode='dot'][tone='error']) .badge   { background: var(--status-error-accent); }
  :host([mode='dot'][tone='info']) .badge    { background: var(--status-info-accent); }

  /* A dot is nothing but its fill, and forced colours repaint every fill as
     Canvas: the dot vanished. It opts out and is drawn in CanvasText. A
     forced palette has no tones, so every tone draws the same dot; the text
     beside it carries the meaning, as it must anyway. [tone] is spelled out
     so this outranks the tone rules above. */
  @media (forced-colors: active) {
    :host([mode='dot']) .badge,
    :host([mode='dot'][tone]) .badge {
      forced-color-adjust: none;
      background: CanvasText;
    }
  }

  /* ---- mode: count ----------------------------------------------------
     Digits are set tabular so a counter does not change width as it counts:
     measured, "12" and "99" both come out at the same width. The padding
     already makes a single digit near-circular, so no min-width is needed. */
  :host([mode='count']) .badge {
    font-variant-numeric: tabular-nums;
  }

  /* ---- icon ------------------------------------------------------------ */
  ::slotted(*) {
    flex: none;
  }
`,i={"bd-light-blue":{tone:`brand`,variant:`fill`},"bd-light-green":{tone:`success`,variant:`shade`}},a=[`text`,`dot`,`count`],o=[`sm`,`md`,`lg`],s=[`neutral`,`brand`,`success`,`warning`,`error`,`info`],c={default:`neutral`,primary:`brand`},l=[`shade`,`fill`],u=class extends n{static styles=[r];static properties={mode:{type:String,reflect:!0},size:{type:String,reflect:!0},tone:{type:String,reflect:!0},variant:{type:String,reflect:!0},icon:{type:String},label:{type:String}};constructor(){super(),this.mode=`text`,this.size=`md`,this.tone=`neutral`,this.variant=`shade`,this.icon=``,this.label=``}willUpdate(e){if(e.has(`variant`)&&i[this.variant]){let{tone:e,variant:t}=i[this.variant];this.tone=e,this.variant=t}e.has(`mode`)&&!a.includes(this.mode)&&(this.mode=`text`),e.has(`size`)&&!o.includes(this.size)&&(this.size=`md`),e.has(`tone`)&&(c[this.tone]?this.tone=c[this.tone]:s.includes(this.tone)||(this.tone=`neutral`)),e.has(`variant`)&&!l.includes(this.variant)&&(this.variant=`shade`)}_renderIcon(){if(!this.icon||this.mode===`dot`)return``;switch(this.icon){case`individual`:return t`<bd-individual-icon size="sm" color="currentColor"></bd-individual-icon>`;case`family`:return t`<bd-family-icon size="sm" color="currentColor"></bd-family-icon>`;default:return``}}render(){return this.mode===`dot`?t`<span class="badge" role="img" aria-label="${this.label||this.tone}"></span>`:t`
      <span class="badge">
        ${this._renderIcon()}
        <slot></slot>
      </span>
    `}};customElements.define(`bd-badge`,u);