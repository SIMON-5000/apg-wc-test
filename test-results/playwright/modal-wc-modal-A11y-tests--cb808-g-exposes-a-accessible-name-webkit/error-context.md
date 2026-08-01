# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: modal.spec.js >> wc-modal A11y tests >> MD 12 Dialog exposes a accessible name
- Location: tests/modal.spec.js:264:3

# Error details

```
Error: expect(locator).toHaveAccessibleName(expected) failed

Locator:  locator('wc-modal dialog')
Expected: "Verification results"
Received: ""
Timeout:  5000ms

Call log:
  - Expect "toHaveAccessibleName" with timeout 5000ms
  - waiting for locator('wc-modal dialog')
    14 × locator resolved to <dialog open="" id="modal-dialog" closedby="closerequest">…</dialog>
       - unexpected value ""

```

```yaml
- dialog:
  - heading "Verification Result" [level=1]
  - paragraph
  - paragraph: "For demonstration purposes, this dialog has a lot of text. It demonstrates a scenario where:"
  - list
  - paragraph: "There are several ways to resolve this issue:"
  - list
  - paragraph
  - list
  - paragraph
  - text: test input
  - textbox "test input"
  - button "Close"
```

# Test source

```ts
  170 |   });
  171 | 
  172 |   /**
  173 |    * Testing focus loops that includes the browser controls is problematic in Playwright:
  174 |    * https://github.com/microsoft/playwright/issues/39268
  175 |    * 
  176 |    * In Playwright’s Firefox environment repeated Tab presses stays on the last element of the page.
  177 |    * In manual tests Firefox lets me loop from end to start via browser controls, like Chrome and WebKit.
  178 |    */
  179 |   test('MD 08 Focus loops via browser controls from last to first focusable element', async ({page, browserName}) => {
  180 |     test.skip(browserName === 'firefox',
  181 |       'Playwright Firefox does not allow me to traverse with tab through browser controls'
  182 |     );
  183 |     
  184 |     const { helpLink, closeButton } = getLocators(page);
  185 |     const forwardTab = getTab(browserName);
  186 | 
  187 |     await openModalWithKeyboard(page);
  188 |     await page.keyboard.press(forwardTab);
  189 |     await page.keyboard.press(forwardTab);
  190 |     await page.keyboard.press(forwardTab);
  191 | 
  192 |     // Dialogs last element is focused
  193 |     await expect(closeButton).toBeFocused();
  194 | 
  195 |     for (let i = 0; i<10; i++) {
  196 |       await page.keyboard.press(forwardTab);
  197 | 
  198 |       const helpLinkIsFocused = await helpLink.evaluate((element) => {
  199 |         return element === element.getRootNode().activeElement
  200 |       })
  201 | 
  202 |       if (helpLinkIsFocused) {
  203 |         break;
  204 |       }
  205 |     }
  206 | 
  207 |     await expect(helpLink).toBeFocused();
  208 |   })
  209 | 
  210 |   test('MD 09 Assert that focus does not reach the background page content', async ({ page, browserName }) => {
  211 |     test.skip(browserName === 'firefox',
  212 |       'Playwright Firefox does not allow me to traverse with tab through browser controls'
  213 |     );
  214 |     
  215 |     const { helpLink, openButton } = getLocators(page);
  216 |     const forwardTab = getTab(browserName);
  217 | 
  218 |     await openModalWithKeyboard(page);
  219 |     await page.keyboard.press(forwardTab);
  220 |     await expect(helpLink).toBeFocused();
  221 | 
  222 |     let completedLoop = false;
  223 | 
  224 |     for (let i = 0; i<10; i++) {
  225 |       await page.keyboard.press(forwardTab);
  226 | 
  227 |       // The open button, the only focusable element in the background, must not recieve focus.
  228 |       await expect(openButton).not.toBeFocused;
  229 | 
  230 |       const helpLinkIsFocused = await helpLink.evaluate((element) => {
  231 |         return element === element.getRootNode().activeElement;
  232 |       })
  233 | 
  234 |       if (helpLinkIsFocused && i > 1) {
  235 |         // Loop is completed
  236 |         completedLoop = true;
  237 |         break;
  238 |       }
  239 |     }
  240 | 
  241 |     await expect(completedLoop).toBe(true);
  242 |   })
  243 | 
  244 |   test('MD 10 Assert modal is in modal mode', async ({page}) => {
  245 |     const { dialog } = getLocators(page);
  246 |     let isModal = await dialog.evaluate(element => element.matches(':modal'));
  247 | 
  248 |     await expect(isModal).toBe(false);
  249 | 
  250 |     await openModalWithKeyboard(page);
  251 |     isModal = await dialog.evaluate(element => element.matches(':modal'));
  252 | 
  253 |     await expect(isModal).toBe(true);
  254 |   })
  255 | 
  256 |   test('MD 11 Dialog exposes a role of dialog', async ({page}) => {
  257 |     const { dialog } = getLocators(page);
  258 |     
  259 |     await openModalWithKeyboard(page);
  260 | 
  261 |     await expect(dialog).toHaveRole('dialog');
  262 |   })
  263 | 
  264 |   test('MD 12 Dialog exposes a accessible name', async ({page}) => {
  265 |     const { dialog } = getLocators(page);
  266 |     
  267 |     await openModalWithKeyboard(page);
  268 | 
  269 |     await expect(dialog).toHaveRole('dialog');
> 270 |     await expect(dialog).toHaveAccessibleName('Verification results');
      |                          ^ Error: expect(locator).toHaveAccessibleName(expected) failed
  271 |   })
  272 | 
  273 |   test('MD-STATIC Static test on open dialog', async ({page}) => {
  274 |     const openButton = page.getByRole('button', { name: /open modal dialog/i });
  275 |     await openButton.click();
  276 | 
  277 |     const result = await new AxeBuilder({ page })
  278 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  279 |       .analyze();
  280 | 
  281 |     if (result.violations.length > 0) {
  282 |       console.log('Violations found: ', JSON.stringify(result.violations, null, 2));
  283 |     }
  284 | 
  285 |     await expect(result.violations).toEqual([]);
  286 |   })
  287 | });
  288 | 
```