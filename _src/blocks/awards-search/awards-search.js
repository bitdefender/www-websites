import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

let awardsData = [];
let filteredAwards = [];
let yearsToFilterBy = [];

function renderAwardItem(block, award) {
  const awardItemContainer = document.createElement('div');
  awardItemContainer.classList.add('award-item-container');

  if (award.Logo) {
    const awardsLogo = document.createElement('div');
    awardsLogo.classList.add('award-logo');
    awardsLogo.append(createOptimizedPicture(award.Logo, award.Title));
    awardItemContainer.append(awardsLogo);
  }

  const awardItemContent = document.createElement('div');
  awardItemContent.classList.add('award-item-description');
  const itemTitle = document.createElement('h2');
  itemTitle.append(award.Title);
  awardItemContent.append(itemTitle);
  const itemDescription = document.createElement('p');
  itemDescription.append(award.Description);
  awardItemContent.append(itemDescription);

  if (award.Link) {
    const itemLink = document.createElement('a');
    itemLink.innerHTML = 'Read More';
    itemLink.href = award.Link;
    awardItemContent.append(itemLink);
  }

  awardItemContainer.append(awardItemContent);
  block.appendChild(awardItemContainer);
}

function createFiltersContainer(parent) {
  const filtersContainer = document.createElement('div');
  filtersContainer.classList.add('award-results-filters-container');
  parent.append(filtersContainer);
}

function clearAwardsResultsSection(block) {
  const awardsResultsContainer = block.querySelector('.awards-results-container');
  awardsResultsContainer.innerHTML = '';
  createFiltersContainer(awardsResultsContainer);
}

function renderAwards(block, data) {
  const awardsResultsContainer = block.querySelector('.awards-results-container');
  data.forEach((award) => {
    renderAwardItem(awardsResultsContainer, award);
  });
}

function renderFilters(block) {
  if (yearsToFilterBy.length === 0) {
    return;
  }

  const filtersContainer = block.querySelector('.award-results-filters-container');
  yearsToFilterBy.forEach((year) => {
    const filterItem = document.createElement('div');
    filterItem.append(year);
    filtersContainer.append(filterItem);
  });

  const clearAllLink = document.createElement('a');
  clearAllLink.addEventListener('click', () => {
    yearsToFilterBy = [];
    const checkboxes = block.querySelectorAll('.accordion-item-content input');
    [...checkboxes].forEach((checkbox) => { checkbox.checked = false; });
    filteredAwards = [...awardsData];

    // Clear the existing awards before rendering new ones
    const awardsResultsContainer = block.querySelector('.awards-results-container');
    if (awardsResultsContainer) {
      awardsResultsContainer.innerHTML = '';
    }

    renderFilters(block);
    renderAwards(block, filteredAwards);
  });

  clearAllLink.innerText = 'Clear All';
  filtersContainer.append(clearAllLink);
}

function renderFilteredAwards(block) {
  clearAwardsResultsSection(block);
  renderFilters(block);
  if (yearsToFilterBy.length > 0) {
    filteredAwards = awardsData.filter((award) => yearsToFilterBy.includes(award.Year));
    renderAwards(block, filteredAwards);
  } else {
    filteredAwards = awardsData;
    renderAwards(block, awardsData);
  }
}

function handleFilterByYearCheckbox(block, event) {
  if (event.target.checked) {
    yearsToFilterBy.push(event.target.value);
  } else if (yearsToFilterBy.includes(event.target.value)) {
    yearsToFilterBy = yearsToFilterBy.filter((year) => year !== event.target.value);
  }

  renderFilteredAwards(block);
}

function createAwardsResultContainer(block) {
  const awardsResultsContainer = document.createElement('div');
  awardsResultsContainer.classList.add('awards-results-container');
  createFiltersContainer(awardsResultsContainer);
  block.appendChild(awardsResultsContainer);
}

function createFilterBySection(block, data) {
  const filterByContent = document.createElement('div');
  filterByContent.classList.add('accordion-item-content');

  const filterByYears = data.map((award) => award.Year);
  const filterByYearsUniqueValue = [...new Set(filterByYears)];

  filterByYearsUniqueValue.forEach((year) => {
    const checkboxElement = document.createElement('input');
    checkboxElement.setAttribute('type', 'checkbox');
    checkboxElement.setAttribute('value', year);
    checkboxElement.addEventListener('click', handleFilterByYearCheckbox.bind(null, block));
    const checkboxLabel = document.createElement('label');
    checkboxLabel.append(checkboxElement);
    checkboxLabel.append(year);
    filterByContent.append(checkboxLabel);
  });

  const filterWrapperSection = block.querySelector('.accordion > div');
  if (!filterWrapperSection) {
    return;
  }

  if (window.window.innerWidth >= 768) {
    filterWrapperSection.classList.add('expanded');
  }
  filterWrapperSection.appendChild(filterByContent);
}

async function fetchAwardsData(block) {
  const awardsLink = block.querySelector('a');
  const data = await fetch(awardsLink.href);
  const awards = await data.json();
  awardsData = [...awards.data];
  filteredAwards = [...awardsData];
  createFilterBySection(block, awardsData);
  renderAwards(block, filteredAwards);
}

function handleTextSearch(searchTextBox, block) {
  const filterBy = searchTextBox.value;
  clearAwardsResultsSection(block);
  renderFilters(block);
  if (filterBy.length === 0) {
    renderAwards(block, filteredAwards);
    return;
  }

  const filteredByTextAwards = filteredAwards.filter((award) => award.Title.match(new RegExp(`${filterBy}`, 'i')));
  renderAwards(block, filteredByTextAwards);
}

function createSearchTextBox(block) {
  const searchTextBox = document.createElement('input');
  searchTextBox.classList.add('text-box-wrapper');
  searchTextBox.setAttribute('type', 'text');
  searchTextBox.setAttribute('placeholder', 'Search Awards');

  searchTextBox.addEventListener('keyup', handleTextSearch.bind(null, searchTextBox, block));

  const searchMagnifingGlass = document.createElement('button');
  searchMagnifingGlass.classList.add('text-box-search-magnifing-glass');
  searchMagnifingGlass.setAttribute('aria-label', 'Search');
  searchMagnifingGlass.setAttribute('role', 'button');
  searchTextBox.after(searchMagnifingGlass);
  searchMagnifingGlass.addEventListener('click', handleTextSearch.bind(null, searchTextBox, block));

  const filterSection = block.querySelector('.award-search-filter-wrapper');
  filterSection.appendChild(searchTextBox);
  filterSection.appendChild(searchMagnifingGlass);
}

function removeAwardsLinkFromDom(block) {
  [...block.children].forEach((element) => {
    if (element.innerHTML.includes('awards.json')) {
      element.remove();
    }
  });
}

function moveAccordionUnderFilterSection(block) {
  const accordion = document.querySelector('.accordion-wrapper');
  const awardSearchFilterSection = document.createElement('div');
  awardSearchFilterSection.classList.add('award-search-filter-wrapper');
  block.append(awardSearchFilterSection);
  createSearchTextBox(block);
  awardSearchFilterSection.append(accordion);
}

export default async function decorate(block) {
  block.classList.add('global-styles');
  moveAccordionUnderFilterSection(block);
  createAwardsResultContainer(block);
  fetchAwardsData(block);
  removeAwardsLinkFromDom(block);
}
