import validator from "validator";

import CourseCategory from "../../models/courseCategoryModel.js";


export const createCourseCategory = async (req, res) => {
    if (typeof req.body !== "object") {
        return res.status(400).json({ message: "Invalid request body" });
    }
    const { name } = req.body;

    try {
        if (!name?.trim()) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const exists = await CourseCategory.exists({ name: name.trim() });
        if (exists) {
            return res.status(409).json({ message: "Category already exists" });
        }

        const category = await CourseCategory.create({ name: name.trim() });

        return res.status(201).json({
            message: "Course category created successfully",
            category: {
                name: category.name,
                _id: category._id,
                createdAt: category.createdAt,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
};


export const getAllCourseCategories = async (req, res) => {
    try {
        const categories = await CourseCategory.find({}).sort({ createdAt: -1 }).select("name createdAt").lean();

        return res.status(200).json({
            categories,
        });
    } catch (err) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
}

export const deleteCourseCategory = async (req, res) => {
    const { id } = req.params;
    if (!validator.isMongoId(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }

    try {
        const category = await CourseCategory.exists({ _id: id });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await CourseCategory.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Course category deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
}

export const updateCourseCategory = async (req, res) => {
    const { id } = req.params;
    if (typeof req.body !== "object") {
        return res.status(400).json({ message: "Invalid request body" });
    }
    const { name } = req.body;

    if (!validator.isMongoId(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }

    try {
        const category = await CourseCategory.exists({ _id: id });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (!name?.trim()) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const exists = await CourseCategory.exists({ name: name.trim(), _id: { $ne: id } });
        if (exists) {
            return res.status(409).json({ message: "Category name already in use" });
        }

        const updatedCategory = await CourseCategory.findByIdAndUpdate(
            id,
            { $set: { name: name.trim() } },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({
            message: "Course category updated successfully",
            category: updatedCategory,
        });

    } catch (err) {
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
}

