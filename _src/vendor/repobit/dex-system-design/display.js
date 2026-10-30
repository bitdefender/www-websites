import{c as e,i as t,t as n}from"../../_chunks/lit.js";import"../../_chunks/repobit-dex-system-design.js";import{i as r}from"../../_chunks/repobit-dex-system-design3.js";var i=e`
  @layer bd-components {
    .bd-display {
      margin: 0;
      padding: 0;
      font-family: var(--typography-display-lg-fontFamily);
      color: var(--color-text-primary);
      /* Display type is large enough that a single word can be wider than a
         phone, and with overflow-wrap: normal there is no break opportunity
         inside a word -- so the word painted outside the box and widened the
         document. Measured at 320 and 375 with "Award-winning cybersecurity":

           step      size     320     375     576   768+
           sm        36px      ok      ok      ok    ok
           md        48px      ok      ok      ok    ok
           lg        60px    +61px    +6px     ok    ok
           xl        72px   +134px   +79px     ok    ok
           xxl       96px   +280px  +225px   +24px   ok
           xxxl     128px   +475px  +420px  +219px   ok

         lg is this component's default, so the out-of-the-box configuration
         made a phone scroll sideways on a thirteen-character word. break-word
         only breaks where there is no break opportunity at all, so every case
         that already fitted is untouched -- the same rule, and the same reason,
         as the tooltip bubble in P7F.1.

         Containment only. WHICH step belongs at which breakpoint stays the
         consuming page's choice: this atom maps a variant onto a
         --typography-display-* role and deliberately knows nothing about
         viewports, and six steps exist so that choice can be made. */
      overflow-wrap: break-word;
    }

    /* Balanced lines, as bd-h's, behind the same guard -- see the reason there. */
    @supports (text-wrap: balance) {
      .bd-display {
        text-wrap: balance;
      }
    }

      
 /* xxxl */
    .bd-display.xxxl {
     font-size: var(--typography-display-3xl-fontSize);
      font-weight: var(--typography-display-3xl-fontWeight);
      line-height: var(--typography-display-3xl-lineHeight);
      letter-spacing: var(--typography-display-3xl-letterSpacing);
      font-family: var(--typography-display-3xl-fontFamily);
    }
 /* xxl */
    .bd-display.xxl {
        font-size: var(--typography-display-2xl-fontSize);
      font-weight: var(--typography-display-2xl-fontWeight);
      line-height: var(--typography-display-2xl-lineHeight);
      letter-spacing: var(--typography-display-2xl-letterSpacing);
      font-family: var(--typography-display-2xl-fontFamily);
    }
    /* xl */
    .bd-display.xl {
      font-size: var(--typography-display-xl-fontSize);
      font-weight: var(--typography-display-xl-fontWeight);
      line-height: var(--typography-display-xl-lineHeight);
      letter-spacing: var(--typography-display-xl-letterSpacing);
      font-family: var(--typography-display-xl-fontFamily);
    }

    /* lg */
    .bd-display.lg {
      font-size: var(--typography-display-lg-fontSize);
      font-weight: var(--typography-display-lg-fontWeight);
      line-height: var(--typography-display-lg-lineHeight);
      letter-spacing: var(--typography-display-lg-letterSpacing);
      font-family: var(--typography-display-lg-fontFamily);
    }

    /* md */
    .bd-display.md {
      font-size: var(--typography-display-md-fontSize);
      font-weight: var(--typography-display-md-fontWeight);
      line-height: var(--typography-display-md-lineHeight);
      letter-spacing: var(--typography-display-md-letterSpacing);
      font-family: var(--typography-display-md-fontFamily);
    }

    /* sm - Smallest display */
    .bd-display.sm {
      font-size: var(--typography-display-sm-fontSize);
      font-weight: var(--typography-display-sm-fontWeight);
      line-height: var(--typography-display-sm-lineHeight);
      letter-spacing: var(--typography-display-sm-letterSpacing);
      font-family: var(--typography-display-sm-fontFamily);
    }
  }
`,a=[`xxxl`,`xxl`,`xl`,`lg`,`md`,`sm`],o=class extends n{static properties={variant:{type:String,reflect:!0},kind:{type:String},color:{type:String,reflect:!0},align:{type:String,reflect:!0}};constructor(){super(),this.variant=`md`,this.kind=``,this.color=``,this.align=`left`}willUpdate(e){e.has(`kind`)&&this.kind&&(this.variant=this.kind),(e.has(`variant`)||e.has(`kind`))&&(a.includes(this.variant)||(this.variant=`md`))}render(){let e=[],n=r(this.color);return n&&e.push(`color: ${n}`),this.align&&e.push(`text-align: ${this.align}`),t`
      <div class="bd-display ${this.variant}" style="${e.join(`; `)}">
        <slot></slot>
      </div>
    `}static styles=[i]};customElements.define(`bd-display`,o);export{o as BdDisplay};