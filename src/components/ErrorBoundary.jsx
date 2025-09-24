import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{ backgroundColor: '#0d1117', color: 'white', p: 4 }}
        >
          <Paper
            sx={{
              p: 4,
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: 2,
              maxWidth: 600,
              textAlign: 'center'
            }}
          >
            <ErrorIcon sx={{ fontSize: 64, color: '#f44336', mb: 2 }} />

            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              The application encountered an unexpected error. This might be due to:
            </Typography>

            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Large dataset causing memory issues
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Component rendering problems
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Browser compatibility issues
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleReload}
              sx={{
                backgroundColor: '#ff9800',
                '&:hover': { backgroundColor: '#f57c00' },
                fontFamily: 'monospace',
                fontWeight: 600
              }}
            >
              Reload Page
            </Button>

            {this.state.error && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#ff9800' }}>
                  Error Details:
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: '#21262d', border: '1px solid #30363d' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      wordBreak: 'break-word'
                    }}
                  >
                    {this.state.error.toString()}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

