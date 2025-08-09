const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const { decrypt } = require("../utils/crypto");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await User.findAll();
    let matchedUser = null;

    for (const user of users) {
      const decryptedEmail = await decrypt(user.email);
      if (decryptedEmail === email) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, matchedUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ message: "Login successful", userId: matchedUser.id, isAdmin: matchedUser.isAdmin });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
