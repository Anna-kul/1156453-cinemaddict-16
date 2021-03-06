import {Category} from '../../../constants';

import createInfoTemplate from './info-template';
import createCommentsTemplate from './comments-template';

const createMoviePopupTemplate = (
  movie,
  comments,
  comment,
  isLoading,
  deletingCommentId,
  isCommentFormShaking,
  shakingCommentId,
  isCommentSubmitting,
) => {
  const watchlistClassName = movie.isWatchlist
    ? 'film-details__control-button--active film-details__control-button--watchlist'
    : 'film-details__control-button--watchlist';

  const watchedClassName = movie.isWatched
    ? 'film-details__control-button--active film-details__control-button--watched'
    : 'film-details__control-button--watched';

  const favoriteClassName = movie.isFavorite
    ? 'film-details__control-button--active film-details__control-button--favorite'
    : 'film-details__control-button--favorite';

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${movie.poster}" alt='Poster of the "${movie.title}"'>

              <p class="film-details__age">${movie.ageRating}+</p>
            </div>

            ${createInfoTemplate(movie)}
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button ${watchlistClassName}" id="watchlist" data-category ="${Category.WATCHLIST}" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button ${watchedClassName}" id="watched" data-category ="${Category.WATCHED}" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button ${favoriteClassName}" id="favorite" data-category ="${Category.FAVORITE}" name="favorite">Add to favorites</button>
          </section>
        </div>

        ${createCommentsTemplate(movie, comments, comment, isLoading, deletingCommentId, isCommentFormShaking, shakingCommentId, isCommentSubmitting)}

      </form>
    </section>`
  );
};

export default createMoviePopupTemplate;
