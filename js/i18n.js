// Lightweight i18n runtime. Locale is picked once at boot (saved override >
// navigator.language > "en"); strings live under i18n/<locale>/<namespace>.js
// and are flattened into a single dot-path dict for fast lookup.

// Single source of truth for languages. Each entry maps a locale code to the
// flag emoji shown in the dropdown. Add a language here (plus its
// i18n/<code>/*.js files) and it appears everywhere automatically. Keep the
// list alphabetical by code. English (DEFAULT) is the fallback locale.
export const LOCALES = {
  de: "🇩🇪",
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  hu: "🇭🇺",
  it: "🇮🇹",
  pt: "🇵🇹",
};
const SUPPORTED = Object.keys(LOCALES);
const STORAGE_KEY = "locale";
const DEFAULT = "en";
const NAMESPACES = ["general", "intro", "meeting", "dating", "keeping", "credits", "install"];

let current = pickInitialLocale();
let dict = {};
const listeners = new Set();

function pickInitialLocale() {
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
  if (SUPPORTED.includes(saved)) return saved;
  const nav = (navigator.language || DEFAULT).slice(0, 2).toLowerCase();
  return SUPPORTED.includes(nav) ? nav : DEFAULT;
}

async function loadDict(loc) {
  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => {
      try {
        const mod = await import(`../i18n/${loc}/${ns}.js`);
        return [ns, mod.default || {}];
      } catch (_) {
        return [ns, {}];
      }
    }),
  );
  const tree = Object.fromEntries(entries);
  return flatten(tree);
}

function flatten(obj, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      out[key] = v;
    }
  }
  return out;
}

export async function initI18n() {
  dict = await loadDict(current);
  document.documentElement.setAttribute("lang", current);
  applyDom();
}

export function t(key, vars) {
  let s = dict[key];
  if (s === undefined) return `{${key}}`;
  if (vars) {
    s = s.replace(/\{(\w+)\}/g, (_, name) =>
      vars[name] !== undefined ? vars[name] : `{${name}}`,
    );
  }
  return s;
}

// English-style cardinal pluralisation. Good enough until a locale needs more.
export function tPlural(baseKey, count, vars) {
  const suffix = count === 1 ? "_one" : "_other";
  return t(baseKey + suffix, { count, ...(vars || {}) });
}

export function getLocale() {
  return current;
}

export function supportedLocales() {
  return SUPPORTED.slice();
}

export function localeFlag(loc) {
  return LOCALES[loc] || loc;
}

export async function setLocale(loc) {
  if (!SUPPORTED.includes(loc) || loc === current) return;
  current = loc;
  try { localStorage.setItem(STORAGE_KEY, loc); } catch (_) {}
  dict = await loadDict(loc);
  document.documentElement.setAttribute("lang", loc);
  applyDom();
  listeners.forEach((fn) => fn(loc));
}

export function onLocaleChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Apply i18n to any subtree — text via data-i18n, aria-label via data-i18n-aria,
// title attr via data-i18n-title. Call on the live DOM at boot, and on each
// cloned <template> fragment before insertion (see tpl() in app.js).
export function applyDom(root) {
  const scope = root || document;
  const queryAll = (sel) =>
    scope.querySelectorAll ? scope.querySelectorAll(sel) : [];
  queryAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  queryAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });
  queryAll("[data-i18n-title]").forEach((el) => {
    el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
  });
}
