import styles from './wc-combobox-styles.js';

class WcCombobox extends HTMLElement{
  constructor() {
    super();

    this.input = null;
    this.button = null;
    this.listbox = null;
    this.options = [];

    this.labelText = null;
  }

  connectedCallback() {
    console.log(this.nodeName);
    this.attachShadow({ mode: 'open'});

    this.options = Array.from(this.querySelectorAll('li'));

    this.options.forEach((li, i) => {
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.id = `combobox-value-${i}`;
    })

    this.labelText = this.getAttribute('label');

    // Label and Buttons aria-label now accepts dynamic content
    this.shadowRoot.innerHTML = `
    <style>${styles}</style>
    <label id="combobox-label" for="combobox">${this.labelText}</label>
    <div class="combobox-wrapper">
      <div class="combobox-controls">
        <input type="text"
          id="combobox"
          role="combobox" 
          aria-autocomplete="both"
          aria-controls="listbox"
          aria-expanded="false"
        >
        <button
          type="button"
          id="combobox-button"
          aria-label="Show ${this.labelText} options"
          aria-expanded="false"
          aria-controls="listbox"
          tabindex="-1"
        >
          <svg width="18" height="16" aria-hidden="true" focusable="false" style="forced-color-adjust: auto">
            <polygon class="arrow" stroke-width="0" fill-opacity="0.75" fill="currentcolor" points="3,6 15,6 9,14"></polygon>
          </svg>
        </button>
      </div>

      <ul id="listbox" class="listbox" role="listbox">
          <slot></slot>
      </ul>
    `

    this.input = this.shadowRoot.querySelector('#combobox');
    this.button = this.shadowRoot.querySelector('#combobox-button');
    this.listbox = this.shadowRoot.querySelector('#listbox');
    
    this.bindEvents();
  }


  bindEvents() {
    // this.input.addEventListener('focus', () => this.showList());
    this.input.addEventListener('blur', () => this.hideList());

    // Button click showes listbox
    this.button.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.listIsOpen() ? this.hideList() : this.showList();
    });
  
  }

  listIsOpen() {
    return this.listbox.classList.contains('open');
  }

  showList() {
    this.input.setAttribute('aria-expanded', 'true');
    this.button.setAttribute('aria-expanded', 'true');
    this.listbox.classList.add('open');
  }

  hideList() {
    this.input.setAttribute('aria-expanded', 'false');
    this.button.setAttribute('aria-expanded', 'false');
    this.listbox.classList.remove('open');
  }
}

export default customElements.define('wc-combobox', WcCombobox);