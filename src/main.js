import {API_AUTHORIZATION_TOKEN, API_ENDPOINT} from './constants';

import MovieListPresenter from './presenter/movie-list-presenter.js';
import NavigationMenuPresenter from './presenter/navigation-menu-presenter.js';
import StatsPresenter from './presenter/stats-presenter';
import SortingMenuPresenter from './presenter/sorting-menu-presenter';
import UserRankPresenter from './presenter/user-rank-presenter';

import MoviesModel from './model/movies-model';
import CommentsModel from './model/comments-model';
import FiltersModel from './model/filters-model.js';
import ApiService from './service/api-service';
import ScreensModel from './model/screens-model';
import SortingsModel from './model/sortings-model';

const siteMainElement = document.querySelector('.main');
const header = document.querySelector('.header');

const apiService = new ApiService(API_ENDPOINT, API_AUTHORIZATION_TOKEN);

const commentsModel = new CommentsModel(apiService);
const moviesModel = new MoviesModel(apiService);
const filtersModel = new FiltersModel();
const sortingsModel = new SortingsModel();
const screensModel = new ScreensModel();

const sortingMenuPresenter = new SortingMenuPresenter(siteMainElement, sortingsModel, moviesModel, filtersModel, screensModel);
const statsPresenter = new StatsPresenter(siteMainElement, moviesModel, filtersModel, screensModel);
statsPresenter.init();
const movieListPresenter = new MovieListPresenter(
  siteMainElement,
  moviesModel,
  commentsModel,
  filtersModel,
  sortingsModel,
  screensModel,
);
movieListPresenter.init();
const userRankPresenter = new UserRankPresenter(header, moviesModel);
userRankPresenter.init();
const navigationMenuPresenter = new NavigationMenuPresenter(
  siteMainElement,
  filtersModel,
  moviesModel,
  screensModel,
);
navigationMenuPresenter.init();

moviesModel.init().then(() => {
  sortingMenuPresenter.init();
});

/**
 * TODO:
 * 1. Доработка модели для отправки обновленных данных фильма, в т. ч. создание коментария
 * 2. Отображение статистики
 * 3. Унифицировать метод сортировки и фильтрации
 * 4. Посмотреть баг с последовательным переходом по фильтрам (не отображаются фильмы согласно новому фильтру)
 * 5. Экранизация ввода комментария
 */
