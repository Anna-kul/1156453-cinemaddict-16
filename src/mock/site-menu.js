import {Sorting} from '../utils/const.js';

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
