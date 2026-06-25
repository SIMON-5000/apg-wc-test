# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: modal.spec.js >> wc-modal A11y tests >> MD-04-A Focus returns to invoking element (click)
- Location: tests/modal.spec.js:37:3

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  getByRole('button', { name: /open modal dialog/i })
Expected: focused
Received: inactive
Timeout:  5000ms

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for getByRole('button', { name: /open modal dialog/i })
    14 × locator resolved to <button commandfor="wc-modal" command="--show-modal">Open Modal Dialog</button>
       - unexpected value "inactive"

```

```yaml
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
  12 |     await expect(page.getByRole('dialog')).toBeVisible();
  13 |   })
  14 | 
  15 |   test('MD-01-B Dialog opens on enter', async ({page}) => {
  16 |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  17 |     await openButton.focus()
  18 |     page.keyboard.press('Enter');
  19 |     await expect(page.getByRole('dialog')).toBeVisible();
  20 |   })
  21 | 
  22 |   test('MD-01-C Dialog opens on space', async ({page}) => {
  23 |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  24 |     await openButton.focus()
  25 |     page.keyboard.press('Space');
  26 |     await expect(page.getByRole('dialog')).toBeVisible();
  27 |   })
  28 | 
  29 |   test('MD-02 Escape closes dialog', async ({page}) => {
  30 |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  31 |     await openButton.click();
  32 | 
  33 |     await page.keyboard.press('Escape');
  34 |     await expect(page.getByRole('dialog')).not.toBeVisible();
  35 |   })
  36 | 
  37 |   test('MD-04-A Focus returns to invoking element (click)', async ({ page }) => {
  38 |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  39 |     await openButton.click();
  40 | 
  41 |     await page.keyboard.press('Escape');
> 42 |     await expect(openButton).toBeFocused();
     |                              ^ Error: expect(locator).toBeFocused() failed
  43 |   });
  44 | 
  45 |   test('MD-04-B Focus returns to invoking element (Enter)', async ({page}) => {
  46 |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  47 |     await openButton.focus()
  48 |     await page.keyboard.press('Enter');
  49 | 
  50 |     await page.keyboard.press('Escape');
  51 |     await expect(openButton).toBeFocused();
  52 |   })
  53 | 
  54 |   test('MD-04-B Focus returns to invoking element (Space)', async ({page}) => {
  55 |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  56 |     await openButton.focus()
  57 |     await page.keyboard.press(' ');
  58 | 
  59 |     await page.keyboard.press('Escape');
  60 |     await expect(openButton).toBeFocused();
  61 |   })
  62 | });
  63 | 
```