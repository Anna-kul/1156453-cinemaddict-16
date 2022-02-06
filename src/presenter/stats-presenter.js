import {remove, render, RenderPosition} from '../utils/render.js';
import StatsView from '../view/stats-view/stats-view';
import {Screen} from '../model/screens-model';


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
    this.#filtersModel.addObserver(this.#handleFiltersModelChange);

    if (this.#screensModel.screen !== Screen.STATS) {
      return;
    }

    this.#statsView.setFiltersChangeHandler(this.#handleFiltersChange);

    render(this.#root, this.#statsView, RenderPosition.BEFOREBEGIN);
  }

  #reinit = () => {
    this.#clear();

    if (this.#screensModel.screen !== Screen.STATS) {
      return;
    }

    this.#statsView.setFiltersChangeHandler(this.#handleFiltersChange);

    render(this.#root, this.#statsView, RenderPosition.BEFOREBEGIN);

    this.#statsView.updateData({
      userRank: this.#moviesModel.getUserRank(),
      moviesStatistic: this.#moviesModel.getMoviesStatistic({filter: this.#filtersModel.filter}),
      activeStatisticFilter: this.#filtersModel.filter,
    });

    this.#statsView.renderChart();
  }

  #clear = () => {
    remove(this.#statsView);
  }

  #handleMoviesModelChange = () => {
    this.#reinit();

    this.#statsView.updateData({
      userRank: this.#moviesModel.getUserRank(),
      moviesStatistic: this.#moviesModel.getMoviesStatistic({filter: this.#filtersModel.filter}),
      activeStatisticFilter: this.#filtersModel.filter
    });
  }

  #handleFiltersModelChange = () => {
    if (this.#screensModel.screen === Screen.STATS) {
      this.#reinit();

      return;
    }

    this.#clear();
  }

  #handleFiltersChange = (statisticFilter) => {
    this.#filtersModel.filter = statisticFilter;
  }
}
