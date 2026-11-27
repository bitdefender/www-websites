# CTA Banner

Renders `bd-cta-banner` from the design system. Layout, colours and typography
are owned by the design system.

## Authoring

Name the Word table `cta-banner`. Put the following content in one cell, as in
the authored example; rows and cells may also be split:

- An optional icon, such as `:shield-check:`, or a picture.
- A heading, keeping its authored heading level.
- One or more paragraphs. Inline links remain part of the text.
- A standalone link per paragraph for each button. Plain or bold links are
  primary; italic links are secondary.

Every part is optional. Icons load from the site's `/common/icons/` content.

Section Metadata:

| Key | Values | DS default when omitted |
| --- | --- | --- |
| `appearance` | `brand`, `brand-soft`, `brand-deep` | `brand-soft` |
| `width` | `full`, `contained` | `contained` |

Primary buttons use `appearance="accent"` for the animated arrow, as in Storybook.
The DS makes them blue on `brand-soft` and red on `brand-deep`.
Buttons use `surface="light"` on the soft banner and `surface="brand"` on deep
or gradient banners.

For the Sidekick Library, create a Word example at
`/tools/sidekick/blocks/cta-banner`, add it to the library workbook's
`helix-blocks` sheet, and preview/publish both in SharePoint.
