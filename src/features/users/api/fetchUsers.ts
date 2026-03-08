import type { UsersResponse } from "../model/types";

const API_BASE_URL = "https://dummyjson.com";

type FetchUsersParams = {
  query: string;
  skip: number;
  limit: number;
  signal?: AbortSignal;
};

export const fetchUsers = async ({
  query,
  skip,
  limit,
  signal
}: FetchUsersParams): Promise<UsersResponse> => {
  const endpoint = query.trim() ? "/users/search" : "/users";
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (query.trim()) {
    url.searchParams.set("q", query.trim());
  }

  url.searchParams.set("limit", String(limit));
  url.searchParams.set("skip", String(skip));

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }

  const data = (await response.json()) as UsersResponse;
  return data;
};
