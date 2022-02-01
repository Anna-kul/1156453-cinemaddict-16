import AbstractModel, {ChangeType} from './abstract-model';

import {Filter} from './movies-model';

export default class FiltersModel extends AbstractModel {
  _data = {
    filter: Filter.ALL,
  }

  get filter() {
    return this._data.filter;
  }

  set filter(filterId) {
    this._data.filter = filterId;
    this._notifyObservers(ChangeType.MAJOR);
  }
}
