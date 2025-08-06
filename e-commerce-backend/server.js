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

const app = express();
app.use(cors());
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
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
