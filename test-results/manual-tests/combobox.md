# Manual tests Checkbox

---
### Testing environment

MacOS: 26.5.1
Assistive technology: Voice Over Version 10 (993)

| Browser | Version                                 |
| ------- | --------------------------------------- |
| Chrome  | 148.0.7778.216 (Official Build) (arm64) |
| Firefox | 151.0.2 (aarch64)                       |
| Safari  | 26.5 (21624.2.5.11.4)                   |

---

## Using ElementInternals - Exploratory Test
---
### Role and ARIA label on host
Using ElementInternals to communicate role and ARIA Label
```JS
	this._internals.role = 'group';
	this._internals.ariaLabel = this.groupLabel;
```

| Browser      | Announcement on group       |
| ------------ | --------------------------- |
| Chrome + VO  | "Sandwich Condiments group" |
| Firefox + VO | "Sandwich Condiments group" |
| Safari + VO  | "Sandwich Condiments group" |

[Example screenshot from Chrome](assets/ElementInternals1.png)
Example from Chrome

**Notes**
- Consistent results across tested browsers
- Does not add the `role` or `aria-label` attributes to the elements
- Playwrights `getByRole` does not identify host as a group

---
### Using labelled by element in the hosts child DOM:
A second implementation test using the heading in the hosts Shadow DOM as a label
```JS
	const header = this.shadowRoot.getElementById('id-group-label');
	this._internals.ariaLabelledByElements = [header];
```

| Browser      | Announcement on group       |
| ------------ | --------------------------- |
| Chrome + VO  | "Sandwich Condiments group" |
| Firefox + VO | "Sandwich Condiments group" |
| Safari + VO  | No group announcement       |

[Example screenshot from Chrome](assets/ElementInternals1.png)
Example from Chrome

**Notes**
- This is reaching in to a child DOM, and according to the documentation it should be out of scope https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes#reflected_element_reference_scope
- Inconsistent behaviour

---
### Playwright Problems

- Playwright could not identify the group through its role
- Related Playwright issue [https://github.com/microsoft/playwright/issues/34264](https://github.com/microsoft/playwright/issues/34264)

