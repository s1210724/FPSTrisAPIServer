# FPSTrisAPIServer
REST API server for the FPSTris game

## Stack
- Node.js
- Express
- SQL Server via `mssql`

## Design Pattern
This project uses a simple layered architecture pattern:
- Routes: define HTTP endpoints
- Controllers: handle request/response flow
- Services: business logic and validation
- Repositories: database queries
- DB client: SQL connection/pool management

## Setup
1. Install dependencies:
	- `npm install`
2. Set database credentials:
	- Copy `src/config/db.credentials.example.js` to `src/config/db.credentials.js`
	- Fill in your SQL login details
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
  "username": "player1",
  "email": "player1@example.com",
  "passwordHash": "hashed-password-here"
}
```

## Notes
- `src/config/db.credentials.js` is ignored by Git.
- `src/config/db.credentials.example.js` is tracked as a template.
