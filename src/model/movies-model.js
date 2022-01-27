import AbstractModel from './abstract-model';
import {ChangeType} from '../utils/const.js';
import {MOVIE_DATA_FIELDS, Filter, Sorting} from '../utils/const.js';

/*
{
    "id": "0",
    "film_info": {
      "title": "Pioneers Without The Void",
      "alternative_title": "Family Who Saw Us",
      "total_rating": 6.4,
      "poster": "images/posters/the-dance-of-life.jpg",
      "age_rating": 21,
      "director": "James Cameron",
      "writers": [
        "Takeshi Kitano"
      ],
      "actors": [
        "Ralph Fiennes",
        "Gary Oldman",
        "Michael Caine",
        "Tom Hanks",
        "Cillian Murphy",
        "Al Pacino",
        "Morgan Freeman ",
        "Harrison Ford"
      ],
      "release": {
        "date": "2001-08-20T12:58:05.634Z",
        "release_country": "Japan"
      },
      "runtime": 73,
      "genre": [
        "Comedy",
        "Action",
        "Adventure",
        "Family",
        "Drama"
      ],
      "description": "Oscar-winning film."
    },
    "user_details": {
      "watchlist": false,
      "already_watched": true,
      "watching_date": "2021-11-02T17:23:03.967Z",
      "favorite": false
    },
    "comments": [
      "181431",
      "181432",
      "181433"
    ]
  }
  */

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
    this._data = movies;

    this._notifyObservers(ChangeType.MAJOR);
  }

  get movies() {
    let movies = this._data;
    console.log(movies);

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
    window.api = this.#apiService;
    return this.#apiService.movies.then((movies) => {
      
      const adaptedMovies = movies.map(this.#adaptMovie);
      console.log(adaptedMovies);
      this.movies = adaptedMovies;
    });
  }

  setFilter(filter) {
    this.#filter = filter;
    this._notifyObservers(ChangeType.MAJOR);
  }

  getFilter() {
    return this.#filter;
  }

  setSorting(sorting) {
    this.#sorting = sorting;
    this._notifyObservers(ChangeType.MAJOR);
  }

  updateMovie(id, movieData) {
    console.log('MoviesModel.updateMovie', id, movieData);
    this.checkMovieData(movieData);

    let movies = this.movies;
    let isMovieFound = false;

    movies = movies.map((currentMovie) => {
      if (currentMovie.id === id) {
        isMovieFound = true;

        const updatedMovie = {...currentMovie, ...movieData};

        console.log('MoviesMode.updateMovie updatedMove', updatedMovie);

        return updatedMovie;
      }

      return currentMovie;
    });

    if (!isMovieFound) {
      throw new MoviesModelError(`Movie with ID '${id}' not found.`);
    }

    this._movies = movies;

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

  #adaptMovie = (movie) => {
    return {
      id: movie.id,
      title: movie.film_info.title,
      poster: movie.poster.title,
      rating: movie.film_info.total,
      alternativeTitle: movie.film_info.alternative_title,
      releaseDate: new Date(movie.release.date),
      description: movie.film_info.description,
      duration: movie.film_info.runtime,
      genre: movie.film_info.genre,
      comments: movie.film_info.comments,
      isWatchlist: movie.user_details.watchlist,
      isWatched: movie.user_details.already_watched,
      isFavorite: movie.user_details.favorite,
      watchingDate: movie.user_details.watching_date,
      ageRating: movie.film_info.age_rating,
      director: movie.film_info.director,
      writers: movie.film_info.writers,
      actors: movie.film_info.actors,
      country: movie.release.release_country,
    };
  }
}
