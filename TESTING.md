# Manual test checklist

Run the server with `npm start`, then test each item:

- [ ] `GET /` loads the static page.
- [ ] `GET /hello` returns plain text.
- [ ] `GET /robots.txt` returns `text/plain`.
- [ ] `GET /old-page` returns 301 and points to `/hello`.
- [ ] `GET /api/courses` returns at least three course objects as JSON.
- [ ] `GET /api/status` returns process status and uptime.
- [ ] `GET /api/headers` echoes User-Agent and Accept.
- [ ] `POST /api/subscribe` returns 201 JSON.
- [ ] `GET /api/admin` returns 403 JSON.
- [ ] `GET /api/stats` returns the running request count.
- [ ] Unknown API route returns 404 JSON.
- [ ] Unknown non-API route returns 404 HTML.

On Windows PowerShell, use `curl.exe -i` (not `curl`). Capture the actual status lines and response headers for the six evidence cases in the README before submitting. Expected results are not a substitute for actual output.

For the six required evidence cases, run `./collect-evidence.ps1` in PowerShell while the server is running. It writes the real cURL status lines, headers, and bodies to `CURL_EVIDENCE.txt`. Copy those results into the matching README sections.
