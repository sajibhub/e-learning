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
    // Get query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // active | inactive | banned
    const search = req.query.search; // name search

    const skip = (page - 1) * limit;

    // Build match stage dynamically
    const matchStage = {};

    // Filter by status
    if (status) {
      matchStage.status = status;
    }

    // Search by name (case-insensitive)
    if (search) {
      matchStage.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          email: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }


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
      },

      // Sort newest first
      { $sort: { createdAt: -1 } },

      // Pagination
      { $skip: skip },
      { $limit: limit }
    ]);

    // Count total users (for frontend pagination)
    const totalUsers = await userModel.countDocuments(matchStage);

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request."
    });
  }
};
