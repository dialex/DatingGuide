// Once dismissed (or the app is installed) we never show the callout again.
const DISMISSED_KEY = "installCalloutDismissed";
// How many times the user has landed on the home view. The callout only
// appears from the second visit onward, so a first-time visitor isn't nagged.
const VISITS_KEY = "installHomeVisits";

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches
    || navigator.standalone === true;
}

// localStorage throws in some privacy modes. Treat any failure as "no store"
// so the callout logic degrades to simply never showing rather than crashing.
function store() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

async function populateModalSteps() {
  const file = isIos() ? "html/install-ios.html" : "html/install-android.html";
  const html = await fetch(file).then(r => r.text());
  document.getElementById("modal-steps").innerHTML = html;
}

export function setupInstallBanner() {
  if (isStandalone()) return;

  const banner   = document.getElementById("install-banner");
  const dismiss  = document.getElementById("btn-dismiss-banner");
  const modal    = document.getElementById("install-modal");
  const modalClose = document.getElementById("btn-modal-close");

  // The banner starts hidden (inline display:none in index.html). It is only
  // revealed later by maybeShowInstallBanner(), from the second home visit on.

  function dismissBanner() {
    banner.style.display = "none";
  }

  // Mark the callout as handled so it never shows again, then hide it.
  function retireBanner() {
    store()?.setItem(DISMISSED_KEY, "1");
    dismissBanner();
  }

  function openModal() {
    populateModalSteps();
    modal.classList.remove("hidden");
  }

  function closeModal(e) {
    if (!e || e.target === modal) {
      modal.classList.add("hidden");
    }
  }

  banner.addEventListener("click", (e) => {
    if (dismiss.contains(e.target)) return;
    openModal();
  });

  dismiss.addEventListener("click", (e) => {
    e.stopPropagation();
    retireBanner();
  });

  modal.addEventListener("click", closeModal);
  modalClose.addEventListener("click", () => modal.classList.add("hidden"));

  window.addEventListener("appinstalled", retireBanner);
}

// Call this each time the user lands on the home view. The callout stays hidden
// on the first visit, appears from the second visit onward, and once dismissed
// (or the app is installed) never appears again.
export function maybeShowInstallBanner() {
  if (isStandalone()) return;

  const s = store();
  if (s?.getItem(DISMISSED_KEY)) return;

  const visits = (parseInt(s?.getItem(VISITS_KEY) || "0", 10) || 0) + 1;
  s?.setItem(VISITS_KEY, String(visits));

  if (visits < 2) return;

  const banner = document.getElementById("install-banner");
  if (banner) banner.style.display = "flex";
}
