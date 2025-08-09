#!/usr/bin/env python3
"""
Python script untuk seeding data produk ke database MySQL RDS dan upload gambar ke S3 bucket.
Script ini sesuai dengan model Product yang ada di backend/models/Product.js
"""

import os
import mysql.connector
from mysql.connector import Error
import boto3
from botocore.exceptions import NoCredentialsError
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Konfigurasi Database - sesuaikan dengan backend/config/database.js
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'database-ecommers.c7oyg62ikc60.ap-southeast-2.rds.amazonaws.com'),
    'user': os.getenv('DB_USER', 'admin'),
    'password': os.getenv('DB_PASSWORD', 'zxt20net'),
    'database': os.getenv('DB_NAME', 'ecommers'),
    'port': int(os.getenv('DB_PORT', '3306'))
}

# Konfigurasi S3
S3_CONFIG = {
    'bucket': os.getenv('S3_BUCKET', 'ecommers-bucket2'),
    'region': os.getenv('AWS_REGION', 'ap-southeast-2a'),
    'access_key': os.getenv('AKIAXKWVX33HDRYUNFUT'),
    'secret_key': os.getenv('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')
}

# Data produk dari data-seed.js yang sudah disesuaikan dengan model Product
PRODUCTS = [
    {
        'name': 'Black Wallet',
        'description': 'Premium black leather wallet with multiple card slots and bill compartment. Perfect for everyday use.',
        'price': 60.00,
        'stock': 50,
        'category': 'Accessories',
        'image_file': 'photo-1.jpg'
    },
    {
        'name': 'iPhone Black',
        'description': 'Latest iPhone model in sleek black finish. Features advanced camera system and powerful performance.',
        'price': 120.00,
        'stock': 30,
        'category': 'Electronics',
        'image_file': 'photo-2.jpg'
    },
    {
        'name': 'Beer Can',
        'description': 'Premium craft beer in convenient can packaging. Perfect for parties and gatherings.',
        'price': 90.00,
        'stock': 100,
        'category': 'Beverages',
        'image_file': 'photo-3.jpg'
    },
    {
        'name': 'Powder Tap',
        'description': 'High-quality makeup powder with smooth application. Long-lasting and suitable for all skin types.',
        'price': 190.00,
        'stock': 25,
        'category': 'Beauty',
        'image_file': 'photo-4.jpg'
    },
    {
        'name': 'Aerosol',
        'description': 'Professional-grade aerosol spray for hair styling. Provides strong hold and natural finish.',
        'price': 75.00,
        'stock': 40,
        'category': 'Beauty',
        'image_file': 'photo-5.jpg'
    },
    {
        'name': 'Sun Glasses',
        'description': 'Stylish sunglasses with UV protection. Perfect for outdoor activities and fashion statement.',
        'price': 200.00,
        'stock': 20,
        'category': 'Accessories',
        'image_file': 'photo-6.jpg'
    },
    {
        'name': 'Dark Shoes',
        'description': 'Elegant dark leather shoes suitable for formal occasions. Comfortable and durable.',
        'price': 100.00,
        'stock': 35,
        'category': 'Footwear',
        'image_file': 'photo-7.jpg'
    },
    {
        'name': 'Sport Shoes',
        'description': 'Comfortable sport shoes designed for active lifestyle. Breathable material and excellent support.',
        'price': 40.00,
        'stock': 60,
        'category': 'Footwear',
        'image_file': 'photo-8.jpg'
    },
    {
        'name': 'Lens',
        'description': 'Professional camera lens with high-quality optics. Perfect for photography enthusiasts.',
        'price': 54.00,
        'stock': 45,
        'category': 'Electronics',
        'image_file': 'photo-9.jpg'
    },
    {
        'name': 'Woman Shoes',
        'description': 'Elegant women shoes with comfortable heel design. Perfect for both casual and formal occasions.',
        'price': 330.00,
        'stock': 15,
        'category': 'Footwear',
        'image_file': 'photo-10.jpg'
    },
    {
        'name': 'Camera',
        'description': 'Professional digital camera with advanced features. Capture stunning photos and videos.',
        'price': 230.00,
        'stock': 10,
        'category': 'Electronics',
        'image_file': 'photo-11.jpg'
    },
    {
        'name': 'White Phone',
        'description': 'Modern smartphone in elegant white color. Features latest technology and sleek design.',
        'price': 180.00,
        'stock': 25,
        'category': 'Electronics',
        'image_file': 'photo-12.jpg'
    }
]

