const router = require("express").Router();
const { users } = require("../controllers");

router.route("/").get(users.findAll).post(users.create);
router.route("/:id").get(users.findById).patch(users.update).delete(users.deleteOne);

module.exports = router;
