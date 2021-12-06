import {createNavigationMenuTemplate, createFilterTemplate} from './view/site-menu-view.js';
import {createFilmListContainer, createCardFilmTemplate} from './view/film-list-view.js';
import {createUsersRankTemplate} from './view/users-rank-view.js';
import {createBtnShowMore} from './view/btn-show-more-view.js';
import {generateCardFilm} from './mock/film.js';
import {generateNavigationSiteMenu, generateFilters} from './mock/site-menu.js';
import {createPopupTemplate} from './view/popup-view.js';

const FILM_COUNT = 15;
export const films = Array.from({length: FILM_COUNT}, generateCardFilm);


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

renderTemplate(siteMainElement, createNavigationMenuTemplate(generateNavigationSiteMenu()), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilterTemplate(generateFilters()), RenderPosition.BEFOREEND);

const header = document.querySelector('.header');


renderTemplate(header, createUsersRankTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteMainElement,createFilmListContainer(), RenderPosition.BEFOREEND);
const filmContainer = document.querySelector('.films-list__container');

let curentCardCount = 0;

//показывает следющие 5 фильмов
const showCards = () => {
  for (let i = curentCardCount; i < curentCardCount + 5; i++) {
    renderTemplate(filmContainer, createCardFilmTemplate(films[i], i), RenderPosition.BEFOREEND);
  }
  curentCardCount += 5;
};

showCards();
document.addEventListener('click', (evt) =>{

  //открыть попап
  if(evt.target.classList.contains('film-card__poster')){
    renderTemplate(siteMainElement, createPopupTemplate(films[0]), RenderPosition.BEFOREEND);
  }
  //удалили попап после нажатия на крестик
  if(evt.target.classList.contains('film-details__close-btn')){
    const filmDetails = document.querySelector('.film-details');
    filmDetails.remove();
  }
  //при клике на show more показать следующие 5 фильмов

  if(evt.target.classList.contains('films-list__show-more')){
    showCards();
    if(curentCardCount >= films.length){
      document.querySelector('.films-list__show-more').remove();
    }
  }

});


renderTemplate(siteMainElement, createBtnShowMore(), RenderPosition.BEFOREEND);


