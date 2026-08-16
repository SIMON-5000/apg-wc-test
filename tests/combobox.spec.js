import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function getLocators(page) {
  return {
    input: page.getByRole('combobox', { name: /color/i }),
    button: page.getByRole('button', { name: /show color options/i})
  }
}

// ----- TESTS -----
test.describe('wc-combobox tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5001/combobox.html');
  });

  test('CB-STATIC Static test on combobox', async ({page}) => {
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (result.violations.length > 0) {
      console.log('Violations found: ', JSON.stringify(result.violations, null, 2));
    }

    await expect(result.violations).toEqual([]);
  })

  test('CB-01 input has role combobox', async ({ page }) => {
    const { input } = await getLocators(page);
    await expect(input).toHaveAttribute('role', 'combobox');
  });

  test('CB-02 input has aria-expanded false on init', async ({ page }) => {
    const { input } = await getLocators(page);
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('CB-03 button click changes aria-expanded to true', async ({ page }) => {
    const { input, button } = await getLocators(page);
    button.click();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
  });

});
