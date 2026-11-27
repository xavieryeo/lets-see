# lets-see

Desktop-first, security-oriented AI agent engineering workbench for developing, operating, inspecting, securing and evaluating model-agnostic agents.

## Architecture

- Clean-room Rust headless agent runtime; TypeScript/React **windowed desktop** client; Tauri preferred but provisional pending [ADR-001](docs/architecture/adr/ADR-001-desktop-shell.md) ([#1](https://github.com/xavieryeo/lets-see/issues/1)).
- Independent trusted execution broker, capability-based authority, interchangeable sandbox backends (nono preferred initially).
- Local-first persistence, structured execution events, progressive disclosure.
- Linux-first security enforcement; cross-platform desktop target.

## Release gates

**MVP-0:** streaming conversation, two provider adapters, bounded agent loop, deterministic tools only, policy interface, structured events, basic inspector, local persistence and headless operation. No arbitrary shell, filesystem writes, network tools, MCP execution or executable plugins.

**MVP-1:** independent broker, verified sandbox, scoped filesystem and subprocess execution, operation-bound approvals, security inspector, repository workflows and adversarial tests. No privileged capability may ship before enforcement and negative tests are verified.

## Requirements and traceability

See [GitHub Issues](https://github.com/xavieryeo/lets-see/issues). Stable IDs appear in issue titles: FR (functional requirements), NFR (non-functional requirements), SI (security invariants), ADR (architecture decisions), AC/SAC (acceptance criteria). P0 = foundation; P1 = security platform; P2 = advanced; P3 = future. Security gates supersede feature priorities.

Implementation tasks should be bounded, dependency-ordered, benchmark-inspired PRs with acceptance criteria, positive and negative tests, trade-offs and reviewer walkthroughs. Requirement issues are not necessarily implementation-sized tasks.

## Technology decisions

See [Technology stack and rationale](docs/architecture/technology-stack.md) for **why a windowed app, TypeScript, React, Rust and Tauri**, and why **Ink is only a deferred optional terminal client**. Tauri must pass its prototype gate before final acceptance.

## License

Licensed under the [MIT License](LICENSE). See [ADR-015](docs/architecture/adr/ADR-015-project-license.md) ([#169](https://github.com/xavieryeo/lets-see/issues/169)) for the choice and trade-offs.
