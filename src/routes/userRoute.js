import express from "express";
import { login, logout, register } from "../controllers/userController.js";
import { userValidateSchema, validateUser } from "../validators/userValidate.js";
import { verifyToken } from "../middlewares/tokenVerify.js";
import { hasToken } from "../middlewares/hasToken.js";

const userRoute = express.Router();

userRoute.post("/register", validateUser(userValidateSchema), register);
userRoute.get("/verify", verifyToken);
userRoute.post("/login", login);
userRoute.delete("/logout", hasToken, logout);
export default userRoute;