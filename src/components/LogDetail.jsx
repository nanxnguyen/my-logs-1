import {
  Api as ApiIcon,
  Close as CloseIcon,
  Code as CodeIcon,
  Comment as CommentIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Error as ErrorIcon,
  Fullscreen as FullscreenIcon,
  Computer as GatewayIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  AccessTime as TimeIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography
} from '@mui/material';
import { memo, useCallback, useMemo, useState } from 'react';
import {
  extractKeyInfo,
  formatJSONForDisplay
} from '../utils/logUtils';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`log-tabpanel-${index}`}
      aria-labelledby={`log-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const LogDetail = ({ open, log, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Extract key info with fallback for null log
  const keyInfo = useMemo(() => {
    return log ? extractKeyInfo(log) : {};
  }, [log]);

  // Helper functions
  const getStatusIcon = (code) => {
    if (code === '200' || code === 200) {
      return <SuccessIcon sx={{ fontSize: 20, color: '#4caf50' }} />;
    } else if (code?.toString().startsWith('4')) {
      return <WarningIcon sx={{ fontSize: 20, color: '#ff9800' }} />;
    } else if (code?.toString().startsWith('5')) {
      return <ErrorIcon sx={{ fontSize: 20, color: '#f44336' }} />;
    }
    return <InfoIcon sx={{ fontSize: 20, color: '#2196f3' }} />;
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

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  }, []);

  const downloadJSON = useCallback((data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const timestamp = useMemo(() => {
    return log ? formatTimestamp(log.created_at) : { date: '', time: '' };
  }, [log]);

  if (!log) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      TransitionProps={{
        timeout: 200, // Faster transition
      }}
      sx={{
        '& .MuiDialog-paper': {
          height: '95vh',
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 2,
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }
      }}
    >
      {/* Custom Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid #30363d',
          backgroundColor: '#21262d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {getStatusIcon(log.code)}
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'text.primary'
              }}
            >
              {log.api} Log Detail #{log.id}
            </Typography>
          </Box>

          <Chip
            label={log.code}
            size="medium"
            sx={{
              bgcolor: log.code === '200' ? '#238636' : '#da3633',
              color: 'white',
              fontWeight: 700,
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}
          />
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Fullscreen">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0, backgroundColor: '#0d1117' }}>
        {/* Info Cards Section */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#ff9800', fontWeight: 600 }}>
            📊 Log Overview
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Gateway Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, backgroundColor: '#21262d', border: '1px solid #30363d' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <GatewayIcon sx={{ fontSize: 18, color: '#ff9800' }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Gateway
                  </Typography>
                </Box>
                <Chip
                  label={log.gateway}
                  size="medium"
                  variant="outlined"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                />
              </Paper>
            </Grid>

            {/* API Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, backgroundColor: '#21262d', border: '1px solid #30363d' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <ApiIcon sx={{ fontSize: 18, color: '#ff9800' }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    API Type
                  </Typography>
                </Box>
                <Chip
                  label={log.api}
                  size="medium"
                  color={getApiChipColor(log.api)}
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                />
              </Paper>
            </Grid>

            {/* Timestamp Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, backgroundColor: '#21262d', border: '1px solid #30363d' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <TimeIcon sx={{ fontSize: 18, color: '#ff9800' }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Timestamp
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600 }}>
                  {timestamp.date}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {timestamp.time}
                </Typography>
              </Paper>
            </Grid>

            {/* Timer Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, backgroundColor: '#21262d', border: '1px solid #30363d' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <TimelineIcon sx={{ fontSize: 18, color: '#ff9800' }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Execution Time
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700, color: log.timer > 1000 ? '#f44336' : '#4caf50' }}>
                  {log.timer}ms
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Session & Transaction Info */}
          <Paper sx={{ p: 3, backgroundColor: '#21262d', border: '1px solid #30363d', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff9800', fontWeight: 600 }}>
              🔗 Session Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', mb: 0.5 }}>
                  Session ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600, wordBreak: 'break-all' }}>
                  {log.session_id}
                </Typography>
              </Grid>

              {keyInfo.transaction && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', mb: 0.5 }}>
                    Transaction ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600, wordBreak: 'break-all' }}>
                    {keyInfo.transaction}
                  </Typography>
                </Grid>
              )}

              {keyInfo.clientName && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', mb: 0.5 }}>
                    Client Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                    {keyInfo.clientName}
                  </Typography>
                </Grid>
              )}

              {keyInfo.identityNumber && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', mb: 0.5 }}>
                    Identity Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600 }}>
                    {keyInfo.identityNumber}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #30363d', backgroundColor: '#21262d', px: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontFamily: 'monospace',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: '#ff9800',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#ff9800',
              },
            }}
          >
            <Tab
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <CodeIcon sx={{ fontSize: 16 }} />
                  Request
                </Box>
              }
            />
            <Tab
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <CodeIcon sx={{ fontSize: 16 }} />
                  Response
                </Box>
              }
            />
            {log.comment && (
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <CommentIcon sx={{ fontSize: 16 }} />
                    Comment
                  </Box>
                }
              />
            )}
            {keyInfo.images.length > 0 && (
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Badge badgeContent={keyInfo.images.length} color="primary">
                      <ImageIcon sx={{ fontSize: 16 }} />
                    </Badge>
                    Images
                  </Box>
                }
              />
            )}
          </Tabs>
        </Box>

        {/* Request Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600 }}>
                📤 Request Data
              </Typography>
              <Box display="flex" gap={1}>
                <Tooltip title="Copy to clipboard">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CopyIcon />}
                    onClick={() => copyToClipboard(formatJSONForDisplay(log.request))}
                    sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                  >
                    Copy
                  </Button>
                </Tooltip>
                <Tooltip title="Download JSON">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => downloadJSON(formatJSONForDisplay(log.request), `request-${log.id}`)}
                    sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                  >
                    Download
                  </Button>
                </Tooltip>
              </Box>
            </Box>

            <Paper
              sx={{
                backgroundColor: '#21262d',
                border: '1px solid #30363d',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#161b22',
                  borderBottom: '1px solid #30363d'
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                  Raw JSON Data
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 3,
                  maxHeight: '500px',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#21262d',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#656d76',
                    borderRadius: '4px',
                  },
                }}
              >
                <pre style={{
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.9rem',
                  fontFamily: '"JetBrains Mono", "Monaco", "Consolas", monospace',
                  color: '#e6edf3',
                  lineHeight: 1.5
                }}>
                  {formatJSONForDisplay(log.request)}
                </pre>
              </Box>
            </Paper>
          </Box>
        </TabPanel>

        {/* Response Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600 }}>
                📥 Response Data
              </Typography>
              <Box display="flex" gap={1}>
                <Tooltip title="Copy to clipboard">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CopyIcon />}
                    onClick={() => copyToClipboard(formatJSONForDisplay(log.response))}
                    sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                  >
                    Copy
                  </Button>
                </Tooltip>
                <Tooltip title="Download JSON">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => downloadJSON(formatJSONForDisplay(log.response), `response-${log.id}`)}
                    sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                  >
                    Download
                  </Button>
                </Tooltip>
              </Box>
            </Box>

            <Paper
              sx={{
                backgroundColor: '#21262d',
                border: '1px solid #30363d',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#161b22',
                  borderBottom: '1px solid #30363d'
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                  Raw JSON Data
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 3,
                  maxHeight: '500px',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#21262d',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#656d76',
                    borderRadius: '4px',
                  },
                }}
              >
                <pre style={{
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.9rem',
                  fontFamily: '"JetBrains Mono", "Monaco", "Consolas", monospace',
                  color: '#e6edf3',
                  lineHeight: 1.5
                }}>
                  {formatJSONForDisplay(log.response)}
                </pre>
              </Box>
            </Paper>
          </Box>
        </TabPanel>

        {/* Comment Tab */}
        {log.comment && (
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600, mb: 3 }}>
                💬 Comment
              </Typography>
              <Paper
                sx={{
                  backgroundColor: '#21262d',
                  border: '1px solid #30363d',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#161b22',
                    borderBottom: '1px solid #30363d'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                    Log Comment
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: 'break-word',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      fontFamily: 'monospace'
                    }}
                  >
                    {log.comment.replace(/"/g, '')}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </TabPanel>
        )}

        {/* Images Tab */}
        {keyInfo.images.length > 0 && (
          <TabPanel value={activeTab} index={log.comment ? 3 : 2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600, mb: 3 }}>
                🖼️ Images ({keyInfo.images.length})
              </Typography>
              <Paper
                sx={{
                  backgroundColor: '#21262d',
                  border: '1px solid #30363d',
                  borderRadius: 1,
                  p: 3
                }}
              >
                <ImageList cols={2} gap={16}>
                  {keyInfo.images.map((imageUrl, index) => (
                    <ImageListItem key={index}>
                      <Paper
                        sx={{
                          backgroundColor: '#161b22',
                          border: '1px solid #30363d',
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#ff9800',
                            transform: 'scale(1.02)'
                          }
                        }}
                        onClick={() => window.open(imageUrl, '_blank')}
                      >
                        <img
                          src={imageUrl}
                          alt={`Log image ${index + 1}`}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                          }}
                        />
                        <Box sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                            Image {index + 1} • Click to open
                          </Typography>
                        </Box>
                      </Paper>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>
            </Box>
          </TabPanel>
        )}
      </DialogContent>

      {/* Custom Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #30363d',
          backgroundColor: '#21262d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
          Log ID: {log.id} • Session: {log.session_id}
        </Typography>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#ff9800',
            '&:hover': {
              backgroundColor: '#f57c00',
            },
            fontFamily: 'monospace',
            fontWeight: 600
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default memo(LogDetail);
