import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  it("updates value only after delay", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebounce(value, delayMs),
      {
        initialProps: {
          value: "initial",
          delayMs: 300
        }
      }
    );

    rerender({ value: "next", delayMs: 300 });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("next");

    vi.useRealTimers();
  });

  it("applies immediately when delay is zero", () => {
    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebounce(value, delayMs),
      {
        initialProps: {
          value: "a",
          delayMs: 0
        }
      }
    );

    rerender({ value: "b", delayMs: 0 });
    expect(result.current).toBe("b");
  });
});
