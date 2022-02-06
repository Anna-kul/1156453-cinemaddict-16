import SmartView  from '../smart-view.js';

import createFooterTemplate from './template';

export default class FooterView extends SmartView {
  _data = {moviesAmount: 0}

  constructor({moviesAmount}) {
    super();

    this._data.moviesAmount = moviesAmount;
  }

  get template() {
    const {moviesAmount} = this._data;

    return createFooterTemplate({moviesAmount});
  }

  restoreHandlers() {}
}
