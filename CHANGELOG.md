# Changelog

All notable changes to **The Symphony Companion** are recorded here.
This project follows [Semantic Versioning](https://semver.org/).

## [1.2.0] — 2026-10-20

### Added
- Full documentation: `DOCUMENTATION.md` (features, how it works, running,
  deploying, customising, privacy, accessibility, credits, FAQ) and this changelog.
- Status badges and app screenshots on the README.

## [1.1.0] — 2026-10-20

### Fixed
- **Tabs now work with JavaScript disabled.** The tab bar was rebuilt as a
  **pure-CSS** control (hidden radio inputs + labels + `:checked` sibling
  selectors), so switching panels no longer depends on any script.
- **No more one long page.** The previous no-JavaScript fallback revealed every
  section at once; with CSS tabs the sections are separate views in every
  environment.
- **Crash-proof storage.** Reading `localStorage` can throw in sandboxed viewers
  and on `file://` in some browsers; that threw on the first line and killed the
  whole script, leaving the page dead. Storage is now wrapped with an in-memory
  fallback, and every feature is guarded so a failure can never blank the page.

### Added
- Deep-linkable tabs via the URL hash (`#chapters`, `#breathe`, …).

## [1.0.0] — 2026-10-20

### Added
- Initial release: a self-contained companion web app with Today, Chapters,
  Practice, Breathe, Journal, Quotes and About.
- Installable PWA (manifest + service worker) with offline support.
- Personal-use licence (copyright Dr. Sohil Momin; free for personal,
  non-commercial use).
