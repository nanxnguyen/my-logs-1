import { memo } from 'react';
import LogCard from './LogCard';

// Lazy wrapper for LogCard to prevent unnecessary re-renders
const LazyLogCard = memo(({ log, onViewDetail }) => {
  return (
    <LogCard
      log={log}
      onViewDetail={onViewDetail}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return prevProps.log.id === nextProps.log.id;
});

LazyLogCard.displayName = 'LazyLogCard';

export default LazyLogCard;

