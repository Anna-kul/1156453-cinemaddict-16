export const createNavigationMenuTemplate = (siteMenu) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
  ${siteMenu.reduce((htmlString, item) => {
    htmlString += `<a href="#watchlist" class="main-navigation__item">${item.title} <span class="main-navigation__item-count">${item.count}</span></a>`;
    return htmlString;
  }, '')}
    </div>
    <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
  </nav>`
);
export const createFilterTemplate = (filter) => (
  `<ul class="sort">
  ${filter.reduce((htmlString, item) => {
    htmlString += `<li><a href="#" class="sort__button${item.active ? ' sort__button--active': ''}">${item.title}</a></li>`;
    return htmlString;
  }, '')}
 
</ul>`
);

