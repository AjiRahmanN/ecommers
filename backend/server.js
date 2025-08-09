require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const checkoutRoutes = require("./routes/checkout");
const adminRoutes = require("./routes/admin");

const PORT = process.env.PORT || 3000;
const app = express();

// Configure CORS to allow requests from fronten
app.use(
  cors({
    origin: ["http://13.211.55.73", "http://localhost:3000", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(bodyParser.json());
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", checkoutRoutes);
app.use("/admin", adminRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to MySQL has been established successfully.");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(3000, "0.0.0.0", () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
