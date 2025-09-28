import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  ApiResponse, 
  LoginResponse, 
  User, 
  ProductsResponse, 
  RecommendationsResponse,
  PromotionsResponse,
  LocalTrendsResponse,
  DashboardData
} from '../types/api';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Use port 5000 as per the memory about backend configuration
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        (config as any).metadata = { startTime: new Date() };
        
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        const duration = (response.config as any).metadata?.startTime 
          ? new Date().getTime() - (response.config as any).metadata.startTime.getTime()
          : 0;
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
        
        return response;
      },
      (error: AxiosError) => {
        const duration = (error.config as any)?.metadata?.startTime 
          ? new Date().getTime() - (error.config as any).metadata.startTime.getTime()
          : 0;
        
        console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });

        // Handle specific error cases
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          // Forbidden
          console.warn('Access forbidden - insufficient permissions');
        } else if (error.response?.status && error.response.status >= 500) {
          // Server error
          console.error('Server error - please try again later');
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.request({
        method,
        url,
        data,
        ...config,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'An unexpected error occurred';

      return {
        success: false,
        error: errorMessage,
        data: error.response?.data,
      };
    }
  }

  // HTTP Methods
  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  // Authentication methods
  async login(credentials: { email: string; password: string }): Promise<ApiResponse> {
    const response = await this.post('/api/auth/login', credentials);
    
    if (response.success && response.data) {
      const loginData = response.data as LoginResponse;
      localStorage.setItem('auth_token', loginData.token);
      localStorage.setItem('user_data', JSON.stringify(loginData.user));
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.post('/api/auth/logout');
      
      // Clear local storage regardless of response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      return response;
    } catch (error) {
      // Clear local storage even if logout request fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      return { success: true };
    }
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<ApiResponse> {
    return this.post('/api/auth/register', userData);
  }

  async checkAuthStatus(): Promise<ApiResponse> {
    return this.get('/api/auth/status');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.get('/health');
  }

  // Enhanced services health check
  async servicesHealthCheck(): Promise<ApiResponse> {
    return this.get('/api/health/services');
  }

  // AI Recommendations
  async getPersonalizedRecommendations(params: {
    retailer_id: string;
    latitude?: number;
    longitude?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    return this.post('/api/ai/recommendations/personalized', params);
  }

  async getTrendingRecommendations(limit: number = 10): Promise<ApiResponse> {
    return this.get(`/api/ai/recommendations/trending?limit=${limit}`);
  }

  async getSimilarProducts(productId: string, limit: number = 5): Promise<ApiResponse> {
    return this.get(`/api/ai/recommendations/similar/${productId}?limit=${limit}`);
  }

  // Location Services
  async getNearbyRetailers(params: {
    latitude: number;
    longitude: number;
    radius_km?: number;
  }): Promise<ApiResponse> {
    return this.post('/api/location/nearby-retailers', params);
  }

  async getLocalTrends(params: {
    latitude: number;
    longitude: number;
    radius_km?: number;
    days?: number;
  }): Promise<ApiResponse> {
    return this.post('/api/location/local-trends', params);
  }

  async getLocationPromotions(params: {
    latitude: number;
    longitude: number;
  }): Promise<ApiResponse> {
    return this.post('/api/location/promotions', params);
  }

  async getDeliveryEstimate(params: {
    retailer_latitude: number;
    retailer_longitude: number;
    customer_latitude: number;
    customer_longitude: number;
  }): Promise<ApiResponse> {
    return this.post('/api/location/delivery-estimate', params);
  }

  async getRealTimeLocationUpdates(params: {
    latitude: number;
    longitude: number;
  }): Promise<ApiResponse> {
    return this.post('/api/location/real-time-updates', params);
  }

  async trackUserLocation(params: {
    retailer_id: string;
    latitude: number;
    longitude: number;
    activity?: string;
  }): Promise<ApiResponse> {
    return this.post('/api/location/track', params);
  }

  // Analytics
  async getDashboardAnalytics(): Promise<ApiResponse> {
    return this.get('/api/analytics/dashboard');
  }

  async getSalesForecast(daysAhead: number = 30): Promise<ApiResponse> {
    return this.get(`/api/analytics/sales-forecast?days=${daysAhead}`);
  }

  async getProductPerformance(days: number = 30): Promise<ApiResponse> {
    return this.get(`/api/analytics/product-performance?days=${days}`);
  }

  async getRealTimeAnalytics(): Promise<ApiResponse> {
    return this.get('/api/analytics/real-time');
  }

  // Products
  async populateProducts(): Promise<ApiResponse> {
    return this.post('/api/products/populate');
  }

  async getProductsByCategory(category: string, limit: number = 20): Promise<ApiResponse> {
    return this.get(`/api/products/category/${category}?limit=${limit}`);
  }

  async searchProducts(query: string, limit: number = 20): Promise<ApiResponse> {
    return this.get(`/api/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getFeaturedProducts(limit: number = 10): Promise<ApiResponse> {
    return this.get(`/api/products/featured?limit=${limit}`);
  }

  async getProduct(productId: string): Promise<ApiResponse> {
    return this.get(`/api/products/${productId}`);
  }

  // Utility methods
  getBaseURL(): string {
    return this.baseURL;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // File upload helper
  async uploadFile(file: File, endpoint: string): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('POST', endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Batch requests helper
  async batchRequests(requests: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    data?: any;
  }>): Promise<ApiResponse[]> {
    const promises = requests.map(req => 
      this.request(req.method, req.url, req.data)
    );

    try {
      const results = await Promise.allSettled(promises);
      return results.map(result => 
        result.status === 'fulfilled' 
          ? result.value 
          : { success: false, error: 'Request failed' }
      );
    } catch (error) {
      console.error('Batch requests failed:', error);
      return requests.map(() => ({ success: false, error: 'Batch request failed' }));
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;
