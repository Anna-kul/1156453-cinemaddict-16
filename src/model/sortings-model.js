import AbstractModel, {ChangeType} from './abstract-model';
import {Sorting} from './movies-model';

export default class SortingsModel extends AbstractModel {
  _data = {
    sorting: Sorting.DEFAULT,
  }

  get sorting() {
    return this._data.sorting;
  }

  set sorting(sorting) {
    if (sorting === this.sorting) {
      return;
    }

    this._data.sorting = sorting;

    this._notifyObservers(ChangeType.MAJOR);
  }
}
