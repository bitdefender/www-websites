import { throttle } from "@repobit/dex-utils";

const isHoverableDevice = window.matchMedia(
  '(hover: hover) and (pointer: fine)'
).matches;

const Config = {
  selectors: {
    container: '.mega-menu__container',
    viewAllButtons: '.navigation__view-all',
    popupContainer: '.mega-menu__popup-container',
    popupLink: '.mega-menu__popup-container .mega-menu__right-link',
    popupActive: '.popup-active',
    menuLink: '.mega-menu__l2-link',
    menuItem: '.mega-menu__l2-item',
    mobileBack: '.mega-menu__back-button',
    mobileBackL2: '.mega-menu__back-button-l2',
    mobileTrigger: '.mega-menu__button',
    l2active: '.mega-menu__l2-item.active',
    l2item: '.mega-menu__l2-item',
    viewAll: '.navigation--view-all',
    navLinks: '.navigation__links',
    menuItemFirst: '.mega-menu__item',
    navHeaderLink: '.navigation__header-link',
    navContainer: '.navigation__container',
    itemOpened: '.mega-menu--item-opened',
    quickLinks: '.navigation__quick-links .navigation__list',
    qucikLinksMobileContainer: '.mega-menu__quick-links-mobile',
    thirdLevelContent: '.mega-menu__third-level-content',
    categoryLinks: '.mega-menu__category-links',
    navigationHeader: '.navigation__heading',
    menuLinkRoot: '.mega-menu__link',
    navigation: '.navigation',
    menuLinkText: '.mega-menu__l2-link-text',
    firstLevel: '.mega-menu__first-level',
    navigationItems: '.navigation__list .navigation__item',
    menuList: '.mega-menu__list'
  },
  classes: {
    popupActive: 'popup-active',
    menuOpened: 'mega-menu--active',
    viewAll: 'navigation--view-all',
    itemOpened: 'mega-menu--item-opened',
    navigationHeader: 'navigation__heading',
    navHeaderLink: 'navigation__header-link',
    navHeaderText: 'navigation__header-text',
    menuItemFirst: 'mega-menu__item',
    menuLinkText: 'mega-menu__l2-link-text',
    navigation: 'navigation',
    megamenuNoL3: 'mega-menu__no-l3',
    firstLevelItemText: 'mega-menu__link-text'
  }
}

const isMobile = () => {return window.innerWidth < 1200};

