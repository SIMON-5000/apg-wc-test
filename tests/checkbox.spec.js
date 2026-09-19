
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function getLocators(page) {
  return {
    group: page.getByRole('group', { name: 'Sandwich Condiments' }),
    checkboxes: page.getByRole('checkbox'),
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

  test('CBX-02 ', async ({ page }) => {
    const wcCheck = page.locator('wc-checkbox');
    const checkboxes = page.getByRole('checkbox')
    
    await expect(wcCheck).toHaveCount(4);
    // All four gets selected based on checkbox role
    await expect(checkboxes).toHaveCount(4);
  });

  test('CBX-03 group has role group', async ({ page }) => {
    const wcGroup = page.locator('wc-checkbox-group');
    // Try to find any role=group on page
    const group = page.getByRole('group');

    await expect(wcGroup).toBeVisible();
    // await expect(group).toBeVisible();
    await expect(wcGroup).toHaveAttribute('role', 'group');
  });

});
