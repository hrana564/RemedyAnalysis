import { useState, useEffect } from 'react';
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
  createTheme,
  Alert,
  AlertTitle
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
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

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

// Navigation component with React Router
const NavigationWithRouter = ({ handleLogout, username, role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to navigate with React Router
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ color: 'white', mr: 2 }}>
            {username} ({role})
          </Typography>
          <Button
            onClick={() => handleNavigate('/dashboard')}
            startIcon={<DashboardIcon />}
            sx={{ 
              color: 'white', 
              fontWeight: 'medium',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              px: 2,
              py: 1,
              minWidth: '120px',
              ...(location.pathname === '/dashboard' ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {})
            }}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => handleNavigate('/transactions')}
            startIcon={<TransactionsIcon />}
            sx={{ 
              color: 'white', 
              fontWeight: 'medium',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              px: 2,
              py: 1,
              minWidth: '120px',
              ...(location.pathname === '/transactions' ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {})
            }}
          >
            Transactions
          </Button>
          <Button
            onClick={() => handleNavigate('/input')}
            startIcon={<CodeIcon />}
            sx={{ 
              color: 'white', 
              fontWeight: 'medium',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              px: 2,
              py: 1,
              minWidth: '120px',
              ...(location.pathname === '/input' ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {})
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
};

// Login page component
const LoginPage = ({ onLogin, username, setUsername, password, setPassword, error, rememberMe, setRememberMe, showCredentials }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(e);
  };

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
            {showCredentials && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>POC Credentials</AlertTitle>
                <Typography variant="body2">Admin: admin / admin123</Typography>
                <Typography variant="body2">User: user1 / user123</Typography>
              </Alert>
            )}
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
                  <Typography 
                    color="error" 
                    variant="body2" 
                    align="center"
                    sx={{ 
                      fontWeight: 'medium',
                      fontSize: '0.875rem'
                    }}
                  >
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

// Main app component with routing
const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  // Load login data from config.json
  const loginData = {
    "admin": {
      "username": "admin",
      "password": "admin123",
      "role": "admin"
    },
    "users": [
      {
        "username": "user1",
        "password": "user123",
        "role": "user"
      }
    ]
  };

  // Check for saved session on app load
  useEffect(() => {
    const savedSession = localStorage.getItem('appSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        const now = Date.now();
        
        // Check if session is still valid (10 minutes = 600000 ms)
        if (session.expiresAt > now) {
          // Valid session, auto-login
          setIsLoggedIn(true);
          setUsername(session.username);
          setUserRole(session.role);
        } else {
          // Expired session, remove it
          localStorage.removeItem('appSession');
        }
      } catch (e) {
        // Invalid session data, remove it
        localStorage.removeItem('appSession');
      }
    }
    
    // For POC, show credentials on login screen
    setShowCredentials(true);
  }, []);

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
    
    // Check admin credentials
    if (username === loginData.admin.username && password === loginData.admin.password) {
      setIsLoggedIn(true);
      setUserRole(loginData.admin.role);
      setError('');
      
      // Save session if "Remember me" is checked
      if (rememberMe) {
        const expirationTime = Date.now() + 600000; // 10 minutes
        const session = {
          username: username,
          role: loginData.admin.role,
          expiresAt: expirationTime
        };
        localStorage.setItem('appSession', JSON.stringify(session));
      }
    } else {
      // Check user credentials
      const user = loginData.users.find(u => u.username === username && u.password === password);
      if (user) {
        setIsLoggedIn(true);
        setUserRole(user.role);
        setError('');
        
        // Save session if "Remember me" is checked
        if (rememberMe) {
          const expirationTime = Date.now() + 600000; // 10 minutes
          const session = {
            username: username,
            role: user.role,
            expiresAt: expirationTime
          };
          localStorage.setItem('appSession', JSON.stringify(session));
        }
      } else {
        setError('Invalid username or password');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setUserRole('');
    localStorage.removeItem('appSession');
  };

  if (isLoggedIn) {
    return (
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavigationWithRouter handleLogout={handleLogout} username={username} role={userRole} />
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', p: 2 }}>
              <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '1400px' }}>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage username={username} />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/input" element={<InputPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      </Router>
    );
  }

  return (
    <Router>
      <LoginPage 
        onLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        error={error}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        showCredentials={showCredentials}
      />
    </Router>
  );
};

export default App;