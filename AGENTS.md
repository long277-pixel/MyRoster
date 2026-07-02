# Agent Handover Notes

Date: 2026-06-12
Branch: feature/roster-import

## Current Status
- Roster selection is now centered in Weekly Entries > Roster Line.
- Preloaded roster families are hard-coded:
  - Alexander (lines 1.1, 1.2, 1.3)
  - Borrowdale (lines 1.1, 1.2)
- Selecting a preloaded roster line auto-fills:
  - hoursWorked
  - daysWorked
  - weekendWorked
  based on the 12-week cycle and week date.
- Manual roster entries are still supported.
- Manual entries can be deleted via the small x button next to Roster Line.
- Roster labels display as BoatName + line (for example, Alexander 1.1).

## UX Changes Completed
- Removed Active Boat / Roster selector from Settings.
- Roster Line dropdown now contains all preloaded options directly.
- Added roster search input above the Roster Line dropdown to filter options live.

## Known Discussion Point
- User asked whether search can live inside the native dropdown.
- Native HTML select does not support an embedded input reliably.
- If desired later, replace native select with a custom searchable combobox.

## Next Steps For Tomorrow
1. Validate Alexander cycle values against source roster data.
2. Validate Borrowdale cycle values against source roster data.
3. Add next preloaded boats using same hard-coded template pattern.
4. Decide whether to keep current search-above-dropdown UI or build custom combobox.
5. Commit and push feature branch when user confirms behavior.

## Implementation Notes
- Core roster template and lookup logic is in app.js.
- UI for Weekly Entries roster selection and filtering is in app.js and styles.css.
- Settings now no longer includes boat selector.

---

Date: 2026-06-13
Branch: feature/roster-import

## Roster Work Update
- Confirmed preloaded roster flow is in place for Weekly Entries and remains the primary path for fast data entry.
- Confirmed hard-coded roster families currently active:
  - Alexander (1.1, 1.2, 1.3)
  - Borrowdale (1.1, 1.2)
- Confirmed preloaded roster selection auto-populates:
  - hoursWorked
  - daysWorked
  - weekendWorked
  using week date + 12-week cycle logic.
- Confirmed manual roster entry and manual entry deletion (x button) remain available as fallback behavior.
- Confirmed roster search-above-dropdown pattern is active and is the current compromise versus embedding search inside native select.

## Current Decision Snapshot
- Keep the native select + separate search input for now.
- If inline searchable dropdown UX is required later, move to a custom combobox implementation.

## Remaining Roster Follow-Up
1. Verify cycle values for Alexander against source roster sheet.
2. Verify cycle values for Borrowdale against source roster sheet.
3. Add next boat families using the same hard-coded template format.
4. Re-check mobile spacing and tap targets for search + roster select once more boats are added.
5. Commit and push when roster values are confirmed.
