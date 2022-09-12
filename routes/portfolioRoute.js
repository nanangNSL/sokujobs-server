const router = require("express").Router();
const { portfolios } = require("../controllers");

router.route("/").get(portfolios.findAll).post(portfolios.create);
router.route("/:id").get(portfolios.findById).patch(portfolios.update).delete(portfolios.deleteOne);

module.exports = router;
