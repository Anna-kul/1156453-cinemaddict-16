import {createSiteMenuTemplate, createFilterTemplate} from './view/site-menu-view.js';
import {createStatTemplate} from './view/statistic-view.js';
import {createCardFilmTemplate} from './view/card-film-view.js';
import {createUsersRankTemplate} from './view/users-rank-view.js';
import {createBtnShowMore} from './view/btn-show-more-view.js';
// eslint-disable-next-line no-unused-vars
import {createPopupTemplate} from './view/popup-view.js';

const FILMS_COUNT = 5;
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
renderTemplate(siteMainElement, createStatTemplate(), RenderPosition.BEFOREEND);

const header = document.querySelector('.header');
renderTemplate(header, createUsersRankTemplate(), RenderPosition.BEFOREEND);

for (let i = 0; i < FILMS_COUNT; i++){
  renderTemplate(siteMainElement, createCardFilmTemplate(), RenderPosition.BEFOREEND);
}
renderTemplate(siteMainElement, createBtnShowMore(), RenderPosition.BEFOREEND);
//renderTemplate(siteMainElement, createPopupTemplate(), RenderPosition.BEFOREEND);

