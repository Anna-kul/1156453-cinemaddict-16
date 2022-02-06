import AbstractModel, {ChangeType} from './abstract-model';

export const Screen = {
  ALL_MOVIES: 'all-movies',
  HISTORY: 'history',
  WATCHLIST: 'watchlist',
  FAVORITES: 'favorites',
  STATS: 'stats',
};

export default class ScreensModel extends AbstractModel {
  _data = {
    screen: Screen.ALL_MOVIES,
    prevScreen: null,
  };

  get screen() {
    return this._data.screen;
  }

  set screen(screen) {
    if (screen === this.screen) {
      return;
    }

    this._data.prevScreen = this._data.screen;
    this._data.screen = screen;

    this._notifyObservers(ChangeType.MAJOR);
  }

  get prevScreen() {
    return this._data.prevScreen;
  }
}
