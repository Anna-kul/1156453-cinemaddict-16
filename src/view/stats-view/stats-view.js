import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {Color} from '../../constants';
import {Filter} from '../../model/movies-model';
import SmartView  from '../smart-view.js';

import createStatsTemplate from './template';

export default class StatsView extends SmartView {
  #chart = null;
  #timeoutId = null;

  _data = {userRank: '', moviesStatistic: {}, activeStatisticFilter: Filter.HISTORY}

  constructor({userRank, moviesStatistic}) {
    super();

    this._data.userRank = userRank;
    this._data.moviesStatistic = moviesStatistic;

    this.renderChart();
  }

  get template() {
    const {userRank, moviesStatistic, activeStatisticFilter} = this._data;
    return createStatsTemplate({userRank, moviesStatistic, activeStatisticFilter});
  }

  removeElement() {
    super.removeElement();

    if (this.#chart === null) {
      return;
    }

    clearTimeout(this.#timeoutId);

    this.#timeoutId = null;

    this.#chart.destroy();

    this.#chart = null;
  }

  restoreHandlers() {
    this.#getFilters().addEventListener('change', this.#handleFiltersChange);
  }

  renderChart = () => {
    const {moviesStatistic} = this._data;

    this.#timeoutId = setTimeout(() => {
      this.#chart = new Chart(this.#getChart(), {
        plugins: [ChartDataLabels],
        type: 'horizontalBar',
        data: {
          labels: Object.keys(moviesStatistic.viewsByGenre),
          datasets: [{
            data: Object.values(moviesStatistic.viewsByGenre),
            backgroundColor: Color.TURBO,
            hoverBackgroundColor: Color.TURBO,
            anchor: 'start',
            barThickness: 24,
          }],
        },
        options: {
          responsive: false,
          plugins: {
            datalabels: {
              font: {
                size: 20,
              },
              color: Color.WHITE,
              anchor: 'start',
              align: 'start',
              offset: 40,
            },
          },
          scales: {
            yAxes: [{
              ticks: {
                fontColor: Color.WHITE,
                padding: 100,
                fontSize: 20,
              },
              gridLines: {
                display: false,
                drawBorder: false,
              },
            }],
            xAxes: [{
              ticks: {
                display: false,
                beginAtZero: true,
              },
              gridLines: {
                display: false,
                drawBorder: false,
              },
            }],
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
        },
      });
    }, 1000);
  }

  #getFilters = () => this.elem.querySelector('.statistic__filters');

  #getChart = () => this.elem.querySelector('.statistic__chart');

  setFiltersChangeHandler(handler) {
    this._callback.filtersChangeHandler = handler;

    this.#getFilters().addEventListener('change', this.#handleFiltersChange);
  }

  #handleFiltersChange = (evt) => {
    evt.preventDefault();

    if (this._callback.filtersChangeHandler === undefined) {
      return;
    }

    const {statisticFilter} = Object.fromEntries(new FormData(evt.currentTarget).entries());

    this._callback.filtersChangeHandler(statisticFilter);
  }
}
