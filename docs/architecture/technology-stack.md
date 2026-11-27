# Technology stack: decisions and rationale

Status: **baseline architecture choices**, not proof of implementation. Last reviewed: 2026-11-27.
Related: [ADR-001: desktop shell](adr/ADR-001-desktop-shell.md) · [ADR-015: license](adr/ADR-015-project-license.md).

## 1. Decision summary

| Concern | Decision | Status | Main reason |
|---|---|---|---|
| Product interface | **Windowed desktop application, graphical by default** | Selected | Simultaneous, interactive conversation, inspector, graphs, security controls and workspace panels |
| Frontend language | **TypeScript** | Selected | Typed application contracts, rapid UI iteration and mature desktop-web tooling |
| Desktop UI | **React** | Selected | Composable stateful interfaces and broad editor, terminal, docking and visualisation ecosystem |
| Desktop host | **Tauri** | **Preferred, provisional** | System WebView plus Rust integration, cross-platform packaging and explicit IPC/capability configuration |
| Core runtime | **Rust** | Selected | Ownership-based memory safety, controlled concurrency, OS-facing integration and standalone/headless operation |
| Terminal UI | **Ink** | **Optional, deferred** | React rendering for a future Node.js terminal client, **not** for the windowed interface |
| CLI, automation and CI | Headless runtime protocol; simple client first | Required | The agent system must function without a desktop window |
| Execution isolation | Independent trusted broker and interchangeable backends; nono preferred initially | Architecture selected; implementation later | The desktop shell and model must never be security authorities |

**Important:** React and Ink are not competing frontend languages. React is the UI model; React DOM renders the **desktop WebView**, while Ink is an alternative **terminal renderer**. Choosing React for the desktop does *not* imply that Ink belongs in the MVP, or that browser components can be reused directly in Ink.

The reasons below are **decision rationale**, not measurements. Every performance, portability or security claim that matters to the release must be validated.

## 2. Why a windowed desktop app instead of a TUI?

This is an **agent engineering workbench**, not simply a chat/coding command line. Its differentiators require spatially rich, simultaneous inspection and direct manipulation:

- Conversation and streaming tool output alongside an inspector, source/diff viewer and policy decisions.
- Resizable and dockable panels, mouse selection, context menus, hover explanations and accessible keyboard shortcuts.
- Interactive timelines, causal execution graphs, context maps, policy and trust-boundary visualisations.
- High-density graphs, typography, syntax highlighting and graphical diff/comparison views.
- Model laboratory and evaluation dashboards with charts, filters and coordinated selection.

A TUI using Ratatui, iocraft or Ink can provide attractive keyboard-driven workflows and simpler remote SSH use; it cannot provide the same breadth of native pointer interactions, embedded web components and flexible graphics without considerable custom engineering or compromises. The objective is **visual excellence and inspectability**, not merely to imitate Claude Code's terminal aesthetic.

**Costs accepted:** more UI code, WebView dependencies, different rendering engines, accessibility work and larger integration/testing scope. A windowed application is not intrinsically more secure or faster than a TUI.

**Preserved alternative:** the Rust runtime must remain headless with a versioned client protocol, allowing a lightweight CLI, future TUI, automated tests, CI and remote clients to use the same engine. **Graphical by default; headless by design** (PP-01). No business logic or security policy may be implemented solely in the desktop presentation layer.

## 3. Why TypeScript rather than Rust, JavaScript, Go or Python for the UI?

TypeScript is chosen for the **presentation layer**, not because it universally outperforms Rust or because it inherently makes UI attractive.

**Advantages for our use case:**

- Mature browser/WebView primitives for layout, text selection, accessibility, pointer input, CSS, streaming and canvas/SVG.
- Access to battle-tested editors, terminal emulators, docking systems, graph renderers, animations and chart libraries.
- Strong editor support, fast incremental iteration and fast feedback for visual experimentation.
- Static checking for UI state, events, discriminated unions and client/server message definitions.
- A clear division: TypeScript handles representation and interaction; Rust handles authority-bearing execution and runtime lifecycle.

**Trade-offs:** a JavaScript runtime and dependency ecosystem, bundle/performance budgeting, supply-chain exposure, compile-time types that disappear at runtime, and potential frontend/backend schema drift. Use strict TypeScript, validated inputs at each trust boundary and contract tests. **Types alone are not validation or authorisation.**

**Alternatives:** pure JavaScript loses static checking; Rust GUI frameworks such as egui/Slint can offer a more unified language/runtime but would forgo much of the browser-based editor/graph ecosystem; Go/Python desktop UI would also require more integration effort for the specified frontend features.

## 4. Why React rather than Svelte, Vue or a bespoke renderer?

