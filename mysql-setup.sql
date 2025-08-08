-- ============================================
-- E-COMMERCE DATABASE SETUP - MySQL Commands
-- ============================================

-- 1. CREATE DATABASE
CREATE DATABASE IF NOT EXISTS ecommerce_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. USE DATABASE
USE ecommerce_db;

-- 3. CREATE USERS TABLE (sesuai dengan Sequelize model)
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(255),
    creditCard VARCHAR(255),
    cvv VARCHAR(255),
    history JSON DEFAULT '[]',
    isAdmin BOOLEAN DEFAULT FALSE,
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
    shippingAddress TEXT,
    shippingCity VARCHAR(255),
    shippingPostalCode VARCHAR(255),
    shippingCountry VARCHAR(255),
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
CREATE INDEX idx_users_name ON Users(name);
CREATE INDEX idx_products_seller ON Products(sellerId);
CREATE INDEX idx_orders_user ON Orders(userId);

-- 8. INSERT ADMIN ACCOUNT
-- Password: 'admin123' (sudah di-hash dengan bcrypt)
INSERT INTO Users (
    name, 
    email, 
    password, 
    isAdmin
) VALUES (
    'System Administrator',
    'admin@ecommerce.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    TRUE
);

-- 9. INSERT SAMPLE PRODUCT (optional)
INSERT INTO Products (
    name, 
    description, 
    price, 
    stock, 
    category, 
    sellerId
) VALUES (
    'Sample Product',
    'This is a sample product for testing',
    100000,
    10,
    'Electronics',
    1
);

-- ============================================
-- CARA PENGGUNAAN
-- ============================================

-- METODE 1: Jalankan langsung di MySQL
-- mysql -u root -p
-- source mysql-setup.sql

-- METODE 2: Jalankan dari terminal
-- mysql -u root -p < mysql-setup.sql

-- METODE 3: Jalankan perintah satu per satu

-- 1. Login MySQL
-- mysql -u root -p

-- 2. Buat database
-- CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE ecommerce_db;

-- 3. Buat tabel Users
-- CREATE TABLE Users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     address TEXT,
--     phone VARCHAR(255),
--     creditCard VARCHAR(255),
--     cvv VARCHAR(255),
--     history JSON DEFAULT '[]',
--     isAdmin BOOLEAN DEFAULT FALSE,
--     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
--     updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- 4. Insert admin account
-- INSERT INTO Users (name, email, password, isAdmin) VALUES 
-- ('System Administrator', 'admin@ecommerce.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- 5. Verifikasi admin account
-- SELECT * FROM Users WHERE email = 'admin@ecommerce.com';

-- Login dengan:
-- Email: admin@ecommerce.com
-- Password: admin123
