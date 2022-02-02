import {remove, render, RenderPosition} from '../utils/render.js';
import StatsView from '../view/stats-view/stats-view';
import {Screen} from '../model/screens-model';
import {Filter} from '../model/movies-model';

export default class StatsPresenter {
  #root = null;

  #statsView = null;

  #moviesModel = null;
  #filtersModel = null;
  #screensModel = null;

  constructor(root, moviesModel, filtersModel, screensModel){
    this.#root = root;
    this.#moviesModel = moviesModel;
    this.#screensModel = screensModel;
    this.#filtersModel = filtersModel;

    this.#statsView = new StatsView({userRank: this.#moviesModel.getUserRank(), moviesStatistic: this.#moviesModel.getMoviesStatistic()});
  }

  init = () => {
    this.#moviesModel.addObserver(this.#handleMoviesModelChange);
    this.#screensModel.addObserver(this.#handleScreensModelChange);
    this.#filtersModel.addObserver(this.#handleFiltersModelChange);

    this.#statsView.setFiltersChangeHandler(this.#handleFiltersChange);

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
      this.#statsView.renderChart();
    }
  }

  #handleMoviesModelChange = () => {
    this.#reinit();

    this.#statsView.updateData({
      userRank: this.#moviesModel.getUserRank(),
      moviesStatistic: this.#moviesModel.getMoviesStatistic({filter: this.#filtersModel.filter}),
      activeStatisticFilter: this.#filtersModel.filter
    });
  }

  #handleScreensModelChange = () => {
    if (this.#screensModel.screen === Screen.STATS) {
      render(this.#root, this.#statsView, RenderPosition.BEFOREEND);

      return;
    }

    this.#clear();
  }

  #handleFiltersChange = (statisticFilter) => {
    this.#filtersModel.filter = statisticFilter;
  }

  #handleFiltersModelChange = () => {
    this.#reinit();

    this.#statsView.updateData({
      userRank: this.#moviesModel.getUserRank(),
      moviesStatistic: this.#moviesModel.getMoviesStatistic({filter: this.#filtersModel.filter}),
      activeStatisticFilter: this.#filtersModel.filter,
    });
  }
}
