# Translations

Help translate the app into your language. No build step. Just edit files.

Languages already included: 🇩🇪 de, 🇬🇧 en, 🇪🇸 es, 🇫🇷 fr, 🇭🇺 hu, 🇮🇹 it, 🇵🇹 pt.

## Add a new language

Example: Dutch (`nl`).

**1. Register it.** In `js/i18n.js`, add one line to `LOCALES` with the locale code and its flag emoji. Keep the list alphabetical by code:

```js
export const LOCALES = {
  de: "🇩🇪",
  en: "🇬🇧",
  // ...
  nl: "🇳🇱",
  pt: "🇵🇹",
};
```

That alone adds it to the dropdown.

**2. Add the UI strings.** Copy `i18n/en/general.js` to `i18n/nl/general.js`. Translate every value on the right. Keep the keys and any `{placeholders}` unchanged.

```js
home: {
  start: "Empezar",   // translate the value, not the key
}
```

**3. Add the phase content.** Each phase has its own file: `intro.js`, `meeting.js`, `dating.js`, `keeping.js`. The English source for these lives in `js/phases/*.js`, not under `i18n/`, so copy an existing locale instead. Use `i18n/pt/<phase>.js` as the template (e.g. `i18n/pt/keeping.js` → `i18n/nl/keeping.js`) and translate the values. Each file exports an object keyed by step id with a translated `title`, `description`, and `extra.tips`, plus top-level `cardTitle` and `title`. Any file or key you skip falls back to the English baked into `js/phases/*.js`, so you can translate the phases incrementally without breaking anything.

**4. Cache it offline.** In `service-worker.js`, add your files to the `ASSETS` list:

```js
"./i18n/nl/general.js",
"./i18n/nl/intro.js",
"./i18n/nl/meeting.js",
"./i18n/nl/dating.js",
"./i18n/nl/keeping.js",
```

Done. Run `npm run dev`, open the app, pick your flag.

## Fix or improve a language

Edit the values in `i18n/<code>/general.js` (e.g. `i18n/pt/general.js`) for the UI, and in the phase files (`i18n/<code>/intro.js`, `meeting.js`, `dating.js`, `keeping.js`) for the step content. That's it.

## Rules

- Translate values, never keys.
- Leave `{count}`, `{step}`, `{total}` and other `{...}` placeholders in place.
- `_one` / `_other` keys are plural forms. Translate both.
- Untranslated keys fall back to showing `{the.key}`, so nothing breaks if you miss one.

## Test it

```bash
npm test
```
