import {render, RenderPosition} from '../utils/render.js';
import FooterView from '../view/footer-view/footer-view';

export default class FooterPresenter {
  #root = null;

  #footerView = null;

  #moviesModel = null;

  constructor(root, moviesModel){
    this.#root = root;
    this.#moviesModel = moviesModel;
    this.#footerView = new FooterView({moviesAmount: 0});
  }

  init = () => {
    this.#moviesModel.addObserver(this.#handleMoviesModelMajorChange);

    render(this.#root, this.#footerView, RenderPosition.AFTEREND);
  }

  #handleMoviesModelMajorChange = () => {
    this.#footerView.updateData({moviesAmount: this.#moviesModel.movies.length});
  }
}
