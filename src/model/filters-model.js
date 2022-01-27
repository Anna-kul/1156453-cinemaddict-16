import AbstractModel from './abstract-model';
import {ChangeType} from '../utils/const.js';

export default class FiltersModel extends AbstractModel {
  set filters(filters) {
    this._data = filters;

    this._notifyObservers(ChangeType.MAJOR);
  }

  get filters() {
    return this._data;
  }
}
