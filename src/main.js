import {CardFilmView} from './view/film-list-view.js';
import FilmListContainerView from './view/film-list-view.js';
import UserRankView from './view/users-rank-view.js';
import BtnShowMoreView from './view/btn-show-more-view.js';
import {generateCardFilm} from './mock/film.js';
import {generateNavigationSiteMenu, generateFilters} from './mock/site-menu.js';
import {render, RenderPosition} from './render.js';
import MenuNavigationView from './view/site-menu-view.js';
import {FilterMenuView} from './view/site-menu-view.js';
import PopupView from './view/popup-view.js';

const FILM_COUNT = 15;
export const films = Array.from({length: FILM_COUNT}, generateCardFilm);


const siteMainElement = document.querySelector('.main');


const header = document.querySelector('.header');
const userRankView = new UserRankView();
render(header, userRankView.elem, RenderPosition.BEFOREEND);

const menuNavigation = new MenuNavigationView(generateNavigationSiteMenu());
render(siteMainElement, menuNavigation.elem, RenderPosition.BEFOREEND);

const filterMenu = new FilterMenuView(generateFilters());
render(siteMainElement, filterMenu.elem, RenderPosition.BEFOREEND);

const filmListContainer = new FilmListContainerView();
render(siteMainElement, filmListContainer.elem, RenderPosition.BEFOREEND);
const filmContainer = document.querySelector('.films-list__container');


const popupView = new PopupView();

let curentCardCount = 0;

//показывает следующие 5 фильмов
const showCards = () => {

  for (let i = curentCardCount; i < curentCardCount + 5; i++) {
    const cardFilmView = new CardFilmView(films[i], i);
    // при клике на фильм открыть попап
    cardFilmView.elem.querySelector('.film-card__link').addEventListener('click', () =>{
      // какой фильм показать в попапе
      popupView.film = films[i];
      //закрыть попап при клике на крестик
      popupView.elem.querySelector('.film-details__close-btn').addEventListener('click', () => {
        document.body.removeChild(popupView.elem);
        document.body.classList.remove('hide-overflow');
      });
      document.body.appendChild(popupView.elem);
      document.body.classList.add('hide-overflow');
    });
    render(filmContainer, cardFilmView.elem, RenderPosition.BEFOREEND);
  }
  curentCardCount += 5;

};


showCards();

document.addEventListener('click', (evt) =>{
  if(evt.target.classList.contains('films-list__show-more')){
    showCards();
    if(curentCardCount >= films.length){
      document.querySelector('.films-list__show-more').remove();
    }
  }
});

const btnShowMore = new BtnShowMoreView();
render(siteMainElement, btnShowMore.elem, RenderPosition.BEFOREEND);
