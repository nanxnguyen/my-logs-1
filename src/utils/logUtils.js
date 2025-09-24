import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Parse JSON string safely with recursive parsing for nested stringified JSON
export const safeParseJSON = (jsonString, maxDepth = 5) => {
  try {
    if (!jsonString || jsonString === '""' || jsonString === '""') {
      return null;
    }

    // If it's not a string, return as is
    if (typeof jsonString !== 'string') {
      return jsonString;
    }

    // Remove extra quotes if present
    let cleanString = jsonString.trim();
    if (cleanString.startsWith('"') && cleanString.endsWith('"')) {
      cleanString = cleanString.slice(1, -1);
    }

    // Try to parse the JSON
    let parsed = JSON.parse(cleanString);

    // If the result is still a string that looks like JSON, parse recursively
    if (typeof parsed === 'string' && maxDepth > 0) {
      // Check if it looks like JSON (starts with { or [ and ends with } or ])
      const trimmedParsed = parsed.trim();
      if ((trimmedParsed.startsWith('{') && trimmedParsed.endsWith('}')) ||
          (trimmedParsed.startsWith('[') && trimmedParsed.endsWith(']'))) {
        return safeParseJSON(parsed, maxDepth - 1);
      }
    }

    // If parsed is an object, recursively parse any string values that might be JSON
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const result = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'string' && maxDepth > 0) {
          const trimmedValue = value.trim();
          if ((trimmedValue.startsWith('{') && trimmedValue.endsWith('}')) ||
              (trimmedValue.startsWith('[') && trimmedValue.endsWith(']'))) {
            result[key] = safeParseJSON(value, maxDepth - 1);
          } else {
            result[key] = value;
          }
        } else {
          result[key] = value;
        }
      }
      return result;
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return jsonString; // Return original string if parsing fails
  }
};

// Format date
export const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
};

// Get relative time
export const getRelativeTime = (dateString) => {
  return dayjs(dateString).fromNow();
};

// Get API type color
export const getApiTypeColor = (apiType) => {
  const colorMap = {
    'LOG': '#2196f3', // Blue
    'OCR': '#ff9800', // Orange
    'LIVENESS': '#4caf50', // Green
    'FACE_MATCHING': '#9c27b0', // Purple
    'REGISTER': '#f44336' // Red
  };
  return colorMap[apiType] || '#757575'; // Grey default
};

// Get gateway color
export const getGatewayColor = (gateway) => {
  const colorMap = {
    'PUBLIC': '#03a9f4', // Light Blue
    'ONE': '#ff5722', // Deep Orange
    'REGISTER': '#673ab7' // Deep Purple
  };
  return colorMap[gateway] || '#9e9e9e'; // Grey default
};

// Get status color based on code
export const getStatusColor = (code) => {
  if (code === '200' || code === 200) return '#4caf50'; // Green
  if (code.toString().startsWith('4')) return '#ff9800'; // Orange for 4xx
  if (code.toString().startsWith('5')) return '#f44336'; // Red for 5xx
  return '#757575'; // Grey default
};

// Extract key information from request/response
export const extractKeyInfo = (log) => {
  const request = safeParseJSON(log.request);
  const response = safeParseJSON(log.response);

  const info = {
    transaction: null,
    clientName: null,
    identityNumber: null,
    message: null,
    images: []
  };

  // Extract from request
  if (request) {
    if (request.transaction) {
      info.transaction = request.transaction;
    }

    if (request.resultData) {
      const resultData = safeParseJSON(request.resultData);
      if (resultData) {
        info.clientName = resultData.clientName;
        info.identityNumber = resultData.identityNumber;
      }
    }
  }

  // Extract from response
  if (response && typeof response === 'object') {
    if (response.message) {
      info.message = response.message;
    }

    if (response.data && typeof response.data === 'object') {
      if (response.data.hoVaTen) {
        info.clientName = response.data.hoVaTen;
      }
      if (response.data.soCmt) {
        info.identityNumber = response.data.soCmt;
      }
    }
  }

  // Extract images from comment
  if (log.comment) {
    const imageUrls = log.comment.match(/https?:\/\/[^\s,"]+(\.png|\.jpg|\.jpeg)/gi);
    if (imageUrls) {
      info.images = imageUrls;
    }
  }

  return info;
};

// Filter logs based on criteria
export const filterLogs = (logs, filters) => {
  return logs.filter(log => {
    const {
      search = '',
      gateway = '',
      api = '',
      dateFrom = null,
      dateTo = null,
      status = ''
    } = filters;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const searchableText = [
        log.id?.toString(),
        log.session_id,
        log.lead_id,
        log.request,
        log.response,
        log.comment
      ].join(' ').toLowerCase();

      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }

    // Gateway filter
    if (gateway && log.gateway !== gateway) {
      return false;
    }

    // API filter
    if (api && log.api !== api) {
      return false;
    }

    // Status filter
    if (status && log.code?.toString() !== status.toString()) {
      return false;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      const logDate = dayjs(log.created_at);
      if (dateFrom && logDate.isBefore(dayjs(dateFrom))) {
        return false;
      }
      if (dateTo && logDate.isAfter(dayjs(dateTo))) {
        return false;
      }
    }

    return true;
  });
};

// Get unique values for filter options
export const getFilterOptions = (logs) => {
  const gateways = [...new Set(logs.map(log => log.gateway))].filter(Boolean);
  const apis = [...new Set(logs.map(log => log.api))].filter(Boolean);
  const statuses = [...new Set(logs.map(log => log.code))].filter(Boolean);

  return { gateways, apis, statuses };
};

// Export formatted JSON for display
export const formatJSONForDisplay = (jsonString) => {
  const parsed = safeParseJSON(jsonString);
  if (!parsed) return 'No data';

  if (typeof parsed === 'object') {
    return JSON.stringify(parsed, null, 2);
  }

  return parsed.toString();
};
