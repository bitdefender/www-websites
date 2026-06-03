# EDS Block Authoring Rules

Row structures for blocks used on Bitdefender EDS pages.
Row 0 of every block table is always the lime-green header (removed from DOM by EDS).
Row indices below start at **1** (the first content row).

---

## General Block Table Pattern

```
| <block-name>             |   ← row 0: lime green, bold, col-spanned
| content row 1            |   ← row 1
| content row 2 (optional) |   ← row 2
```

After the block table, add an **empty paragraph**, then the Section Metadata table (if needed), then `---`.

---

## `hero`

**2-row table** — header + one single content cell. The image and all text go in the same cell, image first.

```
| hero                              |   row 0: header (1 col, merged)
| [image]                           |   row 1: single content cell — order matters:
|   H1 title (Heading 1 style)      |     1. picture (MUST precede h1 — hero.js splits into 2-col layout)
|   platform tags (normal para)     |     2. H1 — Heading 1 style required
|   trial/primary CTA link          |     3. platform tags paragraph
|   H2 subtitle (Heading 2 style)   |     4. primary CTA link (rendered as button)
|   description paragraph           |     5. H2 subtitle — Heading 2 style
|   secondary CTA link              |     6. description paragraph
|   {Discount}                      |     7. secondary CTA link
|   • bullet …                      |     8. {Discount} nanoblock — just the literal text {Discount}
|   * footnote (optional)           |     9. bullet list (List Paragraph style — Franklin requires this to recognise list items)
|                                   |    10. footnote paragraph (optional)
```

> `hero.js` detects that the picture precedes the `<h1>` and moves the picture into a `.hero-picture` div,
> splitting the section into a two-column image + text layout.

**Section Metadata** (same section) — key names are capitalized as shown:

| Discount     | product-store-id (e.g. `ts_i/5/1`)  | resolves live discount % via store |
| Signature    | `Trusted. Always.`                  | tagline prepended above breadcrumb |
| Label        | `Discount`                          | text label on the discount badge   |
| Europe_badge | `Made in Europe` (optional)         | Europe provenance badge text       |

> The `{Discount}` nanoblock in the content cell is the **literal string `{Discount}`** — no inline product ID.
> The product ID comes from the `Discount` Section Metadata key.

---

## `hero-aem`

**2-4 row table** — header + richText row + desktop image row + optional card rows. Rows 1 and 2 are styled side-by-side (left text, right image) at `md` breakpoint via CSS `col-md-6`.

```
| hero-aem()                                               |   row 0: header (lime green, 1 col)
| H1 heading                                               |   row 1: richText (block.children[0]) — single cell:
|   <picture> mobile hero image                            |     1. H1 heading (bold/strong)
|   *Compare Plan A*  *Compare Plan B*   ← italic = button |     2. mobile hero image in <p><picture> (optional)
|   <picture>award1<picture>award2...                      |     3. italic CTA links — *link text* in Word → <em><a> → rendered as action buttons
|                                                          |     4. award logo images — multiple <picture> in one <p> (optional)
| <picture> desktop hero image                             |   row 2: mainDesktopImage (block.children[1]) — single cell, one <picture>
| [Optional card text]                                     |   row 3: richTextCard (block.children[2]) — single cell, text/rich content (optional, only with row 4)
| Card col 1 | Card col 2 | [Card col 3]                  |   row 4: columnsCard (block.children[3]) — 2–3 cells, rendered as aem-two-cards (optional, requires row 3)
```

**Authoring rules:**
1. **CTA links** in row 1 must be italic (`*Link text*` in Word → `<em><a>` → rendered as buttons). Non-italic links are plain hyperlinks.
2. **Mobile image** (row 1) and **desktop image** (row 2) are often the same image. Row 1 image becomes `.hero-aem__mobile-image`; row 2 image becomes `.hero-aem__desktop-image`.
3. **Rows 3 & 4** must be used together — row 3 provides the side-text label and row 4 the card cells. Each cell of row 4 becomes one `aem-two-cards_card` div.
4. **Buy link** (row 1): a link whose `href` contains `buylink` — required when `product` Section Metadata is set.
5. **Free download link** (row 1): a link whose `href` contains `#free-download` — triggers OS detection if OS metadata keys are set.
6. **Nanoblocks** inside row 1 (optional): `benefit_list` table, `ratings` table, `breadcrumb` table, `dropdown` paragraph (`{dropdown,...}` literal text).

