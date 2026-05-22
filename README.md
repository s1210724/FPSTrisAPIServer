# FPSTrisAPIServer

REST API server for the FPSTris game.

## Overview

This repository contains a Node.js/Express API server that connects to a MySQL database and issues JWT access tokens. The server is organized in a layered architecture:

- Routes: HTTP endpoints
- Controllers: request/response orchestration
- Services: business logic and validation
- Repositories: database queries
- DB client: shared MySQL connection pool

## Prerequisites

- Node.js 18+ installed
- MySQL server available
- `npm` available
- A database user with privileges to connect, create, and read/write the target schema

## Install

1. Open a terminal in the project root.
2. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root with the variables listed below.

### Required environment variables

- `DB_HOST` - MySQL host name or IP address.
- `DB_USER` - MySQL username.
- `DB_PASSWORD` - MySQL password.
- `DB_NAME` - MySQL database name.
- `PORT` - Port for the Express server to listen on.
- `ACCESS_TOKEN_EXPIRES` - JWT expiration duration, e.g. `1h` or `30m`.
- `JWT_ISSUER` - JWT issuer string used when signing tokens.
- `JWT_AUDIENCE` - JWT audience string used when signing tokens.

### Optional environment variables

- `DB_PORT` - MySQL port. If omitted, the MySQL client will use the default port `3306`.

### Example `.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=fpstris_user
DB_PASSWORD=SuperSecretPassword
DB_NAME=fpstris_db
PORT=3001
ACCESS_TOKEN_EXPIRES=1h
JWT_ISSUER=fpstris-api
JWT_AUDIENCE=fpstris-clients
```

> Keep `.env` outside source control. This repository already ignores `.env`.

## Database Setup

This project uses Knex for migrations and seeds. After setting your `.env` values, run:

```bash
npx knex migrate:latest
```

If you want to populate seed data, run:

```bash
npx knex seed:run
```

## Run the Server

- Start the server:

```bash
npm start
```

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
