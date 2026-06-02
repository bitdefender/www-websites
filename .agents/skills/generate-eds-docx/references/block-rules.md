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

## `products`

Product card blocks that render dynamic-pricing cards from the store. Each table row can contain 1–N cells (columns); each cell becomes one product card. All pricing is loaded at runtime from the store using the `PlansN` Section Metadata configuration.

Canonical reference: `sidekick/blocks/products.docx` (9 pages, 3 examples).

```
| Products (variant)              |   row 0: header (colored, merged)
| [card 1] | [card 2] | [card 3]  |   row 1: one cell per product card in this row
| [card 4] | [card 5]             |   row 2: optional second row of cards
```

**Variants and header colors:**

| Variant header text | Header color | Use case |
|---|---|---|
| `Products` | Lime-green | Standard product cards — image + OS icons + features list |
| `Products (compact)` | Orange | Compact cards — no image, no OS icons, minimal features |
| `Products (plans)` | Orange | Single plan per card, prominent plan selector |
| `Products (plans, compare)` | Lime-green | 2-column comparison — left card shows competitor, right card shows Bitdefender plan with pricing |

**Product card cell content** (in order, top to bottom):

1. `{HighlightSavings}` *(optional, **must be first**)* — green savings tag at top of card; uses `HighlightSavingsN` metadata
2. Product brand line — bold heading (e.g. `Bitdefender`)
3. Product plan name — bold heading (e.g. `Premium VPN`)
4. Product image *(standard variant only; omit in compact/plans)*
5. OS availability paragraph *(standard only)* — colon-syntax icon spans, e.g. `:windows: :mac: :ios: :android:`
6. `{Featured}` *(optional)* — featured badge; text comes from `FeaturedN` Section Metadata
7. Description text paragraph (plain sentence)
8. *(compact only)* Device/account count — bold, e.g. `Protect up to 10 devices`
9. `---` separator
10. *(compact only)* Bold italic marketing tagline
11. `---` separator
12. `{Plans}` — links this card to `PlansN` in Section Metadata (required)
13. `{FeaturedSavings}` *(optional)* — savings badge; uses `FeaturedSavingsN` metadata
14. `{Price}` — current price from store (no metadata needed)
15. `{OldPrice}` *(optional)* — original was-price; label from `OldPriceN` metadata
16. `{PriceCondition}` *or* `{PriceCondition, static text}` — billing condition; from `PriceConditionN` or inline text
17. Buy link — hyperlink (label `Buy now` / `Buy Now`) → JS adds `data-store-buy-link`
18. `---` *(optional)* — separator between the buy link and disclaimer text below
19. Optional plain-text footnote (e.g. `Plus applicable sales tax`, `30-Day Money-Back Guarantee.`)
20. Optional sentence with inline hyperlink (e.g. `See [Terms of Use] below.`)
21. Learn more link *(optional)* — secondary hyperlink (e.g. `Discover Bitdefender Premium VPN`, `Learn about`)

> Nanoblock tokens are authored as literal text in the cell — the exact string `{Plans}`, `{Price}`, etc.
> They are replaced at runtime by `renderNanoBlocks()`. All tokens except `{Price}` and `{OldPrice}` require a matching Section Metadata key.

**Section Metadata keys** (N = 1-based card number matching card position left-to-right across all rows):

| Key | Example value | Notes |
|-----|---------------|-------|
| `Plans1`, `Plans2`, … | `{[ 1, mac, 1u-1y], 1}` | Device-count selector: `{[numDevices, productCode, variation], default}`. Single option = no selector menu shown. |
| `Plans1` | `{[10, soho, 10u-1y], 10}` | Single-option device selector |
| `Plans1` | `{[ Yearly, secpass, 1u-1y, Monthly, secpassm, 1u-1y], Yearly}` | Label-based (yearly/monthly) selector: `{[label1, code1, var1, label2, code2, var2], defaultLabel}` |
| `PriceCondition1`, … | `*For the first year` | Billing condition text shown below price |
| `OldPrice1`, … | `Old Price` | Text label prepended before the was-price from store |
| `Featured1`, … | `Included in All-in-One Plans` | Featured badge text for the matching card |
| `FeaturedSavings1`, … | `Save, {percent}` | Savings % badge. **Always include trailing comma even when no %:** `Save,` |
| `HighlightSavings1`, … | `Save, {percent}` | Green highlight tag at top of card. Can be a full phrase: `Best Value! Go Annual & Save, {percent}`. Or static text with no token: `Best Value` |
| `Dynamic-price-texts1`, … | `for the first year, for the first month` | Overrides `{PriceCondition}` text when plan selector changes — one entry per option, comma-separated |
| `id` | `products` | HTML `id` on the section element (for anchor links) |
| `Style` | `wide, light sky blue` | Section style classes — multiple values comma-separated |
| `Sticky navigation item` | `Overview` | Label used in the sticky nav for this section |

**`{LowestPrice}` nanoblock** — placed as a standalone paragraph **before** the Products block table (not inside it):

```
{LowestPrice, mac, 1u-1y, monthly, Start today for as low as 0/mo}
```

Arguments: `LowestPrice, productCode, variation, billingPeriod, textTemplate` — `0` is a placeholder replaced with the live monthly price.

---

### Example 1 — standard `Products` (2 cards, one per row, Solutions page)

