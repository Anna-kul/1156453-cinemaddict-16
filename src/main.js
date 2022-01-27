import {generateCardFilm} from './mock/film.js';
import UserRankView from './view/users-rank-view.js';
import MenuNavigationView from './view/menu-navigation-view.js';
import SortingMenuView from './view/sorting-menu-view';
import {render, RenderPosition} from './utils/render.js';
import {generateNavigationSiteMenu, generateSortings} from './mock/site-menu.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import MoviePopupView from './view/movie-popup-view/movie-popup-view.js';
import MoviesModel from './model/movies-model';
import ApiService from './service/api-service';

const FILM_COUNT = 22;
const API_ENDPOINT = 'https://16.ecmascript.pages.academy/cinemaddict';
const API_AUTHORIZATION_TOKEN = 'Basic SOME_TOKEN';

export const films = Array.from({length: FILM_COUNT}, generateCardFilm);

const apiService = new ApiService(API_ENDPOINT, API_AUTHORIZATION_TOKEN);

const siteMainElement = document.querySelector('.main');
const header = document.querySelector('.header');

const moviesModel = new MoviesModel(apiService);

moviesModel.init().finally(() => {
  const menuNavigationView = new MenuNavigationView(generateNavigationSiteMenu(moviesModel.movies));

  const handleFilterLinkClick = (filter) => {
    moviesModel.setFilter(filter);
  };

  menuNavigationView.setFilterLinkClickHandler(handleFilterLinkClick);

  render(siteMainElement, menuNavigationView, RenderPosition.BEFOREEND);

  const sortingMenuView = new SortingMenuView(generateSortings());

  const handleSortingLinkClick = (sorting) => {
    moviesModel.setSorting(sorting);
  };

  sortingMenuView.setSorgingLinkClickHandler(handleSortingLinkClick);

  render(siteMainElement, sortingMenuView, RenderPosition.BEFOREEND);
  render(header,new UserRankView(), RenderPosition.BEFOREEND);

  const popupView = new MoviePopupView();

  const movieListPresenter = new MovieListPresenter(siteMainElement, popupView, moviesModel);

  movieListPresenter.init();
});

