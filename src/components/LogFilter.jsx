import {
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Send as SubmitIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

const LogFilter = ({ filters, onFiltersChange, onFilterSubmit, filterOptions }) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const isInternalUpdate = useRef(false);

  // Initialize dateFrom with current date if not set
  useEffect(() => {
    if (!filters.dateFrom) {
      const currentDate = dayjs().format('YYYY-MM-DD');
      onFiltersChange(prevFilters => ({
        ...prevFilters,
        dateFrom: currentDate
      }));
    }
  }, [filters.dateFrom, onFiltersChange]);

  // Manual search - no automatic debouncing

  // Sync searchValue with filters.search only when it's an external change
  useEffect(() => {
    if (!isInternalUpdate.current && filters.search !== searchValue) {
      setSearchValue(filters.search || '');
    }
    isInternalUpdate.current = false;
  }, [filters.search, searchValue]);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    console.log('🔍 Search input changed:', newValue);
    setSearchValue(newValue);
  };

  const clearSearch = () => {
    setSearchValue('');
    // Also clear the search in filters and trigger filtering
    const updatedFilters = {
      ...filters,
      search: ''
    };
    isInternalUpdate.current = true; // Mark as internal update
    onFiltersChange(updatedFilters);

    if (onFilterSubmit) {
      setTimeout(() => {
        onFilterSubmit(updatedFilters);
      }, 0);
    }
  };

  const clearFilters = () => {
    setSearchValue(''); // Clear local search state too
    const currentDate = dayjs().format('YYYY-MM-DD');
    const clearedFilters = {
      search: '',
      gateway: 'UPDATE_USER_INFO', // Reset to default gateway
      api: '',
      status: '',
      dateFrom: currentDate, // Reset to current date instead of empty
      dateTo: ''
    };

    isInternalUpdate.current = true; // Mark as internal update
    onFiltersChange(clearedFilters);

    // Trigger filtering to show all results
    if (onFilterSubmit) {
      setTimeout(() => {
        onFilterSubmit(clearedFilters);
      }, 0);
    }
  };

  const handleSubmit = () => {
    // Apply the current search value to filters
    const updatedFilters = {
      ...filters,
      search: searchValue
    };

    console.log('🔍 LogFilter Submit:', {
      searchValue,
      updatedFilters,
      currentFilters: filters
    });

    isInternalUpdate.current = true; // Mark as internal update
    onFiltersChange(updatedFilters);

    // Trigger filtering in parent component with updated filters
    if (onFilterSubmit) {
      // Use setTimeout to ensure state is updated before filtering
      setTimeout(() => {
        onFilterSubmit(updatedFilters);
      }, 0);
    }
  };



  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Paper elevation={1} sx={{ p: 1.5, mb: 2 }}>
      {/* Header with buttons */}
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterIcon color="primary" sx={{ fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Bộ lọc
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount}`}
              size="small"
              color="primary"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>

        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<SubmitIcon />}
            onClick={handleSubmit}
            size="small"
            sx={{
              backgroundColor: '#ff9800',
              '&:hover': {
                backgroundColor: '#f57c00',
              },
              fontFamily: 'monospace',
              fontWeight: 600,
              fontSize: '0.75rem',
              px: 1.5,
              py: 0.5
            }}
          >
            Áp dụng
          </Button>

          <Chip
            label="Xóa"
            onClick={clearFilters}
            onDelete={clearFilters}
            color="secondary"
            variant="outlined"
            size="small"
            disabled={activeFiltersCount === 0}
            sx={{ height: 28, fontSize: '0.7rem' }}
          />
        </Box>
      </Box>

      {/* Compact filter inputs */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap={1.5}>
        {/* Search */}
          <TextField
            size="small"
            label="Tìm kiếm"
            placeholder="Mã khách hàng..."
            value={searchValue}
            onChange={handleSearchChange}
            variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16 }} />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={clearSearch}
                  size="small"
                  sx={{ p: 0.5 }}
                >
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Gateway Filter */}
        <FormControl size="small">
          <InputLabel>Gateway</InputLabel>
          <Select
            value={filters.gateway || ''}
            onChange={(e) => handleFilterChange('gateway', e.target.value)}
            label="Gateway"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {filterOptions.gateways.map(gateway => (
              <MenuItem key={gateway} value={gateway}>
                {gateway}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* API Filter */}
        <FormControl size="small">
          <InputLabel>API</InputLabel>
          <Select
            value={filters.api || ''}
            onChange={(e) => handleFilterChange('api', e.target.value)}
            label="API"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {filterOptions.apis.map(api => (
              <MenuItem key={api} value={api}>
                {api}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Filter */}
        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            label="Status"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {filterOptions.statuses.map(status => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Date Range - Compact */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr 1fr' }} gap={1.5} sx={{ mt: 1.5 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Từ ngày"
            value={filters.dateFrom ? dayjs(filters.dateFrom) : dayjs()}
            onChange={(newValue) => {
              handleFilterChange('dateFrom', newValue ? newValue.format('YYYY-MM-DD') : '');
            }}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                variant: 'outlined'
              }
            }}
          />
          <DatePicker
            label="Đến ngày"
            value={filters.dateTo ? dayjs(filters.dateTo) : null}
            onChange={(newValue) => {
              handleFilterChange('dateTo', newValue ? newValue.format('YYYY-MM-DD') : '');
            }}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                variant: 'outlined'
              }
            }}
          />
        </LocalizationProvider>
      </Box>
    </Paper>
  );
};

export default LogFilter;
