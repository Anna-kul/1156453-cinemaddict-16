import SmartView  from './smart-view.js';
import { CategoryType } from '../utils/const.js';

const createCommentPopupTemplate = (film, commentText = '', commentEmoji) => (
  `<div class="film-details__bottom-container">
  <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>
    
    <ul class="film-details__comments-list">
  ${film.comments.reduce((html, item) => {
    html += `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/smile.png" width="55" height="55" alt="emoji-smile">
        </span>
        <div>
          <p class="film-details__comment-text">${item.commentText}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${item.commentAutor}</span>
            <span class="film-details__comment-day">${item.commentDate}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`;
    return html;
  }, '')}
      
    </ul>

    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
        ${commentEmoji ? `<img src="images/emoji/${commentEmoji}.png" width="55" height="55" alt="emoji-${commentEmoji}">` : ''}
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText}</textarea>
      </label>

      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </div>
  </section>
</div>`
);

const createPopupTemplate = (film, commentText, commentEmoji) => {
  const watchlistClassName = film.isWatchlist
    ? 'film-details__control-button--active film-details__control-button--watchlist'
    : 'film-details__control-button--watchlist';

  const watchedClassName = film.isWatched
    ? 'film-details__control-button--active film-details__control-button--watched'
    : 'film-details__control-button--watched';

  const favoriteClassName = film.isFavorite
    ? 'film-details__control-button--active film-details__control-button--favorite'
    : 'film-details__control-button--favorite';

  const commentPopupTemplate = createCommentPopupTemplate(film, commentText, commentEmoji);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${film.poster}" alt="">
  
            <p class="film-details__age">${film.ageRating}</p>
          </div>
  
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${film.title}</h3>
                <p class="film-details__title-original">${film.title}</p>
              </div>
  
              <div class="film-details__rating">
                <p class="film-details__total-rating">${film.rating}</p>
              </div>
            </div>
  
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${film.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${film.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${film.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${film.dateRelease}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${film.duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${film.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${film.genre.length >1 ? 'Genres' : 'Genre' }</td>
                <td class="film-details__cell">
                
                  <span class="film-details__genre">${film.genre.join(', ')}</span></td>
              </tr>
            </table>
  
            <p class="film-details__film-description">
            ${film.description}
            </p>
          </div>
        </div>
  
        <section class="film-details__controls">
          <button type="button" class="film-details__control-button ${watchlistClassName}" id="watchlist" data-category ="${CategoryType.WATCHLIST}" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button ${watchedClassName}" id="watched" data-category ="${CategoryType.WATCHED}" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button ${favoriteClassName}" id="favorite" data-category ="${CategoryType.FAVORIT}" name="favorite">Add to favorites</button>
        </section>
      </div>
      ${commentPopupTemplate}
      
    </form>
  </section>`;
};

export default class PopupView extends SmartView {
  #film = null;

  constructor (film) {
    super();
    this.#film = film;
  }

  get template() {
    return createPopupTemplate(this.#film, this._data.commentText, this._data.commentEmoji);
  }

  setCloseBtnClickHandler = (callback) => {
    // Мы могли бы сразу передать callback в addEventListener,
    // но тогда бы для удаления обработчика в будущем,
    // нам нужно было бы производить это снаружи, где-то там,
    // где мы вызывали setClickHandler, что не всегда удобно

    // 1. Поэтому колбэк мы запишем во внутреннее свойство
    this._callback.closeButtonClickHandler = callback;
    // 2. В addEventListener передадим абстрактный обработчик
    this.elem.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    // 3. А внутри абстрактного обработчика вызовем колбэк
    this._callback.closeButtonClickHandler();
  }

  #escKeyPressHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#escKeyPressHandler);
      this._callback.escKeyPressHandler();
    }
  }

  setEscKeyPresshandler = (callback) => {
    this._callback.escKeyPressHandler = callback;
    document.addEventListener('keydown', this.#escKeyPressHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.elem.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.elem.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  }

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  setAddedToWatchlistClickHandler = (callback) => {
    this._callback.addedToWatchlistClick = callback;
    this.elem.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addedToWatchlistClickHandler);
  }

  setChangeHandler = (handler) => {
    this._callback.changeHandler = handler;
    this.elem.querySelector('.film-details__inner').addEventListener('change', this.#handleChange);
  }

  #addedToWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addedToWatchlistClick();
  }

  #handleChange = (evt) => {
    const formData = new FormData(evt.currentTarget);

    this._callback.changeHandler(Object.fromEntries(formData));
  }

  restoreHandlers = () => {
    this.elem.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addedToWatchlistClickHandler);
    this.elem.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchedClickHandler);
    this.elem.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.elem.querySelector('.film-details__inner').addEventListener('change', this.#handleChange);
    this.elem.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  }
}
