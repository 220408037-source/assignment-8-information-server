# Assignment 8 – Ada Study Programme Information Server

A small Node.js and Express 5 server with sample API routes, request middleware, a static browser page, and a 404 fallback.

## Requirements

- Node.js current LTS (Node.js 20 or newer recommended)
- npm

## Installation and running

1. Clone or download this repository.
2. Open a terminal in the project folder.
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. Open `http://localhost:3000` in a browser.

For automatic restart when a server file changes, use `npm run dev` (Node's built-in `--watch` option; no nodemon dependency).

The server reads its port from `process.env.PORT`. If it is not set, it uses port `3000`.

## File organization

```text
assignment-8/
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── collect-evidence.ps1
└── server.js
```

## Routes

| Method | Path | Expected result |
|---|---|---|
| GET | `/` | Serves `public/index.html` |
| GET | `/hello` | Plain-text greeting |
| GET | `/robots.txt` | Plain-text robots file |
| GET | `/old-page` | HTTP 301 redirect to `/hello` |
| GET | `/api/courses` | JSON array containing three courses |
| GET | `/api/status` | JSON status, current Node.js process ID, and actual uptime |
| GET | `/api/headers` | JSON containing request User-Agent and Accept headers |
| POST | `/api/subscribe` | HTTP 201 and `{ "subscribed": true }` |
| GET | `/api/admin` | HTTP 403 and `{ "error": "Forbidden" }` |
| GET | `/api/stats` | JSON containing the request counter |
| Other `/api/...` | Any unmatched API method/path | HTTP 404 JSON error |
| Other paths | Any unmatched non-API path | HTTP 404 HTML page |

## Middleware and request counting

Two middleware functions are registered before static files and routes:

1. **Request logger:** prints an ISO timestamp, HTTP method, and original URL for every incoming request.
2. **Request counter:** increments `requestCount` once for every request reaching the application.

Both middleware functions call `next()` so the request can continue. The counter includes requests for static files, API routes, redirects, and requests that end in a 404. The `/api/stats` request itself is counted before its handler reads the counter, so its returned value includes that request.

The logger is placed before the counter so each request is logged before the counter is incremented. Both are placed before `express.static` so static-file requests are also logged and counted. The 404 fallback is last so it only handles requests that did not match a static file or a real route.

## curl testing evidence

The following six tests are required evidence. Run them on the same computer where the server is running. On Windows PowerShell, use `curl.exe` (not the `curl` alias) so the real cURL program prints the HTTP status line and response headers. You can run `./collect-evidence.ps1` from the project folder to execute all six commands and save their actual output to `CURL_EVIDENCE.txt`. The six actual response blocks captured during testing on 16 November 2026 are recorded below. Dynamic headers such as dates and ETags can differ on later runs.

```powershell
curl.exe -i http://localhost:3000/api/courses
curl.exe -i -X POST http://localhost:3000/api/subscribe
curl.exe -i http://localhost:3000/api/admin
curl.exe -i http://localhost:3000/old-page
curl.exe -i http://localhost:3000/api/not-found
curl.exe -i http://localhost:3000/this-page-does-not-exist
```

These are the actual terminal outputs captured while the server was running. Status lines, response headers, and response bodies are preserved as evidence.

### 1. Successful JSON response — expected 200

Command: `curl.exe -i http://localhost:3000/api/courses`

```text
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 187
ETag: W/"bb-BMXwcR0M2e0xldgdxIzbh8ONZU4"
Date: Mon, 16 Nov 2026 17:13:02 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"title":"Introduction to Web Development","credits":5},{"id":2,"title":"Programming with JavaScript","credits":6},{"id":3,"title":"Backend Development Fundamentals","credits":5}]
```

### 2. Created response — expected 201

Command: `curl.exe -i -X POST http://localhost:3000/api/subscribe`

```text
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 19
ETag: W/"13-oWAPIqDXuocNexKhPYW9ayyk98c"
Date: Mon, 16 Nov 2026 17:13:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"subscribed":true}
```

### 3. Forbidden response — expected 403

Command: `curl.exe -i http://localhost:3000/api/admin`

```text
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-TLNzmZqKxaTuFdX/dVWWPBu44/c"
Date: Mon, 16 Nov 2026 17:13:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Forbidden"}
```

### 4. Redirect response — expected 301

Command: `curl.exe -i http://localhost:3000/old-page`

```text
HTTP/1.1 301 Moved Permanently
X-Powered-By: Express
Location: /hello
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 40
Date: Mon, 16 Nov 2026 17:13:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Moved Permanently. Redirecting to /hello
```

Check that the response contains `Location: /hello`. Do not add `-L` to this evidence command because the assignment asks to show the redirect response itself.

### 5. API not-found response — expected 404 JSON

Command: `curl.exe -i http://localhost:3000/api/not-found`

```text
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-bm7tJgu8FHlq5QU+Y6gDxOGPfRc"
Date: Mon, 16 Nov 2026 17:13:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Not found"}
```

### 6. Non-API not-found response — expected 404 HTML

Command: `curl.exe -i http://localhost:3000/this-page-does-not-exist`

```text
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 212
ETag: W/"d4-j2UXNDzWbmtWQN890iemFGUFTtk"
Date: Mon, 16 Nov 2026 17:13:05 GMT
Connection: keep-alive
Keep-Alive: timeout=5

<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Page not found</title></head><body><h1>404 - Page not found</h1><p>The requested page does not exist.</p><a href="/">Return home</a></body></html>
```

Additional useful checks:

```powershell
curl.exe -i http://localhost:3000/hello
curl.exe -i http://localhost:3000/robots.txt
curl.exe -i http://localhost:3000/api/status
curl.exe -i http://localhost:3000/api/headers
curl.exe -i http://localhost:3000/api/stats
```

## README reasoning questions

### 1. Route order – what happens if the 404 fallback is moved to the top?

The fallback middleware receives the request before the actual route handlers. It sends a 404 response immediately, so a valid route such as `/api/courses` never gets a chance to run. The fallback must therefore be registered after all routes and static-file handling.

### 2. Middleware – what happens if `next()` is removed from the logger?

The logger prints its line, but it does not pass control to the next middleware or route. The browser request remains pending because no later handler sends a response. The server terminal shows the log line, but the browser does not receive the expected page or API result.

### 3. Status codes – why should POST `/api/subscribe` return 201 rather than 200? Why is a missing page 404?

The subscribe endpoint reports that a subscription resource/action was successfully created, so `201 Created` communicates that outcome more precisely than the general success code `200 OK`. A missing route or page has no matching resource, so `404 Not Found` is the appropriate response rather than a successful status with an error message.

### 4. Configuration – why read the port from `process.env.PORT` instead of always using 3000?

The environment variable lets the same application use the port assigned by a hosting platform or deployment environment. The fallback to `3000` makes local development convenient when no environment variable is configured.

### 5. Dependencies – why is `node_modules` not committed, and what must a teammate do after cloning?

`node_modules` contains installed packages and can be recreated from the dependency declarations, so committing it makes the repository unnecessarily large and platform-dependent. A teammate should run `npm install` after cloning; npm reads `package.json` and `package-lock.json` and installs the declared dependency versions.

### 6. Same origin – what changes if the page is opened directly from disk?

When the page is served from `http://localhost:3000`, its relative `fetch('/api/...')` requests go to the same server origin. If the HTML file is opened directly from disk, it has a `file://` origin, so relative API requests do not reach the Express server as intended. The page must be opened through the server at `http://localhost:3000`.

## Self-study research and how it was applied

The following official documentation was consulted while implementing the server:

- **Node.js Process API:** <https://nodejs.org/api/process.html> explains `process.env` and `process.uptime()`. The server reads `process.env.PORT` and uses `process.uptime()` for the live uptime value. The `process.pid` property identifies the running Node.js process in `/api/status`.
- **Express middleware guide:** <https://expressjs.com/en/guide/using-middleware/> explains that middleware receives `req`, `res`, and `next`, and that `next()` passes control to the next middleware when the current one does not send a response. Both custom middleware functions call `next()`.
- **Express 5 response API:** <https://expressjs.com/en/5x/api/response/> documents `res.json()` and `res.redirect()`. The project uses `res.status(201).json(...)` for the subscription response and `res.redirect(301, '/hello')` for the old-page route.
- **Express static files:** <https://expressjs.com/en/5x/api.html#express.static> describes `express.static()` for serving assets. The project serves the `public/` directory and resolves its path relative to `server.js`, so starting the server from another working directory does not break the static page.

`res.type('text/plain')` is used for the robots response so its content type is plain text. `res.json(...)` sends JSON and sets the JSON content type. The browser uses `fetch()` and checks the response content type before parsing JSON or displaying text/HTML, which lets it display error responses without crashing.

## Challenges and final checks

- The request counter is in-memory, so it resets whenever the server restarts; no database or persistence is used.
- The browser must be opened through the Express server, not by double-clicking `index.html`.
- Before submission, run `npm install`, `npm start`, and test all routes. The six required real `curl -i` responses are recorded in the testing-evidence section above.
- Do not commit `node_modules` or `.env`.

The static directory is resolved relative to `server.js` using the module file path. This means the server can be started while the terminal is in a different working directory.
