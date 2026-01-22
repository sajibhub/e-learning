import validator from "validator";

import ShopCategory from "../../models/shopCategoryModel.js";


export const productCategoryCreate = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        message: "Category name is required and must be a non-empty string."
      });
    }

    // Check for existing category
    const existingCategory = await ShopCategory.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(409).json({
        message: "A category with this name already exists."
      });
    }

    // Create new category
    const newCategory = await ShopCategory.create({ name: name.trim() });

    return res.status(201).json({
      message: "Product category created successfully.",
      category: {
        _id: newCategory._id,
        name: newCategory.name,
        createdAt: newCategory.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing your request."
    });
  }
}

export const getAllProductCategories = async (req, res) => {
  try {
    const categories = await ShopCategory.find().sort({ createdAt: -1 }).select('_id name').lean();

    return res.status(200).json({
      message: "Product categories retrieved successfully.",
      categories
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing your request."
    });
  }
}

export const deleteProductCategory = async (req, res) => {
  const { id } = req.params;

  if (!validator.isMongoId(id)) {
    return res.status(400).json({ message: "Invalid category ID." });
  }

  try {
    const category = await ShopCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Product category not found."
      });
    }

    await ShopCategory.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Product category deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing your request."
    });
  }
}

export const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // ✅ Validate MongoDB ObjectId
    if (!validator.isMongoId(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    // ✅ Validate name
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required and must be a non-empty string.",
      });
    }

    const trimmedName = name.trim();

    // ✅ Check if category exists
    const category = await ShopCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Product category not found." });
    }

    // ✅ Check if another category has the same name
    const existingCategory = await ShopCategory.exists({
      name: trimmedName,
      _id: { $ne: id },
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "A category with this name already exists.",
      });
    }

    // ✅ Update category
    category.name = trimmedName;
    const updatedCategory = await category.save();

    return res.status(200).json({
      message: "Product category updated successfully.",
      category: {
        _id: updatedCategory._id,
        name: updatedCategory.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};
