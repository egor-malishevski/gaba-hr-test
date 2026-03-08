import type { FormEvent } from "react";
import { PaginationControls } from "../features/users/components/PaginationControls";
import { SearchForm } from "../features/users/components/SearchForm";
import { UsersGrid } from "../features/users/components/UsersGrid";
import { UsersGridSkeleton } from "../features/users/components/UsersGridSkeleton";
import { useUsersCatalog } from "../features/users/hooks/useUsersCatalog";
import { USERS_PER_PAGE } from "../features/users/model/constants";
import "./App.css";

const App = () => {
  const {
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
  } = useUsersCatalog();

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch();
  };

  return (
    <main className="page">
      <section className="container">
        <header className="header">
          <h1>Каталог пользователей</h1>
          <p>Поиск и просмотр пользователей из публичного API DummyJSON</p>
        </header>

        <SearchForm
          value={searchInput}
          canReset={Boolean(searchInput || activeQuery)}
          onValueChange={setSearchInput}
          onSubmit={handleSearchSubmit}
          onReset={resetSearch}
        />

        <div className="toolbar">
          <span>{paginationText}</span>
          <span className="toolbar-page">
            Страница {Math.min(page, totalPages)} из {totalPages}
          </span>
        </div>

        {!!activeQuery && (
          <div className="query-pill">
            Активный поиск: <strong>{activeQuery}</strong>
          </div>
        )}

        <div className="results" aria-busy={isLoading}>
          {!!error && (
            <div className="state error">
              <span>{error}</span>
              <button type="button" className="retry-button" onClick={retry}>
                Повторить
              </button>
            </div>
          )}

          {users.length > 0 && <UsersGrid users={users} />}
          {isInitialLoading && <UsersGridSkeleton count={USERS_PER_PAGE} />}

          {isEmpty && (
            <div className="state state-empty">
              Ничего не найдено по текущему запросу.
            </div>
          )}

          {isRefreshing && (
            <div
              className={
                users.length > 0 ? "loading-overlay" : "loading-overlay initial"
              }
            >
              <span className="loading-spinner" aria-hidden="true" />
              <span>Загрузка...</span>
            </div>
          )}
        </div>

        <PaginationControls
          page={page}
          totalPages={totalPages}
          total={total}
          isLoading={isLoading}
          onPrev={goToPrevPage}
          onNext={goToNextPage}
          onPageSelect={goToPage}
        />
      </section>
    </main>
  );
};

export { App };
