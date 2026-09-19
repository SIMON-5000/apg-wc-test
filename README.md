# APG Web Components Test

This repository is for experiments investigating how WAI-ARIA-APG (Authoring Practices Guide) patterns can be inplemented as web components using the Shadow DOM.

The implemented patterns are:
- Modal Dialog
- Combobox
- Checkbox

Tests using playwright / axe-core and Lighthouse
The test output can be found in:

```sh
/test-results
├── /lighthouse
│   ├── <component>.report.csv
│   ├── <component>.report.html
│   ├── <component>.report.json
│   └── ...
│  
├── /manual-tests
│  
└── /playwright
    ├── /<component>-<Test description>-<test-name>-<browser>
    │   └── error-context.md
    ├── /modal-wc-modal-A11y-tests-MD-02-A-Dialog-opens-on-click-firefox
    │   └── error-context.md
    ├── ...
    └── test-report.json
```

----
### Installation
```sh
npm ci
npx playwright install
```
### Run tests
Playwright:
`npm test`
Lighthouse:
`tests/lhtest.bash <component-name>`

---
## Testing environment
### Automated testing:
Playwright 1.60.0, utilizing browsers versions:
- Chromium 148.0.7778.96
- Mozilla Firefox 150.0.2
- WebKit 26.4

@axe-core/playwright 4.11.2

Lighthouse 13.4.0

### Manual testing:

| Browser | Version                                 |
| ------- | --------------------------------------- |
| Chrome  | 148.0.7778.216 (Official Build) (arm64) |
| Firefox | 151.0.2 (aarch64)                       |
| Safari  | 26.5 (21624.2.5.11.4)                   |

Assistive technology: Voice Over Version 10 (993)

---
