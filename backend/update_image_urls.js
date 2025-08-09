// update_image_urls.js

require("dotenv").config();
const mysql = require("mysql2/promise");

async function updateImageUrls() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log("🔄 Updating product image URLs...");

    // Domain lama S3 dan domain baru CloudFront
    const oldDomain = "https://ecommers-bucket2.s3.ap-southeast-2.amazonaws.com";
    const newDomain = "https://d3nph03r15ew8.cloudfront.net";

    // Update semua URL di database
    const [result] = await connection.execute(
      `UPDATE products 
       SET imageUrl = REPLACE(imageUrl, ?, ?)`,
      [oldDomain, newDomain]
    );

    console.log(`✅ Updated ${result.affectedRows} rows.`);
  } catch (error) {
    console.error("❌ Error updating image URLs:", error);
  } finally {
    await connection.end();
  }
}

updateImageUrls();
