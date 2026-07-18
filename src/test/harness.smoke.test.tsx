import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// Proves the jsdom + React + Testing Library + jest-dom pipeline works.
// This is the harness self-check that unblocks component stories; it does not
// depend on any app code.
describe("test harness (jsdom / RTL)", () => {
  it("renders a component and applies jest-dom matchers", () => {
    render(<div role="status">harness ok</div>);
    expect(screen.getByRole("status")).toHaveTextContent("harness ok");
  });
});
