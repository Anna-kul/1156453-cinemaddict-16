export const ChangeType = {
  MINOR: 'minor',
  MAJOR: 'major',
};

export const ChangeTarget = {
  SERVICE: 'service',
  CACHE: 'cache',
};

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

    _notifyObservers(events, changeType) {
      this.#observers.forEach((observer) => {
        observer(this._data, events, changeType);
      });
    }
}
