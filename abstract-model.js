export default class AbstractModel {
    #observers = new Set();
    _data = null;

    constructor(data) {
      if (new.target === AbstractModel) {
        throw new Error('Can\'t instantiate AbstractModel, only concrete one.');
      }

      this._data = data;
    }

    addObserver(observer) {
      this.#observers.add(observer);
    }

    removeObserver(observer) {
      this.#observers.delete(observer);
    }

    _notifyObservers(changeType) {
      this.#observers.forEach((observer) => {
        observer(this._data, changeType);
      });
    }
}
