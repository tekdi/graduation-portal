# Participant Reassign

Technical documentation for the **Participant Reassign** feature of the Graduation Portal (Assign Users → *Participant Reassign* tab).

> **Status:** the screen, filters, selection, Step 2 and the confirmation modals are implemented. **The final submission is not implemented yet** — confirming a reassignment currently closes the modal without calling any API. See [Pending work and known limitations](#10-pending-work-and-known-limitations).

---

## Table of contents

1. [Overview](#1-overview)
2. [Who can use it](#2-who-can-use-it)
3. [End-to-end workflow](#3-end-to-end-workflow)
4. [File map](#4-file-map)
5. [Frontend implementation](#5-frontend-implementation)
6. [API integration](#6-api-integration)
7. [Backend and data model](#7-backend-and-data-model)
8. [Error handling and validations](#8-error-handling-and-validations)
9. [Testing and verification](#9-testing-and-verification)
10. [Pending work and known limitations](#10-pending-work-and-known-limitations)

---

## 1. Overview

Participants in the BRAC graduation programme are assigned to a **Linkage Champion (LC)**. Participant Reassign lets an authorised user move participants from their current LC to another LC, for reasons such as workload rebalancing, LC leave/resignation or participant relocation.

The feature is a third tab on the **Assign Users** screen, next to *LC to Supervisor* and *Participant to LC*. It is a two-step screen:

- **Step 1 – Filter & Select Assigned Participants.** Find the participants to move and tick them.
- **Step 2 – Destination LC & Transfer Policy.** Choose the target LC and a reason, then press *Proceed*. A confirmation modal summarises the transfer.

A participant can also be moved on its own through the **Reassign** button on each table row, which opens a single-participant modal.

---

## 2. Who can use it

Role handling is done in the frontend with `useIsSupervisor()` from `@contexts/AuthContext`.

| Role | What they see |
|---|---|
| **Admin** | All LCs (loaded from the user-service account search). Step 2 shows the *Choose Supervisor* filter. |
| **Supervisor** | Only the LCs mapped to them. The *Choose Supervisor* filter in Step 2 is hidden. Supervisors open the Assign Users screen on the *Participant to LC* tab by default and can switch to *Participant Reassign*. |

The *LC to Supervisor* tab button is hidden for supervisors.

---

## 3. End-to-end workflow

### Step 0 – Open the tab
`AssignUsers/index.tsx` sets `activeTab = 'PARTICIPANT_REASSIGN'` and renders `<ParticipantReassign />`.

### Step 1 – Filter & select participants
1. **LCs are loaded** once (`lcData.ts → loadLinkageChampions`) using `GLOBAL_LC_PROGRAM_ID`:
   - Supervisor: the LCs mapped to the logged-in supervisor.
   - Admin: all LCs with the `org_admin` role.
   - For each LC, the participants currently assigned to it are loaded.
2. **Province and Site** filters come from `useParticipantFilterOptions`. Choosing a province refreshes the site options.
3. **From Current Linkage Champion** is a searchable `paginated-select` listing only LCs that have participants and that match the chosen province/site. The label shows the participant count.
4. **Search Participant** filters the table by participant name.
5. The table rows are built from the already-loaded LC data. All filtering and paging happens in the browser (no extra API call per filter change).
6. **Selection:** each row has a checkbox; the header checkbox selects/deselects the rows of the **current page**. "Clear Selection (n)" empties the selection.
7. **Pagination:** page sizes 5 / 10 / 25 / 50, default 5.

### Step 2 – Destination LC & transfer policy
1. Province and Site start with the values chosen in Step 1 and can then be changed independently. A later change in Step 1 overwrites them.
2. **Choose Supervisor** (admin only) lists supervisors for the chosen province/site. Selecting one limits the LC list to LCs mapped to that supervisor.
3. **Target Linkage Champion** (required) lists LCs matching province, site and supervisor. The label shows name, site and active participant count.
4. **Reason for Reassignment** (required, default *Workload Rebalancing*) – seven predefined reasons.
5. **Proceed to Reassign N Participants** is enabled only when at least one participant is selected **and** a target LC is chosen.

### Confirmation
- **Bulk (Proceed):** opens a modal showing "N Selected → Target LC" with an optional paged list of the selected participants (5 per page). Button: *Execute Reassignment*.
- **Single (row button):** opens a modal showing the current LC, Province/Site filters, a *New Linkage Champion* select (the current LC is excluded) and a reason. Button: *Confirm Reassignment*.

### Submission
Both confirm buttons call `onConfirm`, but the parent does not pass it, so **nothing is saved yet** (see §10).

---

## 4. File map

All paths are relative to the repository root.

### Created
| File | Purpose |
|---|---|
| `src/screens/AssignUsers/ParticipantReassign/index.tsx` | Step 1 screen. Owns the filter, selection, paging and modal state and renders Step 2 and the modal. |
| `src/screens/AssignUsers/ParticipantReassign/lcData.ts` | Loads LCs and their participants for both steps and the modal; de-duplicates requests with a 30 s cache. |
| `src/screens/AssignUsers/ParticipantReassign/ReassignParticipantModal.tsx` | Single-participant form and bulk confirmation modal. |
| `src/screens/AssignUsers/ParticipantReassign/DestinationPolicy/index.tsx` | Step 2 component. |
| `src/screens/AssignUsers/ParticipantReassign/DestinationPolicy/constants.ts` | The reassignment reasons and the default reason. |
| `src/screens/AssignUsers/ParticipantReassign/DestinationPolicy/Styles.ts` | Step 2 styles (reuses Assign Users and Filter styles). |
| `src/screens/AssignUsers/ParticipantReassign/Styles.ts` | Step 1 styles (reuses `AssignUsersStyles`). |

### Modified
| File | What changed |
|---|---|
| `src/screens/AssignUsers/index.tsx` | Added the `PARTICIPANT_REASSIGN` tab type, tab button and render. The tab bar is now always rendered; only the *LC to Supervisor* button is hidden for supervisors. |
| `src/services/assignUsersService.ts` | `getSupervisorsByProvince` accepts an optional `siteId`, sent as `meta.site` in the request body. Existing callers are unaffected. |
| `src/components/Filter/index.tsx` | Shared component. Added `showLabels` and `searchAtEnd` props (default off), moved the search field into a reusable block, and the paginated-select branch now honours an optional `item.bg`. |
| `src/components/Filter/Styles.ts` | Added a `label` style. |
| `src/components/ui/LucideIcon/index.tsx` | Registered the `ArrowLeftRight` icon. |
| `src/locales/en.json` | Added `clearSelection` and the `reassignModal.*` keys under `admin.assignUsers.participantReassign`. |

> `Filter` is shared by User Management, Admin Dashboard, Review Requests, Audit Log and the user avatar card. Re-test the filter bars on those screens after changes to it.

---

## 5. Frontend implementation

### `index.tsx` (Step 1)
- **State:** `filterValues`, `lcs`, `lcsLoaded`, `participants`, `total`, `page`, `pageSize`, `selected` (a `Set` of participant ids), `reassignTarget` (row for the single modal), `bulkTarget` (`{id, name, participants}` for the bulk modal).
- **Role:** `supervisorId` is the logged-in user's id when `useIsSupervisor()` is true, otherwise `undefined`.
- **Loading:** an effect calls `loadLinkageChampions(programId, supervisorId)`. If `GLOBAL_LC_PROGRAM_ID` is missing it logs an error and stops loading.
- **Rows:** an effect flattens `lc.participants` into rows (`id`, `name`, `currentLc`, `currentLcId`, `pathway`, `province`, `site`), removes duplicates by id, then applies the province, site and name-search filters.
- **Label matching:** Province/Site filter values are ids but LC and participant records carry labels, so filters compare through the option **labels** (case-insensitive).
- **Table:** shared `DataTable` with a custom header row (so the header can hold a select-all checkbox) and the shared `PaginationControls`.
- **Child wiring:** `DestinationPolicy` receives `selectedCount`, `initialProvince`, `initialSite` and `onProceed`; `ReassignParticipantModal` receives `participant`, `bulk` and `onClose`.

### `lcData.ts`
- `loadLinkageChampions(programId, supervisorId?)` returns `LCItem[]` (`id`, `name`, `site`, `province`, `participants`, `participantIds`, `count`).
- Results are cached for 30 s per `programId|supervisorId`; the same promise is shared by Step 1, Step 2 and the modal. A failed load clears the cache.
- Participant requests run with a concurrency of 3 to avoid rate-limit (429) errors.
- `count` is the API `total` when participants were returned, otherwise the LC's `overview.assigned`.
- If one LC's participant request fails, it is logged and that LC appears with no participants.

### `DestinationPolicy/index.tsx` (Step 2)
- Loads all LCs through the shared loader (not limited to the Step 1 LC).
- `visibleLcs` = LCs matching the chosen province, site and (if set) the supervisor's mapped LCs.
- Changing province/site clears the chosen supervisor; a target LC that is no longer visible is cleared.
- Supervisor → LC ids come from `getMappedLCsForSupervisor` and are cached per supervisor in a `useRef` map.
- The supervisor picker uses `getSupervisorsByProvince` (server paging/search). When a target LC is already chosen, it instead lists only supervisors mapped to that LC (loads up to 10 pages × 100 supervisors and checks each one's mapped LCs).
- `onProceed({ targetLcId, targetLcName, reason })` is called from the Proceed button.

### `ReassignParticipantModal.tsx`
- Props: `participant`, `bulk`, `onClose`, `onConfirm`. The modal is open when either `participant` or `bulk` is set.
- Single mode excludes the participant's current LC from the choices and filters by province/site.
- Bulk mode shows the count, target LC and a paged list of the selected participants.
- `handleConfirm` sets `submitting`, calls `onConfirm`, then `onClose`.

### Reasons (`DestinationPolicy/constants.ts`)
`workload_rebalancing` (default), `lc_leave_resignation`, `participant_relocation`, `coaching_fit`, `performance_realignment`, `program_restructuring`, `other`. Display text is in `en.json` under `step2.reasons`.

---

## 6. API integration

Base URL comes from `API_BASE_URL`. Endpoints are defined in `src/services/apiEndpoints.ts`; the gateway routes are in the backend `interface-service`.

| # | Purpose | Method and endpoint | Called from | Key parameters | Response fields used |
|---|---|---|---|---|---|
| 1 | LC list (admin) | `POST /user/v1/account/search` | `lcData.ts` via `getUsersList` | query: `tenant_code=brac`, `type=org_admin`, `role=org_admin`, `page=1`, `limit=100` | `result.data[]` → `id`, `name`, province/site labels |
| 2 | LCs mapped to a supervisor | `GET /project/v1/programUsers/entities` | `lcData.ts`, `DestinationPolicy` via `getMappedLCsForSupervisor` | `userId`=supervisor, `type=org_admin`, `programId`, `page`, `limit` (500 in `lcData`) | `result.data[]` → `userId`, `name`, `userDetails` |
| 3 | LC assigned counts | `POST /project/v1/programUsers/search` | `lcData.ts` via `getParticipants` | query: `programId`, `excludeMapped=false`, `type=org_admin`, `limit`; body: `{ userIds }` | `result.data[].overview.assigned` |
| 4 | Participants of an LC | `GET /project/v1/programUsers/entities` | `lcData.ts` via `getMappedParticipantsForLC` | `userId`=LC, `type=user`, `programId`, `page=1`, `limit=500`, `search=''` | `result.data[]` → `userId`, `userDetails` (name, province, site, pathway); `total` |
| 5 | Supervisor list (Step 2, admin) | `POST /user/v1/account/search` | `DestinationPolicy` via `getSupervisorsByProvince` | query: `tenant_code=brac`, `type=tenant_admin`, `search`, `page`, `limit`; body: `meta.province`, `meta.site` | `result.data[]` → `id`, `name`; `result.total` |
| 6 | Provinces and sites | via `useParticipantFilterOptions` (`getProvincesList`, `getSitesByProvince`) | all three components | optional province id | option lists |

Notes
- On `/entities`, the backend controller reads `userId`, `programId`, `status`, `search`, page and sort parameters. The `type` parameter is accepted by the frontend but **not read** by the controller; the result depends on `userId`.
- `GLOBAL_LC_PROGRAM_ID`, `TENANT_CODE_NAME` and `API_BASE_URL` are read from the environment.
- **No reassignment (write) API is called by this feature yet.** The existing assign call `POST /project/v1/programUsers/createOrUpdate` (used by *Participant to LC*) is **not** invoked from Participant Reassign; see §7 for why it is not sufficient as-is.

### Request sequence
```
Open tab
 ├─ provinces / sites                          (filter options)
 ├─ [admin]      POST user/v1/account/search   (LCs)
 │  [supervisor] GET  programUsers/entities    (mapped LCs)
 ├─ POST programUsers/search                   (assigned counts)
 └─ GET  programUsers/entities  × each LC      (participants, 3 at a time)

Step 1 filters / paging / selection  → no API calls (client-side)

Step 2
 ├─ [admin] POST user/v1/account/search        (supervisors, on picker open)
 └─ GET programUsers/entities per supervisor   (their mapped LCs, cached)

Execute / Confirm → (not implemented)
```

---

## 7. Backend and data model

Verified from the local backend repositories (`project-service`, `user`, `entity-management`, `interface-service`).

| Concern | Where |
|---|---|
| Participant ↔ LC ↔ Supervisor mapping | **project-service**, model `programUsers` (`models/programUsers.js`) |
| Accounts, roles, province/site (user `meta`) | **user-service** |
| Entity records (`linkageChampion`, `supervisor`, `participant`) | **entity-management**, model `entities` |
| API gateway routes | **interface-service** (`src/configs/routesConfigs/elevate-project.json`) |

### `programUsers` document
Key fields: `userId`, `programId`, `hierarchy[{ level, id }]`, `entities[]`, `overview`, `status`, `tenantId`, `orgId`, plus audit fields. A unique index exists on `userId + programId`.

- **Supervisor → LC:** the supervisor's document lists the LCs in `entities`; each LC's document has `hierarchy[level 0] = supervisor`.
- **LC → participant:** the LC's document lists participants in `entities` (`userId`, `name`, `entityId`, `status`). The participant's own document has `hierarchy[level 0] = LC` and `hierarchy[level 1] = supervisor`.
- LC participant lists read `LC.entities`; authorization checks read `hierarchy.id`. Both must stay consistent.

### Why the existing assign API is not enough for reassignment
`POST /project/v1/programUsers/createOrUpdate` (with `userId` and `assignedUserIds`) adds the participants to the new LC and replaces the participant's `hierarchy` levels. From reading `module/programUsers/helper.js` (`assignUsers`) and `databaseQueries/programUsers.js`:
- It **does not remove** the participant from the previous LC's `entities`.
- The status written is the request's `assignedUsersStatus` (frontend default `NOT_ONBOARDED`), so an existing participant status would be overwritten, and the entity sub-document is replaced.
- Hierarchy is replaced only at the levels provided, so a stale level may remain if the new LC has no hierarchy.
- It runs one document at a time with no transaction, writes no history (activity logging is stubbed) and has no role/ownership check in the code path read.

---

## 8. Error handling and validations

### Implemented
- Missing `GLOBAL_LC_PROGRAM_ID`: error logged, loading ends.
- LC loading failure: error logged, LC list set to empty.
- Per-LC participant failure: warning logged, that LC shows no participants.
- Program-level count failure: warning logged, counts fall back to the loaded participant count.
- Cancelled effects (unmount/changes) do not update state.
- Proceed is disabled unless participants are selected and a target LC is chosen; a chosen target LC is cleared if filters hide it.
- Single modal: the current LC is not offered as a destination; Confirm requires a new LC.
- Confirm buttons are disabled while `submitting`.

### Not implemented
- No user-visible error messages for load failures (the table shows the empty state).
- No `catch` in the modal's `handleConfirm`.
- No validation that the target LC differs from the selected participants' current LCs in bulk mode.
- No input for the custom text of the "Other" reason.

---

## 9. Testing and verification

No automated tests exist for this feature. The scenarios below are for manual QA once submission is implemented; items marked *now* can be tested today.

| Area | Scenario |
|---|---|
| Role access *(now)* | Admin sees all LCs and the supervisor filter; supervisor sees only mapped LCs and no supervisor filter; supervisor sees the tab bar without *LC to Supervisor*. |
| Filters *(now)* | Province → Site options refresh; From-LC list respects province/site and shows counts; name search; changing Province after choosing an LC (see §10). |
| Selection *(now)* | Row select, select-all on page, selection across pages, Clear Selection, selection after changing filters. |
| Pagination *(now)* | Page sizes 5/10/25/50, page reset on filter change, total count. |
| Step 2 *(now)* | Province/Site follow Step 1; supervisor narrows LC list; Proceed enabled/disabled rules. |
| Modals *(now)* | Single modal excludes the current LC; bulk list pages and toggles. |
| Reassignment *(after backend)* | Move one / many participants; participants from different LCs; invalid or same destination; duplicate ids; already-reassigned participant; participant status and data preserved; API failure and partial failure. |
| Cross-screen *(after backend)* | Old LC loses and new LC gains the participants; Participants list and detail; User Management LC counts; Participant to LC tab; offline/synced participant data; dashboards and reports (reporting service not reviewed). |
| Regression *(now)* | Filter bars on User Management, Admin Dashboard, Review Requests, Audit Log; Assign Users other tabs for both roles. |

---

## 10. Pending work and known limitations

### Frontend
1. **Wire the final step.** `onConfirm` is not passed to `ReassignParticipantModal` in `index.tsx`; confirming does nothing. A reassign service call, success/error feedback, clearing the selection and refreshing the data (the `lcData.ts` cache has no invalidate function) are still needed.
2. **Reason is lost.** `DestinationPolicy` passes `reason` to `onProceed`, but `index.tsx` ignores it; the bulk modal uses its own default reason.
3. **Selection mismatch.** Selection survives filter changes, but the bulk list is built from the currently filtered rows, so the button count and modal list can differ.
4. **Same-LC target in bulk mode** is not prevented.
5. **Stale "From LC".** Changing Province in Step 1 does not clear the chosen LC (the filter has no `dependencyAttr`).
6. **"Showing N assigned participant(s)"** shows the page row count, not the filtered total.
7. **Limits:** LCs are capped at 100 (admin) and participants at 500 per LC; `tenant_code` is hardcoded to `brac` in `lcData.ts` and `assignUsersService.ts`.
8. **Performance:** one request per LC; the supervisor picker with a chosen target LC can issue many requests.
9. **Translations:** only `en.json` was updated; `hi.json`, `es.json`, `ar.json` have not been checked.
10. **Search:** the placeholder says "Name, email, or ID" but only the name is matched.
11. **Code quality:** duplicated helpers (`norm`, `labelOf`, `toOptions`, `PAR-` id format) across three files, the province/site hook running three times, derived data kept in state, and unused style entries.
12. **Label-based matching** of province/site can mis-match records with identical names. Whether account-search rows return `province.label` for LCs was not verified.

### Backend (not yet implemented)
1. A reassign operation in **project-service** that, for the given participants: validates the caller's role and scope; validates participants and source/destination LCs; removes the participant from the old LC's `entities`; adds it to the new LC **keeping its existing status and entity data**; updates the participant's `hierarchy` (LC and supervisor levels); recalculates both LCs' `overview`; and returns a per-participant result.
2. Atomic behaviour (transaction or compensating rollback) and safe handling of partial failure.
3. Reassignment history/audit record (who, when, from, to, reason) — activity logging currently exists only as a stub.
4. Role and ownership checks (no check was found in the existing assign path).
5. A route entry in **interface-service** if a new endpoint is added.
6. Verification of how pending change requests, project records (`userProjects`), and the reporting service behave after a participant moves to another LC — these were **not verified**.

### Unverified
- Exact province/site list endpoints (`getProvincesList`, `getSitesByProvince`).
- Whether the user-service account search returns province/site labels on LC records.
- Collection name for `programUsers` (follows the model name; not confirmed against a database).
- Behaviour of the reporting/dashboard service.
