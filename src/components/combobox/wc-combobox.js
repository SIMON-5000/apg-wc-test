import styles from './wc-combobox-styles.js';

class WcCombobox extends HTMLElement{
  constructor() {
    super();

    this.input = null;
    this.button = null;
    this.listbox = null;
    this.options = [];

    this.labelText = null;
    this.activeIndex = -1;
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
          aria-autocomplete="list"
          aria-controls="listbox"
          aria-expanded="false"
        >
        <button
          type="button"
          id="combobox-button"
          aria-label="${this.labelText} options"
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

    this.input = this.shadowRoot.querySelector('#combobox');
    this.button = this.shadowRoot.querySelector('#combobox-button');
    this.listbox = this.shadowRoot.querySelector('#listbox');
    
    this.bindEvents();
  }


  bindEvents() {
    // console.log(this.input);
    this.input.addEventListener('input', () => this.onInput());
    this.input.addEventListener('keydown', (e) => this.onKeydown(e));
    this.input.addEventListener('blur', () => this.hideList());

    // Button click shows listbox, prev default on mousedown.
    this.button.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });

    this.button.addEventListener('click', () => {
      this.listIsOpen() ? this.hideList() : this.showList();
    })

    // Make options clickable
    this.options.forEach((li, index) => {
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });

      li.addEventListener('click', () => {
        this.setActive(index);
        this.select(index);
        this.input.focus();
      })
    })
  
  }

  listIsOpen() {
    return this.listbox.classList.contains('open');
  }

  showList() {
    this.input.setAttribute('aria-expanded', 'true');
    this.button.setAttribute('aria-expanded', 'true');
    this.listbox.classList.add('open');
  }

  hideList() {
    this.input.setAttribute('aria-expanded', 'false');
    this.button.setAttribute('aria-expanded', 'false');
    this.listbox.classList.remove('open');
  }

  select(index) {
    const li = this.options[index];
    
    if(!li) {
      console.log("Selection out of range");
      return;
    }

    this.input.value = li.textContent;
    
    this.hideList();
    
    // Reset options if hidden
    this.options.forEach((opt) => {
      opt.hidden = false
    });
  }

  deselectAll() {
    this.options.forEach((opt) => {
      opt.setAttribute('aria-selected', 'false');
    })
  }

  onKeydown(e) {
    // console.log("KEYDOWN ", e.key);
    const visible = this.options.filter(li => !li.hidden);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.showList();

        if (e.altKey || visible.length === 0) {
          break;
        } else {
          const currentVisible = visible.indexOf(this.options[this.activeIndex]);
          const next = visible[(currentVisible + 1) % visible.length];
          this.setActive(this.options.indexOf(next));
          break;
        }

      case 'ArrowUp':
        e.preventDefault();
        this.showList();
        if (e.altKey || visible.length === 0) {
          break;
        } else {
          const currentVisible = visible.indexOf(this.options[this.activeIndex]);
          const prev = visible[(currentVisible - 1 + visible.length) % visible.length];
          this.setActive(this.options.indexOf(prev));
          break;
        }

      case 'Enter':
        if (this.activeIndex >= 0) {
          this.select(this.activeIndex);
        }
        this.hideList();
        break;

      case 'Escape':
        if (this.listbox.classList.contains('open')) {
          this.hideList();
        } else {
          this.input.value = '';
          this.onInput();
        }
        break;
    }
  }

  onInput() {
    const value = this.input.value.toLowerCase();
    let matches = 0;
    // let firstVisibleIndex = -1;

    this.setActive(-1);
    

    this.options.forEach((li, i) => {
      const match = li.textContent.toLowerCase().startsWith(value);
      li.hidden = !match;
      if (match) matches++;

      // if (!match) li.setAttribute('aria-selected', 'false');
      // if (match && firstVisibleIndex === -1) firstVisibleIndex = i;
    });

    // For autocomplete=list with "automatic selection", 
    // Commented out because APG exampel is manual selection, so easier to compare this way.
    // if (value.length > 0) {
    //   this.setActive(firstVisibleIndex);
    // } else {
    //   this.setActive(-1);
    // }

    if(value.length > 0 && matches > 0) {
      this.showList();
    } else {
      this.hideList();
    }
    
  }

  setActive(index) {
    // Stutter on VoiceOver when using chrome:
    // "Blue menue item 5 of 7" gets interrupted by a second "(5 of 7)".
    // same problem in original WAI ARIA APG. Goes away if
    // li.setAttribute('aria-selected', 'true'); is commented out.
    // Not shadow DOM related.
    // no stutter in safari or firefox

    if (this.activeIndex >= 0) {
      this.options[this.activeIndex]?.setAttribute('aria-selected', 'false');
    }

    this.activeIndex = index;

    if(index >= 0 && this.options[index]) {
      const li = this.options[index];

      li.setAttribute('aria-selected', 'true');

      // https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaActiveDescendantElement
      // Create a reflected element reference instead of relying on the ID.
      // This method works for elements in the same, or (as in thius case) the parent DOM.
      this.input.ariaActiveDescendantElement = li;

      // Scroll list to selected element
      li.scrollIntoView({ block: 'nearest' });

    } else {
      this.input.ariaActiveDescendantElement = null;
    }
  }
}

export default customElements.define('wc-combobox', WcCombobox);