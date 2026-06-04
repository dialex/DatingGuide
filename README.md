# Something Dating

A PWA based on Adam Something's dating guide. Step-by-step mobile workflow navigator, installable on Android and iOS.

## Setup

After cloning, install dependencies and browsers:

```bash
npm install
npm run test:install
npm run skills:install
```

## Development

Start a local server (required for service workers to work):

```bash
npm run dev
```

Then open http://localhost:3000/SomethingDating/ in your browser.

> Use `localhost`, not `file://` — service workers require either `localhost` or HTTPS.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Local dev server at port 3000 |
| `npm test` | Run all Playwright tests |
| `npm run test:ui` | Run tests with interactive UI |
| `npm run test:install` | Install Playwright browser binaries |
| `npm run skills:install` | Restore AI skills from `skills-lock.json` |
| `npm run skills:update` | Update skills to latest versions |
| `npm run audit` | Lighthouse PWA audit (requires `npm run dev` running) |

## Translations

Want to add or fix a language? See [TRANSLATIONS.md](TRANSLATIONS.md).

## Deploy

Pushes to `main` auto-deploy to GitHub Pages via GitHub Actions.

## Project structure

```
├── index.html              # HTML structure only
├── css/
│   └── styles.css          # All visual styles
├── js/
│   ├── workflow.js         # Workflow data (steps array)
│   ├── install.js          # Install banner and modal logic
│   └── app.js              # App logic + entry point
├── tests/
│   └── app.spec.js         # Playwright end-to-end tests
├── playwright.config.js
├── package.json
├── skills-lock.json        # Installed Claude Code skills
└── .github/
    └── workflows/
        └── deploy.yml      # Auto-deploy to GitHub Pages
```