React is selected for a stateful, componentised interface with long-lived streaming sessions, expandable tool executions, live timelines, multiple workspaces and inspectors.

- Reusable UI composition and explicit ownership of interactive state.
- Existing integration ecosystem for **Monaco**, **xterm.js**, **Dockview**, **React Flow/Cytoscape**, charts and accessible headless primitives.
- Useful state and rendering patterns for progressively disclosing detailed diagnostic views.
- Shared TypeScript data contracts between visual components without forcing those contracts into the Rust core.

**Trade-offs:** reconciliation overhead, effect/state complexity, performance pitfalls during high-frequency streaming, and dependency weight. Avoid pushing entire event streams into global React state: batch updates, virtualise large lists, isolate hot render paths and measure responsiveness. Prefer mature, accessible primitives; introduce state-management libraries only when there is a concrete need.

**Not selected:** Svelte and Vue are credible alternatives, but their smaller ecosystem overlap with the named editor/docking/graph integrations increases our integration risk. React is **not** chosen because all other frameworks are less capable or because React determines final UI polish. The design system, interaction design and engineering discipline do.

## 5. Why Ink? And why not use it for the desktop interface?

[Ink](https://github.com/vadimdemedes/ink) is a **React renderer for command-line applications** built on terminal layout primitives. It is attractive if we later want a rich Node.js CLI/TUI:

- React-style components and hooks for terminal views.
- A conversational terminal client useful over SSH and in keyboard-centric workflows.
- Reuse of **protocol types, business concepts and some non-DOM logic** with a TypeScript frontend.

Ink does **not** turn React components into desktop widgets. Its terminal components and layout constraints differ from React DOM; it does not substitute for browser-based Monaco, xterm.js, interactive graph canvases or unconstrained pointer-based docking. Terminal mouse support depends on terminals/libraries and must be validated separately; we should not promise desktop-equivalent mouse UX from Ink.

**Decision:** no Ink dependency in MVP-0 or MVP-1. Start with a minimal headless test/CLI client. Reconsider Ink when a genuinely interactive terminal client is justified; compare it with **Ratatui** (Rust, fewer runtime/language boundaries) and a conventional non-interactive Rust CLI. No second agent harness should be created for the TUI.

## 6. Why Rust for the agent runtime, security components and OS integration?

The application will execute or coordinate potentially untrusted workflows, manage multiple asynchronous operations and interact with operating-system isolation mechanisms. Rust fits this role:

- Ownership/borrowing and type systems prevent many common memory-safety defects in safe Rust.
- Strong modelling of agent states, typed errors, permission decisions and cancellation/lifecycle transitions.
- Async I/O/concurrency (Tokio is a candidate, not mandated) for providers, streaming, sessions and subprocess supervision.
- Direct integration with filesystem/process/network APIs and Linux-specific enforcement primitives.
- Headless executables and reusable crates that are not coupled to a desktop UI framework.
- Fits Tauri's Rust-side APIs while permitting an **independently executable** runtime and separate trusted broker.

**Costs:** a steep learning curve, compile times, more complex ownership/async code and platform-specific integration work. Do not use Rust where a maintained library is more appropriate; do not treat Rust memory safety as proof of whole-system security. Unsafe code, FFI, logic errors, credential handling, shell commands and sandbox misconfiguration remain security-relevant.

**Boundary:** the agent orchestration process is **not** automatically a trusted execution broker. The security design needs independently mediated, scoped operations that model output, frontend compromise and agent-runtime compromise cannot bypass within the documented threat model. Whether components are packaged as managed child processes or a daemon is tracked separately (ADR-003/ADR-004).

## 7. Why Tauri rather than Electron?

**Preferred candidate: Tauri**, not yet a final, benchmark-validated selection. Its Rust host and operating-system WebView pair naturally with the selected TypeScript/React frontend and Rust runtime.

| Dimension | Tauri — preferred | Electron — fallback |
|---|---|---|
| Rendering | OS WebView; WebView2 on Windows, WKWebView on macOS, WebKitGTK on Linux | App-bundled Chromium; more consistent engine version |
| Native application layer | Rust | Node.js main process (Rust services can still be used) |
| Packaging | Typically avoids bundling a complete browser engine | Bundles browser runtime and brings its own update surface |
| UI ecosystem | Browser-based React/TypeScript and web libraries | Browser-based React/TypeScript and web libraries |
| IPC boundary | WebView-to-Rust commands/events with configurable capabilities | Renderer-to-main IPC; requires explicit preload and permission design |
| Primary concern | WebView feature/behaviour variance and Linux dependencies | Packaging/runtime size, bundled Chromium maintenance and privileged main-process surface |
| Security verdict | **No automatic sandboxing of agent tools** | **No automatic sandboxing of agent tools** |

Tauri's frontend capability restrictions help reduce what a compromised WebView can request; **they do not restrict arbitrary Rust code in the host** and cannot replace our **independent execution broker**. Every command exposed to the UI is a potential privileged entry point. Avoid a generic shell command, unrestricted filesystem API or user-configurable network proxy in the shell. Restrict IPC commands by capability and validate inputs in the trusted boundary.

**Prototype-based acceptance gate — [ADR-001 / issue #1](https://github.com/xavieryeo/lets-see/issues/1):**

1. Verify streaming Markdown/code, selectable text, accessibility and keyboard/mouse behaviour.
2. Verify embedded **xterm.js** PTY interaction, **Monaco** editing and diff rendering.
3. Test docking/resizing, large execution graphs, multiple panels and sustained streaming under load.
4. Test Windows, macOS and Linux WebView behaviour (including packaged builds and Linux prerequisites).
5. Validate desktop-to-headless runtime protocol, event ordering, cancellation, process shutdown and restart.
6. Threat-model and test frontend compromise attempts, command allowlists, input validation, CSP and the broker boundary.
7. Measure reference hardware cold start, memory, rendering latency, distribution and update maintenance.
8. Repeat the critical demonstrations in Electron if the Tauri prototype fails a required capability.

**Decision rule:** prefer Tauri if the real workbench workflows and security boundaries pass; use Electron if cross-platform UI compatibility or functionality is materially better and worth its operating cost. No production claim that Tauri is conclusively smaller, faster or safer is accepted without a controlled comparison.

## 8. System boundary diagram

```text
+--------------------------------------------------------------+
| Windowed desktop client (React + TypeScript, DOM in WebView) |
| Views: conversation, workspace, inspector, security, graphs |
+------------------------+-------------------------------------+
                         | constrained desktop IPC
+------------------------v-------------------------------------+
| Tauri Rust shell: windows, lifecycle, minimal adapters       |
| NOT the agent's security authority                           |
+------------------------+-------------------------------------+
                         | versioned authenticated client API
+------------------------v-------------------------------------+
| Headless Rust agent runtime                                 |
| Providers / sessions / context / harness / structured events |
+------------------------+-------------------------------------+
                         | capability-bearing request only
+------------------------v-------------------------------------+
| Independent trusted execution broker / policy enforcement    |
+------------------------+-------------------------------------+
                         | scoped, verified execution
+------------------------v-------------------------------------+
| Isolation backend: nono first; alternatives later             |
+--------------------------------------------------------------+

Optional clients via the same runtime API:
  - minimal CLI / test harness (required)
  - Ink or Ratatui interactive terminal (deferred)
  - remote / CI clients (later)
```

This is a **logical separation**, not yet a commitment to process count, transport, authentication mechanism or packaging topology. ADR-002 through ADR-006 address those details. Capability decisions must be verified at the actual enforcement boundary, not inferred from a UI indicator.

## 8.1 Platform support

Linux and Windows are initial desktop build targets. OS-enforced agent execution security remains Linux-first; native Windows agent sandbox/broker enforcement is outside the initial scope. Both clients retain desktop security hardening and must fail closed when a required execution backend is unavailable. A future Windows desktop connection to a verified Linux backend is subject to protocol and remote-execution design. See [ADR-014](adr/ADR-014-platform-support.md); desktop build success is not evidence of execution security.

## 9. Explicitly deferred choices

| Technology | Position |
|---|---|
| Vite | Frontend build-tool candidate; validate against the Tauri template in use |
| Tailwind, Radix/shadcn, Motion | Design-system candidates, not prerequisites |
| Zustand | Optional frontend state-management helper |
| Dockview, Monaco, xterm.js | Feature-specific integration candidates requiring proof of concept |
| React Flow, Cytoscape, ECharts | Visualisation candidates, chosen per graph/chart workload |
| Tokio | Rust async runtime candidate |
| SQLite | Preferred local persistence |
| JSON-RPC vs other typed IPC | Deferred to ADR-002 |
| nono | Preferred initial external sandbox; evaluate its actual assurance and integration constraints |

## 10. References and decision maintenance

- [Tauri architecture](https://v2.tauri.app/concept/architecture/)
- [Tauri security model](https://v2.tauri.app/security/) and [capabilities](https://v2.tauri.app/security/capabilities/)
- [Ink: React for CLIs](https://github.com/vadimdemedes/ink)
- [React documentation](https://react.dev/)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [Rust language](https://www.rust-lang.org/)

Changes to selected technologies require documented alternatives, migration cost, security impact and a linked ADR or issue. This document describes **why** the stack is chosen, not an unreviewed dependency list or a promise of cross-platform security parity.
