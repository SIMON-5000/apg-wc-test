# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: combobox.spec.js >> wc-combobox tests >> CB-STATIC Static test on combobox
- Location: tests/combobox.spec.js:9:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 208

- Array []
+ Array [
+   Object {
+     "description": "Ensure buttons have discernible text",
+     "help": "Buttons must have discernible text",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/button-name?application=playwright",
+     "id": "button-name",
+     "impact": "critical",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "button-has-visible-text",
+             "impact": "critical",
+             "message": "Element does not have inner text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "critical",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "critical",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "critical",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "implicit-label",
+             "impact": "critical",
+             "message": "Element does not have an implicit (wrapped) <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "explicit-label",
+             "impact": "critical",
+             "message": "Element does not have an explicit <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "presentational-role",
+             "impact": "critical",
+             "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element does not have inner text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute
+   Element does not have an implicit (wrapped) <label>
+   Element does not have an explicit <label>
+   Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+         "html": "<button type=\"button\" id=\"combobox-button\" aria-label=\"\" aria-expanded=\"false\" aria-controls=\"listbox\" tabindex=\"-1\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           Array [
+             "#combobox",
+             "#combobox-button",
+           ],
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.name-role-value",
+       "wcag2a",
+       "wcag412",
+       "section508",
+       "section508.22.a",
+       "TTv5",
+       "TT6.a",
+       "EN-301-549",
+       "EN-9.4.1.2",
+       "ACT",
+       "RGAAv4",
+       "RGAA-11.9.1",
+     ],
+   },
+   Object {
+     "description": "Ensure every form element has a label",
+     "help": "Form elements must have labels",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/label?application=playwright",
+     "id": "label",
+     "impact": "critical",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "implicit-label",
+             "impact": "critical",
+             "message": "Element does not have an implicit (wrapped) <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "explicitLabel": "",
+             },
+             "id": "explicit-label",
+             "impact": "critical",
+             "message": "Element does not have an explicit <label>",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<label id=\"combobox-label\" for=\"combobox\"></label>",
+                 "target": Array [
+                   Array [
+                     "#combobox",
+                     "#combobox-label",
+                   ],
+                 ],
+               },
+             ],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "critical",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "critical",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "critical",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-placeholder",
+             "impact": "critical",
+             "message": "Element has no placeholder attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "presentational-role",
+             "impact": "critical",
+             "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element does not have an implicit (wrapped) <label>
+   Element does not have an explicit <label>
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute
+   Element has no placeholder attribute
+   Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+         "html": "<input type=\"text\" id=\"combobox\" role=\"combobox\" aria-autocomplete=\"both\" aria-controls=\"listbox\" aria-expanded=\"false\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           Array [
+             "#combobox",
+             "#combobox",
+           ],
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.forms",
+       "wcag2a",
+       "wcag412",
+       "section508",
+       "section508.22.n",
+       "TTv5",
+       "TT5.c",
+       "EN-301-549",
+       "EN-9.4.1.2",
+       "ACT",
+       "RGAAv4",
+       "RGAA-11.1.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- main [ref=e2]:
  - heading "Web Component" [level=2] [ref=e3]
  - paragraph [ref=e4]: Combobox
  - generic [ref=e6]:
    - generic [ref=e7]:
      - combobox [ref=e8]
      - button [ref=e9]:
        - img [ref=e10]
    - listbox [ref=e12]:
      - generic:
        - option "Red" [ref=e13]
        - option "Orange" [ref=e14]
        - option "Orangered" [ref=e15]
        - option "Yellow" [ref=e16]
        - option "Green" [ref=e17]
        - option "Blue" [ref=e18]
        - option "Indigo" [ref=e19]
        - option "Violet" [ref=e20]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | test.describe('wc-combobox tests', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('http://127.0.0.1:5001/combobox.html');
  7  |   });
  8  | 
  9  |   test('CB-STATIC Static test on combobox', async ({page}) => {
  10 |     const result = await new AxeBuilder({ page })
  11 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  12 |       .analyze();
  13 | 
  14 |     if (result.violations.length > 0) {
  15 |       console.log('Violations found: ', JSON.stringify(result.violations, null, 2));
  16 |     }
  17 | 
> 18 |     await expect(result.violations).toEqual([]);
     |                                     ^ Error: expect(received).toEqual(expected) // deep equality
  19 |   })
  20 | 
  21 | });
  22 | 
```