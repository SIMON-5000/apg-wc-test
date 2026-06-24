import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('wc-modal A11y tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5001/modal.html');
  });

  test('MD-01-A Dialog opens on click', async ({page}) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();
  })
});
