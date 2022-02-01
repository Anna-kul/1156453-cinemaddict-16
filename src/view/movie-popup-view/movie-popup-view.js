import SmartView  from '../smart-view.js';

import createMoviePopupTemplate from './templates/movie-popup-template';

const Key = {
  ESC: 'Escape',
  ENTER: 'Enter',
};

/**
 * TODO: Покачивание, если не удалось удалить комментарий
 */

export default class MoviePopupView extends SmartView {
  _data = {
    movie: null,
    comments: null,
    commentText: '',
    commentEmoji: '',
    isLoading: true,
    isCommentDeleting: false,
    /**
     * Трясётся ли форма. Используется при неудачном создании комментария
     */
    isCommentFormShaking: false,
    /**
     * Идентификатор удаляемого комментария. Используется при неудачном удалении комментария
     */
    shakingCommentId: null,
  };

  constructor (movie) {
    super();

    this._data.movie = movie;
  }

  get template() {
    document.addEventListener('keydown', this.#handleEnterPlusCtrlKeyDown);

    return createMoviePopupTemplate(
      this._data.movie,
      this._data.comments,
      {text: this._data.commentText, emoji: this._data.commentEmoji},
      this._data.isLoading,
      this._data.isCommentDeleting,
      this._data.isCommentFormShaking,
      this._data.shakingCommentId
    );
  }

  #getInner = () => this.elem.querySelector('.film-details__inner');

  #getCloseButton = () => this.elem.querySelector('.film-details__close-btn');

  #getAddToFavoritesButton = () => this.elem.querySelector('.film-details__control-button--favorite');

  #getAddToAlreadyWatchedButton = () => this.elem.querySelector('.film-details__control-button--watched');

  #getAddToWatchlistButton = () => this.elem.querySelector('.film-details__control-button--watchlist');

  #getCommentInput = () => this.elem.querySelector('.film-details__comment-input');

  setChangeHandler(handler) {
    this._callback.changeHandler = handler;

    this.#getInner().addEventListener('change', this.#handleChange);
  }

  setCloseHandler(handler) {
    this._callback.closeHandler = handler;

    this.#getCloseButton().addEventListener('click', this.#closeButtonClickHandler);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  setAddToFavoritesButtonClickHandler(handler) {
    this._callback.addToFavoritesButtonClickHandler = handler;

    this.#getAddToFavoritesButton().addEventListener('click', this.#addToFavoritesButtonClickHandler);
  }

  setAddToAlreadyWatchedButtonClickHandler(handler) {
    this._callback.setAddToAlreadyWatchedButtonClickHandler = handler;

    this.#getAddToAlreadyWatchedButton().addEventListener('click', this.#addToAlreadyWatchedButtonClickHandler);
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this._callback.addToWatchlistButtonClickHandler = handler;

    this.#getAddToWatchlistButton().addEventListener('click', this.#addToWatchlistButtonClickHandler);
  }

  setSubmitHandler(handler) {
    this._callback.submitHandler = handler;

    this.#getInner().addEventListener('submit', this.#handleSubmit);
  }

  setDeleteCommentButtonClickHandler(handler) {
    this._callback.deleteCommentButtonClickHandler = handler;

    document.addEventListener('click', this.#handleDeleteCommentButtonClick);
  }

  #handleChange = (evt) => {
    const formData = new FormData(evt.currentTarget);

    const {commentText, commentEmoji} = Object.fromEntries(formData);

    const commentData = {
      ...commentText && {commentText},
      ...commentEmoji && {commentEmoji},
    };

    this._callback.changeHandler(commentData);
  }

  #handleSubmit = (evt) => {
    evt.preventDefault();

    if (this._callback.submitHandler === undefined) {
      return;
    }

    this._callback.submitHandler({commentText: this._data.commentText, commentEmoji: this._data.commentEmoji});
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();

    if (this._callback.closeHandler === undefined) {
      return;
    }

    this._callback.closeHandler();
  }

  #escKeyDownHandler = (evt) => {
    if (
      this._callback.closeHandler === undefined
      || evt.key !== Key.ESC
    ) {
      return;
    }

    evt.preventDefault();

    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this._callback.closeHandler();
  }

  #addToFavoritesButtonClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.addToFavoritesButtonClickHandler();
  }

  #addToAlreadyWatchedButtonClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.setAddToAlreadyWatchedButtonClickHandler();
  }

  #addToWatchlistButtonClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.addToWatchlistButtonClickHandler();
  }

  #handleEnterPlusCtrlKeyDown = (evt) => {
    if (!evt.ctrlKey || evt.key !== Key.ENTER) {
      return;
    }

    this.#getInner().dispatchEvent(new Event('submit'));
  }

  #handleDeleteCommentButtonClick = (evt) => {
    if (
      this._callback.deleteCommentButtonClickHandler === undefined
      || !evt.target.classList.contains('film-details__comment-delete')
    ) {
      return;
    }

    const commentId = evt.target.dataset.commentId;

    this._callback.deleteCommentButtonClickHandler(commentId);
  }

  restoreHandlers() {
    this.#getAddToWatchlistButton().addEventListener('click', this.#addToWatchlistButtonClickHandler);
    this.#getAddToAlreadyWatchedButton().addEventListener('click', this.#addToAlreadyWatchedButtonClickHandler);
    this.#getAddToFavoritesButton().addEventListener('click', this.#addToFavoritesButtonClickHandler);
    this.#getInner().addEventListener('change', this.#handleChange);
    this.#getCloseButton().addEventListener('click', this.#closeButtonClickHandler);
    this.#getInner().addEventListener('submit', this.#handleSubmit);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.addEventListener('keydown', this.#handleEnterPlusCtrlKeyDown);
    document.addEventListener('click', this.#handleDeleteCommentButtonClick);
  }

  removeElement() {
    super.removeElement();

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.removeEventListener('keydown', this.#handleEnterPlusCtrlKeyDown);
    document.removeEventListener('click', this.#handleDeleteCommentButtonClick);
  }
}
