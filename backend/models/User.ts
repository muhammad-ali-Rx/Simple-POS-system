import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    index: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["SUPER_ADMIN", "RESTAURANT_ADMIN", "CASHIER"],
    default: "CASHIER",
  },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", UserSchema);
