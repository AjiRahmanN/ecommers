#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const { Product } = require("./models");

// Konfigurasi S3 (pakai region yang benar, tanpa "a")
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  region: process.env.AWS_REGION || "ap-southeast-2",
});

// Folder lokal tempat gambar
const IMG_DIR = path.join(__dirname, "img");

const productsData = [
  { name: "Black Wallet", description: "Premium black leather wallet...", price: 60.0, stock: 50, category: "Accessories", file: "photo-1.jpg" },
  { name: "iPhone Black", description: "Latest iPhone model...", price: 120.0, stock: 30, category: "Electronics", file: "photo-2.jpg" },
  { name: "Beer Can", description: "Premium craft beer...", price: 90.0, stock: 100, category: "Beverages", file: "photo-3.jpg" },
  { name: "Powder Tap", description: "High-quality makeup powder...", price: 190.0, stock: 25, category: "Beauty", file: "photo-4.jpg" },
  { name: "Aerosol", description: "Professional-grade aerosol spray...", price: 75.0, stock: 40, category: "Beauty", file: "photo-5.jpg" },
  { name: "Sun Glasses", description: "Stylish sunglasses...", price: 200.0, stock: 20, category: "Accessories", file: "photo-6.jpg" },
  { name: "Dark Shoes", description: "Elegant dark leather shoes...", price: 100.0, stock: 35, category: "Footwear", file: "photo-7.jpg" },
  { name: "Sport Shoes", description: "Comfortable sport shoes...", price: 40.0, stock: 60, category: "Footwear", file: "photo-8.jpg" },
  { name: "Lens", description: "Professional camera lens...", price: 54.0, stock: 45, category: "Electronics", file: "photo-9.jpg" },
  { name: "Woman Shoes", description: "Elegant women shoes...", price: 330.0, stock: 15, category: "Footwear", file: "photo-10.jpg" },
  { name: "Camera", description: "Professional digital camera...", price: 230.0, stock: 10, category: "Electronics", file: "photo-11.jpg" },
  { name: "White Phone", description: "Modern smartphone...", price: 180.0, stock: 25, category: "Electronics", file: "photo-12.jpg" },
];

async function uploadToS3(fileName) {
  const filePath = path.join(IMG_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File ${fileName} not found, skipping upload.`);
    return { imageUrl: null, imageKey: null };
  }

  const fileContent = fs.readFileSync(filePath);
  const s3Key = `products/${fileName}`;

  try {
    await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME, // perbaiki variabel
        Key: s3Key,
        Body: fileContent,
        // ACL: "public-read",
        ContentType: "image/jpeg",
      })
      .promise();

    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    console.log(`✅ Uploaded ${fileName} to S3`);
    return { imageUrl, imageKey: s3Key };
  } catch (error) {
    console.error(`❌ Error uploading ${fileName} to S3:`, error.message);
    return { imageUrl: null, imageKey: null };
  }
}

async function seedWithUploads() {
  try {
    console.log("🔄 Starting product seeding with image uploads...");
    await Product.destroy({ where: {} });
    console.log("🗑️  Cleared existing products");

    const productsWithUrls = [];
    for (const product of productsData) {
      const { imageUrl, imageKey } = await uploadToS3(product.file);
      productsWithUrls.push({
        ...product,
        imageUrl,
        imageKey,
        sellerId: 1,
        isActive: true,
      });
    }

    await Product.bulkCreate(productsWithUrls);
    console.log("✅ All products added successfully!");
    console.log(`📊 Total products in database: ${await Product.count()}`);
  } catch (error) {
    console.error("❌ Error seeding products:", error.message);
  } finally {
    process.exit(0);
  }
}

seedWithUploads();
