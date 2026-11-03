import{a as e,n as t,t as n,u as r}from"../../../../../lit/index.js";import{n as i}from"../../../../../lit/decorators.js";import{n as a,t as o}from"../../_bundled/oxc-project_runtime/helpers/esm/decorate.js";import"../../tokens/tokens.js";import"../heading/heading.js";import"../shared/token-scales.js";import"../paragraph/paragraph.js";import{t as s}from"../shared/ensemble.css.js";var c=r`:host{font-family:var(--typography-fontFamily-sans);display:block}:host([background=blue]){background:var(--status-brand-surface)}:host([variant=light][background=bordered]){border:var(--border-width-1) solid var(--color-border-container);border-radius:var(--shape-radius-xl);padding:var(--spacing-24);box-sizing:border-box;transition:transform var(--transition-duration-normal) var(--transition-easing-ease), box-shadow var(--transition-duration-normal) var(--transition-easing-ease), border-color var(--transition-duration-normal) var(--transition-easing-ease);display:block}:host([variant=light][background=bordered]:hover){transform:translateY(calc(-1 * var(--spacing-4)));box-shadow:var(--shadow-lg);border-color:var(--color-border-subtle)}@media (prefers-reduced-motion:reduce){:host([variant=light][background=bordered]){transition:none}}:host([variant=light][background=bordered]) .bd-compattable-wrapper{padding:var(--spacing-0)}.bd-compattable-wrapper{padding-block:var(--spacing-48) var(--spacing-0);box-sizing:border-box}.bd-compattable-title{margin:0 0 var(--spacing-12);display:block}.bd-compattable-description{margin:0 0 var(--spacing-32);color:var(--color-text-muted);max-width:var(--content-width-readable);display:block}.bd-compattable-table-container{background:var(--color-surface-default);border:var(--border-width-1) solid var(--color-border-container);border-radius:var(--shape-radius-xl);box-sizing:border-box;width:100%;overflow:hidden}.bd-compattable-table{border-collapse:collapse;table-layout:fixed;width:100%}.bd-compattable-table col:first-child{width:28%}.bd-compattable-table col:nth-child(2){width:24%}.bd-compattable-table col:nth-child(3){width:48%}:host([variant=outcome]) .bd-compattable-table col:first-child{width:27.2727%}:host([variant=outcome]) .bd-compattable-table col:nth-child(2),:host([variant=outcome]) .bd-compattable-table col:nth-child(3){width:36.3636%}:host([variant=risk]) .bd-compattable-table col:first-child{width:38.4615%}:host([variant=risk]) .bd-compattable-table col:nth-child(2){width:61.5385%}.bd-compattable-header{background:var(--color-surface-subtle);border-bottom:var(--border-width-1) solid var(--color-border-subtle)}th{text-align:start}.bd-compattable-header-cell{padding:var(--spacing-16) var(--spacing-24);color:var(--color-text-secondary);font-family:var(--typography-fontFamily-mono);font-size:var(--typography-fontSize-sm);line-height:var(--typography-lineHeight-tight);text-transform:uppercase;letter-spacing:.06em;font-weight:var(--typography-fontWeight-semibold)}:host([variant=outcome]) .bd-compattable-header-cell,:host([variant=risk]) .bd-compattable-header-cell{font-size:var(--typography-fontSize-xs);line-height:var(--typography-lineHeight-tight);color:var(--color-text-muted)}.bd-compattable-row{border-bottom:var(--border-width-1) solid var(--color-neutral-50)}.bd-compattable-row:last-child{border-bottom:none}.bd-compattable-cell{padding:var(--spacing-20) var(--spacing-24);vertical-align:middle;color:var(--color-text-secondary);font-size:var(--typography-fontSize-base);line-height:var(--typography-lineHeight-tight)}.bd-compattable-cell--environment{color:var(--color-text-primary);font-weight:var(--typography-fontWeight-semibold)}.bd-compattable-cell--notes{color:var(--color-text-secondary);gap:var(--spacing-8)}.bd-compattable-notes{align-items:center;gap:var(--spacing-8);display:flex}.bd-compattable-cell--event{color:var(--color-text-primary);font-weight:var(--typography-fontWeight-semibold)}.bd-compattable-cell--without{color:var(--status-error-text)}.bd-compattable-cell--with{color:var(--status-success-text)}.bd-compattable-cell--category{color:var(--color-text-primary);font-weight:var(--typography-fontWeight-semibold)}.bd-compattable-cell--riskcoverage{color:var(--color-brand-700)}.bd-compattable-lightgrid{width:100%;display:block}.bd-compattable-lightbody{grid-template-columns:repeat(var(--bd-compattable-light-columns,2), 1fr);column-gap:var(--spacing-48);row-gap:0;display:grid}.bd-compattable-lightrow:last-of-type{border-bottom:none}.bd-compattable-lightrow{justify-content:space-between;align-items:baseline;gap:var(--spacing-16);padding:var(--spacing-16) 0;border-bottom:var(--border-width-1) solid var(--color-border-container);display:flex}.bd-compattable-lightlabel,.bd-compattable-lightvalue{padding:0}.bd-compattable-lightlabel{color:var(--color-text-subtle);font-weight:inherit;font-size:var(--typography-fontSize-base);line-height:var(--typography-lineHeight-tight);flex-shrink:0}:host([background=blue]) .bd-compattable-lightlabel{color:var(--color-text-muted)}.bd-compattable-lightvalue{color:var(--color-text-primary);font-weight:var(--typography-fontWeight-semibold);line-height:var(--typography-lineHeight-tight);text-align:right}@media (width<768px){.bd-compattable-header{display:none}.bd-compattable-table,.bd-compattable-body{display:block}.bd-compattable-row{padding:var(--spacing-16) var(--spacing-20);gap:var(--spacing-4);grid-template-columns:1fr;display:grid}.bd-compattable-cell{padding:var(--spacing-4) 0;align-items:center;display:flex}.bd-compattable-cell--coverage:before,.bd-compattable-cell--notes:before,.bd-compattable-cell--without:before,.bd-compattable-cell--with:before,.bd-compattable-cell--riskcoverage:before{content:var(--bd-cell-label,"");color:var(--color-text-subtle);font-size:var(--typography-fontSize-xs);line-height:var(--typography-lineHeight-tight);text-transform:uppercase}.bd-compattable-lightbody{grid-template-columns:1fr}.bd-compattable-lightrow{align-items:flex-start;gap:var(--spacing-4);flex-direction:column}.bd-compattable-lightvalue{text-align:left}.bd-compattable-wrapper{padding:var(--spacing-32) var(--spacing-24)}}`,l=class extends n{constructor(...e){super(...e),this.title=``,this.description=``,this.variant=`default`,this.background=`default`,this.lightColumns=2,this.columns=null,this.rows=[]}static{this.styles=[s,c]}_defaultColumns(){return this.columns?this.columns:this.variant===`outcome`?[`Agent event`,`Without AI Guardian`,`With AI Guardian`]:this.variant===`risk`?[`Risk category`,`AI Guardian coverage`]:this.variant===`light`?null:[`Environment`,`Coverage`,`Notes`]}_cellLabel(e){let n=this._defaultColumns()?.[e];return n?`--bd-cell-label: "${String(n).replace(/["\\]/g,``)}: "`:t}_renderRow(t){return this.variant===`outcome`?e`
        <tr class="bd-compattable-row">
          <th class="bd-compattable-cell bd-compattable-cell--event" scope="row">${t.event}</th>
          <td class="bd-compattable-cell bd-compattable-cell--without" style=${this._cellLabel(1)}>${t.without}</td>
          <td class="bd-compattable-cell bd-compattable-cell--with" style=${this._cellLabel(2)}>${t.with}</td>
        </tr>
      `:this.variant===`risk`?e`
        <tr class="bd-compattable-row">
          <th class="bd-compattable-cell bd-compattable-cell--category" scope="row">${t.category}</th>
          <td class="bd-compattable-cell bd-compattable-cell--riskcoverage" style=${this._cellLabel(1)}>${t.coverage}</td>
        </tr>
      `:this.variant===`light`?e`
        <tr class="bd-compattable-lightrow">
          <th class="bd-compattable-lightlabel" scope="row">${t.label}</th>
          <td class="bd-compattable-lightvalue">${t.value}</td>
        </tr>
      `:e`
      <tr class="bd-compattable-row">
        <th class="bd-compattable-cell bd-compattable-cell--environment" scope="row">${t.environment}</th>
        <td class="bd-compattable-cell bd-compattable-cell--coverage" style=${this._cellLabel(1)}>${t.coverage}</td>
        <td class="bd-compattable-cell bd-compattable-cell--notes" style=${this._cellLabel(2)}><span class="bd-compattable-notes">${t.notes}</span></td>
      </tr>
    `}render(){let n=this._defaultColumns();return e`
      <div class="bd-ensemble bd-compattable-wrapper">
        ${this.title?e`
              <bd-h as="h2" class="bd-compattable-title">
                <slot name="title">${this.title}</slot>
              </bd-h>
            `:t}

        ${this.description?e`
              <bd-p variant="large" class="bd-compattable-description" color="muted">
                <slot name="description">${this.description}</slot>
              </bd-p>
            `:t}

        ${this.variant===`light`?e`
              <table
                class="bd-compattable-lightgrid"
                style="--bd-compattable-light-columns: ${this.lightColumns};"
              >
                <tbody class="bd-compattable-lightbody">
                  ${this.rows.map(e=>this._renderRow(e))}
                </tbody>
              </table>
              <slot name="rows"></slot>
            `:e`
              <div class="bd-compattable-table-container">
                <table class="bd-compattable-table">
                  <colgroup>${n.map(()=>e`<col>`)}</colgroup>
                  <thead class="bd-compattable-header">
                    <tr>
                      ${n.map(t=>e`<th class="bd-compattable-header-cell" scope="col">${t}</th>`)}
                    </tr>
                  </thead>
                  <tbody class="bd-compattable-body">
                    ${this.rows.map(e=>this._renderRow(e))}
                  </tbody>
                </table>
                <!-- after the table, inside the card: a slotted element
                     cannot become a row of a native table -->
                <slot name="rows"></slot>
              </div>
            `}
      </div>
    `}};o([i({type:String})],l.prototype,`title`,void 0),o([i({type:String})],l.prototype,`description`,void 0),o([i({type:String,reflect:!0})],l.prototype,`variant`,void 0),o([i({type:String,reflect:!0})],l.prototype,`background`,void 0),o([i({type:Number,attribute:`light-columns`})],l.prototype,`lightColumns`,void 0),o([i({type:Array})],l.prototype,`columns`,void 0),o([i({type:Array})],l.prototype,`rows`,void 0),l=o([a(`bd-compatibility-table`)],l);