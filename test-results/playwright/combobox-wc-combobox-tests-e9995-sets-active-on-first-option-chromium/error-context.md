# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: combobox.spec.js >> wc-combobox tests >> CB-12 arrow down opens listbox and sets active on first option
- Location: tests/combobox.spec.js:105:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "combobox-value-0"
Received: null
```

# Page snapshot

```yaml
- main [ref=e2]:
  - heading "Web Component" [level=2] [ref=e3]
  - paragraph [ref=e4]: Combobox
  - generic [active] [ref=e5]:
    - text: Color
    - generic [ref=e6]:
      - generic [ref=e7]:
        - combobox "Color" [expanded] [ref=e8]
        - button "Show Color options" [expanded] [ref=e9]:
          - img [ref=e10]
      - listbox [ref=e12]:
        - generic:
          - option "Red" [selected] [ref=e13]
          - option "Orange" [ref=e14]
          - option "Orangered" [ref=e15]
          - option "Yellow" [ref=e16]
          - option "Green" [ref=e17]
          - option "Blue" [ref=e18]
          - option "Indigo" [ref=e19]
          - option "Violet" [ref=e20]
```

# Test source

```ts
  24  |   });
  25  | 
  26  |   test('CB-02 listbox has role listbox', async ({ page }) => {
  27  |     const { listbox } = await getLocators(page);
  28  |     await expect(listbox).toHaveAttribute('role', 'listbox');
  29  |   });
  30  | 
  31  |   test('CB-03 input has aria-controls refering to listbox', async ({ page }) => {
  32  |     const { input, listbox } = await getLocators(page);
  33  |     const inputControls = await input.getAttribute('aria-controls');
  34  |     const listboxId = await listbox.getAttribute('id');
  35  | 
  36  |     expect(inputControls).toBe(listboxId);
  37  |   });
  38  | 
  39  |   test('CB-04 button has accessible name', async ({ page }) => {
  40  |     const { button } = await getLocators(page);
  41  |     const label = await button.getAttribute('aria-label');
  42  |     await expect(button).toHaveAccessibleName( /color/i );
  43  |   });
  44  | 
  45  |   test('CB-05 options have a role of option', async ({ page }) => {
  46  |     const options = await page.locator('wc-combobox li').all();
  47  |     for (const opt of options) {
  48  |       await expect(opt).toHaveAttribute('role', 'option');
  49  |     }
  50  |   });
  51  | 
  52  |   // Show / hide listbox
  53  |   test('CB-06 input has aria-expanded false on init', async ({ page }) => {
  54  |     const { input } = await getLocators(page);
  55  |     await expect(input).toHaveAttribute('aria-expanded', 'false');
  56  |   });
  57  | 
  58  |   test('CB-07 button click changes aria-expanded to true', async ({ page }) => {
  59  |     const { input, button } = await getLocators(page);
  60  |     await button.click();
  61  |     await expect(input).toHaveAttribute('aria-expanded', 'true');
  62  |   });
  63  | 
  64  |   test('CB-08 button click with open listbox changes aria-expanded to false', async ({ page }) => {
  65  |     const { input, button } = await getLocators(page);
  66  |     button.click();
  67  |     await expect(input).toHaveAttribute('aria-expanded', 'true');
  68  |     button.click();
  69  |     await expect(input).toHaveAttribute('aria-expanded', 'false');
  70  |   });
  71  | 
  72  |   test('CB-09 typing in input opens listbox', async ({ page }) => {
  73  |     const { input, listbox } = await getLocators(page);
  74  |     await input.click();
  75  |     await input.type('a');
  76  | 
  77  |     await expect(input).toHaveAttribute('aria-expanded', 'true');
  78  |   });
  79  | 
  80  |   // Keyboard navigation
  81  |   test('CB-10 Esc closes listbox (without clearing input)', async ({ page }) => {
  82  |     const {input, listbox } = await getLocators(page);
  83  |     await input.click();
  84  |     await input.type('Test');
  85  |     await expect(input).toHaveAttribute('aria-expanded', 'true');
  86  |     
  87  |     await page.keyboard.press('Escape');
  88  | 
  89  |     await expect(input).toHaveAttribute('aria-expanded', 'false');
  90  |     await expect(input).toHaveValue('Test');
  91  |   });
  92  | 
  93  |   test('CB-11 Escape clears input if pressed on closed listbox)', async ({ page }) => {
  94  |     const {input, listbox } = await getLocators(page);
  95  |     await input.click();
  96  |     await input.type('Test');
  97  |     await page.keyboard.press('Escape');
  98  |     await expect(input).not.toHaveAttribute('aria-expanded', 'true');
  99  |     await expect(input).toHaveValue('Test');
  100 | 
  101 |     await page.keyboard.press('Escape');
  102 |     await expect(input).toHaveValue('');
  103 |   })
  104 | 
  105 |   test('CB-12 arrow down opens listbox and sets active on first option', async ({ page }) => {
  106 |     const { input } = await getLocators(page);
  107 |     await input.click();
  108 |     await page.keyboard.press('ArrowDown')
  109 |     const activeOpt = await input.getAttribute('aria-activedescendant');
  110 |     console.log('ACTIVE OPTION', activeOpt);
  111 | 
  112 |     // expect(activeOpt).toBe('combobox-value-0');
  113 | 
  114 |     // The failing test shows that the string is correct, 
  115 |     // but the ariaActiveDescendantElement property returns null 
  116 |     // since it can not find the element due to it being in another DOM
  117 |     const result = await input.evaluate(input => ({
  118 |       attribute: input.getAttribute('aria-activedescendant'),
  119 |       resolvedId: input.ariaActiveDescendantElement?.id ?? null
  120 |     }));
  121 | 
  122 |     console.log('RESULT', result);
  123 |     expect(result.attribute).toBe('combobox-value-0');
> 124 |     expect(result.resolvedId).toBe('combobox-value-0');
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  125 | 
  126 |   });
  127 | 
  128 |   // test('CB-00 test', async ({ page }) => {
  129 |   //   const { input } = await getLocators(page);
  130 |   //   await input.click();
  131 |   //   await page.keyboard.press('ArrowDown')
  132 |   //   const activeOpt = await input.getAttribute('aria-activedescendant');
  133 | 
  134 |   //   // console.log(activeOpt);
  135 |   //   await expect(activeOpt).toBe('combobox-value-0');
  136 | 
  137 |     //   const referenceIsCorrect = await page.evaluate(() => {
  138 |     //   const host = document.querySelector('wc-combobox');
  139 |     //   const input = host.shadowRoot.querySelector('[role="combobox"]');
  140 |     //   const selected = host.querySelector('[aria-selected="true"]');
  141 |     //   console.log('INPUT.ariaActiveDescendantElement', input.ariaActiveDescendantElement);
  142 |     //   return input.ariaActiveDescendantElement === selected;
  143 |     // });
  144 | 
  145 |     // expect(referenceIsCorrect).toBe(true);
  146 |   // });
  147 | 
  148 |   // Static
  149 |   test('CB-STATIC Static test on combobox', async ({page}) => {
  150 |     const result = await new AxeBuilder({ page })
  151 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  152 |       .analyze();
  153 | 
  154 |     if (result.violations.length > 0) {
  155 |       console.log('Violations found: ', JSON.stringify(result.violations, null, 2));
  156 |     }
  157 | 
  158 |     await expect(result.violations).toEqual([]);
  159 |   })
  160 | });
  161 | 
```