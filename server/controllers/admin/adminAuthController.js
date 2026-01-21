import validator from "validator";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs/promises";

import adminModel from "../../models/adminModel.js";
import generateToken from "../../utils/jwt.js";
import ImageUpload from "../../utils/multer.js";

export const AdminLogin = async (req, res) => {
    try {

        if (typeof req.body !== 'object') {
            return res.status(400).json({
                message: "Invalid request body.",
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format.",
            });
        }

        const admin = await adminModel.findOne({ email }).select('_id password').lean();
        if (!admin) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const tokens = [
            { name: "accessTokenAdmin", expiresIn: "10d", maxAgeMs: 10 * 24 * 60 * 60 * 1000 },
            { name: "refreshTokenAdmin", expiresIn: "30d", maxAgeMs: 30 * 24 * 60 * 60 * 1000 }
        ];

        await Promise.all(
            tokens.map(async ({ name, expiresIn, maxAgeMs }) => {
                const token = await generateToken(admin._id, expiresIn);
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
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        })
    }
}

export const adminLogout = async (req, res) => {
    try {
        const { id } = req;

        if (!validator.isMongoId(id)) {
            return res.status(400).json({
                message: "Invalid user ID format.",
            });
        }

        const findUser = await adminModel.findById(id).select('_id').lean();
        if (!findUser) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        res.clearCookie("accessTokenAdmin", { httpOnly: true, secure: true, sameSite: "none", path: "/" });
        res.clearCookie("refreshTokenAdmin", { httpOnly: true, secure: true, sameSite: "none", path: "/" });

        return res.status(200).json({
            message: "Logout successful.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
}

export const getAdminProfile = async (req, res) => {
    try {
        const { id } = req;

        if (!validator.isMongoId(id)) {
            return res.status(400).json({
                message: "Invalid user ID format.",
            });
        }

        const admin = await adminModel.findById(id).select(' name email profile').lean();
        if (!admin) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        return res.status(200).json({
            profile: {
                ...admin,
                profile: admin.profile ? process.env.BACKEND + "/images/" + admin.profile : null
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
}

export const adminUpdateProfile = async (req, res) => {
    try {
        const { id } = req; // assume admin ID is in req.id

        ImageUpload().single("profileImage")(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: "Error uploading profile image." });
            }

            // Safe destructuring
            const { name, email, password, oldPassword } = req.body || {};
            const updateData = {};

            // Require at least one field
            if (!name && !email && !password && !req.file) {
                return res.status(400).json({ message: "You must provide at least one field to update." });
            }

            // Name
            if (name) {
                if (name.trim().length === 0) {
                    return res.status(400).json({ message: "Name cannot be empty." });
                }
                updateData.name = name.trim();
            }

            // Email
            if (email) {
                if (!validator.isEmail(email)) {
                    return res.status(400).json({ message: "Invalid email format." });
                }

                const existingEmail = await adminModel.findOne({ email: email.trim(), _id: { $ne: id } }).lean();
                if (existingEmail) {
                    return res.status(400).json({ message: "Email already in use." });
                }

                updateData.email = email.trim();
            }

            // Profile Image
            if (req.file) {
                const findAdmin = await adminModel.findById(id).select("profile").lean();
                if (findAdmin?.profile) {
                    const oldPath = path.join(process.cwd(), "images", findAdmin.profile);
                    try {
                        await fs.access(oldPath);
                        await fs.unlink(oldPath);
                    } catch (error) { }
                }

                updateData.profile = req.file.filename;
            }

            // Password
            if (password) {
                if (!oldPassword) {
                    return res.status(400).json({ message: "Old password is required to change password." });
                }

                // Find admin to verify old password
                const admin = await adminModel.findById(id).select("password").lean();
                if (!admin) {
                    return res.status(404).json({ message: "Admin not found." });
                }

                const isOldMatch = await bcrypt.compare(oldPassword, admin.password);
                if (!isOldMatch) {
                    return res.status(400).json({ message: "Old password is incorrect." });
                }

                updateData.password = await bcrypt.hash(password, 10);
            }

            // Update admin
            const updatedAdmin = await adminModel
                .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
                .select("name email profile")
                .lean();

            return res.status(200).json({
                message: "Profile updated successfully.",
                profile: {
                    ...updatedAdmin,
                    profile: updatedAdmin.profile ? process.env.BACKEND + "/images/" + updatedAdmin.profile : null,
                },
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while updating the profile." });
    }
};
