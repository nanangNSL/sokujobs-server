const router = require("express").Router();
const { workExp } = require("../controllers");

router.route("/").get(workExp.findAll).post(workExp.create);
router.route("/:id").get(workExp.findById).patch(workExp.update).delete(workExp.deleteOne);

module.exports = router;
