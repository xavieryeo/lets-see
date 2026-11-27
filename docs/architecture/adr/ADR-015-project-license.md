# ADR-015 — License the project under MIT

- **Status:** Accepted — applies when the LICENSE file is merged
- **Date:** 2026-11-27
- **Issue:** [#169](https://github.com/xavieryeo/lets-see/issues/169)
- **Decision owner:** Repository maintainer

## Context and options

The repository needs an explicit software license before substantive contributions and integrations. Considered:

- **MIT:** short, permissive, broadly understood; retains attribution/notice and disclaims warranty.
- **Apache-2.0:** permissive, with an express patent license and more conditions around notices and changes.
- **GPL-3.0:** reciprocal/copyleft; stronger downstream sharing obligations but a different distribution model.
- **No license:** does not grant typical reuse rights and is unsuitable for intended open collaboration.

## Decision

Choose the **MIT License**. Place the canonical license text in [LICENSE](../../../LICENSE), using **Copyright (c) 2026 xavieryeo**. The license covers the repository's own code and documentation, subject to third-party rights. It allows use, modification, redistribution and commercial use, including in proprietary works, provided the license and copyright notice are retained.

## Trade-offs and constraints

- MIT does **not** obligate derivative users to publish source code.
- Unlike Apache-2.0, MIT does not contain an explicit patent-license grant. Revisit if patent terms become a central project requirement.
- The warranty disclaimer does not guarantee security, fitness, sandbox isolation or safe model behaviour.
- Dependencies, external tools, imported snippets, assets, model weights and third-party binaries each have their **own licenses** and attribution/compliance requirements. MIT on this repository does not relicense them.
- Contributions should be submitted with the expectation they are distributed under the repository license; a separate contributor policy can be introduced if required.
- Maintain SPDX and third-party notices when code or packaged artifacts justify them; review dependency licenses in CI.

## Verification

- A root LICENSE file contains the unmodified standard MIT terms, year and owner.
- The license and decision are reviewed in the same PR. Close [#169](https://github.com/xavieryeo/lets-see/issues/169) when merged.
