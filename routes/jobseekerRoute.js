const router = require("express").Router();
const { users } = require("../controllers");
const auth = require("../middlewares/authHandling");

router.route("/").get(auth.userLogin, auth.isRecruiter, users.findAllByRecuiter);
router.route("/:id").get(auth.userLogin, auth.isRecruiter, users.findById);

module.exports = router;
