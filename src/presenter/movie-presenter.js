import {render, RenderPosition, replace, remove} from '../utils/render.js';
import MovieCardView from '../view/movie-card-view/movie-card-view.js';
import MoviePopupView from '../view/movie-popup-view/movie-popup-view.js';

/**
 * Имя класса для body, с помощью которого убирается вертикальная полоса прокрутки
 */
const HIDE_OVERFLOW_CLASS_NAME = 'hide-overflow';

export class MoviePresenter {
  #root = null;

  #movieId = null;

  #movieCardView = null;
  #moviePopupView = null;

  #moviesModel = null;


  constructor(filmContainer, moviesModel){
    this.#root = filmContainer;
    this.#moviesModel = moviesModel;
  }

  init = (movieId) => {
    this.#movieId = movieId;

    const prevMovieCardView = this.#movieCardView;

    this.#moviesModel.addObserver(this.#handleMoviesModelChange);

    const movie = this.#moviesModel.getMovie(movieId);

    this.#movieCardView = new MovieCardView(movie);

    this.#movieCardView.setPosterClickHandler(this.#handleMoviePopupOpenerClick);
    this.#movieCardView.setTitleClickHandler(this.#handleMoviePopupOpenerClick);
    this.#movieCardView.setAddToFavoritesButtonClickHandler(this.#handleAddToFavoritesButtonClick);
    this.#movieCardView.setAddToAlreadyWatchedButtonClickHandler(this.#handleAddToAlreadyWatchedButtonClick);
    this.#movieCardView.setAddToWatchlistButtonClickHandler(this.#handleAddToWatchlistButtonClick);
    this.#movieCardView.setCommentsLinkClickHandler(this.#handleMoviePopupOpenerClick);

    this.#moviePopupView = new MoviePopupView(movie);

    if (prevMovieCardView === null) {
      render(this.#root, this.#movieCardView, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#movieCardView, prevMovieCardView);
    remove(prevMovieCardView);
  }

  #handleMoviePopupOpenerClick = () => {
    this.#renderMoviePopup();
  }

  #renderMoviePopup = () => {
    this.#moviePopupView.setCloseHandler(this.#handleMoviePopupClose);
    this.#moviePopupView.setChangeHandler(this.#handleMoviePopupChange);
    this.#moviePopupView.setAddToFavoritesButtonClickHandler(this.#handleAddToFavoritesButtonClick);
    this.#moviePopupView.setAddToAlreadyWatchedButtonClickHandler(this.#handleAddToAlreadyWatchedButtonClick);
    this.#moviePopupView.setAddToWatchlistButtonClickHandler(this.#handleAddToWatchlistButtonClick);
    this.#moviePopupView.setSubmitHandler(this.#handleMoviePopupSubmit);

    render(document.body, this.#moviePopupView, RenderPosition.BEFOREEND);

    document.body.classList.add(HIDE_OVERFLOW_CLASS_NAME);
  }

  #removeMoviePopup = () => {
    remove(this.#moviePopupView);

    document.body.classList.remove(HIDE_OVERFLOW_CLASS_NAME);
  }

  #handleMoviePopupClose = () => {
    this.#removeMoviePopup();
  }

  #handleMoviesModelChange = (data, changeType) => {
    if (changeType !== 'minor') {
      return;
    }

    const movie = this.#moviesModel.getMovie(this.#movieId);

    this.#movieCardView.updateData(movie);
    this.#moviePopupView.updateData(movie);
  }

  #handleAddToFavoritesButtonClick = () => {
    const movie = this.#moviesModel.getMovie(this.#movieId);

    this.#moviesModel.updateMovie(this.#movieId, {isFavorite: !movie.isFavorite});
  }

  #handleAddToAlreadyWatchedButtonClick = () => {
    const movie = this.#moviesModel.getMovie(this.#movieId);

    this.#moviesModel.updateMovie(this.#movieId, {isWatched : !movie.isWatched});
  }

  #handleAddToWatchlistButtonClick = () => {
    const movie = this.#moviesModel.getMovie(this.#movieId);

    this.#moviesModel.updateMovie(this.#movieId, {isWatchlist: !movie.isWatchlist});
  }

  #handleMoviePopupChange = (commentData) => {
    this.#moviePopupView.updateData(commentData);
  }

  #handleMoviePopupSubmit = ({text, emoji}) => {
    this.#moviesModel.addComment(this.#movieId, {text, emoji});
    this.#moviePopupView.updateData({comment: {text: '', emoji: ''}});
  }

  destroy = () => {
    remove(this.#movieCardView);
    this.#removeMoviePopup();
  }
}
