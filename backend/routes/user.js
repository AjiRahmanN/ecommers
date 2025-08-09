const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { encrypt, decrypt } = require("../utils/crypto");
const validator = require("validator");

const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, phone, creditCard, cvv, isAdmin } = req.body;

    // Validate email format
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }

    // Check if email already exists
    const existingUsers = await User.findAll();
    for (const user of existingUsers) {
      const decryptedEmail = await decrypt(user.email);
      if (decryptedEmail === email) {
        return res.status(400).json({ error: "Email already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name: await encrypt(name),
      email: await encrypt(email),
      password: hashedPassword,
      address: await encrypt(address || ""),
      phone: await encrypt(phone || ""),
      creditCard: await encrypt(creditCard || ""),
      cvv: await encrypt(cvv || ""),
      history: [],
      isAdmin: isAdmin || false,
    });

    res.status(201).json({ message: "User saved securely", userId: user.id });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message || "Registration failed" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      name: await decrypt(user.name),
      address: await decrypt(user.address),
      phone: await decrypt(user.phone),
      history: user.history,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;
