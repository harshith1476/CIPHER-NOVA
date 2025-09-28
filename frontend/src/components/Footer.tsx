import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Store as StoreIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        mt: 'auto',
        pt: 6,
        pb: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
        }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StoreIcon sx={{ mr: 1, fontSize: 32, color: '#667eea' }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  RetailRecommend
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
                Your AI-powered shopping companion. Discover personalized product recommendations, 
                explore trending items, and enjoy a smarter shopping experience with cutting-edge technology.
              </Typography>
              
              {/* Stats */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Chip 
                  label="10K+ Customers" 
                  size="small" 
                  sx={{ 
                    background: 'rgba(102,126,234,0.2)', 
                    color: 'white',
                    border: '1px solid rgba(102,126,234,0.3)'
                  }} 
                />
                <Chip 
                  label="500+ Products" 
                  size="small" 
                  sx={{ 
                    background: 'rgba(118,75,162,0.2)', 
                    color: 'white',
                    border: '1px solid rgba(118,75,162,0.3)'
                  }} 
                />
                <Chip 
                  label="AI-Powered" 
                  size="small" 
                  sx={{ 
                    background: 'rgba(255,107,107,0.2)', 
                    color: 'white',
                    border: '1px solid rgba(255,107,107,0.3)'
                  }} 
                />
              </Box>

              {/* Social Media */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[
                  { icon: <FacebookIcon />, color: '#1877f2' },
                  { icon: <TwitterIcon />, color: '#1da1f2' },
                  { icon: <InstagramIcon />, color: '#e4405f' },
                  { icon: <LinkedInIcon />, color: '#0077b5' },
                ].map((social, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': {
                        background: social.color,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                'Home',
                'Products',
                'Categories',
                'Deals',
                'New Arrivals',
                'Best Sellers'
              ].map((link) => (
                <Link
                  key={link}
                  href="#"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: '#667eea',
                      textDecoration: 'underline',
                    },
                    transition: 'color 0.3s ease'
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                'Help Center',
                'Contact Us',
                'Shipping Info',
                'Returns',
                'Size Guide',
                'Track Order'
              ].map((link) => (
                <Link
                  key={link}
                  href="#"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: '#667eea',
                      textDecoration: 'underline',
                    },
                    transition: 'color 0.3s ease'
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
              Get in Touch
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  background: 'rgba(102,126,234,0.2)', 
                  p: 1, 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <EmailIcon sx={{ color: '#667eea' }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                    support@retailrecommend.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  background: 'rgba(118,75,162,0.2)', 
                  p: 1, 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <PhoneIcon sx={{ color: '#764ba2' }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Phone
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                    +1 (555) 123-4567
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  background: 'rgba(255,107,107,0.2)', 
                  p: 1, 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <LocationIcon sx={{ color: '#ff6b6b' }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Address
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                    123 Commerce St, Tech City, TC 12345
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Newsletter */}
            <Box sx={{ mt: 3, p: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                📧 Stay Updated
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Get the latest deals and recommendations delivered to your inbox.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            © {currentYear} RetailRecommend. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Made with
            </Typography>
            <FavoriteIcon sx={{ color: '#ff6b6b', fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              using AI Technology
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map((link) => (
              <Link
                key={link}
                href="#"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  '&:hover': {
                    color: '#667eea',
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                {link}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
