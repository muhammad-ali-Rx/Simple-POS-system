import mongoose from "mongoose";

const Schema = mongoose.Schema;

// --- Restaurant (Tenant) Schema ---
const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  logo: String,
  address: String,
  currency: { type: String, default: "$" },
  taxRate: { type: Number, default: 0.1 },
  plan: {
    type: String,
    enum: ["BASIC", "PRO", "ENTERPRISE"],
    default: "BASIC",
  },
  createdAt: { type: Date, default: Date.now },
});

// --- Category Schema ---
const CategorySchema = new Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    index: true,
  },
  name: { type: String, required: true },
});

// --- Item (Inventory) Schema ---
const ItemSchema = new Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    index: true,
  },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  stock: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
});

// --- Order Schema ---
const OrderSchema = new Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    index: true,
  },
  cashierId: String,
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  subtotal: Number,
  tax: Number,
  total: Number,
  status: {
    type: String,
    enum: ["PENDING", "PAID", "CANCELLED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
});

// --- User Schema ---
const UserSchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["SUPER_ADMIN", "RESTAURANT_ADMIN", "CASHIER"],
    default: "CASHIER",
  },
  password: { type: String, required: true }, // In production, this would be hashed
});

export const RestaurantModel = mongoose.model("Restaurant", RestaurantSchema);
export const CategoryModel = mongoose.model("Category", CategorySchema);
export const ItemModel = mongoose.model("Item", ItemSchema);
export const OrderModel = mongoose.model("Order", OrderSchema);
export const UserModel = mongoose.model("User", UserSchema);
