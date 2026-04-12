import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Card, 
  CardContent, 
  CardHeader,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Divider,
  styled,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { 
  AccountCircle, 
  Dashboard as DashboardIcon, 
  Receipt as TransactionsIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import DashboardPage from './DashboardPage';
import TransactionsPage from './TransactionsPage';
import InputPage from './InputPage';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#003366',
    },
    secondary: {
      main: '#0066cc',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        }
      }
    }
  }
});

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(8),
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#003366',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}));

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [rememberMe, setRememberMe] = useState(false);

  // Load login data from config.json
  const loginData = {
    "admin": {
      "username": "admin",
      "password": "admin123"
    },
    "users": [
      {
        "username": "user1",
        "password": "user123"
      }
    ]
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Validate credentials
    if (username.trim() === '') {
      setError('Email address/Username is required');
      return;
    }
    
    if (password.trim() === '') {
      setError('Password is required');
      return;
    }
    
    if (username === loginData.admin.username && password === loginData.admin.password) {
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
      setError('');
    } else {
      const user = loginData.users.find(u => u.username === username && u.password === password);
      if (user) {
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
        setError('');
      } else {
        setError('Invalid username or password');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setCurrentPage('login');
  };

  const navigateTo = (page) => {
    console.log('Navigating to page:', page); // Debugging line
    setCurrentPage(page);
  };

  // Navigation component
  const Navigation = () => (
    <StyledAppBar position="static">
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            onClick={() => navigateTo('dashboard')}
            startIcon={<DashboardIcon />}
            sx={{ 
              color: 'white', 
              fontWeight: 'medium',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              px: 2,
              py: 1,
              minWidth: '120px'
            }}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => navigateTo('transactions')}
            startIcon={<TransactionsIcon />}
            sx={{ 
              color: 'white', 
              fontWeight: 'medium',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              px: 2,
              py: 1,
              minWidth: '120px'
            }}
          >
            Transactions
          </Button>
          <Button
            onClick={() => navigateTo('input')}
            startIcon={<CodeIcon />}
            sx={{ 
              color: 'white', 
              fontWeight: 'medium',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              px: 2,
              py: 1,
              minWidth: '120px'
            }}
          >
            Input
          </Button>
          <IconButton
            onClick={handleLogout}
            color="inherit"
            sx={{ 
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              px: 1,
              py: 1
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );

  if (isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', p: 2 }}>
            <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '1400px' }}>
              {currentPage === 'dashboard' && <DashboardPage username={username} />}
              {currentPage === 'transactions' && <TransactionsPage />}
              {currentPage === 'input' && <InputPage />}
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 2,
        }}
      >
        <StyledCard sx={{ width: '100%', maxWidth: 400 }}>
          <CardHeader
            title={
              <Typography variant="h5" align="center" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Emirates NBD Remedy Analyser
              </Typography>
            }
            sx={{ pb: 0 }}
          />
          <CardContent>
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Email or Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email or username"
                margin="normal"
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                margin="normal"
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
                sx={{ mt: 1 }}
              />
              {error && (
                <Box sx={{ mt: 2 }}>
                  <Typography color="error.main" variant="body2" align="center">
                    {error}
                  </Typography>
                </Box>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 3, 
                  py: 1.5, 
                  borderRadius: '8px',
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Login
              </Button>
            </Box>
          </CardContent>
        </StyledCard>
      </Box>
    </ThemeProvider>
  );
};

export default App;