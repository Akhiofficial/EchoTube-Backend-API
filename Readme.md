# Pro Project — Backend API

A Node.js/Express API built while following the Chai & Code series. It provides user authentication, file uploads (avatar/cover) to Cloudinary, and JWT-based session management with refresh tokens.

## Tech Stack
- Node.js, Express.js
- MongoDB, Mongoose
- JWT, bcrypt
- Multer (file uploads), Cloudinary
- CORS, cookie-parser
- Nodemon (dev)

## Prerequisites
- Node.js 18+
- MongoDB Atlas or local MongoDB
- Cloudinary account (for image uploads)

## Getting Started

### 1) Install
```bash
git clone <repository-url>
cd Pro_project_chai_code_backend
npm install
```

### 2) Environment
Create a `.env` file at the project root:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3) Run
```bash
npm run dev
```
- Server: `http://localhost:8000`

## API Overview

Base URL: `/api/v1/users`

- POST `/register` — Register a user with avatar/optional cover image
- POST `/login` — Login with email or username and password
- POST `/logout` — Logout (requires valid access token)
- POST `/refresh-token` — Refresh access token using refresh token

Additional (secured) features implemented in controllers (route bindings may be added later):
- Change current password
- Get current user
- Update account details
- Update avatar
- Update cover image
- Get channel profile by username

## Endpoints

### Register
POST `/api/v1/users/register`
- Content-Type: `multipart/form-data`
- Fields:
  - text: `fullName` (required), `email` (required), `password` (required), `username` (required), `name` (optional), `contactNumber` (optional)
  - files: `avatar` (required, 1 file), `coverImage` (optional, 1 file)

Example (curl):
```bash
curl -X POST http://localhost:8000/api/v1/users/register \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "password=StrongPass123!" \
  -F "username=johnny" \
  -F "avatar=@./path/to/avatar.jpg" \
  -F "coverImage=@./path/to/cover.jpg"
```

### Login
POST `/api/v1/users/login`
- Body (JSON):
```json
{
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```
- or
```json
{
  "username": "johnny",
  "password": "StrongPass123!"
}
```
- Response sets `accessToken` and `refreshToken` as httpOnly cookies (and returns them in body).

### Logout
POST `/api/v1/users/logout`
- Requires valid access token (JWT in cookie).
- Clears `accessToken` and `refreshToken` cookies and removes stored refresh token.

### Refresh Access Token
POST `/api/v1/users/refresh-token`
- Send refresh token via cookie `refreshToken` or JSON body:
```json
{ "refreshToken": "<your-refresh-token>" }
```
- Returns new `accessToken` and rotated `refreshToken` (httpOnly cookies and in body).

## Testing with Postman

### Quick Setup
- Create a Postman environment with:
  - `baseUrl`: `http://localhost:8000`
- Ensure “Automatically follow redirects” and “Enable cookie management” are ON (Postman manages httpOnly cookies in its cookie jar).

### 1) Register (multipart/form-data)
- Method: POST
- URL: `{{baseUrl}}/api/v1/users/register`
- Body: form-data
  - Key: `fullName` (text)
  - Key: `email` (text)
  - Key: `password` (text)
  - Key: `username` (text)
  - Key: `avatar` (file) → choose an image
  - Key: `coverImage` (file, optional)

Tip: Ensure each file field is set to “File” type in Postman.

### 2) Login
- Method: POST
- URL: `{{baseUrl}}/api/v1/users/login`
- Body: raw → JSON:
```json
{
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```
- On success, Postman stores `accessToken` and `refreshToken` as httpOnly cookies in its cookie jar.

Optional (Tests tab) — capture tokens from JSON body (if you want them as env vars):
```js
pm.test("Saved tokens to env", function () {
  const data = pm.response.json();
  if (data?.data?.accessToken) pm.environment.set("accessToken", data.data.accessToken);
  if (data?.data?.refreshToken) pm.environment.set("refreshToken", data.data.refreshToken);
});
```

### 3) Authenticated Requests
- Since the API uses cookies, you typically don’t need an `Authorization` header.
- Verify cookies:
  - Click “Cookies” (under Send) → check `localhost` has `accessToken` and `refreshToken`.

If you prefer headers (not required here), you could add:
```
Authorization: Bearer {{accessToken}}
```
…but this codebase expects cookies.

### 4) Refresh Token
- Method: POST
- URL: `{{baseUrl}}/api/v1/users/refresh-token`
- Body: none (cookies are sufficient). Alternatively:
```json
{ "refreshToken": "{{refreshToken}}" }
```

### 5) Logout
- Method: POST
- URL: `{{baseUrl}}/api/v1/users/logout`
- Cookies must be present; Postman will send them automatically.

### Troubleshooting
- If refresh returns 404, ensure the route path includes a leading slash:
  - In `src/routes/user.routes.js` use `router.route("/refresh-token")`.
- If cookies aren’t sent:
  - Check Postman’s “Cookies” for `localhost`.
  - Make sure you’re staying on the same `baseUrl` and port.
- For HTTPS-only environments, set `secure: true` in cookie options and test over `https://`.

## Security Notes
- Cookies:
  - Login: `httpOnly: true`, `secure: false` by default in code (use `secure: true` in production with HTTPS)
  - Logout/Refresh: uses `secure: true` — set according to your environment
- CORS: `CORS_ORIGIN` defaults to `*` if not provided; lock this down for production.
- Body size limits: JSON and URL-encoded set to `10kb`.

## Project Structure
```
src/
  controllers/      # Business logic
  db/               # Database connection
  middlewears/      # Auth & Multer
  models/           # Mongoose schemas
  routes/           # Express routes
  utils/            # Helpers & services
  app.js            # Express app config
  index.js          # Server bootstrap
public/             # Static/uploads
```

## Scripts
- `npm run dev` — Start dev server with dotenv and nodemon

## Known Issues / Notes
- Route path typo: in `src/routes/user.routes.js`, `router.route("refresh-token")` is missing the leading slash. Update to:
  ```js
  router.route("/refresh-token").post(refreshAccessToken);
  ```
- Validation edge cases in controller:
  - `loginUser` query uses `$or: [{ email, username }]`; should be `$or: [{ email }, { username }]`.
  - Some checks and variable names may need small corrections for robustness in production.

## Acknowledgments
Inspired by the Chai & Code YouTube channel and built as part of a backend learning journey.