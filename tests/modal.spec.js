import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ----- Helpers -----
function getTab(browserName) {
  return browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
}

function getShiftTab(browserName) {
  return browserName === 'webkit' ? 'Shift+Alt+Tab' : 'Shift+Tab';
}

async function openModalWithKeyboard(page, key='Space') {
  const { openButton } = getLocators(page);
  await openButton.focus()
  await page.keyboard.press(key);
}

function getLocators(page) {
  return {
    openButton: page.getByRole('button', { name: /open modal dialog/i }),
    autofocusElement: page.locator('wc-modal [autofocus]'),
    helpLink: page.getByRole('link', {name: /help link/i}),
    input: page.getByRole('textbox', {name: /test input/i}),
    closeButton: page.getByRole('button', {name: /close/i }),
    dialog: page.locator('wc-modal dialog'),
  }
}

// ----- Tests -----

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
    await openModalWithKeyboard(page, 'Enter');
    
    await expect(page.getByRole('dialog')).toBeVisible();
  })

  test('MD-01-C Dialog opens on space', async ({page}) => {
    await openModalWithKeyboard(page, 'Space');

    await expect(page.getByRole('dialog')).toBeVisible();
  })

  test('MD-02 Escape closes dialog', async ({page}) => {
    await openModalWithKeyboard(page, 'Space');

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  })

  test('MD-03-A Enter activates the Close button', async ({ page }) => {
    const { dialog, closeButton } = getLocators(page);

    await openModalWithKeyboard(page);
    await closeButton.focus();
    await closeButton.press('Enter');

    await expect(dialog).not.toBeVisible();
  });

  test('MD-03-B Space activates the Close button', async ({ page }) => {
    const { dialog, closeButton } = getLocators(page);

    await openModalWithKeyboard(page);
    await closeButton.focus();
    await closeButton.press('Space');

    await expect(dialog).not.toBeVisible();
  });

  // Webkit does not automatically return focus to button when modal is opened with click,
  // But when opened with keyboard it does.
  // This behaviour does however seem to be by design, see:
  // Darin Adler (Vice President at Apple) explains why a click does not shift focus in Safari/Webkit https://bugs.webkit.org/show_bug.cgi?id=22261#c68
  test('MD-04-A Focus returns to invoking element (click)', async ({ page }) => {
    const { openButton } = getLocators(page);
    await openButton.click();

    await page.keyboard.press('Escape');
    await expect(openButton).toBeFocused();
  });

  test('MD-04-B Focus returns to invoking element (Enter)', async ({page}) => {
    const { openButton } = getLocators(page);

    await openModalWithKeyboard(page, 'Enter');

    await page.keyboard.press('Escape');
    await expect(openButton).toBeFocused();
  })

  test('MD-04-C Focus returns to invoking element (Space)', async ({page}) => {
    const { openButton } = getLocators(page);

    await openModalWithKeyboard(page, ' ');

    await page.keyboard.press('Escape');
    await expect(openButton).toBeFocused();
  })

  test('MD-04-D Focus returns to invoking element using Close Button', async ({page}) => {
    const { openButton, closeButton } = getLocators(page);

    await openModalWithKeyboard(page);

    await closeButton.click();
    await expect(openButton).toBeFocused();
  })

  test('MD-05 Focus moves to intended first focus element inside dialog', async ({page}) => {
    await openModalWithKeyboard(page);

    const {autofocusElement} = getLocators(page);

    await expect(autofocusElement).toBeFocused();
  })

  test('MD-06 Tab moves focus forward', async ({page, browserName}) => {    
    /**
     * Playwright WebKit skips links with plain Tab in this test
     * environment. Alt+Tab includes links in the focus order.
     *
     * Manual Safari tests used the corresponding Safari keyboard
     * preference and produced the expected focus sequence.
     */
    const forwardTab = getTab(browserName);
    const { helpLink } = await getLocators(page);

    await openModalWithKeyboard(page);
    await page.keyboard.press(forwardTab);

    await expect(helpLink).toBeFocused();
  })

  test('MD-06-B Tab moves focus forward', async ({page, browserName}) => {
    await openModalWithKeyboard(page);

    const forwardTab = getTab(browserName);
    const {helpLink, input, closeButton } = getLocators(page);
    
    // console.log(
    //   await page.evaluate(() => {
    //     const modal = document.querySelector('wc-modal');

    //     return {
    //       documentFocus: document.activeElement?.outerHTML,
    //       shadowFocus: modal?.shadowRoot?.activeElement?.outerHTML,
    //     };
    //   }),
    // );
    
    // TAB SEQUENCE
    // Link
    await page.keyboard.press(forwardTab);
    await expect(helpLink).toBeFocused();
    // Input
    await page.keyboard.press(forwardTab);
    await expect(input).toBeFocused();
    // Button
    await page.keyboard.press(forwardTab);
    await expect(closeButton).toBeFocused();
  });

  test('MD-07 Shift+Tab moves focus backwards', async ({page, browserName}) => {
    const helpLink = page.getByRole('link', {name: 'Important HELP link'});
    const closeButton = page.getByRole('button', {name: /Close/ });
    const forwardTab = getTab(browserName);
    const backwardsTab = getShiftTab(browserName);

    await openModalWithKeyboard(page);

    await page.keyboard.press(forwardTab);
    await page.keyboard.press(forwardTab);
    await page.keyboard.press(forwardTab);

    await expect(closeButton).toBeFocused();

    await page.keyboard.press(backwardsTab);
    await page.keyboard.press(backwardsTab);

    await expect(helpLink).toBeFocused();
  });

  /**
   * Testing focus loops that includes the browser controls is problematic in Playwright:
   * https://github.com/microsoft/playwright/issues/39268
   * 
   * In Playwright’s Firefox environment repeated Tab presses stays on the last element of the page.
   * In manual tests Firefox lets me loop from end to start via browser controls, like Chrome and WebKit.
   */
  test('MD 08 Focus loops via browser controls from last to first focusable element', async ({page, browserName}) => {
    test.skip(browserName === 'firefox',
      'Playwright Firefox does not allow me to traverse with tab through browser controls'
    );
    
    const { helpLink, closeButton } = getLocators(page);
    const forwardTab = getTab(browserName);

    await openModalWithKeyboard(page);
    await page.keyboard.press(forwardTab);
    await page.keyboard.press(forwardTab);
    await page.keyboard.press(forwardTab);

    // Dialogs last element is focused
    await expect(closeButton).toBeFocused();

    for (let i = 0; i<10; i++) {
      await page.keyboard.press(forwardTab);

      const helpLinkIsFocused = await helpLink.evaluate((element) => {
        return element === element.getRootNode().activeElement
      })

      if (helpLinkIsFocused) {
        break;
      }
    }

    await expect(helpLink).toBeFocused();
  })

  test('MD 09 Assert that focus does not reach the background page content', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox',
      'Playwright Firefox does not allow me to traverse with tab through browser controls'
    );
    
    const { helpLink, openButton } = getLocators(page);
    const forwardTab = getTab(browserName);

    await openModalWithKeyboard(page);
    await page.keyboard.press(forwardTab);
    await expect(helpLink).toBeFocused();

    let completedLoop = false;

    for (let i = 0; i<10; i++) {
      await page.keyboard.press(forwardTab);

      // The open button, the only focusable element in the background, must not recieve focus.
      await expect(openButton).not.toBeFocused();

      const helpLinkIsFocused = await helpLink.evaluate((element) => {
        return element === element.getRootNode().activeElement;
      })

      if (helpLinkIsFocused && i > 1) {
        // Loop is completed
        completedLoop = true;
        break;
      }
    }

    await expect(completedLoop).toBe(true);
  })

  test('MD 10 Assert modal is in modal mode', async ({page}) => {
    const { dialog } = getLocators(page);
    let isModal = await dialog.evaluate(element => element.matches(':modal'));

    await expect(isModal).toBe(false);

    await openModalWithKeyboard(page);
    isModal = await dialog.evaluate(element => element.matches(':modal'));

    await expect(isModal).toBe(true);
  })

  test('MD 11 Dialog exposes a role of dialog', async ({page}) => {
    const { dialog } = getLocators(page);
    
    await openModalWithKeyboard(page);

    await expect(dialog).toHaveRole('dialog');
  })

  test('MD 12 Dialog exposes a accessible name', async ({page}) => {
    const { dialog } = getLocators(page);
    
    await openModalWithKeyboard(page);

    await expect(dialog).toHaveRole('dialog');
    await expect(dialog).toHaveAccessibleName('Verification results');
  })

  test('MD-13 Close button has an accessible name', async ({ page }) => {
    const { closeButton } = getLocators(page);

    await openModalWithKeyboard(page);

    await expect(closeButton).toHaveAccessibleName('Close Dialog');
  });

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
