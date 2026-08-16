const styles = `
  * {
      font-family: sans-serif;
      border-radius: 8px;
  }
  .combobox-wrapper {
    display: flex;
    flex-direction: column;
    width: fit-content;
    border: 1px solid gray;
  }

  .combobox-wrapper:focus-within {
    outline: 2px solid #005fcc;
    outline-offset: 1px;
  }

  #combobox {
    font-size: 1rem;
  }


  #combobox-button[aria-expanded="true"] svg {
  transform: rotate(180deg) translate(0, -3px);
  }


  #listbox {
  font-family: sans-serif;
    display: none;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 150px;
    overflow-y: auto;
    border-top: none;
    list-style: none;
    margin: 0;
    padding: 0;
    z-index: 10;
  }

  #listbox.open {
    display: block;
  }

  .combobox .combobox-controls.focus,
  .combobox .combobox-controls:hover {
    padding: 2px;
    border: 2px solid currentcolor;
    border-radius: 4px;
  }
`;

export default styles;