import dayjs from 'dayjs';

import AbstractModel, {ChangeTarget, ChangeType} from './abstract-model';

export const MOVIE_DATA_FIELDS = [
  'poster',
  'title',
  'rating',
  'releaseDate',
  'description',
  'duration',
  'genre',
  'comments',
  'isWatchlist',
  'isWatched',
  'watchingDate',
  'isFavorite',
  'ageRating',
  'director',
  'writers',
  'actors',
  'country',
];

class MoviesModelError extends Error {}

const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie buff',
};

export const Filter = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY_TODAY: 'history-today',
  HISTORY_WEEK: 'history-week',
  HISTORY_MONTH: 'history-month',
  HISTORY_YEAR: 'history-year',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const Sorting = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const watchedMoviesAmountByUserRank = {
  [UserRank.NOVICE]: 1,
  [UserRank.FAN]: 11,
  [UserRank.MOVIE_BUFF]: 21,
};

export const MoviesModelEvent = {
  SET_MOVIES: 'setMovies',
  UPDATE_MOVIE_USER_DATA: 'updateMovieUserData',
  UPDATE_MOVIE_COMMENTS: 'updateMovieComments',
};

export default class MoviesModel extends AbstractModel {
  #apiService = null;

  constructor(apiService) {
    super();

    this.#apiService = apiService;
  }

  get movies() {
    return Object.values(this._data || {});
  }

  set movies(movies) {
    this._data = movies.reduce((map, movie) => {
      map[movie.id] = movie;

      return map;
    }, {});

    this._notifyObservers([MoviesModelEvent.SET_MOVIES], ChangeType.MAJOR);
  }

  async init() {
    const movies = await this.#apiService.getMovies();

    this.movies = movies.map(this.#adaptMovieToApp);
  }

  getMovie(movieId) {
    const movie = this._data[movieId];

    if (movie === undefined) {
      throw new MoviesModelError(`Movie with ID '${movieId}' not found.`);
    }

    return movie;
  }

  getMovies({filter, sorting} = {}) {
    let movies = this.movies;

    switch (filter) {
      case Filter.WATCHLIST:
        movies = movies.filter(({isWatchlist}) => isWatchlist);
        break;

      case Filter.HISTORY_WEEK:
        movies = movies.filter(({watchingDate}) => {
          if (watchingDate === null) {
            return false;
          }

          const weekAgoDate = dayjs(new Date()).subtract(1, 'week');

          return weekAgoDate.toDate() < watchingDate.getTime();
        });
        break;
      case Filter.HISTORY_MONTH:
        movies = movies.filter(({watchingDate}) => {
          if (watchingDate === null) {
            return false;
          }

          const monthAgoDate = dayjs(new Date()).subtract(1, 'months');

          return monthAgoDate.toDate() < watchingDate.getTime();
        });
        break;
      case Filter.HISTORY_YEAR:
        movies = movies.filter(({watchingDate}) => {
          if (watchingDate === null) {
            return false;
          }

          const yearAgoDate = dayjs(new Date()).subtract(1, 'year');

          return yearAgoDate.toDate() < watchingDate.getTime();
        });
        break;
      case Filter.HISTORY_TODAY:
        movies = movies.filter(({watchingDate}) => {
          if (watchingDate === null) {
            return false;
          }

          const todayDate = dayjs(new Date()).startOf('day');

          return todayDate.toDate().getTime() === dayjs(watchingDate).startOf('day').toDate().getTime();
        });
        break;

      case Filter.HISTORY:
        movies = movies.filter(({isWatched}) => isWatched);
        break;

      case Filter.FAVORITES:
        movies = movies.filter(({isFavorite}) => isFavorite);
        break;
    }

    switch (sorting) {
      case Sorting.DATE:
        movies.sort(({releaseDate: aReleaseDate}, {releaseDate: bReleaseDate}) => bReleaseDate.getTime() - aReleaseDate.getTime());
        break;

      case Sorting.RATING:
        movies.sort(({rating: aRating}, {rating: bRating}) => Number(bRating) - Number(aRating));
    }

    return movies;
  }

  updateMovie = async (movieId, movieData, {target = ChangeTarget.SERVICE} = {}) => {
    this.#validateMovieData(movieData);

    const movie = this.getMovie(movieId);

    if (movie === undefined) {
      throw new MoviesModelError(`Movie with ID '${movieId}' not found.`);
    }

    if (target === ChangeTarget.SERVICE) {
      const updatedMovie = await this.#apiService.updateMovie(movieId, this.#adaptMovieToApiService({...movie, ...movieData}));

      this._data[movieId] = this.#adaptMovieToApp(updatedMovie);
    }

    if (target === ChangeTarget.CACHE) {
      this._data[movieId] = {...this._data[movieId], ...movieData};
    }

    const MoviesModelEvents = [];

    Object.keys(movieData).forEach((key) => {
      if (key === 'comments') {
        MoviesModelEvents.push(MoviesModelEvent.UPDATE_MOVIE_COMMENTS);
      }

      if (['isWatched', 'isWatchlist', 'isFavorite'].includes(key)) {
        MoviesModelEvents.push(MoviesModelEvent.UPDATE_MOVIE_USER_DATA);
      }
    });

    this._notifyObservers(MoviesModelEvents, ChangeType.MINOR);
  }

  getMoviesStatistic({filter} = {}) {
    const watchedMovies = this.getMovies({filter});

    const viewsByGenre = {};

    for (const movie of watchedMovies) {
      for (const genre of movie.genre) {
        if (viewsByGenre[genre] === undefined) {
          viewsByGenre[genre] = 1;
        } else {
          viewsByGenre[genre] += 1;
        }
      }
    }

    let topGenre;
    let views = 0;

    for (const [key, value] of Object.entries(viewsByGenre)) {
      if (value > views) {
        topGenre = key;
        views = value;
      }
    }

    const totalDuration = watchedMovies.reduce((acc, {duration}) => acc + duration, 0);

    return {viewsByGenre, totalDuration, watchedMoviesAmount: watchedMovies.length, topGenre};
  }

  getUserRank = () => {
    let userRank = '';

    const watchedMoviesAmount = this.movies.filter(({isWatched}) => isWatched).length;

    if (watchedMoviesAmount >= watchedMoviesAmountByUserRank[UserRank.MOVIE_BUFF]) {
      userRank = UserRank.MOVIE_BUFF;

    } else if (watchedMoviesAmount >= watchedMoviesAmountByUserRank[UserRank.FAN]){
      userRank = UserRank.FAN;
    } else if (watchedMoviesAmount >= watchedMoviesAmountByUserRank[UserRank.NOVICE]) {
      userRank = UserRank.NOVICE;
    }

    return userRank;
  }

  #validateMovieData = (movieData) => {
    Object.keys(movieData).forEach((key) => {
      if (!MOVIE_DATA_FIELDS.includes(key)) {
        throw new MoviesModelError(`Unsupported key '${key}' in MoviesModel.`);
      }
    });
  }

