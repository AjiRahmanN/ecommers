#!/usr/bin/env node
/**
 * Script untuk seeding ulang data produk ke database
 */

require("dotenv").config();
const { Product } = require("./models");

const products = [
  {
    name: "Black Wallet",
    description: "Premium black leather wallet with multiple card slots and bill compartment.",
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
    description: "Latest iPhone model in sleek black finish with advanced camera system.",
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
    description: "Premium craft beer in convenient can packaging.",
    price: 90.0,
    stock: 100,
    category: "Beverages",
    imageUrl: "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com/products/photo-3.jpg",
    imageKey: "products/photo-3.jpg",
    sellerId: 1,
    isActive: true,
  },
];

async function seedProducts() {
  try {
    console.log("🔄 Starting product seeding...");

    // Delete existing products (if any)
    await Product.destroy({ where: {} });
    console.log("🗑️  Cleared existing products");

    // Insert new products
    for (const product of products) {
      await Product.create(product);
      console.log(`✅ Added: ${product.name}`);
    }

    console.log("🎉 Product seeding completed successfully!");

    // Verify insertion
    const count = await Product.count();
    console.log(`📊 Total products now: ${count}`);
  } catch (error) {
    console.error("❌ Error seeding products:", error.message);
  } finally {
    process.exit(0);
  }
}

seedProducts();
