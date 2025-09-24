import {
  Error as ErrorIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { memo, useCallback, useState } from 'react';

const LogTable = ({ logs, onViewDetail }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = useCallback((logId) => {
    setExpandedRows(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(logId)) {
        newExpanded.delete(logId);
      } else {
        newExpanded.add(logId);
      }
      return newExpanded;
    });
  }, []);

  const getStatusIcon = (code) => {
    if (code === '200' || code === 200) {
      return <SuccessIcon sx={{ fontSize: 16, color: '#4caf50' }} />;
    } else if (code?.toString().startsWith('4')) {
      return <WarningIcon sx={{ fontSize: 16, color: '#ff9800' }} />;
    } else if (code?.toString().startsWith('5')) {
      return <ErrorIcon sx={{ fontSize: 16, color: '#f44336' }} />;
    }
    return <InfoIcon sx={{ fontSize: 16, color: '#2196f3' }} />;
  };

  const getApiChipColor = (api) => {
    switch (api) {
      case 'OCR': return 'info';
      case 'LIVENESS': return 'secondary';
      case 'FACE_MATCHING': return 'success';
      case 'LOG': return 'warning';
      default: return 'default';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
      })
    };
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 40 }}></TableCell>
            <TableCell sx={{ width: 80 }}>Status</TableCell>
            <TableCell sx={{ width: 120 }}>Timestamp</TableCell>
            <TableCell sx={{ width: 100 }}>Gateway</TableCell>
            <TableCell sx={{ width: 120 }}>API</TableCell>
            <TableCell sx={{ width: 120 }}>Session ID</TableCell>
            <TableCell>Request Preview</TableCell>
            <TableCell>Response Preview</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => {
            const isExpanded = expandedRows.has(log.id);
            const timestamp = formatTimestamp(log.created_at);

            return (
              <>
                <TableRow
                  key={log.id}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#21262d',
                    }
                  }}
                  onClick={() => onViewDetail(log)}
                >
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRowExpansion(log.id);
                      }}
                      sx={{ color: 'text.secondary' }}
                    >
                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </TableCell>

                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusIcon(log.code)}
                                              <Typography
                          variant="body1"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            color: log.code === '200' ? '#4caf50' : '#f44336'
                          }}
                        >
                          {log.code}
                        </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 500 }}>
                        {timestamp.date}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600 }}>
                        {timestamp.time}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                                          <Chip
                        label={log.gateway}
                        size="medium"
                        variant="outlined"
                        sx={{
                          fontSize: '0.85rem',
                          height: 28,
                          fontFamily: 'monospace',
                          fontWeight: 600
                        }}
                      />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={log.api}
                      size="medium"
                      color={getApiChipColor(log.api)}
                      sx={{
                        fontSize: '0.85rem',
                        height: 28,
                        fontFamily: 'monospace',
                        fontWeight: 600
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        color: 'text.primary',
                        fontWeight: 500
                      }}
                    >
                      {log.session_id}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        color: 'text.primary',
                        wordBreak: 'break-all',
                        lineHeight: 1.4
                      }}
                    >
                      {truncateText(log.request)}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        color: 'text.primary',
                        wordBreak: 'break-all',
                        lineHeight: 1.4
                      }}
                    >
                      {truncateText(log.response)}
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* Expanded Row */}
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2, backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: 1, m: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#ff9800' }}>
                          Request Details:
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: '#21262d',
                            border: '1px solid #30363d',
                            borderRadius: 1,
                            p: 2,
                            mb: 2,
                            maxHeight: 200,
                            overflow: 'auto'
                          }}
                        >
                          <pre style={{
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            fontFamily: '"JetBrains Mono", "Monaco", "Consolas", monospace',
                            fontSize: '0.9rem',
                            color: '#e6edf3',
                            lineHeight: 1.5
                          }}>
                            {typeof log.request === 'string' ? log.request : JSON.stringify(log.request, null, 2)}
                          </pre>
                        </Box>

                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#ff9800' }}>
                          Response Details:
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: '#21262d',
                            border: '1px solid #30363d',
                            borderRadius: 1,
                            p: 2,
                            maxHeight: 200,
                            overflow: 'auto'
                          }}
                        >
                          <pre style={{
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            fontFamily: '"JetBrains Mono", "Monaco", "Consolas", monospace',
                            fontSize: '0.9rem',
                            color: '#e6edf3',
                            lineHeight: 1.5
                          }}>
                            {typeof log.response === 'string' ? log.response : JSON.stringify(log.response, null, 2)}
                          </pre>
                        </Box>

                        {log.comment && (
                          <>
                            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: '#ff9800' }}>
                              Comment:
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                color: 'text.primary',
                                lineHeight: 1.5
                              }}
                            >
                              {log.comment}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default memo(LogTable);
