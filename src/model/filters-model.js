import AbstractModel from './abstract-model';
import {ChangeType} from '../utils/const.js';

export const Filter = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};
export default class FiltersModel extends AbstractModel {
  #moviesModel = null;

  _data = {
    active: null,
    list: [
      {
        id: Filter.WATCHLIST,
        title: 'Watchlist',
        count: 0,
      },
      {
        id: Filter.HISTORY,
        title: 'History',
        count: 0,
      },
      {
        id: Filter.FAVORITES,
        title: 'Favorites',
        count: 0,
      }
    ],
  };

  constructor(moviesModel) {
    super();

    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleMoviesModelChange);
  }

  get filters() {
    return this._data.list;
  }

  get activeFilter() {
    return this._data.active;
  }

  set filters(filters) {
    this._data.list = filters;

    this._notifyObservers(ChangeType.MAJOR);
  }

  set activeFilter(filterId) {
    this._data.active = filterId;
    this._notifyObservers(ChangeType.MAJOR);
  }

  #handleMoviesModelChange = () => {
    this._data.list = [
      {
        id: Filter.WATCHLIST,
        title: 'Watchlist',
        count: this.#moviesModel.movies.filter((film) => film.isWatchlist).length
      },
      {
        id: Filter.HISTORY,
        title: 'History',
        count: this.#moviesModel.movies.filter((film) => film.isWatched).length
      },
      {
        id: Filter.FAVORITES,
        title: 'Favorites',
        count: this.#moviesModel.movies.filter((film) => film.isFavorite).length
      }
    ];

    this._notifyObservers(ChangeType.MINOR);
  }
}
