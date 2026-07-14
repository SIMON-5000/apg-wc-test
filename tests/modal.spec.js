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
    await page.keyboard.press('Enter');
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

  test('MD-06 Tab moves focus forward', async ({page, browserName}) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.focus();
    await page.keyboard.press('Space');
    // await page.keyboard.press('Tab');
    
    /**
     * Playwright WebKit skips links with plain Tab in this test
     * environment. Alt+Tab includes links in the focus order.
     *
     * Manual Safari tests used the corresponding Safari keyboard
     * preference and produced the expected focus sequence.
     */
    if (browserName === 'webkit') {
     await page.keyboard.press('Alt+Tab');
    } else {
      await page.keyboard.press('Tab');
    }

    const secondFocusableEl = page.getByRole('link', {name: 'Important HELP link'});

    await expect(secondFocusableEl).toBeFocused();
  })

  test('MD-06-B Tab moves focus forward', async ({page, browserName}) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.focus();
    await page.keyboard.press('Space');

    let focusMover = 'Tab';
    if (browserName === 'webkit') {
     focusMover = 'Alt+Tab';
    }
    
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
    await page.keyboard.press(focusMover);
    // Input
    await page.keyboard.press(focusMover);
    // Button
    await page.keyboard.press(focusMover);

    const thirdFocusableEl = page.getByRole('button', {name: /close/i });

    await expect(thirdFocusableEl).toBeFocused();
  });
  test('MD-07 Shift+Tab moves focus backwards', async ({page, browserName}) => {
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.focus();
    await page.keyboard.press('Space');

    const helpLink = page.getByRole('link', {name: 'Important HELP link'});
    const closeButton = page.getByRole('button', {name: /Close/ });
    const forwardTab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
    const backwardsTab = browserName === 'webkit' ? 'Shift+Alt+Tab' : 'Shift+Tab';


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
      'Firefox does not allow me to traverse with tab through browser controls'
    );
    
    const openButton = page.getByRole('button', { name: /open modal dialog/i });
    await openButton.focus();
    await page.keyboard.press('Space');

    const helpLink = page.getByRole('link', {name: 'Important HELP link'});
    const closeButton = page.getByRole('button', {name: /Close/ });
    const forwardTab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

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
