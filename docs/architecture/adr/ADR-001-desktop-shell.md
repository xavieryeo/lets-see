# ADR-001 — Select the desktop shell (Tauri vs Electron)

- **Status:** Proposed — Tauri preferred; validation pending
- **Date:** 2026-11-27
- **Issue:** [#1](https://github.com/xavieryeo/lets-see/issues/1)
- **Scope:** Desktop host only; the independent execution broker is a separate security concern
- **Supporting rationale:** [Technology stack](../technology-stack.md)

## Context

The product is a graphical-first, headless-capable AI agent engineering workbench. It requires React/TypeScript conversation rendering, a code editor, embedded terminal, resizable inspectors and large interactive graphs. It also requires a distinct Rust agent runtime that can run without the desktop client. We must not confuse a desktop framework's IPC restrictions with agent workload isolation.

## Options

1. **Tauri:** Rust host + operating-system WebView, smaller bundled rendering surface, direct Rust integration, cross-platform WebView variability.
2. **Electron:** bundled Chromium + Node main process, consistent renderer and strong desktop ecosystem, larger packaged browser/update surface; Rust runtime still separate.
3. **Native Rust UI or TUI:** possible longer-term experiment; presently compromises web-based editor/docking/graph integration or requires substantial custom work.

## Proposed decision

**Prototype Tauri first, keep Electron as a live fallback.** The selection is **not yet accepted** and should not be represented as an observed performance or security result. Windowed UI, TypeScript, React and headless Rust runtime are selected independently of this shell decision.

## Initial platform scope

Linux is the sole initial desktop build and security-engineering target under [ADR-014](ADR-014-platform-support.md). Other platforms are deferred; no framework decision or security guarantee is implied by CI compilation.

## Decision drivers

1. Rendering fidelity for the actual workbench interactions.
2. Safety and auditable minimality of frontend-to-native APIs.
3. Operational separation from headless runtime and trusted broker.
4. Packaging, updates and prerequisites on Linux; portability is a future decision.
5. Startup, memory and sustained-streaming responsiveness measured on reference hardware.
6. Maintenance and contributor cost.

## Required evidence / acceptance criteria

- Demonstrate Markdown streaming, xterm.js PTY, Monaco/diffs, dockable panels and interactive execution graphs.
- Verify keyboard, mouse, accessibility, clipboard and theme behaviour on packaged builds.
- Test lifecycle, versioned protocol, cancellation and recovery after runtime termination.
- Show a concrete IPC least-privilege configuration and negative tests for unauthorised commands; Tauri's Rust host remains privileged and must not execute unrestricted agent tools.
- Compare results against Electron for any failed acceptance criterion, documenting whether the difference is a blocker.
- Capture reproducible platform-specific measurements instead of marketing benchmark numbers.

## Consequences

Tauri becomes the preferred starting point for a proof of concept, not a release guarantee. Do not close [#1](https://github.com/xavieryeo/lets-see/issues/1) before the prototype demonstrates the required workflows and security boundary. See [Technology stack](../technology-stack.md) for other language/framework rationales.
