import {Sorting, Filter} from '../utils/const.js';

export const generateNavigationSiteMenu = (movies) => [
  {
    id: Filter.WATCHLIST,
    title: 'Watchlist',
    count: movies.filter((film) => film.isWatchlist).length
  },
  {
    id: Filter.HISTORY,
    title: 'History',
    count: movies.filter((film) => film.isWatched).length
  },
  {
    id: Filter.FAVORITES,
    title: 'Favorites',
    count: movies.filter((film) => film.isFavorite).length
  }
];

export const generateSortings = () => [
  {
    id: Sorting.DEFAULT,
    title: 'Sort by default',
    active: true,
  },
  {
    id: Sorting.DATE,
    title: 'Sort by date',
  },
  {
    id: Sorting.RATING,
    title: 'Sort by rating',
  }
];
