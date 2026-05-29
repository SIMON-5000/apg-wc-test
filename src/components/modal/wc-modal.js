import styles from './wc-modal-styles.js';

class WcModal extends HTMLElement{
  constructor() {
    super();
  }


  connectedCallback() {
    this.attachShadow({ mode: 'open', delegatesFocus: true });

    this.shadowRoot.innerHTML = `
    <style>${styles}</style>
    <slot></slot>
    `;
  }
}

export default customElements.define('wc-modal', WcModal);