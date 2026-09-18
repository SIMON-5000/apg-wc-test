import styles from './wc-checkbox-styles.js';

class WcCheckbox extends HTMLElement{
  constructor() {
    super();
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

    this.addListeners();
  }

  toggleCheckbox() {
    if (this.getAttribute('aria-checked') === 'true') {
      this.setAttribute('aria-checked', 'false');
    } else {
      this.setAttribute('aria-checked', 'true');
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
