import validator from "validator";

import userModel from "../../models/userModel.js";

export const userStatusUpdate = async (req, res) => {
    try {
        const { userId } = req.params;

        if (typeof req.body !== 'object') {
            return res.status(400).json({
                message: "Invalid request body format.",
            })
        }

        const { status } = req.body;

        if (!validator.isMongoId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID format.",
            })
        }

        if (!status) {
            return res.status(400).json({
                message: "Status is required.",
            })
        }

        if (!['active', 'inactive', 'banned'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value.",
            })
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { status: status },
            { new: true, runValidators: true }
        ).lean();


        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found or status already set to the specified value.",
            })
        }

        return res.status(200).json({
            message: "User status updated successfully.",
            user: {
                _id: updatedUser._id,
                status: updatedUser.status,
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const { page } = req.params || 1;

        const matchStage = {}

        const users = await userModel.aggregate([
            { $match: matchStage },

            {
                $project: {
                    name: 1,
                    email: 1,
                    phone: 1,
                    status: 1,
                    address: 1,
                    dob: 1,
                    createdAt: 1,

                    profile: {
                        $cond: {
                            if: { $ifNull: ["$profile", false] },
                            then: {
                                $concat: [
                                    process.env.BACKEND,
                                    "/images/",
                                    "$profile"
                                ]
                            },
                            else: null
                        }
                    }
                }
            }
        ]);

        return res.status(200).json({
            users
        })


    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request."
        })
    }
}