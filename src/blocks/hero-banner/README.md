# Hero Banner

The product page hero, drawn in the dex-core Figma file as **herobanners**
(`ys9zDkedeV5ZanPvzD7pUI`, node `763-2127`). One block for every product page, with or
without the dropdown.

It replaces `hero-dropdown`, which stays unchanged as the fallback. It reads the same
content and section metadata, so moving a page means renaming the block from
`Hero Dropdown` to `Hero Banner` in the doc; moving it back is the reverse.

## Authoring

One block, one cell, in this order. Every part is optional except the h1.

| Content | Becomes |
|---|---|
| A picture | The image panel (right on desktop, on top on mobile) |
| A heading before the h1, e.g. `Bitdefender` / `Ultimate Security` | The product name, in brand blue |
| The h1 | The value prop |
| Paragraphs (or a heading) after the h1 | The description |
| `{Dropdown}` on its own line | Where the dropdown, price and buttons go |
| Paragraphs after `{Dropdown}` | The disclaimer (small grey text) |
| A paragraph holding only pictures | Award marks, under the buttons |
| A paragraph holding only links | One button per link: **bold** is the red one, _italic_ or plain is the outline one |

Section metadata:

| Key | Value |
|---|---|
| `Dropdown` | Product codes, `id/devices/years`, comma separated: `ps_i/5/1, ts_i/5/1` |
| `productNames` | One per code, `Name \| details`: `Bitdefender Premium Security \| 1 Member & 5 Devices` |
| `signature` | `Trusted. Always.` (translate it per locale) |
| `buyButtonText` | The red button. Defaults to `Buy Now` |
| `discountText` | After the percentage in the badge. Defaults to `OFF` |
| `secondButtonText` / `secondButtonLink` | The outline button. A `/fragments/` link opens a modal |
| `trial-duration` | Makes the red button a trial buy link |
| `Hardcoded-link` | Sends the red button there instead of the store |
| `Microsoft-edge-link` | The red button's link on Edge, when `Hardcoded-link` is set |
| `Links-open-in-new-tab` | Opens the button links (not `#` anchors) in a new tab |

## What it renders

- **No `Dropdown` codes**: no price. The buttons come from `Hardcoded-link` /
  `secondButtonLink`, or from authored link paragraphs. This is the awards hero.
- **One code**: the price, no dropdown. This is the single-product hero.
- **Two or more codes**: the dropdown, the details line, and the chosen product's price.

The look follows the content. With a product name, or with one product code, it is the
**product** look: white, the image on its own with the signature on a blue scrim. Otherwise
it is the **card** look: a grey card, the signature as the eyebrow, the image fading into the
card. Add `(product)` or `(card)` to the block name to choose.

`hero-dropdown` metadata this block ignores, because the design fixes it:
`backgroundColor`, `innerBackgroundColor`, `corners`, `contentSize`, `textColor`, `Label`.

## Notes

- Text, controls and the badge are dex-system-design atoms, drawn by their own attributes:
  `bd-h` (the title at its h1 level; the product name at the h4 role in brand ink, as
  `bd-product-hero` draws it), `bd-p` (description, details, disclaimer), `bd-select` (one
  `bd-select-option` per product), `bd-button` (`appearance="accent"` buy button,
  `appearance="tertiary"` second button, at the button's responsive size, full width on a
  phone) and `bd-badge`. The card, image, scrim, signature and price are this block's CSS,
  on the design-system tokens.
- The section is on the design system's rhythm (`bd-section`), and the hero on its page
  column (`ds-page-column`), so it lines up with the design-system sections around it.
- The hero is the LCP, so it draws without waiting for the atoms. They load once the hero
  image has, and until then the CSS draws each one as it renders, so nothing moves (the
  `v4 gap:` rules: the design system draws nothing before an atom is defined). The token
  fallbacks are there for the same reason: the atoms install the tokens.
- The dropdown is a native `<select>` inside `bd-select`. The atom's only name in 4.0.0 is
  its `label` slot, which it draws above the field, and the design has no label, so the block
  gives the select the description as its `aria-label`: write one when there is a dropdown.
  dex-core PR #426 lets `bd-select` take `aria-label` itself; once it is released, the
  block sets it there instead. A heading used as the description becomes a paragraph, and
  Word's bold on it goes.
- The signature is text, not `<bd-icon name="brand-signature">`: the mark is drawn in English.
- Prices, discounts and buy links come from the store (`bd-context` per product).
- Rollback for a page: rename the block back to `Hero Dropdown` and republish it.
- Adobe Target slots are named after the block (`hero-banner-mbox`): a test running on a
  page's `hero` or `hero-dropdown` stops matching when the page moves to this block.
