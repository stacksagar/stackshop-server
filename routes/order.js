const signinRequire = require("../middlewares/signinRequire");
const Order = require("../models/Order");

const router = require("express").Router();

router.post("/create", signinRequire("user"), (req, res) => {
  req.body.orderStatus = [
    {
      type: "ordered",
      date: new Date().toLocaleString().split(", "),
      isCompleted: true,
    },
    {
      type: "packed",
      date: new Date().toLocaleString().split(", "),
      isCompleted: false,
    },
    {
      type: "shipped",
      date: new Date().toLocaleString().split(", "),
      isCompleted: false,
    },
    {
      type: "delivered",
      date: new Date().toLocaleString().split(", "),
      isCompleted: false,
    },
  ];
  req.body.user = req.user._id;
  // const order = await Order.create(req.body);
  Order.create(req.body)
    .then((result) => {
      Order.findById(result._id)
        .populate("address", "name number address postcode")
        .populate("items.product", "name images price")
        .exec((error, order) => {
          if (error) return res.json({success: false, error: error.message});
          return res.json({success: true, order});
        });
    })
    .catch((error) => {
      return res.json({success: false, error: error.message});
    });
});

router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        "orderStatus.type": req.body.type,
      },
      {
        $set: {
          "orderStatus.$": {
            date: new Date().toLocaleString().split(", "),
            isCompleted: true,
            type: req.body.type,
          },
        },
      },
      {
        new: true,
      }
    );
    return res.json({success: true, updatedOrder});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.put("/peymentStatus/:orderID", async (req, res) => {
  const {peymentStatus} = req.body;
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: req.params.orderID,
      },
      {$set: {peymentStatus}},
      {new: true}
    );
    return res.json({success: true, updatedOrder});
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
});

router.get("/user", signinRequire("user"), (req, res) => {
  Order.find({user: req.user._id})
    .populate("address", "name number address postcode")
    .populate("items.product", "name images price")
    .exec((error, orders) => {
      if (error) return res.json({success: false, error: error.message});
      res.json({success: true, orders});
    });
});

router.get("/all", (req, res) => {
  Order.find()
    .populate("address", "address")
    .populate("items.product", "name")
    .exec((error, orders) => {
      if (error) return res.json({success: false, error: error.message});
      res.json({success: true, orders});
    });
});

router.get("/:id", (req, res) => {
  Order.findById(req.params.id)
    .populate("address", "name number address postcode")
    .populate("items.product", "name images price")
    .exec((error, order) => {
      if (error) return res.json({success: false, error: error.message});
      res.json({success: true, order});
    });
});

module.exports = router;
