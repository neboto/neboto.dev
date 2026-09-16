# neboto.dev

Source for [neboto.dev](https://neboto.dev) — the landing page and user guide
for [neboto](https://github.com/neboto/neboto-tui), the read-only AWS terminal
UI.

Built with [Zola](https://www.getzola.org) (one Rust binary, no other
toolchain) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on
every push to `main`.

```bash
brew install zola        # or see https://www.getzola.org/documentation/getting-started/installation/
zola serve               # http://127.0.0.1:1111, live-reloads
zola build               # writes public/
```

Layout: `content/` is the Markdown (the landing page is `content/_index.md`,
the guide is `content/guide/`, ordered by `weight`), `templates/` the Tera
templates, `static/` everything copied verbatim — `media/` holds the demo
recording (`demo.mp4` + `demo.gif` + a poster frame), `brand/` the wordmark
and avatar from the app repo's `demo/brand/`, `css/site.css` the one
stylesheet. The palette is the app's catppuccin-mocha theme plus the brand
orange.
