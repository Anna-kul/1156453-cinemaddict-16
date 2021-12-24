import {generateCardFilm} from './mock/film.js';
import UserRankView from './view/users-rank-view.js';
import MenuNavigationView from './view/site-menu-view.js';
import {FilterMenuView} from './view/site-menu-view.js';
import {render, RenderPosition} from './render.js';
import {generateNavigationSiteMenu, generateFilters} from './mock/site-menu.js';
import { MovieListPresenter } from './presenter/movie-list-presenter.js';
import PopupView from './view/popup-view.js';

const FILM_COUNT = 22;
export const films = Array.from({length: FILM_COUNT}, generateCardFilm);

const header = document.querySelector('.header');
render(header,new UserRankView, RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');

render(siteMainElement, new MenuNavigationView(generateNavigationSiteMenu()), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterMenuView(generateFilters()), RenderPosition.BEFOREEND);

const popupView = new PopupView();
const movieListPresenter = new MovieListPresenter(siteMainElement, popupView);
movieListPresenter.init(films);
