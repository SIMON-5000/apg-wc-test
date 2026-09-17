// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function getLocators(page) {
  return {
    input: page.getByRole('combobox', { name: /color/i }),
    button: page.getByRole('button', { name: /color options/i}),
    listbox: page.locator('wc-combobox').locator('#listbox'),
  }
}

async function getActiveDescendantElement(locator) {
  return await locator.evaluate((element) => {
      const activeEl = element.ariaActiveDescendantElement;
      if (!activeEl) {
        return null
      }
      
      return {
        id: activeEl.id,
        selected: activeEl.getAttribute('aria-selected') === 'true',
        element: activeEl,
        text: activeEl.textContent,
      }
    })
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
    // const label = await button.getAttribute('aria-label');
    await expect(button).toHaveAccessibleName( /color/i );
  });

  test('CB-04-B button has tabindex -1', async ({ page }) => {
    const { button } = await getLocators(page);
    await expect(button).toHaveAttribute('tabindex', '-1');
  });

  test('CB-04-C button has aria-controls = listbox', async ({ page }) => {
    const { button } = await getLocators(page);
    await expect(button).toHaveAttribute('aria-controls', 'listbox');
  });

  // Options
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
    const { listbox, button } = await getLocators(page);
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(listbox).not.toBeVisible();

    await button.click();
    
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(listbox).toBeVisible();
  });

  test('CB-08 button click with open listbox changes aria-expanded to false', async ({ page }) => {
    const { input, button } = await getLocators(page);
    await button.click();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await button.click();
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('CB-09 typing in input opens listbox', async ({ page }) => {
    const { input, listbox } = await getLocators(page);
    await input.click();
    await input.type('r');

    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(listbox).toBeVisible();
  });

  // Keyboard navigation
  test('CB-10 Esc closes listbox (without clearing input)', async ({ page }) => {
    const {input, listbox } = await getLocators(page);
    await input.click();
    await input.type('red');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    
    await page.keyboard.press('Escape');

    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveValue('red');
  });

  test('CB-11 Escape clears input if pressed on closed listbox)', async ({ page }) => {
    const {input, listbox } = await getLocators(page);
    await input.click();
    await input.type('orange');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(input).toHaveAttribute('aria-expanded', 'false')
    await expect(input).toHaveValue('orange');

    await page.keyboard.press('Escape');
    await expect(input).toHaveValue('');
    await expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  test('CB-12 arrow down opens listbox and sets active on first option', async ({ page }) => {
    const { input } = await getLocators(page);
    await input.click();
    await page.keyboard.press('ArrowDown')

    // Here we check that the selected and active descendant are 
    // the same element node to make sure cross boundary reference works
    const result = await page.evaluate(() => {
      const host = document.querySelector('wc-combobox');
      const inputEl = host.shadowRoot.querySelector('[role="combobox"]');
      const selected = host.querySelector('[aria-selected="true"]');

      return {
        selectedId: selected?.id ?? null,
        descendantId: inputEl.ariaActiveDescendantElement?.id ?? null,
        // compare nodes, not ID strings
        selectedIsActive: selected != null && selected === inputEl.ariaActiveDescendantElement
      }
    });

    // console.log('RESULT', result);
    expect(result.selectedId).toBe('combobox-value-0');
    expect(result.descendantId).toBe('combobox-value-0');
    expect(result.selectedIsActive).toBe(true);
  });

  test('CB-13 arrow keys can cycle through the elements', async ({page})=> {
    const { input } = await getLocators(page);
    await input.focus();
    await page.keyboard.press('ArrowDown');

    const first = await getActiveDescendantElement(input);
    
    await page.keyboard.press('ArrowDown');

    const second = await getActiveDescendantElement(input);

    await page.keyboard.press('ArrowUp');

    const third = await getActiveDescendantElement(input);
    
    expect(first.id).toBe('combobox-value-0');
    expect(second.id).toBe('combobox-value-1');
    expect(third.id).toBe('combobox-value-0');
  })

  test('CB-13 arrow keys can wrap listbox', async ({page})=> {
    const { input } = await getLocators(page);
    await input.focus();
    await page.keyboard.press('ArrowDown');
    const first = await getActiveDescendantElement(input);

    await page.keyboard.press('ArrowUp');
    const last = await getActiveDescendantElement(input);

    await page.keyboard.press('ArrowDown');
    const firstAgain = await getActiveDescendantElement(input);
    
    expect(first.id).toBe('combobox-value-0');
    expect(last.id).toBe('combobox-value-7');
    expect(firstAgain.id).toBe('combobox-value-0');
  })

  test('CB-14 Alt+DownArrow opens textbox, but does not move focus', async ({page})=> {
    const { input } = await getLocators(page);
    await page.keyboard.press('Tab');
    await page.keyboard.down('Alt');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.up('Alt');

    const activeEl = await getActiveDescendantElement(input);

    expect(activeEl).toBe(null);
  })

  test('CB-15 focus stays on input during arrow key navigation', async ({page})=> {
    const { input } = await getLocators(page);
    // await input.click();
    await page.keyboard.press('Tab');
    await expect(input).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(input).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(input).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(input).toBeFocused();
  })

  // Selection
  test('CB-16 Enter selects the active option, passes value to input and closes listbox', async ({page})=> {
    const { input } = await getLocators(page);

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    await expect(input).toHaveValue('Red');

    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  })

  test('CB-17 click selects target option, passes value to input and closes listbox', async ({page})=> {
    const { input, listbox } = await getLocators(page);

    await input.focus();
    await page.keyboard.type('y');

    await expect(input).toHaveAttribute('aria-expanded', 'true');

    const yellow = page.getByRole('option', {name: /yellow/i})
    await expect(listbox).toBeVisible();
    await yellow.click();
    
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(listbox).not.toBeVisible();
    await expect(input).toHaveValue('Yellow');
    await expect(input).toBeFocused();
  })

  test('CB-18 active option has aria selected = true', async ({page})=> {
    const { input } = await getLocators(page);

    await input.focus();
    await page.keyboard.press('ArrowDown');

    const activeEl = await getActiveDescendantElement(input);

    await expect(activeEl.selected).toBe(true);
  })

  // Filtering behaviour
  test('CB-19 filtering shows only matching options', async ({page})=> {
    const { input } = await getLocators(page);

    await input.focus();
    await input.type('y');

    const yellow = page.getByRole('option', {name: /yellow/i})
    const red = page.getByRole('option', {name: /red/i})

    await expect(yellow).toBeVisible();
    await expect(red).toBeHidden();
  })

  test('CB-20 ArrowDown selects first option after filterning', async ({page})=> {
    const { input } = await getLocators(page);

    await input.focus();
    await input.type('or');

    await page.keyboard.press('ArrowDown');

    const first = await getActiveDescendantElement(input);
    await expect(first.text).toBe('Orange');
  })

  test('CB-21 listbox closes if there are no matches', async ({page})=> {
    const { input, listbox } = await getLocators(page);

    await input.focus();
    await input.type('x');

    const activeEl = await getActiveDescendantElement(input);
    await expect(activeEl).toBe(null);

    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(listbox).not.toBeVisible();
  })
  
  test('CB-22 combobox uses the list type of autocomplete', async ({page}) => {
    const {input} = getLocators(page);

    await expect(input).toHaveAttribute('aria-autocomplete', 'list');
  })

  test('CB-23 The combobox uses manual selection', async ({ page }) => {
    const {input} = getLocators(page);

    await input.focus();
    await input.type('red');

    const activeEl = await getActiveDescendantElement(input);
    const selected = await page.locator('wc-combobox [aria-selected="true"]')
    
    await expect(activeEl).toBe(null);
    await expect(selected).toHaveCount(0);
  })


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

  test('CB-STATIC Static test on combobox with open listbox', async ({page}) => {
    const { input, listbox } = await getLocators(page);

    await input.focus();
    await page.keyboard.press('ArrowDown');

    await expect(listbox).toBeVisible();
      
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (result.violations.length > 0) {
      console.log('Violations found: ', JSON.stringify(result.violations, null, 2));
    }

    await expect(result.violations).toEqual([]);
  })
});
