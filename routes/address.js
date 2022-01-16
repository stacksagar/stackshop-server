const signinRequire = require("../middlewares/signinRequire");
const {Address, UserAddress} = require("../models/Address");

const router = require("express").Router();

router.post("/create", signinRequire("user"), async (req, res) => {
  try {
    const address = await Address.create(req.body);
    let userAddress;
    const userExist = await UserAddress.findOne({user: req.user._id});
    if (userExist) {
      userAddress = await UserAddress.findOneAndUpdate(
        {user: req.user._id},
        {
          $push: {addresses: {address: address._id}},
        },
        {new: true}
      ).populate(
        "addresses.address",
        "name number address district alternate_number postcode addressType"
      );
    } else {
      userAddress = await UserAddress.create({
        user: req.user._id,
        addresses: [{address: address._id}],
      });
      userAddress = await UserAddress.findOne({user: req.user._id}).populate(
        "addresses.address",
        "name number address district alternate_number postcode addressType"
      );
    }
    return res.status(201).json({userAddress});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.get("/user", signinRequire("user"), async (req, res) => {
  try {
    const userAddress = await UserAddress.findOne({
      user: req.user._id,
    }).populate(
      "addresses.address",
      "name number address district alternate_number postcode addressType"
    );
    return res.json({success: true, userAddress});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.get("/:id", signinRequire("user"), async (req, res) => {
  try {
    const userAddress = await UserAddress.findById(req.params.id).populate(
      "addresses.address",
      "name number address district alternate_number postcode addressType"
    );
    return res.json({success: true, userAddress});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.delete("/:id", signinRequire("user"), async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);
    const userAddress = await UserAddress.findOneAndUpdate(
      {user: req.user._id},
      {
        $pull: {addresses: {address: deletedAddress._id}},
      },
      {new: true}
    ).populate(
      "addresses.address",
      "name number address district alternate_number postcode addressType"
    );

    return res.json({success: true, deletedAddress, userAddress});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.put("/:id", signinRequire("user"), async (req, res) => {
  try {
    await Address.findByIdAndUpdate(req.params.id, {
      $set: {
        ...req.body,
      },
    });
    const userAddress = await UserAddress.findOne({
      user: req.user._id,
    }).populate(
      "addresses.address",
      "name number address district alternate_number postcode addressType"
    );
    return res.status(201).json({userAddress});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

module.exports = router;
