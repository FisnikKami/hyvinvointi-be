# Hyte web dev example back-end server

**Node.js + Express** application.

(Check weekly branches too.)

## Usage

1. Clone/download code
2. Run `npm i` inside project folder
3. Install & start MySQL/MariaDB server
4. Import database script(s) in `db/` folder
5. Create `.env` file based on `.env.sample`
6. Start the dev server: `npm run dev` / `npm start`

## Resources and endpoints

### `/items` (works with hard-coded mock data only, no need for db)

```http
GET http://127.0.0.1:3000/items
GET http://127.0.0.1:3000/items/:id
DELETE http://127.0.0.1:3000/items/:id

POST http://127.0.0.1:3000/items
content-type: application/json
body: {"name": "New Item"}
```

### `/api/users`

Example queries:

```http
# Get all users (requires token)
GET http://127.0.0.1:3000/users

# Get user by id (requires token)
GET http://127.0.0.1:3000/users/:id

# Delete user (requires token)
DELETE http://127.0.0.1:3000/users/:id

# Create user
POST http://127.0.0.1:3000/users
content-type: application/json

{
  "username": "test-update4",
  "password": "test-pw-update4",
  "email": "update4@example.com"
}

# Update user's own data (requires token)
PUT http://127.0.0.1:3000/users/
content-type: application/json

{
  "username": "test-update4",
  "password": "test-pw-update4",
  "email": "update4@example.com"
}

# Login
POST http://localhost:3000/api/users/login
content-type: application/json

{
  "username": "user",
  "password": "secret"
}

```

### `/api/entries`

Example queries:

```http
# Get all entries for a logged in user (requires token)
GET http://localhost:3000/api/entries

# Get entries by id
GET http://localhost:3000/api/entries/:id

# Post entry
POST http://localhost:3000/api/entries
content-type: application/json

{
  "reps" :3x3,
  "move": "penkki",
  "weight": 100kg,
}

# Update entry
PUT http://localhost:3000/api/entries/:id
content-type: application/json


# Delete entry
DELETE http://localhost:3000/api/entries/:id
```
# database overview
Tällä hetkellä käytän ainoastaan users tietokantaa ja Treeniohjelma.
