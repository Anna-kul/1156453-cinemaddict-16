import SmartView  from '../smart-view.js';

import createStatsTemplate from './template';

export default class StatsView extends SmartView {
  _data = {userRank: '', moviesStatistic: {}}

  constructor({userRank, moviesStatistic}) {
    super();

    this._data.userRank = userRank;
    this._data.moviesStatistic = moviesStatistic;
  }


  get template() {
    const {userRank, moviesStatistic} = this._data;
    return createStatsTemplate({userRank, moviesStatistic});
  }

  restoreHandlers() {}
}
