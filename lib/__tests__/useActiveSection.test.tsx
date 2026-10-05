import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pickActive, sectionOrder, useActiveSection } from "@/lib/useActiveSection";

describe("pickActive", () => {
  it("picks the last intersecting section in document order", () => {
    expect(pickActive(new Set(["services", "about"]), false, "hero")).toBe("about");
    expect(pickActive(new Set(["about", "hero"]), false, "hero")).toBe("about");
  });

  it("forces contact at the bottom of the page", () => {
    expect(pickActive(new Set(["about"]), true, "about")).toBe("contact");
  });

  it("keeps the previous section when nothing crosses the band", () => {
    expect(pickActive(new Set(), false, "services")).toBe("services");
  });
});

describe("useActiveSection", () => {
  let fire: (entries: { id: string; isIntersecting: boolean }[]) => void;

  beforeEach(() => {
    for (const id of sectionOrder) {
      const el = document.createElement("section");
      el.id = id;
      document.body.appendChild(el);
    }
    class FakeObserver {
      constructor(cb: IntersectionObserverCallback) {
        fire = (entries) =>
          cb(
            entries.map(
              (e) =>
                ({
                  target: document.getElementById(e.id)!,
                  isIntersecting: e.isIntersecting,
                }) as unknown as IntersectionObserverEntry,
            ),
            this as unknown as IntersectionObserver,
          );
      }
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal("IntersectionObserver", FakeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  function Probe() {
    return <span data-testid="active">{useActiveSection()}</span>;
  }

  it("tracks state across partial-change callbacks", () => {
    const { getByTestId } = render(<Probe />);
    expect(getByTestId("active").textContent).toBe("hero");

    act(() => fire([{ id: "services", isIntersecting: true }]));
    expect(getByTestId("active").textContent).toBe("services");

    act(() => fire([{ id: "about", isIntersecting: true }]));
    expect(getByTestId("active").textContent).toBe("about");

    // Only the change is reported; about must stay active.
    act(() => fire([{ id: "services", isIntersecting: false }]));
    expect(getByTestId("active").textContent).toBe("about");
  });
});
