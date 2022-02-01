import SmartView  from './smart-view.js';
import {Screen} from '../model/screens-model';

const ITEM_CLASS_NAME = 'main-navigation__item';

export default class NavigationMenuView extends SmartView {
  _data = {items: [], activeItemId: null};

  constructor ({items, activeItemId}) {
    super();

    this._data.items = items;

    this._data.activeItemId = activeItemId;
  }

  /*
    Переключение экрана с подсветкой ссылки
   */
  get template() {
    const {items, activeItemId} = this._data;

    return (
      `<nav class="main-navigation">
        <div class="main-navigation__items">
          <a href="#${Screen.ALL_MOVIES}" id="${Screen.ALL_MOVIES}" class="main-navigation__item main-navigation__item--first ${activeItemId === Screen.ALL_MOVIES ? 'main-navigation__item--active' : ''}">All movies</a>
        ${items.reduce((htmlString, item) => {
        htmlString += (
          `<a
            id="${item.id}"
            href="#${item.id}"
            class="main-navigation__item ${activeItemId === item.id ? 'main-navigation__item--active' : ''}"
          >
            ${item.title}
            <span class="main-navigation__item-count">${item.count}</span>
          </a>`
        );

        return htmlString;
      }, '')}
          <a href="#${Screen.STATS}" id="${Screen.STATS}" class="main-navigation__item main-navigation__item--last ${activeItemId === Screen.STATS ? 'main-navigation__item--active' : ''}">Stats</a>
        </div>
      </nav>`
    );
  }

  #itemClickHandler = (evt) => {
    if (!evt.target.classList.contains(ITEM_CLASS_NAME)) {
      return;
    }

    evt.preventDefault();

    if (this._callback.itemClickHandler === undefined) {
      return;
    }

    this._callback.itemClickHandler(evt.target.id);
  }

  setItemClickHandler = (handler) => {
    this._callback.itemClickHandler = handler;

    this.elem.addEventListener('click', this.#itemClickHandler);
  }

  restoreHandlers() {
    this.elem.addEventListener('click', this.#itemClickHandler);
  }
}
