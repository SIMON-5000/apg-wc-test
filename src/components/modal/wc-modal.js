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
      aria-label="modal">
      <slot></slot>
      <button id="close" commandfor="modal-dialog" command="close">Close Dialog</button>
    </dialog>
    `;
    
    this.dialog = this.shadowRoot.getElementById('modal-dialog');
    this.invokingElement = null;
    // Find first element set to autofocus from slotted content in the Light DOM
    this.autoFocusElement = this.querySelector('[autofocus]');

    // To allow the consuming developer to set a label on the dialog we can pass a label attribute from the host:
    if (this.hasAttribute('modal-label')) {
      console.log("MODAL-LABEL: ", this.getAttribute('modal-label'))
      this.dialog.ariaLabel = this.getAttribute('modal-label');
    }

    this.#bindEvents();
  }


  openModal() {

    // Opens dialog (located in shadow DOM) in modal-mode
    this.dialog.showModal();

    // Works but leaves responsibility to developer using the component
    if(this.autoFocusElement) {
      this.autoFocusElement.focus();
    } else return;
  }

  #bindEvents() {
    // Add an eventlistener for commands sent to wc-modal
    this.addEventListener('command', (e) => {
      if(e.command !== '--show-modal') return;
      
      // Webkit does not focus back on invoking button when clicked with mouse
      this.invokingEl = e.source || document.activeElement;

      this.openModal();

    })

    // Explicitly return focus to trigger element (solves Safari/Webkit issue)
    // This behaviour does however seem to be by design, see:
    // Darin Adler (Vice President at Apple) explains why a click does not shift focus in Safari/Webkit https://bugs.webkit.org/show_bug.cgi?id=22261#c68
    this.dialog.addEventListener('close', () => {
      this.invokingEl.focus();
    })
  }
}

export default customElements.define('wc-modal', WcModal);