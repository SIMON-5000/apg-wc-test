# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: modal.spec.js >> wc-modal A11y tests >> MD-01-A Dialog opens on click
- Location: tests/modal.spec.js:9:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('dialog')

```

```yaml
- main:
  - article:
    - heading "WebComponent version of Modal Dialog" [level=1]
    - button "Open Modal Dialog"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | test.describe('wc-modal A11y tests', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('http://127.0.0.1:5001/modal.html');
  7  |   });
  8  | 
  9  |   test('MD-01-A Dialog opens on click', async ({page}) => {
  10 |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  11 |     await openButton.click();
> 12 |     await expect(page.getByRole('dialog')).toBeVisible();
     |                                            ^ Error: expect(locator).toBeVisible() failed
  13 |   })
  14 | });
  15 | 
```