import FilmListContainerView from '../view/card-film-view.js';
import BtnShowMoreView from '../view/btn-show-more-view.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {MoviePresenter} from './movie-presenter.js';
import LoadingView from '../view/loading-view.js';
import {updateFilm} from '../utils/common.js';


export class MovieListPresenter {
    #filmContainer = null;
    #films = null;
    #siteMainElement = null;
    #moviePresenter = new Map()
    #btnShowMore = null;

    #filmListContainer = new FilmListContainerView();
    #noFilms = new LoadingView();

    constructor(siteMainElement){
      this.#siteMainElement = siteMainElement;

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

          const moviePresenter = new MoviePresenter(this.#filmContainer, this.#handleFilmChange);
          moviePresenter.init(this.#films[i]);
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

    #renderNoFilms = () => {
      render(this.#siteMainElement, this.#noFilms, RenderPosition.BEFOREEND);
    }

    #clearFilmList = () => {
      this.#moviePresenter.forEach((presenter) => presenter.destroy());
      this.#moviePresenter.clear();
      remove(this.#btnShowMore);
    }

    #handleFilmChange = (updatedFilm) => {
      updateFilm(this.#films, updatedFilm);
    }
}

