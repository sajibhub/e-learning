import validator from "validator";


import CourseCategory from "../../models/courseCategoryModel.js";
import CourseModel from "../../models/courseModel.js";


export const createCourse = async (req, res) => {
    try {
        if (typeof req.body != "object") {
            return res.status(400).json({
                message: "Invalid body format."
            })
        }

        const { title, link, details, price, category } = req.body;

        if (!title || !price || !category || !link || !details) {
            return res.status(400).json({
                message: "All fields are required."
            })
        }

        if (title.trim() === "" || details.trim() === "" || link.trim() === "") {
            return res.status(400).json({
                message: "Title, details, and link cannot be empty."
            })
        }

        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({
                message: "Price must be a non-negative number."
            })
        }

        if (title.length < 3) {
            return res.status(400).json({
                message: "Title must be at least 3 characters long."
            });
        }

        if (details.length < 10) {
            return res.status(400).json({
                message: "Details must be at least 10 characters long."
            });
        }

        if (!validator.isURL(link.trim())) {
            return res.status(400).json({
                message: "Invalid video link URL."
            });
        }

        if (!validator.isMongoId(category)) {
            return res.status(400).json({
                message: "Invalid category ID."
            });
        }

        const findCategory = await CourseCategory.findById(category).select("_id").lean();
        if (!findCategory) {
            return res.status(404).json({
                message: "Course category not found."
            });
        }

        const newCourse = await CourseModel.create({
            title: title.trim(),
            videoLink: link.trim(),
            courseDetails: details.trim(),
            coursePrice: Number(price),
            category: findCategory._id,
        })

        if (!newCourse) {
            return res.status(500).json({
                message: "Failed to create course."
            });
        }

        return res.status(201).json({
            message: "Course created successfully.",
            course: {
                _id: newCourse._id,
                title: newCourse.title,
                videoLink: newCourse.videoLink,
                courseDetails: newCourse.courseDetails,
                coursePrice: newCourse.coursePrice,
                category: newCourse.category,
                createdAt: newCourse.createdAt,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        })
    }
}

export const getAllCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;

        const skip = (page - 1) * limit;
        const query = {};

        if (category) {
            if (!validator.isMongoId(category)) {
                return res.status(400).json({
                    message: "Invalid category ID."
                });
            }
            query.category = category;
        }

        const totalCourses = await CourseModel.countDocuments();

        const totalPages = Math.ceil(totalCourses / limit);

        const courses = await CourseModel.find(query)
            .skip(skip)
            .limit(limit)
            .populate("category", "name _id")
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            courses,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request."
        });
    }
};

export const getCourseById = async (req, res) => {
    const { id } = req.params;

    if (!validator.isMongoId(id)) {
        return res.status(400).json({
            message: "Invalid course ID."
        });
    }

    try {
        const course = await CourseModel.findById(id)
            .populate("category", "name _id")
            .lean();

        if (!course) {
            return res.status(404).json({
                message: "Course not found."
            });
        }

        return res.status(200).json({
            course,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        })
    }
}

export const deleteCourse = async (req, res) => {
    const { id } = req.params;

    if (!validator.isMongoId(id)) {
        return res.status(400).json({
            message: "Invalid course ID."
        });
    }

    try {
        const course = await CourseModel.exists({ _id: id });

        if (!course) {
            return res.status(404).json({
                message: "Course not found."
            });
        }

        await CourseModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Course deleted successfully."
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        })
    }
}

export const updateCourse = async (req, res) => {
    const { id } = req.params;

    // Validate course ID
    if (!validator.isMongoId(id)) {
        return res.status(400).json({ message: "Invalid course ID." });
    }

    if (typeof req.body !== "object" || Array.isArray(req.body)) {
        return res.status(400).json({ message: "Invalid body format." });
    }

    const { title, link, details, price, category } = req.body;

    // Prepare an object to collect valid fields to update
    const updateData = {};

    // Validate each field individually
    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ message: "Title must be a non-empty string." });
        }
        updateData.title = title.trim();
    }

    if (link !== undefined) {
        if (typeof link !== "string" || link.trim() === "" || !validator.isURL(link.trim())) {
            return res.status(400).json({ message: "Link must be a valid URL." });
        }
        updateData.videoLink = link.trim();
    }

    if (details !== undefined) {
        if (typeof details !== "string" || details.trim() === "") {
            return res.status(400).json({ message: "Details must be a non-empty string." });
        }
        updateData.courseDetails = details.trim();
    }

    if (price !== undefined) {
        const numPrice = Number(price);
        if (isNaN(numPrice) || numPrice < 0) {
            return res.status(400).json({ message: "Price must be a number >= 0." });
        }
        updateData.coursePrice = numPrice;
    }

    if (category !== undefined) {
        if (!validator.isMongoId(category)) {
            return res.status(400).json({ message: "Category must be a valid ID." });
        }
        const foundCategory = await CourseCategory.findById(category);
        if (!foundCategory) {
            return res.status(404).json({ message: "Category not found." });
        }
        updateData.category = foundCategory._id;
    }

    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "You must provide at least one valid field to update." });
    }

    try {
        // Single DB call with validation
        const updatedCourse = await CourseModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found." });
        }

        return res.status(200).json({
            message: "Course updated successfully.",
            course: updatedCourse,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
            error: error.message,
        });
    }
};


