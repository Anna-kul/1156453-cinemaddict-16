import AbstractView from './abstract-view.js';
import SmartView  from './smart-view.js';
import { CategoryType } from '../utils/const.js';


export const createFilmListContainer = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>
    </section>

  </section>`
);
export default class FilmListContainerView extends AbstractView {

  get template() {
    return createFilmListContainer();
  }
}

const createCardFilmTemplate = (film) => {
  const watchlistClassName = film.isWatchlist ? 'film-card__controls-item--active' : '';

  const watchedClassName = film.isWatched ? 'film-card__controls-item--active' : '';

  const favoriteClassName = film.isFavorite ? 'film-card__controls-item--active' : '';

  return `<article class="film-card" data-id=${film.id}>
        <a class="film-card__link">
          <h3 class="film-card__title">${film.title}</h3>
          <p class="film-card__rating">${film.rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${film.releaseYear}</span>
            <span class="film-card__duration">${film.duration}</span>
            <span class="film-card__genre">${film.genre}</span>
          </p>
          <img src="${film.poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${film.description}</p>
          <span class="film-card__comments">${film.comments.length} comments</span>
        </a>
        <div class="film-card__controls">
          <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button" data-category ="${CategoryType.WATCHLIST}">Add to watchlist</button>
          <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button" data-category ="${CategoryType.WATCHED}">Mark as watched</button>
          <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button" data-category ="${CategoryType.FAVORIT}">Mark as favorite</button>
        </div>
      </article>`;
};

export class CardFilmView extends SmartView {
  #film = null;

  constructor(film){
    super();
    this.#film = film;
  }

  get template() {
    return createCardFilmTemplate(this.#film);

  }

  setClickHandler = (callback) => {
    // Мы могли бы сразу передать callback в addEventListener,
    // но тогда бы для удаления обработчика в будущем,
    // нам нужно было бы производить это снаружи, где-то там,
    // где мы вызывали setClickHandler, что не всегда удобно

    // 1. Поэтому колбэк мы запишем во внутреннее свойство
    this._callback.click = callback;
    // 2. В addEventListener передадим абстрактный обработчик
    this.elem.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    // 3. А внутри абстрактного обработчика вызовем колбэк
    this._callback.click(this.#film);
  }

  setCategoryClickHandler = (callback) => {
    this._callback.categoryClick = callback;
    this.elem.addEventListener('click', this.#categoryClickHandler);
  }

  #categoryClickHandler = (evt) => {
    if(evt.target.classList.contains('film-card__controls-item')){
      this._callback.categoryClick(evt.target.dataset.category, this.#film);
    }

  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.elem.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.elem.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  }

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  setAddedToWatchlistClickHandler = (callback) => {
    this._callback.addedToWatchlistClick = callback;
    this.elem.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addedToWatchlistClickHandler);
  }

  #addedToWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addedToWatchlistClick();
  }

  restoreHandlers = () => {
    this.elem.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addedToWatchlistClickHandler);
    this.elem.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
    this.elem.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.elem.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  }
}


