import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    provider: { type: String, default: "credentials" },
    image: String,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);