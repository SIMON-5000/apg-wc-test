import styles from './wc-checkbox-group-styles.js';

class WcCheckboxGroup extends HTMLElement{
  constructor() {
    super();

    // this._internals = this.attachInternals();
    this.groupLabel = null;
    this.checkboxes = null;
  }


  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    
    this.groupLabel = this.getAttribute('group-label');

    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', this.groupLabel);

    // Using Internals does not expose a visible role attrobute, but AT can see it.
    // It is a working solution, but playwright can not find the element based on role.
    // this._internals.role = 'group';
    // this._internals.ariaLabel = this.groupLabel;

    this.shadowRoot.innerHTML = `
    <style>${styles}</style>
    <h3 id="id-group-label">${this.groupLabel}</h3>
    <slot></slot>
    `;

    // const header = this.shadowRoot.getElementById('id-group-label');
    // this._internals.ariaLabelledByElements = [header];

    this.checkboxes = this.querySelectorAll('wc-checkbox');
    const groupName = this.groupLabel.toLowerCase().replace(/\s+/, '-');

    this.checkboxes.forEach((cb, index) => {
      cb.setAttribute('name', groupName);
    })
  }

}

export default customElements.define('wc-checkbox-group', WcCheckboxGroup);