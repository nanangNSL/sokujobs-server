const router = require("express").Router();
const { skills } = require("../controllers");

router.route("/").get(skills.findAll).post(skills.create);
router.route("/:id").get(skills.findById).patch(skills.update).delete(skills.deleteOne);

module.exports = router;
