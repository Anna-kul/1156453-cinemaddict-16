import AbstractView from './abstract-view';

export const createFilmListContainer = () => (
  `<section class="films">
      <section class="films-list">
        <div class="films-list__container">
        </div>
      </section>
    </section>`
);

export default class FilmListContainerView extends AbstractView {

  get template() {
    return createFilmListContainer();
  }
}
