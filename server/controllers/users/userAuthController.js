import validator from "validator";
import bcrypt from "bcrypt";

import userModel from "../../models/userModel.js";
import generateToken from "../../utils/jwt.js";
import { splitPhoneNumber } from "../../utils/phone.js";

export const userAccountCreate = async (req, res) => {
    try {
        if (typeof req.body !== 'object') {
            return res.status(400).json({
                message: "Invalid request body format.",
            });
        }
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "Name, email, phone, and password are required.",
            });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format.",
            });
        }

        if (name.length < 3 || name.length > 50) {
            return res.status(400).json({
                message: "Name must be between 3 and 50 characters long.",
            });
        }

        if (!validator.isMobilePhone(phone, 'any')) {
            return res.status(400).json({
                message: "Invalid phone number format.",
            });
        }

        const phoneNUmber = splitPhoneNumber(phone)

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long.",
            });
        }

        const ExistingUser = await userModel.findOne({ $or: [{ email }, { phone: phoneNUmber.mainNumber }] }).select("_id email phone").lean();
        if (ExistingUser) {
            if (ExistingUser.email === email) {
                return res.status(409).json({
                    message: "Email is already registered.",
                });
            }
            if (ExistingUser.phone === phoneNUmber.mainNumber) {
                return res.status(409).json({
                    message: "Phone number is already registered.",
                });
            }
        }

        const accountCreate = await userModel.create({
            name,
            email,
            phone: phoneNUmber.mainNumber,
            password: await bcrypt.hash(password, 10),
        })

        if (!accountCreate) {
            return res.status(500).json({
                message: "Failed to create account.",
            });
        }

        return res.status(201).json({
            message: "Account created successfully.",
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        })
    }
}

export const userLogin = async (req, res) => {
    try {
        if (typeof req.body !== 'object') {
            return res.status(400).json({
                message: "Invalid request body format.",
            });
        }
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required.",
            });
        }

        let query = {};

        // Check if username is email
        if (validator.isEmail(username)) {
            query.email = username.toLowerCase().trim();
        }
        else {
            const phoneData = splitPhoneNumber(username);

            if (phoneData.error) {
                return res.status(400).json({ message: "Invalid phone number." });
            }

            query.phone = phoneData.mainNumber;
        }

        const user = await userModel.findOne(query).select("_id password status").lean();
        if (!user) {
            return res.status(401).json({
                message: "This username is not registered.",
            });
        }

        if (["inactive", "banned"].includes(user.status)) {
            return res.status(403).json({
                message: `Your account is currently ${user.status}.`,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "The password you entered is incorrect."
            });
        }

        const tokens = [
            { name: "accessTokenUser", expiresIn: "10d", maxAgeMs: 10 * 24 * 60 * 60 * 1000 },
            { name: "refreshTokenUser", expiresIn: "30d", maxAgeMs: 30 * 24 * 60 * 60 * 1000 }
        ];

        await Promise.all(
            tokens.map(async ({ name, expiresIn, maxAgeMs }) => {
                const token = await generateToken(user._id, expiresIn);
                res.cookie(name, token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: maxAgeMs,
                    path: "/"
                });
            })
        );

        return res.status(200).json({
            message: "Login successful.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        })
    }
}

export const userLogout = async (req, res) => {
    try {
        const { userId } = req;

        if (!validator.isMongoId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID format.",
            });
        }

        const findUser = await userModel.findById(userId).select('_id').lean();
        if (!findUser) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        res.clearCookie("accessTokenUser", { httpOnly: true, secure: true, sameSite: "none", path: "/" });
        res.clearCookie("refreshTokenUser", { httpOnly: true, secure: true, sameSite: "none", path: "/" });

        return res.status(200).json({
            message: "Logout successful.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
}