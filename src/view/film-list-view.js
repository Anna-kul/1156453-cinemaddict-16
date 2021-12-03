export const createFilmListContainer = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>
    </section>

  </section>`
);

export const createCardFilmTemplate = (film, index) => {
  const watchlistClassName = film.isWatchlist
    ? 'film-card__controls-item--active film-card__controls-item--add-to-watchlist'
    : 'film-card__controls-item--add-to-watchlist';

  const watchedClassName = film.isWatched
    ? 'film-card__controls-item--active film-card__controls-item--mark-as-watched'
    : 'film-card__controls-item--mark-as-watched';

  const favoriteClassName = film.isFavorite
    ? 'film-card__controls-item--active film-card__controls-item--favorite'
    : 'film-card__controls-item--favorite';

  return ` <article class="film-card" data-id=${index}>
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
          <button class="film-card__controls-item ${watchlistClassName}" type="button">Add to watchlist</button>
          <button class="film-card__controls-item ${watchedClassName}" type="button">Mark as watched</button>
          <button class="film-card__controls-item ${favoriteClassName}" type="button">Mark as favorite</button>
        </div>
      </article>`;
};
