import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchUsers } from "../api/fetchUsers";
import { USERS_PER_PAGE } from "../model/constants";
import type { User } from "../model/types";
import { useDebounce } from "../../../shared/hooks/useDebounce";

const REQUEST_DEBOUNCE_MS = 350;

const getInitialStateFromUrl = () => {
  if (typeof window === "undefined") {
    return {
      initialQuery: "",
      initialPage: 1
    };
  }

  const params = new URLSearchParams(window.location.search);
  const rawQuery = params.get("q")?.trim() ?? "";
  const rawPage = Number(params.get("page"));
  const initialPage =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  return {
    initialQuery: rawQuery,
    initialPage
  };
};

type UseUsersCatalogResult = {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
  searchInput: string;
  activeQuery: string;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isEmpty: boolean;
  isLoading: boolean;
  error: string | null;
  paginationText: string;
  setSearchInput: (value: string) => void;
  submitSearch: () => void;
  resetSearch: () => void;
  retry: () => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  goToPage: (nextPage: number) => void;
};

const useUsersCatalog = (): UseUsersCatalogResult => {
  const { initialQuery, initialPage } = useMemo(
    () => getInitialStateFromUrl(),
    []
  );

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [searchInput, setSearchInputState] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);
  const [debounceBypassRequestId, setDebounceBypassRequestId] = useState<
    number | null
  >(null);
  const activeControllerRef = useRef<AbortController | null>(null);
  const requestSequenceRef = useRef(0);

  const totalPages = Math.max(1, Math.ceil(total / USERS_PER_PAGE));
  const skip = (page - 1) * USERS_PER_PAGE;
  const debounceDelay = hasLoadedOnce ? REQUEST_DEBOUNCE_MS : 0;
  const requestParams = useMemo(
    () => ({
      query: activeQuery,
      skip,
      requestId
    }),
    [activeQuery, requestId, skip]
  );
  const debouncedRequestParams = useDebounce(
    requestParams,
    debounceBypassRequestId === requestId ? 0 : debounceDelay
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (activeQuery) {
      params.set("q", activeQuery);
    } else {
      params.delete("q");
    }

    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }

    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`;
    window.history.replaceState({}, "", nextUrl);
  }, [activeQuery, page]);

  useEffect(() => {
    activeControllerRef.current?.abort();

    setIsLoading(true);
    setError(null);
  }, [activeQuery, requestId, skip]);

  useEffect(() => {
    const controller = new AbortController();
    const requestSequence = requestSequenceRef.current + 1;
    requestSequenceRef.current = requestSequence;
    activeControllerRef.current = controller;

    const loadUsers = async () => {
      try {
        const data = await fetchUsers({
          query: debouncedRequestParams.query,
          skip: debouncedRequestParams.skip,
          limit: USERS_PER_PAGE,
          signal: controller.signal
        });

        if (requestSequenceRef.current !== requestSequence) {
          return;
        }

        setUsers(data.users);
        setTotal(data.total);
        setHasLoadedOnce(true);
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === "AbortError") {
          return;
        }

        if (requestSequenceRef.current !== requestSequence) {
          return;
        }

        setError("Не удалось загрузить пользователей. Попробуйте еще раз.");
        setHasLoadedOnce(true);
      } finally {
        if (
          requestSequenceRef.current === requestSequence &&
          !controller.signal.aborted &&
          activeControllerRef.current === controller
        ) {
          setIsLoading(false);
          activeControllerRef.current = null;
        }
      }
    };

    loadUsers();

    return () => {
      controller.abort();
      if (activeControllerRef.current === controller) {
        activeControllerRef.current = null;
      }
    };
  }, [debouncedRequestParams]);

  useEffect(() => {
    if (!hasLoadedOnce) {
      return;
    }

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [hasLoadedOnce, page, totalPages]);

  const paginationText = useMemo(() => {
    if (!hasLoadedOnce && isLoading) {
      return "Загрузка данных...";
    }

    if (total === 0) {
      return "Результаты не найдены";
    }

    const from = skip + 1;
    const to = Math.min(skip + USERS_PER_PAGE, total);
    return `Показаны ${from}-${to} из ${total}`;
  }, [hasLoadedOnce, isLoading, skip, total]);

  const isInitialLoading = isLoading && !hasLoadedOnce;
  const isRefreshing = isLoading && hasLoadedOnce;
  const isEmpty = hasLoadedOnce && !isLoading && !error && users.length === 0;

  const setSearchInput = useCallback((value: string) => {
    setSearchInputState(value);
  }, []);

  const submitSearch = useCallback(() => {
    const nextQuery = searchInput.trim();

    if (nextQuery === activeQuery && page === 1) {
      setRequestId((currentRequestId) => currentRequestId + 1);
      return;
    }

    setPage(1);
    setActiveQuery(nextQuery);
  }, [activeQuery, page, searchInput]);

  const resetSearch = useCallback(() => {
    setSearchInputState("");

    if (!activeQuery && page === 1) {
      return;
    }

    setActiveQuery("");
    setPage(1);
  }, [activeQuery, page]);

  const retry = useCallback(() => {
    setRequestId((currentRequestId) => {
      const nextRequestId = currentRequestId + 1;
      setDebounceBypassRequestId(nextRequestId);
      return nextRequestId;
    });
  }, []);

  useEffect(() => {
    if (debounceBypassRequestId === requestId) {
      setDebounceBypassRequestId(null);
    }
  }, [debounceBypassRequestId, requestId]);

  const goToPrevPage = useCallback(() => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPage((currentPage) => Math.min(totalPages, currentPage + 1));
  }, [totalPages]);

  const goToPage = useCallback(
    (nextPage: number) => {
      setPage(Math.max(1, Math.min(totalPages, nextPage)));
    },
    [totalPages]
  );

  return {
    users,
    total,
    page,
    totalPages,
    searchInput,
    activeQuery,
    isInitialLoading,
    isRefreshing,
    isEmpty,
    isLoading,
    error,
    paginationText,
    setSearchInput,
    submitSearch,
    resetSearch,
    retry,
    goToPrevPage,
    goToNextPage,
    goToPage
  };
};

export { useUsersCatalog };
