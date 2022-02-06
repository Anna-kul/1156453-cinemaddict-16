import AbstractView  from './abstract-view.js';

const createBtnShowMore = () =>  '<button class="films-list__show-more">Show more</button>';

export default class BtnShowMoreView extends AbstractView {
  get template() {
    return createBtnShowMore();
  }

  setClickHandler = (handler) => {
    this._callback.clickHandler = handler;

    this.elem.addEventListener('click', this.#handleClick);
  }

  #handleClick = (evt) => {
    evt.preventDefault();

    if (this._callback.clickHandler === undefined) {
      return;
    }

    this._callback.clickHandler();
  }
}

