import styles from './wc-combobox-styles.js';

class WcCombobox extends HTMLElement{
  constructor() {
    super();

    this.listbox = null;
    this.options = [];
    this.labelText = "";
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

    this.listbox = this.shadowRoot.querySelector('#listbox');
    
  }

}

export default customElements.define('wc-combobox', WcCombobox);