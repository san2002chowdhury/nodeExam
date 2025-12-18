import dotenv from "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userSchema from "../models/user.js";
import sessionSchema from "../models/session.js";
import { verifyEmail } from "../emailVerify/verifyEmail.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await userSchema.findOne({ email: email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "User already registered!",
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userSchema.create({
                name,
                email,
                password: hashedPassword,
            });
            const token = jwt.sign({ id: user._id }, process.env.secretKey, {
                expiresIn: "10m",
            });
            verifyEmail(email, token);
            return res.status(201).json({
                success: true,
                message: "User registered successfully!",
                user,
                token,
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userSchema.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found!",
            });
        } else {
            const passwordCheck = await bcrypt.compare(password, user.password);
            if (!passwordCheck) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials!",
                });
            } else if (passwordCheck && user.isVerified === true) {
                await sessionSchema.findOneAndDelete({ userId: user._id });
                await sessionSchema.create({ userId: user._id });

                user.isLoggedIn = true;
                user.token = token;
                await user.save();

                const accessToken = jwt.sign({ id: user._id }, process.env.secretKey, {
                    expiresIn: "10d",
                });
                return res.status(200).json({
                    success: true,
                    message: "User logged in successfully!",
                    user,
                    accessToken,
                });
            }
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        const existing = await sessionSchema.findOne({ userId: req.userId });
        const user = await userSchema.findOne({ _id: req.userId });
        if (!existing) {
            return res.status(400).json({
                success: false,
                message: "User had no session!",
            });
        }
        user.isLoggedIn = false;
        await user.save();
        await sessionSchema.findOneAndDelete({ userId: req.userId });
        return res.status(200).json({
            success: false,
            message: "User logged out successfully!",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
