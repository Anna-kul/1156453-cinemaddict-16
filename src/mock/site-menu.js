import {films} from '../main.js';

export const generateNavigationSiteMenu = () => [
  {
    title: 'Watchlist',
    count: films.filter((film) => film.isWatchlist).length
  },
  {
    title: 'History',
    count: films.filter((film) => film.isWatched).length
  },
  {
    title: 'Favorites',
    count: films.filter((film) => film.isFavorite).length
  }
];

export const generateFilters = () => [
  {
    title: 'Sort by default',
    active: true,
  },
  {
    title: 'Sort by date',
  },
  {
    title: 'Sort by rating',
  }
];
