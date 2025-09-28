import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Button, Container, Paper, TextField } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
          RetailRecommend
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          AI-Powered Shopping Assistant
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/login')}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple redirect to dashboard
    alert('Login successful! Redirecting to dashboard...');
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
          Login to RetailRecommend
        </Typography>
        <TextField
          fullWidth
          label="Email"
          type="email"
          defaultValue="demo@retailrecommend.com"
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          defaultValue="demo123"
          sx={{ mb: 3 }}
        />
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleLogin}
          sx={{ mb: 2 }}
        >
          Login
        </Button>
        <Button
          fullWidth
          variant="text"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          🎉 Welcome to Your Dashboard!
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Your AI-powered retailer recommendation system is working!
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" size="large">
            View Products
          </Button>
          <Button variant="outlined" size="large">
            Analytics
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/')}>
            Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

const SimpleApp: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default SimpleApp;
