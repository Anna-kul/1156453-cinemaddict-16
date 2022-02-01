import AbstractView from './abstract-view';

export const createMovieListTemplate = () => (
  `<section class="films">
      <section class="films-list">
        <div class="films-list__container">
        </div>
      </section>
    </section>`
);

export default class MovieListView extends AbstractView {
  get template() {
    return createMovieListTemplate();
  }
}
