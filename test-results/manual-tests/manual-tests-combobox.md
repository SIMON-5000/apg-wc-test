# Manual tests Combobox
---
### Testing environment

MacOS: 26.5.1
Assistive technology: Voice Over Version 10 (993)

| Browser | Version                                 |
| ------- | --------------------------------------- |
| Chrome  | 148.0.7778.216 (Official Build) (arm64) |
| Firefox | 151.0.2 (aarch64)                       |
| Safari  | 26.5 (21624.2.5.11.4)                   |

---

### Tests

| ID     | Test                                                                          | Chrome + VO       | Firefox + VO | Safari + VO | Observations                                                                                                             |
| ------ | ----------------------------------------------------------------------------- | ----------------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| CB-M01 | Combobox name<br>announced                                                    | Pass              | Pass         | Pass        |                                                                                                                          |
| CB-M02 | Listbox state <br>announced when typing                                       | Pass              | Pass         | Pass        | Collapsed / Expanded is communicated                                                                                     |
| CB-M03 | Listbox state announced <br>on arrow navigation                               | Implicit          | Implicit     | Pass        | Chrome and Firefox announces that the user is positioned on a menu- or list-item in a listbox. Safari announces Expanded |
| CB-M04 | Arrow navigation <br>announces current<br>option                              | Pass with comment | Pass         | Pass        | Chrome creates a stutter that obscures the initial message. More in example below.                                       |
| CB-M05 | Arrow navigation and wrapping on filtered results announce the correct values | Pass              | Pass         | Pass        |                                                                                                                          |
| CB-M06 | Current position in list is announced                                         | Pass              | Pass         | Pass        | Position such as "1 of 8" is announced                                                                                   |
| CB-M07 | Escape closes and announces closing of listbox                                | Pass              | Pass         | Pass        |                                                                                                                          |

---

### Examples of announcements in combobox with an active option:

Chrome:
"Red menu item (1 of 8)" *followed by* "(1 of 8)"
*the second message partially interrupting the initial message and creates a stutter.*
"You are currently on a menu item, inside a list box. To choose this menu item, press Control-Option-Space. To close this menu, press Escape."

Firefox:
"Red selected (1 of 8)"
"You are currently on a selectable list item, inside a list box."

Safari:
"Red text (1 of 8)"
"You are currently on a combo box. Type text or, to display a list of choices, press Control-Option-Space."

The same messages were observed on the WAI-ARIA APG reference implementation, which indicates that the stuttering in chrome is not related to the Shadow DOM implementation.

---
### Safari + VO 

Safari and VoiceOver appeared to resolve the cross boundary `aria-activedescendant`-reference, the active option's value and position was announced when using keyboard navigation. Further testing showed that the announcements were being triggered by the changes to `aria-selected`. Assigning a fixed value to aria-active-descendant did not change the announcements, while removing aria-selected stopped the announcements. Therefore the observed Safari behaviour was only a browser/AT difference in what to announce, and not a cross-boundary ID reference.

| Manual test                                                 | Safari + VoiceOver                   | Chrome + VoiceOver                                       |
| ----------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------- |
| `aria-activedescendant` fixed to one option                 | Behaviour unchanged, announces color | No color or position announcement                        |
| Remove `aria-selected`; only change `aria-activedescendant` | No color or position announcement    | No color or position announcement                        |
| `aria-selected` changes + `aria-activedescendant` changes   | Announces `"Yellow, text (4 of 8)"`  | Announces `"menu item (2 of 8)"`, no color announcement. |


[https://github.com/SIMON-5000/apg-wc-test/blob/2761b7c36dfea994a3722d5755ec65cbb2f37c22/src/components/combobox/wc-combobox.js#L194](https://github.com/SIMON-5000/apg-wc-test/blob/2761b7c36dfea994a3722d5755ec65cbb2f37c22/src/components/combobox/wc-combobox.js#L194)
