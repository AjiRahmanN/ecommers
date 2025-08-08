-- ============================================
-- E-COMMERCE DATABASE SETUP
-- ============================================

-- 1. CREATE DATABASE
CREATE DATABASE IF NOT EXISTS ecommerce_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. USE DATABASE
USE ecommerce_db;

-- 3. CREATE USERS TABLE
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    postalCode VARCHAR(10),
    country VARCHAR(50),
    isAdmin BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. CREATE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    imageUrl VARCHAR(500),
    imageKey VARCHAR(255),
    category VARCHAR(100),
    sellerId INT NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sellerId) REFERENCES Users(id) ON DELETE CASCADE
);

-- 5. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shippingAddress TEXT NOT NULL,
    shippingCity VARCHAR(100) NOT NULL,
    shippingPostalCode VARCHAR(10) NOT NULL,
    shippingCountry VARCHAR(50) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- 6. CREATE ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
);

-- 7. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_username ON Users(username);
CREATE INDEX idx_products_seller ON Products(sellerId);
CREATE INDEX idx_products_category ON Products(category);
CREATE INDEX idx_orders_user ON Orders(userId);
CREATE INDEX idx_orderitems_order ON OrderItems(orderId);

-- 8. INSERT ADMIN ACCOUNT
-- Password: 'admin123' (hashed with bcrypt)
INSERT INTO Users (
    username, 
    email, 
    password, 
    firstName, 
    lastName, 
    isAdmin, 
    isActive
) VALUES (
    'admin',
    'admin@ecommerce.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    'System',
    'Administrator',
    TRUE,
    TRUE
);

-- 9. INSERT SAMPLE PRODUCTS (optional)
INSERT INTO Products (name, description, price, stock, category, sellerId) VALUES
('Laptop Gaming ASUS', 'High-performance gaming laptop with RTX 3060', 15000000, 10, 'Electronics', 1),
('iPhone 15 Pro', 'Latest iPhone with titanium design', 20000000, 15, 'Electronics', 1),
('Nike Air Max', 'Comfortable running shoes', 1200000, 25, 'Fashion', 1),
('Coffee Maker', 'Automatic coffee machine', 800000, 8, 'Home & Kitchen', 1);

-- 10. CREATE DATABASE USER (optional - for production)
-- CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- USAGE INSTRUCTIONS
-- ============================================
-- 1. Jalankan perintah ini di MySQL:
--    mysql -u root -p < database-setup.sql

-- 2. Atau jalankan perintah satu per satu<thinking>
User wants a MySQL command script to create the database schema and insert one admin user account. I have seen from the backend code that Sequelize is used with MySQL, and the User model is likely in backend/models/User.js or similar. I need to find the User model to understand the schema for the user table, especially the fields required for an admin user. Then I can write the SQL commands to create the database and insert an admin user with hashed password or at least a placeholder password.

I will search for the User model file and read it to understand the schema.
</thinking>

<read_file>
<path>backend/models/User.js</path>
</read_file>
