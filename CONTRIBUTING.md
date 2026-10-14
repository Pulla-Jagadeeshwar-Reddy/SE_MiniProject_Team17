# How we work

## 1. One branch per issue
```bash
git checkout main
git pull
git checkout -b feature/<issue-number>-<short-name>    # e.g. feature/13-question-creation
```
Never commit directly to `main`.

## 2. Pull requests
- The person assigned to the issue opens the PR.
- Write `Closes #<issue>` in the description so the issue closes on merge.
- Fill in the PR template (requirements, tests, deviations).
- **CI must be green** (server tests + client build) before merging.
- The repo owner reviews and merges.
- Move the card on the project board: *In Progress* when you start, *Done* after merge.

## 3. API conventions (from the SAD)
- All endpoints start with `/api` (SAD 4.3). Mount your router in `server/src/routes/index.js`.
- Route order: `authenticate` → `requireRole(...)` → validation rules → `validate` → controller.
- Controllers stay thin; business rules go in `services/`; only `models/` talk to MongoDB.
- Errors: `throw AppError.validation(field, message)`, `AppError.accessDenied()`, `AppError.notFound()`, etc.
  Every error response looks like:
  ```json
  { "error": { "code": "VALIDATION_ERROR", "message": "Title must be at most 100 characters", "field": "title" } }
  ```
  Codes: `VALIDATION_ERROR` 400, `NOT_AUTHENTICATED` 401, `ACCESS_DENIED` 403, `NOT_FOUND` 404,
  `ALREADY_ATTEMPTED` / `ALREADY_SUBMITTED` / `ALREADY_MEMBER` 409, `TIME_EXPIRED` 410,
  `ACCOUNT_LOCKED` 423, `RATE_LIMITED` 429, `INTERNAL_ERROR` 500.

## 4. Logged-in user
- After `authenticate`, every handler has `req.user = { id, role }`.
- Roles are exactly `'Student'`, `'Faculty'`, `'Admin'` – use `server/src/config/roles.js` (server) and `client/src/roles.js` (client).
- `authenticate` is currently a temporary JWT check. **#5** replaces its body with the full session check; the name and `req.user` shape stay the same.
- Token payload: `{ sub: <userId>, role: <role> }`.

## 5. Frontend
- Call the API through `client/src/api/client.js` (adds the token, handles 401).
- Show errors next to fields with `<FieldError message={...} />` and `apiError(err)`.
- Protect pages with `<ProtectedRoute roles={[ROLES.FACULTY]} />` in `App.jsx`.
- Add your menu link in `components/Navbar.jsx` with the roles that may see it.

## 6. Tests
- Put tests in `server/tests/<module>.test.js`.
- Use `tests/helpers/db.js` (`startDB`, `clearDB`, `stopDB`) for tests that need MongoDB.
- Use `tests/helpers/auth.js` (`tokenFor('Faculty')`) to call protected routes.
- Name test blocks after the STP case IDs (e.g. `TC-QB-01`) so they trace back to the test plan.

## 7. Deviations
If you have to do something differently from the SRS/SAD/STP, write it in your PR under "Deviations" – we need them for the final demo.
