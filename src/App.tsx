import { useState } from "react";

export function App() {
  const [checked, setChecked] = useState(false);

  return (
    <main className="welcome">
      <div className="brand" aria-hidden="true">
        &gt;_
      </div>
      <p className="eyebrow">DEV-001 / DESKTOP FOUNDATION</p>
      <h1>lets-see</h1>
      <p className="intro">
        A workbench for developing, inspecting and securing AI agents.
      </p>
      <section className="check" aria-labelledby="check-title">
        <h2 id="check-title">First interaction</h2>
        <p>
          Verify that the interface responds to a local action. No native
          command, network request or agent is involved.
        </p>
        <button type="button" onClick={() => setChecked((value) => !value)}>
          {checked ? "Reset check" : "Run UI check"}
        </button>
        <p className="result" role="status">
          {checked ? "UI interaction confirmed." : "Ready to test."}
        </p>
      </section>
      <footer>Local prototype · Agent execution not implemented</footer>
    </main>
  );
}
