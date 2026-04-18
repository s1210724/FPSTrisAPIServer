# FPSTrisAPIServer
REST API server for the FPSTris game

## Stack
- Node.js
- Express
- MySQL via `mysql2`

## Design Pattern
This project uses a layered architecture (service-repository style):
- Routes: HTTP endpoint definitions
- Controllers: request/response orchestration
- Services: payload validation and business logic
- Repositories: SQL queries and persistence
- DB client: shared MySQL connection pool

Request flow:
- `/api/users` route -> controller -> service -> repository -> MySQL

## Setup
1. Install dependencies:
	- `npm install`
2. Create your own credentials file:
	- Create `src/config/db.credentials.js`
	- Add this general structure and replace values with your own:

```js
module.exports = {
  host: 'localhost',
  port: 3306,
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'fpstris'
};
```

Notes:
- `host` and `server` are both accepted by the DB client. Prefer `host` for MySQL.
- `src/config/` is ignored by Git, so your local credentials are not committed.
3. Start the server:
	- `npm run dev` (watch mode)
	- or `npm start`

The API runs on port `3001`.

## Endpoints
- `GET /health`
- `GET /api/users?limit=25`
- `POST /api/users`

### Example `POST /api/users` body
```json
{
  "voornaam": "John",
  "achternaam": "Doe"
}
```

Accepted aliases for create payload:
- `firstName` maps to `voornaam`
- `lastName` maps to `achternaam`

## Database Expectations
Current repository queries expect:
- Database: `fpstris` (or whatever you set in credentials)
- Table: `user`
- Columns: `id`, `voornaam`, `achternaam`

## Notes
- `src/config/` is ignored by Git.
- If tracked config files already exist in your local git history, they may still appear as tracked until removed from the index.
