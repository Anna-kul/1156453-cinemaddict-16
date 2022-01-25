import AbstractView from './abstract-view';
export default class SortingMenuView extends AbstractView {
    #sortings = null;

    constructor(sortings){
      super();
      this.#sortings = sortings;
    }

    get template() {
      return `<ul class="sort">
    ${this.#sortings.reduce((htmlString, item) => {
        htmlString += `<li><a href="#" class="sort__button${item.active ? ' sort__button--active': ''}" id="${item.id}">${item.title}</a></li>`;
        return htmlString;
      }, '')}
   
  </ul>`;
    }

    sortingLinkClickHandler = (evt) => {
      evt.preventDefault();

      const sortingLink = evt.target;

      this._callback.sortingLink(sortingLink.id);
    }

    setSorgingLinkClickHandler = (handler) => {
      this._callback.sortingLink = handler;

      this.elem.querySelectorAll('.sort__button').forEach((sortingLink) => {
        sortingLink.addEventListener('click', this.sortingLinkClickHandler);
      });
    }
}

