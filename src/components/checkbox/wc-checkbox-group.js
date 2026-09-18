import styles from './wc-checkbox-group-styles.js';

class WcCheckboxGroup extends HTMLElement{
  constructor() {
    super();
    this.groupLabel = null;
    this.checkboxes = null;
    this.groupLabel = 'Label';
  }


  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.groupLabel = this.getAttribute('group-label');
    
    this.shadowRoot.innerHTML = `
    <style>${styles}</style>
    <h3 id="id-group-label">${this.groupLabel}</h3>
    <div role="group" aria-labelledby="id-group-label">
      <slot></slot>
    </div>
    `;

    this.checkboxes = this.querySelectorAll('wc-checkbox');
    const groupName = this.groupLabel.toLowerCase().replace(/\s+/, '-');

    this.checkboxes.forEach((cb, index) => {
      cb.setAttribute('name', groupName);
    })
  }

}

export default customElements.define('wc-checkbox-group', WcCheckboxGroup);