const express = require("express");
const multer = require("multer");
const { Product } = require("../models");
const s3Service = require("../services/s3Service");
const auth = require("../middleware/auth");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true },
      include: [
        {
          model: require("../models").User,
          as: "User",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // Generate signed URLs for images
    const productsWithUrls = await Promise.all(
      products.map(async (product) => {
        const productData = product.toJSON();
        if (productData.imageKey) {
          productData.imageUrl = await s3Service.getSignedUrl(productData.imageKey);
        }
        // Rename User to seller for frontend compatibility
        productData.seller = productData.User;
        delete productData.User;
        return productData;
      })
    );

    res.json(productsWithUrls);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: require("../models").User,
          as: "User",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productData = product.toJSON();
    if (productData.imageKey) {
      productData.imageUrl = await s3Service.getSignedUrl(productData.imageKey);
    }
    // Rename User to seller for frontend compatibility
    productData.seller = productData.User;
    delete productData.User;

    res.json(productData);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create product with image upload
router.post("/products", auth, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    let imageData = null;
    if (req.file) {
      const key = s3Service.generateKey("products", req.file.originalname);
      imageData = await s3Service.uploadFile(req.file, key);
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      sellerId: req.user.id,
      imageUrl: imageData?.url,
      imageKey: imageData?.key,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put("/products/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.sellerId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    let imageData = null;
    if (req.file) {
      // Delete old image if exists
      if (product.imageKey) {
        await s3Service.deleteFile(product.imageKey);
      }

      const key = s3Service.generateKey("products", req.file.originalname);
      imageData = await s3Service.uploadFile(req.file, key);
    }

    await product.update({
      ...req.body,
      imageUrl: imageData?.url || product.imageUrl,
      imageKey: imageData?.key || product.imageKey,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete("/products/:id", auth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.sellerId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete image from S3
    if (product.imageKey) {
      await s3Service.deleteFile(product.imageKey);
    }

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
