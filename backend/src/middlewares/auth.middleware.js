import jwt from "jsonwebtoken";
import { BlacklistToken } from "../models/blacklist.model.js";

export async function verifyUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    const blacklistedToken = await BlacklistToken.findOne({ token });

    if (blacklistedToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}
