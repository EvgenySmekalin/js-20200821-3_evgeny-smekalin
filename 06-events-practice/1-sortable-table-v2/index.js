export default class SortableTable {
  element; // HTMLElement;

  constructor(
    header = [],
    {data = []} = {data: []}
  ) {
    this.header = header;
    this.data = data;

    this.arrowTemplate = this.getaArrowTemplate();
    this.render();
    this.initEventListeners();
  }

  sortByColumn = (event) => {
    this.sort(event.currentTarget);
  }

  initEventListeners() {
    this.sortableHeaders = this.element.querySelectorAll('.sortable-table__cell[data-sortable=true]');
    this.sortableHeaders.forEach(header => {
      header.addEventListener('pointerdown', this.sortByColumn);
    });
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
  }

  getaArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  get template() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">

          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.fillHeader(this.header)}
          </div>

          <div data-element="body" class="sortable-table__body">
            ${this.fillBody(this.data)}
          </div>

        </div>
      </div>
    `;
  }

  getSubElements() {
    const subElements = this.element.querySelectorAll('[data-element]');

    return [...subElements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  fillHeader(header) {
    return header.map(column => `
      <div class="sortable-table__cell" data-id="${column.id}" data-sortable="${column.sortable}">
        <span>${column.title}</span>
        ${this.getaArrowTemplate()}
      </div>`
    )
    .join('');
  }

  fillBody(body) {
    return body.map(row => `
      <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
        ${this.fillRow(row)}
      </a>
    `)
    .join('');
  }

  fillRow(row) {
    return this.header.map(
      column => column.template ? column.template(row.images) : `<div class="sortable-table__cell">${row[column.id]}</div>`
    )
    .join('');
  }

  getOrder(oldOrder) {
    switch(oldOrder) {
      case 'asc': return 'desc';
      case 'desc': return 'asc';
      default: return 'desc';
    }
  }

  sort(column) {
    const field = column.dataset.id;
    const order = this.getOrder(column.dataset.order);
    const direction = order === 'desc' ? -1 : 1;
    const {sortType} = this.header.find(item => item.id === field);

    const sortedData = [...this.data].sort((row1, row2) => {
      switch(sortType) {
        case 'number': return direction * (row1[field] - row2[field]);
        case 'string': return direction * row1[field].localeCompare(row2[field], ['ru', 'en'], {caseFirst: 'upper'});
        default: return direction * (row1[field] - row2[field]);
      }
    });

    const headers = this.element.querySelectorAll('.sortable-table__cell[data-id]');

    headers.forEach(header => {
        header.dataset.order = '';
    });

    column.dataset.order = order;

    this.subElements.body.innerHTML = this.fillBody(sortedData);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
    this.sortableHeaders.forEach(header => {
      header.removeEventListener('pointerdown', this.sortByColumn);
    });
  }
}

