# ADR-014 — Initial Linux platform scope

- **Status:** Scope direction recorded; implementation and verification pending
- **Issue:** [#168](https://github.com/xavieryeo/lets-see/issues/168)
- **Related:** [ADR-001](ADR-001-desktop-shell.md), [DEV-001 #223](https://github.com/xavieryeo/lets-see/issues/223), [DEV-007 #229](https://github.com/xavieryeo/lets-see/issues/229)

## Decision and rationale

Linux is the only initial desktop, runtime and secure-execution engineering target. Use Ubuntu 24.04 x86-64 and WebKitGTK as the initial native desktop build and verification environment. This supersedes the previous dual-platform desktop proposal and reduces the build, packaging and validation burden during the learning curriculum.

| Concern | Initial target |
| --- | --- |
| Desktop UI and Tauri host | Linux x86-64 |
| Native CI and interactive verification | Ubuntu 24.04 |
| Desktop IPC, CSP and supply-chain assurance | Required |
| Headless runtime | Linux, subject to runtime design |
| Independent trusted execution broker, nono and OS isolation | Linux, subject to applicable security gates |
| Other operating systems | Out of scope; no compatibility or support commitment |

These are targets, not evidence of a working application or verified security guarantees. Desktop build success does not establish agent isolation.

## Security and fail-closed behavior

Desktop IPC minimization, content security policy, input validation and dependency assurance remain required. Capability-bearing agent operations must be denied when a verified enforcement backend is unavailable; no unrestricted compatibility mode is permitted. DEV-001 exposes no agent execution operations.

## Alternatives

- Linux only (selected): one native build environment and a single initial platform for OS-enforced isolation.
- Dual-platform desktop with Linux-only enforcement: preserves more desktop portability but adds CI and validation effort that is not needed now.
- Full multi-platform security parity: increases platform-specific implementation and verification substantially.

## Verification and follow-up

DEV-001 verifies the Linux native desktop build, lockfiles and interactive smoke checks. DEV-007 covers Linux installer packaging and measured compatibility. Do not add native builds, platform-specific code or packaging for other operating systems without a new scope decision. Retain framework-neutral runtime boundaries and avoid needless Linux coupling in the frontend. ADR-001 remains provisional; #168 remains open for validation evidence.