**Section Metadata** (same section, sets `data-*` attributes on the section wrapper):

| Section Metadata key | Example value | Effect |
|---|---|---|
| `style` | `py-0, v2` or `py-0, hide-image-mobile` | CSS classes on the section (space becomes hyphen) |
| `product` | `ts_i/5/1` (`prodName/users/years`) | Enables store context + price box before buy link |
| `condition-text` | `* condition applies` | Text below the new price (`<sup>` element) |
| `save-text` | `Save` | Label before the discount value in the price box |
| `blue-pill-text` | `Limited offer` | Pill text above the old price |
| `under-price-text` | `per year` | Text below the price box |
| `align-content` | `center` | Centers the richText column (adds `--center` modifier) |
| `height` | `600` | Sets `max-height` in px on each block row |
| `type` | `dark` | CSS class added to the containing section |
| `circle-discount` | `Up to 0% OFF` | Circular badge on desktop image; `0%` → `{GLOBAL_BIGGEST_DISCOUNT_PERCENTAGE}` |
| `dropdown-products` | `ts_i/5/1, ts_i/10/1` | Comma-separated product IDs for the custom dropdown |
| `dropdown-tag` | `Best value` | Label tag shown above the dropdown |

> **Note on `product` format**: `prodName/users/years` — e.g., `av/1/1` = Antivirus, 1 user, 1 year. This sets `data-store-context` on the card wrapper div.

---

## `big-teaser-section`

```
| big-teaser-section |   row 0: header (lime green)
| rich text          |   row 1: one or more text paragraphs (and/or headings); full-width single column
| [overlay image]    |   row 2: picture element shown on top of the background (optional — omit row if not needed)
```

- Row 1 maps to `block.children[0]` (`richTextEl`) in JS — accepts any rich text content.
- Row 2 maps to `block.children[1]` (`imageOnTopEl`) — JS reads `imageOnTopEl?.querySelector('picture')`, optional.
- Background images come from **Section Metadata** in the same section. The JS reads `section.dataset.desktopPicture` / `section.dataset.mobilePicture` via `getDatasetFromSection`. Author them as rows inside the section's Section Metadata table:
  ```
  | Section Metadata |         |
  | desktop-picture  | [image] |
  | mobile-picture   | [image] |
  ```
- Verified via Word Online across 5 locales (`de-de`, `en-us`, `it-it`, `sv-se`, `nl-nl`) — all `trusted/index.docx`. Consistent 2-result pattern (normal + reverted variant). Row 1 contains text paragraphs (sometimes a heading + paragraph, sometimes plain paragraphs). Row 2 (overlay image) was not present in any verified instance.

Variants: `big-teaser-section (reverted)` — reverses image/text layout (text-right on desktop).

---

## `sticky-navigation`

```
| sticky-navigation  |   row 0: header
| CTA link(s)        |   row 1: one paragraph per link
```

No Section Metadata needed.

---

## `new-prod-boxes(smallerbuttons)`

Outer table (1 column) + one nested card table per content row.

```
| new-prod-boxes(smallerbuttons)  |   row 0: header (merged)
| [nested card table — Card 1]    |   row 1
| [nested card table — Card 2]    |   row 2
| [nested card table — Card 3]    |   row 3 (optional)
```

**Card inner table** (10 rows × 2 cols):

| Row | Merged? | Content |
|-----|---------|---------|
| 0 | yes | Promo/upsell tag text (e.g. `Includes Bitdefender Premium VPN`) or empty |
| 1 | yes | Product name — run 1: `Bitdefender` + `WD_BREAK.LINE` + run 2: plan name (e.g. `Total Security`) |
| 2 | yes | Audience tag — icon token + label, e.g. `:user-sharp-regular: Individual` |
| 3 | yes | Subtitle — devices/accounts, e.g. `1 account - 5 devices` |
| 4 | **no** | col 0: `Yearly [checked]` — col 1: `2 Years` |
| 5 | yes | Empty — JS fills in the per-price from store |
| 6 | **no** | col 0: yearly billing text — col 1: 2-year billing text (each as a single paragraph) |
| 7 | yes | Buy button — hyperlink `Buy Now` → store buy link |
| 8 | yes | Empty (or optional under-buy note) |
| 9 | yes | Feature category sub-tables (one per category, appended directly into cell XML) |

