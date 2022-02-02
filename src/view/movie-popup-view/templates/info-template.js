import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);


const createInfoTemplate = (movie) => (
  `<div class="film-details__info">
    <div class="film-details__info-head">
      <div class="film-details__title-wrap">
        <h3 class="film-details__title">${movie.title}</h3>
        <p class="film-details__title-original">${movie.title}</p>
      </div>

      <div class="film-details__rating">
        <p class="film-details__total-rating">${movie.rating}</p>
      </div>
    </div>

    <table class="film-details__table">
      <tr class="film-details__row">
        <td class="film-details__term">Director</td>
        <td class="film-details__cell">${movie.director}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Writers</td>
        <td class="film-details__cell">${movie.writers.join(', ')}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">${movie.actors.join(', ')}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Release Date</td>
        <td class="film-details__cell">${movie.releaseDate.getFullYear()}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Runtime</td>
        <td class="film-details__cell">${dayjs.duration(movie.duration, 'minutes').format('H[h] m[m]')}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">${movie.country}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">${movie.genre.length >1 ? 'Genres' : 'Genre' }</td>
        <td class="film-details__cell">

          <span class="film-details__genre">${movie.genre.join(', ')}</span></td>
      </tr>
    </table>

    <p class="film-details__film-description">
    ${movie.description}
    </p>
  </div>`
);

export default createInfoTemplate;
