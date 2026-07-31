# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
This repository is a **static marketing website** for "AIRE SYSTEM" (Spanish-language, El Salvador HVAC / electrical / video-surveillance company). It is plain HTML/CSS/JS with no build step, no package manager, and no dependencies:
- `index.html` — single-page site markup
- `styles.css` — styles
- `script.js` — vanilla JS (nav toggle, project gallery modal, scroll reveal, contact-form client-side validation)
- `*.jpg` / `*.png` — hero and project gallery images

### Running the site (development)
There is no framework or build. Serve the folder over HTTP from the repo root (opening `index.html` via `file://` breaks relative asset paths and some behaviors). Any static server works, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Both `python3` and `node` are available on the VM.

### Testing / lint / build
- **Build:** none (static files).
- **Lint:** no lint config or tooling is committed.
- **Automated tests:** none exist.
- Verify changes manually in the browser: homepage renders, the project gallery cards under "Proyectos" open a modal with working prev/next navigation, and the "Contacto" form validates fields and shows the success message on submit.