> Rows 0–3 and 5–9 are merged across both columns. Row 4 and Row 6 are **NOT merged**.

**Feature category sub-table** (inside row 9 cell — **2 columns**):

```
| Category Name (bold)     |                              |   row 0: merged header, bold
| Feature name / pill text | Description text (optional)  |   row 1
| Feature name / pill text | Description text (optional)  |   row 2
```

- One **separate** sub-table per feature category (Device Security, Privacy, Identity Protection, etc.)
- Row 0 is merged across both columns, bold text = category name
- Feature rows are 2-column: left = feature name (may include `?pill Nx :icon:` tokens), right = description
- Right cell may be empty if there is no description for that feature
- Append each sub-table directly into the row-9 cell XML: `tc.append(tbl._tbl)` (do NOT use `move_table_into_cell`)

**`?pill` token syntax** (rendered as blue pill badges in the UI):

```
Feature Name ?pill Nx :icon-name: Description line 2
```

Example: `Password Manager ?pill 1x :user-sharp-solid:` renders the feature name with a "1x 👤" pill badge.

**Section Metadata** (key names lowercase except product-ID rows):

| Key | Example value | Notes |
|-----|---------------|-------|
| `products` | `ts_i/5/1, ts_f/25/1` | Yearly product IDs shown in cards |
| `monthly-products` | `ts_i/5/2, ts_f/25/2` | Monthly product IDs |
| `ts_i/5/1 (Product Name)` | `USD 59.99` | Per-product full-price override (one row per product) |
| `style` | `width-medium` | Section width class — add as separate row |
| `style` | `py-0` | Section padding class — `style` key can appear **twice** |
| `save-text` | `Save` | Label for the discount badge on each card |
| `Sticky navigation item` | `Overview` | Label used by sticky-navigation block (capitalized as shown) |
| `id` | `products` | HTML id applied to the section (used for anchor links) |

---

## `Quote`

```
| Quote          |   row 0: header
| quote content  |   row 1: single cell with 3 paragraphs:
```

Row 1 cell paragraphs (in order):
1. Quote text — **normal** (not bold, not italic) — becomes `<p>` in DOM
2. Author — **bold** run — becomes `<p><strong>` in DOM
3. Stars placeholder — **italic space** (`p.add_run(' ').italic = True`) — prevents `quote.js` crash

> `quote.js` calls `stars.textContent` unconditionally. The italic run creates `<p><em> </em></p>`,
> giving `stars.textContent = ' '` → 0 asterisks → 0 stars rendered. Without it, the script throws.

---

## `Four Cards`

Each content row (rows 1–N) is one card. Cards are rendered in a grid, heights matched by JS.

```
| Four Cards           |   row 0: header
| [Card 1 content]     |   row 1
| [Card 2 content]     |   row 2
| [Card 3 content]     |   row 3
| [Card 4 content]     |   row 4
```

Each card cell typically contains:
- An `H3` paragraph (Heading 3 style) — card title
- A normal paragraph — card description
- Optional: image, link

---

## `Section Metadata` (standalone table)

Placed at the end of a section, **after an empty paragraph** and **before** `---`.

```
| Section Metadata     |   row 0: orange header (merged)
| key1  | value1       |   row 1
| key2  | value2       |   row 2
```

Common keys:
| Key | Example value | Effect |
|-----|---------------|--------|
| `style` | `pb-0` | Sets `data-style` attribute on the section `<div>` |
| `desktop-picture` | [image] | CSS background-image on desktop |
| `mobile-picture` | [image] | CSS background-image on mobile |
| `sticky-nav-name` | `Overview` | Label used by sticky-navigation block |
| `products` | `ts_i/5/1, ts_f/25/1` | Product IDs for new-prod-boxes |
| `monthly-products` | `ts_i/5/2, ts_f/25/2` | Monthly product IDs |
| `save-text` | `Save` | Label for discount badge |

---

## `Metadata` (page metadata, always last)

```
| Metadata       |   row 0: orange header (text = "Metadata", merged)
| title          | Page title for `<title>` tag        |
| description    | Meta description                    |
| template       | e.g. `product`                      |
```

No `add_separator(doc)` after this table.

---

## `accordion`

