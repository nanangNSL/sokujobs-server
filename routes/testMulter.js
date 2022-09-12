const router = require("express").Router();
const { upload } = require("../middlewares/multerFirebase");

router.route("/").post(upload("test", "images", "file"), (req, res, next) => {
  try {
    res.json(req.file);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
