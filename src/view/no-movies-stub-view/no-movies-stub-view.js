import SmartView from '../smart-view';

import createNoMoviesStubViewTemplate from './template';

export const NoMoviesStubViewVariant = {
  NO_MOVIES_IN_DB: 'NO_MOVIES_IN_DB',
  NO_MOVIES_TO_WATCH_NOW: 'NO_MOVIES_TO_WATCH_NOW',
  NO_WATCHED_MOVIES: 'NO_WATCHED_MOVIES',
  NO_FAVORITE_MOVIES: 'NO_FAVORITE_MOVIES',
};

export default class NoMoviesStubView extends SmartView {
  _data = {variant: NoMoviesStubViewVariant.NO_MOVIES_IN_DB}

  constructor({variant}) {
    super();

    this._data.variant = variant;
  }

  get template() {
    const {variant} = this._data;

    return createNoMoviesStubViewTemplate(variant);
  }

  restoreHandlers() {}
}

