class WcCombobox extends HTMLElement{
  constructor() {
    super();
  }

  connectedCallback() {
    console.log(this.nodeName);
    this.attachShadow({ mode: 'open'});
  }
}

export default customElements.define('wc-combobox', WcCombobox);