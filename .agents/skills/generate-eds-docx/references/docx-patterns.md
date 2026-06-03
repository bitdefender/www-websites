# python-docx Patterns for EDS DOCX Generation

Copy these helpers verbatim into every generator script. They encode the low-level XML details so your section functions stay readable.

---

## Required Imports

```python
from docx import Document
from docx.shared import Inches
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.enum.text import WD_BREAK
```

---

## Color Constants

```python
LIME_GREEN = '92D050'   # Block header rows
ORANGE     = 'F4B942'   # Section Metadata + Metadata header rows
```

---

## Low-level XML Helpers

```python
def shd_el(hex_color):
    e = OxmlElement('w:shd')
    e.set(qn('w:val'), 'clear')
    e.set(qn('w:color'), 'auto')
    e.set(qn('w:fill'), hex_color)
    return e

def set_cell_bg(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    for s in tcPr.findall(qn('w:shd')):
        tcPr.remove(s)
    tcPr.append(shd_el(hex_color))
```

---

## Core Cell Helpers

### `clear_cell` — Wipe a cell before writing to it

Always call this before appending content to a cell that was just created. New cells contain one default empty `<w:p>` that causes a double-blank-line if not removed.

```python
def clear_cell(cell):
    tc = cell._tc
    for child in list(tc):
        if child.tag in (qn('w:p'), qn('w:tbl')):
            tc.remove(child)
    tc.append(OxmlElement('w:p'))
```

### `move_table_into_cell` — Nest a table inside a cell

Use this to move a card/feature table (created at doc body level) into an outer block's cell.

```python
def move_table_into_cell(outer_cell, inner_table):
    tc = outer_cell._tc
    for p in list(tc.findall(qn('w:p'))):
        tc.remove(p)
    tbl = inner_table._tbl
    parent = tbl.getparent()
    if parent is not None:
        parent.remove(tbl)
    tc.append(tbl)
    tc.append(OxmlElement('w:p'))   # OOXML requires terminal paragraph in every cell
```

---

## Table Factory

```python
def make_bordered_table(doc, rows, cols):
    t = doc.add_table(rows=rows, cols=cols)
    t.style = 'Table Grid'
    return t
```

---

## Section Separator

```python
def add_separator(doc):
    doc.add_paragraph('---')
```

---

## Block & Metadata Header Helpers

### `block_header` — Lime-green block name row

```python
def block_header(table, col_count, text):
    if col_count > 1:
        cell = table.cell(0, 0).merge(table.cell(0, col_count - 1))
    else:
        cell = table.cell(0, 0)
    cell.text = text
    set_cell_bg(cell, LIME_GREEN)
    for p in cell.paragraphs:
        for r in p.runs:
            r.bold = True
    return cell
```

### `meta_header` — Orange Section Metadata / Metadata header

```python
def meta_header(table, col_count, text='Section Metadata'):
    if col_count > 1:
        cell = table.cell(0, 0).merge(table.cell(0, col_count - 1))
    else:
        cell = table.cell(0, 0)
    cell.text = text
    set_cell_bg(cell, ORANGE)
    for p in cell.paragraphs:
        for r in p.runs:
            r.bold = True
    return cell
```

### `add_kv_rows` — Populate key/value rows in a 2-column table

```python
def add_kv_rows(table, fields, start_row=1):
    for i, (k, v) in enumerate(fields):
        table.cell(start_row + i, 0).text = k
        table.cell(start_row + i, 1).text = v
```

---

## Hyperlink Helper

```python
def add_hyperlink(paragraph, url, text):
    part = paragraph.part
    r_id = part.relate_to(
        url,
        'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink',
        is_external=True,
    )
    hyperlink = OxmlElement('w:hyperlink')
    hyperlink.set(qn('r:id'), r_id)

    new_run = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    rStyle = OxmlElement('w:rStyle')
    rStyle.set(qn('w:val'), 'Hyperlink')
    rPr.append(rStyle)
    new_run.append(rPr)

    t = OxmlElement('w:t')
    t.text = text
    t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    new_run.append(t)
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)
    return hyperlink
```

---

## Image Embedding

```python
def embed_image(cell, img_path, width_inches=2.5):
    clear_cell(cell)
    p = cell.paragraphs[0]
    run = p.add_run()
    run.add_picture(img_path, width=Inches(width_inches))
```

---

## Section Metadata Table

Always add an **empty paragraph** before the Section Metadata table so it does not visually merge with the preceding block table in Word.

```python
def add_section_metadata(doc, fields, extra_rows=0):
    """
    fields: list of (key, value) tuples.
    extra_rows: set > 0 if any value cell needs an image (handle separately after call).
    """
    rows = 1 + len(fields) + extra_rows
    doc.add_paragraph()          # ← required separator
    sm = make_bordered_table(doc, rows=rows, cols=2)
    meta_header(sm, 2)
    add_kv_rows(sm, fields)
    return sm
```

---

## Heading Paragraphs

Use Word paragraph **styles**, not bold runs, so EDS JS detects correct heading levels:

```python
# H1
p = cell.paragraphs[0]          # after clear_cell
p.style = doc.styles['Heading 1']
p.add_run('Your H1 Text')

# H2 (standalone, outside a block)
h2 = doc.add_paragraph(style='Heading 2')
h2.add_run('Your H2 Text')

# H3 inside a cell (e.g. card title)
p = cell.paragraphs[0]
p.style = doc.styles['Heading 3']
p.add_run('Card Title')
```

---

## Bullet / List Items

Always use the `'List Paragraph'` style for bullet list items — **never** `'List Bullet'`.
Franklin's EDS parser recognises `List Paragraph` as list items; `List Bullet` is a Word-native style that does not translate correctly.

```python
for item in features:
    cell.add_paragraph(item, style='List Paragraph')
```

This applies everywhere bullet lists appear: hero sections, product card feature lists, accordion body content, etc.

---

## main() Skeleton

```python
def main():
    doc = Document()

    # Remove the default empty paragraph that Document() creates
    for p in list(doc.paragraphs):
        p._element.getparent().remove(p._element)

    add_section_1(doc)      # ends with add_separator(doc)
    add_section_2(doc)      # ends with add_separator(doc)
    # ... more sections ...
    add_page_metadata(doc)  # NO add_separator after this

    doc.save(OUTPUT)
    print(f'Saved: {OUTPUT}')

if __name__ == '__main__':
    main()
```
