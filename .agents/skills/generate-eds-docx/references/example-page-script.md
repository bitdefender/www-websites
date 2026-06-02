# Example: IDC Report Page Generator

Complete, working generator script for a multi-section EDS page.
Use this as the starting template when building a new page script.

**Page produced:** Bitdefender IDC Report landing page  
**Blocks used:** `big-teaser-section`, `Quote`, `Four Cards`, `new-prod-boxes(smallerbuttons)`  
**Sections:** 5 content sections + Metadata

---

## How to adapt this for a new page

1. Copy the helpers block verbatim (lines marked `# ── helpers ──`).
2. Replace `OUTPUT` and `IMG_DIR` with your paths.
3. Delete the section functions you don't need and add new ones.
4. Update `main()` to call your section functions in order.
5. Run: `python3 gen_<page>.py`

---

## Full Script

```python
#!/usr/bin/env python3
"""
Generate Bitdefender IDC Report EDS page DOCX.

Page structure:
  Section 1: big-teaser-section (hero) + Section Metadata
  ---
  Section 2: Default content (h2 + body + IDC chart + recognition text) + Quote block
  ---
  Section 3: h2 + Four Cards block (Why Bitdefender Leads)
  ---
  Section 4: h2 + intro + new-prod-boxes(smallerbuttons) + Section Metadata
  ---
  Section 5: h2 + About The IDC MarketScape (default content)
  ---
  Metadata (last)
"""

from docx import Document
from docx.shared import Inches
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.enum.text import WD_BREAK

OUTPUT  = '/path/to/output/idc-report.docx'
IMG_DIR = '/path/to/images/'   # trailing slash required

# ── Colors ────────────────────────────────────────────────────────────────────
LIME_GREEN = '92D050'   # Block header rows
ORANGE     = 'F4B942'   # Section Metadata / Metadata header rows


# ── XML helpers ───────────────────────────────────────────────────────────────

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

def clear_cell(cell):
    """Remove default content from a cell, leaving one empty paragraph."""
    tc = cell._tc
    for child in list(tc):
        if child.tag in (qn('w:p'), qn('w:tbl')):
            tc.remove(child)
    tc.append(OxmlElement('w:p'))

def move_table_into_cell(outer_cell, inner_table):
    """Move a doc-body table into a cell (for nested tables)."""
    tc = outer_cell._tc
    for p in list(tc.findall(qn('w:p'))):
        tc.remove(p)
    tbl = inner_table._tbl
    parent = tbl.getparent()
    if parent is not None:
        parent.remove(tbl)
    tc.append(tbl)
    tc.append(OxmlElement('w:p'))   # OOXML requires terminal paragraph in every cell

def make_bordered_table(doc, rows, cols):
    t = doc.add_table(rows=rows, cols=cols)
    t.style = 'Table Grid'
    return t

def add_separator(doc):
    doc.add_paragraph('---')

def block_header(table, col_count, text):
    """Row 0: lime-green block name, bold, col-spanned."""
    cell = table.cell(0, 0).merge(table.cell(0, col_count - 1)) if col_count > 1 else table.cell(0, 0)
    cell.text = text
    set_cell_bg(cell, LIME_GREEN)
    for p in cell.paragraphs:
        for r in p.runs:
            r.bold = True
    return cell

def meta_header(table, col_count, text='Section Metadata'):
    """Row 0: orange metadata header, bold, col-spanned."""
    cell = table.cell(0, 0).merge(table.cell(0, col_count - 1)) if col_count > 1 else table.cell(0, 0)
    cell.text = text
    set_cell_bg(cell, ORANGE)
    for p in cell.paragraphs:
        for r in p.runs:
            r.bold = True
    return cell

def add_kv_rows(table, fields, start_row=1):
    for i, (k, v) in enumerate(fields):
        table.cell(start_row + i, 0).text = k
        table.cell(start_row + i, 1).text = v

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

def embed_image(cell, img_path, width_inches=2.5):
    clear_cell(cell)
    p = cell.paragraphs[0]
    run = p.add_run()
    run.add_picture(img_path, width=Inches(width_inches))


# ── Section 1: Hero (big-teaser-section) ─────────────────────────────────────

def add_big_teaser_hero(doc):
    # Block table: 3 rows
    tbl = make_bordered_table(doc, rows=3, cols=1)
    block_header(tbl, 1, 'big-teaser-section')

    # Row 1: rich text — H1 MUST use Heading 1 style for hero.js to detect it
    cell = tbl.cell(1, 0)
    clear_cell(cell)
    p_h1 = cell.paragraphs[0]
    p_h1.style = doc.styles['Heading 1']
    p_h1.add_run('Protecting Every Step of Your Digital Journey')

    cell.add_paragraph().add_run(
        'Bitdefender named a Leader in Consumer Digital Life Protection by IDC MarketScape'
    )
    add_hyperlink(cell.add_paragraph(), '/en-us/consumer/', 'Explore Plans')
    add_hyperlink(cell.add_paragraph(), '#idc-report', 'See why IDC Ranked us leader')

    # Row 2: overlay image
    embed_image(tbl.cell(2, 0), IMG_DIR + 'image2.png', width_inches=4.0)

    # Section Metadata — empty paragraph first to prevent visual table merge in Word
    doc.add_paragraph()
    sm = make_bordered_table(doc, rows=4, cols=2)
    meta_header(sm, 2)
    sm.cell(1, 0).text = 'desktop-picture'
    embed_image(sm.cell(1, 1), IMG_DIR + 'image1.jpeg', width_inches=2.5)
    sm.cell(2, 0).text = 'mobile-picture'
    embed_image(sm.cell(2, 1), IMG_DIR + 'image1.jpeg', width_inches=2.5)
    sm.cell(3, 0).text = 'style'
    sm.cell(3, 1).text = 'pb-0'

    add_separator(doc)


# ── Section 2: Default content + Quote ───────────────────────────────────────

def add_idc_recognition(doc):
    h2 = doc.add_paragraph(style='Heading 2')
    h2.add_run('\u2018Digital Life Protection\u2019 Really Means')

    doc.add_paragraph(
        'Your digital life extends far beyond a single device. It includes your identity, '
        'your privacy, your home network, your finances\u2014everything that connects you '
        'to the people and things you care about.'
    )

    # Standalone image (not inside a block)
    p_chart = doc.add_paragraph()
    p_chart.add_run().add_picture(IMG_DIR + 'image2.png', width=Inches(4.5))

    p = doc.add_paragraph()
    p.add_run('Bitdefender has been recognized as a ')
    p.add_run('Leader').bold = True
    p.add_run(' in the ')
    p.add_run('2025 IDC MarketScape for Worldwide Consumer Digital Life Protection').italic = True
    p.add_run(' \u2014 a testament to our innovation and commitment.')

    # Quote block (2-row table)
    q_tbl = make_bordered_table(doc, rows=2, cols=1)
    block_header(q_tbl, 1, 'Quote')

    qcell = q_tbl.cell(1, 0)
    clear_cell(qcell)

    # Para 1: quote text — normal (not bold, not italic)
    qcell.paragraphs[0].add_run(
        '\u201cConsumers are beginning to view cybersecurity solutions '
        'as another form of personal insurance\u201d'
    )
    # Para 2: author — bold
    qcell.add_paragraph().add_run('IDC MarketScape 2025').bold = True
    # Para 3: stars placeholder — MUST be italic to prevent quote.js crash
    qcell.add_paragraph().add_run(' ').italic = True   # italic-space → 0 stars, no crash

    add_separator(doc)


# ── Section 3: Four Cards ─────────────────────────────────────────────────────

_LEADS_FEATURES = [
    ('Trusted Worldwide',
     'Collaboration with global law-enforcement agencies strengthens protection.'),
    ('AI-Powered Assistance',
     'An AI chatbot helps flag scams in texts, emails, social posts, links, or QR codes.'),
    ('Intelligent Defense',
     'Threat intelligence powered by device-level sensors, cloud honeypots, and network telemetry.'),
    ('Proven Protection',
     'Consistently high marks in independent testing for detection accuracy and low false positives.'),
]

def add_why_bd_leads(doc):
    doc.add_paragraph(style='Heading 2').add_run('Why Bitdefender Leads')

    # Four Cards: header row + one row per card
    tbl = make_bordered_table(doc, rows=5, cols=1)
    block_header(tbl, 1, 'Four Cards')

    for i, (title, desc) in enumerate(_LEADS_FEATURES):
        cell = tbl.cell(i + 1, 0)
        clear_cell(cell)
        p_title = cell.paragraphs[0]
        p_title.style = doc.styles['Heading 3']   # H3 = card title
        p_title.add_run(title)
        cell.add_paragraph(desc)

    doc.add_paragraph(
        'Behind every capability is one single principle: protection centered on people.'
    )
    add_separator(doc)


# ── Section 4: Products (new-prod-boxes) ─────────────────────────────────────

_INDIVIDUAL_FEATURES = [
    {'category': 'Device Security',      'items': ['Scam Copilot', 'Device Security', 'Password Manager']},
    {'category': 'Privacy',              'items': ['Unlimited VPN traffic']},
    {'category': 'Identity Protection',  'items': ['Continuous Dark Web Monitoring',
                                                    'Identity Protection Score',
                                                    'Real Time Breach Notification']},
]
_FAMILY_FEATURES = _INDIVIDUAL_FEATURES + [
    {'category': 'Family Protection', 'items': ['Parental control']},
]
_SB_URL = 'https://www.bitdefender.com/en-us/consumer/small-business-security'
_SB_FEATURES = [
    'Best-in-class protection for business',
    'Scam & fraud protection',
    'Unlimited VPN traffic',
    'Account breach protection for all plan members',
]

def _build_feature_tables_in_cell(doc, cell, feature_sections):
    """Append nested feature-category sub-tables directly into a cell's XML."""
    tc = cell._tc
    for p in list(tc.findall(qn('w:p'))):
        tc.remove(p)
    for section in feature_sections:
        feat = doc.add_table(rows=1 + len(section['items']), cols=1)
        feat.style = 'Table Grid'
        clear_cell(feat.cell(0, 0))
        feat.cell(0, 0).paragraphs[0].add_run(section['category']).bold = True
        for i, item in enumerate(section['items']):
            feat.cell(i + 1, 0).text = item
        tbl = feat._tbl
        parent = tbl.getparent()
        if parent is not None:
            parent.remove(tbl)
        tc.append(tbl)
    tc.append(OxmlElement('w:p'))

def _build_sb_features_in_cell(doc, cell, features, url):
    """Append a features table with hyperlinked items into a cell's XML."""
    tc = cell._tc
    for p in list(tc.findall(qn('w:p'))):
        tc.remove(p)
    feat = doc.add_table(rows=1 + len(features), cols=1)
    feat.style = 'Table Grid'
    clear_cell(feat.cell(0, 0))
    feat.cell(0, 0).paragraphs[0].add_run('Features').bold = True
    for i, item in enumerate(features):
        item_cell = feat.cell(i + 1, 0)
        clear_cell(item_cell)
        add_hyperlink(item_cell.paragraphs[0], url, item)
    tbl = feat._tbl
    parent = tbl.getparent()
    if parent is not None:
        parent.remove(tbl)
    tc.append(tbl)
    tc.append(OxmlElement('w:p'))

def _build_card_table(doc, green_tag, product_name_line2, blue_tag, subtitle,
                      feature_sections=None, sb_features=None, under_buy_text=''):
    """
    Build one product card inner table (10 rows × 2 cols).
    Rows 0-3, 5-9 are merged. Row 4 is NOT merged (plan selector).
    """
    card = doc.add_table(rows=10, cols=2)
    card.style = 'Table Grid'

    def merged(row_idx):
        return card.cell(row_idx, 0).merge(card.cell(row_idx, 1))

    merged(0).text = green_tag                         # Row 0: promo tag

    cell = merged(1)                                   # Row 1: product name
    clear_cell(cell)
    p = cell.paragraphs[0]
    p.add_run('Bitdefender').add_break(WD_BREAK.LINE)
    p.add_run(product_name_line2)

    merged(2).text = blue_tag                          # Row 2: audience tag
    merged(3).text = subtitle                          # Row 3: device/account count

    card.cell(4, 0).text = 'Yearly[checked]'           # Row 4: plan selector (NOT merged)
    card.cell(4, 1).text = '2 Years'

    merged(5).text = ''                                # Row 5: per-price (JS fills this)

    cell = merged(6)                                   # Row 6: billed text
    clear_cell(cell)
    p1 = cell.paragraphs[0]
    p1.add_run('First year price. Plus applicable sales tax.').add_break(WD_BREAK.LINE)
    p1.add_run('See terms of use below.')
    p2 = cell.add_paragraph()
    p2.add_run('Billed 0 for 2 years. Plus applicable sales tax.').add_break(WD_BREAK.LINE)
    p2.add_run('See terms of use below.')

    cell = merged(7)                                   # Row 7: buy button
    clear_cell(cell)
    add_hyperlink(cell.paragraphs[0], '#buylink', 'Buy Now')

    merged(8).text = under_buy_text                    # Row 8: under-buy text

    benefits = merged(9)                               # Row 9: feature tables
    if sb_features:
        _build_sb_features_in_cell(doc, benefits, sb_features, _SB_URL)
    elif feature_sections:
        _build_feature_tables_in_cell(doc, benefits, feature_sections)

    return card

def add_products_section(doc):
    doc.add_paragraph(style='Heading 2').add_run('One Protection Strategy for Everyone!')

    for audience, desc in [
        ('Small business owners', 'Hassle-free, low-maintenance security for business.'),
        ('Families',              'Parental controls to keep every family member protected.'),
        ('Individuals',           'Real-time defense, identity monitoring, and privacy protection.'),
    ]:
        p = doc.add_paragraph()
        p.add_run(audience).bold = True
        p.add_run(' ' + desc)

    p_intro = doc.add_paragraph()
    p_intro.add_run('Explore Bitdefender\u2019s ')
    p_intro.add_run('Digital Life Protection').bold = True
    p_intro.add_run(' plans for Individuals, Families, and Small Businesses. ')
    add_hyperlink(p_intro, '/en-us/consumer/', 'See all plans')

    outer = make_bordered_table(doc, rows=4, cols=1)
    block_header(outer, 1, 'new-prod-boxes(smallerbuttons)')

    card1 = _build_card_table(doc, green_tag='', product_name_line2='Ultimate Security',
                               blue_tag=':user-sharp-regular: Individual',
                               subtitle='1 Account \u2013 5 Devices',
                               feature_sections=_INDIVIDUAL_FEATURES)
    move_table_into_cell(outer.cell(1, 0), card1)

    card2 = _build_card_table(doc, green_tag='Best value', product_name_line2='Ultimate Security',
                               blue_tag=':family-pants-sharp-regular: Family',
                               subtitle='5 accounts - 25 devices',
                               feature_sections=_FAMILY_FEATURES)
    move_table_into_cell(outer.cell(2, 0), card2)

    card3 = _build_card_table(doc, green_tag='', product_name_line2='Ultimate Small Business Security',
                               blue_tag=':briefcase-sharp-regular: Small Business',
                               subtitle='5 members',
                               under_buy_text='Covers 10 devices \u00b7 2 Windows servers \u00b7 10 Email addresses',
                               sb_features=_SB_FEATURES)
    move_table_into_cell(outer.cell(3, 0), card3)

    # Section Metadata — empty paragraph before to avoid visual merge in Word
    doc.add_paragraph()
    sm = make_bordered_table(doc, rows=5, cols=2)
    meta_header(sm, 2)
    add_kv_rows(sm, [
        ('products',         'us_i/5/1, us_f/25/1'),    # ← replace with real product IDs
        ('monthly-products', 'us_i/5/2, us_f/25/2'),
        ('save-text',        'Save'),
        ('sticky-nav-name',  'Overview'),
    ])

    add_separator(doc)


# ── Section 5: Default content ────────────────────────────────────────────────

def add_about_idc(doc):
    doc.add_paragraph(style='Heading 2').add_run('About The IDC MarketScape')
    doc.add_paragraph(
        'The IDC MarketScape vendor assessment model provides an overview of technology '
        'suppliers\u2019 competitive fitness, evaluating product and service offerings, '
        'strategies, and future success factors.'
    )
    add_separator(doc)


# ── Page Metadata (last — no separator after) ─────────────────────────────────

def add_page_metadata(doc):
    mt = make_bordered_table(doc, rows=4, cols=2)
    meta_header(mt, 2, 'Metadata')
    add_kv_rows(mt, [
        ('title',       'IDC MarketScape: Bitdefender Named a Leader | Bitdefender'),
        ('description', 'Explore how Bitdefender was named a Leader in the 2025 IDC MarketScape.'),
        ('template',    'product'),
    ])


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    doc = Document()

    # Remove the default empty paragraph that Document() creates
    for p in list(doc.paragraphs):
        p._element.getparent().remove(p._element)

    add_big_teaser_hero(doc)      # Section 1  — ends with add_separator
    add_idc_recognition(doc)      # Section 2  — ends with add_separator
    add_why_bd_leads(doc)         # Section 3  — ends with add_separator
    add_products_section(doc)     # Section 4  — ends with add_separator
    add_about_idc(doc)            # Section 5  — ends with add_separator
    add_page_metadata(doc)        # Metadata   — NO separator

    doc.save(OUTPUT)
    print(f'Saved: {OUTPUT}')

if __name__ == '__main__':
    main()
```
