import {createElement} from '../render.js';
const createBtnShowMore = () =>  '<button class="films-list__show-more">Show more</button>';

export default class BtnShowMoreView {
  #element = null;

  get elem() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createBtnShowMore();
  }

  removeElement() {
    this.#element = null;
  }
}
