import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('modal test', async ({ page }) => {
  await page.goto('http://127.0.0.1:5001/modal.html');

  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  if (result.violations.length > 0) {
    console.log('Violations found: ', JSON.stringify(result.violations, null, 2));
  }

  await expect(result.violations).toEqual([]);
});
