# NIFA

The NIFA website is a static portfolio for Niyyah, PaperOS, Wrong Turn, and
QuietDude. It is built with HTML, CSS, and vanilla JavaScript; no build step or
package installation is required.

## Preview locally

From the project directory, run:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Project structure

- `index.html` — NIFA homepage
- `about/` — information about NIFA
- `contact/` — contact page
- `products/` — portfolio and individual product pages
- `assets/` — shared styles, scripts, and favicon

PaperOS is a proprietary NIFA product and will not be released as open-source
software. Product features and availability are described on its product page
as they are confirmed.

## Deploy with Cloudflare

This is configured as a Workers Static Assets site. In Cloudflare Workers
Builds, use `/` as the root directory, leave the build command empty, and use
`npx wrangler deploy` as the deploy command. The root `wrangler.jsonc` file
publishes the static site files.
