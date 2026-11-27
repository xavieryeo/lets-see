import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const config = JSON.parse(
  readFileSync(new URL("../src-tauri/tauri.conf.json", import.meta.url), "utf8"),
);
const host = readFileSync(
  new URL("../src-tauri/src/main.rs", import.meta.url),
  "utf8",
);

test("bootstrap explicitly grants no native permissions or remote capability", () => {
  assert.equal(config.app.withGlobalTauri, false);
  assert.deepEqual(
    config.app.security.capabilities.map(({ windows, permissions, remote }) => ({
      windows,
      permissions,
      remote,
    })),
    [{ windows: ["main"], permissions: [], remote: undefined }],
  );
  assert.equal(config.app.security.assetProtocol.enable, false);
  assert.equal(config.build.devUrl, "http://127.0.0.1:1420");
  assert.equal(config.app.windows[0].url, undefined);
});

test("production CSP is separate from development HMR policy", () => {
  const csp = config.app.security.csp;
  assert.match(csp, /connect-src 'none'/);
  assert.match(csp, /object-src 'none'/);
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval|https?:|wss?:/);
  assert.match(config.app.security.devCsp, /ws:\/\/127\.0\.0\.1:1420/);
});

test("host has no custom invoke handler or plugin registration", () => {
  assert.doesNotMatch(host, /\.invoke_handler\s*\(|\.plugin\s*\(/);
  assert.doesNotMatch(host, /#\[tauri::command\]/);
});
