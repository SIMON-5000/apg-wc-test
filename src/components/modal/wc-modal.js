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
    this.invokingEl = null;

    // Add an eventlistener, listening for commands sent to wc-modal
    this.addEventListener('command', (e) => {
      if(e.command == '--show-modal') {
        // Opens dialog (located in shadow DOM) in modal-mode
        this.dialog.showModal();
        // Webkit does not focus back on invoking button when clicked with mouse
        this.invokingEl = e.source || document.activeElement;
      }
    })

    // Explicitly return focus to trigger element (solves Safari/Webkit issue)
    // This behaviour does however seem to be by design, see:
    // Darin Adler (Apples current VicePresident) explains why a click does not shift focus in Safari/Webkit https://bugs.webkit.org/show_bug.cgi?id=22261#c68
    this.dialog.addEventListener('close', () => {
      this.invokingEl.focus();
    })
  }
}

export default customElements.define('wc-modal', WcModal);