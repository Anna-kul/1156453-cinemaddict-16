import FilmListContainerView from '../view/film-list-container-view.js';
import BtnShowMoreView from '../view/btn-show-more-view.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {MoviePresenter} from './movie-presenter.js';
import LoadingView from '../view/loading-view.js';
import NoMoviesStubView from '../view/no-movies-stub-view.js';

export default class MovieListPresenter {
    static MOVIEWS_PER_LOAD_AMOUNT = 5;

    #root = null;

    #initedMoviePresenters = 0;

    #btnShowMore = null;
    #movieListContainerView = new FilmListContainerView();
    #loadingView = new LoadingView();
    #noMoviesStubView = new NoMoviesStubView();

    #moviePresenter = new Map();

    #moviesModel = null;

    constructor(root, _, moviesModel){
      this.#root = root;
      this.#moviesModel = moviesModel;
    }

    initMoviePresenters() {
      const filmListContainer = this.#movieListContainerView.elem.querySelector('.films-list__container');
      for (let i = this.#initedMoviePresenters; i < this.#initedMoviePresenters + 5; i++) {
        //если фильмов не осталось, то не выводить
        if(i >= this.#moviesModel.movies.length) {
          this.#initedMoviePresenters = this.#moviesModel.movies.length;
          break;
        }

        const moviePresenter = new MoviePresenter(
          filmListContainer,
          this.#moviesModel,
        );
        moviePresenter.init(this.#moviesModel.movies[i].id);
        this.#moviePresenter.set(this.#moviesModel.movies[i].id, moviePresenter);
      }
      this.#initedMoviePresenters += 5;
    }

    initBtnShowMoreView() {
      if (this.#moviesModel.movies.length > MovieListPresenter.MOVIEWS_PER_LOAD_AMOUNT) {
        this.#btnShowMore = new BtnShowMoreView();
        this.#btnShowMore.setClickHandler(this.#handleBtnShowMoreViewClick);

        render(this.#root, this.#btnShowMore, RenderPosition.BEFOREEND);
      }
    }

    init = () => {
      this.#moviesModel.addObserver(this.#handleMovieModelChange);

      if (this.#moviesModel.movies.length === 0) {
        this.#renderNoMoviesStubView();

        return;
      }

      render(this.#root, this.#movieListContainerView, RenderPosition.BEFOREEND);

      this.initMoviePresenters();
      this.initBtnShowMoreView();
    }

    clear() {
      this.#moviePresenter.forEach((presenter) => presenter.destroy());
      this.#moviePresenter.clear();
      remove(this.#btnShowMore);
      remove(this.#loadingView);
      remove(this.#noMoviesStubView);

      this.#initedMoviePresenters = 0;
    }

    #renderNoMoviesStubView = () => {
      remove(this.#movieListContainerView);
      render(this.#root, this.#noMoviesStubView, RenderPosition.BEFOREEND);
    }

    #handleMovieModelChange = () => {
      this.clear();

      if (this.#moviesModel.movies.length === 0) {
        this.#renderNoMoviesStubView();

        return;
      }

      render(this.#root, this.#movieListContainerView, RenderPosition.BEFOREEND);
      this.initMoviePresenters();
      this.initBtnShowMoreView();
    }

    #handleBtnShowMoreViewClick = () => {
      this.initMoviePresenters();
      // если все фильмы выведены удалить кнопку
      if(this.#initedMoviePresenters >= this.#moviesModel.movies.length){
        remove(this.#btnShowMore);
      }
    }
}