```
| Products                                             |
| Bitdefender                                          |
| Premium VPN                                          |
| [product image]                                      |
| :windows: :mac: :ios: :android:                      |
| {Featured}                                           |
| Ultra-fast VPN that keeps your online identity safe. |
| ---                                                  |
| • Unlimited encrypted traffic for up to 10 devices   |
| • 4000+ servers in over 49 countries around the world|
| • Complete online protection and anonymity            |
| ---                                                  |
| {Plans}                                              |
| {OldPrice}                                           |
| {Price}                                              |
| {PriceCondition}                                     |
| Plus applicable sales tax                            |
| See [Terms of Use] below.                            |
| [Buy now]                                            |
| [Discover Bitdefender Premium VPN]                   |
```

Section Metadata:

```
| Section Metadata  |                                |
| Plans1            | {[ 10, vpn, 10u-1y], 10}       |
| Plans2            | {[ 1, pass, 1u-1y], 1}         |
| PriceCondition1   | first year                     |
| PriceCondition2   | first year                     |
| Featured1         | Included in All-in-One Plans   |
| Featured2         | Included in All-in-One Plans   |
```

---

### Example 2 — `Products (compact)` (3 cards in one row)

Block table has **one content row with 3 columns**. Each compact card cell:

```
Bitdefender
Small Office Security
Protect up to 10 devices
---
Complete protection For Windows, macOS, iOS and Android
---
{Plans}
{OldPrice}
{Price}
{PriceCondition, first year}
GST included
See [Terms of Use] below.
[Buy now]
[Learn about]
```

> `{PriceCondition, first year}` — inline static text passed directly to the nanoblock instead of metadata.

Section Metadata (one row shared across all 3 cards' columns):

```
| Section Metadata  |                              |
| HighlightSavings1 | Save, Percent                |
| HighlightSavings2 | Save, Percent                |
| HighlightSavings3 | Save, Percent                |
| Plans1            | {[10, soho, 10u-1y], 10}     |
| Plans2            | {[15, fp, 15u-1y], 15}       |
| Plans3            | {[5, ts_i, 5u-1y], 5}        |
| PriceCondition1   | *For the first year          |
| PriceCondition2   | *For the first 2 years       |
| PriceCondition3   | *For the first 3 years       |
| OldPrice1         | Old Price                    |
| OldPrice2         | Old Price                    |
| OldPrice3         | Old Price                    |
| Featured3         | Included in All-in-One Plans |
| id                | products                     |
```

---

### Example 3 — `Products (plans)` (single card with plan selector)

```
| products (plans)                   |
| {HighlightSavings}                 |
| Bitdefender Mobile Security        |
| 1 account / billed annually        |
| ---                                |
| {Plans}                            |
| {FeaturedSavings}                  |
| {Price}                            |
| {OldPrice}                         |
| {PriceCondition}                   |
| [Buy Now]                          |
| GST included                       |
| See [Terms of Use] below.          |
```

Section Metadata:

```
| Section Metadata  |                         |
| Style             | wide, light sky blue    |
| Plans1            | {[ 1, mobile, 1u-1y], 1}|
| HighlightSavings1 | Save, {percent}         |
| FeaturedSavings1  | Save, {percent}         |
| PriceCondition1   | *For the first year     |
```

---

### Example 4 — `Products (plans, compare)` (2-column competitor comparison)

Block table has **one content row with 2 columns**. Column 1 = competitor card, column 2 = Bitdefender card. Metadata index matches column position (Bitdefender = 2).

```
| Products (plans, compare) |                                              |
| Free VPNs                 | Bitdefender                                  |
| "Free" VPN                | Bitdefender Premium VPN                      |
|                           | {FeaturedSavings}                            |
| ---                       | ---                                          |
| • Data limits & throttling| • Unlimited encrypted traffic for 10 devices |
| • Privacy risks           | • 4000+ servers across 49 countries          |
| • Weak encryption         | • No activity logs, zero tracking            |
|                           | :android: :windows: :mac: :ios:              |
|                           | Works on all major platforms                 |
|                           | ---                                          |
|                           | {Plans}                                      |
|                           | {OldPrice}                                   |
|                           | {Price}                                      |
|                           | {PriceCondition}                             |
|                           | [Buy Now]                                    |
```

> The competitor card (left column) never has `{Plans}` or pricing tokens — it is a static comparison list only.
> `{FeaturedSavings}` appears near the top of the Bitdefender card, before the features list.

Section Metadata:

```
| Section Metadata    |                              |
| Style               | centered                     |
| FeaturedSavings2    | Best Value! Go Annual & Save, {percent} |
| Plans2              | {[10, vpn, 10u-1y], 10}      |
| PriceCondition2     | *For the first year          |
| id                  | products                     |
```

---

## Finding Block Structures for Unlisted Blocks

1. Open: `https://main--www-websites--bitdefender.aem.page/sidekick/blocks/<block-name>/<block-name>`
2. Read the block's `.js` file in `_src/blocks/<block-name>/`
3. Look at the row/cell access patterns (`block.children`, `block.querySelectorAll`) to infer the expected table structure.
4. The SharePoint reference `.docx` is at: `https://bitdefender.sharepoint.com/sites/wwwwebsitesv2/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2Fwwwwebsitesv2%2FShared%20Documents%2Fsites%2Fsidekick%2Fblocks`
