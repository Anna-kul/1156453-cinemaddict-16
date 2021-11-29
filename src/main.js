import {createSiteMenuTemplate, createFilterTemplate} from './view/site-menu-view.js';
import {createFilmListTemplate} from './view/film-list-view.js';
import {createUsersRankTemplate} from './view/users-rank-view.js';
import {createBtnShowMore} from './view/btn-show-more-view.js';


const siteMainElement = document.querySelector('.main');


const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};
const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilterTemplate(), RenderPosition.BEFOREEND);


const header = document.querySelector('.header');
renderTemplate(header, createUsersRankTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteMainElement, createFilmListTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteMainElement, createBtnShowMore(), RenderPosition.BEFOREEND);


