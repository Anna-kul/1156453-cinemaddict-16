import {createElement} from '../render.js';
export default class MenuNavigationView{
  #element = null;
  #siteMenu = null;
  constructor (siteMenu) {
    this.#siteMenu = siteMenu;
  }

  get template() {

    return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
    ${this.#siteMenu.reduce((htmlString, item) => {
      htmlString += `<a href="#watchlist" class="main-navigation__item">${item.title} <span class="main-navigation__item-count">${item.count}</span></a>`;

      return htmlString;
    }, '')}
    </div>
    <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
  </nav>`;
  }

  get elem() {
    // если элемент не найден, создаем новый элемент
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElem() {
    this.#element = null;
  }
}

export class FilterMenuView {
  #element = null;
  #filter = null;

  constructor(filter){
    this.#filter = filter;
  }

  get template() {

    return `<ul class="sort">
  ${this.#filter.reduce((htmlString, item) => {
      htmlString += `<li><a href="#" class="sort__button${item.active ? ' sort__button--active': ''}">${item.title}</a></li>`;
      return htmlString;
    }, '')}
 
</ul>`;
  }

  get elem() {
    // если элемент не найден, создаем новый элемент
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElem() {
    this.#element = null;
  }
}
