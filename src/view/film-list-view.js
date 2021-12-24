import AbstractView  from './abstract-view.js';
import { CategoryType } from '../const.js';


export const createFilmListContainer = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>
    </section>

  </section>`
);
export default class FilmListContainerView extends AbstractView{

  get template() {
    return createFilmListContainer();
  }
}

const createCardFilmTemplate = (film) => {
  const watchlistClassName = film.isWatchlist
    ? 'film-card__controls-item--active film-card__controls-item--add-to-watchlist'
    : 'film-card__controls-item--add-to-watchlist';

  const watchedClassName = film.isWatched
    ? 'film-card__controls-item--active film-card__controls-item--mark-as-watched'
    : 'film-card__controls-item--mark-as-watched';

  const favoriteClassName = film.isFavorite
    ? 'film-card__controls-item--active film-card__controls-item--favorite'
    : 'film-card__controls-item--favorite';

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
          <button class="film-card__controls-item ${watchlistClassName}" type="button" data-category ="${CategoryType.WATCHLIST}">Add to watchlist</button>
          <button class="film-card__controls-item ${watchedClassName}" type="button" data-category ="${CategoryType.WATCHED}">Mark as watched</button>
          <button class="film-card__controls-item ${favoriteClassName}" type="button" data-category ="${CategoryType.FAVORIT}">Mark as favorite</button>
        </div>
      </article>`;
};

export class CardFilmView extends AbstractView {
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
}


