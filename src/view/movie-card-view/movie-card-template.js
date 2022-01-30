import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

import {CategoryType} from '../../utils/const';

const FILM_CARD_CONTROLS_ITEM_ACTIVE_CLASS_NAME = 'film-card__controls-item--active';

const createMovieCardTemplate = (movie) => {
  const watchlistClassName = movie.isWatchlist ? FILM_CARD_CONTROLS_ITEM_ACTIVE_CLASS_NAME : '';
  const watchedClassName = movie.isWatched ? FILM_CARD_CONTROLS_ITEM_ACTIVE_CLASS_NAME : '';
  const favoriteClassName = movie.isFavorite ? FILM_CARD_CONTROLS_ITEM_ACTIVE_CLASS_NAME : '';

  return (
    `<article class="film-card" data-id=${movie.id}>
        <a class="film-card__link">
          <h3 class="film-card__title">${movie.title}</h3>
          <p class="film-card__rating">${movie.rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${movie.releaseDate.getFullYear()}</span>
            <span class="film-card__duration">${dayjs.duration(movie.duration, 'minutes').format('H[h] m[m]')}</span>
            <span class="film-card__genre">${movie.genre.join(', ')}</span>
          </p>
          <img src="${movie.poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${movie.description}</p>
          <span class="film-card__comments">${movie.comments.length} comments</span>
        </a>
        <div class="film-card__controls">
          <button
            class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}"
            type="button"
            data-category ="${CategoryType.WATCHLIST}"
          >
            Add to watchlist
          </button>
          <button
            class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}"
            type="button"
            data-category ="${CategoryType.WATCHED}"
          >
            Mark as watched
          </button>
          <button
            class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}"
            type="button"
            data-category="${CategoryType.FAVORITE}"
          >
            Mark as favorite
          </button>
        </div>
      </article>`
  );
};

export default createMovieCardTemplate;
