import {
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Computer as GatewayIcon,
    Fingerprint as IdIcon,
    Image as ImageIcon,
    Person as PersonIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Collapse,
    Divider,
    Grid,
    IconButton,
    Typography
} from '@mui/material';
import { useState } from 'react';
import {
    extractKeyInfo,
    formatDate,
    formatJSONForDisplay,
    getApiTypeColor,
    getGatewayColor,
    getRelativeTime,
    getStatusColor
} from '../utils/logUtils';

const LogCard = ({ log, onViewDetail }) => {
  const [expanded, setExpanded] = useState(false);
  const keyInfo = extractKeyInfo(log);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{
              bgcolor: getApiTypeColor(log.api),
              width: 32,
              height: 32,
              fontSize: '0.75rem'
            }}>
              {log.api?.charAt(0) || 'L'}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div">
                {log.api} #{log.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(log.created_at)}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={log.code}
              size="small"
              sx={{
                bgcolor: getStatusColor(log.code),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            <IconButton onClick={handleExpandClick} size="small">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Quick Info */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <GatewayIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Gateway:
                <Chip
                  label={log.gateway}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: getGatewayColor(log.gateway),
                    color: 'white',
                    fontSize: '0.7rem'
                  }}
                />
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <IdIcon fontSize="small" color="action" />
              <Typography variant="body2" noWrap>
                Session: {log.session_id || 'N/A'}
              </Typography>
            </Box>
          </Grid>

          {keyInfo.clientName && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2" noWrap>
                  Client: {keyInfo.clientName}
                </Typography>
              </Box>
            </Grid>
          )}

          {keyInfo.identityNumber && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <IdIcon fontSize="small" color="action" />
                <Typography variant="body2" noWrap>
                  ID: {keyInfo.identityNumber}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Images Preview */}
        {keyInfo.images.length > 0 && (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <ImageIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {keyInfo.images.length} hình ảnh
            </Typography>
            <Chip
              label="Xem ảnh"
              size="small"
              variant="outlined"
              onClick={() => onViewDetail(log)}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        )}

        {/* Time Info */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <TimeIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {getRelativeTime(log.created_at)} • Timer: {log.timer}ms
          </Typography>
        </Box>

        {/* Expanded Content */}
        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />

          {/* Comment */}
          {log.comment && (
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Comment:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  p: 1,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  wordBreak: 'break-word'
                }}
              >
                {log.comment.replace(/"/g, '')}
              </Typography>
            </Box>
          )}

          {/* Request/Response Preview */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Request:
              </Typography>
              <Box
                sx={{
                  p: 1,
                  bgcolor: 'blue.50',
                  borderRadius: 1,
                  maxHeight: '150px',
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace'
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {formatJSONForDisplay(log.request)?.slice(0, 500)}
                  {formatJSONForDisplay(log.request)?.length > 500 && '...'}
                </pre>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Response:
              </Typography>
              <Box
                sx={{
                  p: 1,
                  bgcolor: 'green.50',
                  borderRadius: 1,
                  maxHeight: '150px',
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace'
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {formatJSONForDisplay(log.response)?.slice(0, 500)}
                  {formatJSONForDisplay(log.response)?.length > 500 && '...'}
                </pre>
              </Box>
            </Grid>
          </Grid>

          {/* View Detail Button */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Chip
              label="Xem chi tiết đầy đủ"
              color="primary"
              onClick={() => onViewDetail(log)}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default LogCard;
