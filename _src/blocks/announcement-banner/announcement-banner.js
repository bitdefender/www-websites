import { getDsnBase } from '../../scripts/utils/utils.js';

const getIcon = (block) => {
    const picture = block.querySelector('picture');
    if (picture) return picture.cloneNode(true);

    const image = block.querySelector('img');
    if (image) return image.cloneNode(true);

    const icon = block.querySelector('[class*="icon-"]');
    const iconName = icon && Array.from(icon.classList)
        .find((className) => className.startsWith('icon-'))
        ?.substring(5);
    const iconMarker = block.textContent.match(/:([a-z0-9-]+):/i);
    const markerName = iconMarker?.[1];

    if (!iconName && !markerName) return null;

    const iconImage = document.createElement('img');
    iconImage.src = `/common/icons/${iconName || markerName}.svg`;
    iconImage.alt = '';
    return iconImage;
};

const getDescription = (block, heading) => {
    const headingCell = heading && [...block.querySelectorAll('div')].find(
        (cell) => cell.contains(heading) && cell.parentElement?.parentElement === block,
    );
    const row = headingCell?.parentElement;
    const descriptionCell = row && [...row.children].find(
        (cell) => cell !== headingCell && cell.textContent.trim(),
    );

    const description = descriptionCell || [...block.querySelectorAll('p')].find(
        (paragraph) => paragraph.textContent.trim(),
    );

    if (!description) return '';

    const cleanedDescription = description.cloneNode(true);
    cleanedDescription.querySelectorAll('svg, picture, img, [class*="icon-"]').forEach(
        (element) => element.remove(),
    );
    return cleanedDescription.textContent
        .replace(/:[a-z0-9-]+:/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
};

export default async function decorate(block) {
    const base = getDsnBase();
    try {
        // The component is not exposed by the package exports map.
        await import(`${base}src/components/announcement-banner/announcement-banner.js`);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('announcement-banner: DSN import failed, continuing with native rendering', err);
    }

    const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
    const description = getDescription(block, heading);
    const announcementBanner = document.createElement('bd-announcement-banner');
    const title = heading?.textContent.trim();

    if (title) announcementBanner.setAttribute('title', title);
    if (description) announcementBanner.setAttribute('description', description);

    const icon = getIcon(block);
    if (icon) {
        icon.setAttribute('slot', 'icon');
        announcementBanner.append(icon);
    }

    block.replaceChildren(announcementBanner);
}
