import {NoMoviesStubViewVariant} from './no-movies-stub-view';

const createNoMoviesStubViewTemplate = (variant) => {
  let title = '';

  switch (variant) {
    case NoMoviesStubViewVariant.NO_MOVIES_IN_DB:
      title = 'There are no movies in our database';
      break;

    case NoMoviesStubViewVariant.NO_FAVORITE_MOVIES:
      title = 'There are no favorite movies now';
      break;

    case NoMoviesStubViewVariant.NO_MOVIES_TO_WATCH_NOW:
      title = 'There are no movies to watch now';
      break;

    case NoMoviesStubViewVariant.NO_WATCHED_MOVIES:
      title = 'There are no watched movies now';
      break;
  }

  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title">${title}</h2>
      </section>
    </section>`
  );
};

export default createNoMoviesStubViewTemplate;
