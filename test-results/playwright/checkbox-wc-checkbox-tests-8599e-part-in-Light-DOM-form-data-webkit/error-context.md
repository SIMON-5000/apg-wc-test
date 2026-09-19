# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkbox.spec.js >> wc-checkbox tests >> CBX-09 checked values take part in Light DOM form data
- Location: tests/checkbox.spec.js:103:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- main [ref=e2]:
  - article [ref=e3]:
    - heading "Checkbox" [level=1] [ref=e4]
    - generic [ref=e5]:
      - heading "Example in a form" [level=2] [ref=e6]
      - group "Sandwich Condiments" [ref=e7]:
        - heading "Sandwich Condiments" [level=3] [ref=e8]
        - generic:
          - checkbox "Lettuce" [checked] [ref=e9] [cursor=pointer]: Lettuce Lettuce
          - checkbox "Tomato" [ref=e10] [cursor=pointer]: Tomato Tomato
          - checkbox "Mustard" [checked] [active] [ref=e11] [cursor=pointer]: Mustard Mustard
          - checkbox "Sprouts" [ref=e12] [cursor=pointer]: Sprouts Sprouts
      - button "Order" [ref=e13]
```

# Test source

```ts
  23  |   // Roles, attributes and states
  24  |   test('CBX-01 wc-checkboxes has role checkbox', async ({ page }) => {
  25  |     const wcCheck = page.locator('wc-checkbox');
  26  |     const checkboxes = page.getByRole('checkbox')
  27  |     const tomato = page.getByRole('checkbox', {name: 'Tomato'});
  28  |     
  29  |     await expect(wcCheck).toHaveCount(4);
  30  |     // All four gets selected based on checkbox role
  31  |     await expect(checkboxes).toHaveCount(4);
  32  |     await expect(tomato).toHaveRole('checkbox');
  33  |   });
  34  | 
  35  |   test('CBX-02 expect checkboxes to have accessible names', async ({ page }) => {
  36  |     const { lettuce, tomato } = getLocators(page);
  37  |     
  38  |     await expect(lettuce).toHaveAccessibleName('Lettuce');
  39  |     await expect(tomato).toHaveAccessibleName('Tomato');
  40  |   });
  41  | 
  42  |   test('CBX-03 group has role group', async ({ page }) => {
  43  |     const wcGroup = page.locator('wc-checkbox-group');
  44  |     // Try to find any role=group on page
  45  |     const group = page.getByRole('group');
  46  | 
  47  |     await expect(wcGroup).toBeVisible();
  48  |     await expect(group).toBeVisible();
  49  |     await expect(wcGroup).toHaveAttribute('role', 'group');
  50  |   });
  51  | 
  52  |   test('CBX-04 group has accessibnle name', async ({ page }) => {
  53  |     const { group } = getLocators(page);
  54  |     
  55  |     await expect(group).toHaveAccessibleName('Sandwich Condiments');
  56  |   });
  57  | 
  58  |   // Keyboard
  59  |   test('CBX-05 checkboxes are in tab sequence', async ({ page }) => {
  60  |     const { lettuce, tomato, mustard } = getLocators(page);
  61  | 
  62  |     await lettuce.focus();
  63  |     await expect(lettuce).toBeFocused()
  64  |     
  65  |     await page.keyboard.press('Tab');
  66  |     await expect(tomato).toBeFocused()
  67  | 
  68  |     await page.keyboard.press('Tab');
  69  |     await expect(mustard).toBeFocused()
  70  |   });
  71  | 
  72  |   test('CBX-05 checkboxes are initially unchecked', async ({ page }) => {
  73  |     const { lettuce } = getLocators(page);
  74  | 
  75  |     await expect(lettuce).toHaveAttribute('aria-checked', 'false')
  76  |   });
  77  | 
  78  |   test('CBX-07 checkboxes toggle checked state on space', async ({ page }) => {
  79  |     const { lettuce } = getLocators(page);
  80  | 
  81  |     await expect(lettuce).toHaveAttribute('aria-checked', 'false')
  82  |     
  83  |     await lettuce.focus();
  84  |     await page.keyboard.press('Space');
  85  | 
  86  |     await expect(lettuce).toHaveAttribute('aria-checked', 'true')
  87  | 
  88  |     await page.keyboard.press('Space');
  89  | 
  90  |     await expect(lettuce).toHaveAttribute('aria-checked', 'false')
  91  |   });
  92  | 
  93  |   test('CBX-08 checkboxes toggle checked state on click', async ({ page }) => {
  94  |     const { lettuce } = getLocators(page);
  95  |     
  96  |     await lettuce.click()
  97  |     await expect(lettuce).toHaveAttribute('aria-checked', 'true')
  98  | 
  99  |     await lettuce.click()
  100 |     await expect(lettuce).toHaveAttribute('aria-checked', 'false')
  101 |   });
  102 | 
  103 |   test('CBX-09 checked values take part in Light DOM form data', async ({ page }) => {
  104 |     const { lettuce, mustard } = getLocators(page);
  105 |     const form = await page.locator('form')
  106 | 
  107 |     await lettuce.click();
  108 |     await mustard.click();
  109 | 
  110 |     const formValues = await form.evaluate(formEl => {
  111 |       const formData = new FormData(formEl);
  112 |       let result = [];
  113 | 
  114 |       for (const pair of formData.entries()) {
  115 |         result.push(pair)
  116 |       }
  117 | 
  118 |       return result;
  119 |     });
  120 | 
  121 |     console.log('Form values', formValues);
  122 | 
> 123 |     expect(formValues.length).toBeGreaterThan(0);
      |                               ^ Error: expect(received).toBeGreaterThan(expected)
  124 |     expect(formValues).toContainEqual([ 'sandwich-condiments', 'Lettuce' ]);
  125 |   });
  126 | 
  127 |   test('CBX-STATIC Static test on checkbox', async ({page}) => {
  128 |     const result = await new AxeBuilder({ page })
  129 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  130 |       .analyze();
  131 | 
  132 |     if (result.violations.length > 0) {
  133 |       console.log('Violations found: ', JSON.stringify(result.violations, null, 2));
  134 |     }
  135 | 
  136 |     await expect(result.violations).toEqual([]);
  137 |   })
  138 | 
  139 | });
  140 | 
```