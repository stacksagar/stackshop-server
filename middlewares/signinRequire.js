const jwt = require("jsonwebtoken");
const User = require("../models/User");
const signinRequire = (role) => async (req, res, next) => {
  const authorization = req.headers.authorization;

  try {
    if (!authorization) throw new Error("Unauthorized!");

    if (!authorization?.startsWith("Bearer")) throw new Error("Invalid Token");

    const token = authorization.split(" ")[1];

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-photo");

    if (!user) throw new Error("User Not Found!");

    if (user.role !== "admin") {
      if (role !== user.role) throw new Error(`${user.role} can't access!`);
    }

    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    return res.json({success: false, error: error.message});
  }
};

module.exports = signinRequire;
