// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function getLocators(page) {
  return {
    input: page.getByRole('combobox', { name: /color/i }),
    button: page.getByRole('button', { name: /show color options/i}),
    listbox: page.locator('wc-combobox').locator('#listbox'),
  }
}

// ----- TESTS -----

test.describe('wc-combobox tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5001/combobox.html');
  });

  // Roles, attributes and states
  test('CB-01 input has role combobox', async ({ page }) => {
    const { input } = await getLocators(page);
    await expect(input).toHaveAttribute('role', 'combobox');
  });

  test('CB-02 listbox has role listbox', async ({ page }) => {
    const { listbox } = await getLocators(page);
    await expect(listbox).toHaveAttribute('role', 'listbox');
  });

  test('CB-03 input has aria-controls refering to listbox', async ({ page }) => {
    const { input, listbox } = await getLocators(page);
    const inputControls = await input.getAttribute('aria-controls');
    const listboxId = await listbox.getAttribute('id');

    expect(inputControls).toBe(listboxId);
  });

  test('CB-04 button has accessible name', async ({ page }) => {
    const { button } = await getLocators(page);
    const label = await button.getAttribute('aria-label');
    await expect(button).toHaveAccessibleName( /color/i );
  });

  test('CB-05 options have a role of option', async ({ page }) => {
    const options = await page.locator('wc-combobox li').all();
    for (const opt of options) {
      await expect(opt).toHaveAttribute('role', 'option');
    }
  });

  // Show / hide listbox
  test('CB-06 input has aria-expanded false on init', async ({ page }) => {
    const { input } = await getLocators(page);
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('CB-07 button click changes aria-expanded to true', async ({ page }) => {
    const { input, button } = await getLocators(page);
    await button.click();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  test('CB-08 button click with open listbox changes aria-expanded to false', async ({ page }) => {
    const { input, button } = await getLocators(page);
    button.click();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    button.click();
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('CB-09 typing in input opens listbox', async ({ page }) => {
    const { input, listbox } = await getLocators(page);
    await input.click();
    await input.type('a');

    await expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  // Keyboard navigation
  test('CB-10 Esc closes listbox (without clearing input)', async ({ page }) => {
    const {input, listbox } = await getLocators(page);
    await input.click();
    await input.type('Test');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    
    await page.keyboard.press('Escape');

    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveValue('Test');
  });

  test('CB-11 Escape clears input if pressed on closed listbox)', async ({ page }) => {
    const {input, listbox } = await getLocators(page);
    await input.click();
    await input.type('Test');
    await page.keyboard.press('Escape');
    await expect(input).not.toHaveAttribute('aria-expanded', 'true');
    await expect(input).toHaveValue('Test');

    await page.keyboard.press('Escape');
    await expect(input).toHaveValue('');
  })

  test('CB-12 arrow down opens listbox and sets active on first option', async ({ page }) => {
    const { input } = await getLocators(page);
    await input.click();
    await page.keyboard.press('ArrowDown')
    const activeOpt = await input.getAttribute('aria-activedescendant');
    console.log('ACTIVE OPTION', activeOpt);

    // expect(activeOpt).toBe('combobox-value-0');

    // The failing test shows that the string is correct, 
    // but the ariaActiveDescendantElement property returns null 
    // since it can not find the element due to it being in another DOM
    const result = await input.evaluate(input => ({
      attribute: input.getAttribute('aria-activedescendant'),
      resolvedId: input.ariaActiveDescendantElement?.id ?? null
    }));

    console.log('RESULT', result);
    expect(result.attribute).toBe('combobox-value-0');
    expect(result.resolvedId).toBe('combobox-value-0');

  });

  // test('CB-00 test', async ({ page }) => {
  //   const { input } = await getLocators(page);
  //   await input.click();
  //   await page.keyboard.press('ArrowDown')
  //   const activeOpt = await input.getAttribute('aria-activedescendant');

  //   // console.log(activeOpt);
  //   await expect(activeOpt).toBe('combobox-value-0');

    //   const referenceIsCorrect = await page.evaluate(() => {
    //   const host = document.querySelector('wc-combobox');
    //   const input = host.shadowRoot.querySelector('[role="combobox"]');
    //   const selected = host.querySelector('[aria-selected="true"]');
    //   console.log('INPUT.ariaActiveDescendantElement', input.ariaActiveDescendantElement);
    //   return input.ariaActiveDescendantElement === selected;
    // });

    // expect(referenceIsCorrect).toBe(true);
  // });

  // Static
  test('CB-STATIC Static test on combobox', async ({page}) => {
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (result.violations.length > 0) {
      console.log('Violations found: ', JSON.stringify(result.violations, null, 2));
    }

    await expect(result.violations).toEqual([]);
  })
});
