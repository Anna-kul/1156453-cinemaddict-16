import {render, RenderPosition, replace, remove} from '../utils/render.js';
import MoviePopupView from '../view/movie-popup-view/movie-popup-view.js';
import {ChangeTarget, ChangeType} from '../model/abstract-model';

const HIDE_OVERFLOW_CLASS_NAME = 'hide-overflow';

export default class MoviePopupPresenter {
  #root = null;

  #movie = null;

  #moviePopupView = null;

  #moviesModel = null;
  #commentsModel = null;

  constructor(root, moviesModel, commentsModel){
    this.#root = root;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMoviePopupView = this.#moviePopupView;

    this.#moviesModel.addObserver(this.#handleMoviesModelMinorChange);
    this.#commentsModel.addObserver(this.#handleCommentsModelMajorChange);

    if (prevMoviePopupView === null) {
      this.#moviePopupView = new MoviePopupView(this.#movie);

      this.#moviePopupView.setCloseHandler(this.#handleMoviePopupClose);
      this.#moviePopupView.setCommentChangeHandler(this.#handleCommentChange);
      this.#moviePopupView.setAddToFavoritesButtonClickHandler(this.#handleAddToFavoritesButtonClick);
      this.#moviePopupView.setAddToAlreadyWatchedButtonClickHandler(this.#handleAddToAlreadyWatchedButtonClick);
      this.#moviePopupView.setAddToWatchlistButtonClickHandler(this.#handleAddToWatchlistButtonClick);
      this.#moviePopupView.setCommentSubmitHandler(this.#handleCommentSubmit);
      this.#moviePopupView.setDeleteCommentButtonClickHandler(this.#handleDeleteCommentButtonClick);

      document.body.classList.add(HIDE_OVERFLOW_CLASS_NAME);

      this.#commentsModel.getMovieComments(this.#movie.id).then(() => {
        this.#moviePopupView.updateData({isLoading: false, comments: this.#commentsModel.comments});
      });

      render(document.body, this.#moviePopupView, RenderPosition.BEFOREEND);

      return;
    }

    replace(this.#moviePopupView, prevMoviePopupView);
    remove(prevMoviePopupView);
  }

  destroy = () => {
    this.#moviesModel.removeObserver(this.#handleMoviesModelMinorChange);
    this.#commentsModel.removeObserver(this.#handleCommentsModelMajorChange);

    remove(this.#moviePopupView);

    document.body.classList.remove(HIDE_OVERFLOW_CLASS_NAME);

    this.#moviePopupView = null;
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

    this.#moviePopupView.updateData({
      movie: this.#movie,
      comments: this.#commentsModel.comments
    });
  }

  #handleCommentsModelMajorChange = (_, changeType) => {
    if (changeType !== ChangeType.MAJOR) {
      return;
    }

    this.#moviePopupView.updateData({comments: this.#commentsModel.comments});
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

  #handleDeleteCommentButtonClick = async (commentId) => {
    try {
      this.#moviePopupView.updateData({deletingCommentId: commentId});

      await this.#commentsModel.deleteComment(commentId);

      this.#moviePopupView.updateData({deletingCommentId: null});

      this.#moviesModel.updateMovie(
        this.#movie.id,
        {comments: this.#commentsModel.comments.map(({id}) => id)},
        {target: ChangeTarget.CACHE}
      );
    } catch {
      this.#moviePopupView.updateData({deletingCommentId: null, shakingCommentId: commentId});
    }
  }

  #handleMoviePopupClose = () => {
    this.destroy();
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

      this.#moviesModel.updateMovie(
        this.#movie.id,
        {comments: this.#commentsModel.comments.map(({id}) => id)},
        {target: ChangeTarget.CACHE}
      );
    } catch {
      this.#moviePopupView.updateData({isCommentFormShaking: true, isCommentSubmitting: false});
    }
  }
}
