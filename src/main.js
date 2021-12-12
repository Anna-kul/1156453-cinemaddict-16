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

const FILM_COUNT = 22;
export const films = Array.from({length: FILM_COUNT}, generateCardFilm);


const siteMainElement = document.querySelector('.main');


const header = document.querySelector('.header');
const userRankView = new UserRankView();
render(header, userRankView, RenderPosition.BEFOREEND);

const menuNavigation = new MenuNavigationView(generateNavigationSiteMenu());
render(siteMainElement, menuNavigation, RenderPosition.BEFOREEND);

const filterMenu = new FilterMenuView(generateFilters());
render(siteMainElement, filterMenu, RenderPosition.BEFOREEND);

const filmListContainer = new FilmListContainerView();
render(siteMainElement, filmListContainer, RenderPosition.BEFOREEND);
const filmContainer = document.querySelector('.films-list__container');


const popupView = new PopupView();

let curentCardCount = 0;

//показывает следующие 5 фильмов
const showCards = () => {

  for (let i = curentCardCount; i < curentCardCount + 5; i++) {
    //если фильмов не осталось, то не выводить
    if(i >= films.length) {
      curentCardCount = films.length;
      break;
    }
    const cardFilmView = new CardFilmView(films[i], i);
    // при клике на фильм открыть попап
    cardFilmView.setClickHandler(() => {
      // какой фильм показать в попапе
      popupView.film = films[i];
      //закрыть попап при клике на крестик
      popupView.setClickHandler(() => {
        document.body.removeChild(popupView.elem);
        document.body.classList.remove('hide-overflow');
        popupView.removeElement();
      });
      document.body.appendChild(popupView.elem);
      document.body.classList.add('hide-overflow');
    });
    render(filmContainer, cardFilmView, RenderPosition.BEFOREEND);
  }
  curentCardCount += 5;

};


showCards();


const btnShowMore = new BtnShowMoreView();
btnShowMore.setClickHandler(() => {
  showCards();
  // если все фильмы выведены удалить кнопку
  if(curentCardCount >= films.length){
    btnShowMore.elem.remove();
  }
});

render(siteMainElement, btnShowMore, RenderPosition.BEFOREEND);
