-- Retailer Recommendation System Database Schema

-- Create database (run this separately if needed)
-- CREATE DATABASE retailer_recommendations;

-- Use the database
-- \c retailer_recommendations;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Retailers table
CREATE TABLE retailers (
    retailer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    store_type VARCHAR(100),
    business_size VARCHAR(50), -- small, medium, large
    phone VARCHAR(20),
    address TEXT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    profile_data JSONB -- Additional profile information
);

-- Products table
CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    supplier VARCHAR(255),
    unit_type VARCHAR(50), -- piece, kg, liter, etc.
    seasonal BOOLEAN DEFAULT FALSE,
    popularity_score DECIMAL(3, 2) DEFAULT 0.0,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    product_attributes JSONB -- Additional product features
);

-- Purchases table
CREATE TABLE purchases (
    purchase_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL REFERENCES retailers(retailer_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_applied DECIMAL(5, 2) DEFAULT 0.0,
    payment_method VARCHAR(50),
    order_source VARCHAR(50), -- online, in-store, phone, etc.
    season VARCHAR(20), -- spring, summer, fall, winter
    purchase_metadata JSONB -- Additional purchase context
);

-- Feedback table for recommendation system
CREATE TABLE feedback (
    feedback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL REFERENCES retailers(retailer_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    recommendation_id UUID, -- Links to specific recommendation
    feedback_type VARCHAR(50) NOT NULL, -- view, click, purchase, ignore, dislike
    feedback_value DECIMAL(3, 2), -- Rating or score (0.0 to 5.0)
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    context JSONB -- Additional context about the feedback
);

-- Recommendations table (to track what was recommended)
CREATE TABLE recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL REFERENCES retailers(retailer_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    recommendation_score DECIMAL(5, 4) NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL, -- collaborative, content-based, hybrid
    algorithm_version VARCHAR(20),
    recommended_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    context JSONB, -- Recommendation context and features
    was_clicked BOOLEAN DEFAULT FALSE,
    was_purchased BOOLEAN DEFAULT FALSE
);

-- Product categories table (for better categorization)
CREATE TABLE product_categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) NOT NULL UNIQUE,
    parent_category_id UUID REFERENCES product_categories(category_id),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Retailer preferences table
CREATE TABLE retailer_preferences (
    preference_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL REFERENCES retailers(retailer_id) ON DELETE CASCADE,
    category VARCHAR(100),
    brand VARCHAR(100),
    price_range_min DECIMAL(10, 2),
    price_range_max DECIMAL(10, 2),
    preference_score DECIMAL(3, 2), -- 0.0 to 5.0
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_purchases_retailer_date ON purchases(retailer_id, purchase_date DESC);
CREATE INDEX idx_purchases_product_date ON purchases(product_id, purchase_date DESC);
CREATE INDEX idx_purchases_date ON purchases(purchase_date DESC);
CREATE INDEX idx_feedback_retailer_date ON feedback(retailer_id, feedback_date DESC);
CREATE INDEX idx_recommendations_retailer_date ON recommendations(retailer_id, recommended_date DESC);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_retailers_location ON retailers(location);
CREATE INDEX idx_retailers_store_type ON retailers(store_type);

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_date BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

-- Views for common queries
CREATE VIEW retailer_purchase_summary AS
SELECT 
    r.retailer_id,
    r.name as retailer_name,
    r.location,
    r.store_type,
    COUNT(p.purchase_id) as total_purchases,
    SUM(p.total_amount) as total_spent,
    AVG(p.total_amount) as avg_purchase_amount,
    MAX(p.purchase_date) as last_purchase_date,
    COUNT(DISTINCT p.product_id) as unique_products_purchased
FROM retailers r
LEFT JOIN purchases p ON r.retailer_id = p.retailer_id
GROUP BY r.retailer_id, r.name, r.location, r.store_type;

CREATE VIEW product_popularity AS
SELECT 
    p.product_id,
    p.name as product_name,
    p.category,
    p.brand,
    p.price,
    COUNT(pur.purchase_id) as purchase_count,
    SUM(pur.quantity) as total_quantity_sold,
    SUM(pur.total_amount) as total_revenue,
    AVG(pur.unit_price) as avg_selling_price,
    COUNT(DISTINCT pur.retailer_id) as unique_retailers
FROM products p
LEFT JOIN purchases pur ON p.product_id = pur.product_id
GROUP BY p.product_id, p.name, p.category, p.brand, p.price;

-- Function to calculate retailer similarity (for collaborative filtering)
CREATE OR REPLACE FUNCTION calculate_retailer_similarity(retailer1_id UUID, retailer2_id UUID)
RETURNS DECIMAL(5, 4) AS $$
DECLARE
    similarity_score DECIMAL(5, 4);
BEGIN
    -- Simple Jaccard similarity based on common products purchased
    WITH retailer1_products AS (
        SELECT DISTINCT product_id FROM purchases WHERE retailer_id = retailer1_id
    ),
    retailer2_products AS (
        SELECT DISTINCT product_id FROM purchases WHERE retailer_id = retailer2_id
    ),
    common_products AS (
        SELECT COUNT(*) as common_count
        FROM retailer1_products r1
        INNER JOIN retailer2_products r2 ON r1.product_id = r2.product_id
    ),
    total_products AS (
        SELECT COUNT(DISTINCT product_id) as total_count
        FROM (
            SELECT product_id FROM retailer1_products
            UNION
            SELECT product_id FROM retailer2_products
        ) combined
    )
    SELECT 
        CASE 
            WHEN total_count > 0 THEN common_count::DECIMAL / total_count::DECIMAL
            ELSE 0.0
        END INTO similarity_score
    FROM common_products, total_products;
    
    RETURN COALESCE(similarity_score, 0.0);
END;
$$ LANGUAGE plpgsql;
