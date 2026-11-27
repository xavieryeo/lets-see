# DEV-001 — Desktop bootstrap walkthrough

Issue: [#223](https://github.com/xavieryeo/lets-see/issues/223). Related: #98, #1, #168, #188, #63, #152.

**Status:** candidate implementation; native execution and CI results are not yet verified. Tauri is still provisional. This is not an agent sandbox.

## What you are building

Tauri runs a Rust native host that creates an operating-system window and embeds a system WebView. React renders HTML/CSS into that WebView; TypeScript checks application types before they are erased during the build. Vite serves frontend assets on loopback in development and produces static assets for the native executable in a build. Cargo resolves and compiles Rust dependencies. None of these is an agent runtime.

The welcome button uses React's useState. A click schedules a render with updated local state. It does not invoke Rust, access a file, send a model request, or exercise IPC. Closing the native window is handled by Tauri and the OS.

## Platform scope

Desktop development and CI target Linux x86-64 (Ubuntu 24.04) and Windows x64 (MSVC, Windows 11 as the initial local validation target). Both run the same React UI and Rust/Tauri desktop host. See [ADR-014](../architecture/adr/ADR-014-platform-support.md).

Agent sandboxing, OS-level workload restrictions, nono and independent execution-broker enforcement remain Linux-only initial targets. Windows must not fall back to unrestricted agent execution. No agent execution exists in this increment on either OS. Desktop-level CSP, permission minimization, dependency checks and input validation apply equally on both.

## Run on Linux (Ubuntu 24.04)

Install the [official Tauri prerequisites](https://v2.tauri.app/start/prerequisites/). On Ubuntu:

    sudo apt update
    sudo apt install build-essential curl wget file libwebkit2gtk-4.1-dev libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

Install Rust via rustup from its official site, and Node via your trusted version manager. The repository pins Rust 1.100.0 and Node 22.23.5. Record actual versions with rustc -V, cargo -V, node -v and npm -v.

## Run on Windows (x64)

Use a native Windows PowerShell session, not WSL, for the Windows desktop executable.

1. Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with the **Desktop development with C++** workload, including the MSVC x64 compiler and Windows SDK.
2. Ensure the [Microsoft Edge WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) is installed (normally present on Windows 11).
3. Install Rust using [rustup](https://rustup.rs/) and select the x64 MSVC host toolchain. Install the Node version in .nvmrc with a trusted version manager.

From the repository root:

    rustup show
    rustc -vV
    node -v
    npm -v

The host reported by Rust should be x86_64-pc-windows-msvc. If Rust was installed with the GNU host, install the pinned MSVC toolchain and configure rustup to use the MSVC host for this repository. See [Tauri Windows prerequisites](https://v2.tauri.app/start/prerequisites/#windows). The MSVC compiler and WebView2 are desktop dependencies, not agent security backends.

## Shared development and build commands

The following commands work from the repository root on both platforms, using Bash on Linux or PowerShell on Windows.

**Lockfile gate:** The initial authoring environment could not reach npm/crates.io or run Rust. Direct versions are exact, but transitive resolution is not reproducible until both lockfiles are generated and reviewed. Generate once on a network-enabled, trusted workstation:

    npm install --package-lock-only --ignore-scripts
    cargo generate-lockfile --manifest-path src-tauri/Cargo.toml
    npm ci

Review package-lock.json and src-tauri/Cargo.lock; commit both. Subsequent installs must use npm ci and Cargo's --locked mode. Each OS job can generate missing locks as OS-labelled review artifacts, then fails the merge gate until both are checked in. Review the cross-platform optional dependencies in the npm lockfile and verify that both CI jobs accept the same committed lockfiles. The earlier Linux job failed inside npm's resolver (edgesOut); the cause remains unconfirmed. Never treat a generated lock as a vulnerability audit.

    npm run check
    npm run build
    cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
    cargo clippy --manifest-path src-tauri/Cargo.toml --locked --all-targets -- -D warnings
    cargo test --manifest-path src-tauri/Cargo.toml --locked
    npm run desktop:dev
    npm run desktop:build

The last command builds the native executable without an installer. Expected outputs: src-tauri/target/release/lets-see on Linux and src-tauri/target/release/lets-see.exe on Windows (unless Cargo target-directory settings are overridden). WebView2 must be available on Windows.

The CI matrix compiles release executables with the bundled-asset production protocol and uploads successful build outputs as platform-labelled **unsigned, test-only** artifacts. A produced artifact is not proof of a working GUI or a completed dependency review. DEV-007 covers installer packaging and broader platform verification. Rust tests need the built frontend assets.

## Important files and flow

| File | Responsibility |
| --- | --- |
| package.json / .nvmrc | JS dependencies, scripts and Node version |
| vite.config.ts | Loopback development server, production build and test environment |
| src/main.tsx | React entry point; mounts App into index.html |
| src/App.tsx | Welcome view and local UI state |
| src/styles.css | Small responsive baseline; not the final design system |
| src-tauri/Cargo.toml / rust-toolchain.toml | Rust dependencies and toolchain |
| src-tauri/build.rs | Tauri build-time configuration/assets integration |
| src-tauri/src/main.rs | Native application entry point; starts event loop |
| src-tauri/tauri.conf.json | Window, assets, CSP and capability policy |
| tests/security.test.mjs | Static regression checks for the intentionally small exposed surface |
| .github/workflows/dev-001.yml | Linux/Windows desktop CI matrix and lockfile review gate |

    Human input
        |
        v
    [ OS window / WebView: React UI + local state ]
        |  IPC boundary: no granted commands, no application handler
        X
    [ Rust/Tauri host: native lifecycle; host retains OS authority ]
        |
        X  Future protocol and independently enforced broker NOT implemented
    [ Future headless runtime and execution broker ]

The browser-facing UI is not an authority. This bootstrap grants no IPC permissions through the explicit empty-permission capability, includes no shell/fs/http plugins, registers no custom commands, and does not enable the asset protocol. Production CSP blocks arbitrary resource connections; the development policy separately permits loopback HMR and inline dev styles. Development assets must come from the trusted local dev server; do not expose it on the LAN or run it against untrusted local processes. No real isolation or complete threat model is claimed.

## Trade-offs

- Tauri versus Electron: use the system WebView and Rust host for the prototype; Electron provides a more consistent bundled renderer but increases bundled runtime/maintenance. Neither isolates future agent tools by itself. #1 stays open.
- Vite with plain React JSX versus adding a React fast-refresh plugin: use the built-in JSX transform and ordinary reloads to keep the first dependency set small; fast refresh can be added when justified.
- Native decorations versus custom chrome: use OS controls now, so DEV-002 can teach window APIs deliberately.
- No generic native invocation: introduce only narrow commands in subsequent issues. A capability allowlist is not a sandbox for arbitrary Rust code.

## Evidence and review checklist

- [ ] Verify both Linux and Windows CI jobs and review the same committed lockfiles.
- [ ] On each available Linux and Windows target workstation: launch, resize, minimize/restore, click Run UI check, reset, use keyboard Tab and Enter, close. Confirm the process exits. Record any untested platform explicitly.
- [ ] Capture a screenshot and record OS, hardware, WebView, Node, npm and Rust versions.
- [ ] In a disposable development session with DevTools, attempt only a fictitious unregistered command via the internal invoke API (if exposed): window.__TAURI_INTERNALS__.invoke("__dev001_not_registered__"). It must reject or be unavailable. No actual privileged operation is needed. This is a runtime check, distinct from the static tests.
- [ ] Run the built executable; verify local interaction without the dev server.
- [ ] Record cold-start timing method and samples if measured; no startup target is certified by this PR.

### Review questions

1. Which process runs React, and which component owns the native window?
2. What is different about the Vite dev server and bundled production assets?
3. Why does clicking the button not exercise native IPC or prove that any sandbox works?
4. Why do exact direct dependency versions not replace lockfiles?
5. What would change in the trust boundary if a future native command could read arbitrary paths?

## Known limitations

No native window was launched in the authoring environment. Windows build support is configured, not yet verified; no native Windows agent isolation or broker implementation is in scope. No screenshots or performance measurements are claimed. Lockfiles are a blocking follow-up to complete this same PR, not a separate curriculum ticket. No custom chrome, editor, terminal, settings, agent runtime, providers, credentials, or installer packaging. Existing architecture and licensing documents are unchanged.
