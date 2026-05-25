# FPSTrisAPIServer

REST API server for the FPSTris game.

## Overview

This repository contains a Node.js/Express API server that connects to a MySQL database and issues JWT access tokens. The server is organized in a layered architecture:

- Routes: HTTP endpoints
- Controllers: request/response orchestration
- Services: business logic and validation
- Repositories: database queries
- DB client: shared MySQL connection pool

Request flow:
- `/api/users` route -> controller -> service -> repository -> MySQL

---

## Threat Mitigation

### Bedreiging #90: SQL Injection Risico
- STRIDE-categorie: Elevation of Privilege
- Mitigatie: Gebruik van prepared statements met `mysql2` om SQL-injectie te voorkomen.
- Codebestand: `src/repositories/userRepository.js`
- Toelichting: In plaats van directe string concatenation in SQL-queries, worden parameterized queries gebruikt. Dit zorgt ervoor dat gebruikersinvoer altijd als data wordt behandeld en nooit als onderdeel van de SQL-syntaxis. De `mysql2`-library ondersteunt prepared statements, wat de veiligheid van database-operaties verbetert.

#### Voorbeeldcode:
```javascript
// Veilige implementatie met prepared statements
const [insertResult] = await pool.execute(
  'INSERT INTO `user` (voornaam, achternaam) VALUES (?, ?);',
  [voornaam, achternaam]
);
```
- hoe werkt dit: De `?`-placeholders in de query worden vervangen door de waarden in de array `[voornaam, achternaam]`, maar dit gebeurt op een veilige manier waar de waardes direct als waardes worden gelezen en niet als onderdeel van de querry dmv. string concatenation . Hierdoor kunnen er geen escape karakter gebruikt worden die de mogelijkheid zouden kunnen bieden tot SQL injectie.

---

## Setup
1. Install dependencies:
    - `npm install`
2. Create a `.env` file in the root directory:
    - Copy the environment variables below and replace with your own values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=fpstris_user
DB_PASSWORD=SuperSecretPassword
DB_NAME=fpstris_db
PORT=3001
ACCESS_TOKEN_EXPIRES=1h
JWT_ISSUER=issuer-example
JWT_AUDIENCE=audience-example
```

Notes:
- `.env` is ignored by Git, so your local credentials are not committed.
- Adjust `PORT`, `ACCESS_TOKEN_EXPIRES`, `JWT_ISSUER`, and `JWT_AUDIENCE` as needed for your environment.
3. Create the database referenced by `DB_NAME` using your preferred MySQL client or administration tool. **important! this application uses a MySQL database.**
4. Run the Knex migrations to create the schema:
    - `npx knex migrate:latest`
5. (Optional) Seed initial data:
    - `npx knex seed:run`
6. Start the server:
    - `npm run dev` (watch mode)
    - or `npm start`

The server reads `PORT` from `.env` and starts on that port.

## API Endpoints

- `GET /health` - health check
- `GET /api/users?limit=25` - list users with optional `limit`
- `POST /api/users` - create a new user

### Example `POST /api/users`

```json
{
  "email": "john@example.com",
  "username": "John",
  "password": "secret-password"
}
```

## Notes on JWT and Auth

- JWT signing is handled in `src/auth/jwtService.js`.
- Keys are generated and rotated in `src/auth/jwtKeyManager.js`.
- JWT token settings depend on `ACCESS_TOKEN_EXPIRES`, `JWT_ISSUER`, and `JWT_AUDIENCE`.

## Database Configuration

Knex reads MySQL connection values from the same `.env` file in `knexfile.js`.

Expected database connection values:

- `DB_HOST` for host
- `DB_PORT` for port
- `DB_USER` for user
- `DB_PASSWORD` for password
- `DB_NAME` for database name

## Useful Scripts

- `npm install` - install dependencies
- `npm start` - start server normally

## Recommended Workflow

1. Create `.env` with required values.
2. Install dependencies.
3. Run `npx knex migrate:latest`.
4. Run `npm start`.
5. Call the API at `http://localhost:<PORT>`.
