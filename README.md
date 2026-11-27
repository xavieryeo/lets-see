# lets-see

Desktop-first, security-oriented AI agent engineering workbench for developing, operating, inspecting, securing and evaluating model-agnostic agents.

## Architecture

- Clean-room Rust headless agent runtime; TypeScript/React desktop client; Tauri provisional pending ADR-001 (#1).
- Independent trusted execution broker, capability-based authority, interchangeable sandbox backends (nono preferred initially).
- Local-first persistence, structured execution events, progressive disclosure.
- Linux-first security enforcement; cross-platform desktop target.

## Release gates

**MVP-0:** streaming conversation, two provider adapters, bounded agent loop, deterministic tools only, policy interface, structured events, basic inspector, local persistence and headless operation. No arbitrary shell, filesystem writes, network tools, MCP execution or executable plugins.

**MVP-1:** independent broker, verified sandbox, scoped filesystem and subprocess execution, operation-bound approvals, security inspector, repository workflows and adversarial tests. No privileged capability may ship before enforcement and negative tests are verified.

## Requirements and traceability

See [GitHub Issues](https://github.com/xavieryeo/lets-see/issues). Stable IDs appear in issue titles: FR (functional requirements), NFR (non-functional requirements), SI (security invariants), ADR (architecture decisions), AC/SAC (acceptance criteria). P0 = foundation; P1 = security platform; P2 = advanced; P3 = future. Security gates supersede feature priorities.

Implementation tasks should be bounded, dependency-ordered, benchmark-inspired PRs with acceptance criteria, positive and negative tests, trade-offs and reviewer walkthroughs. Requirement issues are not necessarily implementation-sized tasks.

No licence or final desktop framework decision has been made.
