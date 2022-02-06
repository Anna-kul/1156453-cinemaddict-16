import {render, RenderPosition, replace, remove} from '../utils/render.js';
import MovieCardView from '../view/movie-card-view/movie-card-view.js';
import MoviePopupView from '../view/movie-popup-view/movie-popup-view.js';
import {ChangeTarget, ChangeType} from '../model/abstract-model';

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

    this.#moviesModel.addObserver(this.#handleMoviesModelMinorChange);
    this.#commentsModel.addObserver(this.#handleCommentsModelChange);

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
    this.#commentsModel.removeObserver(this.#handleCommentsModelChange);
    this.#removeMoviePopupView();
  }

  #removeMoviePopupView = () => {
    remove(this.#moviePopupView);

    document.body.classList.remove(HIDE_OVERFLOW_CLASS_NAME);
  }

  #handleMoviesModelMinorChange = (data, _, changeType) => {
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

    if (this.#moviePopupView !== null) {
      this.#moviePopupView.updateData({movie, comments: this.#commentsModel.comments});
    }
  }


  #handleCommentsModelChange = (_, changeType) => {
    if (changeType !== ChangeType.MAJOR || this.#moviePopupView === null) {
      return;
    }

    const commentIds = this.#commentsModel.comments.map(({id: currentMovieId}) => currentMovieId);

    this.#moviesModel.updateMovie(
      this.#movie.id,
      {comments: commentIds},
      {target: ChangeTarget.CACHE}
    );

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
    try {
      this.#moviePopupView.updateData({deletingCommentId: commentId});

      await this.#commentsModel.deleteComment(commentId);

      this.#moviePopupView.updateData({isCommentDeleting: false});
    } catch {
      this.#moviePopupView.updateData({isCommentDeleting: false, shakingCommentId: commentId});
    }
  }

  #handleMoviePopupOpenerClick = () => {
    this.#moviePopupView = new MoviePopupView(this.#movie);

    this.#moviePopupView.setCloseHandler(this.#handleMoviePopupClose);
    this.#moviePopupView.setCommentChangeHandler(this.#handleCommentChange);
    this.#moviePopupView.setAddToFavoritesButtonClickHandler(this.#handleAddToFavoritesButtonClick);
    this.#moviePopupView.setAddToAlreadyWatchedButtonClickHandler(this.#handleAddToAlreadyWatchedButtonClick);
    this.#moviePopupView.setAddToWatchlistButtonClickHandler(this.#handleAddToWatchlistButtonClick);
    this.#moviePopupView.setCommentSubmitHandler(this.#handleCommentSubmit);
    this.#moviePopupView.setDeleteCommentButtonClickHandler(this.#handleDeleteCommentButtonClick);

    render(document.body, this.#moviePopupView, RenderPosition.BEFOREEND);

    document.body.classList.add(HIDE_OVERFLOW_CLASS_NAME);

    this.#commentsModel.getMovieComments(this.#movie.id).then(() => {
      this.#moviePopupView.updateData({isLoading: false, comments: this.#commentsModel.comments});
    });
  }

  #handleMoviePopupClose = () => {
    this.#removeMoviePopupView();
  }

  #handleCommentChange = (commentData) => {
    this.#moviePopupView.updateData(commentData);
  }

  #handleCommentSubmit = async ({commentText, commentEmoji}) => {
    try {
      const commentData = {
        comment: commentText,
        emotion: commentEmoji,
        date: new Date().toISOString(),
      };

      this.#moviePopupView.updateData({isCommentSubmitting: true});

      await this.#commentsModel.addComment(this.#movie.id, commentData);
      this.#moviePopupView.updateData({commentText: '', commentEmoji: '', isCommentSubmitting: false});
    } catch {
      this.#moviePopupView.updateData({isCommentFormShaking: true, isCommentSubmitting: false});
    }
  }
}
