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
DB_HOST=your_domain
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
PORT=3001
ACCESS_TOKEN_EXPIRES=1h
JWT_ISSUER=issuer-example
JWT_AUDIENCE=audience-example
```

Notes:
- `.env` is ignored by Git, so your local credentials are not committed.
- Adjust `PORT`, `ACCESS_TOKEN_EXPIRES`, `JWT_ISSUER`, and `JWT_AUDIENCE` as needed for your environment.
3. Start the server:
	- `npm run dev` (watch mode)
	- or `npm start`

The API runs on the port specified in your `.env` file (default: `3001`).

---

## Endpoints
- `GET /health`
- `GET /api/users?limit=25`
- `POST /api/users`

### Example `POST /api/users` body
```json
{
  "email": "john@example.com",
  "username": "John",
  "password": "secret-password"
}
```

Password hashing is handled in `src/auth/passwordHasher.js` before the user is saved.

---

## Database Expectations
Current repository queries expect:
- Database: value from `.env` as `DB_NAME`
- Table: `users`
- Columns: `id`, `email`, `username`, `password`, `color_palette`, `played_games`, `wins`, `created_at`, `updated_at`

---

## Notes
- `.env` is ignored by Git, so environment variables are not committed.
- Database migrations are managed via Knex. Run `npx knex migrate:latest` to set up the database schema.