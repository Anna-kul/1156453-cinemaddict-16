import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView {
    _data = {};

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  updateElement = () => {
    const prevElement = this.elem;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.elem;

    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  updateData = (update) => {
    if (!update) {
      return;
    }

    console.log('View.updateData', update);

    this._data = {...this._data, ...update};

    this.updateElement();
  }
}
