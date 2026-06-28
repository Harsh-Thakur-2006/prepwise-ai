import mongoose from "mongoose";

const blacklistTokensSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to be added in blacklist"],
    },
  },
  { timestamps: true },
);

export const BlacklistToken = mongoose.model(
  "BlacklistToken",
  blacklistTokensSchema,
);
