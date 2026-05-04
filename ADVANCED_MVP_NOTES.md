# Advanced MVP Additions

## 1. Database-driven content seed

The backend now includes a reusable content database table:

- `content_items.kind`
- `content_items.slug`
- `content_items.title`
- `content_items.payload`

This supports database-backed products, courses, beauty services, community posts, ingredients, and future CMS-style content.

Seed demo content:

```powershell
python seed_demo_content.py
```

Or call the API directly:

```http
POST http://127.0.0.1:8000/api/v1/seed-demo-content
```

Read seeded content:

```http
GET http://127.0.0.1:8000/api/v1/content/product
GET http://127.0.0.1:8000/api/v1/content/course
GET http://127.0.0.1:8000/api/v1/content/beauty_service
GET http://127.0.0.1:8000/api/v1/content/community_post
```

## 2. User-isolated skin analysis records

The frontend skin analysis API reads the logged-in user's `auth_email` cookie and sends it to the backend as `userId`.

This means skin measurements are stored per user instead of being saved under one shared demo account.

The backend also stores lightweight user profiles in `user_profiles`:

- `email`
- `full_name`
- `skin_type`
- `main_concerns`

Login and registration sync a profile to:

```http
POST /api/v1/users/profile
```

User-scoped record lookup:

```http
GET /api/measurements
```

This frontend route reads the current auth cookie and proxies to:

```http
GET /api/v1/measurements?user_id=<current-user-email>
```

## 3. Docker one-command deployment

Run both frontend and backend:

```powershell
docker compose up --build
```

Services:

- Frontend: `http://127.0.0.1:3000`
- Backend: `http://127.0.0.1:8000`
- Backend health: `http://127.0.0.1:8000/health`

The backend uses a Docker volume for persistent SQLite storage at `/data/skin_backend.db`.
