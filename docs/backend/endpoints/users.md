# Users endpoints

Prefix `/users`. Back to [README.md](README.md).

Staff account management. All endpoints require a Bearer token.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/` | 🔒 | List all users (no passwords). |
| GET | `/users/me` | 🔒 | Current authenticated user. |
| GET | `/users/{user_id}` | 🔒 | Get one. |
| PUT | `/users/{user_id}` | 🔒 | Update a user (role, username, etc.). |
| DELETE | `/users/{user_id}` | 🔒 | Delete a user. |

## Notes

- The authenticated user calls `/me` immediately after login in `frontend/src/services/authService.js` to hydrate the session.
- Passwords are never returned in any response.
- Role updates and deletes should be restricted to `admin` (currently enforced by frontend guard; full backend role-check is a future task).

See [../user-credentials.md](../user-credentials.md) for the user shape, integrity rules and bootstrap path.