Each content row is one collapsible item. The block supports multiple variants.
Canonical reference: `sidekick/blocks/accordion.docx` (3 pages, 4 examples).

```
| Accordion (variant)  |   row 0: header (colored, merged) — variant classes in parentheses
| trigger / title      | expanded body content   |   row 1: first item
| trigger / title      | expanded body content   |   row 2: second item
| ...                  | ...                     |   row N: Nth item
```

**Columns per content row:**
- Left cell (col 0): item trigger — typically a **hyperlink** (linked text). Can be a topic title, question, or product name.
- Right cell (col 1): expanded body — rich text (paragraphs, bold, bullet lists, inline links)

**Classes can be combined** by listing them comma-separated in the header, e.g. `Accordion (system-requirements, first-open)`.

**Variants** (specified in the block header row, canonical reference):

| Variant header text | Header color | Use case | Left cell | Right cell |
|---|---|---|---|---|
| `Accordion (terms-of-use)` | Orange | Terms / legal topics | Hyperlinked topic title (e.g. "Auto renewal terms") | Bullet list |
| `Accordion (faq)` | Lime-green | FAQ section | Hyperlinked question | Multi-paragraph plain text (may include inline links) |
| `Accordion (system-requirements, first-open)` | Steel-blue | System requirements — first item pre-expanded | Hyperlinked product name | Bold section headings (SYSTEM REQUIREMENTS, SOFTWARE REQUIREMENTS) + plain text lines |
| `Accordion(action-only-on-header)` | White/none | Click only triggers on the header element | Plain text label | (body not shown in reference — minimal example) |
| `Accordion` | Any | Generic (no variant) | Trigger text | Rich text body |

Additional manifest-only classes (combine freely): `smaller-text`, `action-only-on-header`.

> `accordion.js` reads `block.querySelectorAll(':scope > div')` — each direct child div = one item.
> `item.children[0]` becomes the clickable header (`.accordion-item-header`, role="button").
> `item.children[1]` becomes the collapsible body (`.accordion-item-content`).
> If the right cell has no `<p>` tags, JS auto-wraps the content in a `<p>`.
> `first-open` class: first item is expanded on load.

No Section Metadata needed for accordion itself.

---

## Products Block

The `products` block is a **1-column table**. Each product card is a separate **row** (not a column). Content items within a row are separated by `---` paragraph separators inside the same cell.

**Nanoblock tokens** (placed inline in cell content, styled orange/NOTRANSLATE):
- `{Plans}` — renders the plan selector (configured via Section Metadata `Plans1`, `Plans2`, etc.)
- `{OldPrice}` — crossed-out original price
- `{Price}` — discounted price
- `{PriceCondition}` — billing text (e.g. "Billed X for first year"), supports `{BilledPrice}` token
- `{FeaturedSavings}` — savings badge (e.g. "Save {percent}")
- `{HighlightSavings}` — large highlighted savings banner (used as a standalone first row)
- `{Featured}` — featured label badge (text supplied by `Featured1`, `Featured2`... in Section Metadata) — placed IN the cell in "solutions" variant
- `{LowestPrice, productCode, variation, monthly, label text}` — placed OUTSIDE the table, in section default content BEFORE the Products table

> `{OldPrice}` and `{FeaturedSavings}` appear inside a **2-column inner table** within each product card cell.

---

### Variant A: `Products(plans)` — Full plan cards

Used for primary product plan selection pages (e.g. `/en-us/consumer/vpn`).

```
| LowestPrice nanoblock (standalone, before table, orange NOTRANSLATE): |
| {LowestPrice, vpn, 10u-1y, monthly, Start today for as low as 0/month} |
```

