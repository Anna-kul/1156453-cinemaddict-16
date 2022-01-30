import {render, RenderPosition} from '../utils/render.js';
import {ChangeType} from '../utils/const';

export default class MenuPresenter {
  #root = null;

  #menuNavigationView = null;

  #filtersModel = null;
  #moviesModel = null;

  constructor(root, menuNavigationView, filtersModel, moviesModel){
    this.#root = root;
    this.#menuNavigationView = menuNavigationView;
    this.#filtersModel = filtersModel;
    this.#moviesModel = moviesModel;
  }

  init = () => {
    this.#filtersModel.addObserver(this.#handleFiltersModelChange);

    this.#menuNavigationView.setFilterLinkClickHandler(this.#handleFilterLinkClickHandler);

    render(this.#root, this.#menuNavigationView, RenderPosition.BEFOREBEGIN);
  }

  #handleFiltersModelChange = (_, changeType) => {
    if (changeType !== ChangeType.MINOR) {
      return;
    }

    this.#menuNavigationView.updateData({filters: this.#filtersModel.filters});
  }

  #handleFilterLinkClickHandler = (filter) => {
    this.#moviesModel.setFilter(filter);
    this.#filtersModel.activeFilter = filter;
  }
}
