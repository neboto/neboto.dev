+++
title = "Install"
description = "Prebuilt binaries for Linux and macOS, cargo-binstall, or from source."
weight = 10
+++

Prebuilt binaries for Linux (x86_64, aarch64) and macOS (Intel, Apple
Silicon) are attached to every [GitHub release](https://github.com/neboto/neboto-tui/releases).

## Installer

Picks the right binary for your platform, verifies its SHA-256, and puts it
in `~/.local/bin`:

```bash
curl -fsSL https://raw.githubusercontent.com/neboto/neboto-tui/main/install.sh | sh
```

`NEBOTO_VERSION=v0.1.0` pins a version and `NEBOTO_INSTALL_DIR` changes the
destination. Make sure the destination is on your `PATH`.

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
