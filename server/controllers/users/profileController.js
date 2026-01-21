import validator from 'validator';
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';

import userModel from '../../models/userModel.js';
import ImageUpload from '../../utils/multer.js';

export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req;

        if (!validator.isMongoId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID format.",
            });
        }

        const user = await userModel.findById(userId).select('-password status -updatedAt').lean();
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        if (["inactive", "banned"].includes(user.status)) {
            res.clearCookie("accessTokenUser", { httpOnly: true, secure: true, sameSite: "none", path: "/" });
            res.clearCookie("refreshTokenUser", { httpOnly: true, secure: true, sameSite: "none", path: "/" });

            return res.status(403).json({
                message: `Your account is currently ${user.status}.`,
            });
        }

        return res.status(200).json({
            profile: { ...user, profile: user.profile ? process.env.BACKEND + "/images/" + user.profile : null },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        })
    }
}

export const userUpdateProfile = async (req, res) => {
    try {
        const { userId } = req;

        if (!validator.isMongoId(userId)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }

        ImageUpload().single("profileImage")(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: "Error uploading profile image." });
            }

            const { name, email, phone, password, oldPassword, dob, address } = req.body;

            // Require at least one field
            if (!name && !email && !phone && !password && !dob && !address && !req.file) {
                return res.status(400).json({ message: "You must provide at least one field to update." });
            }

            const updateData = {};

            // Manual field updates

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

                // Check if email exists in other accounts
                const existingEmail = await userModel.findOne({ email: email.trim(), _id: { $ne: userId } }).lean();
                if (existingEmail) {
                    return res.status(400).json({ message: "Email already in use." });
                }

                updateData.email = email.trim().toLowerCase();
            }

            // Phone
            if (phone) {
                const phoneData = splitPhoneNumber(phone);
                if (phoneData.error) {
                    return res.status(400).json({ message: "Invalid phone number." });
                }

                const existingPhone = await userModel.findOne({ phone: phoneData.mainNumber, _id: { $ne: userId } }).lean();
                if (existingPhone) {
                    return res.status(400).json({ message: "Phone number already in use." });
                }

                updateData.phone = phoneData.mainNumber;
            }

            if (password) {
                if (!oldPassword) {
                    return res.status(400).json({ message: "You must provide your old password to change it." });
                }

                const user = await userModel.findById(userId).select("password").lean();
                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                }

                const isOldMatch = await bcrypt.compare(oldPassword, user.password);
                if (!isOldMatch) {
                    return res.status(400).json({ message: "Old password is incorrect." });
                }

                updateData.password = await bcrypt.hash(password, 10);
            }


            // DOB
            if (dob) {
                if (!validator.isDate(dob)) {
                    return res.status(400).json({ message: "Invalid date of birth." });
                }
                const timestamp = new Date(dob).getTime();



                updateData.dob = new Date(timestamp).toISOString();
            }


            // Address
            if (address) {
                if (address.trim().length === 0) {
                    return res.status(400).json({ message: "Address cannot be empty." });
                }
                updateData.address = address.trim();
            }

            if (req.file?.filename) {
                const findUser = await userModel.findById(userId).select("profile").lean();
                if (findUser?.profile) {
                    const oldPath = path.join(process.cwd(), "images", findUser.profile);
                    try {
                        await fs.access(oldPath);
                        await fs.unlink(oldPath);
                    } catch (error) {
                    }
                }

                updateData.profile = req.file.filename;
            }

            // Update user
            const updatedUser = await userModel
                .findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
                .select("-password -updatedAt")
                .lean();

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }

            return res.status(200).json({
                message: "Profile updated successfully.",
                profile: {
                    ...updatedUser,
                    profile:  updatedUser.profile ? `${process.env.BACKEND}/images/${updatedUser.profile}` : null,
                },
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
};
