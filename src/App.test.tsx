import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";

let container: HTMLDivElement;
let root: Root;

beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root.render(<App />);
  });
});

afterEach(async () => {
  await act(async () => {
    root.unmount();
  });
  container.remove();
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: false });
});

describe("welcome screen", () => {
  it("identifies the application and its current limitations", () => {
    expect(container.querySelector("h1")?.textContent).toBe("lets-see");
    expect(container.textContent).toContain("Agent execution not implemented");
    expect(container.querySelector('[role="status"]')?.textContent).toBe(
      "Ready to test.",
    );
  });

  it("changes visible state and can reset it", async () => {
    const button = container.querySelector("button");
    if (!button) throw new Error("Missing UI check button");
    await act(async () => {
      button.click();
    });
    expect(button.textContent).toBe("Reset check");
    expect(container.querySelector('[role="status"]')?.textContent).toBe(
      "UI interaction confirmed.",
    );
    await act(async () => {
      button.click();
    });
    expect(button.textContent).toBe("Run UI check");
    expect(container.querySelector('[role="status"]')?.textContent).toBe(
      "Ready to test.",
    );
  });
});
