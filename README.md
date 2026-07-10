# apg-wc-test

This repository is for experiments with using WAI-ARIA-APG patterns in web components thet use the Shadow DOM.

Tests using playwright / axe-core and Lighthouse
The test output can be found in:
```sh
/test-results
├── /lighthouse
│   ├── <component>.report.csv
│   ├── <component>.report.html
│   ├── <component>.report.json
│   └── ...
└── /playwright
    ├── /<component>-<Test description>-<test-name>-<browser>
    │   └── error-context.md
    ├── /modal-wc-modal-A11y-tests-MD-02-A-Dialog-opens-on-click-firefox
    │   └── error-context.md
    ├── ...
    └── test-report.json
```

```sh
npm ci
npx playwright install
```
