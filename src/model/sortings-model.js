import AbstractModel, {ChangeType} from './abstract-model';

export default class SortingsModel extends AbstractModel {
  _data = {
    sorting: null,
  }

  get sorting() {
    return this._data.sorting;
  }

  set sorting(sortingId) {
    if (sortingId === this.sorting) {
      return;
    }

    this._data.sorting = sortingId;

    this._notifyObservers(ChangeType.MAJOR);
  }
}
