import {render, RenderPosition, replace, remove} from '../render.js';
import {CardFilmView} from '../view/film-list-view.js';

export class MoviePresenter {
  #filmContainer = null;
  film = null;
  #cardFilmComponent = null;

  constructor(filmContainer){
    this.#filmContainer = filmContainer;
  }

  init = (film) => {
    const prevCardFilmComponent = this.#cardFilmComponent;
    this.#cardFilmComponent = new CardFilmView(film);
    this.film = film;

    if(prevCardFilmComponent === null) {
      render(this.#filmContainer, this.#cardFilmComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this.#cardFilmComponent, prevCardFilmComponent);
    remove(prevCardFilmComponent);
  }


  destroy = () => {
    remove(this.#cardFilmComponent);
  }

  setCategoryClickHandler = (handler) => {
    this.#cardFilmComponent.setCategoryClickHandler(handler);
  }

  setClickHandler = (handler) => {
    this.#cardFilmComponent.setClickHandler(handler);
  }
}

