import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Skeleton,
  Alert,
  Paper,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

interface Product {
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
  predicted_stock?: number;
  stock_trend?: 'increasing' | 'decreasing' | 'stable';
  last_restocked?: string;
  delivery_time?: string;
  isHot?: boolean;
  discount?: number;
  weight?: string;
  volume?: string;
  type?: string;
  reviews?: number;
}

interface CategoryStats {
  category: string;
  count: number;
  avgPrice: number;
  avgRating: number;
  totalStock: number;
}

interface PriceRange {
  range: string;
  count: number;
  percentage: number;
  [key: string]: any; // Add index signature for chart compatibility
}

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

// EXACT B2B Marketplace products from uploaded images
const MANUAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Basmati Rice 25kg',
    description: 'India Gate • Rice & Grains',
    category: 'Food & Beverages',
    subcategory: 'Rice & Grains',
    price: 2450,
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format',
    stock_quantity: 25,
    brand: 'India Gate',
    tags: ['basmati', 'rice', 'premium', 'bulk'],
    isHot: true,
    discount: 36,
    weight: '25kg',
    type: 'Basmati',
    reviews: 734
  },
  {
    id: '2',
    name: 'Coca Cola 2L Pack of 12',
    description: 'Coca Cola • Cold Drink',
    category: 'Food & Beverages',
    subcategory: 'Cold Drinks',
    price: 840,
    rating: 4.2,
    image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop&auto=format',
    stock_quantity: 48,
    brand: 'Coca Cola',
    tags: ['cola', 'cold-drink', 'pack', 'bulk'],
    isHot: true,
    discount: 0,
    volume: '2L x 12',
    type: 'Carbonated Drink',
    reviews: 156
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    description: '13-inch laptop with M3 chip, 18-hour battery life, and Liquid Retina display',
    category: 'Electronics',
    subcategory: 'Laptops',
    price: 1099.99,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=400&fit=crop',
    stock_quantity: 25,
    brand: 'Apple',
    tags: ['apple', 'laptop', 'm3', 'portable']
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling wireless headphones with 30-hour battery',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 399.99,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
    stock_quantity: 75,
    brand: 'Sony',
    tags: ['sony', 'headphones', 'noise-canceling', 'wireless']
  },
  {
    id: '5',
    name: 'Nike Air Max 270',
    description: 'Lifestyle sneakers with large Air unit and breathable mesh upper',
    category: 'Clothing',
    subcategory: 'Shoes',
    price: 150.00,
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=400&fit=crop',
    stock_quantity: 80,
    brand: 'Nike',
    tags: ['nike', 'sneakers', 'air-max', 'lifestyle']
  },
  {
    id: '6',
    name: 'KitchenAid Stand Mixer',
    description: 'Professional 5-quart stand mixer with multiple attachments',
    category: 'Home & Garden',
    subcategory: 'Kitchen',
    price: 379.99,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop',
    stock_quantity: 25,
    brand: 'KitchenAid',
    tags: ['kitchenaid', 'mixer', 'baking', 'kitchen']
  },
  {
    id: '7',
    name: 'Atomic Habits Book',
    description: 'Life-changing book about building good habits and breaking bad ones',
    category: 'Books & Media',
    subcategory: 'Self-Help',
    price: 18.99,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=400&fit=crop',
    stock_quantity: 180,
    brand: 'Avery',
    tags: ['book', 'habits', 'self-improvement', 'productivity']
  },
  {
    id: '8',
    name: 'Dyson V15 Detect',
    description: 'Cordless vacuum with laser dust detection and powerful suction',
    category: 'Home & Garden',
    subcategory: 'Appliances',
    price: 749.99,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
    stock_quantity: 30,
    brand: 'Dyson',
    tags: ['dyson', 'vacuum', 'cordless', 'cleaning']
  },
  {
    id: '9',
    name: 'Peloton Bike+',
    description: 'Interactive exercise bike with live and on-demand classes',
    category: 'Sports & Outdoors',
    subcategory: 'Fitness',
    price: 2495.00,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    stock_quantity: 10,
    brand: 'Peloton',
    tags: ['peloton', 'exercise-bike', 'fitness', 'interactive']
  },
  {
    id: '10',
    name: 'Olaplex Hair Treatment',
    description: 'Professional hair treatment that repairs and strengthens damaged hair',
    category: 'Beauty & Personal Care',
    subcategory: 'Hair Care',
    price: 28.00,
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=500&h=400&fit=crop',
    stock_quantity: 90,
    brand: 'Olaplex',
    tags: ['olaplex', 'hair-care', 'treatment', 'professional']
  },
  {
    id: '11',
    name: 'Blue Bottle Coffee Beans',
    description: 'Premium single-origin coffee beans, freshly roasted',
    category: 'Food & Beverages',
    subcategory: 'Coffee',
    price: 22.00,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=400&fit=crop',
    stock_quantity: 75,
    brand: 'Blue Bottle',
    tags: ['coffee', 'premium', 'single-origin', 'fresh']
  },
  {
    id: '12',
    name: 'PlayStation 5 Console',
    description: 'Next-gen gaming console with 4K gaming, ray tracing, and ultra-fast SSD',
    category: 'Electronics',
    subcategory: 'Gaming',
    price: 499.99,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=400&fit=crop',
    stock_quantity: 8,
    brand: 'Sony',
    tags: ['sony', 'gaming', 'console', '4k', 'ray-tracing']
  },
  
  // Additional Electronics
  {
    id: '13',
    name: 'iPad Pro 12.9" M2',
    description: 'Professional tablet with M2 chip, Liquid Retina XDR display, Apple Pencil support',
    category: 'Electronics',
    subcategory: 'Tablets',
    price: 1099.99,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=400&fit=crop',
    stock_quantity: 32,
    brand: 'Apple',
    tags: ['apple', 'tablet', 'professional', 'm2', 'pencil']
  },
  {
    id: '14',
    name: 'Samsung 65" QLED 4K TV',
    description: 'Quantum Dot technology TV with HDR10+, smart TV features, and gaming mode',
    category: 'Electronics',
    subcategory: 'TVs',
    price: 1299.99,
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=400&fit=crop',
    stock_quantity: 18,
    brand: 'Samsung',
    tags: ['samsung', 'tv', '4k', 'smart-tv', 'qled']
  },
  {
    id: '15',
    name: 'AirPods Pro 2nd Gen',
    description: 'Active noise cancellation earbuds with spatial audio and MagSafe charging case',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 249.99,
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=400&fit=crop',
    stock_quantity: 67,
    brand: 'Apple',
    tags: ['apple', 'earbuds', 'wireless', 'noise-canceling', 'spatial-audio']
  },
  
  // Fashion & Clothing
  {
    id: '16',
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight-leg jeans with authentic fit and timeless style',
    category: 'Clothing',
    subcategory: 'Jeans',
    price: 89.99,
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=400&fit=crop',
    stock_quantity: 156,
    brand: 'Levi\'s',
    tags: ['levis', 'jeans', 'classic', 'denim', 'straight-leg']
  },
  {
    id: '17',
    name: 'Adidas Ultraboost 22',
    description: 'Running shoes with responsive Boost midsole and Primeknit upper',
    category: 'Clothing',
    subcategory: 'Shoes',
    price: 190.00,
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop',
    stock_quantity: 89,
    brand: 'Adidas',
    tags: ['adidas', 'running', 'boost', 'performance', 'primeknit']
  },
  {
    id: '18',
    name: 'Zara Tailored Blazer',
    description: 'Modern tailored blazer perfect for business and casual wear',
    category: 'Clothing',
    subcategory: 'Blazers',
    price: 129.99,
    rating: 4.3,
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=400&fit=crop',
    stock_quantity: 43,
    brand: 'Zara',
    tags: ['zara', 'blazer', 'formal', 'tailored', 'business']
  },
  
  // Home & Kitchen
  {
    id: '19',
    name: 'Instant Pot Duo 7-in-1',
    description: 'Multi-use pressure cooker, slow cooker, rice cooker, steamer, and more',
    category: 'Home & Garden',
    subcategory: 'Kitchen',
    price: 99.99,
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1585515656973-a0b8b2a8c7e7?w=500&h=400&fit=crop',
    stock_quantity: 124,
    brand: 'Instant Pot',
    tags: ['instant-pot', 'pressure-cooker', 'multi-use', 'cooking', '7-in-1']
  },
  {
    id: '20',
    name: 'Philips Hue Smart Bulbs 4-Pack',
    description: 'Color-changing LED smart bulbs with app control and voice activation',
    category: 'Home & Garden',
    subcategory: 'Smart Home',
    price: 199.99,
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
    stock_quantity: 78,
    brand: 'Philips',
    tags: ['philips', 'smart-home', 'led', 'lighting', 'color-changing']
  },
  {
    id: '21',
    name: 'iRobot Roomba i7+',
    description: 'Self-emptying robot vacuum with smart mapping and app control',
    category: 'Home & Garden',
    subcategory: 'Appliances',
    price: 599.99,
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
    stock_quantity: 34,
    brand: 'iRobot',
    tags: ['roomba', 'robot-vacuum', 'smart', 'cleaning', 'self-emptying']
  },
  
  // Sports & Fitness
  {
    id: '22',
    name: 'Yeti Rambler 30oz Tumbler',
    description: 'Insulated stainless steel tumbler that keeps drinks hot or cold all day',
    category: 'Sports & Outdoors',
    subcategory: 'Drinkware',
    price: 39.99,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=400&fit=crop',
    stock_quantity: 234,
    brand: 'Yeti',
    tags: ['yeti', 'tumbler', 'insulated', 'outdoor', 'stainless-steel']
  },
  {
    id: '23',
    name: 'Wilson Pro Staff Tennis Racket',
    description: 'Professional tennis racket with graphite frame and comfortable grip',
    category: 'Sports & Outdoors',
    subcategory: 'Tennis',
    price: 199.99,
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=400&fit=crop',
    stock_quantity: 56,
    brand: 'Wilson',
    tags: ['wilson', 'tennis', 'racket', 'sports', 'professional']
  },
  {
    id: '24',
    name: 'Fitbit Charge 5',
    description: 'Advanced fitness tracker with GPS, heart rate monitoring, and 7-day battery',
    category: 'Sports & Outdoors',
    subcategory: 'Fitness',
    price: 179.99,
    rating: 4.4,
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    stock_quantity: 91,
    brand: 'Fitbit',
    tags: ['fitbit', 'fitness-tracker', 'gps', 'heart-rate', 'health']
  },
  
  // Books & Media
  {
    id: '25',
    name: 'The Psychology of Money',
    description: 'Bestselling book about the psychology behind financial decisions by Morgan Housel',
    category: 'Books & Media',
    subcategory: 'Business',
    price: 16.99,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=400&fit=crop',
    stock_quantity: 287,
    brand: 'Harriman House',
    tags: ['book', 'finance', 'psychology', 'bestseller', 'money']
  },
  {
    id: '26',
    name: 'Think and Grow Rich',
    description: 'Classic personal development book by Napoleon Hill',
    category: 'Books & Media',
    subcategory: 'Self-Help',
    price: 14.99,
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=400&fit=crop',
    stock_quantity: 198,
    brand: 'Tribeca Books',
    tags: ['book', 'self-help', 'classic', 'napoleon-hill', 'success']
  },
  
  // Beauty & Personal Care
  {
    id: '27',
    name: 'The Ordinary Niacinamide 10%',
    description: 'High-strength vitamin and zinc serum for blemish-prone skin',
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    price: 7.90,
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=400&fit=crop',
    stock_quantity: 456,
    brand: 'The Ordinary',
    tags: ['skincare', 'serum', 'niacinamide', 'affordable', 'blemish']
  },
  {
    id: '28',
    name: 'CeraVe Hydrating Cleanser',
    description: 'Gentle daily cleanser with ceramides and hyaluronic acid',
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    price: 12.99,
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=500&h=400&fit=crop',
    stock_quantity: 234,
    brand: 'CeraVe',
    tags: ['cerave', 'cleanser', 'hydrating', 'ceramides', 'gentle']
  },
  
  // Food & Beverages
  {
    id: '29',
    name: 'Starbucks Pike Place Ground Coffee',
    description: 'Medium roast ground coffee with smooth, well-rounded flavor',
    category: 'Food & Beverages',
    subcategory: 'Coffee',
    price: 9.99,
    rating: 4.4,
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=400&fit=crop',
    stock_quantity: 167,
    brand: 'Starbucks',
    tags: ['starbucks', 'coffee', 'medium-roast', 'ground', 'pike-place']
  },
  {
    id: '3',
    name: 'Haldiram Namkeen Combo Pack',
    description: 'Haldiram • Traditional Snacks',
    category: 'Food & Beverages',
    subcategory: 'Snacks',
    price: 650,
    rating: 4.3,
    image_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=300&fit=crop&auto=format',
    stock_quantity: 32,
    brand: 'Haldiram',
    tags: ['namkeen', 'snacks', 'traditional', 'combo'],
    isHot: false,
    discount: 78,
    weight: '1kg',
    type: 'Traditional Snacks',
    reviews: 189
  },
  {
    id: '4',
    name: 'Tata Tea Gold 1kg',
    description: 'Tata Tea • Tea & Coffee',
    category: 'Food & Beverages',
    subcategory: 'Tea & Coffee',
    price: 320,
    rating: 4.4,
    image_url: 'https://images.unsplash.com/photo-1594631661960-0d14c1c2c4c5?w=300&h=200&fit=crop',
    stock_quantity: 67,
    brand: 'Tata Tea',
    tags: ['tea', 'gold', 'premium', 'bulk'],
    isHot: false,
    discount: 15,
    weight: '1kg',
    type: 'Black Tea'
  },
  {
    id: '5',
    name: 'Amul Butter 500g Pack of 6',
    description: 'Amul • Dairy Products',
    category: 'Food & Beverages',
    subcategory: 'Dairy',
    price: 1200,
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=200&fit=crop',
    stock_quantity: 28,
    brand: 'Amul',
    tags: ['butter', 'dairy', 'pack', 'bulk'],
    isHot: true,
    discount: 12,
    weight: '500g x 6',
    type: 'Dairy Product'
  },
  {
    id: '6',
    name: 'Maggi Noodles Masala Pack of 24',
    description: 'Maggi • Instant Food',
    category: 'Food & Beverages',
    subcategory: 'Instant Food',
    price: 480,
    rating: 4.1,
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
    stock_quantity: 89,
    brand: 'Maggi',
    tags: ['noodles', 'instant', 'masala', 'bulk'],
    isHot: true,
    discount: 20,
    weight: '70g x 24',
    type: 'Instant Noodles'
  }
];

