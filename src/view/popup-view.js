import {createElement} from '../render.js';


const createCommentPopupTemplate = (film) => (
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
      <div class="film-details__add-emoji-label"></div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
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

const createPopupTemplate = (film) => {
  const watchlistClassName = film.isWatchlist
    ? 'film-details__control-button--active film-details__control-button--watchlist'
    : 'film-details__control-button';

  const watchedClassName = film.isWatched
    ? 'film-details__control-button--active film-details__control-button--watched'
    : 'film-details__control-button';

  const favoriteClassName = film.isFavorite
    ? 'film-details__control-button--active film-details__control-button--favorite'
    : 'film-details__control-button';

  const commentPopupTemplate = createCommentPopupTemplate(film);

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
                <td class="film-details__term">${film.genre >1 ? 'Genres' : 'Genre' }</td>
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
          <button type="button" class="film-details__control-button ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button ${watchedClassName}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>
      ${commentPopupTemplate}
      
    </form>
  </section>`;
};

export default class PopupView {
  #element = null;
  #film = null;

  get film(){
    return this.#film;
  }

  set film (film){
    this.#film = film;
    this.#element = null;
  }

  get elem() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopupTemplate(this.#film);
  }

  removeElement() {
    this.#element = null;
  }
}
