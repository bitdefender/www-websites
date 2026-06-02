---
name: generate-eds-docx
description: |
  Generate AEM Edge Delivery Services (EDS) authoring Word documents (.docx) using python-docx.
  Produces correctly structured DOCX files that EDS can parse into pages.

  Trigger immediately for:
  - Generating a DOCX page for AEM Edge Delivery Services
  - Creating an EDS authoring document from content or a source URL
  - Building a Word document for AEM with blocks, sections, and metadata
  - Converting page designs or content briefs into EDS-ready DOCX files

  DO NOT trigger for:
  - Building or modifying block JavaScript/CSS (use building-blocks skill)
  - Importing pages from live URLs (use page-import skill)
  - Questions about block content models or authoring guidelines (use content-modeling skill)
---

# Generate EDS DOCX

A skill for generating AEM Edge Delivery Services Word documents (.docx) using a Python script and python-docx.

## When to Use

Use this skill when you need to produce a `.docx` file that:
- Authors can upload to SharePoint/Google Drive for AEM EDS
- Represents a full page with multiple sections and blocks
- Uses EDS block conventions (block header tables, Section Metadata, Metadata)

## Key Concepts

| Term | Meaning |
|------|---------|
| **Section** | Content between two `---` paragraph separators |
| **Block** | A `Table Grid` table where row 0 is a lime-green header naming the block |
| **Section Metadata** | An orange-header key/value table at the end of a section |
| **Metadata** | A single orange-header key/value table at the very end of the document (no `---` after) |

## Critical Rules

> Violating any of these rules causes incorrect EDS rendering or JavaScript crashes.

1. **Block header color**: `#92D050` (lime green). Section Metadata / Metadata header color: `#F4B942` (orange).
2. **Block variant names use parentheses** — `new-prod-boxes(smallerbuttons)`, never `new-prod-boxes smallerbuttons`.
3. **Heading styles** — Use Word paragraph styles `Heading 1`, `Heading 2`, `Heading 3` for `<h1>`/`<h2>`/`<h3>`. Do NOT use bold runs on Normal paragraphs.
4. **Empty paragraph between a block table and its Section Metadata table** — Adjacent `Table Grid` tables visually merge in Word without it.
5. **`clear_cell` before populating** — Cells in a new table contain a default empty paragraph; call `clear_cell(cell)` before appending your own content, otherwise you get a double empty paragraph.
6. **`move_table_into_cell` for nesting** — Removes the inner table from the doc body and places it inside the outer cell. Never use `cell._tc.append(inner_table._tbl)` without removing it from the body first.
7. **Quote block stars** — `quote.js` calls `stars.textContent` unconditionally; if no `<em>` element exists it crashes. Always add a trailing italic-space paragraph in the quote cell: `p.add_run(' ').italic = True`.
8. **Metadata table last** — No `---` after the Metadata table.
9. **Remove the default paragraph** — A new `Document()` contains one empty paragraph. Remove it before adding content: `for p in list(doc.paragraphs): p._element.getparent().remove(p._element)`.

## Workflow

### Step 1 — Plan the Document Structure

List every section with its content. Use the template:

```
Section 1: <block-name> + Section Metadata (if needed)
---
Section 2: Default content (headings, body paragraphs) + <block-name>
---
...
Metadata (last, no ---)
```

### Step 2 — Write the Generator Script

Create a Python script (e.g. `gen_<page>.py`) that:
1. Imports helpers from [docx-patterns reference](./references/docx-patterns.md)
2. Has one `add_<section>(doc)` function per section
3. Calls `add_separator(doc)` at the end of every section **except** the last Metadata call
4. Has a `main()` that removes the default paragraph, calls each section function, then saves

Use the [block authoring reference](./references/block-rules.md) for block-specific table structures.
Use the [example page script](./references/example-page-script.md) as a complete working template — copy the helpers block verbatim and adapt the section functions.

### Step 3 — Run the Script

```sh
python3 gen_<page>.py
```

Expected output: `Saved: /path/to/<page>.docx`

### Step 4 — Verify the Output

Run this inspection snippet to confirm top-level structure:

```python
from docx import Document
from docx.oxml.ns import qn

doc = Document('<page>.docx')
body = doc.element.body
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

def qw(tag): return f'{{{W}}}{tag}'
def get_text(el): return ''.join(t.text or '' for t in el.iter(qw('t')))

for i, child in enumerate(body):
    tag = child.tag.split('}')[-1]
    if tag == 'p':
        txt = get_text(child)[:40]
        print(f'{i:3d}  para  {txt!r}')
    elif tag == 'tbl':
        rows = child.findall(qw('tr'))
        first = get_text(rows[0].findall(qw('tc'))[0])[:30]
        print(f'{i:3d}  table rows={len(rows)} first={first!r}')
```

**Expected pattern** for a section with a block + Section Metadata:
```
  N  table  rows=X  first='<block-name>'
N+1  para   ''                            ← empty separator paragraph
N+2  table  rows=Y  first='Section Metadata'
N+3  para   '---'
```

### Step 5 — Upload and Preview

1. Upload the `.docx` to the SharePoint site: `https://bitdefender.sharepoint.com/sites/wwwwebsitesv2/`
2. Preview at: `https://main--www-websites--bitdefender.aem.page/<path>`

## Guidelines

- Always plan the full section structure (Step 1) before writing any code.
- Prefer reusing the helper functions from [docx-patterns.md](./references/docx-patterns.md) verbatim rather than reimplementing them.
- Check [block-rules.md](./references/block-rules.md) for the exact row structure of each block before building it — wrong row counts are hard to debug.
- When a block is not listed in block-rules.md, open its SharePoint `.docx` at `https://main--www-websites--bitdefender.aem.page/sidekick/blocks/<block-name>/<block-name>` and inspect its table structure before coding.
- Use `python-docx` v1.1+ (`pip install python-docx`).
