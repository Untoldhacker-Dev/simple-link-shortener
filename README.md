
# Deploy
<a href="https://pages.adityakp.dev/deploy/github?repo=https://github.com/Untoldhacker-Dev/simple-link-shortener">
  <img src="https://hostpanel.adityakp.dev/deploy_button.jpg" alt="Deploy to adityakp.dev Pages" height="44">
</a>

## What it does
This project is a modified copy of template for the same at [adityakp.dev Pages](https://pages.adityakp.dev), it has simple shortlink creation mechanism and does not contain features like stats, ads, custom UI page, captcha etc, for these advanced features use Pro URL Shortener template by AP. This template is supposed to be lightweight.

This project lets you create short links such as `/go/my-link` that redirect visitors to a longer destination URL. It also provides:

- a public landing page that lists public links
- an admin page for signing in and managing links
- click tracking (counts only) for each short link
- optional public/private visibility for links

## How it works

1. The main page loads the frontend UI from `index.html`.
2. The frontend calls the API to load site settings and the list of public links.
3. Requests to `/go/<slug>` are handled by the redirect endpoint, which looks up the slug, increments the click count, and sends a `301` redirect to the target URL.
4. The admin UI loads from `admin.html` and uses the API to log in, add links, and delete links.
5. Link data and settings are stored through the runtime's disk-backed storage, with configuration read from `config.db_.json`.

> NOTE: db_.json files are automatically endpoint protected by adityakp.dev Pages, do not rename such files unless you want your secrets to get leaked.

## Main files

- `index.endpoint.js` - serves the public homepage
- `admin.endpoint.js` - serves the admin page
- `api.endpoint.js` - handles login, public data, and link management actions
- `go.endpoint.js` - redirects short slugs to destination URLs
- `config.js` - reads configuration values from `config.db_.json`
- `index.html` and `admin.html` - the public and admin web interfaces

## Configuration

Configure your app by editing `config.db_.json`:

```json
{
  "site_title": "Short Links",
  "accent": "#6366f1",
  "mode": "public",
  "admin_password": "changeme"
}
```

### Available settings

| Setting | Default | Description |
|---------|---------|-------------|
| `site_title` | "Short Links" | The name of your shortlink service (displayed in header and footer) |
| `accent` | "#6366f1" | Hex color used for buttons, links, and branding elements |
| `mode` | "public" | Display mode (currently for frontend styling context) |
| `admin_password` | "changeme" | Password required to access the admin panel and manage links |

> **Warning:** This particular code is compatible with adityakp.dev Pages (pages.adityakp.dev) only, click the button below to deploy it directly on your domain using Pages.

