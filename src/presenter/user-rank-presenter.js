import {render, RenderPosition} from '../utils/render.js';
import UserRankView from '../view/user-rank-view/users-rank-view';

export default class UserRankPresenter {
  #root = null;

  #userRankView = null;

  #moviesModel = null;

  constructor(root, moviesModel){
    this.#root = root;
    this.#moviesModel = moviesModel;
    this.#userRankView = new UserRankView({userRank: this.#moviesModel.getUserRank()});
  }

  init = () => {
    this.#moviesModel.addObserver(this.#handleMoviesModelChange);

    render(this.#root, this.#userRankView, RenderPosition.BEFOREEND);
  }

  #handleMoviesModelChange = () => {
    this.#userRankView.updateData({userRank: this.#moviesModel.getUserRank()});
  }
}
