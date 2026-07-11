# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: modal.spec.js >> wc-modal A11y tests >> MD-06 Tab moves focus forward
- Location: tests/modal.spec.js:76:3

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  getByRole('link', { name: 'Important HELP link' })
Expected: focused
Received: inactive
Timeout:  5000ms

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for getByRole('link', { name: 'Important HELP link' })
    14 × locator resolved to <a href="#" id="help-link">Important HELP link</a>
       - unexpected value "inactive"

```

```yaml
- link "Important HELP link":
  - /url: "#"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | 
  4   | test.describe('wc-modal A11y tests', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.goto('http://127.0.0.1:5001/modal.html');
  7   |   });
  8   | 
  9   |   test('MD-01-A Dialog opens on click', async ({page}) => {
  10  |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  11  |     await openButton.click();
  12  |     await expect(page.getByRole('dialog')).toBeVisible();
  13  |   })
  14  | 
  15  |   test('MD-01-B Dialog opens on enter', async ({page}) => {
  16  |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  17  |     await openButton.focus()
  18  |     page.keyboard.press('Enter');
  19  |     await expect(page.getByRole('dialog')).toBeVisible();
  20  |   })
  21  | 
  22  |   test('MD-01-C Dialog opens on space', async ({page}) => {
  23  |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  24  |     await openButton.focus()
  25  |     await page.keyboard.press('Space');
  26  |     await expect(page.getByRole('dialog')).toBeVisible();
  27  |   })
  28  | 
  29  |   test('MD-02 Escape closes dialog', async ({page}) => {
  30  |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  31  |     await openButton.focus()
  32  |     await page.keyboard.press('Space');
  33  | 
  34  |     await page.keyboard.press('Escape');
  35  |     await expect(page.getByRole('dialog')).not.toBeVisible();
  36  |   })
  37  | 
  38  |   // Webkit does not return focus to button when modal is opened with click,
  39  |   // But when opened with keyboard it does.
  40  |   test('MD-04-A Focus returns to invoking element (click)', async ({ page }) => {
  41  |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  42  |     await openButton.click();
  43  | 
  44  |     await page.keyboard.press('Escape');
  45  |     await expect(openButton).toBeFocused();
  46  |   });
  47  | 
  48  |   test('MD-04-B Focus returns to invoking element (Enter)', async ({page}) => {
  49  |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  50  |     await openButton.focus()
  51  |     await page.keyboard.press('Enter');
  52  | 
  53  |     await page.keyboard.press('Escape');
  54  |     await expect(openButton).toBeFocused();
  55  |   })
  56  | 
  57  |   test('MD-04-C Focus returns to invoking element (Space)', async ({page}) => {
  58  |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  59  |     await openButton.focus()
  60  |     await page.keyboard.press(' ');
  61  | 
  62  |     await page.keyboard.press('Escape');
  63  |     await expect(openButton).toBeFocused();
  64  |   })
  65  | 
  66  |   test('MD-05 Focus moves to first focusable element inside dialog', async ({page}) => {
  67  |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  68  |     await openButton.focus();
  69  |     await page.keyboard.press('Space');
  70  | 
  71  |     const firstFocusableEl = page.locator('wc-modal p[tabindex="-1"]');
  72  | 
  73  |     await expect(firstFocusableEl).toBeFocused();
  74  |   })
  75  | 
  76  |   test('MD-06 Tab moves focus forward', async ({page}) => {
  77  |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  78  |     await openButton.focus();
  79  |     await page.keyboard.press('Space');
  80  |     await page.keyboard.press('Tab');
  81  | 
  82  |     const secondFocusableEl = page.getByRole('link', {name: 'Important HELP link'});
  83  | 
> 84  |     await expect(secondFocusableEl).toBeFocused();
      |                                     ^ Error: expect(locator).toBeFocused() failed
  85  |   })
  86  | 
  87  |   test('MD-06-B Tab moves focus forward', async ({page}) => {
  88  |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  89  |     await openButton.focus();
  90  |     await page.keyboard.press('Space');
  91  | 
  92  |     // TAB SEQUENCE
  93  |     await page.keyboard.press('Tab');
  94  |     console.log(
  95  |       await page.evaluate(() => {
  96  |         const modal = document.querySelector('wc-modal');
  97  | 
  98  |         return {
  99  |           documentFocus: document.activeElement?.outerHTML,
  100 |           shadowFocus: modal?.shadowRoot?.activeElement?.outerHTML,
  101 |         };
  102 |       }),
  103 |     );
  104 | 
  105 |     await page.keyboard.press('Tab');
  106 |     console.log(
  107 |       await page.evaluate(() => {
  108 |         const modal = document.querySelector('wc-modal');
  109 | 
  110 |         return {
  111 |           documentFocus: document.activeElement?.outerHTML,
  112 |           shadowFocus: modal?.shadowRoot?.activeElement?.outerHTML,
  113 |         };
  114 |       }),
  115 |     );
  116 | 
  117 |     const thirdFocusableEl = page.getByRole('button', {name: /close/i });
  118 | 
  119 |     await expect(thirdFocusableEl).toBeFocused();
  120 |   })
  121 | 
  122 |   test('MD-STATIC Static test on open dialog', async ({page}) => {
  123 |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  124 |     await openButton.click();
  125 | 
  126 |     const result = await new AxeBuilder({ page })
  127 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  128 |       .analyze();
  129 | 
  130 |     if (result.violations.length > 0) {
  131 |       console.log('Violations found: ', JSON.stringify(result.violations, null, 2));
  132 |     }
  133 | 
  134 |     await expect(result.violations).toEqual([]);
  135 |   })
  136 | });
  137 | 
```