import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  recommendationsReceived: [
    {
      propertyId: { type: String, required: true },
      recommendedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      recommendedAt: { type: Date, default: Date.now },
    },
  ],
});

export const UserModel = mongoose.model("User", UserSchema);
