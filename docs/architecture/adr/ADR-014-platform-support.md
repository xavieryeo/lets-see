# ADR-014 — Desktop platform support and secure-execution boundary

- **Status:** Scope direction recorded; implementation and verification pending
- **Issue:** [#168](https://github.com/xavieryeo/lets-see/issues/168)
- **Related:** [ADR-001](ADR-001-desktop-shell.md), [DEV-001 #223](https://github.com/xavieryeo/lets-see/issues/223), [DEV-007 #229](https://github.com/xavieryeo/lets-see/issues/229)

## Decision and rationale

Support Linux and Windows as first-class **desktop client** build targets from DEV-001. Do not expand the first security execution architecture to native Windows. This permits UI development and daily use on Windows without requiring a parallel implementation of Linux-specific security primitives.

| Concern | Linux x86-64 | Windows x64 |
| --- | --- | --- |
| React / TypeScript interface and native Tauri host | Target | Target |
| System WebView | WebKitGTK | Edge WebView2 |
| CI desktop compilation / frontend tests / host tests | Target: Ubuntu 24.04 | Target: Windows Server 2025 runner, MSVC |
| Local interactive validation | Ubuntu 24.04 initial target | Windows 11 initial target |
| Desktop CSP, scoped IPC, dependency assurance | Required | Required |
| Headless agent/runtime connectivity | Future, subject to protocol design | Future client capability, subject to protocol design |
| Trusted execution broker / nono / OS-enforced agent workload isolation | Initial implementation and verification target | Not supported natively in initial scope |
| Local agent filesystem, process and network operations requiring independent enforcement | Only after applicable security gates pass | Unsupported unless independently enforced by a future verified backend |

These are target capabilities, not evidence of successful builds or verified sandbox guarantees. The Windows server CI runner verifies compilation and automated tests, not Windows 11 interactive rendering.

## Security and fail-closed behavior

Do not equate desktop portability with execution-security portability. The Windows desktop host must still enforce its own narrow IPC boundary and apply the same frontend hardening as Linux. Until a supported, verified execution backend is available, agent capability-bearing operations must be denied rather than silently falling back to native host execution. In DEV-001 there are no agent execution operations on either platform.

A future Windows client may communicate with a verified Linux runtime/broker over an authenticated protocol (ADR-002/003/013). Transport, identity, authorization, backend assurance reporting and remote execution remain separate decisions. No WSL, remote service, native Windows sandbox, or insecure compatibility mode is introduced by this ADR.

## Alternatives

- Linux-only desktop: simplest CI but excludes Windows-based desktop development.
- Native Windows security parity from day one: expands OS-specific enforcement, threat modelling and regression scope without being needed for initial desktop work.
- Windows desktop + Linux enforcement (selected): preserves the common desktop codebase while keeping privileged execution behind a separate, verified backend.

## Verification and follow-up

DEV-001: native CI matrix for Linux/Windows, shared committed lockfiles, desktop build artifacts, and per-platform smoke checks. DEV-007: installer/test packaging and measured compatibility evidence. macOS and Windows ARM64 are deferred initial CI targets, not declared permanently unsupported. ADR-001 remains provisional and this issue remains open for validation evidence; this scope decision does not certify any security backend.
