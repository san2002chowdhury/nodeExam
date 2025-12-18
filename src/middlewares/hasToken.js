import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";
import userSchema from "../models/user.js";
import sessionSchema from "../models/session.js";

export const hasToken = async (req, res, next) => {
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
            const existing = await sessionSchema.findOne({ userId: id });
            if (!existing) {
              return res.status(401).json({
                success: false,
                message: "User has no session!",
              });
            }
            if (user.isLoggedIn === true) {
              req.userId = id;
              next();
            }
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
