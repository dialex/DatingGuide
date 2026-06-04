// Sizes an element's font so it fits inside its parent container.
// Measures scrollWidth vs container width and shrinks until it fits.
// Pure: it sizes the element once. The caller re-invokes it whenever the text
// or container changes (re-render, resize) — see fitTitles in app.js.
export function fitText(el, { minFontSize = 10, maxFontSize = 400, step = 1 } = {}) {
  const container = el.parentElement;
  if (!container || !container.clientWidth) return;
  const containerWidth = container.clientWidth;

  // Start at max and shrink until the text fits.
  let size = maxFontSize;
  el.style.fontSize = size + "px";
  while (el.scrollWidth > containerWidth && size > minFontSize) {
    size -= step;
    el.style.fontSize = size + "px";
  }
}
