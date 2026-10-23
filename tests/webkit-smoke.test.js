'use strict';
/**
 * The Symphony Companion - headless DOM smoke suite.
 *
 * Drives the *real* app page in happy-dom and asserts that persistence now goes
 * through web-kit's Loom.storage, that the app's own store API (the `S` object
 * and `save()`) is unchanged from the caller's point of view, and that a store
 * saved *before* the retrofit (the legacy un-prefixed `symphony.v1` key) is
 * migrated into Loom.storage with no data loss.
 *
 * The app ships two mirrored copies of the page (index.html and the GitHub Pages
 * copy docs/play/index.html); both must behave identically, so by default the
 * suite runs the whole battery against both.
 *
 *   node tests/webkit-smoke.test.js [path-to-index.html]
 */
const fs = require('fs');
const path = require('path');
const { Window } = require('happy-dom');

const root = path.join(__dirname, '..');
const targets = process.argv[2]
  ? [path.resolve(process.argv[2])]
  : [path.join(root, 'index.html'), path.join(root, 'docs', 'play', 'index.html')];

const results = [];
const ok = (name, cond, extra = '') => results.push({ name, pass: !!cond, extra });

function loadParts(file) {
  const html = fs.readFileSync(file, 'utf8');
  const wkPath = path.join(path.dirname(file), 'web-kit.js');
  const wk = fs.existsSync(wkPath) ? fs.readFileSync(wkPath, 'utf8') : '';
  // the app's own <script> blocks (executable). <script src=...> is stripped with
  // the rest of the markup and web-kit is inlined separately, exactly as a browser
  // would load it in order: web-kit first, then the app.
  const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const htmlNoScripts = html.replace(/<script[\s\S]*?<\/script>/g, '');
  return { wk, inline, htmlNoScripts };
}

function boot(parts, seed) {
  const w = new Window({ url: 'https://local.test/' });
  for (const [k, v] of Object.entries(seed || {})) {
    try { w.localStorage.setItem(k, v); } catch (e) {}
  }
  w.document.write(parts.htmlNoScripts);
  if (parts.wk) w.eval(parts.wk);
  w.eval(parts.inline.join('\n'));
  return w;
}

function snapshot(w) {
  const out = {};
  for (let i = 0; i < w.localStorage.length; i++) {
    const k = w.localStorage.key(i);
    out[k] = w.localStorage.getItem(k);
  }
  return out;
}

const todayISO = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

function suite(label, file) {
  const parts = loadParts(file);
  const tag = label + ': ';

  // 1. web-kit boots and exposes Loom.storage
  let w = boot(parts);
  ok(tag + 'web-kit loaded (window.Loom.storage present)',
    w.eval('typeof Loom') === 'object' && w.eval('typeof Loom.storage.get') === 'function');

  // 2. the app itself still renders
  ok(tag + 'app renders (mark button + hero quote)',
    !!w.document.getElementById('mark') && (w.document.getElementById('hero-q') || {}).textContent.length > 0);

  // 3. the app's own save() round-trips through Loom.storage (namespaced)
  w.document.getElementById('mark').click();               // app calls save()
  const persisted = w.eval('JSON.stringify(Loom.storage.get("symphony.v1", null))');
  const p = JSON.parse(persisted || 'null');
  ok(tag + 'save() round-trips through Loom.storage',
    p && p.streak && p.streak.count === 1 && p.streak.last === todayISO(),
    persisted);

  // 4. nothing is written to the raw legacy key on save
  ok(tag + 'save() writes nothing to the raw legacy key', !('symphony.v1' in snapshot(w)));

  // 5. it survives a reload (the app reads it back and renders it)
  const w2 = boot(parts, snapshot(w));
  ok(tag + 'streak persists across reload',
    w2.document.getElementById('st-count').textContent === '1',
    String(w2.document.getElementById('st-count').textContent));

  // 6. a store saved BEFORE the retrofit (legacy key) is migrated, not lost
  const legacy = { practice: { intro: true }, streak: { last: '2020-01-01', count: 5 }, journal: [{ ts: 't', g: 'g', n: 'n' }] };
  const w3 = boot(parts, { 'symphony.v1': JSON.stringify(legacy) });
  const m = w3.eval('JSON.stringify(Loom.storage.get("symphony.v1", null))');
  const mv = JSON.parse(m || 'null');
  const snap3 = snapshot(w3);
  ok(tag + 'legacy store is migrated into Loom.storage with no data loss',
    mv && mv.streak && mv.streak.count === 5 && mv.practice.intro === true && mv.journal.length === 1, m);
  ok(tag + 'legacy key is removed after migration', !('symphony.v1' in snap3));
  ok(tag + 'app reflects the migrated store on boot',
    w3.document.getElementById('st-count').textContent === '5' &&
    !!w3.document.querySelector('#practice-list input').checked);

  // 7. a fresh install starts clean: nothing persisted yet, the first mark
  //    starts the streak at 1 (not inherited), and no legacy key appears
  const w4 = boot(parts);
  const beforeSave = w4.eval('JSON.stringify(Loom.storage.get("symphony.v1", null))');
  w4.document.getElementById('mark').click();
  const afterSave = JSON.parse(w4.eval('JSON.stringify(Loom.storage.get("symphony.v1", null))') || 'null');
  ok(tag + 'fresh install starts clean',
    beforeSave === 'null' && !!afterSave && afterSave.streak.count === 1 && !('symphony.v1' in snapshot(w4)),
    beforeSave);
}

(function main() {
  for (const t of targets) suite(path.relative(root, t), t);

  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.pass) { pass++; console.log('PASS  ' + r.name); }
    else { fail++; console.log('FAIL  ' + r.name + (r.extra ? '  ' + r.extra : '')); }
  }
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
