import styles from './wc-modal-styles.js';

class WcModal extends HTMLElement{
  constructor() {
    super();
  }


  connectedCallback() {
    console.log(this.nodeName);
    this.attachShadow({ mode: 'open'});

    this.shadowRoot.innerHTML = `
    <style>${styles}</style>
    <dialog 
      id="modal-dialog"
      closedby="closerequest"
      aria-label="modal"
      aria-labelledby="dialog-label"
      >
      <slot></slot>
      <button id="close" commandfor="modal-dialog" command="close">Close</button>
    </dialog>
    `;
  }
}

export default customElements.define('wc-modal', WcModal);