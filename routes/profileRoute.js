const router = require("express").Router();
const { upload } = require("../middlewares/multerFirebase");
const { profile, skills, workExp, portfolios, uploadPhoto } = require("../controllers");
const auth = require("../middlewares/authHandling");

router
  .route("/")
  .get(auth.userLogin, profile.getProfile)
  .patch(auth.userLogin, profile.updateProfile)
  .delete(auth.userLogin, profile.deleteProfile);
router
  .route("/skills")
  .get(auth.userLogin, auth.isCompany, skills.findByUser)
  .post(auth.userLogin, auth.isCompany, skills.createByUser);
router.route("/skills/:id").delete(auth.userLogin, auth.isCompany, skills.deleteByUser);
router
  .route("/work-exp")
  .get(auth.userLogin, auth.isCompany, workExp.findByUser)
  .post(auth.userLogin, auth.isCompany, workExp.createByUser);
router
  .route("/work-exp/:id")
  .patch(auth.userLogin, auth.isCompany, workExp.updateByUser)
  .delete(auth.userLogin, auth.isCompany, workExp.deleteByUser);
router
  .route("/portfolios")
  .get(auth.userLogin, auth.isCompany, portfolios.findByUser)
  .post(auth.userLogin, auth.isCompany, upload("portfolio_", "users/portfolios", "photo"), portfolios.createByUser);
router
  .route("/portfolios/:id")
  .patch(auth.userLogin, auth.isCompany, portfolios.updateByUser)
  .delete(auth.userLogin, auth.isCompany, portfolios.deleteByUser);
router
  .route("/photo")
  .post(auth.userLogin, upload("user_", "users", "photo"), uploadPhoto.postProfilePhoto)
  .delete(auth.userLogin, uploadPhoto.deleteProfilePhoto);

module.exports = router;
