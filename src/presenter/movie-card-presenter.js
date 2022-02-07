import {render, RenderPosition, replace, remove} from '../utils/render.js';
import MovieCardView from '../view/movie-card-view/movie-card-view.js';
import {ChangeType} from '../model/abstract-model';

export default class MovieCardPresenter {
  #root = null;

  #movie = null;

  #movieCardView = null;

  #moviesModel = null;

  #moviePopupPresenter = null;

  constructor(root, moviesModel, moviePopupPresenter){
    this.#root = root;
    this.#moviesModel = moviesModel;
    this.#moviePopupPresenter = moviePopupPresenter;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMovieCardView = this.#movieCardView;

    this.#moviesModel.addObserver(this.#handleMoviesModelMinorChange);

    this.#movieCardView = new MovieCardView(this.#movie);

    this.#movieCardView.setPosterClickHandler(this.#handleMoviePopupOpenerClick);
    this.#movieCardView.setTitleClickHandler(this.#handleMoviePopupOpenerClick);
    this.#movieCardView.setAddToFavoritesButtonClickHandler(this.#handleAddToFavoritesButtonClick);
    this.#movieCardView.setAddToAlreadyWatchedButtonClickHandler(this.#handleAddToAlreadyWatchedButtonClick);
    this.#movieCardView.setAddToWatchlistButtonClickHandler(this.#handleAddToWatchlistButtonClick);
    this.#movieCardView.setCommentsLinkClickHandler(this.#handleMoviePopupOpenerClick);

    if (prevMovieCardView === null) {
      render(this.#root, this.#movieCardView, RenderPosition.BEFOREEND);

      return;
    }

    replace(this.#movieCardView, prevMovieCardView);
    remove(prevMovieCardView);
  }

  destroy = () => {
    remove(this.#movieCardView);

    this.#moviesModel.removeObserver(this.#handleMoviesModelMinorChange);
  }

  #handleMoviesModelMinorChange = (_, __, changeType) => {
    if (changeType !== ChangeType.MINOR) {
      return;
    }

    const movie = this.#moviesModel.getMovie(this.#movie.id);

    let isMovieUpdated = false;

    for (const [newMovieKey, newMovieValue] of Object.entries(movie)) {
      if (this.#movie[newMovieKey] !== newMovieValue) {
        isMovieUpdated = true;

        break;
      }
    }

    if (!isMovieUpdated) {
      return;
    }

    this.#movie = movie;

    this.#movieCardView.updateData({movie});
  }

  #handleMoviePopupOpenerClick = () => {
    this.#moviePopupPresenter.init(this.#movie);
  }

  #handleAddToFavoritesButtonClick = () => {
    this.#moviesModel.updateMovie(this.#movie.id, {isFavorite: !this.#movie.isFavorite});
  }

  #handleAddToAlreadyWatchedButtonClick = () => {
    const toggledIsWatched = !this.#movie.isWatched;
    const watchingDate = toggledIsWatched ? new Date() : null;

    this.#moviesModel.updateMovie(this.#movie.id, {isWatched : toggledIsWatched, watchingDate});
  }

  #handleAddToWatchlistButtonClick = () => {
    this.#moviesModel.updateMovie(this.#movie.id, {isWatchlist: !this.#movie.isWatchlist});
  }
}
