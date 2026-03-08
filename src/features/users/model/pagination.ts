type PageItem = number | "left-ellipsis" | "right-ellipsis";

const buildPageItems = (currentPage: number, lastPage: number): PageItem[] => {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "right-ellipsis", lastPage];
  }

  if (currentPage >= lastPage - 3) {
    return [
      1,
      "left-ellipsis",
      lastPage - 4,
      lastPage - 3,
      lastPage - 2,
      lastPage - 1,
      lastPage
    ];
  }

  return [
    1,
    "left-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "right-ellipsis",
    lastPage
  ];
};

export type { PageItem };
export { buildPageItems };
