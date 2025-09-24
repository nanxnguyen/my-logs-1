import { Box, Container, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ErrorBoundary from './components/ErrorBoundary';
import LogTracker from './components/LogTracker';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    secondary: {
      main: '#00bcd4',
      light: '#4dd0e1',
      dark: '#0097a7',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
    text: {
      primary: '#e6edf3',
      secondary: '#7d8590',
    },
    divider: '#30363d',
    grey: {
      50: '#f6f8fa',
      100: '#eaeef2',
      200: '#d0d7de',
      300: '#afb8c1',
      400: '#8b949e',
      500: '#6e7681',
      600: '#656d76',
      700: '#484f58',
      800: '#32383f',
      900: '#24292f',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 16, // Tăng font size cơ bản
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '2.2rem',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      fontSize: '1.8rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.3rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.95rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: '#656d76',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 24,
        },
        colorSuccess: {
          backgroundColor: '#238636',
          color: '#ffffff',
        },
        colorError: {
          backgroundColor: '#da3633',
          color: '#ffffff',
        },
        colorWarning: {
          backgroundColor: '#bf8700',
          color: '#ffffff',
        },
        colorInfo: {
          backgroundColor: '#0969da',
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#0d1117',
            '& fieldset': {
              borderColor: '#30363d',
            },
            '&:hover fieldset': {
              borderColor: '#656d76',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff9800',
            },
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableHead-root': {
            backgroundColor: '#21262d',
          },
          '& .MuiTableRow-root': {
            borderBottom: '1px solid #30363d',
            '&:hover': {
              backgroundColor: '#21262d',
            },
          },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid #30363d',
            padding: '12px 16px',
            fontSize: '1rem',
            fontFamily: '"JetBrains Mono", "Monaco", "Consolas", monospace',
            lineHeight: 1.5,
          },
          '& .MuiTableCell-head': {
            fontWeight: 700,
            backgroundColor: '#21262d',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#e6edf3',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
              <Box sx={{ minHeight: '100vh' }}>
          {/* Top Navigation Bar */}
          <Box
            sx={{
              borderBottom: '1px solid #30363d',
              backgroundColor: '#21262d',
              px: 3,
              py: 2
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                              <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#ff9800',
                    fontFamily: '"JetBrains Mono", "Monaco", "Consolas", monospace'
                  }}
                >
                  LogAnalyzer
                </Typography>
                <Box
                  sx={{
                    px: 2,
                    py: 0.5,
                    backgroundColor: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: 1,
                    fontSize: '0.85rem',
                    color: 'text.secondary',
                    fontWeight: 500
                  }}
                >
                  v1.0.0
                </Box>
              </Box>

            </Box>
          </Box>

          <Container maxWidth="2xl" sx={{ py: 3 }}>
            <LogTracker />
          </Container>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
