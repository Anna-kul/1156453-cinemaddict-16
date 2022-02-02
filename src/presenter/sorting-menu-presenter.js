import {remove, render, RenderPosition} from '../utils/render.js';
import SortingMenuView from '../view/sorting-menu-view';
import {Screen} from '../model/screens-model';
import {Sorting} from '../model/movies-model';
import {Filter} from '../model/movies-model';

const AVAILABLE_SCREENS = [
  Screen.ALL_MOVIES,
  Screen.FAVORITES,
  Screen.HISTORY,
  Screen.WATCHLIST,
];

const SORTING_MENU_ITEMS = [
  {
    id: Sorting.DEFAULT,
    title: 'Sort by default',
    active: true,
  },
  {
    id: Sorting.DATE,
    title: 'Sort by date',
  },
  {
    id: Sorting.RATING,
    title: 'Sort by rating',
  }
];

export default class SortingMenuPresenter {
  #root = null;

  #sortingMenuView = null;

  #screensModel = null;
  #sortingsModel = null;
  #moviesModel = null;
  #filtersModel = null;

  constructor(root, sortingsModel, moviesModel, filtersModel, screensModel){
    this.#root = root;
    this.#screensModel = screensModel;
    this.#sortingsModel = sortingsModel;
    this.#moviesModel = moviesModel;
    this.#filtersModel = filtersModel;
    this.#sortingMenuView = new SortingMenuView({items: SORTING_MENU_ITEMS});
  }

  init = () => {
    this.#screensModel.addObserver(this.#handleScreensModelChange);
    this.#sortingsModel.addObserver(this.#handleSortingsModelChange);

    this.#sortingMenuView.setItemClickHandler(this.#handleSortingMenuItemClick);

    if (!AVAILABLE_SCREENS.includes(this.#screensModel.screen)) {
      return;
    }

    const movies = this.#selectMovies();

    if (movies.length === 0) {
      return;
    }

    render(this.#root, this.#sortingMenuView, RenderPosition.BEFOREBEGIN);
  }

  #reinit = () => {
    const movies = this.#selectMovies();

    if (movies.length === 0) {
      return;
    }

    render(this.#root, this.#sortingMenuView, RenderPosition.BEFOREBEGIN);
  }

  #clear = () => {
    remove(this.#sortingMenuView);
  }

  #selectMovies = () => {
    let movies = this.#moviesModel.movies;

    switch (this.#filtersModel.filter) {
      case Filter.WATCHLIST:
        movies = movies.filter(({isWatchlist}) => isWatchlist);
        break;

      case Filter.HISTORY:
        movies = movies.filter(({isWatched}) => isWatched);
        break;

      case Filter.FAVORITES:
        movies = movies.filter(({isFavorite}) => isFavorite);
    }

    return movies;
  }

  #handleSortingsModelChange = () => {
    this.#sortingMenuView.updateData({activeItemId: this.#sortingsModel.sorting});
  }

  #handleScreensModelChange = () => {
    if (this.#screensModel.screen !== this.#screensModel.prevScreen && AVAILABLE_SCREENS.includes(this.#screensModel.screen)) {
      this.#reinit();

      this.#sortingsModel.sorting = Sorting.DEFAULT;

      return;
    }

    this.#clear();
  }

  #handleSortingMenuItemClick = (activeItemId) => {
    this.#sortingsModel.sorting = activeItemId;
  }
}
