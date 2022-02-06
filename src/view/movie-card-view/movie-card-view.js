import SmartView  from '../smart-view.js';
import createMovieCardTemplate from './template';

export default class MovieCardView extends SmartView {
  _data = {movie: null}

  constructor(movie){
    super();

    this._data.movie = movie;
  }

  get template() {
    const {movie} = this._data;

    return createMovieCardTemplate({movie});
  }

  restoreHandlers() {
    this.#getPoster().addEventListener('click', this.#handlePosterClick);
    this.#getTitle().addEventListener('click', this.#handleTitleClick);
    this.#getAddToFavoritesButton().addEventListener('click', this.#handleAddToFavoritesButtonClick);
    this.#getAddToWatchlistButton().addEventListener('click', this.#handleAddToWatchlistButtonClick);
    this.#getAlreadyWatchedButton().addEventListener('click', this.#handleAddToAlreadyWatchedButtonClick);
    this.#getCommentsLink().addEventListener('click', this.#handleCommentsLinkClick);
  }

  setPosterClickHandler(handler) {
    this._callback.posterClickHandler = handler;

    this.#getPoster().addEventListener('click', this.#handlePosterClick);
  }

  setTitleClickHandler(handler) {
    this._callback.titleClickHandler = handler;

    this.#getTitle().addEventListener('click', this.#handleTitleClick);
  }

  setAddToFavoritesButtonClickHandler(handler) {
    this._callback.addToFavoritesButtonClickHandler = handler;

    this.#getAddToFavoritesButton().addEventListener('click', this.#handleAddToFavoritesButtonClick);
  }

  setAddToAlreadyWatchedButtonClickHandler(handler) {
    this._callback.addToAlreadyWatchedButtonClickHandler = handler;

    this.#getAlreadyWatchedButton().addEventListener('click', this.#handleAddToAlreadyWatchedButtonClick);
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this._callback.addToWatchlistButtonClickHandler = handler;

    this.#getAddToWatchlistButton().addEventListener('click', this.#handleAddToWatchlistButtonClick);
  }

  setCommentsLinkClickHandler(handler) {
    this._callback.commentsLinkClickHandler = handler;

    this.#getCommentsLink().addEventListener('click', this.#handleCommentsLinkClick);
  }

  #getTitle = () => this.elem.querySelector('.film-card__title');

  #getPoster = () => this.elem.querySelector('.film-card__poster');

  #getAddToFavoritesButton = () => this.elem.querySelector('.film-card__controls-item--favorite');

  #getAlreadyWatchedButton = () => this.elem.querySelector('.film-card__controls-item--mark-as-watched');

  #getAddToWatchlistButton = () => this.elem.querySelector('.film-card__controls-item--add-to-watchlist');

  #getCommentsLink = () => this.elem.querySelector('.film-card__comments');

  #handlePosterClick = (evt) => {
    evt.preventDefault();

    if (this._callback.posterClickHandler === undefined) {
      return;
    }

    this._callback.posterClickHandler();
  }

  #handleTitleClick = (evt) => {
    evt.preventDefault();

    this._callback.titleClickHandler();
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

  #handleCommentsLinkClick = () => {
    this._callback.commentsLinkClickHandler();
  }
}
