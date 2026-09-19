import styles from './wc-checkbox-styles.js';

class WcCheckbox extends HTMLElement{
  // Make components a part of the form, called before constructor
  static formAssociated = true;

  constructor() {
    super();

    // Must be called in constructor
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    this.text = this.textContent;
    this.attachShadow({ mode: 'open' });
    
    this.shadowRoot.innerHTML = `
    <style>${styles}</style>
    <span aria-hidden="true">
      ${this.text}
    </span>
    `;
    
    // this.checkbox = this.shadowRoot.querySelector('span');

    this.classList.add('checkbox');
    this.setAttribute('role', 'checkbox');
    this.setAttribute('aria-checked', 'false');
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-label', this.text);
    this._internals.setFormValue(null);

    this.addListeners();
  }

  toggleCheckbox() {
    if (this.getAttribute('aria-checked') === 'true') {
      this.setAttribute('aria-checked', 'false');
      this._internals.setFormValue(null);
    } else {
      this.setAttribute('aria-checked', 'true');
      this._internals.setFormValue(this.text);
    }
  }

  addListeners() {
    // Click toggles aria-checked
    this.addEventListener('click', () => this.toggleCheckbox());
    // Space does not scroll page
    this.addEventListener('keydown', (e) => this.onKeydown(e));
    // Space toggles aria-checked
    this.addEventListener('keyup', (e) => this.onKeyup(e));
  }

  // Make sure to prevent page scrolling on space down
  onKeydown(event) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  onKeyup(event) {
    var flag = false;

    switch (event.key) {
      case ' ':
        this.toggleCheckbox();
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
    }
  }
}

export default customElements.define('wc-checkbox', WcCheckbox);
