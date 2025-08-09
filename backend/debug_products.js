#!/usr/bin/env node
/**
 * Debug script untuk memeriksa data produk di database
 */

require("dotenv").config();
const { Product } = require("./models");

async function debugProducts() {
  try {
    console.log("🔍 Checking database connection...");

    // Test connection
    await Product.sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Check total products
    const totalCount = await Product.count();
    console.log(`📊 Total products in database: ${totalCount}`);

    // Check active products
    const activeCount = await Product.count({ where: { isActive: true } });
    console.log(`📊 Active products: ${activeCount}`);

    // Get first 5 products for inspection
    const products = await Product.findAll({
      limit: 5,
      attributes: ["id", "name", "price", "stock", "isActive", "category"],
    });

    console.log("\n📋 First 5 products:");
    products.forEach((product) => {
      console.log(`- ${product.name} | Price: $${product.price} | Stock: ${product.stock} | Active: ${product.isActive}`);
    });

    // Check if any products have isActive = false
    const inactiveCount = await Product.count({ where: { isActive: false } });
    console.log(`\n⚠️  Inactive products: ${inactiveCount}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit(0);
  }
}

debugProducts();
