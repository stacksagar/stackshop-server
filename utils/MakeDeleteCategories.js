const Category = require("../models/Category");

async function deleteCategory(id) {
  const deleted = await Category.findByIdAndDelete(id);
  deleteChildCategories(deleted._id);
  return deleted;
}

async function deleteChildCategories(parent) {
  const deleted = await Category.findOneAndDelete({parent});
  if (parent && deleted) {
    deleteChildCategories(deleted?._id);
    deleteChildCategories(parent);
  }
}

module.exports = deleteCategory;
