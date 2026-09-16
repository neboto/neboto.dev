+++
title = "Guide"
description = "Install neboto, point it at an account, and learn the handful of keys that do most of the work."
sort_by = "weight"
template = "section.html"
page_template = "page.html"
+++

neboto is a keyboard-driven terminal UI for browsing AWS. It is **read-only**:
it issues only `describe`, `list` and `get` calls, so it is safe to run
against production. This guide covers installing it, the first run, and the
keys and concepts that do most of the work. Inside the app, <kbd>?</kbd> is
the authoritative key reference.
