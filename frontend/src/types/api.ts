// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  retailer_id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  rating: number;
  image_url: string;
  stock_quantity: number;
  brand?: string;
  tags?: string[];
}

export interface ProductsResponse {
  products: Product[];
  count: number;
}

// Recommendation Types
export interface Recommendation {
  product_id: string;
  name: string;
  price: number;
  rating: number;
  reason: string;
  category: string;
  similarity_score?: number;
  collaborative_score?: number;
  trend_score?: number;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  total_count: number;
  categories: string[];
  generated_at: string;
}

// Location Types
export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
  accuracy?: number;
  timestamp: number;
}

export interface Promotion {
  type: string;
  title: string;
  description: string;
  discount: number;
  categories: string[];
  reason: string;
}

export interface PromotionsResponse {
  promotions: Promotion[];
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface LocalTrendsResponse {
  location: {
    latitude: number;
    longitude: number;
    radius_km: number;
  };
  period_days: number;
  total_local_purchases: number;
  top_products: Array<{
    product_id: string;
    name: string;
    category: string;
    count: number;
    total_spent: number;
  }>;
  top_categories: Array<{
    category: string;
    count: number;
    total_spent: number;
    unique_products: number;
  }>;
  generated_at: string;
}

// Analytics Types
export interface DashboardData {
  daily_summary: {
    date: string;
    total_sales: number;
    total_orders: number;
    unique_customers: number;
    average_order_value: number;
    top_products: Array<{
      product_id: string;
      name: string;
      category: string;
      units_sold: number;
      revenue: number;
    }>;
    category_performance: Array<{
      category: string;
      units_sold: number;
      revenue: number;
    }>;
    generated_at: string;
  };
  weekly_trends: {
    period_weeks: number;
    weekly_trends: Array<{
      week: string;
      sales: number;
      orders: number;
      unique_customers: number;
      sales_growth_rate?: number;
    }>;
    generated_at: string;
  };
  customer_analytics: {
    total_customers: number;
    customer_segments: {
      high_value: number;
      medium_value: number;
      low_value: number;
    };
    lifetime_value_percentiles: {
      '25th': number;
      '50th': number;
      '75th': number;
      '90th': number;
    };
    average_customer_value: number;
    generated_at: string;
  };
  real_time_metrics: {
    timestamp: string;
    today: {
      sales: number;
      orders: number;
      average_order_value: number;
    };
    current_hour: {
      sales: number;
      orders: number;
    };
    active_customers_24h: number;
    low_stock_alerts: number;
    system_status: string;
  };
  charts: {
    sales_trend: {
      type: string;
      data: {
        labels: string[];
        datasets: Array<{
          label: string;
          data: number[];
          borderColor: string;
          backgroundColor: string;
        }>;
      };
    };
    category_distribution: {
      type: string;
      data: {
        labels: string[];
        datasets: Array<{
          data: number[];
          backgroundColor: string[];
        }>;
      };
    };
    top_products: {
      type: string;
      data: {
        labels: string[];
        datasets: Array<{
          label: string;
          data: number[];
          backgroundColor: string;
        }>;
      };
    };
  };
  generated_at: string;
}

// Axios Config Extension
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}
