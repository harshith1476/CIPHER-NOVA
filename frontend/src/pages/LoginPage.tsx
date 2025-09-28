import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(loginData.email, loginData.password);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone || undefined,
      });
      
      if (result.success) {
        toast.success('Registration successful! Welcome!');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <StoreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          RetailRecommend
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your AI-powered shopping companion
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab
            icon={<LoginIcon />}
            label="Login"
            iconPosition="start"
          />
          <Tab
            icon={<PersonAddIcon />}
            label="Register"
            iconPosition="start"
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Login Tab */}
        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
              sx={{ mb: 3 }}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
              sx={{ mb: 3 }}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Box>
          </form>
        </TabPanel>

        {/* Register Tab */}
        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleRegisterSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              required
              sx={{ mb: 2 }}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              required
              sx={{ mb: 2 }}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Phone (Optional)"
              value={registerData.phone}
              onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
              sx={{ mb: 2 }}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
              sx={{ mb: 2 }}
              disabled={loading}
              helperText="Minimum 6 characters"
            />
            
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              required
              sx={{ mb: 3 }}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
          </form>
        </TabPanel>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Typography>
          
          <Button
            variant="text"
            onClick={() => navigate('/')}
            sx={{ textTransform: 'none' }}
          >
            ← Back to Home
          </Button>
        </Box>
      </Paper>

      {/* Demo Credentials */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mt: 3, 
          bgcolor: 'info.light', 
          color: 'info.contrastText',
          borderRadius: 2 
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Demo Credentials:
        </Typography>
        <Typography variant="body2">
          Email: demo@retailrecommend.com<br />
          Password: demo123
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