  #adaptMovieToApp = (movie) => ({
    title: movie.film_info.title,
    id: movie.id,
    alternativeTitle: movie.film_info.alternative_title,
    releaseDate: new Date(movie.film_info.release.date),
    description: movie.film_info.description,
    duration: movie.film_info.runtime,
    genre: movie.film_info.genre,
    comments: movie.comments,
    isWatchlist: movie.user_details.watchlist,
    isWatched: movie.user_details.already_watched,
    isFavorite: movie.user_details.favorite,
    watchingDate: movie.user_details.watching_date === null ? null : new Date(movie.user_details.watching_date),
    ageRating: movie.film_info.age_rating,
    director: movie.film_info.director,
    writers: movie.film_info.writers,
    actors: movie.film_info.actors,
    country: movie.film_info.release.release_country,
    poster: movie.film_info.poster,
    rating: movie.film_info.total_rating,
  })

  #adaptMovieToApiService = (movie) => ({
    id: movie.id,
    ['film_info']: {
      title: movie.title,
      ['alternative_title']: movie.alternativeTitle,
      ['total_rating']: movie.rating,
      poster: movie.poster,
      ['age_rating']: movie.ageRating,
      director: movie.director,
      writers: movie.writers,
      actors: movie.actors,
      release: {
        date: movie.releaseDate.toISOString(),
        ['release_country']: movie.country,
      },
      runtime: movie.duration,
      genre: movie.genre,
      description: movie.description,
    },
    ['user_details']: {
      watchlist: movie.isWatchlist,
      ['already_watched']: movie.isWatched,
      ['watching_date']: movie.watchingDate === null ? null : movie.watchingDate.toISOString(),
      favorite: movie.isFavorite,
    },
    comments: movie.comments,
  });
}
