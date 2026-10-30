import{c as e,i as t,n,t as r}from"./lit.js";import"./repobit-dex-system-design.js";var i=e`
  @layer bd-components {
    .bd-img {
      display: block;
      max-width: 100%;
      height: auto;
    }

    /* Object Fit Variants */
    .bd-img.cover {
      object-fit: cover;
    }

    .bd-img.contain {
      object-fit: contain;
    }

    .bd-img.fill {
      object-fit: fill;
    }

    .bd-img.none {
      object-fit: none;
    }

    .bd-img.scale-down {
      object-fit: scale-down;
    }

    /* Radius Variants - Updated to match radius prop */
    .bd-img.radius-none {
      border-radius: var(--radius-none);
    }

    .bd-img.radius-sm {
      border-radius: var(--shape-radius-sm);
    }

    .bd-img.radius-md {
      border-radius: var(--shape-radius-md);
    }

    .bd-img.radius-lg {
      border-radius: var(--shape-radius-lg);
    }

    .bd-img.radius-xl {
      border-radius: var(--shape-radius-xl);
    }

    .bd-img.radius-2xl {
      border-radius: var(--shape-radius-2xl);
    }

    .bd-img.radius-3xl {
      border-radius: var(--shape-radius-3xl);
    }

    .bd-img.radius-full {
      border-radius: var(--radius-full);
    }

    /* Shadow Variants - Updated to match shadow prop */
    .bd-img.shadow-none {
      box-shadow: none;
    }

    .bd-img.shadow-sm {
      box-shadow: var(--shadow-sm);
    }

    .bd-img.shadow-md {
      box-shadow: var(--shadow-md);
    }

    .bd-img.shadow-lg {
      box-shadow: var(--shadow-lg);
    }

    /* Shadow XL - Additional variant */
    .bd-img.shadow-xl {
      box-shadow: var(--shadow-xl);
    }

    /* Gone from here, because nothing could reach them: bordered,
       bordered-primary and bordered-thick, responsive, aspect-16-9 / 4-3 /
       1-1, hover-zoom and hover-shadow had no prop, and the only way to set
       one was to pass its name as fit, which now accepts only the five values
       above. :focus-visible styled an <img>, which never takes focus. And the
       :not([src]) loading placeholder could not appear: the template always
       writes a src attribute, and an <img> renders no ::before even without
       one. bd-picture keeps its own placeholder, which does work. */

    /* Smooth transitions for radius and shadow changes */
    .bd-img {
      transition: border-radius var(--transition-duration-normal) var(--transition-easing-smooth), box-shadow var(--transition-duration-normal) var(--transition-easing-smooth);
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-img {
        transition: none;
      }
    }
  }
`,a=[`none`,`sm`,`md`,`lg`,`xl`,`2xl`,`3xl`,`full`],o=[`cover`,`contain`,`fill`,`none`,`scale-down`],s=[`none`,`sm`,`md`,`lg`,`xl`],c=class extends r{static properties={src:{type:String},srcset:{type:String},sizes:{type:String},alt:{type:String},width:{type:Number},height:{type:Number},loading:{type:String},fetchPriority:{type:String,attribute:`fetchpriority`},decoding:{type:String},fit:{type:String},radius:{type:String},shadow:{type:String}};constructor(){super(),this.src=``,this.srcset=``,this.sizes=``,this.alt=``,this.width=null,this.height=null,this.loading=`lazy`,this.fetchPriority=``,this.decoding=``,this.fit=`cover`,this.radius=`none`,this.shadow=`none`}render(){let e=`bd-img ${o.includes(this.fit)?this.fit:`cover`} ${`radius-${a.includes(this.radius)?this.radius:`none`}`} ${`shadow-${s.includes(this.shadow)?this.shadow:`none`}`}`,r=this.fetchPriority===`high`;return t`
      <img
        src="${this.src}"
        srcset="${this.srcset||n}"
        sizes="${this.sizes||n}"
        alt="${this.alt}"
        width="${this.width??n}"
        height="${this.height??n}"
        loading="${r?n:this.loading}"
        fetchpriority="${this.fetchPriority||n}"
        decoding="${this.decoding||n}"
        class="${e}"
        @load="${this._handleLoad}"
        @error="${this._handleError}"
      />
    `}_handleLoad(){this.dispatchEvent(new CustomEvent(`image-loaded`,{bubbles:!0,composed:!0}))}_handleError(){this.dispatchEvent(new CustomEvent(`image-error`,{bubbles:!0,composed:!0}))}static styles=[i]};customElements.define(`bd-img`,c);export{c as t};