import SmartView  from '../smart-view.js';

import createMoviePopupTemplate from './templates/movie-popup-template';
import debounce from '../../utils/debounce';

const Key = {
  ESC: 'Escape',
  ENTER: 'Enter',
};

// public/css/main.css:1134
const SHAKING_ANIMATION_DURATION = 600;

const MOVIE_POPUP_CLASS_NAME = 'film-details';

const COMMENT_CHANGE_DEBOUNCE_DELAY = 350;

const COMMENT_INPUT_CLASS_NAME = 'film-details__comment-input';

export default class MoviePopupView extends SmartView {
  #shakingFormTimeoutId = null;
  #shakingCommentTimeoutId = null;

  _data = {
    movie: null,
    comments: null,
    commentText: '',
    commentEmoji: '',
    isLoading: true,
    deletingCommentId: null,
    isCommentFormShaking: false,
    shakingCommentId: null,
    isCommentSubmitting: false,
  };

  constructor (movie) {
    super();

    this._data.movie = movie;
  }

  get template() {
    document.addEventListener('keydown', this.#handleEnterPlusCtrlKeyDown);
    document.addEventListener('click', this.#handleOuterClick, true);

    const {
      movie,
      comments,
      commentText,
      commentEmoji,
      isLoading,
      deletingCommentId,
      isCommentFormShaking,
      shakingCommentId,
      isCommentSubmitting,
    } = this._data;

    if (isCommentFormShaking) {
      this.#shakingFormTimeoutId = setTimeout(() => {
        this.#shakingFormTimeoutId = null;
        this.updateData({isCommentFormShaking: false});
      }, SHAKING_ANIMATION_DURATION);
    }

    if (shakingCommentId !== null) {
      this.#shakingFormTimeoutId = setTimeout(() => {
        this.#shakingFormTimeoutId = null;
        this.updateData({shakingCommentId: null});
      }, SHAKING_ANIMATION_DURATION);
    }

    return createMoviePopupTemplate(
      movie,
      comments,
      {text: commentText, emoji: commentEmoji},
      isLoading,
      deletingCommentId,
      isCommentFormShaking,
      shakingCommentId,
      isCommentSubmitting,
    );
  }

  removeElement() {
    if (this.#shakingFormTimeoutId !== null) {
      clearTimeout(this.#shakingFormTimeoutId);
      this.#shakingFormTimeoutId = null;
    }

    if (this.#shakingCommentTimeoutId !== null) {
      clearTimeout(this.#shakingCommentTimeoutId);
      this.#shakingCommentTimeoutId = null;
    }

    document.removeEventListener('keydown', this.#handleEscKeyDown);
    document.removeEventListener('keydown', this.#handleEnterPlusCtrlKeyDown);
    this.#getInner().removeEventListener('click', this.#handleDeleteCommentButtonClick);
    document.removeEventListener('click', this.#handleOuterClick, true);

    super.removeElement();
  }

  restoreHandlers() {
    this.#getAddToWatchlistButton().addEventListener('click', this.#handleAddToWatchlistButtonClick);
    this.#getAddToAlreadyWatchedButton().addEventListener('click', this.#handleAddToAlreadyWatchedButtonClick);
    this.#getAddToFavoritesButton().addEventListener('click', this.#handleAddToFavoritesButtonClick);
    this.#getInner().addEventListener('input', this.#handleCommentChange);
    this.#getCloseButton().addEventListener('click', this.#handleCloseButtonClick);
    this.#getInner().addEventListener('submit', this.#handleCommentSubmit);
    document.addEventListener('keydown', this.#handleEscKeyDown);
    document.addEventListener('keydown', this.#handleEnterPlusCtrlKeyDown);
    this.#getInner().addEventListener('click', this.#handleDeleteCommentButtonClick);
    document.addEventListener('click', this.#handleOuterClick, true);
  }

  updateElement() {
    const isCommentInputFocused = document.activeElement.classList.contains(COMMENT_INPUT_CLASS_NAME);

    super.updateElement();

    if (!isCommentInputFocused) {
      return;
    }

    const commentInput = this.#getCommentInput();

    commentInput.focus();

    commentInput.selectionStart = commentInput.value.length;
    commentInput.selectionEnd = commentInput.value.length;
  }

  setCommentChangeHandler(handler) {
    this._callback.commentChangeHandler = debounce(handler, COMMENT_CHANGE_DEBOUNCE_DELAY);

    this.#getInner().addEventListener('input', this.#handleCommentChange);
  }

  setCloseHandler(handler) {
    this._callback.closeHandler = handler;

    this.#getCloseButton().addEventListener('click', this.#handleCloseButtonClick);
    document.addEventListener('keydown', this.#handleEscKeyDown);
  }

  setAddToFavoritesButtonClickHandler(handler) {
    this._callback.addToFavoritesButtonClickHandler = handler;

    this.#getAddToFavoritesButton().addEventListener('click', this.#handleAddToFavoritesButtonClick);
  }

  setAddToAlreadyWatchedButtonClickHandler(handler) {
    this._callback.addToAlreadyWatchedButtonClickHandler = handler;

    this.#getAddToAlreadyWatchedButton().addEventListener('click', this.#handleAddToAlreadyWatchedButtonClick);
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this._callback.addToWatchlistButtonClickHandler = handler;

    this.#getAddToWatchlistButton().addEventListener('click', this.#handleAddToWatchlistButtonClick);
  }

  setCommentSubmitHandler(handler) {
    this._callback.commentSubmitHandler = handler;

    this.#getInner().addEventListener('submit', this.#handleCommentSubmit);
  }

  setDeleteCommentButtonClickHandler(handler) {
    this._callback.deleteCommentButtonClickHandler = handler;

    this.#getInner().addEventListener('click', this.#handleDeleteCommentButtonClick);
  }

  #getInner = () => this.elem.querySelector('.film-details__inner');

  #getCloseButton = () => this.elem.querySelector('.film-details__close-btn');

  #getAddToFavoritesButton = () => this.elem.querySelector('.film-details__control-button--favorite');

  #getAddToAlreadyWatchedButton = () => this.elem.querySelector('.film-details__control-button--watched');

  #getAddToWatchlistButton = () => this.elem.querySelector('.film-details__control-button--watchlist');

  #getCommentInput = () => this.elem.querySelector('.film-details__comment-input');

  #handleCommentChange = (evt) => {
    const commentText = evt.currentTarget.elements.commentText.value;
    const checkedEmojiInput = Array.from(evt.currentTarget.elements.commentEmoji).find(({checked}) => checked);

    const commentEmoji = checkedEmojiInput?.value ?? '';

    const commentData = {
      ...commentText !== undefined && {commentText},
      ...commentEmoji && {commentEmoji},
    };

    this._callback.commentChangeHandler(commentData);
  }

  #handleCommentSubmit = (evt) => {
    evt.preventDefault();

    if (this._callback.commentSubmitHandler === undefined) {
      return;
    }

    this._callback.commentSubmitHandler({commentText: this._data.commentText, commentEmoji: this._data.commentEmoji});
  }

  #handleCloseButtonClick = (evt) => {
    evt.preventDefault();

    if (this._callback.closeHandler === undefined) {
      return;
    }

    this._callback.closeHandler();
  }

  #handleEscKeyDown = (evt) => {
    if (
      this._callback.closeHandler === undefined
      || evt.key !== Key.ESC
    ) {
      return;
    }

    evt.preventDefault();

    document.removeEventListener('keydown', this.#handleEscKeyDown);

    this._callback.closeHandler();
  }

  #handleOuterClick = (evt) => {
    const isOuterClick = evt.target.closest(`.${MOVIE_POPUP_CLASS_NAME}`) !== null;

    if (isOuterClick || this._callback.closeHandler === undefined) {
      return;
    }

    evt.stopPropagation();

    this._callback.closeHandler();
  }

  #handleAddToFavoritesButtonClick = (evt) => {
    evt.preventDefault();

    this._callback.addToFavoritesButtonClickHandler();
  }

  #handleAddToAlreadyWatchedButtonClick = (evt) => {
    evt.preventDefault();

    this._callback.addToAlreadyWatchedButtonClickHandler();
  }

  #handleAddToWatchlistButtonClick = (evt) => {
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
}
