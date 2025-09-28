-- Sample data for Retailer Recommendation System

-- Insert sample product categories
INSERT INTO product_categories (category_name, description) VALUES
('Food & Beverages', 'All food and drink items'),
('Electronics', 'Electronic devices and accessories'),
('Clothing & Apparel', 'Clothing and fashion items'),
('Home & Garden', 'Home improvement and gardening supplies'),
('Health & Beauty', 'Health, beauty, and personal care products'),
('Sports & Outdoors', 'Sports equipment and outdoor gear'),
('Books & Media', 'Books, movies, music, and games'),
('Automotive', 'Car parts and automotive supplies'),
('Office Supplies', 'Office and business supplies'),
('Toys & Games', 'Children toys and games');

-- Insert sample retailers
INSERT INTO retailers (name, email, password_hash, location, store_type, business_size, phone, address) VALUES
('Green Valley Grocery', 'contact@greenvalley.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewf1c1JWBPiuxHgO', 'California', 'Grocery Store', 'small', '+1-555-0101', '123 Main St, Green Valley, CA'),
('Tech Hub Electronics', 'info@techhub.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewf1c1JWBPiuxHgO', 'New York', 'Electronics Store', 'medium', '+1-555-0102', '456 Tech Ave, New York, NY'),
('Fashion Forward', 'hello@fashionforward.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewf1c1JWBPiuxHgO', 'Texas', 'Clothing Store', 'small', '+1-555-0103', '789 Style Blvd, Austin, TX'),
('Home Depot Plus', 'support@homedepotplus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewf1c1JWBPiuxHgO', 'Florida', 'Home Improvement', 'large', '+1-555-0104', '321 Builder St, Miami, FL'),
('Wellness Corner', 'care@wellnesscorner.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewf1c1JWBPiuxHgO', 'Washington', 'Health Store', 'small', '+1-555-0105', '654 Health Way, Seattle, WA');

-- Insert sample products
INSERT INTO products (name, category, subcategory, brand, price, description, sku, supplier, unit_type) VALUES
-- Food & Beverages
('Organic Apples', 'Food & Beverages', 'Fruits', 'Fresh Farm', 3.99, 'Fresh organic apples, 2lb bag', 'FF-APP-001', 'Fresh Farm Co', 'bag'),
('Whole Wheat Bread', 'Food & Beverages', 'Bakery', 'Healthy Grains', 2.49, 'Whole wheat sandwich bread', 'HG-BRD-001', 'Healthy Grains Inc', 'loaf'),
('Premium Coffee Beans', 'Food & Beverages', 'Beverages', 'Mountain Roast', 12.99, 'Premium arabica coffee beans, 1lb', 'MR-COF-001', 'Mountain Roast LLC', 'bag'),
('Greek Yogurt', 'Food & Beverages', 'Dairy', 'Pure Dairy', 4.99, 'Greek yogurt, 32oz container', 'PD-YOG-001', 'Pure Dairy Co', 'container'),
('Energy Drink', 'Food & Beverages', 'Beverages', 'Power Up', 2.99, 'Energy drink, 16oz can', 'PU-ENR-001', 'Power Up Inc', 'can'),

-- Electronics
('Wireless Headphones', 'Electronics', 'Audio', 'SoundTech', 89.99, 'Bluetooth wireless headphones with noise cancellation', 'ST-WHP-001', 'SoundTech Corp', 'piece'),
('Smartphone Charger', 'Electronics', 'Accessories', 'ChargeFast', 19.99, 'Fast charging USB-C cable', 'CF-CHG-001', 'ChargeFast Ltd', 'piece'),
('Bluetooth Speaker', 'Electronics', 'Audio', 'AudioMax', 45.99, 'Portable Bluetooth speaker', 'AM-SPK-001', 'AudioMax Inc', 'piece'),
('Tablet Stand', 'Electronics', 'Accessories', 'StandPro', 24.99, 'Adjustable tablet stand', 'SP-STD-001', 'StandPro LLC', 'piece'),
('Power Bank', 'Electronics', 'Accessories', 'PowerCore', 34.99, '10000mAh portable power bank', 'PC-PWR-001', 'PowerCore Co', 'piece'),

-- Clothing & Apparel
('Cotton T-Shirt', 'Clothing & Apparel', 'Tops', 'ComfortWear', 14.99, '100% cotton t-shirt, various colors', 'CW-TSH-001', 'ComfortWear Inc', 'piece'),
('Denim Jeans', 'Clothing & Apparel', 'Bottoms', 'DenimCraft', 49.99, 'Classic fit denim jeans', 'DC-JNS-001', 'DenimCraft Ltd', 'piece'),
('Running Shoes', 'Clothing & Apparel', 'Footwear', 'SportStep', 79.99, 'Lightweight running shoes', 'SS-RUN-001', 'SportStep Corp', 'pair'),
('Winter Jacket', 'Clothing & Apparel', 'Outerwear', 'WarmGuard', 129.99, 'Insulated winter jacket', 'WG-JKT-001', 'WarmGuard Inc', 'piece'),
('Baseball Cap', 'Clothing & Apparel', 'Accessories', 'CapStyle', 19.99, 'Adjustable baseball cap', 'CS-CAP-001', 'CapStyle LLC', 'piece'),

