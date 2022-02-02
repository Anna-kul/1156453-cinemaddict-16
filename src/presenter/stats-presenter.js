import {remove, render, RenderPosition} from '../utils/render.js';
import StatsView from '../view/stats-view/stats-view';
import {Screen} from '../model/screens-model';

export default class StatsPresenter {
  #root = null;

  #statsView = null;

  #moviesModel = null;
  #screensModel = null;

  constructor(root, moviesModel, screensModel){
    this.#root = root;
    this.#moviesModel = moviesModel;
    this.#screensModel = screensModel;

    this.#statsView = new StatsView({userRank: this.#moviesModel.getUserRank(), moviesStatistic: this.#moviesModel.getMoviesStatistic()});
  }

  init = () => {
    this.#moviesModel.addObserver(this.#handleMoviesModelChange);
    this.#screensModel.addObserver(this.#handleScreensModelChange);

    if (this.#screensModel.screen === Screen.STATS) {
      render(this.#root, this.#statsView, RenderPosition.BEFOREBEGIN);
    }
  }

  #clear = () => {
    remove(this.#statsView);
  }

  #reinit = () => {
    this.#clear();

    if (this.#screensModel.screen === Screen.STATS) {
      render(this.#root, this.#statsView, RenderPosition.BEFOREBEGIN);
    }
  }

  #handleMoviesModelChange = () => {
    this.#reinit();

    this.#statsView.updateData({userRank: this.#moviesModel.getUserRank(), moviesStatistic: this.#moviesModel.getMoviesStatistic()});
  }

  #handleScreensModelChange = () => {
    if (this.#screensModel.screen === Screen.STATS) {
      render(this.#root, this.#statsView, RenderPosition.BEFOREEND);

      return;
    }

    this.#clear();
  }
}