function initMegaMenu (container) {
  let prevWidth = window.innerWidth;

  const setMobileRightLinksOffset = () => {
    const firstLevelEl = container.querySelector(Config.selectors.firstLevel);
    const firstLevelHeight = firstLevelEl.getBoundingClientRect().height + 1; // add 1px border bottom

    container.style.setProperty('--right-links-offset', `${firstLevelHeight}px` );
  }

  const closeViewAllLinks = () => {
    const viewAllLinks = container.querySelectorAll(Config.selectors.viewAll);

    Array.from(viewAllLinks).forEach((el) => {
      el.classList.remove(Config.classes.viewAll);
    });
  }

  const closeOpenedItems = () => {
    const activeElement = container.querySelector(Config.selectors.l2active);

    if (activeElement) {
      activeElement.classList.remove('active');
      return activeElement;
    }
  }

  const closePopUps = (currentTarget) => {
    container.querySelectorAll(Config.selectors.popupContainer)
      .forEach(popUpMenu => {
        if (popUpMenu !== currentTarget) {
          popUpMenu.classList.remove('popup-active')
        }
      });
  }

  const toggleMobileMenu = () => {
    if (!container.classList.contains(Config.classes.menuOpened)) {
      window.addEventListener('resize', this.windowResizeEvent = throttle(() => {
        const curentWidth = window.innerWidth;
        if (curentWidth !== prevWidth) {
          container.classList.remove(Config.classes.menuOpened);
          closeOpenedItems();
          closeViewAllLinks();
          window.removeEventListener('resize', this.windowResizeEvent);
          prevWidth = curentWidth;
        }
      }))
    } else {
      window.removeEventListener('resize', this.windowResizeEvent);
    }

    container.classList.toggle(Config.classes.menuOpened);
    closeOpenedItems();
    closeViewAllLinks();
  }


  const viewAllHandler = (viewAllButtons) => {
    Array.from(viewAllButtons).forEach((el) => {
      el.addEventListener('click', (event) => {
        const target = event.target;
        const subMenuTarget = target.closest(Config.selectors.navLinks);
        subMenuTarget.classList.add(Config.classes.viewAll);
      });
    });
  }

  const addQuickLinksToMobile = () => {
    const thirdLevelContainers = container.querySelectorAll(Config.selectors.thirdLevelContent);

    Array.from(thirdLevelContainers).forEach((el) => {
      const quickLinksMobileContainer = el.querySelector(Config.selectors.qucikLinksMobileContainer);
      // get quick links
      const quickLinks = el.querySelector(Config.selectors.quickLinks);
      // get category link
      const categoryLinks = el.querySelector(Config.selectors.categoryLinks);

      if (quickLinks) {
        quickLinksMobileContainer.appendChild(quickLinks.cloneNode(true));
      }

      if (categoryLinks) {
        quickLinksMobileContainer.appendChild(categoryLinks.cloneNode(true));
      }
    });
  }

  const getMenuItem = (el) => {
    const target = el.closest(Config.selectors.menuItem);
    if (target) {
      return target;
    } else {
      return el;
    }
  }

  const closeMenu = (el) => {
    el.classList.remove('active');
    this.isClosed = true;
  }

  const openMenu = (el) => {
    el.classList.add('active');
    this.isClosed = false;
  }

  this.isClosed = true;

  const addEvents = () => {
    // Menu Trigger Mobile Bind
    const hambugerButton = container.querySelector(Config.selectors.mobileTrigger);
    hambugerButton.addEventListener('click', ()=>{ toggleMobileMenu() })

    // L2 Navigation Bind
    const menuElements = container.querySelectorAll(Config.selectors.menuLink);

    Array.from(menuElements).forEach((el) => {
      el.addEventListener('click', (event) => {
        if(isHoverableDevice && window.innerWidth > 1199) {
          return;
        }

        event.stopPropagation();
        const targetEl = event.target;

        if (!targetEl.classList.contains(Config.classes.menuLinkText)) {
          event.preventDefault();
          const targetMenu = getMenuItem(targetEl);

          closePopUps();
          if (this.isClosed || closeOpenedItems() !== targetMenu) {
            openMenu(targetMenu);
          } else {
            closeMenu(targetMenu);
          }
        }
      });
    });

    // Mobile Back Bind
    const mobileBackButtonSecondLevel = container.querySelectorAll(Config.selectors.mobileBackL2);

    if (mobileBackButtonSecondLevel) {
      Array.from(mobileBackButtonSecondLevel).forEach((el) => {
        el.addEventListener('click', (event) => {
          const targetMenu = getMenuItem(event.target);

          closeMenu(targetMenu);
        });
      });
    }


    // Mobile Back to First Level Bind
    const mobileBackButtonFirstLevel = container.querySelectorAll(Config.selectors.mobileBack);

    Array.from(mobileBackButtonFirstLevel).forEach((el) => {
      el.addEventListener('click', (event) => {
        const backButton = event.target;
        const menu = backButton.closest(Config.selectors.menuItemFirst);
        menu.classList.remove(Config.classes.itemOpened);
        event.stopPropagation();
        const noProperty = !container.style.getPropertyValue('--right-links-offset');
        if (noProperty) {
          setMobileRightLinksOffset();
        }
      });
    });


    // Root top Navigation on Mobile
    const activeTopLink = container.querySelector(Config.selectors.itemOpened);

    if (activeTopLink) {
      activeTopLink.addEventListener('click', (event) => {
        const targetEl = event.target;
        const menuLink = activeTopLink.querySelector(Config.selectors.menuLinkRoot);

        if(isMobile() && (menuLink === targetEl || menuLink.contains(targetEl))) {
          event.preventDefault();
          closePopUps();
        }
        const topItem = activeTopLink.closest(Config.selectors.menuItemFirst);
        topItem.classList.add(Config.classes.itemOpened);
      });
    } else {
      const menuItemsFirstLevel = container.querySelectorAll(Config.selectors.menuItemFirst);

      Array.from(menuItemsFirstLevel).forEach((el) => {
        el.addEventListener('click', (event) => {
          const target = event.target;
          let menuItem = null;

          if (target.classList.contains(Config.classes.firstLevelItemText)) {
            return;
          }

          if (target.classList.contains(Config.classes.menuItemFirst)) {
            menuItem = target;
          } else {
            menuItem = target.closest(Config.selectors.menuItemFirst)
          }

          const menuLink = menuItem.querySelector(Config.selectors.menuLinkRoot);
          const childrenList = menuItem.querySelector(Config.selectors.menuList);

          if (!childrenList) {
            return;
          }

          if (isMobile() && (menuLink === target || menuLink.contains(target))) {
            event.preventDefault();
            menuItem.classList.add(Config.classes.itemOpened);
          }
        });
      });
    }

    // Accordion Mobile

    const acordeonLinks = container.querySelectorAll(Config.selectors.navHeaderLink);

    Array.from(acordeonLinks).forEach((el) => {
      el.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.classList.contains(Config.selectors.navHeaderText) && isMobile()) {
          event.preventDefault();
          const targetAcordion = target.closest(Config.selectors.navContainer);
          targetAcordion.classList.toggle('active');
        }
      });
    });

    //viewAllButtons Mobile
    const viewAllButtons = container.querySelectorAll(Config.selectors.viewAllButtons);
    viewAllHandler(viewAllButtons);

    // popup Menu right
    const popupMenus = container.querySelectorAll(Config.selectors.popupLink);

    Array.from(popupMenus).forEach((el) => {
      el.addEventListener('click', (event) => {
        event.stopPropagation();
        const target = event.target;
        const popupContainer = target.closest(Config.selectors.popupContainer);
        closePopUps(popupContainer);
        popupContainer.classList.toggle(Config.classes.popupActive);
        // toggleWindowEvent();
      });
    });

    document.addEventListener('click', window.toggleGlobal = () => {
      if(isMobile()) {
        return;
      }
      closePopUps();
      closeOpenedItems();
    });
  }

  const addAnalytics = () => {

    // Set correct 'id' attribute structure at Navigation subcomponents
    const navigationComponents = megamenuEl.querySelectorAll(".navigation__links")

    Array.from(navigationComponents).forEach((el) => {
      const headingId = el.getAttribute("id");
      const parentNavigationContainer = el.closest(".navigation");
      const parentId = el.closest(".mega-menu__third-level")?.getAttribute("id") ||
        el.closest(".mega-menu__second-level-right").getAttribute("id");

      if (headingId && parentId && parentNavigationContainer) {
        parentNavigationContainer.setAttribute("id", parentId);
        el.setAttribute("id", parentId + "|" + headingId);
      }
    });

  }

  const adjustPopupStructure = () => {
    // Modifies the structure for links inside a Popup Container > the <li/> and <a/> tags are siblings
    const topRightPopupElements = document.querySelectorAll(
      Config.selectors.popupContainer
    );

    topRightPopupElements.forEach((rightElement) => {
      const navigationItems = rightElement.querySelectorAll(
        Config.selectors.navigationItems
      );
      navigationItems.forEach(function (item, index) {
        const newDiv = document.createElement("div");
        newDiv.className = "navigation__item";

        const anchor = item.querySelector(".navigation__link");
        anchor.className = "navigation__anchor";
        newDiv.appendChild(anchor);

        const liElement = document.createElement("li");
        liElement.className = "navigation__link link-" + index;
        liElement.innerHTML = anchor.innerHTML;
        anchor.innerHTML = "";
        newDiv.appendChild(liElement);

        item.parentNode.replaceChild(newDiv, item);
      });
    });
  };

  adjustPopupStructure();
  addEvents();
  addAnalytics();
  addQuickLinksToMobile();
}

// const megamenuEl = document.querySelector('.mega-menu__container');
//
// if (megamenuEl) {
//   new initMegaMenu(megamenuEl);
// }

const shadowRoot = document.querySelector('body > div:first-child').shadowRoot;
const megamenuEl = shadowRoot.querySelector('.mega-menu__container');

if (megamenuEl) {
  new initMegaMenu(megamenuEl);
}
