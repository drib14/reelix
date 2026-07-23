const HeroSkeleton = () => {
  return (
    <div className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 bg-black select-none overflow-hidden">
      {/* Background Shimmer */}
      <div className="absolute inset-0 bg-zinc-950/80 skeleton-shimmer opacity-20"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Column Skeleton */}
        <div className="flex-1 text-center lg:text-left max-w-2xl w-full">
          {/* Pill Badge */}
          <div className="w-56 h-8 rounded-full skeleton-shimmer mb-6 mx-auto lg:mx-0"></div>

          {/* Title Lines */}
          <div className="w-3/4 h-12 sm:h-16 rounded-2xl skeleton-shimmer mb-4 mx-auto lg:mx-0"></div>
          <div className="w-1/2 h-12 sm:h-16 rounded-2xl skeleton-shimmer mb-6 mx-auto lg:mx-0"></div>

          {/* Badges Row */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <div className="w-24 h-7 rounded-lg skeleton-shimmer"></div>
            <div className="w-20 h-7 rounded-lg skeleton-shimmer"></div>
            <div className="w-16 h-7 rounded-lg skeleton-shimmer"></div>
          </div>

          {/* Overview Lines */}
          <div className="w-full h-4 rounded-md skeleton-shimmer mb-2"></div>
          <div className="w-5/6 h-4 rounded-md skeleton-shimmer mb-2 mx-auto lg:mx-0"></div>
          <div className="w-2/3 h-4 rounded-md skeleton-shimmer mb-8 mx-auto lg:mx-0"></div>

          {/* Buttons Row */}
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <div className="w-40 h-14 rounded-2xl skeleton-shimmer"></div>
            <div className="w-40 h-14 rounded-2xl skeleton-shimmer"></div>
          </div>
        </div>

        {/* Right Poster Skeleton */}
        <div className="hidden lg:block w-[300px] h-[450px] rounded-3xl skeleton-shimmer border border-zinc-800 flex-shrink-0"></div>
      </div>
    </div>
  );
};

export default HeroSkeleton;
