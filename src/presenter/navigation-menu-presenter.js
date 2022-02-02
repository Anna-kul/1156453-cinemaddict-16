import {render, RenderPosition} from '../utils/render.js';
import {ChangeType} from '../model/abstract-model';
import {Filter} from '../model/movies-model';
import {Screen} from '../model/screens-model';
import NavigationMenuView from '../view/navigation-menu-view';

const filterByScreen = {
  [Screen.ALL_MOVIES]: Filter.ALL,
  [Screen.HISTORY]: Filter.HISTORY,
  [Screen.WATCHLIST]: Filter.WATCHLIST,
  [Screen.FAVORITES]: Filter.FAVORITES,
  [Screen.STATS]: Filter.HISTORY,
};

export default class NavigationMenuPresenter {
  #root = null;

  #navigationMenuView = null;

  #filtersModel = null;
  #moviesModel = null;
  #screensModel = null;

  constructor(root, filtersModel, moviesModel, screensModel){
    this.#root = root;
    this.#filtersModel = filtersModel;
    this.#moviesModel = moviesModel;
    this.#screensModel = screensModel;

    this.#navigationMenuView = new NavigationMenuView({items: this.#selectNavigationMenuItems(), activeItemId: Screen.ALL_MOVIES});
  }

  init = () => {
    this.#filtersModel.addObserver(this.#handleFiltersModelMinorChange);
    this.#moviesModel.addObserver(this.#handleMoviesModelChange);
    this.#screensModel.addObserver(this.#handleScreensModelChange);

    this.#navigationMenuView.setItemClickHandler(this.#handleMenuLinkClickHandler);

    render(this.#root, this.#navigationMenuView, RenderPosition.BEFOREBEGIN);
  }

  #handleFiltersModelMinorChange = (_, changeType) => {
    if (changeType !== ChangeType.MINOR) {
      return;
    }

    this.#navigationMenuView.updateData({
      filters: this.#filtersModel.filters,
    });
  }

  #handleScreensModelChange = () => {
    this.#filtersModel.filter = filterByScreen[this.#screensModel.screen];

    this.#navigationMenuView.updateData({
      activeItemId: this.#screensModel.screen,
    });
  }

  #selectNavigationMenuItems = () => [
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

  #handleMoviesModelChange = () => {
    this.#navigationMenuView.updateData({items: this.#selectNavigationMenuItems()});
  }

  #handleMenuLinkClickHandler = (activeItemId) => {
    this.#screensModel.screen = activeItemId;
  }
}