-- Home & Garden
('LED Light Bulbs', 'Home & Garden', 'Lighting', 'BrightHome', 8.99, 'Energy efficient LED bulbs, 4-pack', 'BH-LED-001', 'BrightHome Co', 'pack'),
('Garden Hose', 'Home & Garden', 'Gardening', 'GardenPro', 29.99, '50ft expandable garden hose', 'GP-HSE-001', 'GardenPro Inc', 'piece'),
('Tool Set', 'Home & Garden', 'Tools', 'HandyTools', 59.99, '20-piece tool set with case', 'HT-SET-001', 'HandyTools Corp', 'set'),
('Flower Seeds', 'Home & Garden', 'Gardening', 'BloomTime', 4.99, 'Mixed flower seeds packet', 'BT-SED-001', 'BloomTime Ltd', 'packet'),
('Storage Bins', 'Home & Garden', 'Organization', 'OrganizeIt', 15.99, 'Plastic storage bins, 3-pack', 'OI-BIN-001', 'OrganizeIt LLC', 'pack'),

-- Health & Beauty
('Vitamin C Tablets', 'Health & Beauty', 'Supplements', 'HealthPlus', 12.99, 'Vitamin C 1000mg, 60 tablets', 'HP-VTC-001', 'HealthPlus Inc', 'bottle'),
('Face Moisturizer', 'Health & Beauty', 'Skincare', 'GlowSkin', 24.99, 'Daily face moisturizer with SPF', 'GS-MST-001', 'GlowSkin Co', 'bottle'),
('Shampoo', 'Health & Beauty', 'Hair Care', 'HairCare Pro', 9.99, 'Moisturizing shampoo, 16oz', 'HCP-SHP-001', 'HairCare Pro Ltd', 'bottle'),
('Toothbrush Set', 'Health & Beauty', 'Oral Care', 'SmileBright', 7.99, 'Soft bristle toothbrush, 2-pack', 'SB-TBR-001', 'SmileBright Corp', 'pack'),
('Hand Sanitizer', 'Health & Beauty', 'Personal Care', 'CleanHands', 3.99, 'Antibacterial hand sanitizer, 8oz', 'CH-SAN-001', 'CleanHands Inc', 'bottle');

-- Insert sample purchases (last 6 months of data)
INSERT INTO purchases (retailer_id, product_id, purchase_date, quantity, unit_price, total_amount, payment_method, order_source) 
SELECT 
    r.retailer_id,
    p.product_id,
    CURRENT_DATE - INTERVAL '1 day' * (RANDOM() * 180)::int, -- Random date in last 6 months
    (RANDOM() * 10 + 1)::int, -- Random quantity 1-10
    p.price,
    p.price * (RANDOM() * 10 + 1)::int,
    CASE (RANDOM() * 3)::int 
        WHEN 0 THEN 'credit_card'
        WHEN 1 THEN 'cash'
        ELSE 'debit_card'
    END,
    CASE (RANDOM() * 2)::int
        WHEN 0 THEN 'online'
        ELSE 'in_store'
    END
FROM retailers r
CROSS JOIN products p
WHERE RANDOM() < 0.3; -- 30% chance of purchase for each retailer-product combination

-- Insert sample retailer preferences
INSERT INTO retailer_preferences (retailer_id, category, preference_score)
SELECT 
    r.retailer_id,
    CASE r.store_type
        WHEN 'Grocery Store' THEN 'Food & Beverages'
        WHEN 'Electronics Store' THEN 'Electronics'
        WHEN 'Clothing Store' THEN 'Clothing & Apparel'
        WHEN 'Home Improvement' THEN 'Home & Garden'
        WHEN 'Health Store' THEN 'Health & Beauty'
        ELSE 'Food & Beverages'
    END,
    4.5
FROM retailers r;

-- Insert additional random preferences
INSERT INTO retailer_preferences (retailer_id, category, preference_score)
SELECT 
    r.retailer_id,
    pc.category_name,
    (RANDOM() * 3 + 2)::decimal(3,2) -- Random score between 2.0 and 5.0
FROM retailers r
CROSS JOIN product_categories pc
WHERE RANDOM() < 0.4; -- 40% chance for each retailer-category combination

-- Update product popularity scores based on purchase data
UPDATE products 
SET popularity_score = subquery.score
FROM (
    SELECT 
        p.product_id,
        LEAST(5.0, (COUNT(pur.purchase_id) * 0.1 + AVG(pur.quantity) * 0.05))::decimal(3,2) as score
    FROM products p
    LEFT JOIN purchases pur ON p.product_id = pur.product_id
    GROUP BY p.product_id
) subquery
WHERE products.product_id = subquery.product_id;

-- Insert some sample feedback data
INSERT INTO feedback (retailer_id, product_id, feedback_type, feedback_value)
SELECT 
    pur.retailer_id,
    pur.product_id,
    CASE (RANDOM() * 4)::int
        WHEN 0 THEN 'view'
        WHEN 1 THEN 'click'
        WHEN 2 THEN 'purchase'
        ELSE 'like'
    END,
    (RANDOM() * 4 + 1)::decimal(3,2) -- Random rating 1.0 to 5.0
FROM purchases pur
WHERE RANDOM() < 0.5; -- 50% of purchases get feedback

-- Create some sample recommendations
INSERT INTO recommendations (retailer_id, product_id, recommendation_score, recommendation_type, algorithm_version)
SELECT 
    r.retailer_id,
    p.product_id,
    RANDOM()::decimal(5,4), -- Random score 0.0 to 1.0
    CASE (RANDOM() * 2)::int
        WHEN 0 THEN 'collaborative'
        ELSE 'content_based'
    END,
    'v1.0'
FROM retailers r
CROSS JOIN products p
WHERE RANDOM() < 0.2; -- 20% chance for each retailer-product combination
