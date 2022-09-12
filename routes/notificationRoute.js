const router = require("express").Router();
const { notifications } = require("../controllers");
const auth = require("../middlewares/authHandling");

router.route("/").get(auth.userLogin, notifications.findByUser).post(auth.userLogin, notifications.createByUser);
router.route("/:id").patch(auth.userLogin, notifications.updateByUser);

module.exports = router;
