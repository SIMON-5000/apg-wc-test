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

  test('MD-01-B Dialog opens on enter', async ({page}) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.focus()
    page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
  })

  test('MD-01-C Dialog opens on space', async ({page}) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.focus()
    await page.keyboard.press('Space');
    await expect(page.getByRole('dialog')).toBeVisible();
  })

  test('MD-02 Escape closes dialog', async ({page}) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.focus()
    await page.keyboard.press('Space');

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  })

  // Webkit does not return focus to button when modal is opened with click,
  // But when opened with keyboard it does.
  test('MD-04-A Focus returns to invoking element (click)', async ({ page }) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.click();

    await page.keyboard.press('Escape');
    await expect(openButton).toBeFocused();
  });

  test('MD-04-B Focus returns to invoking element (Enter)', async ({page}) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.focus()
    await page.keyboard.press('Enter');

    await page.keyboard.press('Escape');
    await expect(openButton).toBeFocused();
  })

  test('MD-04-C Focus returns to invoking element (Space)', async ({page}) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.focus()
    await page.keyboard.press(' ');

    await page.keyboard.press('Escape');
    await expect(openButton).toBeFocused();
  })

  test('MD-05 Focus moves to first focusable element inside dialog', async ({page}) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.focus();
    await page.keyboard.press('Space');

    const firstFocusableEl = page.locator('wc-modal p[tabindex="-1"]');

    await expect(firstFocusableEl).toBeFocused();
  })

  test('MD-STATIC Static test on open dialog', async ({page}) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.click();

    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (result.violations.length > 0) {
      console.log('Violations found: ', JSON.stringify(result.violations, null, 2));
    }

    await expect(result.violations).toEqual([]);
  })
});
