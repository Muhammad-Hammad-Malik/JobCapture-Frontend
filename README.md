# JobCapture Frontend

Public, read-only job board. Plain HTML/CSS/JS — no build step, no framework.

## Running locally

Serve the folder statically and open it, e.g.:

```bash
npx serve .
```

Then visit the printed local URL.

## Configuration

Edit `js/config.js` and set `API_BASE_URL` to wherever the [backend](https://github.com/Muhammad-Hammad-Malik/JobCapture-Backend) is running/deployed. It defaults to `http://localhost:3000` for local development.

## Features

- Search (title/company/description) and filters (stack, work type, experience range), synced to the URL so filtered views are shareable/bookmarkable.
- Responsive card grid with pagination, loading skeletons, and empty/error states.
- Click-through detail modal with description, contact/apply links, and a link back to the original LinkedIn post (when available).
- Only shows active (`open`, non-cleared) jobs — closing or clearing a job in the admin app removes it from here immediately.
