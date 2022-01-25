import AbstractView  from './abstract-view.js';
export default class MenuNavigationView extends AbstractView {
  #siteMenu = null;

  constructor (siteMenu) {
    super();
    this.#siteMenu = siteMenu;
  }

  get template() {

    return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
    ${this.#siteMenu.reduce((htmlString, item) => {
      htmlString += `<a id="${item.id}" href="#" class="main-navigation__item">${item.title} <span class="main-navigation__item-count">${item.count}</span></a>`;

      return htmlString;
    }, '')}
    </div>
    <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
  </nav>`;
  }

  filterLinkClickHandler = (evt) => {
    evt.preventDefault();

    const filterLink = evt.target;

    this._callback.filterLink(filterLink.id);
  }

  setFilterLinkClickHandler = (handler) => {
    this._callback.filterLink = handler;

    this.elem.querySelectorAll('.main-navigation__item').forEach((filterLink) => {
      filterLink.addEventListener('click', this.filterLinkClickHandler);
    });
  }

}
