const ValidationResult = require("../utils/ValidationResult");
const Category = require("../models/Category");
const CategoryValidator = require("../validators/categoryValidator");
const SelectFirstError = require("../utils/SelectFirstError");
const FirstLetterUC = require("../utils/FirstLetterUC");
const MakeCategoriesList = require("../utils/MakeCategoriesList");
const deleteCategory = require("../utils/MakeDeleteCategories");
const router = require("express").Router();
const UploadWithMulter = require("../utils/UploadWithMulter");
const Slugify = require("../utils/Slugify");

router.post(
  "/create",
  UploadWithMulter.single("image"),
  CategoryValidator,
  async (req, res, next) => {
    const {name, parent} = req.body;
    const errors = ValidationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        error: SelectFirstError(errors.mapped()),
      });
    }

    try {
      const new_cat = {
        name: FirstLetterUC(name),
        slug: Slugify(name),
        parent,
      };
      if (req.file) {
        new_cat.image = process.env.API + "/public/" + req.file?.filename;
      }
      const category = await Category.create(new_cat);
      res.json({success: true, category});
    } catch (error) {
      return res.json({success: false, error: error.message});
    }
  }
);

router.put(
  "/update",
  UploadWithMulter.single("image"),
  async (req, res, next) => {
    const {id, name, parent} = req.body;
    try {
      if (name?.length < 3) throw new Error("name must be at least 3 chars!");
      const new_cat = {name: FirstLetterUC(name), parent};
      if (req.file) {
        new_cat.image = process.env.API + "/public/" + req.file?.filename;
      }
      const updated_category = await Category.findByIdAndUpdate(id, new_cat, {
        new: true,
      });
      const categories = await Category.find();
      return res.json({
        success: true,
        categories: MakeCategoriesList(categories),
        category: updated_category,
      });
    } catch (error) {
      return res.json({success: false, error: error.message});
    }
  }
);

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const deleted = await deleteCategory(req.params.id);
    const categories = await Category.find({});
    return res.json({
      success: true,
      deleted,
      categories: MakeCategoriesList(categories),
    });
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.get("/all", async (req, res, next) => {
  try {
    const all_categories = await Category.find({}).populate("parent", "name");
    const categories = MakeCategoriesList(all_categories);
    res.json({success: true, categories});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.get("/one/:id", async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json({success: true, category});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

module.exports = router;
