import SmartView  from '../smart-view.js';
import createMovieCardTemplate from './movie-card-template';

export default class MovieCardView extends SmartView {
  #movie = null;

  constructor(movie){
    super();

    this.#movie = movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  #getTitle = () => this.elem.querySelector('.film-card__title');

  #getPoster = () => this.elem.querySelector('.film-card__poster');

  #getAddToFavoritesButton = () => this.elem.querySelector('.film-card__controls-item--favorite');

  #getAlreadyWatchedButton = () => this.elem.querySelector('.film-card__controls-item--mark-as-watched');

  #getAddToWatchlistButton = () => this.elem.querySelector('.film-card__controls-item--add-to-watchlist');

  #getCommentsLink = () => this.elem.querySelector('.film-card__comments');

  setPosterClickHandler(handler) {
    this._callback.posterClickHandler = handler;

    this.#getPoster().addEventListener('click', this.#posterClickHandler);
  }

  setTitleClickHandler(handler) {
    this._callback.titleClickHandler = handler;

    this.#getTitle().addEventListener('click', this.#titleClickHandler);
  }

  setAddToFavoritesButtonClickHandler(handler) {
    this._callback.addToFavoritesButtonClickHandler = handler;

    this.#getAddToFavoritesButton().addEventListener('click', this.#addToFavoritesButtonClickHandler);
  }

  setAddToAlreadyWatchedButtonClickHandler(handler) {
    this._callback.addToAlreadyWatchedButtonClickHandler = handler;

    this.#getAlreadyWatchedButton().addEventListener('click', this.#addToAlreadyWatchedButtonClickHandler);
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this._callback.addToWatchlistButtonClickHandler = handler;

    this.#getAddToWatchlistButton().addEventListener('click', this.#addToWatchlistButtonClickHandler);
  }

  setCommentsLinkClickHandler(handler) {
    this._callback.commentsLinkClickHandler = handler;

    this.#getCommentsLink().addEventListener('click', this.#commentsLinkClickHandler);
  }

  #posterClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.posterClickHandler();
  }

  #titleClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.titleClickHandler();
  }

  #addToFavoritesButtonClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.addToFavoritesButtonClickHandler();
  }

  #addToAlreadyWatchedButtonClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.addToAlreadyWatchedButtonClickHandler();
  }

  #addToWatchlistButtonClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.addToWatchlistButtonClickHandler();
  }

  #commentsLinkClickHandler = () => {
    this._callback.commentsLinkClickHandler();
  }

  restoreHandlers() {
    this.#getPoster().addEventListener('click', this.#posterClickHandler);
    this.#getTitle().addEventListener('click', this.#titleClickHandler);
    this.#getAddToFavoritesButton().addEventListener('click', this.#addToFavoritesButtonClickHandler);
    this.#getAddToWatchlistButton().addEventListener('click', this.#addToWatchlistButtonClickHandler);
    this.#getAlreadyWatchedButton().addEventListener('click', this.#addToAlreadyWatchedButtonClickHandler);
    this.#getCommentsLink().addEventListener('click', this.#commentsLinkClickHandler);
  }
}
