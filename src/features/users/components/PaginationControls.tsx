import { buildPageItems } from "../model/pagination";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  total: number;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPageSelect: (page: number) => void;
};

const PaginationControls = ({
  page,
  totalPages,
  total,
  isLoading,
  onPrev,
  onNext,
  onPageSelect
}: PaginationControlsProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageItems = buildPageItems(page, totalPages);

  return (
    <footer className="pagination">
      <button
        type="button"
        className="nav-button"
        onClick={onPrev}
        disabled={page <= 1 || isLoading}
        aria-label="Предыдущая страница"
      >
        ←
      </button>
      {pageItems.map((item) => {
        if (item === "left-ellipsis" || item === "right-ellipsis") {
          return (
            <span key={item} className="pagination-ellipsis">
              ...
            </span>
          );
        }

        return (
          <button
            key={item}
            type="button"
            className={item === page ? "page-button active" : "page-button"}
            onClick={() => onPageSelect(item)}
            disabled={isLoading || total === 0}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        );
      })}
      <button
        type="button"
        className="nav-button"
        onClick={onNext}
        disabled={page >= totalPages || isLoading || total === 0}
        aria-label="Следующая страница"
      >
        →
      </button>
    </footer>
  );
};

export { PaginationControls };
