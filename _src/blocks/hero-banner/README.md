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
| A paragraph holding only a link | An extra button: **bold** is the red one, plain is the outline one |

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

The look follows the content. With a product name it is the **product** look: white, the
image on its own with the signature on a blue scrim. Without one it is the **card** look:
a grey card, the signature as the eyebrow, the image fading into the card. Add `(product)`
or `(card)` to the block name to choose.

`hero-dropdown` metadata this block ignores, because the design fixes it:
`backgroundColor`, `innerBackgroundColor`, `corners`, `contentSize`, `textColor`, `Label`.

## Notes

- The dropdown is a native `<select>`: keyboard, touch and screen readers work as anywhere.
  It is named by the description, so write one when there is a dropdown.
- Styles are dex-core tokens with the Figma values as fallbacks, so the hero needs no
  dex-core JS or `tokens.css`, and follows a theme when the page has the tokens.
- Prices, discounts and buy links come from the store (`bd-context` per product).
- Rollback for a page: rename the block back to `Hero Dropdown` and republish it.
- Adobe Target slots are named after the block (`hero-banner-mbox`): a test running on a
  page's `hero` or `hero-dropdown` stops matching when the page moves to this block.
