import MovieListView from '../view/movie-list-view.js';
import BtnShowMoreView from '../view/btn-show-more-view.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {MoviePresenter} from './movie-presenter.js';
import LoadingView from '../view/loading-view.js';
import NoMoviesStubView, {NoMoviesStubViewVariant} from '../view/no-movies-stub-view/no-movies-stub-view.js';
import {Screen} from '../model/screens-model';
import {Filter, Sorting} from '../model/movies-model';
import MoviePopupView from '../view/movie-popup-view/movie-popup-view';
import {ChangeType} from '../model/abstract-model';

const AVAILABLE_SCREENS = [
  Screen.ALL_MOVIES,
  Screen.FAVORITES,
  Screen.HISTORY,
  Screen.WATCHLIST,
];

const noMoviesStubViewVariantByFilter = {
  [Filter.ALL]: NoMoviesStubViewVariant.NO_MOVIES_IN_DB,
  [Filter.FAVORITES]: NoMoviesStubViewVariant.NO_FAVORITE_MOVIES,
  [Filter.WATCHLIST]: NoMoviesStubViewVariant.NO_MOVIES_TO_WATCH_NOW,
  [Filter.HISTORY]: NoMoviesStubViewVariant.NO_WATCHED_MOVIES,
};

export default class MovieListPresenter {
    static MOVIES_PER_LOAD_AMOUNT = 5;

    #root = null;

    #initedMoviePresenters = 0;

    #btnShowMoreView = null;
    #movieListView = new MovieListView();
    #loadingView = new LoadingView();
    #noMoviesStubView = null;
    #moviePopupView = new MoviePopupView();

    #moviePresenter = new Map();

    #moviesModel = null;
    #commentsModel = null;
    #filtersModel = null;
    #sortingsModel = null;
    #screensModel = null;

    constructor(root, moviesModel, commentsModel, filtersModel, sortingsModel, screensModel) {
      this.#root = root;
      this.#moviesModel = moviesModel;
      this.#commentsModel = commentsModel;
      this.#filtersModel = filtersModel;
      this.#sortingsModel = sortingsModel;
      this.#screensModel = screensModel;

      this.#noMoviesStubView = new NoMoviesStubView({variant: this.#selectNoMoviesStubViewVariant()});
    }

    initMoviePresenters() {
      const filmListContainer = this.#movieListView.elem.querySelector('.films-list__container');

      const movies = this.#selectMovies();

      for (let i = this.#initedMoviePresenters; i < this.#initedMoviePresenters + 5; i++) {
        if(i >= movies.length) {
          this.#initedMoviePresenters = movies.length;
          break;
        }

        const moviePresenter = new MoviePresenter(
          filmListContainer,
          this.#moviesModel,
          this.#commentsModel,
        );

        moviePresenter.init(movies[i]);

        this.#moviePresenter.set(movies[i].id, moviePresenter);
      }

      this.#initedMoviePresenters += 5;
    }

    initBtnShowMoreView() {
      const movies = this.#selectMovies();

      if (movies.length > MovieListPresenter.MOVIES_PER_LOAD_AMOUNT) {
        this.#btnShowMoreView = new BtnShowMoreView();
        this.#btnShowMoreView.setClickHandler(this.#handleBtnShowMoreViewClick);

        render(this.#root, this.#btnShowMoreView, RenderPosition.BEFOREEND);
      }
    }

    init = () => {
      this.#screensModel.addObserver(this.#handleScreensModelChange);
      this.#sortingsModel.addObserver(this.#handleSortingsModelChange);
      this.#moviesModel.addObserver(this.#handleMoviesModelMajorChange);

      if (!AVAILABLE_SCREENS.includes(this.#screensModel.screen)) {
        return;
      }

      const movies = this.#selectMovies();

      if (movies.length === 0) {
        this.#renderNoMoviesStubView();

        return;
      }

      render(this.#root, this.#movieListView, RenderPosition.BEFOREEND);

      this.initMoviePresenters();
      this.initBtnShowMoreView();
    }

    clear() {
      this.#moviePresenter.forEach((presenter) => presenter.destroy());
      this.#moviePresenter.clear();
      remove(this.#btnShowMoreView);
      remove(this.#loadingView);
      remove(this.#noMoviesStubView);
      remove(this.#movieListView);

      this.#initedMoviePresenters = 0;
    }

    #selectNoMoviesStubViewVariant = () => noMoviesStubViewVariantByFilter[this.#filtersModel.filter];

    #renderNoMoviesStubView = () => {
      remove(this.#movieListView);
      render(this.#root, this.#noMoviesStubView, RenderPosition.BEFOREEND);

      this.#noMoviesStubView.updateData({variant: this.#selectNoMoviesStubViewVariant()});
    }

    #reinit = () => {
      this.clear();

      const movies = this.#selectMovies();

      if (movies.length === 0) {
        this.#renderNoMoviesStubView();

        return;
      }

      render(this.#root, this.#movieListView, RenderPosition.BEFOREEND);

      this.initMoviePresenters();
      this.initBtnShowMoreView();
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

      switch (this.#sortingsModel.sorting) {
        case Sorting.DATE:
          movies.sort(({releaseDate: aReleaseDate}, {releaseDate: bReleaseDate}) => bReleaseDate.getTime() - aReleaseDate.getTime());
          break;

        case Sorting.RATING:
          movies.sort(({rating: aRating}, {rating: bRating}) => Number(bRating) - Number(aRating));
      }

      return movies;
    }

    #handleMoviesModelMajorChange = (_, changeType) => {
      if (changeType !== ChangeType.MAJOR) {
        return;
      }

      this.#reinit();
    }

    #handleSortingsModelChange = () => {
      this.#reinit();
    }

    #handleScreensModelChange = () => {
      if (AVAILABLE_SCREENS.includes(this.#screensModel.screen)) {
        this.#reinit();

        return;
      }

      this.clear();
    }

    #handleBtnShowMoreViewClick = () => {
      this.initMoviePresenters();

      const movies = this.#selectMovies();

      if(this.#initedMoviePresenters >= movies.length){
        remove(this.#btnShowMoreView);
      }
    }
}

