import React, { useRef, useState } from "react";

export interface CarouselItem {
  id: string;
  title: string;
  image?: string;
  rating?: number;
  children?: React.ReactNode;
}

interface ContentCarouselProps {
  title: string;
  items: CarouselItem[];
  renderItem: (item: CarouselItem) => React.ReactNode;
  loading?: boolean;
  onLoadMore?: () => void;
}

export function ContentCarousel({
  title,
  items,
  renderItem,
  loading = false,
  onLoadMore,
}: ContentCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 400;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {onLoadMore && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
          >
            {loading ? "Loading..." : "View All"}
          </button>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-r-lg flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Items Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex gap-3 pb-2 px-2 min-w-min">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex-shrink-0 w-40">
                  {renderItem(item)}
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8 text-zinc-400">
                No content available
              </div>
            )}
          </div>
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-l-lg flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
