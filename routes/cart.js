const router = require("express").Router();
const signinRequire = require("../middlewares/signinRequire");
const Cart = require("../models/Cart");
const MakeCartItems = require("../utils/MakeCartItems");

router.post("/add-to-cart", signinRequire("user"), async (req, res, next) => {
  const cartItem = req.body.cartItem;
  const user = req.user._id;
  let cart;

  try {
    const userCartExist = await Cart.findOne({user});
    if (userCartExist) {
      const addedProduct = userCartExist.cartItems.find(
        (item) => item.product == cartItem.product
      );
      if (addedProduct) {
        const updateObj = {
          ...cartItem,
          quantity: {
            ...cartItem,
            quantity: addedProduct.quantity + cartItem.quantity,
          },
        };
        if (cartItem?.edit) {
          updateObj.quantity = cartItem.quantity;
        } else if (cartItem.minus) {
          updateObj.quantity = addedProduct.quantity - cartItem.quantity;
        } else {
          updateObj.quantity = addedProduct.quantity + cartItem.quantity;
        }
        cart = await Cart.findOneAndUpdate(
          {user, "cartItems.product": cartItem.product},
          {
            $set: {
              "cartItems.$": updateObj,
            },
          },
          {new: true}
        ).populate(
          "cartItems.product",
          "name price category createdBy description images reviews"
        );
      } else {
        cart = await Cart.findOneAndUpdate(
          {user},
          {
            $push: {
              cartItems: cartItem,
            },
          },
          {new: true}
        ).populate(
          "cartItems.product",
          "name price category createdBy description images reviews"
        );
      }
    } else {
      cart = await Cart.create({
        cartItems: [{...cartItem}],
        user: req.user._id,
      });
      cart = await Cart.findById(cart._id).populate(
        "cartItems.product",
        "name price category createdBy description images reviews"
      );
    }

    return res.json({
      success: true,
      cart: {
        user: cart.user,
        cartItems: MakeCartItems(cart?.cartItems),
      },
    });
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.get("/items", signinRequire("user"), async (req, res) => {
  try {
    const cart = await Cart.findOne({user: req.user._id}).populate(
      "cartItems.product",
      "name price category createdBy description images reviews"
    );
    return res.json({
      success: true,
      cart: {
        user: cart.user,
        cartItems: MakeCartItems(cart?.cartItems),
      },
    });
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.put("/:id", signinRequire("user"), async (req, res) => {
  try {
    const updated = await Cart.findOneAndUpdate(
      {user: req.user._id, "cartItems._id": req.params.id},
      {
        $pull: {cartItems: {_id: req.params.id}},
      },
      {new: true}
    ).populate(
      "cartItems.product",
      "name price category createdBy description images reviews"
    );
    return res.json({
      success: true,
      updated,
    });
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.delete("/", signinRequire("user"), async (req, res) => {
  try {
    const deleted = await Cart.findOneAndDelete({user: req.user._id});
    return res.json({
      success: true,
      deleted,
    });
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

module.exports = router;
