
#### Major issues I identified

1. Everything was in a single monolithic Python file, which made it hard to read, maintain, or scale.
2. Passwords were being stored as plain text — a major security risk.
3. No input validation or error handling, which could easily break things or expose vulnerabilities.
4. The API response structure was inconsistent and sometimes raw strings were being returned.

---

#### Changes I made and why

1. Rebuilt the project in Node.js and Express since I’m more comfortable with that stack, and it helped move faster.
2. Modularized the backend into separate folders: `routes`, `controllers`, `middleware`, and `db` to improve clarity and maintainability.
3. Introduced password hashing using `bcrypt` and used parameterized queries with `sqlite3` to improve security.
4. Added basic validations using `express-validator` to catch bad inputs early.
5. Updated all API routes to return consistent JSON responses and proper HTTP status codes.

---

#### Assumptions or trade-offs

1. Assumed SQLite would remain the database of choice since the original code used it — didn’t migrate to something like Postgres.
2. Login was implemented in a basic way without JWT or session handling, under the assumption that full auth wasn't required for this task.
3. Left out unit testing due to time constraints but structured the code to support it easily.

---

#### What I would do with more time

1. Add proper authentication with JWT tokens and route protection.
2. Write test cases for critical routes and controller logic.
3. Build a lightweight frontend to make the API easier to test or demo.
4. Improve logging and add dotenv-based environment configuration.

---

I also used AI briefly to cross-check error handling patterns and common mistakes, but the refactor was fully written and reviewed manually.

