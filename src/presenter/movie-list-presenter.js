import MovieListView from '../view/movie-list-view.js';
import BtnShowMoreView from '../view/btn-show-more-view.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import MovieCardPresenter from './movie-card-presenter';
import LoadingView from '../view/loading-view.js';
import NoMoviesStubView, {NoMoviesStubViewVariant} from '../view/no-movies-stub-view/no-movies-stub-view.js';
import {Screen} from '../model/screens-model';
import {Filter, MoviesModelEvent} from '../model/movies-model';
import {ChangeType} from '../model/abstract-model';
import MoviePopupPresenter from './movie-popup-presenter';

const AVAILABLE_SCREENS = [
  Screen.ALL_MOVIES,
  Screen.FAVORITES,
  Screen.HISTORY,
  Screen.WATCHLIST,
];

const MOVIES_PER_LOAD_AMOUNT = 5;

const noMoviesStubViewVariantByFilter = {
  [Filter.ALL]: NoMoviesStubViewVariant.NO_MOVIES_IN_DB,
  [Filter.FAVORITES]: NoMoviesStubViewVariant.NO_FAVORITE_MOVIES,
  [Filter.WATCHLIST]: NoMoviesStubViewVariant.NO_MOVIES_TO_WATCH_NOW,
  [Filter.HISTORY]: NoMoviesStubViewVariant.NO_WATCHED_MOVIES,
};

export default class MovieListPresenter {
    #root = null;

    #btnShowMoreView = null;
    #movieListView = new MovieListView();
    #loadingView = new LoadingView();
    #noMoviesStubView = null;

    #movieCardPresenters = new Map();

    #moviesModel = null;
    #commentsModel = null;
    #filtersModel = null;
    #sortingsModel = null;
    #screensModel = null;

    #moviePopupPresenter = null;

    constructor(root, moviesModel, commentsModel, filtersModel, sortingsModel, screensModel) {
      this.#root = root;
      this.#moviesModel = moviesModel;
      this.#commentsModel = commentsModel;
      this.#filtersModel = filtersModel;
      this.#sortingsModel = sortingsModel;
      this.#screensModel = screensModel;

      this.#moviePopupPresenter = new MoviePopupPresenter(document.body, this.#moviesModel, this.#commentsModel);

      this.#noMoviesStubView = new NoMoviesStubView({variant: this.#selectNoMoviesStubViewVariant()});
    }

    init = () => {
      this.#filtersModel.addObserver(this.#handleFiltersModelChange);
      this.#sortingsModel.addObserver(this.#handleSortingsModelChange);
      this.#moviesModel.addObserver(this.#handleMoviesModelMajorChange);

      if (!AVAILABLE_SCREENS.includes(this.#screensModel.screen)) {
        return;
      }

      const movies = this.#moviesModel.getMovies({
        filter: this.#filtersModel.filter, sorting: this.#sortingsModel.sorting
      });

      if (movies.length === 0) {
        this.#renderNoMoviesStubView();

        return;
      }

      render(this.#root, this.#movieListView, RenderPosition.BEFOREEND);

      this.#initMoviePresenters();
      this.#initBtnShowMoreView();
    }

    #reinit = () => {
      this.#clear();

      const movies = this.#moviesModel.getMovies({
        filter: this.#filtersModel.filter, sorting: this.#sortingsModel.sorting
      });

      if (movies.length === 0) {
        this.#renderNoMoviesStubView();

        return;
      }

      render(this.#root, this.#movieListView, RenderPosition.BEFOREEND);

      this.#initMoviePresenters();
      this.#initBtnShowMoreView();
    }

    #clear = () => {
      this.#movieCardPresenters.forEach((presenter) => presenter.destroy());
      this.#movieCardPresenters.clear();
      remove(this.#btnShowMoreView);
      remove(this.#loadingView);
      remove(this.#noMoviesStubView);
      remove(this.#movieListView);
    }

    #initMoviePresenters = () => {
      const filmListContainer = this.#movieListView.elem.querySelector('.films-list__container');

      const movies = this.#moviesModel.getMovies({
        filter: this.#filtersModel.filter, sorting: this.#sortingsModel.sorting
      });

      movies.slice(this.#movieCardPresenters.size, this.#movieCardPresenters.size + MOVIES_PER_LOAD_AMOUNT).forEach((movie) => {
        const movieCardPresenter = new MovieCardPresenter(
          filmListContainer,
          this.#moviesModel,
          this.#moviePopupPresenter,
        );

        movieCardPresenter.init(movie);

        this.#movieCardPresenters.set(movie.id, movieCardPresenter);
      });
    }

    #initBtnShowMoreView = () => {
      const movies = this.#moviesModel.getMovies({
        filter: this.#filtersModel.filter, sorting: this.#sortingsModel.sorting
      });

      if (movies.length > MOVIES_PER_LOAD_AMOUNT) {
        this.#btnShowMoreView = new BtnShowMoreView();
        this.#btnShowMoreView.setClickHandler(this.#handleBtnShowMoreViewClick);

        render(this.#root, this.#btnShowMoreView, RenderPosition.BEFOREEND);
      }
    }

    #selectNoMoviesStubViewVariant = () => noMoviesStubViewVariantByFilter[this.#filtersModel.filter];

    #renderNoMoviesStubView = () => {
      remove(this.#movieListView);
      render(this.#root, this.#noMoviesStubView, RenderPosition.BEFOREEND);

      this.#noMoviesStubView.updateData({variant: this.#selectNoMoviesStubViewVariant()});
    }

    #handleMoviesModelMajorChange = (_, events, changeType) => {
      if (changeType !== ChangeType.MAJOR && events.includes(MoviesModelEvent.UPDATE_MOVIE_COMMENTS)) {
        return;
      }

      this.#reinit();
    }

    #handleSortingsModelChange = () => {
      this.#reinit();
    }

    #handleFiltersModelChange = () => {
      if (AVAILABLE_SCREENS.includes(this.#screensModel.screen)) {
        this.#reinit();

        return;
      }

      this.#clear();
    }

    #handleBtnShowMoreViewClick = () => {
      this.#initMoviePresenters();

      const movies = this.#moviesModel.getMovies({
        filter: this.#filtersModel.filter, sorting: this.#sortingsModel.sorting
      });

      if (this.#movieCardPresenters.size >= movies.length){
        remove(this.#btnShowMoreView);
      }
    }
}

