# Short URL Management System

A MERN-stack URL shortener with JWT authentication and per-user link management.

## Setup

### Server

```bash
cd server
npm install
```

Create/update `server/.env`:
```
PORT=5000
DATABASE_URL=mongodb://localhost:27017/shorturldb
JWT_SECRET=your_secret_key
BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

### Client

```bash
cd client/vite-project
npm install
npm run dev
```

Client runs on `http://localhost:5173` by default.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Links (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/links` | Create a short link |
| GET | `/api/links` | Get all links for current user |
| PATCH | `/api/links/:id/toggle` | Toggle active/inactive |
| DELETE | `/api/links/:id` | Delete a link |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:shortCode` | Redirect to original URL |

---

## Assumptions

- MongoDB runs locally on default port 27017
- Short codes are 6-character nanoid strings, guaranteed unique
- `startTime` / `endTime` are optional; if omitted, the link is always accessible (when active)
- Users can only manage their own links
- Redirect returns 410 for inactive or expired links, 403 for not-yet-started links
