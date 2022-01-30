import AbstractModel from './abstract-model';
import {ChangeType} from '../utils/const.js';
import {MOVIE_DATA_FIELDS, Sorting} from '../utils/const.js';
import {Filter} from './filters-model.js';

class MoviesModelError extends Error {}
export default class MoviesModel extends AbstractModel {
  #filter = Filter.ALL;
  #sorting = Sorting.DEFAULT;
  #apiService = null;

  constructor(apiService) {
    super();

    this.#apiService = apiService;
  }

  set movies(movies) {
    this._data = movies.reduce((map, movie) => {
      map[movie.id] = movie;

      return map;
    }, {});

    this._notifyObservers(ChangeType.MAJOR);
  }

  get movies() {
    let movies = Object.values(this._data);

    switch (this.#filter) {
      case Filter.WATCHLIST:
        movies = movies.filter(({isWatchlist}) => isWatchlist);
        break;

      case Filter.HISTORY:
        movies = movies.filter(({isWatched}) => isWatched);
        break;

      case Filter.FAVORITES:
        movies = movies.filter(({isFavorite}) => isFavorite);
    }

    switch (this.#sorting) {
      case Sorting.DATE:
        movies.sort(({dateRelease: aDateRelease}, {dateRelease: bDateRelease}) =>  new Date(aDateRelease) - new Date(bDateRelease));
        break;

      case Sorting.RATING:
        movies.sort(({rating: aRating}, {rating: bRating}) => Number(bRating) - Number(aRating));
    }

    return movies;
  }

  async init() {
    try {
      const movies = await this.#apiService.getMovies();

      const adaptedMovies = movies.map(this.#adaptMovie);

      this.movies = adaptedMovies;
    } catch (error) {
      this.movies = [];
    }
  }

  setFilter(filter) {
    this.#filter = filter;
  }

  getFilter() {
    return this.#filter;
  }

  setSorting(sorting) {
    this.#sorting = sorting;
    this._notifyObservers(ChangeType.MAJOR);
  }

  updateMovie(id, movieData) {
    this.checkMovieData(movieData);

    const movie = this.getMovie(id);

    if (movie === undefined) {
      throw new MoviesModelError(`Movie with ID '${id}' not found.`);
    }

    this._data[id] = {...movie, ...movieData};

    this._notifyObservers(ChangeType.MINOR);
  }

  checkMovieData(movieData) {
    Object.keys(movieData).forEach((key) => {
      if (!MOVIE_DATA_FIELDS.includes(key)) {
        throw new MoviesModelError(`Unsupported key '${key}' in MoviesModel.`);
      }
    });
  }

  getMovie(movieId) {
    const movie = this._data[movieId];

    if (movie === undefined) {
      throw new MoviesModelError(`Movie with ID '${movieId}' not found.`);
    }

    return movie;
  }

  #adaptMovie = (movie) => ({
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
    watchingDate: movie.user_details.watching_date,
    ageRating: movie.film_info.age_rating,
    director: movie.film_info.director,
    writers: movie.film_info.writers,
    actors: movie.film_info.actors,
    country: movie.film_info.release.release_country,
    poster: movie.film_info.poster,
    rating: movie.film_info.total_rating,
  })
}
