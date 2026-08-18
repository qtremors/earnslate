// EarnSlate Docs & Showcase Interactive Engine

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const latestReleaseApi = "https://api.github.com/repos/qtremors/earnslate/releases/latest";

// Header Scroll State
const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 14);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// Mobile Navigation
const closeNavigation = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
  navLinks?.classList.remove("open");
};

navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  navToggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
  navLinks?.classList.toggle("open", !open);
});

navLinks?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

document.addEventListener("click", (event) => {
  if (!header?.contains(event.target)) closeNavigation();
});

// GitHub Release & Stats Fetcher
const releaseDownloadCount = (release) => {
  if (!Array.isArray(release?.assets)) return 0;
  return release.assets.reduce((total, asset) => total + (Number(asset?.download_count) || 0), 0);
};

const applyLatestRelease = (release) => {
  const tag = typeof release?.tag_name === "string" ? release.tag_name.trim() : "";
  if (!tag) return;
  const downloads = releaseDownloadCount(release);

  document.querySelectorAll("[data-latest-tag]").forEach((el) => {
    el.textContent = tag;
  });
  document.querySelectorAll("[data-download-label]").forEach((el) => {
    el.textContent = `Download ${tag} APK`;
  });
};

const loadRepoStats = async () => {
  try {
    const relRes = await fetch(latestReleaseApi, { headers: { Accept: "application/vnd.github+json" } });
    if (relRes.ok) applyLatestRelease(await relRes.json());
  } catch {
    // Offline fallback preserves static labels
  }
};

loadRepoStats();

// FAQ Accordion
document.querySelectorAll(".faq-list button").forEach((button) => {
  button.addEventListener("click", () => {
    const answerId = button.getAttribute("aria-controls");
    const answer = answerId ? document.getElementById(answerId) : null;
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    if (answer) answer.hidden = !open;
  });
});

// Scroll Reveal Observer
const revealItems = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!("IntersectionObserver" in window) || reducedMotion) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -25px" });

  revealItems.forEach((item) => observer.observe(item));
}
