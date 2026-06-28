import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already exist"],
      required: [true, "Username cannot be empty"],
    },
    email: {
      type: String,
      unique: [true, "Account already exits with this email"],
      required: [true, "email cannot be empty"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password cannot be empty"],
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
