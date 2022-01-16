const Product = require("../models/Product");
const Category = require("../models/Category");
const upload = require("../utils/UploadWithMulter");
const signinRequire = require("../middlewares/signinRequire");
const WordsFirstLetterUC = require("../utils/WordsFirstLetterUC");
const ProductValidator = require("../validators/productValidator");
const ProductUpdateValidator = require("../validators/ProductUpdateValidator");
const ValidationResult = require("../utils/ValidationResult");
const SelectFirstError = require("../utils/SelectFirstError");
const router = require("express").Router();

router.post(
  "/create",
  signinRequire("admin"),
  upload.array("image"),
  ProductValidator,
  async (req, res, next) => {
    const errors = ValidationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        error: SelectFirstError(errors.mapped()),
      });
    }

    const {name, category, price, quantity, description, offer, reviews} =
      req.body;

    let productImages = [];

    if (req?.files?.length > 0) {
      productImages = req.files.map((file) => ({
        image: process.env.API + "/public/" + file.filename,
      }));
    }

    try {
      const productCategory = await Category.findById(category).select("name");
      const product = await Product.create({
        name: WordsFirstLetterUC(name),
        price: Number(price),
        quantity: Number(quantity),
        createdBy: req.user._id,
        images: productImages,
        category: productCategory,
        description,
        reviews,
        offer,
      });
      return res.json({success: true, product});
    } catch (error) {
      return res.json({success: false, error: error.message});
    }
  }
);

router.put(
  "/update/:id",
  signinRequire("admin"),
  upload.array("images"),
  ProductUpdateValidator,
  async (req, res, next) => {
    const errors = ValidationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        error: SelectFirstError(errors.mapped()),
      });
    }
    const {name, category, price, quantity, description, offer, reviews} =
      req.body;

    const updateInfo = {
      name: WordsFirstLetterUC(name),
      price: Number(price),
      quantity: Number(quantity),
      createdBy: req.user._id,
      category,
      description,
      reviews,
      offer,
    };

    if (req?.files?.length > 0) {
      updateInfo.images = req.files.map((file) => ({
        image: process.env.API + "/public/" + file.filename,
      }));
    }
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: updateInfo,
        },
        {new: true}
      ).populate("category", "name");
      return res.json({success: true, product});
    } catch (error) {
      return res.json({success: false, error: error.message});
    }
  }
);

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) throw new Error("Product not found!");
    return res.json({success: true, deleted});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.get("/category/:category", async (req, res, next) => {
  try {
    const products = await Product.find({
      category: req.params.category,
    }).populate("category", "name");
    return res.json({success: true, products});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.get("/bycategory/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug?.toLowerCase(),
    });
    const products = await Product.find({category: category._id});
    res.json({
      success: true,
      products,
      productsByRange: {
        under10k: products?.filter((p) => p.price <= 10000),
        under15k: products?.filter((p) => p.price > 10000 && p.price <= 15000),
        under20k: products?.filter((p) => p.price > 15000 && p.price <= 20000),
      },
    });
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.get("/products", async (req, res) => {
  try {
    const all = await Product.find().populate("category", "name");
    const products = {};
    for (let i = 0; i < all.length; i++) {
      const category = all[i].category.name.toLowerCase();
      if (products[category]) {
        if (products[category].length < 7) {
          products[category].push(all[i]);
        }
      } else {
        products[category] = [all[i]];
      }
    }
    return res.json({success: true, products});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new Error("Product not found!");
    return res.json({success: true, product});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    return res.json({success: true, products});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});
module.exports = router;

module.exports = router;
