// Sidebar search over Zola's fuse_json index. Loads the index on first
// focus (nothing fetched on plain page views), matches with Fuse.js, renders
// page-level results with a snippet around the first body hit.
//
// Keys: `/` focuses the box (matching the app), Esc clears and blurs,
// ↑/↓ walk the results, Enter opens the highlighted one. `?q=` in the URL
// pre-fills and runs a search so a result list is linkable. Queries under
// three characters are ignored (Fuse drops sub-minMatchCharLength hits).
(function () {
  "use strict";
  var box = document.getElementById("site-search");
  var out = document.getElementById("site-search-results");
  if (!box || !out || typeof Fuse === "undefined") return;

  var indexUrl = box.getAttribute("data-index");
  // The landing page is indexed under the site title; call it Home.
  var rootUrl = (box.getAttribute("data-root") || "").replace(/\/$/, "");
  var fuse = null;
  var loading = null;
  var cursor = -1;

  function load() {
    if (fuse) return Promise.resolve(fuse);
    if (loading) return loading;
    loading = fetch(indexUrl)
      .then(function (r) { return r.json(); })
      .then(function (docs) {
        fuse = new Fuse(docs, {
          keys: [
            { name: "title", weight: 3 },
            { name: "description", weight: 2 },
            { name: "body", weight: 1 }
          ],
          includeMatches: true,
          ignoreLocation: true,
          threshold: 0.3,
          minMatchCharLength: 3
        });
        return fuse;
      })
      .catch(function () {
        out.innerHTML = '<li class="search-note">Search index unavailable</li>';
        out.hidden = false;
        loading = null;
      });
    return loading;
  }

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Snippet of the body around the best hit. Fuse's indices come from a
  // fuzzy bitap match and can land on loose fragments ("e is the one to re"
  // for "version history"), so prefer a literal occurrence of the whole
  // query, then of any query word, and only then Fuse's longest index.
  function findSpan(body, q) {
    var lower = body.toLowerCase();
    var i = lower.indexOf(q.toLowerCase());
    if (i >= 0) return [i, i + q.length - 1];
    var words = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length >= 3; });
    for (var k = 0; k < words.length; k++) {
      i = lower.indexOf(words[k]);
      if (i >= 0) return [i, i + words[k].length - 1];
    }
    return null;
  }

  function snippet(hit, q) {
    var body = hit.item.body || "";
    var m = findSpan(body, q);
    if (!m) {
      (hit.matches || []).forEach(function (x) {
        if (x.key !== "body") return;
        x.indices.forEach(function (ix) {
          if (!m || ix[1] - ix[0] > m[1] - m[0]) m = ix;
        });
      });
    }
    if (!m) return esc(body.slice(0, 120)) + (body.length > 120 ? "\u2026" : "");
    var start = Math.max(0, m[0] - 60);
    var end = Math.min(body.length, m[1] + 61);
    return (start > 0 ? "\u2026" : "") +
      esc(body.slice(start, m[0])) +
      "<mark>" + esc(body.slice(m[0], m[1] + 1)) + "</mark>" +
      esc(body.slice(m[1] + 1, end)) +
      (end < body.length ? "\u2026" : "");
  }

  function render(hits, q) {
    cursor = -1;
    if (!hits.length) {
      out.innerHTML = '<li class="search-note">No matches</li>';
      out.hidden = false;
      return;
    }
    out.innerHTML = hits.slice(0, 8).map(function (h) {
      return '<li><a href="' + esc(h.item.url) + '">' +
        '<span class="search-title">' + esc(h.item.url.replace(/\/$/, "") === rootUrl ? "Home" : h.item.title) + "</span>" +
        '<span class="search-snip">' + snippet(h, q) + "</span></a></li>";
    }).join("");
    out.hidden = false;
  }

  function clear() {
    out.innerHTML = "";
    out.hidden = true;
    cursor = -1;
  }

  function run() {
    var q = box.value.trim();
    if (q.length < 3) { clear(); return; }
    load().then(function (f) { if (f) render(f.search(q), q); });
  }

  function move(delta) {
    var items = out.querySelectorAll("li > a");
    if (!items.length) return;
    cursor = (cursor + delta + items.length) % items.length;
    items.forEach(function (a, i) { a.classList.toggle("is-active", i === cursor); });
    items[cursor].scrollIntoView({ block: "nearest" });
  }

  box.addEventListener("focus", load);
  box.addEventListener("input", run);
  box.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { box.value = ""; clear(); box.blur(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter") {
      var a = out.querySelector("li > a.is-active") || out.querySelector("li > a");
      if (a) window.location.href = a.href;
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    e.preventDefault();
    box.focus();
    box.select();
  });

  document.addEventListener("click", function (e) {
    if (!box.parentNode.contains(e.target)) clear();
  });
  box.addEventListener("focus", function () { if (box.value.trim().length >= 3) run(); });

  var q = new URLSearchParams(window.location.search).get("q");
  if (q) { box.value = q; run(); }
})();
