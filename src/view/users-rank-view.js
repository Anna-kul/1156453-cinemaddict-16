import {films} from '../main.js';
import {createElement} from '../render.js';
export default class UserRankView {
  #element = null;
  get template() {
    let rank;
    const filmsWatched = films.filter((film) => film.isWatched).length;
    if(filmsWatched >= 1 && filmsWatched <=10) {
      rank = 'Novice';
    } else if(filmsWatched >= 11 && filmsWatched <= 20){
      rank = 'Fan';
    } else if (filmsWatched >= 21) {
      rank = 'Movie buff';
    } else {
      rank = '';
    }

    return `<section class="header__profile profile">
       <p class="profile__rating">${rank}</p>
       <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`;
  }

  get elem() {
    // если элемент не найден, создаем новый элемент
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElem() {
    this.#element = null;
  }
}
