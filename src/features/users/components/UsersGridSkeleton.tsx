type UsersGridSkeletonProps = {
  count: number;
};

const UsersGridSkeleton = ({ count }: UsersGridSkeletonProps) => {
  const items = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="grid" aria-hidden="true">
      {items.map((item) => (
        <article key={item} className="card skeleton-card">
          <div className="skeleton-avatar" />
          <div className="card-body">
            <div className="skeleton-line title" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </article>
      ))}
    </div>
  );
};

export { UsersGridSkeleton };
