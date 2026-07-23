const CardSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col h-full shadow-lg"
        >
          {/* Image Aspect Ratio Skeleton */}
          <div className="aspect-[2/3] w-full skeleton-shimmer"></div>

          {/* Bottom Title Line Skeleton */}
          <div className="p-3 bg-zinc-900 border-t border-zinc-800">
            <div className="w-3/4 h-4 rounded-md skeleton-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
