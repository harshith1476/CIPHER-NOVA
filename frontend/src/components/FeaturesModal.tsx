import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  AutoAwesome as AutoAwesomeIcon,
  LocationOn as LocationIcon,
  Analytics as AnalyticsIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CloudSync as CloudSyncIcon,
  TrendingUp as TrendingUpIcon,
  PersonalVideo as PersonalVideoIcon,
  ShoppingCart as ShoppingCartIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

interface FeaturesModalProps {
  open: boolean;
  onClose: () => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({ open, onClose }) => {
  const features = [
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'AI-Powered Recommendations',
      description: 'Advanced machine learning algorithms analyze your preferences and behavior to suggest perfect products.',
      highlights: ['Content-based filtering', 'Collaborative filtering', 'Deep learning models', 'Real-time adaptation'],
      color: '#667eea'
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: '#764ba2' }} />,
      title: 'Location-Based Services',
      description: 'Get personalized recommendations based on your location, local trends, and nearby retailers.',
      highlights: ['GPS integration', 'Local inventory', 'Weather-based suggestions', 'Nearby store finder'],
      color: '#764ba2'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#f093fb' }} />,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboard with real-time metrics, sales forecasting, and customer insights.',
      highlights: ['Real-time metrics', 'Predictive analytics', 'Customer segmentation', 'Sales forecasting'],
      color: '#f093fb'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#4facfe' }} />,
      title: 'Lightning Fast Performance',
      description: 'Optimized for speed with instant search, quick loading, and seamless user experience.',
      highlights: ['Sub-second search', 'Lazy loading', 'CDN optimization', 'Caching strategies'],
      color: '#4facfe'
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40, color: '#43e97b' }} />,
      title: 'AI Shopping Assistant',
      description: 'Intelligent chatbot powered by Gemini AI to help you find products and answer questions.',
      highlights: ['Natural language processing', 'Product recommendations', '24/7 availability', 'Multi-language support'],
      color: '#43e97b'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#fa709a' }} />,
      title: 'Enterprise Security',
      description: 'Bank-level security with encryption, secure payments, and privacy protection.',
      highlights: ['End-to-end encryption', 'Secure payments', 'GDPR compliant', 'Data privacy'],
      color: '#fa709a'
    },
    {
      icon: <CloudSyncIcon sx={{ fontSize: 40, color: '#ffecd2' }} />,
      title: 'Cloud Synchronization',
      description: 'Seamless sync across all devices with cloud-based data storage and backup.',
      highlights: ['Cross-device sync', 'Cloud backup', 'Offline support', 'Data recovery'],
      color: '#ffecd2'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#a8edea' }} />,
      title: 'Trending Analysis',
      description: 'Stay ahead with trending products, market insights, and popularity predictions.',
      highlights: ['Trend detection', 'Market analysis', 'Popularity scoring', 'Future predictions'],
      color: '#a8edea'
    },
    {
      icon: <PersonalVideoIcon sx={{ fontSize: 40, color: '#d299c2' }} />,
      title: 'Personalized Experience',
      description: 'Tailored interface, custom themes, and personalized content for each user.',
      highlights: ['Custom themes', 'Personal dashboard', 'Adaptive UI', 'User preferences'],
      color: '#d299c2'
    },
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40, color: '#fad0c4' }} />,
      title: 'Smart Shopping Cart',
      description: 'Intelligent cart with price tracking, discount alerts, and purchase optimization.',
      highlights: ['Price tracking', 'Discount alerts', 'Bundle suggestions', 'Wishlist integration'],
      color: '#fad0c4'
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 40, color: '#a18cd1' }} />,
      title: 'Smart Notifications',
      description: 'Intelligent alerts for deals, restocks, price drops, and personalized offers.',
      highlights: ['Deal alerts', 'Restock notifications', 'Price drop alerts', 'Custom preferences'],
      color: '#a18cd1'
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: '#fbc2eb' }} />,
      title: 'Magic Features',
      description: 'Unique features like visual search, voice commands, and AR product preview.',
      highlights: ['Visual search', 'Voice commands', 'AR preview', 'Smart filters'],
      color: '#fbc2eb'
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AutoAwesomeIcon sx={{ fontSize: 32, color: '#fff' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
            Unique Features
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9, textAlign: 'center' }}>
          Discover what makes our AI-powered retail platform truly exceptional
        </Typography>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    background: 'rgba(255,255,255,0.15)',
                  }
                }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: 2,
                      p: 1,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, flexGrow: 1 }}>
                    {feature.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {feature.highlights.map((highlight, idx) => (
                      <Chip
                        key={idx}
                        label={highlight}
                        size="small"
                        sx={{
                          background: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: '0.75rem',
                          height: 24,
                          '&:hover': {
                            background: 'rgba(255,255,255,0.3)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 4, p: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            🚀 Ready to Experience the Future of Shopping?
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Join thousands of satisfied customers who are already enjoying our AI-powered recommendations,
            personalized shopping experience, and cutting-edge features.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FeaturesModal;
