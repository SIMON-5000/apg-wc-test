
# Manual tests Modal

---
## Testing environment

MacOS: 26.5.1
Assistive technology: Voice Over Version 10 (993)

| Browser | Version                                 |
| ------- | --------------------------------------- |
| Chrome  | 148.0.7778.216 (Official Build) (arm64) |
| Firefox | 151.0.2 (aarch64)                       |
| Safari  | 26.5 (21624.2.5.11.4)                   |

---

| ID     | Test                                                                                    | Chrome + VO | Firefox + VO | Safari + VO | Observations                                                                                                                                                                                                                                                   |
| ------ | --------------------------------------------------------------------------------------- | ----------- | ------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MD-M01 | Accessible name and dialog are announced when opened                                    | Pass        | Pass         | Pass        | Exact wording differ, see below. All browsers communicated dialog, name and the targeted paragraph.                                                                                                                                                            |
| MD-M02 | Initial focus moves to the intended element inside the dialog                           | Pass        | Pass         | Pass        | The intended focus target is supplied in slotted Light DOM using `autofocus`                                                                                                                                                                                   |
| MD-M03 | Tab moves through interactive elements inside the dialog                                | Pass        | Pass         | Pass        |                                                                                                                                                                                                                                                                |
| MD-M04 | Tab and Shift+Tab do not move focus to underlying page content while the dialog is open | Pass        | Pass         | Pass        | Underlying document content must remain unavailable. Browser UI may participate in the browser's focus loop                                                                                                                                                    |
| MD-M05 | Underlying page content can not be interacted with when Modal is open                   | Pass        | Pass         | Pass        |                                                                                                                                                                                                                                                                |
| MD-M06 | Escape closes Dialog                                                                    | Pass        | Pass         | Pass        |                                                                                                                                                                                                                                                                |
| MD-M07 | Close button closes Dialog                                                              | Pass        | Pass         | Pass        |                                                                                                                                                                                                                                                                |
| MD-M08 | Focus returns to invoking element when the dialog closes                                | Pass        | Pass         | Pass        | Both Esc and the Close button returned focus to the invoking element. With mouse click on close button Chrome and Firefox did not display a visible focus indicator, but the invoking button had focus and could immediately be activated with Enter or Space. |


Exact announcements differ between Browser+VoiceOver combinations. All communicated dialog, accessible name and the focused paragraph:

Chrome: 
	"Verification results dialogue with 11 items This is just a demonstration. But this text could be important validation results. group"
Firefox: 
	"This is just a demonstration. But this text could be  and 2 more items group Verification results group"
Safari: "Verification results web dialogue with 11 items This is just a demonstration. But this text could be important validation results. group"


---
## Focus Tests - Exploratory testing


| Implementation                                                  | Chrome                                                       | Firefox                     | Safari                      | Observations                                                                                                                                                                |
| --------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native with delegatesFocus                                      | Focus on first slotted link                                  | Moves focus to close button | Moves focus to close button | Inconsistent. Chrome Focuses on the first natively focusable element slotted in. Safari and Firefox moves past slotted content and lands on the Close button in Shadow DOM. |
| Slotted Target with Tabindex="-1"                               | Pass                                                         | Moves focus to close button | Moves focus to close button | Inconsistent. Chrome successfully sets focus on target.                                                                                                                     |
| Slotted target with native autofocus                            | Lands on first slotted link, autofocus on < p > did not work | Moves focus to close button | Moves focus to close button | Inconsistent.                                                                                                                                                               |
| query host for `[autofocus]` and call .focus() on that element. | Pass                                                         | Pass                        | Pass                        | Final implementation                                                                                                                                                        |

`querySelector()` is called on the host and searches the slotted content for elements with `autofocus`, it sets focus on the first element it finds. This gives the consuming developer a tool explicitly set a focus on their intended target.