| Products(plans) |
| --- |
| {HighlightSavings} |
| **1-Year Plan** (h3) / --- / {Plans} / {FeaturedSavings} / {OldPrice} / {Price} / {PriceCondition} / [Buy Now](https:/#buylink) / 30-Day Money-Back Guarantee / Plus applicable sales tax. / See Terms of Use below. / INCLUDES: / • bullet1 / • bullet2 / ... |
| **1-Month Plan** (h3) / --- / {Plans} / {FeaturedSavings} / {OldPrice} / {Price} / {PriceCondition} / [Buy Now](https:/#buylink) / 30-Day Money-Back Guarantee / Plus applicable sales tax. / See Terms of Use below. / INCLUDES: / • bullet1 / ... |

**Section Metadata (plan config section that follows):**

| Section Metadata | |
| --- | --- |
| Sticky navigation item | Overview |
| style | light sky blue/wide/v2 |
| HighlightSavings1 | Best Value! Go Annual & Save {percent} |
| Plans1 | {[10, vpn, 10u-1y], 10} |
| OldPrice1 | (empty) |
| Price1 | ,monthly |
| PriceCondition1 | Billed {BilledPrice} for the first year |
| FeaturedSavings1 | Save,{percent} |
| Plans2 | {[10, vpn-monthly, 10u-1y], 10} |
| OldPrice2 | (empty) |
| Price2 | (empty) |
| PriceCondition2 | Billed {BilledPrice} for the first month |
| FeaturedSavings2 | Save,{percent} |
| vpn/10/1 | USD 34.99 |
| vpn-monthly/10/1 | USD 6.99 |
| id | products |

> **Discount section**: Immediately before the plan config Section Metadata, a separate Section Metadata block sets discount info: `Discount=vpn/10/1`, `Signature=Trusted. Always.`, `Label=Discount`.

---

### Variant B: `products (plans, compare)` — Competitor comparison table

Used to compare the product against free/competitor alternatives.

| products (plans, compare) |
| --- |
| What you get with / [Free VPNs](#) / --- / • No DNS leak protection / • Limited server locations / • Slow connections / • Ads and data logging / • No Kill Switch |
| Bitdefender / [Premium VPN](#) / {FeaturedSavings} / • bullet1 / • bullet2 / • bullet3 / • bullet4 / --- / :android: :windows: :mac: :ios: / Works on all major platforms / --- / {Plans} / {OldPrice} / {Price} / {PriceCondition} / [Get Bitdefender Premium VPN](https://...) |
| What you get with / [Other Premium VPNs](#) / --- / • bullet1 / • bullet2 / • bullet3 / • bullet4 / • bullet5 |

> The middle (Bitdefender) column is centered/highlighted. `{FeaturedSavings}` appears at the top of the cell (before bullet list), unlike other variants.

**Section Metadata:**

| Section Metadata | |
| --- | --- |
| style | centered |
| FeaturedSavings2 | Best Value! Go Annual & Save,{percent} |
| Plans2 | {[10, vpn, 10u-1y], 10} |
| PriceCondition2 | *For the first year |
| id | products |

---

### Variant C: `products (plans, right-column)` — Compact plan card (right column context)

Used inside a 2-column `Columns` layout alongside a feature list on the left.

| products (plans, right-column) |
| --- |
| {HighlightSavings} |
| **1-Year Plan** (h3) / --- / {Plans} / {FeaturedSavings} / {OldPrice} / {Price} / {PriceCondition} / [Buy Now](https:/#buylink) / --- / 30-Day Money-Back Guarantee / Plus applicable sales tax. / See Terms of Use below. |

> Only one plan card row (no monthly plan row).

**Section Metadata:**

| Section Metadata | |
| --- | --- |
| style | Full width, blue, circle, checked lists, two-columns |
| HighlightSavings1 | BEST VALUE! GO ANNUAL & SAVE,{percent} |
| PriceCondition1 | Billed {BilledPrice} for the first year |
| OldPrice1 | (empty) |
| Price1 | ,monthly |
| Plans1 | {[10, vpn, 10u-1y], 10} |
| FeaturedSavings1 | Save,{percent} |

---

### Variant D: `Products (compact, solutions)` — Compact product cards grid

Used for multi-product sections like "Device Security". Each card has a product name, device count / brief description, and pricing nanoblocks. No product image, no `{Featured}` token in the cell.

**Cell structure for each product row:**

```
Bitdefender (h3 line 1)
Antivirus Plus (h3 line 2)
**Protect up to 3 devices** (bold — device count)
---
Basic protection for **Windows**, macOS, **iOS** and **Android** (description — may have orange/link styling)
---
{Plans}
| {OldPrice} | {FeaturedSavings} |   ← 2-column inner table
{Price}
{PriceCondition}
**Plus** applicable sales tax
See [Terms of Use](https://...) below.
[Buy now](https:/#buylink)
[Learn more](https://...)
```

**Example: "Device Security" section (3 cards)**

| Products (compact, solutions) |
| --- |
| Bitdefender / Antivirus Plus / **Protect up to 3 devices** / --- / Basic protection for **Windows**, macOS, **iOS** and **Android** / --- / {Plans} / \| {OldPrice} \| {FeaturedSavings} \| / {Price} / {PriceCondition} / **Plus** applicable sales tax / See [Terms of Use](#) below. / [Buy now](https:/#buylink) / [Learn more](https://...) |
| Bitdefender / Mobile Security for iOS / 1 account / --- / Complete protection for your iPhone / --- / {Plans} / \| {OldPrice} \| {FeaturedSavings} \| / {Price} / {PriceCondition} / **Plus** applicable sales tax / See [Terms of Use](#) below. / [Buy now](https:/#buylink) / [Learn more](https://...) |
| Bitdefender / Mobile Security for Android / 1 account / --- / Complete protection for your Android smartphone / --- / {Plans} / \| {OldPrice} \| {FeaturedSavings} \| / {Price} / {PriceCondition} / **Plus** applicable sales tax / See [Terms of Use](#) below. / [Buy now](https:/#buylink) / [Learn more](https://...) |

**Section Metadata (Device Security):**

| Section Metadata | |
| --- | --- |
| Sticky navigation item | Device Security |
| Plans1 | {[ 3, avpm, 3u-1y], 3} |
| Plans2 | {[ 1, mobileios, 1u-1y], 1} |
| Plans3 | {[ 1, mobile, 1u-1y], 1} |
| Featured3 | **Included in All-in-One Plans** |
| PriceCondition1 | first year |
| PriceCondition2 | first year |
| PriceCondition3 | first year |
| FeaturedSavings1 | Save, {percent} |
| FeaturedSavings2 | Save, {percent} |
| FeaturedSavings3 | Save, {percent} |
| avpm/3/1 (Bitdefender Antivirus Plus Multiplatform) | USD 29.99 |
| mobileios/1/1 (Bitdefender Mobile Security for Android & iOS) | USD 17.99 |
| mobile/1/1 (Bitdefender Mobile Security) | USD 17.99 |

**Example: "Identity protection" section (3 cards — compact style, no device count line)**

| Products (compact, solutions) |
| --- |
| Bitdefender / Identity Theft Protection Premium / --- / • Instant alerts when your personal information is at risk / • Prevent damages and financial loss from identity theft / • Complete identity theft restoration services / • Identity theft insurance, up to $2 million covered / • Extensive credit and ID monitoring / • Extra reimbursements against ransomware and social engineering up to $50k / --- / {Plans} / \| {OldPrice} \| {FeaturedSavings} \| / {Price} / {PriceCondition} / **Plus** applicable sales tax / See [Terms of Use](#) below. / [Buy now](https:/#buylink) / [Learn more](https://...) |
| Bitdefender / Identity Theft Protection Standard / --- / • bullet list... / --- / {Plans} / \| {OldPrice} \| {FeaturedSavings} \| / {Price} / {PriceCondition} / ... |
| Bitdefender / Digital Identity Protection / --- / • bullet list... / --- / {Plans} / \| {OldPrice} \| {FeaturedSavings} \| / {Price} / {PriceCondition} / ... |

> Note: In this identity variant, there is NO device count / description line after the product name. The card goes directly to `---` then bullet list.

**Section Metadata (Identity protection):**

| Section Metadata | |
| --- | --- |
| Sticky navigation item | Identity Protection |
| Plans1 | {[ 1, idtheftp, 1u-1y], 1} |
| PriceCondition1 | first year |
| Plans2 | {[ 1, idthefts, 1u-1y], 1} |
| PriceCondition2 | first year |
| Plans3 | {[ 1, dip, 1u-1y], 1} |
| PriceCondition3 | first year |
| style | pt-0 |
| FeaturedSavings1 | Save, {percent} |
| FeaturedSavings2 | Save, {percent} |
| FeaturedSavings3 | Save, {percent} |

---

### Variant E: `Products(solutions)` — Full product cards with image

Used for "Privacy solutions" section. Each card includes a product image, platform icon row, `{Featured}` nanoblock token, description text, bullet list, and pricing. The `{Featured}` token is placed DIRECTLY IN THE CELL (not just via Section Metadata).

**Cell structure for each product row:**

```
Bitdefender (h3 line 1)
Premium VPN (h3 line 2)
[product image]
:windows: :mac: :ios: :android:  (platform icons, orange NOTRANSLATE)
{Featured}  (orange NOTRANSLATE — fetches text from Featured1/Featured2 in Section Metadata)
Description text
---
• bullet 1
• bullet 2
• bullet 3
• bullet 4
---
{Plans}
| {OldPrice} | {FeaturedSavings} |   ← 2-column inner table
{Price}
{PriceCondition}
**Plus** applicable sales tax
See [Terms of Use](https://...) below.
[Buy now](https:/#buylink)
[Discover Bitdefender Premium VPN](https://...)
```

**Example: "Privacy solutions" section (2 cards)**

| Products(solutions) |
| --- |
| Bitdefender / Premium VPN / [image] / :windows: :mac: :ios: :android: / {Featured} / Ultra-fast VPN that keeps your online identity and activities safe from hackers, ISPs and snoops / --- / • Unlimited encrypted traffic for up to 10 devices / • Safe online media streaming and downloads / • 4000+ servers in over 49 countries around the world / • Complete online protection and anonymity, no traffic logs / --- / {Plans} / \| {OldPrice} \| {FeaturedSavings} \| / {Price} / {PriceCondition} / **Plus** applicable sales tax / See [Terms of Use](#) below. / [Buy now](https:/#buylink) / [Discover Bitdefender Premium VPN](https://...) |
| Bitdefender / SecurePass / [image] / :windows: :mac: :ios: :android: / {Featured} / Ultra-secure, feature-rich password manager. Keep your passwords safe and access them from anywhere. / --- / • Always have your passwords at hand / • Runs and syncs on all major platforms and browsers / • Strongest data security protocols / • Simplifies the management of your online identities / --- / {Plans} / \| {OldPrice} \| {FeaturedSavings} \| / {Price} / {PriceCondition} / **Plus** applicable sales tax / See [Terms of Use](#) below. / [Buy now](https:/#buylink) / [Discover Bitdefender SecurePass](https://...) |

**Section Metadata (Privacy solutions):**

| Section Metadata | |
| --- | --- |
| Sticky navigation item | Privacy Solutions |
| Plans1 | {[ 10, vpn, 10u-1y], 10} |
| Plans2 | {[ 1, secpass, 1u-1y], 1} |
| PriceCondition1 | first year |
| PriceCondition2 | first year |
| Featured1 | Included in All-in-One Plans |
| Featured2 | Included in All-in-One Plans |
| style | pt-0 |
| FeaturedSavings1 | Save, {percent} |
| FeaturedSavings2 | Save, {percent} |

---

### Section Metadata fields reference

| Field | Purpose |
| --- | --- |
| `Sticky navigation item` | Label shown in the sticky nav for this section |
| `Plans1`, `Plans2`, `Plans3` | Plan config for card N: `{[qty, productCode, variation], displayQty}` |
| `PriceCondition1` ... | Billing period text for card N (e.g. "first year"); replaces `{BilledPrice}` token |
| `OldPrice1` ... | Original price override for card N (often empty — uses store data) |
| `Price1` ... | Price format for card N (`,monthly` = monthly price display) |
| `FeaturedSavings1` ... | Savings badge for card N (e.g. `Save, {percent}` or `Best Value! Go Annual & Save,{percent}`) |
| `HighlightSavings1` ... | Large banner savings text for card N |
| `Featured1` ... | Featured badge text for card N (displayed via `{Featured}` nanoblock in cell — solutions variant only) |
| `style` | Section style classes (e.g. `pt-0`, `light sky blue/wide/v2`) |
| `id` | Section ID override (e.g. `products`) |
| `productCode/qty/seats` | Price data rows: product code + quantity + seats → USD price |

---

## Finding Block Structures for Unlisted Blocks

1. Open: `https://main--www-websites--bitdefender.aem.page/sidekick/blocks/<block-name>/<block-name>`
2. Read the block's `.js` file in `_src/blocks/<block-name>/`
3. Look at the row/cell access patterns (`block.children`, `block.querySelectorAll`) to infer the expected table structure.
4. The SharePoint reference `.docx` is at: `https://bitdefender.sharepoint.com/sites/wwwwebsitesv2/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2Fwwwwebsitesv2%2FShared%20Documents%2Fsites%2Fsidekick%2Fblocks`
