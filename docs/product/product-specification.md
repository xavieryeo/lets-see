# lets-see — Product specification v0.1.0

Status: proposed baseline. GitHub issues are the canonical detailed requirements register; this document consolidates product scope and release boundaries.

## Vision
An IDE for AI agents: develop, operate, inspect, secure, evaluate and optimise model-agnostic agents. Desktop-first, local-first, headless by design. Coding is one application, not the product boundary.

## Users and use cases
Primary: AI agent engineers, AI security engineers, DevSecOps/SRE practitioners. Secondary: software engineers, model researchers and evaluation engineers. Future: auditors and enterprise AI platform teams.

UC-01 interact with an LLM; UC-02 execute a coding task; UC-03 develop specialised agents; UC-04 inspect agent behaviour; UC-05 constrain execution; UC-06 delegate capabilities; UC-07 compare harnesses; UC-08 compare models; UC-09 investigate prompt injection in authorised environments; UC-10 audit execution; UC-11 diagnose context problems; UC-12 evaluate model identity probabilistically; UC-13 develop defensive security tools; UC-14 reproduce experiments; UC-15 visualise software architecture; UC-16 optimise cost; UC-17 operate remote runtimes; UC-18 automate evaluations in CI.

## Product principles
- PP-01 Headless by design, graphical by default.
- PP-02 Security by construction.
- PP-03 Least privilege.
- PP-04 Independent enforcement.
- PP-05 Model neutrality.
- PP-06 Progressive disclosure.
- PP-07 Observability by default.
- PP-08 Composability.
- PP-09 Local-first.
- PP-10 Explicit user control.
- PP-11 Reproducibility.
- PP-12 Evaluation-driven engineering.
- PP-13 Failure transparency.
- PP-14 Privacy by design.
- PP-15 Visual excellence.
- PP-16 Incremental complexity.
- PP-17 No silent degradation of security guarantees.

## Product domains
| Domain | Scope |
|---|---|
| Agent Workspace | Streaming conversations, sessions, model selection, tools, coding workflows, repository navigation, terminal and approvals |
| Agent Studio | Declarative agent definitions, tools, skills, MCP, context strategies, hooks, subagents and versioned configuration |
| Agent Inspector | Model requests/responses, context assembly, tool results, state transitions, token usage, timelines, causal traces and recorded event replay |
| Security Workbench | Policy, authority, capabilities, delegation, approvals, sandbox selection, enforcement evidence and security regression testing |
| Model Laboratory | Controlled provider/model comparisons, tool-calling fidelity, structured outputs, latency, context handling and probabilistic fingerprinting |
| Evaluation Studio | Versioned tasks, graders, isolated environments, repeatable trials, costs, baselines and CI |

## Architecture
React/TypeScript desktop client (Tauri provisional; Electron fallback) communicates through a versioned client protocol with a headless Rust agent runtime. Runtime handles model providers, context, sessions, orchestration, tool definitions and events. Independent execution broker authorises capability-bearing operations and enforces scoped access through interchangeable isolation backends. nono is the preferred initial integration; Linux is the primary security engineering platform. Desktop portability and enforcement portability are separate concerns.

Reuse established editor, terminal, graph, chart, database, cryptographic and isolation infrastructure. Build the agent harness, event model, context strategy, capability delegation, execution mediation, inspection and evaluation workflows.

Candidate dependencies (not mandates): Tauri, React, Vite, Tailwind, Radix/shadcn, Motion, Zustand, Dockview, xterm.js, Monaco, React Flow/Cytoscape, ECharts, Tokio, SQLite and OpenTelemetry.

## Requirements register
| Category | Issues |
|---|---|
| Providers FR-M01–M16 | #2–#17 |
| Runtime FR-A01–A16 | #18–#21, #23–#34 |
| Context FR-C01–C13 | #35–#47 |
| Tools FR-T01–T15 | #48–#62 |
| Security FR-S01–S20 | #63–#82 |
| Observability FR-O01–O15 | #83–#97 |
| UI FR-U01–U18 | #98–#115 |
| Evaluation FR-E01–E12 | #116–#127 |
| Persistence FR-D01–D12 | #128–#139 |
| Security invariants SI-01–16 | #140–#155 |
| Architecture decisions ADR-001–015 | #1, #156–#169 |
| Non-functional NFR-01–22 | #170–#191 |
| MVP-0 acceptance AC-01–15 | #192–#206 |
| MVP-1 acceptance SAC-01–15 | #207–#221 |

