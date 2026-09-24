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

    if (!iconName) return null;

    const iconImage = document.createElement('img');
    iconImage.src = `/common/icons/${iconName}.svg`;
    iconImage.alt = '';
    return iconImage;
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
    const description = [...block.querySelectorAll('p')].find(
        (paragraph) => !paragraph.querySelector('picture, img, [class*="icon-"]')
            && paragraph.textContent.trim(),
    );
    const announcementBanner = document.createElement('bd-announcement-banner');
    const title = heading?.textContent.trim();

    if (title) announcementBanner.setAttribute('title', title);
    if (description) announcementBanner.setAttribute('description', description.textContent.trim());

    const icon = getIcon(block);
    if (icon) {
        icon.setAttribute('slot', 'icon');
        announcementBanner.append(icon);
    }

    block.replaceChildren(announcementBanner);
}
