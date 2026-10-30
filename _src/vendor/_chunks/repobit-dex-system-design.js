import{c as e}from"./lit.js";var t={colour:{"--color-brand-50":`var(--color-blue-50)`,"--color-brand-100":`var(--color-blue-100)`,"--color-brand-200":`var(--color-blue-200)`,"--color-brand-300":`var(--color-blue-300)`,"--color-brand-400":`var(--color-blue-400)`,"--color-brand-500":`var(--color-blue-500)`,"--color-brand-600":`var(--color-blue-600)`,"--color-brand-700":`var(--color-blue-700)`,"--color-brand-800":`var(--color-blue-800)`,"--color-brand-900":`var(--color-blue-900)`,"--color-brand-950":`var(--color-blue-950)`,"--color-brand-on-fill":`var(--color-neutral-0)`},shape:{"--shape-radius-sm":`var(--radius-sm)`,"--shape-radius-md":`var(--radius-md)`,"--shape-radius-lg":`var(--radius-lg)`,"--shape-radius-xl":`var(--radius-xl)`,"--shape-radius-2xl":`var(--radius-2xl)`,"--shape-radius-3xl":`var(--radius-3xl)`}},n=`bitdefender`,r={bitdefender:t},i={colour:[...[50,100,200,300,400,500,600,700,800,900,950].map(e=>`--color-brand-${e}`),`--color-brand-on-fill`],shape:[`sm`,`md`,`lg`,`xl`,`2xl`,`3xl`].map(e=>`--shape-radius-${e}`)},a=/^[a-z][a-z0-9-]*$/;function o(e){let t=e.replace(/\/\*[\s\S]*?\*\//g,``),n=/* @__PURE__ */ new Map;for(let e of t.matchAll(/(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/g))n.set(e[1],e[2].trim().replace(/\s+/g,` `));return n}var s=e=>[...e.matchAll(/var\(\s*(--[A-Za-z0-9-]+)/g)].map(e=>e[1]);function c(e,t){let n=/* @__PURE__ */ new Map;for(let[e,r]of t)for(let t of s(r))n.has(t)||n.set(t,/* @__PURE__ */ new Set),n.get(t).add(e);let r=/* @__PURE__ */ new Set,i=[...e];for(;i.length;)for(let t of n.get(i.shift())??[])e.has(t)||r.has(t)||(r.add(t),i.push(t));return r}function l(e,t){let n=o(e),r=/* @__PURE__ */ new Set;for(let[e,i]of Object.entries(t)){if(!a.test(e))throw Error(`brand "${e}": use lowercase letters, digits and hyphens`);for(let t of Object.keys(i)){if(!n.has(t))throw Error(`brand "${e}" overrides ${t}, which no token declares`);r.add(t)}}if(r.size===0)return``;let i=c(r,n),s=[...n.keys()].filter(e=>r.has(e)||i.has(e));return Object.entries(t).map(([e,t])=>`  [data-brand="${e}"] {\n${s.map(e=>`    ${e}: ${t[e]??n.get(e)};`).join(`
`)}\n  }`).join(`

`)}function u(e,t,n){let r={};for(let[i,a]of Object.entries(t??{})){if(!(i in n))throw Error(`theme "${e}": "${i}" is not themable -- a theme sets ${Object.keys(n).join(` and `)} only`);for(let[t,o]of Object.entries(a)){if(!n[i].includes(t))throw Error(`theme "${e}" sets ${t}, which the ${i} contract does not list -- see src/tokens/themes/contract.js`);r[t]=String(o)}}return r}function d(e,t,n,r){if(!(r in t))throw Error(`the default theme "${r}" is not registered`);let i=o(e),a=(e,t)=>String(e).trim().replace(/\s+/g,` `)===String(t).trim().replace(/\s+/g,` `),s={};for(let[e,o]of Object.entries(t)){let t=u(e,o,n);s[e]=e===r?{}:Object.fromEntries(Object.entries(t).filter(([e,t])=>!i.has(e)||!a(t,i.get(e))))}return l(e,s)}var f=`
        --typography-fontFamily-sans: "IBM Plex Sans", system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        --typography-fontFamily-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular,
            Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

        --typography-fontSize-xxs: 0.6875rem; /* 11px */
        --typography-fontSize-xs: 0.75rem; /* 12px */
        --typography-fontSize-sm: 0.875rem; /* 14px */
        --typography-fontSize-base: 1rem; /* 16px */
        --typography-fontSize-lg: 1.125rem; /* 18px */
        --typography-fontSize-xl: 1.25rem; /* 20px */
        --typography-fontSize-2xl: 1.5rem; /* 24px */
        --typography-fontSize-3xl: 2rem; /* 32px */
        --typography-fontSize-4xl: 2.25rem; /* 36px */
        --typography-fontSize-5xl: 3rem; /* 48px */
        --typography-fontSize-6xl: 3.75rem; /* 60px */
                --typography-fontSize-7xl: 4.5rem; /* 72px */
        --typography-fontSize-8xl: 6rem; /* 96px */
        --typography-fontSize-9xl: 8rem; /* 128px */

        --typography-fontWeight-light: 300;
        --typography-fontWeight-normal: 400;
        --typography-fontWeight-medium: 500;
        --typography-fontWeight-semibold: 600;
        --typography-fontWeight-bold: 700;

        --typography-lineHeight-none: 1;
        --typography-lineHeight-tight: 1.25;
        /* There is no snug (1.375). It was Tailwind's step, it carried the
           heading roles until the leading was measured against IBM Plex Sans,
           and once those moved to tight and 130 its only readers were four
           documentation-chrome files setting 11px text. 11px is what
           label-extra-small already answers, at normal, so they were repointed
           there and the step was retired rather than kept alive by its own
           documentation. */
        --typography-lineHeight-normal: 1.5;
        --typography-lineHeight-relaxed: 1.625;
        --typography-lineHeight-loose: 2;

        /* The three steps above named for a density -- none .. loose -- are
           Tailwind's default scale, values and names both, and nothing in them
           was derived from IBM Plex Sans. These three were, and they are named
           numerically because that is what the rest of this system does for a
           scale step: --spacing-14, --dimension-44, --border-width-2.

             130  the font's own declared line box. hhea, OS/2 sTypo and OS/2
                  usWin in IBMPlexSans-*.woff2 all state 1.30, which is both
                  unusual and deliberate -- it is why the same text does not
                  change height between macOS and Windows.
             140  IBM's own published value for Plex at 20px (@carbon/type,
                  productive-heading-03 and expressive-heading-03).
             145  between IBM's 1.5 at 16px and 1.4 at 20px.

           The floor under all of them is ink, not taste. The deepest glyphs in
           this family are the Romanian comma-below letters -- s-comma and
           t-comma, -0.275em in Bold, a third deeper than g -- and the tallest
           are grave and acute capitals at +0.977em. Measured per weight, ink
           spans 1.174 Light, 1.194 Regular, 1.219 Medium, 1.235 SemiBold,
           1.252 Bold. Tight, 1.25, sits 0.002 under the Bold floor -- the
           tallest accented capital and the deepest comma-below letter would
           have to fall in consecutive lines, one above the other, to touch --
           which is why the display roles stay at tight and are never tightened
           further.
           Foundations/Typography/Vertical Rhythm reaches 1.231 for 48px Bold
           from canvas metrics; this is the same number from outline bounds. */
        --typography-lineHeight-130: 1.3;
        --typography-lineHeight-140: 1.4;
        --typography-lineHeight-145: 1.45;

        --typography-letterSpacing-tighter: -0.05em;
        --typography-letterSpacing-tight: -0.025em;
        --typography-letterSpacing-normal: 0em;
        --typography-letterSpacing-wide: 0.025em;
        --typography-letterSpacing-wider: 0.05em;
        --typography-letterSpacing-widest: 0.1em;

        /* =====================
            COLORS
        ====================== */
        --color-blue-50: #f0f7ff;
        --color-blue-100: #d6e8ff;
        --color-blue-200: #9ec8ff;
        --color-blue-300: #6babff;
        --color-blue-400: #338bff;
        --color-blue-500: #006dff;
        --color-blue-600: #0059d6;
        --color-blue-700: #0045ad;
        --color-blue-800: #003385;
        --color-blue-900: #00225c;
        --color-blue-950: #001947;

        --color-red-50: #fff0f0;
        --color-red-100: #ffd6d6;
        --color-red-200: #ff9e9e;
        --color-red-300: #ff6b6b;
        --color-red-400: #ff3333;
        --color-red-500: #ff0000;
        --color-red-600: #d60000;
        --color-red-700: #ad0000;
        --color-red-800: #850000;
        --color-red-900: #5c0000;
        --color-red-950: #470000;

        --color-green-50: #edfdf1;
        --color-green-100: #d1fadc;
        --color-green-200: #9af4b4;
        --color-green-300: #63ee8d;
        --color-green-400: #2ce767;
        --color-green-500: #15c14f;
        --color-green-600: #12a641;
        --color-green-700: #0e8532;
        --color-green-800: #0b6a26;
        --color-green-900: #084a1a;
        --color-green-950: #063c14;
        --color-green-975: #011705;

        --color-yellow-50: #fffbf0;
        --color-yellow-100: #fff5d6;
        --color-yellow-200: #ffe89e;
        --color-yellow-300: #ffdc6b;
        --color-yellow-400: #ffcf33;
        --color-yellow-500: #ffc400;
        --color-yellow-600: #d6a000;
        --color-yellow-700: #ad7f00;
        --color-yellow-800: #855f00;
        --color-yellow-900: #5c4000;
        --color-yellow-950: #473100;
        --color-yellow-975: #1a0f00;

        --color-neutral-0: #ffffff;
        --color-neutral-25: #fafafa;
        --color-neutral-50: #f1f2f3;
        --color-neutral-100: #e1e3e5;
        --color-neutral-200: #c5c9ce;
        --color-neutral-300: #a6adb4;
        --color-neutral-400: #88909b;
        /* The five in-between steps -- 450, 850, 925 here, and the two 975s
           above -- exist for a dark theme, and nothing in light reads them.
           The dark mode study (Foundations/Theming/Dark mode) found the ramps
           too coarse at the dark end: container and subtle had to share
           neutral-900 (finding 2), no step kept text-subtle both quieter than
           muted and over 4.5:1 (finding 3), and green-950 and yellow-950 sat
           1.5:1 off the dark page where every other tint sits near 1.1
           (finding 5). Each is interpolated in OKLCH between its two
           neighbours to the ratio the derivation asks for: 450 is 4.75:1 on
           a dark card (4.93 on the dark page), midway between 500 and 400 at
           1.22:1 from each -- subtle text sits on a page or a card, so it is
           measured on the card (decision 17); 925 and 850 are 1.04 and 1.12
           off it, the light container and subtle steps; the 975s are 1.04
           and 1.03, the light tints. Measured against neutral-950, the dark
           page, in src/tokens/dark-derivation.js. */
        --color-neutral-450: #78818c;
        /* #6a737e, moved one step from #6c7580. neutral-500 is
           --color-text-subtle, and at #6c7580 subtle text on a card
           (--color-surface-container, neutral-25) measured 4.48:1 -- under
           4.5 on the ground most subtle text sits on. #6a737e gives 4.61 on a
           card and 4.81 on the page, and stays a clear step above
           neutral-600 (1.37:1 apart, the gap was 1.39). It does not clear
           subtle on surface-subtle or the status tints (4.29 to 4.46):
           that needs a step this ramp does not have, and is its own
           decision. */
        --color-neutral-500: #6a737e;
        --color-neutral-600: #565e66;
        --color-neutral-700: #41474d;
        --color-neutral-800: #2c3035;
        --color-neutral-850: #181b1d;
        --color-neutral-900: #151719;
        --color-neutral-925: #111214;
        --color-neutral-950: #0c0d0e;
        --color-neutral-1000: #000000;

        /* =====================
            BRAND
        ====================== */
        /* The brand is a ramp, not a colour. Components reach the brand hue at
           ten different steps -- 50 for a tinted wash, 200 for a tinted edge, 400
           and 950 for gradient stops and glows, 500 for the action, 600 and 700
           for brand text -- so a brand that only named its primary would leave
           every one of those behind. These eleven aliases are the whole of what a
           brand has to restate.

           Today they are the Bitdefender blue, step for step, so nothing renders
           differently for their being here. They are the colour half of the
           theme contract (src/tokens/themes/contract.js): a partner theme
           restates them, and build-tokens re-declares every token that depends
           on them inside that brand's [data-brand] scope. See Foundations/Brands.

           What deliberately does NOT read this ramp: the info status tone
           (--status-info-*, --color-surface-info). Info is a feedback colour,
           not the brand, and it has to stay recognisable under every brand --
           a business line whose brand were red would otherwise paint its info
           alerts the colour of an error. Those keep --color-blue-* directly.

           Components never name --color-blue-* for brand work; the lint rule
           brand-hue-primitive holds that line. */
        --color-brand-50: var(--color-blue-50);
        --color-brand-100: var(--color-blue-100);
        --color-brand-200: var(--color-blue-200);
        --color-brand-300: var(--color-blue-300);
        --color-brand-400: var(--color-blue-400);
        --color-brand-500: var(--color-blue-500);
        --color-brand-600: var(--color-blue-600);
        --color-brand-700: var(--color-blue-700);
        --color-brand-800: var(--color-blue-800);
        --color-brand-900: var(--color-blue-900);
        --color-brand-950: var(--color-blue-950);

        /* ================================
            CORE BORDER TOKENS
            ================================ */
        --border-width-0: 0;
        --border-width-1: 1px;
        --border-width-2: 2px;
        --border-width-3: 3px;
        --border-width-4: 4px;
        --border-width-8: 8px;

        --radius-none: 0;
        --radius-sm: 0.25rem; /* 4px */
        --radius-md: 0.375rem; /* 6px */
        --radius-lg: 0.5rem; /* 8px */
        --radius-xl: 0.75rem; /* 12px */
        --radius-2xl: 1rem; /* 16px */
        --radius-3xl: 1.5rem; /* 24px */
        --radius-full: 9999px;

        /* =====================
            SHAPE
        ====================== */
        /* The corner steps a theme restates -- the shape half of the theme
           contract, as --color-brand-* is the colour half. A partner whose brand
           is square sets these to 0, one whose brand is soft raises them, and
           every card, button, field, panel and chip that reads a step follows.
           Today they are the radius scale, step for step, so nothing renders
           differently for their being here.

           Two steps are deliberately left out, because a brand must not move
           them: --radius-full is a circle (a dot, a pill, a switch, an avatar),
           and --radius-none is a corner someone decided should be square. The
           focus ring keeps --focus-outline-radius on the scale too: focus
           geometry is the host's, not a partner's.

           Components never read --radius-sm..3xl directly; the lint rule
           shape-primitive holds that line. */
        --shape-radius-sm: var(--radius-sm);
        --shape-radius-md: var(--radius-md);
        --shape-radius-lg: var(--radius-lg);
        --shape-radius-xl: var(--radius-xl);
        --shape-radius-2xl: var(--radius-2xl);
        --shape-radius-3xl: var(--radius-3xl);

        /* ================================
             CORE DIMENSION TOKENS
             ================================ */


        --dimension-4: 4px;
        --dimension-8: 8px;
        --dimension-12: 12px;
        --dimension-16: 16px;
        --dimension-20: 20px;
        --dimension-24: 24px;
        --dimension-32: 32px;
        --dimension-36: 36px;
        --dimension-40: 40px;
        --dimension-44: 44px;
        --dimension-48: 48px;
        --dimension-56: 56px;
        --dimension-64: 64px;

        /* ================================
             CORE TRANSITION TOKENS
             ================================ */

        --transition-duration-fast: 150ms;
        --transition-duration-normal: 200ms;
        --transition-duration-slow: 300ms;
        --transition-duration-slower: 500ms;

        --transition-easing-linear: linear;
        --transition-easing-smooth: ease-in-out;
        /* The CSS default curve. It was missing, and its absence was the single
           reason eleven component transitions could not be expressed in tokens:
           ease is not ease-in-out — it front-loads, and swapping one for the
           other is a visible change. Named after the keyword, as linear and
           ease-out beside it are; smooth is the outlier that aliases a keyword
           rather than naming it. ease-in and a bounce curve stood here too and
           went on 2026-10-15, because nothing read either. */
        --transition-easing-ease: ease;
        --transition-easing-ease-out: ease-out;

        /* ================================
             CORE SHADOW TOKENS
             ================================ */

        --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1);
        --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1),
            0 8px 10px -6px rgb(0 0 0 / 0.1);
        /* The ladder stops at xl. --shadow-2xl and the inset --shadow-inner
           stood beside it until 2026-10-15, and nothing read either. */

        /* The focus glow: the brand at 15% (--color-brand-500), mixed from the palette. It
           was rgba(6, 109, 255, 0.15) -- a blue one unit off blue-500 -- with a
           red and a green beside it that were Tailwind's red-500 and green-500,
           in no palette here. Nothing read the red or the green, so they went;
           --form-input-focus-boxShadow reads this one. */
        --shadow-focus-outline-blue: 0 0 0 3px color-mix(in srgb, var(--color-brand-500) 15%, transparent);

        /* Focus Outlines - Two-Color System for Universal Visibility */
        --focus-outline-primary: 0 0 0 2px var(--color-neutral-0),
            0 0 0 4px var(--color-brand-500);

        /* Secondary, error and success rings stood here until 2026-10-15.
           Nothing read them -- every component rings with primary -- and the
           success ring was green-500, 2.39:1 against white, under the 3:1 a
           focus indicator needs. */

        /* The one above puts the WHITE band against the control, which is what
           keeps it visible on a coloured hero. That fails on a control which
           is itself white: bd-button-link variant="white" measured 1.00:1 for
           the inner band against its own fill and 2.38:1 for the blue band
           against a blue hero, so neither band reached the 3:1 WCAG 2.4.11
           asks of a focus indicator. This one inverts the pair -- dark band
           against the control, white band against the ground -- so the inner
           band carries the contrast whatever the control is sitting on.

           This is also what the Figma library draws around a filled or
           bordered button on a dark or brand ground (focus/ring-inverse).
           Figma builds a ring from spread shadows, so every band in it is a
           painted colour, and the band between control and ring has to be
           chosen per surface. On a brand hero that painted neutral-900 band
           reads as a black outline. bd-button does not use this one; it draws
           the outline below, whose gap is not painted at all. */
        --focus-outline-inverse: 0 0 0 2px var(--color-neutral-900),
            0 0 0 4px var(--color-neutral-0);

        /* The CTA ring in code: one band, held off the control by
           --focus-outline-offset. The offset leaves the gap TRANSPARENT, so it
           is always the surface the control sits on -- white on a light page,
           neutral-900 on a dark hero, blue on a brand one -- and never merges
           into a white fill or a white border, which is the job the painted
           inner band of every two-band ring above does by hand. Figma has no
           offset outline, which is why its rings paint that gap and need one
           style per surface; code does not.

           Only the band's colour follows the ground. Blue on light, 4.53:1
           against white. White on dark and brand, the one colour that clears
           3:1 on both: 4.53:1 on blue-500, 6.18 on blue-600, 8.56 on blue-700,
           17.97 on neutral-900. A blue band on a brand hero is 1.00:1.

           An outline also survives forced-colors mode, where a box-shadow ring
           is not drawn at all. bd-button reads these; see its FOCUS block. */
        --focus-outline-traditional: 2px solid var(--color-brand-500);
        --focus-outline-traditional-inverse: 2px solid var(--color-neutral-0);
        /* On a brand band (surface="brand"): the brand's own ink, which a
           theme must clear 4.5:1 on its fill, so the ring clears the 3:1 a
           focus indicator needs under every theme -- white on Bitdefender,
           where it is the inverse ring, and dark ink on a light partner, where
           a white one would vanish. */
        --focus-outline-traditional-on-brand: 2px solid var(--color-brand-on-fill);
        --focus-outline-offset: 2px;

        /* The ring is a box-shadow, so it already follows the radius of the
           element it is on. This is the default for elements that have no
           radius of their own — a link, a tab, an accordion header — so the
           ring is not a hard rectangle. An element with its own radius should
           set nothing and let the ring follow its shape. */
        --focus-outline-radius: var(--radius-sm);

        /* ================================
             SEMANTIC ROLE - SELECTED INDICATOR
             ================================
           What marks the current item in a set. Two components already drew it
           — Components/Tab List and the anchor nav — and they drifted apart on
           easing while both used valid tokens. The role is named here so there
           is one answer, not two spellings.

           THE COLOUR IS NOT NAMED FOR A SHAPE, and that is the whole point of
           the split below. It was --indicator-underline-color, which described
           the underline three components happen to draw rather than the job the
           value does. awards-flex marks its current slide with a DOT: same job,
           same blue-500, and it could not adopt the token because a dot is not
           an underline, so it reached for the primitive instead. Vocabulary
           question E1 found that — see plans/reports/phase-2-vocab-e-has-role-pass.md.

           Renamed with no back-compat alias, following the same convention as
           --typography-label-xsmall becoming --typography-body-xsmall: rename
           cleanly and say why here.

           The geometry stays underline-specific, because it genuinely is — a
           3px height and a width transition describe a rule sliding under a
           tab, and a dot scales instead. A fourth consumer needing dot
           geometry should name it for the dot, not borrow these. */
        --indicator-color: var(--color-brand-500);
        --indicator-underline-height: var(--border-width-3);
        --indicator-underline-duration: var(--transition-duration-slow);
        --indicator-underline-easing: var(--transition-easing-smooth);

        /* ================================
             SEMANTIC ROLE - CARD SHAPE
             ================================
           The corner and the inset that make a card a card here. Eleven
           card-shaped objects agree on both -- the Card box, CardFeatures,
           LightCarousel, Bento, the Awards feature card, the TrustPanel card,
           the CompareSection card, the Carousel item, the Comparison Panel
           column and both Pricing cards -- and they only agree because the two
           that did not were brought in one at a time.

           This role is named now and was deliberately not named before, and
           the difference is evidence rather than appetite. CLAUDE.md said
           there was no semantic radius scale because "the components do not
           agree closely enough for a shared role to be honest", which was true
           when it was written: the compare card sat at --radius-3xl and the
           carousel item at --radius-3xl with a 2em inset. Both have since been
           measured, argued and moved. A role declared then would have imposed
           a consensus; declared now it records one.

           It is a role, not a scale. There is still no --card-* family and no
           semantic step between radii -- naming the job is the whole point,
           and the same reasoning is why --panel-radius is NOT here: the eight
           --radius-xl consumers are a code block, a bar track, a table
           container, a discount pill, two public image variants, a modal and a
           terminal. That is not a family, and calling it one would be the
           mistake this comment is describing.

           scripts/card-shapes.json lists the eleven and lint:tokens checks it
           both ways, so a card that stops using the role and a registry entry
           that stops matching are both findings. */
        --card-radius: var(--shape-radius-2xl);
        --card-padding: var(--spacing-32);

        /* The inset a card takes when the viewport is too narrow to afford the
           full one. Four cards reached for this independently before it had a
           name -- Bento below sm, the Comparison Panel and Trust Panel below
           md, and LightCarousel with an em literal -- and three of the four
           picked exactly 24. That is the agreement that makes it a role rather
           than four local decisions.

           Two steps, not a scale. A card is either affording its inset or it
           is not; there is no third size, and a component that wants one is
           asking a design question rather than a token question. */
        --card-padding-compact: var(--spacing-24);

        /* ================================
             SEMANTIC ROLES - COLOUR
             ================================
           The tier the architecture always described and the components never
           had. Measured before this landed: 71.8% of the colour references in
           the atom layer pointed straight at a palette step — 38 distinct
           primitives across 233 references, where the roles underneath them
           number about thirty. That gap is why four text atoms ended up with
           four different inks, and why two components disagreed about which
           green means "success".

           None of these are new decisions. Every value is the step something
           already uses, and the text roles are the ones COLOR_ROLES in
           src/components/shared/token-scales.js had already chosen as clearing
           4.5:1 on white — that map should now resolve through these rather
           than reaching past them into the palette.

           Reach for the role, not the step. The palette stays available for
           what no role covers yet; when that happens, add the role.

           ---

           NAME COLLISION WITH src/blog. The blog sub-system already declares
           seven of these names with different values:

             --color-text-secondary   here neutral-700   blog neutral-600
             --color-text-muted       here neutral-600   blog neutral-500
             --color-surface-brand    here blue-500      blog blue-50   (!)
             --color-surface-inverse  here neutral-900   blog neutral-950
             --color-border-default   here neutral-400   blog neutral-300
             --color-border-subtle    here neutral-200   blog neutral-100
             --color-border-strong    here neutral-900   blog neutral-600

           This is safe today and must not be assumed safe. The blog applies
           its tokens on :host inside each blog component, so inside a blog
           shadow tree the blog value wins, and outside it never applies.
           Nothing in this system renders inside that tree.

           It stops being safe if a page ever loads src/blog/tokens.css
           globally alongside this file. That file is an unlayered :root block,
           and unlayered CSS beats a cascade layer, so it would win — silently
           turning --color-surface-brand from a saturated fill into a pale
           tint under any component that had adopted it.

           The two files share 616 names and disagree on 82 of them; all 58
           shared palette primitives are identical, so the fork is entirely at
           this tier and above. Reconciling it is its own piece of work. Until
           it happens, do not load both globally. */

        /* Text. -primary is the default ink for anything that reads as body
           or heading copy. -brand is blue-600 rather than blue-500 on purpose:
           blue-500 is 4.53:1 on pure white and fails on any tint. */
        --color-text-primary: var(--color-neutral-900);
        --color-text-secondary: var(--color-neutral-700);
        --color-text-muted: var(--color-neutral-600);
        /* Subtle sits on the page or a card, and nowhere else: on a band
           (surface-subtle, surface-muted) or a status tint, step up to
           -muted. No value can be both quieter than muted and 4.5:1 on every
           ground -- on surface-muted it would have to be muted -- so the rule
           is where it goes, not how dark it is. Dark mode decision 17. */
        --color-text-subtle: var(--color-neutral-500);
        --color-text-disabled: var(--color-neutral-400);
        --color-text-inverse: var(--color-neutral-0);
        /* Subordinate text on an inverse surface. --color-text-inverse is the
           high-emphasis step there; this is the one below it, and until now the
           system had no such step at all -- the light-side -secondary, -muted and
           -subtle roles invert to 1.91, 2.73 and 3.74 against
           --color-surface-inverse and cannot be used.

           Two components had already invented it independently and spelled it
           differently: bd-terminal-message with rgba(255,255,255,0.5) and
           bd-process-steps with --color-neutral-300 twice. neutral-300 is the
           value here because it is the portable one. Measured on the three
           inverse grounds in use -- neutral-900, neutral-800 and the #0b1626 the
           process-steps gradient ends on -- it reads 7.92, 5.85 and 8.00, while
           the white-at-half-alpha spelling reads 5.27, 3.89 and 5.32 and only
           clears 4.5 because the terminal's ground happens to be the darkest of
           the three.

           There is deliberately no -secondary-inverse: bd-cta-banner has a third
           tier at white 0.85 and it is one consumer, which is not a
           responsibility. An earlier draft of this note also called it a
           contrast failure, from a worst-case calculation against the lightest
           stop in its gradient. Sampling the pixels actually behind the text
           disproved that -- the radial highlight sits at 78% -10% and is mostly
           outside the banner, so the three tiers measure 4.60, 4.57 and 4.46 at
           their worst pixel rather than the 3.35, 2.84 and 2.13 the arithmetic
           predicted. The tier is fine; it is still not a role. */
        --color-text-muted-inverse: var(--color-neutral-300);
        /* Ink on --color-surface-media, fixed with it: a part that does not
           switch needs ink that does not switch either (the white button
           preset, dark mode finding 8). text-inverse and text-muted-inverse
           flip in a dark theme and would put dark ink on the dark frame --
           a video play icon at 3.13:1, a terminal's quieter lines at 1.91. */
        --color-text-on-media: var(--color-neutral-0);
        --color-text-on-media-muted: var(--color-neutral-300);
        --color-text-brand: var(--color-brand-600);
        /* Brand text, hovered: a link or a citation reference under the
           pointer. Before this role existed, the hover read
           --color-action-primary-active -- a pressed button fill used as ink.
           The value is the same blue-700, so nothing moves in this theme; the
           difference is that a fill and a text colour answer different
           questions, and a dark theme has to answer them differently. Measured
           in the Figma Dark mode study: the fill stays put on a dark page and
           the link it borrowed falls to 2.27:1. */
        --color-text-brand-hover: var(--color-brand-700);
        --color-text-success: var(--color-green-800);
        /* Warning text sits on the page, a card, surface-subtle (5.16) or its
           own tint (--color-surface-warning, 5.59) -- not on surface-muted,
           where it measures 4.49:1, a hair under 4.5. The same rule as
           -subtle above: the role is right and the ground is wrong, so the
           fix is the ground. Nothing in the package draws the pair today:
           bd-tag and bd-badge draw this yellow through --status-warning-text,
           on --status-warning-surface. The way a page reaches it is the
           color="warning" value the text atoms take (token-scales.js). */
        --color-text-warning: var(--color-yellow-800);
        --color-text-error: var(--color-red-700);

        /* Surfaces. The feedback four are the tints a message sits on, each
           measured against the matching --color-text-* step above: success
           6.42, warning 5.59, error 6.83, info 5.72.

           -brand is the one to watch. --color-text-inverse on it measures
           4.53:1 — it passes, with no headroom at all, and it is the same
           blue-500 the contrast note warns about elsewhere. White on brand is
           fine for a button label; do not build a tinted variant on top of it
           without re-measuring. */
        --color-surface-default: var(--color-neutral-0);
        /* The ground a self-contained content object sits on: one step off the
           page, so a card, tile or panel reads as its own object without
           needing a border or a shadow to say so. Twelve components were
           reaching past the surface family for this, eight of them declaring
           the same local alias, because the role did not exist.

           Container is not subtle. Subtle groups things that already belong
           together and is meant to recede; container is the default ground of
           an object that stands on its own. They also differ visibly -- the
           step between them is the difference between an object on the page
           and a wash behind a group -- so they are not interchangeable.

           The name means a visual container for content. It has nothing to do
           with CSS container queries. */
        --color-surface-container: var(--color-neutral-25);
        --color-surface-subtle: var(--color-neutral-50);
        --color-surface-muted: var(--color-neutral-100);
        --color-surface-inverse: var(--color-neutral-900);
        /* The frame around media: a video letterbox, a terminal panel. Dark in
           every theme, because what it frames is dark -- which is why it is
           not --color-surface-inverse, the polarity flip, that both used to
           read. Inverse turns light in a dark theme; a letterbox must not,
           and the terminal's own palette (blue-400, the traffic-light green)
           is only legible on a dark ground. Dark mode decision 15. */
        --color-surface-media: var(--color-neutral-900);
        --color-surface-brand: var(--color-brand-500);
        --color-surface-disabled: var(--color-neutral-100);
        /* The ground of a control while it is held down, one step below
           -muted (its hover). bd-back read neutral-200 for this and said in a
           no-token comment that the surface roles stopped at -muted; reading
           the primitive meant it could not follow a theme, and on a dark page
           it measured 1.48:1 under a label that did (dark mode finding 14). */
        --color-surface-pressed: var(--color-neutral-200);
        --color-surface-success: var(--color-green-50);
        --color-surface-warning: var(--color-yellow-50);
        --color-surface-error: var(--color-red-50);
        --color-surface-info: var(--color-blue-50);

        /* Borders, measured on --color-surface-default. Only the two that
           bound a live control clear the 3:1 WCAG 1.4.11 asks of a UI
           component: -default at 3.23 and -brand at 4.53.

           -subtle (1.66) and -disabled (2.27) sit below it on purpose.
           -subtle is a decorative hairline between things that already belong
           together, not the edge of anything actionable, and disabled controls
           are exempt under 1.4.3. Do not reach for -subtle to outline a
           control.

           -default's 3.23 holds on white and nowhere darker: on a band it is
           2.88 (surface-subtle) and 2.51 (surface-muted), and on the brand
           tint 2.99. So a control drawn in it carries a fill of its own --
           surface-default, the ground it was measured on -- and its edge is
           read against that fill wherever it is placed. A field already does
           (--form-input-default-backgroundColor). A control with no fill, or
           whose fill IS this colour (the switch's off track), belongs on the
           page or a card, not on a band. The rule is where it goes; a darker
           -default would move every field edge in the system to fix a case
           nothing in the package draws. */
        --color-border-subtle: var(--color-neutral-200);
        --color-border-default: var(--color-neutral-400);
        --color-border-strong: var(--color-neutral-900);
        --color-border-brand: var(--color-brand-500);
        --color-border-disabled: var(--color-neutral-300);

        /* The boundary of a self-contained object -- a card, a panel, a
           navigation band -- drawn only so the object is perceptible, never so
           it looks operable. It is the border counterpart of
           --color-surface-container, and the two answer the same question from
           opposite sides: is this its own thing.

           It exists because eight components needed it and none could ask for
           it. Seven reached past the roles to --color-neutral-100 directly and
           one more declared a private --border-card-grey alias in seven files
           to say --color-neutral-50. Measured on --color-surface-default it is
           1.29:1, and on --color-surface-container 1.23:1 -- deliberately below
           -subtle's 1.66, because -subtle is already spoken for as the hairline
           between things that belong together, and a long way below the 3:1
           WCAG 1.4.11 asks of anything actionable. That is the point: an object
           boundary is not a control edge, and must not read as one.

           -inverse is the same responsibility on an inverse surface, the way
           --color-text-inverse and --color-surface-inverse are, and not a
           second role. It is spelled as a proportion of --color-neutral-0
           rather than a raw rgba for the same reason
           --button-outline-white-border-default is: the value stays traceable
           to a token when the palette moves. Over --color-surface-inverse it
           measures 1.42:1, which puts it in the same perceptual band as the
           light value rather than at the 10.8:1 --color-border-subtle would
           give there.

           This role says what a low-emphasis boundary looks like. It does not
           say whether a component should have one -- that stays a component
           decision, and the evidence says the components genuinely disagree. */
        --color-border-container: var(--color-neutral-100);
        --color-border-container-inverse: color-mix(in srgb, var(--color-neutral-0) 12%, transparent);

        /* Action. The interactive ramp, one step down the palette per state.
           accent is this system's conversion colour — Buy now and the like —
           and is not a danger signal; see the bd-button story notes. */
        --color-action-primary: var(--color-brand-500);
        --color-action-primary-hover: var(--color-brand-600);
        --color-action-primary-active: var(--color-brand-700);
        --color-action-accent: var(--color-red-600);
        --color-action-accent-hover: var(--color-red-700);
        --color-action-accent-active: var(--color-red-800);
        /* The neutral action fill: the secondary button, and the ghost
           button's pressed state. Both read neutral-950 / 800 / 1000 straight
           from the palette, which no theme can reach -- and the dark page is
           neutral-950 too, so in a dark theme the fill would vanish into it
           (dark mode finding 8). A role gives the fill a value of its own in
           each theme. */
        --color-action-secondary: var(--color-neutral-950);
        --color-action-secondary-hover: var(--color-neutral-800);
        --color-action-secondary-active: var(--color-neutral-1000);
        /* Ink on an action fill: a button label, a checkmark, a radio dot, a
           switch thumb. Before this role existed the buttons read
           --color-text-inverse ("text on an inverse surface") and the controls
           read --color-surface-default ("the page"). Both resolve to white in
           this theme, which is why the borrowing never showed -- and both must
           flip to near-black in a dark one, which would turn every label and
           mark dark on its blue or red fill. White clears every action fill:
           4.53 to 10.51:1 on the blue and red ones, 13.28 to 21:1 on the
           near-black secondary ones. Measured in the Figma Dark mode study,
           and re-measured on the live tokens 2026-10-15. */
        --color-action-on-fill: var(--color-neutral-0);
        /* Ink on a BRAND fill: a label, a checkmark, a dot or a thumb sitting on
           a colour from the brand ramp. White today, the same pixel
           --color-action-on-fill gives, so nothing moves. It exists because the
           two stop agreeing the moment a partner's brand is light: white on a
           typical brand orange is about 2.6:1, black about 8:1. A partner theme
           sets this to whichever clears its fill, and --color-action-on-fill
           stays white for the fills that are not the brand's -- the red accent
           and the near-black secondary, where black would fail. Part of the
           theme contract (src/tokens/themes/contract.js). */
        --color-brand-on-fill: var(--color-neutral-0);

        /* ================================
             SEMANTIC ROLES - STACKING
             ================================
           Thirty z-index declarations across eight values that were never
           chosen relative to one another: -1, 1, 2, 10, 200, 1000, 1001 and
           9999. Both bd-modal and the carousel sit on 9999, so there is no
           answer to which of the two wins — that is what an unscaled ladder
           costs.

           The rungs are far apart on purpose, so a component can take a rung
           and still stack its own internals inside it with a calc. A tooltip
           opened from inside a dialog has to clear the dialog, which is why
           it is the top rung rather than the first. */
        --z-below: -1;
        --z-base: 1;
        --z-raised: 2;
        --z-sticky: 200;
        --z-overlay: 1000;
        --z-modal: 1100;
        --z-tooltip: 1200;

        /* ================================
             SEMANTIC ROLES - OPACITY
             ================================
           One role, because one role is what the evidence supports. The dim
           end of a reduced-motion pulse is spelled three times in the atom
           layer — bd-button and bd-spinner at 0.4, bd-skeleton at 0.45 — and
           is the same intent each time: a mark that cannot spin should still
           read as busy.

           Disabled is deliberately absent. This system expresses disabled with
           the neutral ramp rather than by dimming, and the one token that said
           otherwise (--button-shared-disabled-opacity: 0.6) is unused. */
        --opacity-pulse: 0.4;

        /* ================================
             SEMANTIC ROLE - STATUS TONES
             ================================
           bd-badge, bd-tag and bd-alert all say the same six things and each
           spelled them out for itself. The text colours already matched across
           badge and tag — the tag story says so — but by coincidence rather
           than construction, and the one place they had drifted proves the
           point: alert drew its success rule in green-600 where badge's
           success dot used green-700.

           Seven roles, because the three components need different weights of
           the same tone:

             -text            ink on a tinted chip        badge shade, tag
             -surface         the light tint              tag, alert
             -surface-strong  the heavier tint            badge shade
             -border          the hairline                tag
             -accent          the saturated step          badge dot, alert rule
             -fill / -on-fill a saturated chip and its ink  badge fill

           What is deliberately *not* unified: a tag carries a border and sits
           on -surface, a badge has no border and sits on -surface-strong. That
           difference is documented in the tag story — the lighter fill is what
           lets the tag's border read — so it is expressed as two roles rather
           than flattened into one.

           Brand has no -surface-strong. It would be blue-100, which is
           info's, so a brand badge on it could not be told from an info badge.
           Brand's badge sits on -surface like its tag, and that one collision
           is the whole exception. */

        --status-neutral-text: var(--color-neutral-700);
        --status-neutral-surface: var(--color-neutral-50);
        --status-neutral-surface-strong: var(--color-neutral-100);
        --status-neutral-border: var(--color-neutral-200);
        --status-neutral-accent: var(--color-neutral-700);
        --status-neutral-fill: var(--color-neutral-900);
        --status-neutral-on-fill: var(--color-neutral-0);

        --status-brand-text: var(--color-brand-600);
        --status-brand-surface: var(--color-brand-50);
        --status-brand-border: var(--color-brand-200);
        --status-brand-accent: var(--color-brand-600);
        --status-brand-fill: var(--color-brand-500);
        --status-brand-on-fill: var(--color-brand-on-fill);

        --status-info-text: var(--color-blue-600);
        --status-info-surface: var(--color-blue-50);
        --status-info-surface-strong: var(--color-blue-100);
        --status-info-border: var(--color-blue-200);
        --status-info-accent: var(--color-blue-500);
        --status-info-fill: var(--color-blue-500);
        --status-info-on-fill: var(--color-neutral-0);

        --status-success-text: var(--color-green-800);
        --status-success-surface: var(--color-green-50);
        --status-success-surface-strong: var(--color-green-100);
        --status-success-border: var(--color-green-200);
        --status-success-accent: var(--color-green-700);
        --status-success-fill: var(--color-green-700);
        --status-success-on-fill: var(--color-neutral-0);

        --status-warning-text: var(--color-yellow-800);
        --status-warning-surface: var(--color-yellow-50);
        --status-warning-surface-strong: var(--color-yellow-100);
        --status-warning-border: var(--color-yellow-200);
        --status-warning-accent: var(--color-yellow-700);
        --status-warning-fill: var(--color-yellow-500);
        --status-warning-on-fill: var(--color-neutral-900);

        --status-error-text: var(--color-red-700);
        --status-error-surface: var(--color-red-50);
        --status-error-surface-strong: var(--color-red-100);
        --status-error-border: var(--color-red-200);
        --status-error-accent: var(--color-red-600);
        --status-error-fill: var(--color-red-600);
        --status-error-on-fill: var(--color-neutral-0);

        /* ================================
             COMPONENT TOKENS - TYPOGRAPHY
             ================================ */


        /* ===============================================================
           FLUID TYPE - the roles that cannot hold their size on a phone.

           WHY. Measured in the Figma file (page "Type on mobile"), the
           binding constraint on large type is not how many lines a sentence
           takes, it is whether the longest UNBREAKABLE WORD fits the column.
           The column is the viewport minus twice --grid-padding-*, so a 320px
           phone gives type 288px -- 10% of the screen is gutter. Against that
           column, the widest real words in the nine shipping languages --
           harvested from live localized copy, see type-ceiling-words.js and
           plans/LATER.md entry 8 -- set two ceilings: 28px for any copy
           (Swedish "kalenderinbjudningar", 10.16px of width per px of size)
           and 31px for headline copy (German "Gründungsmitglied", 9.05).
           heading-h1 is 48. It overflowed at 375 as well as at 320. (This
           rested on a Finnish word once; Finnish is not a market, and three
           real words beat it.)

           WHY NOT A BREAKPOINT STEP. Tried first and abandoned, measured:
           stepping h1 to 36 below sm still overflows at 320 (needs 327 of
           288) and changes nothing at 576-767 where the ceiling is already 54.
           The constraint moves continuously with the column, because the
           column is a function of viewport width -- a step function
           approximates a line with a staircase. clamp() states the line.

           THE WINDOW IS 320 -> 992. The minimum is reached at 320 and the
           maximum at 992, which is the lg breakpoint. Above lg NOTHING
           changes from the sizes this system shipped with, so every desktop
           layout that has been reviewed stays exactly as reviewed, and the
           whole change is confined to the widths where the failures were
           measured.

           THE MIDDLE TERM CARRIES A rem, AND THAT IS NOT OPTIONAL.
           clamp(2rem, 4vw, 3rem) is the spelling everyone reaches for and it
           breaks text resize: a size depending only on viewport width ignores
           the reader's own font-size setting, which is WCAG 1.4.4. With a rem
           in the middle term the type still grows when the reader enlarges
           it. This package already refuses the equivalent mistake twice --
           line-height is always unitless, and --spacing-* is rem precisely so
           boxes grow with the text.

           THE TWO LITERALS PER ROLE ARE DERIVED, NOT CHOSEN. For a role
           running from min m to max M across the window V1..V2:

             slope     = (M - m) / (V2 - V1)        px of size per px of width
             vw term   = slope x 100
             rem term  = (m - slope x V1) / 16

           With V1=320 and V2=992 that is (M-m)/6.72 vw and
           (m - (M-m)/2.1) / 16 rem. Every pair below is that arithmetic and
           nothing else; each line states its own m and M so it can be checked
           without re-deriving. Changing the mobile ladder means changing the
           -fontSizeMin token and re-running the two formulas.

           THE MOBILE LADDER IS THE DESIGN DECISION HERE, and it is these six
           numbers: 30 27 24 21 18 16 for h1 through h6. Its ratios are 1.11,
           1.13, 1.14, 1.17, 1.13 -- near-even, against the desktop ladder's
           irregular 1.33, 1.13, 1.33, 1.20, 1.11. A phone has less range to
           spend (16 to the 31px headline ceiling, a factor of 1.94, where
           desktop has 18 to 48, a factor of 2.67), so the ladder has to
           compress, and compressing it evenly is what keeps six levels
           distinguishable. Measured on the harvest: h1 at 30 sets the widest
           headline word in 272px of a 288px column. The widest word of any
           tier would need 305, so a headline word wider than 960px per 100px
           of size is a stated copy constraint (LATER.md entry 8) rather than
           a margin the ladder holds -- none of the five such words is a
           headline today.

           WHAT IS DELIBERATELY NOT FLUID.
           - Every role at 24px and below except body-lead. Nothing that small
             overflows, and the small end's own failure is measure, not
             overflow -- see below.
           - display-lg, display-xl, display-2xl, display-3xl (60 to 128px).
             Above display-md the family has NO mobile identity to give it:
             four roles would all have to squeeze between 30 and the 31px
             headline ceiling. They are desktop-only, and a component that
             needs one of them on a phone should reach for a heading role
             instead. Recorded rather than papered over.
           - body-regular at 16px. It runs 40 characters per line on a 288px
             column, which the study first called "below the comfortable
             45-75 band" -- and that band is a print and desktop yardstick.
             Reaching 45 CPL on a 288px column needs 14.2px body text, and 50
             CPL needs 12.8px; applying it to a phone trades the 16px
             accessibility floor for a soft readability target. 40 characters
             is what every phone does. body-lead is the one prose role that
             does move, 20 -> 18, because at 20 it ran 32 characters -- five
             or six words a line -- and an intro paragraph has no claim on
             being the largest thing on a small screen.
           =============================================================== */

        /* Heading Tokens */
        /* fluid: 30px at 320 -> 48px at 992. (48-30)/6.72=2.6786vw, (30-(48-30)/2.1)/16=1.33929rem */
        --typography-heading-h1-fontSizeMin: 1.875rem; /* 30px */
        --typography-heading-h1-fontSize: clamp(
          var(--typography-heading-h1-fontSizeMin),
          calc(1.33929rem + 2.6786vw),
          var(--typography-fontSize-5xl)
        );
        --typography-heading-h1-fontWeight: var(--typography-fontWeight-bold);
        --typography-heading-h1-lineHeight: var(--typography-lineHeight-tight);
        --typography-heading-h1-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-heading-h1-fontFamily: var(--typography-fontFamily-sans);

        /* fluid: 27px at 320 -> 36px at 992. (36-27)/6.72=1.3393vw, (27-(36-27)/2.1)/16=1.41964rem */
        --typography-heading-h2-fontSizeMin: 1.6875rem; /* 27px */
        --typography-heading-h2-fontSize: clamp(
          var(--typography-heading-h2-fontSizeMin),
          calc(1.41964rem + 1.3393vw),
          var(--typography-fontSize-4xl)
        );
        --typography-heading-h2-fontWeight: var(--typography-fontWeight-bold);
        --typography-heading-h2-lineHeight: var(--typography-lineHeight-tight);
        --typography-heading-h2-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-heading-h2-fontFamily: var(--typography-fontFamily-sans);

        /* fluid: 24px at 320 -> 32px at 992. (32-24)/6.72=1.1905vw, (24-(32-24)/2.1)/16=1.26190rem */
        --typography-heading-h3-fontSizeMin: 1.5rem; /* 24px */
        --typography-heading-h3-fontSize: clamp(
          var(--typography-heading-h3-fontSizeMin),
          calc(1.26190rem + 1.1905vw),
          var(--typography-fontSize-3xl)
        );
        --typography-heading-h3-fontWeight: var(--typography-fontWeight-semibold);
        --typography-heading-h3-lineHeight: var(--typography-lineHeight-130);
        --typography-heading-h3-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-heading-h3-fontFamily: var(--typography-fontFamily-sans);

        /* fluid: 21px at 320 -> 24px at 992. (24-21)/6.72=0.4464vw, (21-(24-21)/2.1)/16=1.22321rem */
        --typography-heading-h4-fontSizeMin: 1.3125rem; /* 21px */
        --typography-heading-h4-fontSize: clamp(
          var(--typography-heading-h4-fontSizeMin),
          calc(1.22321rem + 0.4464vw),
          var(--typography-fontSize-2xl)
        );
        --typography-heading-h4-fontWeight: var(--typography-fontWeight-semibold);
        --typography-heading-h4-lineHeight: var(--typography-lineHeight-130);
        --typography-heading-h4-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-heading-h4-fontFamily: var(--typography-fontFamily-sans);

        /* fluid: 18px at 320 -> 20px at 992. (20-18)/6.72=0.2976vw, (18-(20-18)/2.1)/16=1.06548rem */
        --typography-heading-h5-fontSizeMin: 1.125rem; /* 18px */
        --typography-heading-h5-fontSize: clamp(
          var(--typography-heading-h5-fontSizeMin),
          calc(1.06548rem + 0.2976vw),
          var(--typography-fontSize-xl)
        );
        --typography-heading-h5-fontWeight: var(--typography-fontWeight-medium);
        --typography-heading-h5-lineHeight: var(--typography-lineHeight-140);
        --typography-heading-h5-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-heading-h5-fontFamily: var(--typography-fontFamily-sans);

        /* fluid: 16px at 320 -> 18px at 992. (18-16)/6.72=0.2976vw, (16-(18-16)/2.1)/16=0.94048rem */
        --typography-heading-h6-fontSizeMin: 1rem; /* 16px */
        --typography-heading-h6-fontSize: clamp(
          var(--typography-heading-h6-fontSizeMin),
          calc(0.94048rem + 0.2976vw),
          var(--typography-fontSize-lg)
        );
        --typography-heading-h6-fontWeight: var(--typography-fontWeight-medium);
        --typography-heading-h6-lineHeight: var(--typography-lineHeight-145);
        --typography-heading-h6-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-heading-h6-fontFamily: var(--typography-fontFamily-sans);

        /* Body Text Tokens */
        --typography-body-large-fontSize: var(--typography-fontSize-lg);
        --typography-body-large-fontWeight: var(--typography-fontWeight-normal);
        --typography-body-large-lineHeight: var(--typography-lineHeight-145);
        --typography-body-large-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-body-large-fontFamily: var(--typography-fontFamily-sans);

        --typography-body-regular-fontSize: var(--typography-fontSize-base);
        --typography-body-regular-fontWeight: var(--typography-fontWeight-normal);
        --typography-body-regular-lineHeight: var(--typography-lineHeight-normal);
        --typography-body-regular-letterSpacing: var(
            --typography-letterSpacing-normal
        );
        --typography-body-regular-fontFamily: var(--typography-fontFamily-sans);

        --typography-body-small-fontSize: var(--typography-fontSize-sm);
        --typography-body-small-fontWeight: var(--typography-fontWeight-normal);
        --typography-body-small-lineHeight: var(--typography-lineHeight-145);
        --typography-body-small-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-body-small-fontFamily: var(--typography-fontFamily-sans);

        /* fluid: 18px at 320 -> 20px at 992. (20-18)/6.72=0.2976vw, (18-(20-18)/2.1)/16=1.06548rem */
        --typography-body-lead-fontSizeMin: 1.125rem; /* 18px */
        --typography-body-lead-fontSize: clamp(
          var(--typography-body-lead-fontSizeMin),
          calc(1.06548rem + 0.2976vw),
          var(--typography-fontSize-xl)
        );
        --typography-body-lead-fontWeight: var(--typography-fontWeight-normal);
        --typography-body-lead-lineHeight: var(--typography-lineHeight-140);
        --typography-body-lead-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-body-lead-fontFamily: var(--typography-fontFamily-sans);

        /* Label Tokens */
        --typography-label-default-fontSize: var(--typography-fontSize-sm);
        --typography-label-default-fontWeight: var(--typography-fontWeight-medium);
        --typography-label-default-lineHeight: var(--typography-lineHeight-normal);
        --typography-label-default-letterSpacing: var(
            --typography-letterSpacing-normal
        );
        --typography-label-default-fontFamily: var(--typography-fontFamily-sans);

        --typography-label-small-fontSize: var(--typography-fontSize-xs);
        --typography-label-small-fontWeight: var(--typography-fontWeight-medium);
        --typography-label-small-lineHeight: var(--typography-lineHeight-normal);
        --typography-label-small-letterSpacing: var(--typography-letterSpacing-wide);
        --typography-label-small-fontFamily: var(--typography-fontFamily-sans);

        /* The only role for the 11px step, and it carried a size and nothing
           else -- so anything using it inherited its leading from whatever it
           happened to sit inside, which is not a typography contract. The four
           missing axes match label-small, one step up. It has no consumers
           today; the five components that render 11px reach past it for the
           primitive, and moving them is a visual change this phase does not
           make. */
        --typography-label-extra-small-fontSize: var(--typography-fontSize-xxs);
        --typography-label-extra-small-fontWeight: var(--typography-fontWeight-medium);
        --typography-label-extra-small-lineHeight: var(--typography-lineHeight-normal);
        --typography-label-extra-small-letterSpacing: var(--typography-letterSpacing-wide);
        --typography-label-extra-small-fontFamily: var(--typography-fontFamily-sans);

        /* Deliberately size-only: bd-p variant=xsmall composes it with
           body-small's weight, leading and tracking, so giving it axes of its
           own would create a second answer to those questions.

           It lives in the body family, not the label one. It was
           --typography-label-xsmall-fontSize, one character away from
           label-extra-small, which is a complete 11px role with a weight, a
           leading and a family. Two names that close, describing things that
           different, is a trap: one is a role you can ask for and the other is
           a bare size that matches any one-axis 12px declaration on size
           alone. Naming it for the component that owns it says which is
           which. */
        --typography-body-xsmall-fontSize: var(--typography-fontSize-xs);

        --typography-label-large-fontSize: var(--typography-fontSize-base);
        --typography-label-large-fontWeight: var(--typography-fontWeight-medium);
        --typography-label-large-lineHeight: var(--typography-lineHeight-normal);
        --typography-label-large-letterSpacing: var(
            --typography-letterSpacing-normal
        );
        --typography-label-large-fontFamily: var(--typography-fontFamily-sans);

        /* Control Label Tokens

           label-* at control leading. Every label-* rung is lineHeight-normal
           (1.5); a control -- a badge, a button -- needs 1.25 so its box can be
           padding-driven without the line box forcing it taller.
           scripts/typography-pairings.json already records 16px at 1.25 as
           physically valid "because control text needs it", and rule 8 says
           that file is a technical boundary rather than authorization, so the
           authorization is here: this is the role that means "a label on a
           control".

           Motivated by badge.css.js and button.css.js's .bd-contact-btn, which
           each arrived independently at medium + tight and had no role to ask
           for. The three rungs mirror label-small / label-default /
           label-large step for step. The one place they do not mirror is
           tracking on the small rung: label-small is letterSpacing-wide, but
           badge -- the atom this rung exists for -- renders normal, so the rung
           describes its consumer rather than its twin. Everywhere else the only
           axis that differs from the label-* rung of the same name is the
           leading. */
        --typography-control-label-small-fontSize: var(--typography-fontSize-xs);
        --typography-control-label-small-fontWeight: var(--typography-fontWeight-medium);
        --typography-control-label-small-lineHeight: var(--typography-lineHeight-tight);
        --typography-control-label-small-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-control-label-small-fontFamily: var(--typography-fontFamily-sans);

        --typography-control-label-default-fontSize: var(--typography-fontSize-sm);
        --typography-control-label-default-fontWeight: var(--typography-fontWeight-medium);
        --typography-control-label-default-lineHeight: var(--typography-lineHeight-tight);
        --typography-control-label-default-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-control-label-default-fontFamily: var(--typography-fontFamily-sans);

        --typography-control-label-large-fontSize: var(--typography-fontSize-base);
        --typography-control-label-large-fontWeight: var(--typography-fontWeight-medium);
        --typography-control-label-large-lineHeight: var(--typography-lineHeight-tight);
        --typography-control-label-large-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-control-label-large-fontFamily: var(--typography-fontFamily-sans);

        /* The rung label-xl used to occupy. label-xl was lg/medium/normal and
           documented in vertical-rhythm.stories.js as "the name of a large
           control" -- the same job this family names, but at label leading
           rather than control leading, and with no consumer in the package.
           Retired in favour of this. Note it was byte-identical to heading-h6,
           which stays: that pair was two questions with coincidentally equal
           answers, and heading-h6 is the one bd-h actually renders. */
        --typography-control-label-xl-fontSize: var(--typography-fontSize-lg);
        --typography-control-label-xl-fontWeight: var(--typography-fontWeight-medium);
        --typography-control-label-xl-lineHeight: var(--typography-lineHeight-tight);
        --typography-control-label-xl-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-control-label-xl-fontFamily: var(--typography-fontFamily-sans);

        /* Caption Tokens */
        --typography-caption-default-fontSize: var(--typography-fontSize-xs);
        --typography-caption-default-fontWeight: var(--typography-fontWeight-normal);
        --typography-caption-default-lineHeight: var(--typography-lineHeight-normal);
        --typography-caption-default-letterSpacing: var(
            --typography-letterSpacing-normal
        );
        --typography-caption-default-fontFamily: var(--typography-fontFamily-sans);
        --typography-caption-default-color: var(--color-text-muted);

        /* "small" is not smaller. It is caption-default with the tracking
           opened to wide -- 0.025em, which is the design's caption/small at
           2.5% -- and every other axis equal. The repeated axes are the role
           being complete, as every role is, not a second copy to remove;
           bd-caption size="sm" reads all five. */
        --typography-caption-small-fontSize: var(--typography-fontSize-xs);
        --typography-caption-small-fontWeight: var(--typography-fontWeight-normal);
        --typography-caption-small-lineHeight: var(--typography-lineHeight-normal);
        --typography-caption-small-letterSpacing: var(
            --typography-letterSpacing-wide
        );
        --typography-caption-small-fontFamily: var(--typography-fontFamily-sans);

        /* Link Tokens */
        --typography-link-default-fontSize: inherit;
        --typography-link-default-fontWeight: var(--typography-fontWeight-normal);
        --typography-link-default-lineHeight: inherit;
        --typography-link-default-letterSpacing: inherit;
        --typography-link-default-fontFamily: inherit;
        --typography-link-default-textDecoration-default: underline;
        --typography-link-default-textDecoration-hover: none;
        /* The gap between the text and its underline. It was spelled as a 2px
           literal in seven places in bd-link, on a property the length rule
           does not check, so nothing could see it and nothing could change it
           in one move. */
        --typography-link-underlineOffset: var(--spacing-2);
        --typography-link-underlineThickness: var(--border-width-2);

        --typography-link-standalone-fontSize: var(--typography-fontSize-base);
        --typography-link-standalone-fontWeight: var(--typography-fontWeight-medium);
        --typography-link-standalone-lineHeight: var(--typography-lineHeight-normal);
        --typography-link-standalone-letterSpacing: var(
            --typography-letterSpacing-normal
        );
        --typography-link-standalone-fontFamily: var(--typography-fontFamily-sans);
        --typography-link-standalone-textDecoration-default: underline;
        --typography-link-standalone-textDecoration-hover: none;

        /* Code Tokens */
        --typography-code-inline-fontSize: 0.875em;
        --typography-code-inline-fontWeight: var(--typography-fontWeight-normal);
        --typography-code-inline-lineHeight: inherit;
        --typography-code-inline-letterSpacing: var(
            --typography-letterSpacing-normal
        );
        --typography-code-inline-fontFamily: var(--typography-fontFamily-mono);

        --typography-code-block-fontSize: var(--typography-fontSize-sm);
        --typography-code-block-fontWeight: var(--typography-fontWeight-normal);
        --typography-code-block-lineHeight: var(--typography-lineHeight-relaxed);
        --typography-code-block-letterSpacing: var(--typography-letterSpacing-normal);
        --typography-code-block-fontFamily: var(--typography-fontFamily-mono);

        /* Display Typography Tokens */
        --typography-display-3xl-fontSize: var(--typography-fontSize-9xl);
        --typography-display-3xl-fontWeight: var(--typography-fontWeight-bold);
        --typography-display-3xl-lineHeight: var(--typography-lineHeight-tight);
        --typography-display-3xl-letterSpacing: var(--typography-letterSpacing-tight);
        --typography-display-3xl-fontFamily: var(--typography-fontFamily-sans);

        --typography-display-2xl-fontSize: var(--typography-fontSize-8xl);
        --typography-display-2xl-fontWeight: var(--typography-fontWeight-bold);
        --typography-display-2xl-lineHeight: var(--typography-lineHeight-tight);
        --typography-display-2xl-letterSpacing: var(--typography-letterSpacing-tight);
        --typography-display-2xl-fontFamily: var(--typography-fontFamily-sans);

        --typography-display-xl-fontSize: var(--typography-fontSize-7xl);
        --typography-display-xl-fontWeight: var(--typography-fontWeight-bold);
        --typography-display-xl-lineHeight: var(--typography-lineHeight-tight);
        --typography-display-xl-letterSpacing: var(--typography-letterSpacing-tight);
        --typography-display-xl-fontFamily: var(--typography-fontFamily-sans);

        --typography-display-lg-fontSize: var(--typography-fontSize-6xl);
        --typography-display-lg-fontWeight: var(--typography-fontWeight-bold);
        --typography-display-lg-lineHeight: var(--typography-lineHeight-tight);
        --typography-display-lg-letterSpacing: var(--typography-letterSpacing-tight);
        --typography-display-lg-fontFamily: var(--typography-fontFamily-sans);

        /* fluid: 30px at 320 -> 48px at 992. (48-30)/6.72=2.6786vw, (30-(48-30)/2.1)/16=1.33929rem */
        --typography-display-md-fontSizeMin: 1.875rem; /* 30px */
        --typography-display-md-fontSize: clamp(
          var(--typography-display-md-fontSizeMin),
          calc(1.33929rem + 2.6786vw),
          var(--typography-fontSize-5xl)
        );
        --typography-display-md-fontWeight: var(--typography-fontWeight-bold);
        --typography-display-md-lineHeight: var(--typography-lineHeight-tight);
        --typography-display-md-letterSpacing: var(--typography-letterSpacing-tight);
        --typography-display-md-fontFamily: var(--typography-fontFamily-sans);

        /* 36px at every width: the floor meets the 4xl ceiling, so the fluid
           middle term never wins. It is kept for a brand that lowers the floor
           (it ramps 30px at 320 -> 36px at 992). */
        --typography-display-sm-fontSizeMin: 2.25rem; /* 36px */
        --typography-display-sm-fontSize: clamp(
          var(--typography-display-sm-fontSizeMin),
          calc(1.69643rem + 0.8929vw),
          var(--typography-fontSize-4xl)
        );
        --typography-display-sm-fontWeight: var(--typography-fontWeight-bold);
        --typography-display-sm-lineHeight: var(--typography-lineHeight-tight);
        --typography-display-sm-letterSpacing: var(--typography-letterSpacing-tight);
        --typography-display-sm-fontFamily: var(--typography-fontFamily-sans);

        /* ================================
             COMPONENT TOKENS - FORM
             ================================ */

        /* Form Label Tokens

           The type of a field's label is the label role's, read through: the
           default and small rungs were the same five values as
           --typography-label-default-* and -small-*, written out a second time,
           so a change to the role would have reached bd-text and missed every
           form. Colour and margin stay here; they are the form's own and no
           role carries them.

           Large differs on one axis. Its size is 18px where label-large is
           16px, set to the large field's own text (--form-input-large-fontSize)
           so the label and the value read at the same step; a field's own
           label at size lg, bd-label size=lg and the bd-fieldset legend all
           render it. That size stays a
           primitive -- no label role sits at 18px -- and the other four axes
           are label-large's. */
        --form-label-default-fontSize: var(--typography-label-default-fontSize);
        --form-label-default-fontWeight: var(--typography-label-default-fontWeight);
        --form-label-default-lineHeight: var(--typography-label-default-lineHeight);
        --form-label-default-letterSpacing: var(--typography-label-default-letterSpacing);
        --form-label-default-fontFamily: var(--typography-label-default-fontFamily);
        --form-label-default-color: var(--color-text-primary);
        --form-label-default-marginBottom: var(--spacing-4);

        --form-label-large-fontSize: var(--typography-fontSize-lg);
        --form-label-large-fontWeight: var(--typography-label-large-fontWeight);
        --form-label-large-lineHeight: var(--typography-label-large-lineHeight);
        --form-label-large-letterSpacing: var(--typography-label-large-letterSpacing);
        --form-label-large-fontFamily: var(--typography-label-large-fontFamily);
        --form-label-large-color: var(--color-text-primary);
        --form-label-large-marginBottom: var(--spacing-8);

        --form-label-small-fontSize: var(--typography-label-small-fontSize);
        --form-label-small-fontWeight: var(--typography-label-small-fontWeight);
        --form-label-small-lineHeight: var(--typography-label-small-lineHeight);
        --form-label-small-letterSpacing: var(--typography-label-small-letterSpacing);
        --form-label-small-fontFamily: var(--typography-label-small-fontFamily);
        --form-label-small-color: var(--color-text-primary);
        --form-label-small-marginBottom: var(--spacing-4);

        --form-label-required-color: var(--status-error-accent);
        --form-label-required-marginLeft: var(--spacing-4);

        /* Form Input Tokens */

        /* The height of a control is derived, not chosen: padding, type step and
           line-height, the same three bd-button derives its own height from.
           That derivation is what keeps a field and a button of the same size
           the same height on one row of a form.

           These three said --dimension-36/44/56 and stated a height the system
           does not draw. A small field renders 33.5px and a large one 54.5px;
           only medium agreed, and it agreed by coincidence. Nothing read them,
           so nothing surfaced the disagreement -- which is the argument for
           spelling the derivation here rather than a rounder number, and for
           shared/form-field.css.js reading these instead of repeating the calc
           three times. Changing them changes no pixel; it changes what the
           package tells a consumer the height is.

           The derivation counts padding but not the 1px border on each edge,
           and the box is border-box, so these heights leave the line box 2px
           taller than the content box. An input hides that -- it centres its
           line and paints into the padding -- but a select clips at the
           content box, and at md its descenders lost their bottoms.
           Correcting the height would move a field off its button, so the
           border comes out of the block padding instead: see the note after
           the size rules in shared/form-field.css.js. */
        --form-input-small-height: calc(
          var(--spacing-8) * 2 + var(--typography-fontSize-sm) * var(--typography-lineHeight-tight)
        );
        --form-input-small-fontSize: var(--typography-fontSize-sm);
        --form-input-small-padding: var(--spacing-8) var(--spacing-12);
        --form-input-small-borderRadius: var(--shape-radius-sm);

        --form-input-medium-height: calc(
          var(--spacing-12) * 2 + var(--typography-fontSize-base) * var(--typography-lineHeight-tight)
        );
        --form-input-medium-fontSize: var(--typography-fontSize-base);
        --form-input-medium-padding: var(--spacing-12) var(--spacing-16);
        --form-input-medium-borderRadius: var(--shape-radius-md);

        --form-input-large-height: calc(
          var(--spacing-16) * 2 + var(--typography-fontSize-lg) * var(--typography-lineHeight-tight)
        );
        --form-input-large-fontSize: var(--typography-fontSize-lg);
        --form-input-large-padding: var(--spacing-16) var(--spacing-20);
        --form-input-large-borderRadius: var(--shape-radius-lg);

        --form-input-default-backgroundColor: var(--color-surface-default);
        --form-input-default-borderColor: var(--color-border-default);
        --form-input-default-borderWidth: var(--border-width-1);
        --form-input-default-color: var(--color-text-primary);
        --form-input-default-fontFamily: var(--typography-fontFamily-sans);
        /* There is deliberately no --form-input-default-lineHeight. There was
           one, it said normal (1.5), it had no consumer, and it described the
           opposite of what the control does: form-field.css.js sets tight and
           records why -- at normal the line box stood taller than the content
           box the derived height leaves, and the select clipped the descenders
           of its own option text.

           It is not restored as tight either. The control's height is
           DERIVED from padding, type step and this leading, so exposing the
           leading as a component token would let a consuming page change the
           height by setting something that reads like a type preference. The
           primitive is used at the one site that needs it, with its reason on
           the line, which is what keeps the box and the text unable to
           disagree. */

        --form-input-focus-borderColor: var(--color-border-brand);
        --form-input-focus-boxShadow: var(--shadow-focus-outline-blue);

        --form-input-error-backgroundColor: var(--status-error-surface);
        --form-input-error-borderColor: var(--status-error-accent);

        --form-input-success-backgroundColor: var(--status-success-surface);
        --form-input-success-borderColor: var(--color-green-600);

        --form-input-disabled-backgroundColor: var(--color-surface-disabled);
        --form-input-disabled-borderColor: var(--color-border-disabled);
        --form-input-disabled-color: var(--color-text-subtle);

        /* Form Help Text Tokens */
        --form-help-text-default-fontSize: var(--typography-fontSize-xs);
        --form-help-text-default-fontWeight: var(--typography-fontWeight-normal);
        --form-help-text-default-lineHeight: var(--typography-lineHeight-normal);
        --form-help-text-default-letterSpacing: var(
            --typography-letterSpacing-normal
        );
        --form-help-text-default-fontFamily: var(--typography-fontFamily-sans);
        --form-help-text-default-color: var(--color-text-muted);
        --form-help-text-default-marginTop: var(--spacing-4);

        /* Measured against the tint the field itself takes in each state, not
           against white — that is the background this text actually sits
           beside. red-600 on red-50 is 4.92 and needs nothing.

           success was green-700, which is 4.75 on white but only 4.51 on
           green-50: passing by a hundredth, and the kind of margin that stops
           passing the moment a tint moves. green-800 is 6.42 there, and is
           already the step --color-text-success names for this role. */
        --form-help-text-error-color: var(--status-error-accent);
        --form-help-text-success-color: var(--color-text-success);

        /* Form Layout Tokens

           These were written against a step-indexed spacing scale, where the
           number is the position on the scale, and never converted when the
           scale became pixel-named, where the number is the value. So
           --spacing-6 stopped meaning "the sixth step, 24px" and started
           meaning 6px, silently — every token still resolved, and the lint has
           no way to see it.

           bd-fieldset consumes fieldSpacing, so a form built from it has been
           stacking its fields 6px apart. Decoded as indices these read 24 and
           32, which is what a form actually wants and what the value is set to
           here. */
        --form-fieldSpacing: var(--spacing-24);

        /* ================================
             COMPONENT TOKENS - BUTTON
             ================================ */

        /* Button Size Tokens */
        /* One size family. There were two — this one and --button-size-*, with
           different padding in each and neither matching what the component
           rendered. bd-button reads these.

           No -height. The component derives its height from padding, type step
           and line-height rather than pinning it, which is what keeps it equal
           to a field of the same size; a height token here would be a second
           answer that could disagree. */
        --button-small-fontSize: var(--typography-fontSize-sm);
        --button-small-padding: var(--spacing-8) var(--spacing-16);
        --button-small-gap: var(--spacing-4);
        --button-small-borderRadius: var(--shape-radius-sm);

        --button-medium-fontSize: var(--typography-fontSize-base);
        --button-medium-padding: var(--spacing-12) var(--spacing-24);
        --button-medium-gap: var(--spacing-8);
        --button-medium-borderRadius: var(--shape-radius-md);

        --button-large-fontSize: var(--typography-fontSize-lg);
        --button-large-padding: var(--spacing-16) var(--spacing-32);
        --button-large-gap: var(--spacing-8);
        --button-large-borderRadius: var(--shape-radius-lg);

        /* Removed 2026-10-15, because nothing read them: the seven
           --button-default-* (a state no variant draws), and
           --button-shared-focus-boxShadow, -disabled-opacity and
           -disabled-cursor (the button draws focus with the outline below and
           disabled through its own rules). Likewise the three
           --form-input-*-placeholderColor tokens, the --form-section-,
           -label- and -helpTextSpacing trio, and two --layout-awards- widths.
           None was mirrored in Figma, which carries no component tokens. */
        /* Button Shared Tokens */
        --button-shared-fontFamily: var(--typography-fontFamily-sans);
        --button-shared-fontWeight: var(--typography-fontWeight-medium);
        --button-shared-lineHeight: var(--typography-lineHeight-tight);
        --button-shared-letterSpacing: var(--typography-letterSpacing-normal);
        --button-shared-borderWidth: var(--border-width-1);
        --button-shared-transition-properties: background-color, border-color, color,
            box-shadow;
        --button-shared-transition-duration: var(--transition-duration-normal);
        --button-shared-transition-easing: var(--transition-easing-smooth);
        --button-shared-focus-outline: var(--focus-outline-traditional);
        --button-shared-focus-outlineOffset: var(--focus-outline-offset);

        /* ---- variant colours -------------------------------------------
           Named for the kind attribute they serve, because that is the public
           vocabulary: primary, secondary, tertiary, ghost, accent, white and
           outline-white. They used to be named tertiaryPrimary,
           tertiarySecondary and cta, which no consumer could map onto the
           component without reading its source.

           bd-button aliases each of these onto a --button-*-bg property on its
           own :host, so there are two override points and they do different
           jobs: set the token on :root to move every button in the document,
           or the alias on the bd-button element to move one. The alias is also what
           surface="dark" switches, which is why the component keeps it.

           Every value here is what the component already renders. The old
           values had drifted apart from it in four places — secondary's hover
           and active, tertiary's hover border and ghost's active fill — so
           wiring them up unchanged would have moved pixels.

           The per-variant -focus and -disabled sets are gone. The component
           draws its focus ring as an offset outline -- the blue one through
           --button-shared-focus-outline by default, the white one from
           --focus-outline-traditional-inverse under surface="dark" and on
           white and outline-white -- and one shared disabled treatment;
           thirty tokens described per-variant versions of both that nothing
           rendered. --button-empty-* went with them: there is no empty kind. */

        /* primary: blue fill */
        --button-primary-background-default: var(--color-action-primary);
        --button-primary-background-hover: var(--color-action-primary-hover);
        --button-primary-background-active: var(--color-action-primary-active);
        --button-primary-text-default: var(--color-brand-on-fill);

        /* secondary: near-black fill */
        --button-secondary-background-default: var(--color-action-secondary);
        --button-secondary-background-hover: var(--color-action-secondary-hover);
        --button-secondary-background-active: var(--color-action-secondary-active);
        --button-secondary-text-default: var(--color-action-on-fill);

        /* tertiary: blue outline. text-hover is blue-600, not blue-500: on the
           blue-50 hover fill the lighter step measures 4.20:1 and fails 1.4.3,
           where blue-600 gives 5.72.
           .
           text-default is blue-600 for the same reason, applied to the state a
           reader actually sits in. The line above fixed hover, where blue-500
           failed outright, and left the resting state on blue-500 at 4.53:1 --
           passing 4.5 by 0.03 on pure white and failing on any tint, which is
           the margin CLAUDE.md says is not real. Both states now name the same
           ink role, and the role is the category-correct one: --color-action-primary
           is an interaction role for fills, not ink, and it was being read by a
           color: property. Measured 4.53:1 -> 6.18:1 on all six consumers.
           The ring is deliberately NOT changed here and stays blue-500: it is
           non-text UI at a 3:1 bar, it passes, and moving it would mean naming a
           blue-600 border role that does not exist. See the plan's backlog. */
        --button-tertiary-text-default: var(--color-text-brand);
        --button-tertiary-border-default: var(--color-border-brand);
        --button-tertiary-background-hover: var(--color-surface-info);
        --button-tertiary-text-hover: var(--color-text-brand);
        --button-tertiary-border-hover: var(--color-action-primary-hover);
        --button-tertiary-background-active: var(--color-action-primary);
        --button-tertiary-text-active: var(--color-brand-on-fill);

        /* ghost: dark outline */
        --button-ghost-text-default: var(--color-text-primary);
        --button-ghost-border-default: var(--color-border-strong);
        --button-ghost-background-hover: var(--color-surface-muted);
        --button-ghost-text-hover: var(--color-text-primary);
        --button-ghost-background-active: var(--color-action-secondary);
        --button-ghost-text-active: var(--color-action-on-fill);

        /* accent: red fill. This system's conversion colour — Buy now and the
           like — not a danger signal; there is deliberately no danger variant.
           red-600, not red-500: white on red-500 measures 4.00:1 and fails. */
        --button-accent-background-default: var(--color-action-accent);
        --button-accent-background-hover: var(--color-action-accent-hover);
        --button-accent-background-active: var(--color-action-accent-active);
        --button-accent-text-default: var(--color-action-on-fill);
        --button-accent-ring-default: transparent;

        /* white and outline-white: fixed presets for a solid-colour banner,
           where even a surface="dark" primary would sit too close in tone.
           They ignore surface on purpose.

           text-default is blue-600 rather than blue-500: white is the fill
           here, and blue-500 on white is 4.53:1 — the marginal step the
           contrast note warns against for text.

           The translucent whites were rgba(255,255,255,…) and #ffffff8c
           literals, which no theme could reach. color-mix keeps the alpha and
           puts the colour back on the palette. */
        --button-white-background-default: var(--color-neutral-0);
        --button-white-background-hover: var(--color-brand-50);
        --button-white-background-active: var(--color-brand-100);
        /* A ramp step by name (--color-brand-600), not --color-text-brand. The
           preset is fixed -- a white fill on a brand band, in any theme -- so
           its ink must be fixed too. Reading the role mixed a fill that never
           switches with a label that does: text-brand goes light in a dark
           theme and measured 2.36:1 on the white fill (dark mode finding 8).

           The ramp keeps that property and still follows the business line: a
           step never flips with light or dark, but it is the brand's step, so
           the label matches the band it sits on under every brand. It was
           --color-blue-600 when blue was the only brand. */
        --button-white-text-default: var(--color-brand-600);

        --button-outline-white-text-default: var(--color-brand-on-fill);
        /* 71% rather than 55%. This edge is the only thing bounding an
           outline-white button, so it carries the 3:1 of WCAG 1.4.11 on its
           own. Measured over the grounds the preset is actually used on, 55%
           gave 2.34 on blue-500 and 2.90 on blue-600 and only cleared on
           blue-700 at 3.65. 71% is the lowest value that clears all three
           with one number, so the token stops depending on which blue is
           behind it. */
        --button-outline-white-border-default: color-mix(in srgb, var(--color-brand-on-fill) 71%, transparent);
        /* Hover and press DARKEN the band, they do not wash it white. A white
           wash lightened the blue under a white label: 3.91:1 on hover and
           3.38 pressed over blue-500, and 4.22 pressed over blue-600 -- under
           the 4.5 the label needs. 10% and 20% black take blue-500 to 5.40
           and 6.49 and give the 71% edge more ground (3.46 and 4.03); every
           ground the preset sits on now clears, the CTA gradient included.
           Darker on hover is also what every filled button already does.
           .
           The trade-off, chosen knowingly: on the navy end of the CTA
           gradient (#061a5c) darkening barely shows, a 1.05 step where the
           white wash gave 1.31. The label is what must pass; the hover there
           is carried by the cursor. A white wash cannot work on blue-500 at
           all, where the label clears 4.5 at rest by 0.03. */
        --button-outline-white-background-hover: color-mix(in srgb, var(--color-neutral-1000) 10%, transparent);
        --button-outline-white-background-active: color-mix(in srgb, var(--color-neutral-1000) 20%, transparent);

        /* Shared across every variant. Filled kinds go grey; outlined ones keep
           a transparent fill and take the subtle border. Contrast is exempt
           here under WCAG 1.4.3.

           borderColor is --color-border-disabled: the role named for the state
           it expresses, and the one disabled-edge value the whole control
           family now shares. It read neutral-300 once, then moved to
           neutral-200 to match what the component drew; bd-checkbox and
           bd-radio have since moved to neutral-300, so token and component
           agree again -- a step darker, 2.27:1 against the page where
           neutral-200 gave 1.66, and still lighter than any enabled edge. */
        --button-disabled-backgroundColor: var(--color-surface-disabled);
        --button-disabled-borderColor: var(--color-border-disabled);
        --button-disabled-color: var(--color-text-subtle);

        /* ================================
             COMPONENT TOKENS - ANNOTATION
             ================================ */

        /* Footnote Tokens */
        --footnote-reference-fontSize: 0.75em;
        --footnote-reference-fontWeight: var(--typography-fontWeight-normal);
        --footnote-reference-lineHeight: 1;
        --footnote-reference-verticalAlign: super;
        --footnote-reference-color: inherit;
        --footnote-reference-marginLeft: 0.1em;
        --footnote-reference-marginRight: 0.2em;

        /* Citation Tokens */
        --citation-reference-fontSize: inherit;
        --citation-reference-fontWeight: var(--typography-fontWeight-normal);
        --citation-reference-lineHeight: inherit;
        --citation-reference-color: var(--color-text-brand);
        --citation-reference-textDecoration: underline;
        --citation-reference-hover-color: var(--color-text-brand-hover);
        --citation-reference-hover-textDecoration: none;

        /* Mathematical Notation Tokens */
        --math-superscript-fontSize: 0.75em;
        --math-superscript-fontWeight: var(--typography-fontWeight-normal);
        --math-superscript-lineHeight: 1;
        --math-superscript-verticalAlign: super;
        --math-superscript-marginLeft: 0.05em;

        --math-subscript-fontSize: 0.75em;
        --math-subscript-fontWeight: var(--typography-fontWeight-normal);
        --math-subscript-lineHeight: 1;
        --math-subscript-verticalAlign: sub;
        --math-subscript-marginLeft: 0.05em;

        /* ================================
             COMPONENT TOKENS - ICON
             ================================ */

        /* Icon Size Tokens */
        --icon-xs-size: var(--dimension-12);
        --icon-sm-size: var(--dimension-16);
        --icon-md-size: var(--dimension-20);
        --icon-lg-size: var(--dimension-24);
        --icon-xl-size: var(--dimension-32);
        --icon-2xl-size: var(--dimension-48);
        --icon-3xl-size: var(--dimension-64);

        /* The context aliases (--icon-button-*, --icon-form-*) and the ten
           --icon-*-color tokens were removed when the icon elements moved onto
           the size scale and currentColor. The aliases said the same thing as a
           step — --icon-button-small-size and --icon-sm-size were both 16px —
           and the colours described states an icon no longer has: it takes the
           colour of the text it sits in, so there is nothing per-state to keep
           in step. */

        /* ================================
             CORE SPACING TOKENS
             ================================ */
             
        --spacing-0: 0;
        --spacing-1: 0.0625rem; /* 1px */
        --spacing-2: 0.125rem; /* 2px */
        --spacing-4: 0.25rem; /* 4px */
        --spacing-6: 0.375rem; /* 6px */
        --spacing-8: 0.5rem; /* 8px */
        --spacing-10: 0.625rem; /* 10px */
        --spacing-12: 0.75rem; /* 12px */
        --spacing-14: 0.875rem; /* 14px */
        --spacing-16: 1rem; /* 16px */
        --spacing-18: 1.125rem; /* 18px */
        --spacing-20: 1.25rem; /* 20px */
        --spacing-22: 1.375rem; /* 22px */
        --spacing-24: 1.5rem; /* 24px */
        --spacing-28: 1.75rem; /* 28px */
        --spacing-32: 2rem; /* 32px */
        --spacing-36: 2.25rem; /* 36px */
        --spacing-40: 2.5rem; /* 40px */
        --spacing-44: 2.75rem; /* 44px */
        --spacing-48: 3rem; /* 48px */
        --spacing-52: 3.25rem; /* 52px */
        --spacing-56: 3.5rem; /* 56px */
        --spacing-64: 4rem; /* 64px */
        --spacing-80: 5rem; /* 80px */
        --spacing-96: 6rem; /* 96px */
        --spacing-112: 7rem; /* 112px */
        --spacing-128: 8rem; /* 128px */

        /* The OLD VALUES block stood here: --display-*, --heading-*, --body-* and
           --caption-* as pixel font sizes, and a second spacing vocabulary in
           --space-*, --padding-*, --container-*, --inset-*, --stack-* and
           --inline-*. Forty-nine tokens, every one a duplicate of something on
           a live scale under a different name, and not one of them referenced
           by any component. They are gone. Type comes from
           --typography-fontSize-* and the component type tokens above it;
           spacing comes from --spacing-*. */

        /* Accessibility Spacing Tokens
        -----------------------------------------------*/
        /* Touch Target Sizes - WCAG 2.1 Success Criterion 2.5.5 (AAA) and 2.5.8 (AA) */
        /* The dimension steps that carry these values, rather than px
           literals beside them: a target is matched to a finger, not to the
           reader's text size, so it is px, which --dimension-* is. */
        --touch-target-size: var(--dimension-44); /* Minimum touch target size (44px × 44px) */
        --touch-target-spacing: var(--dimension-8); /* Minimum space between touch targets */

        /* Readable Line Lengths - For optimal readability */
        --content-width-readable: 70ch; /* Approximately 70 characters per line */
        --content-width-max: 1200px; /* Maximum overall content width */

        /** GRID AND BREAKPOINT TOKENS

           The breakpoint tokens have no consumer in this package and are kept
           deliberately. A media condition cannot read a custom property — @media
           (max-width: var(--breakpoint-sm)) is not valid CSS — so a breakpoint
           token can never be referenced the way a colour is. It exists so the
           seven values have one place to be read from, by the lint that checks
           media queries against them and by anything generating CSS. The grid
           tokens below are read: --grid-container-max-* and --grid-padding-*
           are the page column, through shared/ensemble.css.js and layout.css,
           and the header and compare read them too. --grid-gutter-* has no
           reader outside the blog's own token copy, and carries the same
           values as --grid-padding-*.

           The breakpoints are the exception. Everything else here that nothing
           references is dead weight, and the OLD VALUES and FONT TOKENS blocks
           that used to sit below were removed for exactly that reason.
         */
        /* Grid container max widths

           The top two steps are set by the site's menu and footer, not by the
           grid's own progression: a page built from these modules sits between
           the two, so its content edges have to land on theirs. Measured on
           bitdefender.com on 2026-10-16, the menu and footer share one container
           whose content is 1200px wide from 1300 to 1599 (1300 max, 50px gutter)
           and 1292px from 1600 up (1332 max, 20px gutter). The column keeps its
           own 40px gutter, so each cap is that content plus 80: xxl 1280 gives
           1200 and xxxl 1372 gives 1292. xxl was 1320, a 1240 column that sat
           20px outside the menu's edges at 1440 and 26px inside them at 1920. */
        --grid-container-max-xs: 100%; /* mobile full width */
        --grid-container-max-sm: 540px;
        --grid-container-max-md: 720px;
        --grid-container-max-lg: 960px;
        --grid-container-max-xl: 1140px;
        --grid-container-max-xxl: 1280px;
        --grid-container-max-xxxl: 1372px;

        /* Column count (usually 12) */
        --grid-columns: 12;

        /* Gutter spacing between columns */
        --grid-gutter-xs: 16px;
        --grid-gutter-sm: 24px;
        --grid-gutter-md: 32px;
        --grid-gutter-lg: 40px;

        /* Container padding (horizontal spacing) */
        --grid-padding-xs: 16px;
        --grid-padding-sm: 24px;
        --grid-padding-md: 32px;
        --grid-padding-lg: 40px;

        /* Breakpoints */
        --breakpoint-xs: 0px;
        --breakpoint-sm: 576px;
        --breakpoint-md: 768px;
        --breakpoint-lg: 992px;
        --breakpoint-xl: 1200px;
        --breakpoint-xxl: 1400px;
        --breakpoint-xxxl: 1600px; /* the site menu and footer widen here */
        /* =====================
            FONT-FACE DEFINITIONS
            Intentionally NOT here. @font-face nested inside a :host rule is
            discarded at parse time, and even at the top level of a shadow-root
            stylesheet it never reaches document.fonts. Font faces must be
            loaded in document scope: see src/tokens/fonts.css.
        ====================== */

        /* The FONT TOKENS block stood here: --font-weight-mono-*,
           --font-weight-sans-*, --font-style-mono-* and --font-style-sans-*.
           Thirteen tokens duplicating --typography-fontWeight-* under a second
           name, with regular where the live scale says normal, and nothing
           consuming any of them. --font-family-mono went earlier, with bd-li.
           A weight is a weight whichever face it is set in. */

        /* Awards section — Orbit Frame 14 (node 1882:9342) */
        --layout-awards-section-background: var(--color-brand-50);
        --layout-awards-cluster-max-width: 49.5625rem; /* 793px — trust banner column */
        --layout-awards-intro-max-width: 39.4375rem; /* 631px — headline stack */
        /* The page column has no width token of its own. --content-width-max,
           above, is a 1200px cap that no component reads; only the blog's own
           token copy aliases it. The page column is an implementation --
           src/components/shared/ensemble.css.js -- on the grid container scale
           above (--grid-container-max-* with --grid-padding-*), which is what
           Foundations/Grid System documented and nothing had built. A width token
           here is how six ensembles came to hold one literal each and seven other
           modules a different one. --layout-ensemble-inline-padding went the
           same way once bd-features, its last reader, stopped padding its host;
           the blog declares its own copy. */

    `,p=`bd-tokens`,m=`__bdDesignTokens`;function h(){if(typeof document>`u`)return;let e=`@layer ${p} { :root {${f}} ${d(f,r,i,n)} }`;if(`adoptedStyleSheets`in document&&typeof CSSStyleSheet==`function`){if(document.adoptedStyleSheets.some(e=>e[m]))return;try{let t=new CSSStyleSheet;t.replaceSync(e),t[m]=!0,document.adoptedStyleSheets=[...document.adoptedStyleSheets,t];return}catch{}}if(document.querySelector(`style[data-${p}]`))return;let t=document.createElement(`style`);t.setAttribute(`data-${p}`,``),t.textContent=e,document.head.appendChild(t)}h();var g=e``;export{g as t};