class ProductSeeder:
    def __init__(self):
        self.connection = None
        self.s3_client = None
        
    def connect_database(self):
        """Connect to MySQL database"""
        try:
            self.connection = mysql.connector.connect(**DB_CONFIG)
            if self.connection.is_connected():
                logger.info("Connected to MySQL database")
                return True
        except Error as e:
            logger.error(f"Error connecting to MySQL: {e}")
            return False
            
    def connect_s3(self):
        """Connect to S3"""
        try:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=S3_CONFIG['access_key'],
                aws_secret_access_key=S3_CONFIG['secret_key'],
                region_name=S3_CONFIG['region']
            )
            logger.info("Connected to S3")
            return True
        except NoCredentialsError:
            logger.error("AWS credentials not found")
            return False
            
    def create_tables(self):
        """Create products table sesuai dengan model Product.js"""
        cursor = self.connection.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                stock INT DEFAULT 0,
                imageUrl VARCHAR(500),
                imageKey VARCHAR(500),
                category VARCHAR(100),
                sellerId INT DEFAULT 1,
                isActive BOOLEAN DEFAULT TRUE,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        self.connection.commit()
        cursor.close()
        logger.info("Products table created/verified")
        
    def upload_image_to_s3(self, local_path, filename):
        """Upload image to S3 bucket"""
        try:
            s3_key = f"products/{filename}"
            self.s3_client.upload_file(local_path, S3_CONFIG['bucket'], s3_key)
            
            # Generate public URL
            image_url = f"https://{S3_CONFIG['bucket']}.s3.{S3_CONFIG['region']}.amazonaws.com/{s3_key}"
            return image_url, s3_key
        except Exception as e:
            logger.error(f"Error uploading {local_path} to S3: {e}")
            return None, None
            
    def seed_products(self):
        """Seed products ke database"""
        cursor = self.connection.cursor()
        
        # Cek apakah sudah ada data
        cursor.execute("SELECT COUNT(*) FROM products")
        count = cursor.fetchone()[0]
        
        if count > 0:
            logger.info(f"Database already contains {count} products")
            response = input("Do you want to continue and add more products? (y/n): ")
            if response.lower() != 'y':
                return
                
        for product in PRODUCTS:
            # Cek apakah produk sudah ada
            cursor.execute("SELECT id FROM products WHERE name = %s", (product['name'],))
            if cursor.fetchone():
                logger.info(f"Product '{product['name']}' already exists, skipping...")
                continue
                
            # Upload gambar ke S3
            image_path = f"img/{product['image_file']}"
            image_url = None
            image_key = None
            
            if os.path.exists(image_path):
                image_url, image_key = self.upload_image_to_s3(image_path, product['image_file'])
                if image_url:
                    logger.info(f"Uploaded {product['image_file']} to S3")
                else:
                    logger.warning(f"Failed to upload {product['image_file']}")
            else:
                logger.warning(f"Image file {image_path} not found")
                
            # Insert produk ke database
            cursor.execute("""
                INSERT INTO products (name, description, price, stock, imageUrl, imageKey, category, sellerId, isActive)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                product['name'],
                product['description'],
                product['price'],
                product['stock'],
                image_url,
                image_key,
                product['category'],
                1,  # Default sellerId
                True  # isActive
            ))
            
            logger.info(f"Inserted product: {product['name']}")
            
        self.connection.commit()
        cursor.close()
        
    def run(self):
        """Jalankan proses seeding"""
        logger.info("Starting product seeding process...")
        
        # Koneksi database
        if not self.connect_database():
            return
            
        # Koneksi S3
        if not self.connect_s3():
            logger.warning("S3 connection failed, continuing without image upload")
            
        # Buat tabel
        self.create_tables()
        
        # Seed produk
        self.seed_products()
        
        # Tutup koneksi
        if self.connection and self.connection.is_connected():
            self.connection.close()
            logger.info("Database connection closed")
            
        logger.info("Product seeding completed successfully!")

def main():
    """Main function"""
    seeder = ProductSeeder()
    seeder.run()

if __name__ == "__main__":
    main()
