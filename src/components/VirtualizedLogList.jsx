import { Box, Paper, Typography } from '@mui/material';
import { memo, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import LogCard from './LogCard';

// Item height for virtualization
const ITEM_HEIGHT = 300; // Approximate height of a LogCard
const CONTAINER_HEIGHT = 600; // Height of the virtual list container

// Row component for react-window
const LogRow = memo(({ index, style, data }) => {
  const { logs, onViewDetail } = data;
  const log = logs[index];

  if (!log) {
    return <div style={style}>Loading...</div>;
  }

  return (
    <div style={style}>
      <Box sx={{ p: 1 }}>
        <LogCard log={log} onViewDetail={onViewDetail} />
      </Box>
    </div>
  );
});

LogRow.displayName = 'LogRow';

const VirtualizedLogList = ({ logs, onViewDetail, height = CONTAINER_HEIGHT }) => {
  // Memoize the data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    logs,
    onViewDetail
  }), [logs, onViewDetail]);

  // If no logs, show empty state
  if (logs.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center', height }}>
        <Typography variant="h6" color="text.secondary">
          Không tìm thấy logs nào phù hợp với bộ lọc
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ height, border: '1px solid #e0e0e0', borderRadius: 1 }}>
      <List
        height={height}
        itemCount={logs.length}
        itemSize={ITEM_HEIGHT}
        itemData={itemData}
        overscanCount={5} // Render 5 extra items for smoother scrolling
      >
        {LogRow}
      </List>
    </Box>
  );
};

export default memo(VirtualizedLogList);
