const router = require("express").Router();
const signupValidator = require("../validators/SignupValidator");
const signinValidator = require("../validators/SigninValidator");
const signinRequire = require("../middlewares/signinRequire");
const {signin, signup} = require("../controllers/auth");

router.post("/signup", signupValidator, signup());
router.post("/admin/signup", signupValidator, signup("admin"));

router.post("/signin", signinValidator, signin());
router.post("/admin/signin", signinValidator, signin("admin"));

router.get("/user", signinRequire("user"), async (req, res) => {
  res.json({user: req.user, token: req.token, success: true});
});

router.get("/admin/user", signinRequire("admin"), async (req, res) => {
  res.json({user: req.user, success: true});
});

module.exports = router;
