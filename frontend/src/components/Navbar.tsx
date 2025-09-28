import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  LocationOn as LocationOnIcon,
  ShoppingCart as ShoppingCartIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Store as StoreIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocation as useLocationContext } from '../contexts/LocationContext';
import FeaturesModal from './FeaturesModal';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { location: userLocation, requestLocation } = useLocationContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/');
  };

  const handleLocationRequest = () => {
    requestLocation();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': { 
              background: 'rgba(255,255,255,0.2)',
              transform: 'translateY(-1px)'
            }
          }}
          onClick={() => navigate('/')}
          >
            <StoreIcon sx={{ mr: 1, fontSize: 28, color: '#fff' }} />
            <Typography
              variant="h5"
              component="div"
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}
            >
              RetailRecommend
            </Typography>
          </Box>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, mr: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              position: 'relative',
              background: isActive('/') ? 'rgba(255,255,255,0.2)' : 'transparent',
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-1px)'
              },
              '&::after': isActive('/') ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '2px',
                background: '#fff',
                borderRadius: '2px'
              } : {}
            }}
          >
            🏠 Home
          </Button>
          
          <Button
            color="inherit"
            onClick={() => setFeaturesOpen(true)}
            sx={{
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              position: 'relative',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                background: 'rgba(255,255,255,0.2)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb)',
                borderRadius: 'inherit',
                zIndex: -1,
                opacity: 0,
                transition: 'opacity 0.3s ease'
              },
              '&:hover::before': {
                opacity: 1
              },
              transition: 'all 0.3s ease'
            }}
          >
            ✨ Features
          </Button>
          
          {user && (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/dashboard')}
                sx={{
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  position: 'relative',
                  background: isActive('/dashboard') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)'
                  },
                  '&::after': isActive('/dashboard') ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '2px',
                    background: '#fff',
                    borderRadius: '2px'
                  } : {}
                }}
              >
                📊 Dashboard
              </Button>
              
              <Button
                color="inherit"
                onClick={() => navigate('/products')}
                sx={{
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  position: 'relative',
                  background: isActive('/products') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)'
                  },
                  '&::after': isActive('/products') ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '2px',
                    background: '#fff',
                    borderRadius: '2px'
                  } : {}
                }}
              >
                🛍️ Products
              </Button>
              
              <Button
                color="inherit"
                onClick={() => navigate('/analytics')}
                sx={{
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  position: 'relative',
                  background: isActive('/analytics') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)'
                  },
                  '&::after': isActive('/analytics') ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '2px',
                    background: '#fff',
                    borderRadius: '2px'
                  } : {}
                }}
              >
                📈 Analytics
              </Button>
            </>
          )}
        </Box>

        {/* Location Indicator */}
        {userLocation && (
          <Tooltip title={`${userLocation.city || 'Unknown'}, ${userLocation.region || 'Unknown'}`}>
            <Chip
              icon={<LocationOnIcon />}
              label={userLocation.city || 'Location'}
              size="small"
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.5)',
                mr: 2,
                '& .MuiChip-icon': { color: 'white' }
              }}
              onClick={handleLocationRequest}
            />
          </Tooltip>
        )}

        {!userLocation && user && (
          <Tooltip title="Enable location for personalized recommendations">
            <IconButton
              color="inherit"
              onClick={handleLocationRequest}
              sx={{ mr: 1 }}
            >
              <LocationOnIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* User Actions */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notifications */}
            <IconButton
              color="inherit"
              onClick={handleNotificationOpen}
              sx={{
                background: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <Badge 
                badgeContent={3} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                    animation: 'pulse 2s infinite'
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* User Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Premium Member
                </Typography>
              </Box>
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{
                  p: 0,
                  '&:hover': {
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Avatar
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)'
                  }}
                  src={user.avatar}
                  alt={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>

            {/* User Menu Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>

            {/* Notifications Menu */}
            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleNotificationClose}>
                <Typography variant="body2">
                  New recommendations available
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                <Typography variant="body2">
                  Special offer in your area
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                <Typography variant="body2">
                  Weekly analytics ready
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/products')}
              sx={{ 
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              🛍️ Browse
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              sx={{ 
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              🚀 Login
            </Button>
          </Box>
        )}

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          sx={{ display: { xs: 'block', md: 'none' }, ml: 1 }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      
      {/* Features Modal */}
      <FeaturesModal 
        open={featuresOpen} 
        onClose={() => setFeaturesOpen(false)} 
      />
    </AppBar>
  );
};

export default Navbar;