// Add live stock prediction and delivery simulation
const addLiveStockData = (products: Product[]): Product[] => {
  return products.map(product => {
    const currentTime = new Date();
    const stockTrend = product.stock_quantity < 20 ? 'decreasing' : 
                     product.stock_quantity > 100 ? 'increasing' : 'stable';
    
    const predictedStock = Math.max(0, product.stock_quantity + 
      (stockTrend === 'increasing' ? Math.floor(Math.random() * 20) : 
       stockTrend === 'decreasing' ? -Math.floor(Math.random() * 10) : 
       Math.floor(Math.random() * 10) - 5));
    
    const deliveryHours = Math.floor(Math.random() * 48) + 2;
    const deliveryTime = deliveryHours < 24 ? `${deliveryHours} hours` : `${Math.floor(deliveryHours/24)} days`;
    
    return {
      ...product,
      predicted_stock: predictedStock,
      stock_trend: stockTrend,
      last_restocked: new Date(currentTime.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      delivery_time: deliveryTime
    };
  });
};

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>(() => addLiveStockData(MANUAL_PRODUCTS));
  const [allProducts, setAllProducts] = useState<Product[]>(() => addLiveStockData(MANUAL_PRODUCTS));
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const categories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
    'Beauty & Personal Care',
    'Food & Beverages',
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
  ];

  useEffect(() => {
    // Initialize analytics with manual data
    const productsWithLiveData = addLiveStockData(MANUAL_PRODUCTS);
    generateAnalytics(productsWithLiveData);
    loadProducts();
  }, [searchQuery, selectedCategory, sortBy, page]);

  useEffect(() => {
    // Load all products for analytics (try API, fallback to manual)
    loadAllProductsForAnalytics();
  }, []);

  // Live stock updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedProducts = addLiveStockData(MANUAL_PRODUCTS);
      setAllProducts(updatedProducts);
      setLastUpdated(new Date());
      generateAnalytics(updatedProducts);
      
      // Update current products view
      loadProducts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory && selectedCategory !== 'All Categories') params.set('category', selectedCategory);
    if (sortBy !== 'name') params.set('sort', sortBy);
    if (page !== 1) params.set('page', page.toString());
    
    setSearchParams(params);
  }, [searchQuery, selectedCategory, sortBy, page, setSearchParams]);

  const loadAllProductsForAnalytics = async () => {
    try {
      // Load all products from all categories for analytics
      const categoryPromises = categories.slice(1).map(category => 
        apiService.getProductsByCategory(category, 50)
      );
      
      const responses = await Promise.all(categoryPromises);
      const allProductsData: Product[] = [];
      
      responses.forEach(response => {
        if (response.success && response.data?.products) {
          allProductsData.push(...response.data.products);
        }
      });
      
      setAllProducts(allProductsData);
      generateAnalytics(allProductsData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    }
  };

  const generateAnalytics = (productData: Product[]) => {
    // Generate category statistics
    const categoryMap = new Map<string, { count: number; totalPrice: number; totalRating: number; totalStock: number }>();
    
    productData.forEach(product => {
      const existing = categoryMap.get(product.category) || { count: 0, totalPrice: 0, totalRating: 0, totalStock: 0 };
      categoryMap.set(product.category, {
        count: existing.count + 1,
        totalPrice: existing.totalPrice + product.price,
        totalRating: existing.totalRating + (product.rating || 0),
        totalStock: existing.totalStock + (product.stock_quantity || 0)
      });
    });
    
    const categoryStatsData: CategoryStats[] = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      count: stats.count,
      avgPrice: stats.totalPrice / stats.count,
      avgRating: stats.totalRating / stats.count,
      totalStock: stats.totalStock
    }));
    
    setCategoryStats(categoryStatsData);
    
    // Generate price range statistics
    const priceRangeMap = new Map<string, number>();
    const ranges = [
      { min: 0, max: 50, label: '$0-$50' },
      { min: 50, max: 200, label: '$50-$200' },
      { min: 200, max: 500, label: '$200-$500' },
      { min: 500, max: 1000, label: '$500-$1000' },
      { min: 1000, max: Infinity, label: '$1000+' }
    ];
    
    ranges.forEach(range => priceRangeMap.set(range.label, 0));
    
    productData.forEach(product => {
      const range = ranges.find(r => product.price >= r.min && product.price < r.max);
      if (range) {
        priceRangeMap.set(range.label, (priceRangeMap.get(range.label) || 0) + 1);
      }
    });
    
    const priceRangeData: PriceRange[] = Array.from(priceRangeMap.entries()).map(([range, count]) => ({
      range,
      count,
      percentage: (count / productData.length) * 100
    }));
    
    setPriceRanges(priceRangeData);
  };

  const loadProducts = () => {
    try {
      setLoading(true);
      let productList = addLiveStockData([...MANUAL_PRODUCTS]);

      // Filter by search query
      if (searchQuery) {
        productList = productList.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Filter by category
      if (selectedCategory && selectedCategory !== 'All Categories') {
        productList = productList.filter(product => product.category === selectedCategory);
      }

      // Apply sorting
      productList = sortProducts(productList, sortBy);

      setProducts(productList);
      setTotalPages(Math.ceil(productList.length / 12)); // 12 products per page
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts(addLiveStockData(MANUAL_PRODUCTS));
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (productList: Product[], sortOption: string): Product[] => {
    // Create a deep copy to avoid mutating the original array
    const sorted = productList.map(product => ({ ...product }));
    
    switch (sortOption) {
      case 'price_low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return sorted.reverse(); // Assuming newer products are at the end
      case 'name':
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadProducts();
  };

  const handleAddToCart = (product: Product) => {
    // Add to cart functionality would go here
    toast.success(`${product.name} added to cart!`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getCurrentPageProducts = () => {
    const startIndex = (page - 1) * 12;
    const endIndex = startIndex + 12;
    return products.slice(startIndex, endIndex);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
            Showing {products.length} products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            6 results
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<InventoryIcon />}
            label="Products"
            iconPosition="start"
          />
          <Tab
            icon={<BarChartIcon />}
            label="Category Analytics"
            iconPosition="start"
          />
          <Tab
            icon={<PieChartIcon />}
            label="Price Distribution"
            iconPosition="start"
          />
          <Tab
            icon={<TrendingUpIcon />}
            label="Performance Insights"
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Products Tab */}
      <TabPanel value={tabValue} index={0}>
        {/* Search and Filters */}
        <Card sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={handleSearch} variant="contained" size="small">
                      Search
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory || 'All Categories'}
                onChange={(e) => {
                  setSelectedCategory(e.target.value === 'All Categories' ? '' : e.target.value);
                  setPage(1);
                }}
                startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                startAdornment={<SortIcon sx={{ mr: 1 }} />}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {products.length} products found
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(12)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Alert severity="info" sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2">
            Try adjusting your search criteria or browse different categories
          </Typography>
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {getCurrentPageProducts().map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      borderColor: '#1976d2',
                    },
                  }}
                >
                  {/* HOT Badge */}
                  {product.isHot && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: '#ff5722',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        zIndex: 1
                      }}
                    >
                      HOT
                    </Box>
                  )}
                  
                  {/* Wishlist Icon */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: '50%',
                      p: 0.5,
                      cursor: 'pointer',
                      zIndex: 1,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                    }}
                  >
                    ❤️
                  </Box>

                  {/* Product Image */}
                  <Box sx={{ height: 180, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #e0e0e0; font-size: 2rem;">
                              📦
                            </div>
                          `;
                        }
                      }}
                    />
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    {/* Stock Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: product.stock_quantity > 0 ? '#4caf50' : '#f44336',
                          mr: 1
                        }}
                      />
                      <Typography variant="body2" color={product.stock_quantity > 0 ? 'success.main' : 'error.main'} sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </Typography>
                    </Box>

                    {/* Product Name */}
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        fontSize: '1rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.2
                      }}
                    >
                      {product.name}
                    </Typography>

                    {/* Brand & Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
                      {product.description}
                    </Typography>

                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating
                        value={product.rating || 0}
                        precision={0.1}
                        size="small"
                        readOnly
                        sx={{ fontSize: '1rem' }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontSize: '0.75rem' }}>
                        {product.rating?.toFixed(1)} ({product.reviews || Math.floor(Math.random() * 500) + 100})
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={product.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {product.subcategory && (
                        <Chip
                          label={product.subcategory}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 2,
                      }}
                    >
                      {product.description}
                    </Typography>

                    {/* Live Stock Information */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                          Stock: {product.stock_quantity}
                        </Typography>
                        {product.stock_trend && (
                          <Chip
                            label={product.stock_trend === 'increasing' ? '📈 Rising' : 
                                   product.stock_trend === 'decreasing' ? '📉 Low' : '📊 Stable'}
                            size="small"
                            color={product.stock_trend === 'increasing' ? 'success' : 
                                   product.stock_trend === 'decreasing' ? 'warning' : 'default'}
                            sx={{ fontSize: '0.7rem', height: '20px' }}
                          />
                        )}
                      </Box>
                      
                      {product.predicted_stock && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          Predicted: {product.predicted_stock} units next week
                        </Typography>
                      )}
                      
                      {product.delivery_time && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" color="success.main" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                            🚚 Delivery in {product.delivery_time}
                          </Typography>
                        </Box>
                      )}
                      
                      {product.last_restocked && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                          Last restocked: {product.last_restocked}
                        </Typography>
                      )}
                    </Box>

                    {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                      <Chip
                        label={`Only ${product.stock_quantity} left`}
                        size="small"
                        color="warning"
                        sx={{ mb: 1 }}
                      />
                    )}

                    {product.stock_quantity === 0 && (
                      <Chip
                        label="Out of Stock"
                        size="small"
                        color="error"
                        sx={{ mb: 1 }}
                      />
                    )}
                  </CardContent>

                  {/* Price Section */}
                  <Box sx={{ px: 2, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{ 
                          fontWeight: 700, 
                          color: '#1976d2',
                          fontSize: '1.2rem'
                        }}
                      >
                        ₹{product.price.toLocaleString()}
                      </Typography>
                      {product.discount && product.discount > 0 && (
                        <Box sx={{ ml: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ 
                              textDecoration: 'line-through',
                              color: 'text.secondary',
                              fontSize: '0.8rem'
                            }}
                          >
                            ₹{Math.round(product.price * (1 + product.discount / 100)).toLocaleString()}
                          </Typography>
                          <Chip
                            label={`-${product.discount}%`}
                            size="small"
                            color="error"
                            sx={{ ml: 0.5, height: '18px', fontSize: '0.7rem' }}
                          />
                        </Box>
                      )}
                    </Box>
                    
                    {/* Product Details */}
                    {(product.weight || product.volume || product.type) && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1 }}>
                        {product.weight && `Weight: ${product.weight}`}
                        {product.volume && `Volume: ${product.volume}`}
                        {product.type && ` • Type: ${product.type}`}
                      </Typography>
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity === 0}
                      sx={{ 
                        backgroundColor: '#1976d2',
                        '&:hover': { backgroundColor: '#1565c0' },
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        textTransform: 'none',
                        borderColor: '#1976d2',
                        color: '#1976d2'
                      }}
                    >
                      Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                size="large"
                sx={{ mt: 4 }}
              />
            </Box>
          )}
        </>
      )}
      </TabPanel>

      {/* Category Analytics Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <CategoryIcon sx={{ mr: 2 }} />
                Category Performance
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="category" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Product Count" />
                    <Bar dataKey="avgPrice" fill="#82ca9d" name="Avg Price ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Stock Levels by Category
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalStock" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Average Ratings by Category
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgRating" stroke="#ff7300" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Price Distribution Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Price Range Distribution
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priceRanges}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percentage }: any) => `${range} (${percentage.toFixed(1)}%)`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {priceRanges.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Price Range Details
              </Typography>
              <Box sx={{ mt: 2 }}>
                {priceRanges.map((range, index) => (
                  <Box key={range.range} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">{range.range}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {range.count} products ({range.percentage.toFixed(1)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={range.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: COLORS[index % COLORS.length]
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Performance Insights Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <InventoryIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {allProducts.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Products
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <CategoryIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {categoryStats.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Categories
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {allProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / allProducts.length || 0}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Average Rating
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Top Performing Categories
              </Typography>
              <Grid container spacing={2}>
                {[...categoryStats]
                  .sort((a, b) => b.avgRating - a.avgRating)
                  .slice(0, 3)
                  .map((category, index) => (
                    <Grid item xs={12} md={4} key={category.category}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          #{index + 1} {category.category}
                        </Typography>
                        <Rating value={category.avgRating} precision={0.1} readOnly sx={{ mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {category.count} products • Avg ${category.avgPrice.toFixed(2)}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))
                }
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default ProductsPage;
