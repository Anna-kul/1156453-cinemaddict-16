import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {Filter} from '../../model/movies-model';
dayjs.extend(duration);

const BAR_HEIGHT = 50;

const createStatsTemplate = ({userRank, moviesStatistic, activeStatisticFilter}) => (
  `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statisticFilter"
        id="statistic-all-time"
        value="${Filter.HISTORY}"
        ${activeStatisticFilter === Filter.HISTORY ? 'checked' : ''}
      >
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statisticFilter"
        id="statistic-today"
        value="${Filter.HISTORY_TODAY}"
        ${activeStatisticFilter === Filter.HISTORY_TODAY ? 'checked' : ''}
      >
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statisticFilter"
        id="statistic-week"
        value="${Filter.HISTORY_WEEK}"
        ${activeStatisticFilter === Filter.HISTORY_WEEK ? 'checked' : ''}
      >
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statisticFilter"
        id="statistic-month"
        value="${Filter.HISTORY_MONTH}"
        ${activeStatisticFilter === Filter.HISTORY_MONTH ? 'checked' : ''}
      >
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statisticFilter"
        id="statistic-year"
        value="${Filter.HISTORY_YEAR}"
        ${activeStatisticFilter === Filter.HISTORY_YEAR ? 'checked' : ''}
      >
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${moviesStatistic.watchedMoviesAmount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${dayjs.duration(moviesStatistic.totalDuration, 'minutes').format('H[h] m[m]')}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${moviesStatistic.topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000" height="${BAR_HEIGHT * Object.keys(moviesStatistic.viewsByGenre).length}"></canvas>
    </div>

  </section>`
);

export default createStatsTemplate;
