import fetchJson from './utils/fetch-json.js';

export default class ColumnChart {
  element; // HTMLElement;
  subElements = {};
  chartHeight = 50;
  serverUrl = 'https://course-js.javascript.ru';
  data = [];

  constructor({
    url = '',
    range = {
      from: new Date(),
      to: new Date(),
    },
    label = '',
    link = '',
    formatHeading = data => `${data}`,
  } = {}) {
    this.url = new URL(url, this.serverUrl);
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
    this.fetchData();
  }

  async fetchData() {
    this.element.classList.add('column-chart_loading');
    this.subElements.header.textContent = '';
    this.subElements.body.innerHTML = '';
    this.url.searchParams.set('from', this.range.from.toISOString());
    this.url.searchParams.set('to', this.range.to.toISOString());

    const data = await fetchJson(this.url);

    if (! data) {
      return;
    }

    this.data = Object.values(data);
    this.subElements.body.innerHTML = this.getColumns();
    this.subElements.header.innerHTML = this.getHeader();
    this.element.classList.remove('column-chart_loading');
  }

  get template() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.getLabel()}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header"></div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>
    `;
  }

  getLabel() {
    return this.label ? 'Total ' + this.label : '';
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  getHeader() {
    return this.formatHeading(Object.values(this.data).reduce((accum, item) => (accum + item), 0));
  }

  getColumns() {
    const maxValue = Math.max(...this.data);
    const chartRatio = this.chartHeight / Math.max(...this.data);

    return this.data.map(value => {
      const heigh = Math.floor(chartRatio * value)
      const percent = (value / maxValue * 100).toFixed(0);

      return `<div style="--value: ${heigh}" data-tooltip="${percent}%"></div>`;
    })
    .join('');
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const subElements = element.querySelectorAll('[data-element]')

    return [...subElements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  async update(from, to) {
    this.range = {
      from,
      to
    };

    return await this.fetchData();
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