P0 foundation; P1 practical security platform; P2 advanced differentiation; P3 future expansion. Priority is sequencing, not permission to weaken security. Applicable security invariants are mandatory gates.

## MVP-0 — foundation
Desktop shell, two independently implemented provider adapters, streaming conversation, bounded agent loop, deterministic tools, schema validation, cancellation, explicit authorisation interface, structured events, basic inspector, local persistence, protected credentials, headless test client and deterministic fixtures. No arbitrary shell, general filesystem modification, arbitrary network tools, MCP execution or executable plugins. Configured provider communication is permitted. All AC tickets must be verified.

## MVP-1 — first meaningful security release
MVP-0 plus independent trusted execution broker, verified nono backend, scoped filesystem/process access, verified network restrictions where claimed, operation-bound approvals, security inspection, repository workflows and adversarial tests. All applicable SAC and SI gates must be verified before release. No privileged feature ships without independent enforcement and negative tests.

## Security assumptions
Treat models, model outputs, repositories, documents, external tools, MCP servers, plugins, subagents, frontend, runtime dependencies and evaluation workloads as potentially malicious. Define exact adversary capabilities and trusted computing base in the threat model. The broker must independently validate caller identity, capability, scope and actual operation. Deny unknown authority and fail closed. Approval is not a substitute for isolation. A security display must reflect actual backend enforcement. Revocation of new operations and termination of existing processes are distinct.

## Observability
Structured, versioned events for sessions, inference, context, tools, authorisation, capabilities, execution, sandbox, evaluation and errors. Correlation, provenance, ordering, redaction and retention require explicit design. Recorded replay does not re-execute actions; inference reproducibility is not guaranteed. Do not claim access to hidden model reasoning.

## UX
Claude Code-inspired conversational hierarchy and progressive disclosure; Zed/Linear-inspired visual refinement; DevTools/Burp-inspired inspection. Conversation first, technical panels on demand. Dark/light themes, keyboard and mouse navigation, accessibility, reduced motion, responsive streaming and visible execution status. Performance targets in NFR tickets remain provisional until measured on reference hardware.

## Non-goals
Foundation-model training; full VS Code parity; custom terminal or desktop renderer; custom cryptography, kernel isolation mechanisms, hypervisor or vector database; universal prompt-injection immunity, impossible-to-escape sandbox claims, hidden reasoning extraction, guaranteed inference determinism or certain model identification; initial enterprise SaaS, plugin marketplace or visual workflow language.

## Roadmap (dependency-oriented)
M00 foundations and ADRs; M01 desktop/runtime skeleton; M02 inference and conversation; M03 minimal harness; M04 observability and MVP-0; M05 secure execution; M06 practical workspace and MVP-1; M07 extensibility; M08 evaluation infrastructure; M09 advanced security and delegation; M10 model laboratory; M11 advanced inspection; M12 advanced orchestration.

## Evaluation and engineering
Measure task completion, reliability, cost/tokens per successful task, rendering latency, event completeness, diagnostic time, enforcement tests, reproducibility and provider integration effort. Security is a gate, not a weighted score. Each implementation task is a dependency-ordered benchmark-inspired PR with prerequisites, learning objectives, problem statement, constraints, non-goals, observable acceptance criteria, tests, security cases, alternatives, trade-offs and reviewer walkthrough. No arbitrary lesson count.

## Risks and unresolved decisions
Scope creep, false security confidence, overprivileged execution, provider differences, UI complexity, WebView consistency, Rust learning curve, dependency growth, sensitive logs, nondeterministic evaluations, backend coupling, cross-platform differences, protocol drift and untrusted benchmark workloads. Resolve through staged releases, explicit contracts, threat modelling, prototypes, independent tests and ADRs. Licensing remains undecided.

This is a condensed repository baseline of the conversational PRD; detailed FR/NFR/SI/ADR/AC/SAC requirements are tracked in the linked issue ranges. Product principles and use cases remain document-level identifiers.
