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
    
    this.dialog = this.shadowRoot.getElementById('modal-dialog');

    // Add an eventlistener, listening for commands sent to wc-modal
    this.addEventListener('command', (e)=> {
      if(e.command == '--show-modal') {
        // Opens dialog (located in shadow DOM) in modal-mode
        this.dialog.showModal();
      }
    })
  }
}

export default customElements.define('wc-modal', WcModal);