import { useEffect, useMemo, useState } from 'react';

// Lazy load data in chunks to improve initial performance
export const useLazyData = (data, chunkSize = 100) => {
  const [loadedData, setLoadedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChunk, setCurrentChunk] = useState(0);

  // Pre-sort data once
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    );
  }, [data]);

  useEffect(() => {
    if (!sortedData.length) return;

    setIsLoading(true);

    // Load data in chunks to prevent blocking
    const loadChunk = (chunkIndex) => {
      const start = chunkIndex * chunkSize;
      const end = start + chunkSize;
      const chunk = sortedData.slice(start, end);

      setLoadedData(prev => [...prev, ...chunk]);

      if (end < sortedData.length) {
        // Load next chunk after a short delay
        setTimeout(() => loadChunk(chunkIndex + 1), 10);
      } else {
        setIsLoading(false);
      }
    };

    // Start loading first chunk immediately
    loadChunk(0);
  }, [sortedData, chunkSize]);

  const loadMore = () => {
    const nextChunk = currentChunk + 1;
    const start = nextChunk * chunkSize;
    const end = start + chunkSize;

    if (start < sortedData.length) {
      const chunk = sortedData.slice(start, end);
      setLoadedData(prev => [...prev, ...chunk]);
      setCurrentChunk(nextChunk);
    }
  };

  const hasMore = (currentChunk + 1) * chunkSize < sortedData.length;

  return {
    data: loadedData,
    isLoading,
    loadMore,
    hasMore,
    totalCount: sortedData.length
  };
};

// For very large datasets, use virtual scrolling
export const useVirtualData = (data, itemHeight = 80) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 5, // Buffer
      data.length
    );

    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemHeight, data.length]);

  const visibleData = useMemo(() => {
    return data.slice(visibleRange.startIndex, visibleRange.endIndex);
  }, [data, visibleRange]);

  return {
    visibleData,
    visibleRange,
    totalHeight: data.length * itemHeight,
    setScrollTop,
    setContainerHeight
  };
};

