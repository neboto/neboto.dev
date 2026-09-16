+++
title = "Install"
description = "Prebuilt binaries for Linux and macOS, cargo-binstall, or from source."
weight = 10
+++

Prebuilt binaries for Linux (x86_64, aarch64) and macOS (Intel, Apple
Silicon) are attached to every [GitHub release](https://github.com/neboto/neboto-tui/releases).

## Installer

Picks the right binary for your platform, verifies its SHA-256 and, when the
GitHub CLI is installed and logged in, its signed build provenance, then puts
it in `~/.local/bin`:

```bash
curl -fsSL https://raw.githubusercontent.com/neboto/neboto-tui/main/install.sh | sh
```

Prefer to read a script before running it? Download it first:

```bash
curl -fsSLO https://raw.githubusercontent.com/neboto/neboto-tui/main/install.sh && less install.sh && sh install.sh
```

`NEBOTO_VERSION=v0.1.0` pins a version and `NEBOTO_INSTALL_DIR` changes the
destination. Make sure the destination is on your `PATH`. The script is
served from the project's `main` branch on GitHub, which is protected and
only changes through reviewed pull requests; there is deliberately no copy
of it on this site.

## cargo-binstall

```bash
cargo binstall --git https://github.com/neboto/neboto-tui neboto
```

## From source

Needs a recent stable Rust toolchain:

```bash
cargo install --git https://github.com/neboto/neboto-tui
```

Or clone and build:

```bash
git clone https://github.com/neboto/neboto-tui.git && cd neboto-tui
cargo build --release && ./target/release/neboto
```

## Verify a download

Every release archive carries a signed build provenance attestation naming
the commit and workflow that built it. With the GitHub CLI:

```bash
gh attestation verify neboto-aarch64-apple-darwin.tar.gz --repo neboto/neboto-tui
```

A tampered or substituted archive fails this check even if its `.sha256`
was replaced alongside it.

## Optional companions

- The `aws` CLI plus `session-manager-plugin`, for SSM sessions (<kbd>s</kbd>).
- An `$EDITOR`, for <kbd>e</kbd> (falls back to `vim`).
- A terminal font with the Nerd Font glyphs if you want the `⛓ ⚠ ✓ →` markers to render as in the recording; everything works without them.
