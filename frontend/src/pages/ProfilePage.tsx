import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { toast } from 'react-toastify';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { location, requestLocation, clearLocation } = useLocation();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    locationTracking: !!location,
    personalizedRecommendations: true,
    marketingEmails: false,
  });

  const handleSaveProfile = () => {
    // In a real app, this would make an API call
    toast.success('Profile updated successfully!');
    setEditing(false);
  };

  const handlePreferenceChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({
      ...prev,
      [key]: event.target.checked
    }));

    if (key === 'locationTracking') {
      if (event.target.checked) {
        requestLocation();
      } else {
        clearLocation();
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Personal Information
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{ width: 80, height: 80, mr: 3 }}
                  src={user?.avatar}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">{user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Button size="small" sx={{ mt: 1 }}>
                    Change Photo
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Retailer ID"
                    value={user?.retailer_id || ''}
                    disabled
                    helperText="This is your unique identifier"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                {editing ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Location & Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Location
                </Typography>
              </Box>

              {location ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current Location:
                  </Typography>
                  <Typography variant="body1">
                    {location.city}, {location.region}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {location.country}
                  </Typography>
                  <Chip
                    label="Location Enabled"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      onClick={requestLocation}
                      variant="outlined"
                    >
                      Update Location
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Enable location for personalized recommendations
                  </Alert>
                  <Button
                    variant="contained"
                    onClick={requestLocation}
                    fullWidth
                  >
                    Enable Location
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Account Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip label="Active Account" color="success" />
                <Chip label="Email Verified" color="success" />
                <Chip label="Premium Features" color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Preferences & Privacy
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Notifications
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.emailNotifications}
                          onChange={handlePreferenceChange('emailNotifications')}
                        />
                      }
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.pushNotifications}
                          onChange={handlePreferenceChange('pushNotifications')}
                        />
                      }
                      label="Push Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.marketingEmails}
                          onChange={handlePreferenceChange('marketingEmails')}
                        />
                      }
                      label="Marketing Emails"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Privacy & Personalization
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.locationTracking}
                          onChange={handlePreferenceChange('locationTracking')}
                        />
                      }
                      label="Location Tracking"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.personalizedRecommendations}
                          onChange={handlePreferenceChange('personalizedRecommendations')}
                        />
                      }
                      label="Personalized Recommendations"
                    />
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Security
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="outlined">
                  Change Password
                </Button>
                <Button variant="outlined">
                  Two-Factor Authentication
                </Button>
                <Button variant="outlined">
                  Download My Data
                </Button>
                <Button variant="outlined" color="error">
                  Delete Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
