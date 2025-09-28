import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from './AuthContext';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
  accuracy?: number;
  timestamp: number;
}

interface LocationContextType {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
  trackLocation: (activity?: string) => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Try to get location from localStorage on mount
    const savedLocation = localStorage.getItem('user_location');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        // Check if location is not too old (1 hour)
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - parsedLocation.timestamp < oneHour) {
          setLocation(parsedLocation);
        } else {
          localStorage.removeItem('user_location');
        }
      } catch (error) {
        console.error('Invalid location data in localStorage:', error);
        localStorage.removeItem('user_location');
      }
    }

    // Auto-request location if user is logged in and no location is saved
    if (user && !location) {
      requestLocation();
    }
  }, [user]);

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          }
        );
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now(),
      };

      // Try to get additional location info (city, region, etc.)
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${locationData.latitude}&longitude=${locationData.longitude}&localityLanguage=en`
        );
        
        if (response.ok) {
          const geoData = await response.json();
          locationData.city = geoData.city || geoData.locality;
          locationData.region = geoData.principalSubdivision;
          locationData.country = geoData.countryName;
        }
      } catch (geoError) {
        console.warn('Failed to get location details:', geoError);
      }

      setLocation(locationData);
      localStorage.setItem('user_location', JSON.stringify(locationData));
      
      // Track location if user is logged in
      if (user?.retailer_id) {
        await trackLocation('location_update');
      }

    } catch (error: any) {
      let errorMessage = 'Failed to get location';
      
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location services.';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please try again.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      }
      
      setError(errorMessage);
      console.error('Geolocation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
    localStorage.removeItem('user_location');
  };

  const trackLocation = async (activity: string = 'browse') => {
    if (!user?.retailer_id || !location) {
      return;
    }

    try {
      await apiService.trackUserLocation({
        retailer_id: user.retailer_id,
        latitude: location.latitude,
        longitude: location.longitude,
        activity,
      });
    } catch (error) {
      console.warn('Failed to track location:', error);
    }
  };

  // Auto-track location changes
  useEffect(() => {
    if (location && user?.retailer_id) {
      const trackingInterval = setInterval(() => {
        trackLocation('background');
      }, 5 * 60 * 1000); // Track every 5 minutes

      return () => clearInterval(trackingInterval);
    }
  }, [location, user]);

  const value: LocationContextType = {
    location,
    loading,
    error,
    requestLocation,
    clearLocation,
    trackLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
