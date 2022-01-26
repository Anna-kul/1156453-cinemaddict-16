import AbstractModel, {ChangeType} from './abstract-model';
import {nanoid} from 'nanoid';
import {generateComments} from '../mock/film';

class MoviesModelError extends Error {}

const MOVIE_DATA_FIELDS = [
  'poster',
  'title',
  'rating',
  'releaseYear',
  'description',
  'duration',
  'genre',
  'comments',
  'isWatchlist',
  'isWatched',
  'isFavorite',
  'ageRating',
  'director',
  'writers',
  'actors',
  'dateRelease',
  'country',
];

export const Filter = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const Sorting = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};



export default class MoviesModel extends AbstractModel {
  #filter = Filter.ALL;
  #sorting = Sorting.DEFAULT;

  set movies(movies) {
    this._data = movies;

    this._notifyObservers(ChangeType.MAJOR);
  }

  get movies() {
    let movies = this._data;

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

  init() {
    return Promise.resolve();
  }

  setFilter(filter) {
    this.#filter = filter;
    this._notifyObservers(ChangeType.MAJOR);
  }

  setSorting(sorting) {
    this.#sorting = sorting;
    this._notifyObservers(ChangeType.MAJOR);
  }

  updateMovie(id, movieData) {
    this.checkMovieData(movieData);

    let movies = this.movies;
    let isMovieFound = false;

    movies = movies.map((currentMovie) => {
      if (currentMovie.id === id) {
        isMovieFound = true;

        return {...currentMovie, ...movieData};
      }

      return currentMovie;
    });

    if (!isMovieFound) {
      throw new MoviesModelError(`Movie with ID '${id}' not found.`);
    }

    this._data = movies;

    this._notifyObservers(ChangeType.MINOR);
  }

  addComment(movieId, {text: commentText, emoji}) {
    const movie = this.getMovie(movieId);

    movie.comments.push({...generateComments(), commentText, emoji});

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
    const movie = this.movies.find(({id: currentMovieId}) => currentMovieId === movieId);

    if (movie === undefined) {
      throw new MoviesModelError(`Movie with ID '${movieId}' not found.`);
    }

    return movie;
  }
}
