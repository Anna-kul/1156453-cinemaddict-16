import AbstractView from './abstract-view';
export class SortingMenuView extends AbstractView {
    #filter = null;

    constructor(filter){
      super();
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
}

