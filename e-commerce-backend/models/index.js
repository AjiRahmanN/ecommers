const sequelize = require("../config/database");
const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");

// Define associations
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Product, { foreignKey: "sellerId" });
Product.belongsTo(User, { foreignKey: "sellerId" });

Order.belongsToMany(Product, { through: "OrderItems", foreignKey: "orderId" });
Product.belongsToMany(Order, { through: "OrderItems", foreignKey: "productId" });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
};
