#!/usr/bin/env node
/**
 * Script untuk seeding semua 12 produk ke database dengan gambar yang benar
 */

require("dotenv").config();
const { Product } = require("./models");

const products = [
  {
    name: "Black Wallet",
    description: "Premium black leather wallet with multiple card slots and bill compartment. Perfect for everyday use.",
    price: 60.0,
    stock: 50,
    category: "Accessories",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-1.jpg",
    imageKey: "products/photo-1.jpg",
    sellerId: 1,
    isActive: true,
  },
  {
    name: "iPhone Black",
    description: "Latest iPhone model in sleek black finish. Features advanced camera system and powerful performance.",
    price: 120.0,
    stock: 30,
    category: "Electronics",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-2.jpg",
    imageKey: "products/photo-2.jpg",
    sellerId: 1,
    isActive: true,
  },
  {
    name: "Beer Can",
    description: "Premium craft beer in convenient can packaging. Perfect for parties and gatherings.",
    price: 90.0,
    stock: 100,
    category: "Beverages",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-3.jpg",
    imageKey: "products/photo-3.jpg",
    sellerId: 1,
    isActive: true,
  },
  {
    name: "Powder Tap",
    description: "High-quality makeup powder with smooth application. Long-lasting and suitable for all skin types.",
    price: 190.0,
    stock: 25,
    category: "Beauty",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-4.jpg",
    imageKey: "products/photo-4.jpg",
    sellerId: 1,
    isActive: true,
  },
  {
    name: "Aerosol",
    description: "Professional-grade aerosol spray for hair styling. Provides strong hold and natural finish.",
    price: 75.0,
    stock: 40,
    category: "Beauty",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-5.jpg",
    imageKey: "products/photo-5.jpg",
    sellerId: 1,
    isActive: true,
  },
  {
    name: "Sun Glasses",
    description: "Stylish sunglasses with UV protection. Perfect for outdoor activities and fashion statement.",
    price: 200.0,
    stock: 20,
    category: "Accessories",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-6.jpg",
    imageKey: "products/photo-6.jpg",
    sellerId: 1,
    isActive: true,
  },
  {
    name: "Dark Shoes",
    description: "Elegant dark leather shoes suitable for formal occasions. Comfortable and durable.",
    price: 100.0,
    stock: 35,
    category: "Footwear",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-7.jpg",
    imageKey: "products/photo-7.jpg",
    sellerId: 1,
    isActive: true,
  },
  {
    name: "Sport Shoes",
    description: "Comfortable sport shoes designed for active lifestyle. Breathable material and excellent support.",
    price: 40.0,
    stock: 60,
    category: "Footwear",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-8.jpg",
    imageKey: "products/photo-8.jpg",
    sellerId: 1,
    isActive: true,
  },
  {
    name: "Lens",
    description: "Professional camera lens with high-quality optics. Perfect for photography enthusiasts.",
    price: 54.0,
    stock: 45,
    category: "Electronics",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-9.jpg",
    imageKey: "products/photo-9.jpg",
    sellerId: 1,
    isActive: true,
  },
  {
    name: "Woman Shoes",
    description: "Elegant women shoes with comfortable heel design. Perfect for both casual and formal occasions.",
    price: 330.0,
    stock: 15,
    category: "Footwear",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-10.jpg",
    imageKey: "products/photo-10.jpg",
    sellerId: 1,
    isActive: true,
  },
  {
    name: "Camera",
    description: "Professional digital camera with advanced features. Capture stunning photos and videos.",
    price: 230.0,
    stock: 10,
    category: "Electronics",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-11.jpg",
    imageKey: "products/photo-11.jpg",
    sellerId: 1,
    isActive: true,
  },
  {
    name: "White Phone",
    description: "Modern smartphone in elegant white color. Features latest technology and sleek design.",
    price: 180.0,
    stock: 25,
    category: "Electronics",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-12.jpg",
    imageKey: "products/photo-12.jpg",
    sellerId: 1,
    isActive: true,
  },
];

async function seedComplete() {
  try {
    console.log("🔄 Starting complete product seeding with all 12 products...");

    // Delete existing products
    await Product.destroy({ where: {} });
    console.log("🗑️  Cleared existing products");

    // Insert all 12 products
    await Product.bulkCreate(products);
    console.log("✅ All 12 products added successfully!");

    // Verify insertion
    const count = await Product.count();
    console.log(`📊 Total products now: ${count}`);

    // Show all products
    const productsList = await Product.findAll({
      attributes: ["id", "name", "price", "imageUrl"],
    });

    console.log("📋 All products added:");
    productsList.forEach((product) => {
      console.log(`- ${product.name}: $${product.price}`);
    });
  } catch (error) {
    console.error("❌ Error seeding products:", error.message);
  } finally {
    process.exit(0);
  }
}

seedComplete();
