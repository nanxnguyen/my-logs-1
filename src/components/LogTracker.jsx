import {
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  CircularProgress,
  Fab,
  Pagination,
  Paper,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { dataLogs } from '../data';
import { apiService } from '../services/apiService';
import { filterLogs, getFilterOptions } from '../utils/logUtils';
import LazyLogCard from './LazyLogCard';
import LogDetail from './LogDetail';
import LogFilter from './LogFilter';
import LogTable from './LogTable';
import VirtualizedLogList from './VirtualizedLogList';

const LogTracker = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [useVirtualization, setUseVirtualization] = useState(false);
  const [viewMode] = useState('table'); // 'table' or 'cards'

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    gateway: 'UPDATE_USER_INFO', // Default gateway
    api: '',
    status: '',
    dateFrom: dayjs().format('YYYY-MM-DD'), // Initialize with current date
    dateTo: ''
  });

  // Pagination states
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Track if initial filtering has been done
  const initialFilteringDone = useRef(false);

  // Load logs from API on component mount
  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Loading logs from API...');
        console.log('🔄 apiService:', apiService);

        // Build API parameters from filters
        const apiParams = {};
        if (filters.dateFrom) {
          apiParams.startDate = filters.dateFrom;
        }
        if (filters.dateTo) {
          apiParams.endDate = filters.dateTo;
        }
        if (filters.gateway) {
          apiParams.gateway = filters.gateway;
        }

        const apiLogs = await apiService.getLogs(apiParams);
        console.log('✅ API logs loaded:', apiLogs.length);
        console.log('✅ API logs data:', apiLogs);

        // Sort logs by date (newest first)
        const sortedLogs = [...apiLogs].sort((a, b) => {
          const dateA = new Date(a.created_at || a.timestamp || a.date);
          const dateB = new Date(b.created_at || b.timestamp || b.date);
          return dateB - dateA;
        });

        setLogs(sortedLogs);
        console.log('📊 Logs set in state:', sortedLogs.length);
      } catch (err) {
        console.error('❌ Error loading logs:', err);
        setError(err.message || 'Failed to load logs from API');

        // Fallback to static data if API fails
        console.log('🔄 Falling back to static data...');
        const sortedData = [...dataLogs].sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );
        setLogs(sortedData);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [filters.dateFrom, filters.dateTo, filters.gateway]);

  // Reload data when date or gateway filters change
  useEffect(() => {
    if (filters.dateFrom || filters.dateTo || filters.gateway) {
      const loadLogsWithFilters = async () => {
        try {
          setLoading(true);
          setError(null);
          console.log('🔄 Loading logs with filters...');

          const apiParams = {};
          if (filters.dateFrom) {
            apiParams.startDate = filters.dateFrom;
          }
          if (filters.dateTo) {
            apiParams.endDate = filters.dateTo;
          }
          if (filters.gateway) {
            apiParams.gateway = filters.gateway;
          }

          const apiLogs = await apiService.getLogs(apiParams);
          console.log('✅ API logs loaded with filters:', apiLogs.length);

          const sortedLogs = [...apiLogs].sort((a, b) => {
            const dateA = new Date(a.created_at || a.timestamp || a.date);
            const dateB = new Date(b.created_at || b.timestamp || b.date);
            return dateB - dateA;
          });

          setLogs(sortedLogs);
        } catch (err) {
          console.error('❌ Error loading logs with filters:', err);
          setError(err.message || 'Failed to load logs with filters');
        } finally {
          setLoading(false);
        }
      };

      loadLogsWithFilters();
    }
  }, [filters.dateFrom, filters.dateTo, filters.gateway]);

  // Auto-enable virtualization for large datasets
  useEffect(() => {
    if (filteredLogs.length > 100 && !useVirtualization) {
      setUseVirtualization(true);
    }
  }, [filteredLogs.length, useVirtualization]);

  // Initial filtering when logs are loaded (only once)
  useEffect(() => {
    if (logs.length > 0 && !initialFilteringDone.current) {
      const filtered = filterLogs(logs, filters);
      setFilteredLogs(filtered);
      initialFilteringDone.current = true;
      console.log('🔄 Initial filtering applied:', {
        totalLogs: logs.length,
        filteredLogs: filtered.length
      });
    }
  }, [logs, filters]);



  const handleViewDetail = useCallback((log) => {
    setSelectedLog(log);
    setDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailOpen(false);
    setSelectedLog(null);
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSubmitSearch = useCallback((filtersToUse = filters) => {
    // Trigger filtering manually with provided filters or current filters
    console.log('🔍 LogTracker SubmitSearch called with:', {
      filtersToUse,
      currentFilters: filters,
      totalLogs: logs.length
    });

    const filtered = filterLogs(logs, filtersToUse);
    setFilteredLogs(filtered);
    setPage(1); // Reset to first page when filters change

    console.log('🔍 Manual filtering applied:', {
      totalLogs: logs.length,
      filteredLogs: filtered.length,
      filters: filtersToUse,
      sampleLogs: logs.slice(0, 2) // Show first 2 logs for debugging
    });
  }, [logs, filters]);

  const handleRefresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Refreshing logs from API...');

      // Clear cache to force fresh data
      apiService.clearCache();

      // Build API parameters from current filters
      const apiParams = {};
      if (filters.dateFrom) {
        apiParams.startDate = filters.dateFrom;
      }
      if (filters.dateTo) {
        apiParams.endDate = filters.dateTo;
      }
      if (filters.gateway) {
        apiParams.gateway = filters.gateway;
      }

      const apiLogs = await apiService.getLogs(apiParams);
      console.log('✅ API logs refreshed:', apiLogs.length);

      // Sort logs by date (newest first)
      const sortedLogs = [...apiLogs].sort((a, b) => {
        const dateA = new Date(a.created_at || a.timestamp || a.date);
        const dateB = new Date(b.created_at || b.timestamp || b.date);
        return dateB - dateA;
      });

      setLogs(sortedLogs);
      console.log('📊 Logs refreshed in state:', sortedLogs.length);
    } catch (err) {
      console.error('❌ Error refreshing logs:', err);
      setError(err.message || 'Failed to refresh logs from API');
    } finally {
      setLoading(false);
    }
  }, [filters.dateFrom, filters.dateTo, filters.gateway]);



  // Get filter options from current logs
  const filterOptions = useMemo(() => getFilterOptions(logs), [logs]);

  // Pagination - memoized
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return { totalPages, startIndex, endIndex, paginatedLogs };
  }, [filteredLogs, itemsPerPage, page]);

  const { totalPages, paginatedLogs } = paginationData;


  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: '#ff9800', mb: 2 }} />
        <Typography variant="h6" sx={{ ml: 2, fontFamily: 'monospace' }}>
          Loading logs... ({logs.length} loaded)
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Processing large dataset for optimal performance
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            API Error
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
            Using fallback data. Click refresh to retry.
          </Typography>
        </Alert>
      )}

      {/* Advanced Filter Component */}
      <LogFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onFilterSubmit={handleSubmitSearch}
        filterOptions={filterOptions}
      />





            {/* Control Panel */}
      <Paper sx={{ mb: 3 }}>
        {/* Search and Filter Bar */}
        {/* <Box sx={{ p: 2, borderBottom: '1px solid #30363d' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1} alignItems="center">
                <TextField
                  fullWidth
                  size="medium"
                  placeholder="Search logs... (API, Gateway, Session ID, etc.)"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmitSearch();
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                    }
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<SubmitIcon />}
                  onClick={handleSubmitSearch}
                  sx={{
                    backgroundColor: '#ff9800',
                    '&:hover': {
                      backgroundColor: '#f57c00',
                    },
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    minWidth: 'auto',
                    px: 2
                  }}
                >
                  Tìm
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1} alignItems="center" justifyContent="flex-end" flexWrap="wrap">
                <Button
                  variant={showFilters ? "contained" : "outlined"}
                  size="medium"
                  startIcon={<FilterIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  Filters
                </Button>

                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                <Button
                  variant={viewMode === 'table' ? "contained" : "outlined"}
                  size="medium"
                  startIcon={<TableViewIcon />}
                  onClick={() => setViewMode('table')}
                  sx={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  Table
                </Button>

                <Button
                  variant={viewMode === 'cards' ? "contained" : "outlined"}
                  size="medium"
                  startIcon={<CardViewIcon />}
                  onClick={() => setViewMode('cards')}
                  sx={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  Cards
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box> */}

        {/* Advanced Filters (Collapsible) */}
        {/* {showFilters && (
          <Box sx={{ p: 2, backgroundColor: '#0d1117', borderTop: '1px solid #30363d' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Gateway</InputLabel>
                  <Select
                    value={filters.gateway}
                    label="Gateway"
                    onChange={(e) => setFilters({...filters, gateway: e.target.value})}
                    sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {filterOptions.gateways.map(gateway => (
                      <MenuItem key={gateway} value={gateway}>{gateway}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>API</InputLabel>
                  <Select
                    value={filters.api}
                    label="API"
                    onChange={(e) => setFilters({...filters, api: e.target.value})}
                    sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {filterOptions.apis.map(api => (
                      <MenuItem key={api} value={api}>{api}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="200">200 - Success</MenuItem>
                    <MenuItem value="400">4xx - Client Error</MenuItem>
                    <MenuItem value="500">5xx - Server Error</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => setFilters({search: '', gateway: '', api: '', status: '', dateFrom: '', dateTo: ''})}
                  sx={{ fontFamily: 'monospace', fontSize: '0.75rem', height: '40px' }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        )} */}

      </Paper>

            {/* Log Display */}
      {filteredLogs.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
            No logs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters
          </Typography>
        </Paper>
      ) : viewMode === 'table' ? (
        <LogTable
          logs={filteredLogs}
          onViewDetail={handleViewDetail}
        />
      ) : useVirtualization ? (
        <VirtualizedLogList
          logs={filteredLogs}
          onViewDetail={handleViewDetail}
          height={600}
        />
      ) : (
        <Box>
          {paginatedLogs.map((log) => (
            <LazyLogCard
              key={log.id}
              log={log}
              onViewDetail={handleViewDetail}
            />
          ))}
        </Box>
      )}

      {/* Pagination - only for card view non-virtualized */}
      {viewMode === 'cards' && !useVirtualization && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Paper sx={{ p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, newPage) => setPage(newPage)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontFamily: 'monospace',
                }
              }}
            />
          </Paper>
        </Box>
      )}

      {/* Log Detail Modal */}
      <LogDetail
        open={detailOpen}
        log={selectedLog}
        onClose={handleCloseDetail}
      />

      {/* Refresh FAB */}
      <Fab
        color="primary"
        onClick={handleRefresh}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
          backgroundColor: '#ff9800',
          '&:hover': {
            backgroundColor: '#f57c00',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
        disabled={loading}
      >
        <RefreshIcon />
      </Fab>
    </Box>
  );
};

export default memo(LogTracker);
