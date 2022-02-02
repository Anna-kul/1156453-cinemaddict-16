import SmartView  from '../smart-view.js';

import createUserRankTemplate from './template';

export default class UserRankView extends SmartView {
  _data = {userRank: ''}

  get template() {
    const {userRank} = this._data;

    return createUserRankTemplate(userRank);
  }

  restoreHandlers() {}
}
