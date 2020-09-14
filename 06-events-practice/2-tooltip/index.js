class Tooltip {

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initEventListeners() {
    document.addEventListener('pointerover', this.onMouseOver);
    document.addEventListener('pointerout', this.onMouseOut);
  }

  onMouseOver = event => {
    const element = event.target.closest('[data-tooltip]');

    if (element) {
      this.render(element.dataset.tooltip);
      this.moveTooltip(event);

      document.addEventListener('pointermove', this.onMouseMove);
    }
  };

  onMouseMove = event => {
    this.moveTooltip(event);
  };

  onMouseOut = () => {
    this.removeTooltip();
  };

  get template() {
    return '<div class="tooltip">This is tooltip</div>';
  }

  render(html) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = html;

    document.body.append(this.element);
  }

  initialize() {
    this.initEventListeners();
  }

  moveTooltip(event) {
    const shift = 10;
    const left = event.clientX + shift;
    const top = event.clientY + shift;

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    document.removeEventListener('pointerover', this.onMouseOver);
    document.removeEventListener('pointerout', this.onMouseOut);
    this.removeTooltip();
  }

  removeTooltip() {
    if (this.element) {
      this.element.remove();
      this.element = null;

      document.removeEventListener('pointermove', this.onMouseMove);
    }
  }
}

const tooltip = new Tooltip();

export default tooltip;
