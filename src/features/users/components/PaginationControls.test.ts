import { describe, expect, it } from "vitest";
import { buildPageItems } from "../model/pagination";

describe("buildPageItems", () => {
  it("returns all pages when total pages are small", () => {
    expect(buildPageItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns stable leading layout near start", () => {
    expect(buildPageItems(3, 12)).toEqual([
      1,
      2,
      3,
      4,
      5,
      "right-ellipsis",
      12
    ]);
  });

  it("returns stable centered layout in middle", () => {
    expect(buildPageItems(6, 12)).toEqual([
      1,
      "left-ellipsis",
      5,
      6,
      7,
      "right-ellipsis",
      12
    ]);
  });

  it("returns stable trailing layout near end", () => {
    expect(buildPageItems(11, 12)).toEqual([
      1,
      "left-ellipsis",
      8,
      9,
      10,
      11,
      12
    ]);
  });
});
