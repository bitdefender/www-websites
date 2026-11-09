import { load } from '@repobit/dex-system-design/loader';
import { liftSectionHeader, wrapSectionInDsSection } from '../../scripts/utils/utils.js';

/*
 * The homepage's solution splitter, under the section header: one column per
 * row, a bold arrow bd-link to the audience's page over a small bd-p that
 * says who it is for. One across on a phone, two from md, four from lg.
 */

const text = (el) => el?.textContent.replace(/\s+/g, ' ').trim() || '';

const buildColumn = (row) => {
  const link = row.querySelector('a');
  if (!link) return null;
  const description = [...row.querySelectorAll('p')].find((p) => text(p) && !p.contains(link));

  const column = document.createElement('div');
  column.className = 'link-columns-item';

  const title = document.createElement('bd-link');
  title.setAttribute('href', link.getAttribute('href') || '');
  title.setAttribute('variant', 'bold');
  title.setAttribute('arrow', '');
  title.textContent = text(link);
  column.append(title);

  if (description) {
    const body = document.createElement('bd-p');
    body.setAttribute('variant', 'small');
    body.textContent = text(description);
    column.append(body);
  }
  return column;
};

export default async function decorate(block) {
  wrapSectionInDsSection(block);
  // the section's heading and lead, as bd-section-header
  const header = liftSectionHeader(block);

  const grid = document.createElement('bd-grid');
  // the design system's page column (styles.css), on the hero's edges
  grid.className = 'ds-page-column';
  const columns = [...block.children].map(buildColumn).filter(Boolean);
  // fewer links than the four the row holds share its width, rather than leaving its
  // end empty; more wrap four to a row
  const cols = (most) => String(Math.max(1, Math.min(columns.length, most)));
  [['cols', '1'], ['cols-sm', '1'], ['cols-md', cols(2)], ['cols-lg', cols(4)], ['gap', 'md']]
    .forEach(([name, value]) => grid.setAttribute(name, value));
  // each column's link and line on rows it shares with the columns beside it, so the
  // lines start together however the links wrap
  grid.setAttribute('item-rows', '2');
  grid.append(...columns);

  // the columns are built from copies, so the authored rows are whole until they replace them
  try {
    await load(grid);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('link-columns: DSN import failed, keeping the authored content', err);
    await header;
    return;
  }
  block.replaceChildren(grid);
  await header;
}
