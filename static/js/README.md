# Vendored scripts

| File | What | Version | Source | sha256 |
|---|---|---|---|---|
| `fuse.min.js` | Fuse.js fuzzy search (Apache-2.0, see `fuse.LICENSE`) | 7.1.0 | `https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.min.js` | `220934f576134b0466d99f786ce21b13f87d319b1e9ae633c55e68f6f41c3c9d` |

Vendored rather than loaded from a CDN so the site keeps serving only its own
files (Google Fonts is the one exception). To upgrade: download the new
`dist/fuse.min.js`, update the row, and re-run `shasum -a 256`.

`search.js` is ours: it lazy-loads Zola's `search_index.en.json` (built with
`index_format = "fuse_json"` in `config.toml`) on first focus of the top-bar
search box (every page) and renders page-level results with a highlighted body snippet.
