import FilmListContainerView from '../view/film-list-view.js';
import BtnShowMoreView from '../view/btn-show-more-view.js';
import { CategoryType } from '../const.js';
import {render, RenderPosition, remove} from '../render.js';
import {MoviePresenter} from './movie-presenter.js';
import LoadingView from '../view/loading-view.js';

export class MovieListPresenter {
    #filmContainer = null;
    #films = null;
    #siteMainElement = null;
    #moviePresenter = new Map()
    #btnShowMore = null;
    #popupView = null;

    #filmListContainer = new FilmListContainerView();
    #noFilms = new LoadingView();

    constructor(siteMainElement, popupView){
      this.#siteMainElement = siteMainElement;
      this.#popupView = popupView;
    }

    init = (films) => {
      this.#films = [...films];
      this.#filmContainer = this.#filmListContainer.elem.querySelector('.films-list__container');
      if(films.length === 0) {
        this.#renderNoFilms();
        return;
      }
      render(this.#siteMainElement, this.#filmListContainer, RenderPosition.BEFOREEND);
      let curentCardCount = 0;
      //показывает следующие 5 фильмов
      const showCards = () => {
        for (let i = curentCardCount; i < curentCardCount + 5; i++) {
          //если фильмов не осталось, то не выводить
          if(i >= this.#films.length) {
            curentCardCount = this.#films.length;
            break;
          }

          const moviePresenter = new MoviePresenter(this.#filmContainer);
          moviePresenter.init(this.#films[i], i);
          moviePresenter.setCategoryClickHandler(this.#categoryClickHandler);
          moviePresenter.setClickHandler(this.#cardFilmClickHandler);
          this.#moviePresenter.set(this.#films[i].id, moviePresenter);

        }
        curentCardCount += 5;

      };
      showCards();

      this.#btnShowMore = new BtnShowMoreView();
      this.#btnShowMore.setClickHandler(() => {
        showCards();
        // если все фильмы выведены удалить кнопку
        if(curentCardCount >= this.#films.length){
          this.#btnShowMore.elem.remove();
        }
      });

      render(this.#siteMainElement, this.#btnShowMore, RenderPosition.BEFOREEND);
    }

    #openPopup = (film) => {
      // какой фильм показать в попапе
      this.#popupView.film = film;
      //закрыть попап при клике на крестик
      this.#popupView.setClickHandler(() => {
        this.#closePopup();
      });
      document.body.appendChild(this.#popupView.elem);
      document.body.classList.add('hide-overflow');
      this.#popupView.setCategoryClickHandler(this.#popupCategoryClickHandler);
      this.#popupView.setEscKeyPresshandler(this.#escKeydownHandler);
    }

    #closePopup = () => {
      document.body.removeChild(this.#popupView.elem);
      document.body.classList.remove('hide-overflow');
      this.#popupView.removeElement();
    }

    // при клике на фильм открыть попап
    #cardFilmClickHandler = (film) => {
      this.#openPopup(film);
    }

    #popupCategoryClickHandler = (category, film) =>{
      this.#changeCategory(category, film);
      const moviePresenter = this.#moviePresenter.get(film.id);
      moviePresenter.init(film);
      moviePresenter.setCategoryClickHandler(this.#categoryClickHandler);
      moviePresenter.setClickHandler(this.#cardFilmClickHandler);
      const scrollTop = this.#popupView.elem.scrollTop;
      this.#closePopup();
      this.#openPopup(film);
      this.#popupView.elem.scrollTop = scrollTop;
    }

    #categoryClickHandler = (category, film) =>{
      this.#changeCategory(category, film);
      const moviePresenter = this.#moviePresenter.get(film.id);
      moviePresenter.init(film);
      moviePresenter.setCategoryClickHandler(this.#categoryClickHandler);
      moviePresenter.setClickHandler(this.#cardFilmClickHandler);
    }

    #changeCategory = (category, film) => {
      switch (category){
        case CategoryType.WATCHLIST:
          film.isWatchlist = !film.isWatchlist;
          break;
        case CategoryType.WATCHED:
          film.isWatched = !film.isWatched;
          break;
        case CategoryType.FAVORIT:
          film.isFavorite = !film.isFavorite;
          break;
      }
    }

    #escKeydownHandler = () => {
      this.#closePopup();
    }

    #renderNoFilms = () => {
      render(this.#siteMainElement, this.#noFilms, RenderPosition.BEFOREEND);
    }

    #clearFilmList = () => {
      this.#moviePresenter.forEach((presenter) => presenter.destroy());
      this.#moviePresenter.clear();
      remove(this.#btnShowMore);
    }
}
