import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView {
  _data = {};

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  updateElement() {
    const scrollTop = this.elem.scrollTop;
    const prevElement = this.elem;
    const parent = prevElement.parentElement;

    this.removeElement();

    const newElement = this.elem;

    parent.replaceChild(newElement, prevElement);

    this.elem.scrollTop = scrollTop;

    this.restoreHandlers();
  }

  updateData = (update) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    this.updateElement();
  }
}
