import SmartView from './smart-view';

export default class SortingMenuView extends SmartView {
    _data = {items: [], activeItemId: null};

    constructor({items}){
      super();

      this._data.items = items;

      const [firstItem] = items;

      this._data.activeItemId = firstItem.id;
    }

    get template() {
      const {items, activeItemId} = this._data;
      return (
        `<ul class="sort">
            ${items.reduce((htmlString, item) => `${htmlString
        }<li>
            <a href="#" class="sort__button ${item.id === activeItemId ? 'sort__button--active' : ''}" id="${item.id}">
              ${item.title}
            </a>
          </li>`, '')}
        </ul>`
      );
    }

    setItemClickHandler = (handler) => {
      this._callback.itemClickHandler = handler;

      this.elem.addEventListener('click', this.#itemClickHandler);
    }

    #itemClickHandler = (evt) => {
      if (!evt.target.classList.contains('sort__button')) {
        return;
      }

      evt.preventDefault();

      if (this._callback.itemClickHandler === undefined) {
        return;
      }

      this._callback.itemClickHandler(evt.target.id);
    }

    removeElement() {
      this.elem.removeEventListener('click', this.#itemClickHandler);

      super.removeElement();
    }

    restoreHandlers() {
      this.elem.addEventListener('click', this.#itemClickHandler);
    }
}

