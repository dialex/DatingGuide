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

**2. Add the strings.** Copy `i18n/en/general.js` to `i18n/nl/general.js`. Translate every value on the right. Keep the keys and any `{placeholders}` unchanged.

```js
home: {
  start: "Empezar",   // translate the value, not the key
}
```

**3. Cache it offline.** In `service-worker.js`, add your file to the `ASSETS` list:

```js
"./i18n/nl/general.js",
```

Done. Run `npm run dev`, open the app, pick your flag.

## Fix or improve a language

Edit the values in `i18n/<code>/general.js` (e.g. `i18n/pt/general.js`). That's it.

## Rules

- Translate values, never keys.
- Leave `{count}`, `{step}`, `{total}` and other `{...}` placeholders in place.
- `_one` / `_other` keys are plural forms. Translate both.
- Untranslated keys fall back to showing `{the.key}`, so nothing breaks if you miss one.

## Test it

```bash
npm test
```
