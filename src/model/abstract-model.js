export const ChangeType = {
  MINOR: 'minor',
  MAJOR: 'major',
};

export default class AbstractModel {
    #observers = new Set();
    _data = null;

    constructor(data) {
      if (new.target === AbstractModel) {
        throw new Error('Can\'t instantiate AbstractModel, only concrete one.');
      }

      this._data = data;

      window[this.constructor.name] = this;
    }

    addObserver(observer) {
      this.#observers.add(observer);
    }

    removeObserver(observer) {
      this.#observers.delete(observer);
    }

    _notifyObservers(changeType) {
      console.log('Model Event', this.constructor.name);
      this.#observers.forEach((observer) => {
        observer(this._data, changeType);
      });
    }
}
