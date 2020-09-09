class Tooltip {

  constructor() {
    if (! Tooltip.instance) {
      Tooltip.instance = this;
    }

    return Tooltip.instance;
   }

  initEventListeners() {
    this.tooltips = document.querySelectorAll('[data-tooltip]');

    this.tooltips.forEach(tooltip => {
      tooltip.addEventListener('pointerover', this.showTooltip);
      tooltip.addEventListener('pointerout', this.hideTooltip);
      tooltip.addEventListener('pointermove', this.moveTooltip);
    });
  }

  moveTooltip = (event) => {
    const defaultShift = 10;
    this.element.style.top =  defaultShift + event.y + 'px';
    this.element.style.left = defaultShift + event.x + 'px';
  }

  hideTooltip = (event) => {
    this.remove();
  }

  showTooltip = (event) => {
    document.body.append(this.element);
    this.element.textContent = event.target.dataset.tooltip;
  }

  get template() {
    return '<div class="tooltip">This is tooltip</div>';
  }

  render() {
    document.body.append(this.element);
  }

  initialize() {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.initEventListeners();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();

    this.tooltips.forEach(tooltip => {
      tooltip.removeEventListener('pointerover', this.showTooltip);
      tooltip.removeEventListener('pointerout', this.hideTooltip);
      tooltip.removeEventListener('pointermove', this.moveTooltip);
    });
  }
}

const tooltip = new Tooltip();

export default tooltip;
