
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function getLocators(page) {
  return {
    group: page.getByRole('group', { name: 'Sandwich Condiments' }),
    checkboxes: page.getByRole('checkbox'),
    lettuce: page.getByRole('checkbox', {name: 'Lettuce'}),
    tomato: page.getByRole('checkbox', {name: 'Tomato'}),
    mustard: page.getByRole('checkbox', {name: 'Mustard'}),
  }
}


// ----- TESTS -----

test.describe('wc-checkbox tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5001/checkbox.html');
  });

  // Roles, attributes and states
  test('CBX-01 wc-checkboxes has role checkbox', async ({ page }) => {
    const wcCheck = page.locator('wc-checkbox');
    const checkboxes = page.getByRole('checkbox')
    const tomato = page.getByRole('checkbox', {name: 'Tomato'});
    
    await expect(wcCheck).toHaveCount(4);
    // All four gets selected based on checkbox role
    await expect(checkboxes).toHaveCount(4);
    await expect(tomato).toHaveRole('checkbox');
  });

  test('CBX-02 expect checkboxes to have accessible names', async ({ page }) => {
    const { lettuce, tomato } = getLocators(page);
    
    await expect(lettuce).toHaveAccessibleName('Lettuce');
    await expect(tomato).toHaveAccessibleName('Tomato');
  });

  test('CBX-03 group has role group', async ({ page }) => {
    const wcGroup = page.locator('wc-checkbox-group');
    // Try to find any role=group on page
    const group = page.getByRole('group');

    await expect(wcGroup).toBeVisible();
    await expect(group).toBeVisible();
    await expect(wcGroup).toHaveAttribute('role', 'group');
  });

  test('CBX-04 group has accessibnle name', async ({ page }) => {
    const { group } = getLocators(page);
    
    await expect(group).toHaveAccessibleName('Sandwich Condiments');
  });

  // Keyboard
  test('CBX-05 checkboxes are in tab sequence', async ({ page }) => {
    const { lettuce, tomato, mustard } = getLocators(page);

    await lettuce.focus();
    await expect(lettuce).toBeFocused()
    
    await page.keyboard.press('Tab');
    await expect(tomato).toBeFocused()

    await page.keyboard.press('Tab');
    await expect(mustard).toBeFocused()
  });

  test('CBX-05 checkboxes are initially unchecked', async ({ page }) => {
    const { lettuce } = getLocators(page);

    await expect(lettuce).toHaveAttribute('aria-checked', 'false')
  });

  test('CBX-07 checkboxes toggle checked state on space', async ({ page }) => {
    const { lettuce } = getLocators(page);

    await expect(lettuce).toHaveAttribute('aria-checked', 'false')
    
    await lettuce.focus();
    await page.keyboard.press('Space');

    await expect(lettuce).toHaveAttribute('aria-checked', 'true')

    await page.keyboard.press('Space');

    await expect(lettuce).toHaveAttribute('aria-checked', 'false')
  });

  test('CBX-08 checkboxes toggle checked state on click', async ({ page }) => {
    const { lettuce } = getLocators(page);
    
    await lettuce.click()
    await expect(lettuce).toHaveAttribute('aria-checked', 'true')

    await lettuce.click()
    await expect(lettuce).toHaveAttribute('aria-checked', 'false')
  });

  test('CBX-09 checked values take part in Light DOM form data', async ({ page }) => {
    const { lettuce, mustard } = getLocators(page);
    const form = await page.locator('form')

    await lettuce.click();
    await mustard.click();

    const formValues = await form.evaluate(formEl => {
      const formData = new FormData(formEl);
      let result = [];

      for (const pair of formData.entries()) {
        result.push(pair)
      }

      return result;
    });

    console.log('Form values', formValues);

    expect(formValues.length).toBeGreaterThan(0);
    expect(formValues).toContainEqual([ 'sandwich-condiments', 'Lettuce' ]);
  });

  test('CBX-STATIC Static test on checkbox', async ({page}) => {
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (result.violations.length > 0) {
      console.log('Violations found: ', JSON.stringify(result.violations, null, 2));
    }

    await expect(result.violations).toEqual([]);
  })

});
