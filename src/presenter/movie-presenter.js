import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {CardFilmView} from '../view/card-film-view.js';
import PopupView from '../view/popup-view.js';
//import { CategoryType } from '../utils/const.js';
export class MoviePresenter {
  #filmContainer = null;
  film = null;
  #cardFilmComponent = null;
  #popupView = null;
  #handleFilmChange = null;
  //#changeData = null;

  constructor(filmContainer, handleFilmChange){
    this.#filmContainer = filmContainer;
    // this.#changeData = changeData;
    this.#handleFilmChange = handleFilmChange;
  }

  init = (film) => {
    const prevCardFilmComponent = this.#cardFilmComponent;
    this.#cardFilmComponent = new CardFilmView(film);
    this.#cardFilmComponent.setClickHandler(this.cardFilmClichHandler);

    this.#cardFilmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#cardFilmComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#cardFilmComponent.setAddedToWatchlistClickHandler(this.#handleAddedToWatchlistClick);

    this.#popupView = new PopupView(film);
    // this.#popupView.setClickHandler(this.#closePopup) ;
    // this.#popupView.setEscKeyPresshandler(this.#closePopup)
    this.film = film;

    if(prevCardFilmComponent === null) {
      render(this.#filmContainer, this.#cardFilmComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this.#cardFilmComponent, prevCardFilmComponent);
    remove(prevCardFilmComponent);
  }


  cardFilmClichHandler = () => {
    document.body.appendChild(this.#popupView.elem);
    document.body.classList.add('hide-overflow');
    //this.#popupView.setCategoryClickHandler(this.#popupCategoryClickHandler);
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

  // #popupCategoryClickHandler = (category, film) =>{
  //   this.#changeCategory(category, film);
  //   this.#popupView.setCategoryClickHandler(this.#categoryClickHandler);
  //   // moviePresenter.setClickHandler(this.#cardFilmClickHandler);
  //   // const scrollTop = this.#popupView.elem.scrollTop;
  //   // this.#closePopup();
  //   // this.#openPopup(film);
  //   // this.#popupView.elem.scrollTop = scrollTop;
  // }

  // #categoryClickHandler = (category, film) =>{
  //   this.#changeCategory(category, film);
  //   //   const moviePresenter = this.#moviePresenter.get(film.id);
  //   //   moviePresenter.init(film);
  //   // moviePresenter.setCategoryClickHandler(this.#categoryClickHandler);
  //   // moviePresenter.setClickHandler(this.#cardFilmClickHandler);
  //   //}
  // }

  // #changeCategory = (category, film) => {
  //   switch (category){
  //     case CategoryType.WATCHLIST:
  //       film.isWatchlist = !film.isWatchlist;
  //       break;
  //     case CategoryType.WATCHED:
  //       film.isWatched = !film.isWatched;
  //       break;
  //     case CategoryType.FAVORIT:
  //       film.isFavorite = !film.isFavorite;
  //       break;
  //   }
  // }

  #handleFavoriteClick = () => {
    // this.#changeData(
    //   UserAction.UPDATE_FILM,
    //   UpdateType.PATCH,
    //   {...this.#film, isFavorite: !this.#film.isFavorite},
    // );

    const updatedFilm = {...this.film, isFavorite: !this.film.isFavorite};
    //здесь вызывается обновление данных
    this.#handleFilmChange(updatedFilm);
    this.#popupView.updateData(updatedFilm);
    this.#cardFilmComponent.updateData(updatedFilm);
  }

  #handleAlreadyWatchedClick = () => {
    // this.#changeData(
    //   UserAction.UPDATE_FILM,
    //   UpdateType.PATCH,
    //   {...this.#film, isAlreadyWatched: !this.#film.isAlreadyWatched});
    const updatedFilm = {...this.film, isWatched : !this.film.isWatched};

    this.#handleFilmChange(updatedFilm);
    this.#popupView.updateData(updatedFilm);
    this.#cardFilmComponent.updateData(updatedFilm);
  }

  #handleAddedToWatchlistClick = () => {
    // this.#changeData(
    //   UserAction.UPDATE_FILM,
    //   UpdateType.PATCH,
    //   {...this.#film, isAddedToWatchlist: !this.#film.isAddedToWatchlist});

    const updatedFilm = {...this.film, isWatchlist: !this.film.isWatchlist};
    this.#popupView.updateData(updatedFilm);
    this.#handleFilmChange(updatedFilm);
    this.#popupView.updateData(updatedFilm);
    this.#cardFilmComponent.updateData(updatedFilm);
  }

  #handlePopupViewChange = (data) => {
    const {comment: commentText, ['comment-emoji']: commentEmoji} = data;

    this.#popupView.updateData({
      commentText,
      ...commentEmoji && {commentEmoji}}
    );
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
