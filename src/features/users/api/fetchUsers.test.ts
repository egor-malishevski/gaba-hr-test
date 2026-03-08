import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchUsers } from "./fetchUsers";

describe("fetchUsers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses /users endpoint without query", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        users: [],
        total: 0,
        skip: 0,
        limit: 10
      })
    } as Response);

    await fetchUsers({ query: "", skip: 10, limit: 10 });

    const [url] = fetchMock.mock.calls[0];
    const parsedUrl = new URL(String(url));

    expect(parsedUrl.pathname).toBe("/users");
    expect(parsedUrl.searchParams.get("limit")).toBe("10");
    expect(parsedUrl.searchParams.get("skip")).toBe("10");
    expect(parsedUrl.searchParams.get("q")).toBeNull();
  });

  it("uses /users/search endpoint with query", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        users: [],
        total: 0,
        skip: 0,
        limit: 10
      })
    } as Response);

    await fetchUsers({ query: "Emily", skip: 0, limit: 10 });

    const [url] = fetchMock.mock.calls[0];
    const parsedUrl = new URL(String(url));

    expect(parsedUrl.pathname).toBe("/users/search");
    expect(parsedUrl.searchParams.get("q")).toBe("Emily");
  });

  it("throws on non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500
    } as Response);

    await expect(fetchUsers({ query: "", skip: 0, limit: 10 })).rejects.toThrow(
      "Ошибка загрузки: 500"
    );
  });
});
