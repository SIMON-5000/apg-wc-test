# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkbox.spec.js >> wc-checkbox tests >> CBX-03 group has role group
- Location: tests/checkbox.spec.js:41:3

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('wc-checkbox-group')
Expected: "group"
Received: ""
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('wc-checkbox-group')
    14 × locator resolved to <wc-checkbox-group group-label="Sandwich Condiments">…</wc-checkbox-group>
       - unexpected value "null"

```

```yaml
- heading "Sandwich Condiments" [level=3]
- checkbox "Lettuce"
- checkbox "Tomato"
- checkbox "Mustard"
- checkbox "Sprouts"
```

# Test source

```ts
  1  | 
  2  | import { test, expect } from '@playwright/test';
  3  | import AxeBuilder from '@axe-core/playwright';
  4  | 
  5  | function getLocators(page) {
  6  |   return {
  7  |     group: page.getByRole('group', { name: 'Sandwich Condiments' }),
  8  |     checkboxes: page.getByRole('checkbox'),
  9  |   }
  10 | }
  11 | 
  12 | 
  13 | // ----- TESTS -----
  14 | 
  15 | test.describe('wc-checkbox tests', () => {
  16 |   test.beforeEach(async ({ page }) => {
  17 |     await page.goto('http://127.0.0.1:5001/checkbox.html');
  18 |   });
  19 | 
  20 |   // Roles, attributes and states
  21 |   test('CBX-01 wc-checkboxes has role checkbox', async ({ page }) => {
  22 |     const wcCheck = page.locator('wc-checkbox');
  23 |     const checkboxes = page.getByRole('checkbox')
  24 |     const tomato = page.getByRole('checkbox', {name: 'Tomato'});
  25 |     
  26 |     await expect(wcCheck).toHaveCount(4);
  27 |     // All four gets selected based on checkbox role
  28 |     await expect(checkboxes).toHaveCount(4);
  29 |     await expect(tomato).toHaveRole('checkbox');
  30 |   });
  31 | 
  32 |   test('CBX-02 ', async ({ page }) => {
  33 |     const wcCheck = page.locator('wc-checkbox');
  34 |     const checkboxes = page.getByRole('checkbox')
  35 |     
  36 |     await expect(wcCheck).toHaveCount(4);
  37 |     // All four gets selected based on checkbox role
  38 |     await expect(checkboxes).toHaveCount(4);
  39 |   });
  40 | 
  41 |   test('CBX-03 group has role group', async ({ page }) => {
  42 |     const wcGroup = page.locator('wc-checkbox-group');
  43 |     // Try to find any role=group on page
  44 |     const group = page.getByRole('group');
  45 | 
  46 |     await expect(wcGroup).toBeVisible();
  47 |     // await expect(group).toBeVisible();
> 48 |     await expect(wcGroup).toHaveAttribute('role', 'group');
     |                           ^ Error: expect(locator).toHaveAttribute(expected) failed
  49 |   });
  50 | 
  51 | });
  52 | 
```