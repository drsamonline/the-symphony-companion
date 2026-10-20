# The Symphony Companion — Documentation

A complete guide to the companion app: what it is, how it works, how to run,
deploy and customise it, and the terms it is offered under.

## Contents

1. [What this is (and isn't)](#what-this-is-and-isnt)
2. [Features](#features)
3. [How it works](#how-it-works)
4. [File structure](#file-structure)
5. [Running it locally](#running-it-locally)
6. [Deploying it](#deploying-it)
7. [Offline & installable](#offline--installable)
8. [Customising it](#customising-it)
9. [Privacy & data](#privacy--data)
10. [Accessibility](#accessibility)
11. [Browser support](#browser-support)
12. [Wellbeing & disclaimer](#wellbeing--disclaimer)
13. [Licence](#licence)
14. [Credits & attributions](#credits--attributions)
15. [FAQ](#faq)

---

## What this is (and isn't)

**It is** a companion to the book *The Symphony of the Present: Waking Up from the
Illusion of Tomorrow* by Dr. Sohil Momin: a small app that turns the book's ideas
into cards, its exercises into a practice you can track, and its mood into a
breathing timer and a journal.

**It is not** the book. It does not reproduce the book's text. Each chapter appears
as a short card — a sigil, one line, a few key points, the chapter's "one move",
and its honest limit. Read the book for the full argument.

## Features

### Today
A daily quote and the day's practice, chosen deterministically from the date, so
everyone sees the same card on the same day and it changes at midnight. A day-streak
counter records how many consecutive days you have marked as done.

### Chapters
The book as eleven cards — the Introduction, six chapters, the two Guides, the
Conclusion and the Coda. Each card carries:

- its **sigil** (an emblem drawn to match the chapter's idea),
- a one-line **idea**,
- four **key points**,
- **Your one move** — the small practice the chapter ends with,
- an **honest limit** — what the idea does not claim, and when to seek a
  professional.

### Practice
Every chapter's "one move" as a checklist. Tick the ones you have tried; the state
is remembered on your device.

### Breathe
An animated breathing circle with three rhythms — **Box 4-4-4-4**, **Calm 4-7-8**
and **Simple 5-5**. Pick a rhythm, press Start, and follow the circle: it grows as
you breathe in, holds, and shrinks as you breathe out.

### Journal
A gratitude field and a free note field. Entries are saved privately on your device
and can be exported as a plain-text file.

### Quotes
The book's attributed lines, each credited to the person who said it.

### About
The book, the author, and the wellbeing disclaimer.

## How it works

- **One self-contained file.** `index.html` holds the markup, the stylesheet, the
  script, the embedded fonts and the inline SVG sigils. It makes no network
  requests, so it works from a USB stick, an email attachment or a web host
  identically.
- **CSS-only tabs.** The seven tabs are hidden `<input type="radio">` elements with
  `<label>`s, and the panels are revealed with `:checked ~ #panel` sibling
  selectors. The result: the tabs switch **without any JavaScript at all**.
- **JavaScript is an enhancement.** The script adds the daily rotation, the streak,
  the breathing timer and the journal. It is wrapped so that a failure can never
  leave a blank or dead page, and storage access is guarded (it falls back to
  in-memory if `localStorage` is unavailable).
- **No frameworks, no build step.** Plain HTML, CSS and a little vanilla
  JavaScript. Nothing to install to run it.
- **Progressive Web App.** A `manifest.webmanifest` and a `sw.js` service worker
  let it install to a phone home screen and open offline after the first visit.

## File structure

```
.
├── index.html               the whole app (self-contained)
├── manifest.webmanifest     PWA name, colours and icon
├── sw.js                    service worker: caches the app for offline use
├── icon.svg                 the app icon
├── README.md                the front page
├── DOCUMENTATION.md         this file
├── CHANGELOG.md             version history
├── LICENSE                  personal-use licence
└── docs/
    ├── screenshot-today.png
    ├── screenshot-chapters.png
    ├── screenshot-breathe.png
    └── screenshot-desktop.png
```

## Running it locally

**Simplest:** open `index.html` in any browser — double-click it, or File ▸ Open.
Everything works; the only thing that will not register is the service worker (which
needs http, not `file://`).

**As an installed app (PWA):** serve the folder over http and open it:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploying it

Any static host works — there is no server code and no build step.

- **GitHub Pages:** already enabled for this repository (Settings ▸ Pages ▸ Deploy
  from a branch ▸ `main` / root). The live site is
  <https://drsamonline.github.io/the-symphony-companion/>.
- **Netlify / Cloudflare Pages / Vercel:** drag the folder in, or point it at the
  repo. No settings needed.
- **Any web server:** copy the files into a directory that is served.

## Offline & installable

The service worker caches the app shell on first load, so after one visit the app
opens with no network. On a phone, open the live site and choose **Add to Home
Screen** (iOS Safari) or **Install app** (Android Chrome) to install it with its own
icon.

## Customising it

Everything is in `index.html`.

- **Colours:** the palette is the teal used by the book. Search for `#0e6b76`
  (primary), `#084a53` (deep), `#d9a24b` (gold accent) and `#eef7f9` (paper) and
  swap them for your own.
- **Chapter cards:** each card is an `<article class="card">` block. Copy one and
  edit the sigil, the number, the title, the idea, the points and the move.
- **Quotes:** the Quotes tab is a list of `<div class="qcard">` blocks.
- **The daily rotation:** the quote and practice rotate through the arrays baked
  into the script; edit those arrays to change what appears on a given day.
- **The icon:** `icon.svg` is the app icon. Replace it and update
  `manifest.webmanifest` if the filename changes.

## Privacy & data

- **No accounts, no analytics, no tracking, no network calls.**
- Your **streak, practice ticks and journal** are stored in your browser's local
  storage under the key `symphony.v1`, on your device only.
- Clearing your browser data, or using private/incognito mode, will clear them.
- To remove everything: clear the site's data in your browser settings.

## Accessibility

- **Keyboard:** the tabs are real radio inputs, so they are reachable and operable
  by keyboard, and the form fields and buttons are standard controls.
- **No-JavaScript:** the tabs work with scripting disabled, and if a script fails
  the content is shown rather than hidden.
- **Contrast and type:** the palette is chosen for readable contrast, and the body
  text is sized for comfortable reading on a phone.
- **Reduced motion:** the breathing circle animates; if you prefer no motion, use
  your system's "reduce motion" setting where supported.

## Browser support

Any modern browser — Chrome, Safari, Edge, Firefox — on desktop or mobile. The app
uses only widely supported HTML, CSS and JavaScript, and the core navigation works
even where JavaScript is restricted.

## Wellbeing & disclaimer

This companion offers general reflections on attention, identity and wellbeing. It
is **not** medical or psychological advice and it is **not** a substitute for
diagnosis or treatment by a qualified professional. The book and this app discuss
trauma, illness and grief; if any of it stirs up material that is hard to hold,
please pause and speak to a licensed clinician or a trusted person. If you are in
crisis, contact your local emergency number or a crisis line in your region.

## Licence

**Copyright © 2026 Dr. Sohil Momin. All rights reserved.**

This app, and the material it draws from the book *The Symphony of the Present*
(its text, chapter summaries, key ideas, practices, quotations, sigils, design and
code), are the copyright of Dr. Sohil Momin.

**You may:** use, read and run it for personal, non-commercial purposes; install it
on your own devices; share the link or repository with others for their personal,
non-commercial use.

**You may not:** use it, in whole or in part, for any commercial purpose; sell,
sublicense, rent or include it in a commercial product or service; reproduce or
redistribute the book's text or this app's materials as your own; remove or alter
the attribution.

For any use beyond personal, non-commercial use, contact the author:
**sohilmomin2000@gmail.com**. The full terms are in [LICENSE](LICENSE).

## Credits & attributions

- **Author of the book and this companion:** Dr. Sohil Momin.
- **Ideas and quotations** are attributed to their sources: Alan Watts, Gabor Maté,
  Louise Hay, G. K. Chesterton, Jim Carrey, Freddie Mercury, and Bryan Cranston
  (whose account is drawn from his memoir *A Life in Parts*). These remain the
  property of their respective rights holders and are used briefly and with
  attribution.
- **Sigils, design and code** for this companion were made for this project.

## FAQ

**Do I need to buy the book to use this?** No — the companion stands alone. It is
designed to be more useful *with* the book, but it works on its own.

**Does it collect my data?** No. There is no account and no network call; your data
stays on your device.

**Can I use it offline?** Yes. Open `index.html` directly, or install the PWA and it
caches itself.

**Why don't the tabs need JavaScript?** They are built from radio inputs and CSS
`:checked` selectors, so the browser switches panels by itself.

**Can I put this on my own site?** For personal, non-commercial use, yes. For
anything commercial, contact the author first.

**I found a problem or have an idea.** Open an issue on this repository.
