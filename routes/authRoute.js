const router = require("express").Router();
const { auth } = require("../controllers");

router.route("/register").post(auth.register);
router.route("/login").post(auth.login);
router.route("/refresh-token").post(auth.refreshToken);

module.exports = router;
