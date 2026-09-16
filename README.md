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

## DNS

The zone for `neboto.dev` is in Route 53. `dns/route53-neboto.dev.json` is
the change batch that points it at GitHub Pages (apex A + AAAA to GitHub's
Pages addresses, `www` CNAME to `neboto.github.io`); the existing MX and TXT
records for Google Workspace are untouched. Apply with:

```bash
ZONE=$(aws route53 list-hosted-zones-by-name --dns-name neboto.dev --query 'HostedZones[0].Id' --output text)
aws route53 change-resource-record-sets --hosted-zone-id "$ZONE" --change-batch file://dns/route53-neboto.dev.json
```

Once the records resolve, GitHub issues the certificate (minutes to an hour)
and *Enforce HTTPS* can be switched on:
`gh api -X PUT repos/neboto/neboto.dev/pages -F https_enforced=true`.
The custom domain itself is set on the Pages site (`cname = neboto.dev`) and
mirrored by `static/CNAME`, so a deploy can't unset it.
