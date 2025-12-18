import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";
import userSchema from "../models/user.js";

export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Token not found!",
      });
    } else {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.secretKey, async (err, decoded) => {
        if (err) {
          if (err.message === "TokenExpiredError") {
            return res.status(400).json({
              success: false,
              message: "Token expired!",
            });
          }
          return res.status(400).json({
            success: false,
            message: "Token invalid!",
          });
        } else {
          const { id } = decoded;
          const user = await userSchema.findById(id);
          if (!user) {
            return res.status(401).json({
              success: false,
              message: "User not found!",
            });
          } else {
            user.isVerified = true;
            user.token = null;
            await user.save();
            return res.status(200).json({
              success: true,
              message: "User verified successfully!",
            });
          }
        }
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
