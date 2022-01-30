import {render, RenderPosition, replace, remove} from '../utils/render.js';
import MovieCardView from '../view/movie-card-view/movie-card-view.js';
import MoviePopupView from '../view/movie-popup-view/movie-popup-view.js';
import {ChangeType} from '../utils/const';

/**
 * Имя класса для body, с помощью которого убирается вертикальная полоса прокрутки
 */
const HIDE_OVERFLOW_CLASS_NAME = 'hide-overflow';
export class MoviePresenter {
  #root = null;

  #movie = null;

  #movieCardView = null;
  #moviePopupView = null;

  #moviesModel = null;
  #commentsModel = null;


  constructor(filmContainer, moviesModel, commentsModel){
    this.#root = filmContainer;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMovieCardView = this.#movieCardView;

    this.#moviesModel.addObserver(this.#handleMoviesModelChange);
    this.#commentsModel.addObserver(this.#handleCommentsModelChange);

    this.#movieCardView = new MovieCardView(this.#movie);

    this.#movieCardView.setPosterClickHandler(this.#handleMoviePopupOpenerClick);
    this.#movieCardView.setTitleClickHandler(this.#handleMoviePopupOpenerClick);
    this.#movieCardView.setAddToFavoritesButtonClickHandler(this.#handleAddToFavoritesButtonClick);
    this.#movieCardView.setAddToAlreadyWatchedButtonClickHandler(this.#handleAddToAlreadyWatchedButtonClick);
    this.#movieCardView.setAddToWatchlistButtonClickHandler(this.#handleAddToWatchlistButtonClick);
    this.#movieCardView.setCommentsLinkClickHandler(this.#handleMoviePopupOpenerClick);

    this.#moviePopupView = new MoviePopupView(this.#movie);

    if (prevMovieCardView === null) {
      render(this.#root, this.#movieCardView, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#movieCardView, prevMovieCardView);
    remove(prevMovieCardView);
  }

  #handleMoviePopupOpenerClick = () => {
    this.#renderMoviePopup();
    this.#commentsModel.getMovieComments(this.#movie.id).then(() => {
      this.#moviePopupView.updateData({isLoading: false});
    });
  }

  #renderMoviePopup = () => {
    this.#moviePopupView.setCloseHandler(this.#handleMoviePopupClose);
    this.#moviePopupView.setChangeHandler(this.#handleMoviePopupChange);
    this.#moviePopupView.setAddToFavoritesButtonClickHandler(this.#handleAddToFavoritesButtonClick);
    this.#moviePopupView.setAddToAlreadyWatchedButtonClickHandler(this.#handleAddToAlreadyWatchedButtonClick);
    this.#moviePopupView.setAddToWatchlistButtonClickHandler(this.#handleAddToWatchlistButtonClick);
    this.#moviePopupView.setSubmitHandler(this.#handleMoviePopupSubmit);
    this.#moviePopupView.setDeleteCommentButtonClickHandler(this.#handleDeleteCommentButtonClick);

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
    this.#moviePopupView.updateData({movie});
  }

  #handleCommentsModelChange = () => {
    this.#moviePopupView.updateData({comments: this.#commentsModel.comments});
  }

  #handleAddToFavoritesButtonClick = () => {
    this.#moviesModel.updateMovie(this.#movie.id, {isFavorite: !this.#movie.isFavorite});
  }

  #handleAddToAlreadyWatchedButtonClick = () => {
    this.#moviesModel.updateMovie(this.#movie.id, {isWatched : !this.#movie.isWatched});
  }

  #handleAddToWatchlistButtonClick = () => {
    this.#moviesModel.updateMovie(this.#movie.id, {isWatchlist: !this.#movie.isWatchlist});
  }

  #handleDeleteCommentButtonClick = async (commentId) => {
    this.moviePopupView.updateData({isCommentDeleting: true});

    await this.#commentsModel.deleteComment(commentId);

    this.moviePopupView.updateData({isCommentDeleting: false});
  }

  #handleMoviePopupChange = (commentData) => {
    this.#moviePopupView.updateData(commentData);
  }

  #handleMoviePopupSubmit = ({text, emoji}) => {
    this.#moviesModel.addComment(this.#movie.id, {text, emoji});
    this.#moviePopupView.updateData({comment: {text: '', emoji: ''}});
  }

  destroy = () => {
    remove(this.#movieCardView);
    this.#moviesModel.removeObserver(this.#handleMoviesModelChange);
    this.#commentsModel.removeObserver(this.#handleCommentsModelChange);
    this.#removeMoviePopup();
  }
}
