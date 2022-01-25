import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {CardFilmView} from '../view/card-film-view.js';
import PopupView from '../view/popup-view.js';
//import { CategoryType } from '../utils/const.js';
export class MoviePresenter {
  #movieId = null;
  #filmContainer = null;
  #cardFilmView = null;
  #popupView = null;
  #moviesModel = null;


  constructor(filmContainer, moviesModel){
    this.#filmContainer = filmContainer;
    this.#moviesModel = moviesModel;
  }

  init = (movieId) => {
    this.#movieId = movieId;

    const prevCardFilmView = this.#cardFilmView;

    this.#moviesModel.addObserver(this.#handleMoviesModelChange);

    const movie = this.#moviesModel.getMovie(movieId);

    this.#cardFilmView = new CardFilmView(movie);
    this.#cardFilmView.setClickHandler(this.cardFilmClichHandler);

    this.#cardFilmView.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#cardFilmView.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#cardFilmView.setAddedToWatchlistClickHandler(this.#handleAddedToWatchlistClick);

    this.#popupView = new PopupView(movie);

    if (prevCardFilmView === null) {
      render(this.#filmContainer, this.#cardFilmView, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#cardFilmView, prevCardFilmView);
    remove(prevCardFilmView);
  }


  cardFilmClichHandler = () => {
    document.body.appendChild(this.#popupView.elem);
    document.body.classList.add('hide-overflow');
    this.#popupView.setCloseBtnClickHandler(this.#closePopup);
    this.#popupView.setEscKeyPresshandler(this.#closePopup);
    this.#popupView.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupView.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#popupView.setAddedToWatchlistClickHandler(this.#handleAddedToWatchlistClick);
    this.#popupView.setChangeHandler(this.#handlePopupViewChange);
  }

  #closePopup = () => {
    document.body.removeChild(this.#popupView.elem);
    document.body.classList.remove('hide-overflow');
    this.#popupView.removeElement();
  }

  #handleMoviesModelChange = (_, changeType) => {
    console.log('changed minor')
    if (changeType !== 'minor') {
      return;
    }

    const movie = this.#moviesModel.getMovie(this.#movieId);

    this.#cardFilmView.updateData(movie);
    this.#popupView.updateData(movie);
  }

  #handleFavoriteClick = () => {
    const movie = this.#moviesModel.getMovie(this.#movieId);

    this.#moviesModel.updateMovie(this.#movieId, {isFavorite: !movie.isFavorite});
  }

  #handleAlreadyWatchedClick = () => {
    const movie = this.#moviesModel.getMovie(this.#movieId);

    this.#moviesModel.updateMovie(this.#movieId, {isWatched : !movie.isWatched});
  }

  #handleAddedToWatchlistClick = () => {
    const movie = this.#moviesModel.getMovie(this.#movieId);

    this.#moviesModel.updateMovie(this.#movieId, {isWatchlist: !movie.isWatchlist});
  }

  #handlePopupViewChange = (data) => {
    const {comment: commentText, ['comment-emoji']: commentEmoji} = data;

    this.#popupView.updateData({
      commentText,
      ...commentEmoji && {commentEmoji}}
    );
  }

  destroy = () => {
    remove(this.#cardFilmView);
  }

  setCategoryClickHandler = (handler) => {
    this.#cardFilmView.setCategoryClickHandler(handler);
  }

  setClickHandler = (handler) => {
    this.#cardFilmView.setClickHandler(handler);
  }
}
