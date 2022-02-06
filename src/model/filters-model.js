import AbstractModel, {ChangeType} from './abstract-model';

import {Filter} from './movies-model';

export default class FiltersModel extends AbstractModel {
  _data = {
    filter: Filter.ALL,
  }

  get filter() {
    return this._data.filter;
  }

  set filter(filter) {
    this._data.filter = filter;
    this._notifyObservers(ChangeType.MAJOR);
  }
}
